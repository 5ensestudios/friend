import { useState, useEffect, useRef } from "react";
import FileExplorer from "../components/desktop/FileExplorer";
import EmailModal from "../components/desktop/EmailModal";
import EmailNotificationPopup from "../components/desktop/EmailNotificationPopup";
import MusicPlayer from "../components/desktop/MusicPlayer";
import DinoGameModal from "../components/desktop/DinoGameModal";
import BrunsonGallery from "../components/desktop/BrunsonGallery";
import SummerGallery from "../components/desktop/SummerGallery";
import TrashGallery from "../components/desktop/TrashGallery";
import Notepad from "../components/desktop/Notepad";
import CaseDocument from "../components/desktop/CaseDocument";
import EvidenceFolder from "../components/desktop/EvidenceFolder";
import SuspectSelect from "../components/desktop/SuspectSelect";
import SceneView from "../components/dialouge/SceneView";
import ActIntro from "./ActIntro";
import Act3Prelude from "./Act3Prelude";
import IntroPrelude from "./IntroPrelude";
import { useDraggable } from "../hooks/useDraggable";
import { useSound } from "../hooks/useSound";
import { saveProgress } from "../firebase/progress";
import "../styles/pages/desktop.css";

const ACT3_AMBIENT_SRC = "/Friend SFX/Friend SFX - ambient act.mp3";
const ACT3_AMBIENT_VOLUME = 0.2;

const WISHLIST_DEFAULT_TEXT = `1.Ergonomic lumbar support pillow (current chair is killing my back)
2. Nespresso pods (Bulk, Dark Roast)
3. Noise-canceling headphones 
4. Blue-light blocking glasses
5. New running shoes (still haven't used the last ones, but maybe these will work)`;

const REDDIT_DRAFT_TEXT = `Title: 2016 overdose case (needs better title)

hey, i've been looking into a closed case from 2016 (ruled accidental overdose, but something doesn’t make sense).

I managed to get some of the digital files, but the main folder is totally corrupted. does anyone know a way to bypass a (idk)`;

const DESKTOP_MAILS = {
  firstDesktop: {
    id: "firstDesktop",
    from: "Pr0xy",
    subject: "Watch this",
    attachment: "1 File",
    lines: [
      "Hey, I managed to recover one of the files you sent. Watch it carefully though. The data is unstable, and I think the file could get corrupted again after a few viewings.",
      "",
      "It’s on your local drive now.",
    ],
  },
  afterIntro: {
    id: "afterIntro",
    from: "Pr0xy",
    subject: "Found more",
    attachment: "1 File",
    lines: [
      "I dug deeper and recovered more files. It’s crazy, these files are even more unstable than the first.",
      "",
      "You’re going to want to be really careful with this one. Use the note files you have there if you can.",
    ],
  },
  afterAct1: {
    id: "afterAct1",
    from: "Pr0xy",
    subject: "Good news",
    attachment: "1 File",
    lines: [
      "It’s your lucky day. I’ve managed to pull some data from this folder. Though I can see that the files are being corrupted in real time?",
      "",
      "Goodluck, I guess.",
    ],
  },
  afterAct2: {
    id: "afterAct2",
    from: "Pr0xy",
    subject: "URGENT!!",
    attachment: "2 Files",
    lines: [
      "The bit rot is aggressively eating what's left of everything. I’ve managed to crack the final folder, but it is the most turbulent file yet. The data is practically tearing itself apart.",
      "",
      "Once you open this, this entire system is going to flatline permanently. There’s no re-watching on this one at all.",
      "",
      "I'm also sending something else. I got into the archive and pulled ACTUAL evidence logs before it wiped. They’re attached below.",
      "",
      "Do NOT open the final file until you've checked them.",
    ],
  },
};

const STATIC_INBOX_MAILS = [
  {
    id: "static_detective_reply",
    from: "Me",
    subject: "Corrupted files",
    attachment: "1 File",
    previewMeta: { label: "To", value: "pr0xy@securemail.net" },
    lines: [
      "Hi,",
      "",
      "I found your contact info on a forum. I'm trying to look into an old case from March 2016 that the police closed as an accident.",
      "",
      "I managed to get some of the digital files from an investigation archive, but the folders seems to be corrupted. It keeps throwing errors every time I try to open it. These IT people I talked to told me ‘too bad’ and said they can't do anything about it, but I’m pretty sure the data is still there and just needs to be fixed.",
      "",
      "I’m not sure what’s inside but the folder is named ‘#2016-0307-CHRIS Footage’",
      "",
      "If I send you what I have, can you see if you can fix it and get the files to open? Just let me know what you'd charge for it.",
      "",
      "Thanks."
    ],
  },
  {
    id: "static_proxy_reply",
    from: "Pr0xy",
    subject: "Re: Corrupted files",
    attachment: "None",
    previewMeta: { label: "From", value: "pr0xy@securemail.net" },
    lines: [
      "I took a look at the data in the attachment you sent.",
      "",
      "Your IT people weren't lying to you, but they weren't being helpful either. The files aren't broken; they’re suffering from severe bit rot. It’s like trying to read a book that’s been sitting in a puddle for ten years. Most people wouldn't bother.",
      "",
      "Lucky for you, I’m not most people. I can stabilize this, but it’s going to take time. I’ll start with the first file.",
      "",
      "Don't worry about the price yet. Let's see if there’s actually anything worth watching in there first.",
      "",
      "Stand by.",
    ],
  },
  {
    id: "static_proxy_followup",
    from: "Me",
    subject: "Re: Corrupted files",
    attachment: "None",
    previewMeta: { label: "To", value: "pr0xy@securemail.net" },
    lines: [
      "That’s fine, just let me know.",
      "",
      "Honestly, I’ve been staring at that error message for weeks, so anything you can pull out of there is better than what I have now. ",
      "",
      "Thank you so much for helping me with this, seriously. Just send over whatever you manage to recover. ",
      "",
      "I’ll be around.",
    ],
  },
];

const DESKTOP_MAIL_ORDER = [
  "firstDesktop",
  "afterIntro",
  "afterAct1",
  "afterAct2",
];

function getNextDesktopMail(progress) {
  const actsCompleted = progress?.acts_completed || [];
  const seen = progress?.desktop_mail_seen || {};

  if (!seen.firstDesktop && !actsCompleted.includes(0)) {
    return DESKTOP_MAILS.firstDesktop;
  }
  if (!seen.afterIntro && actsCompleted.includes(0)) {
    return DESKTOP_MAILS.afterIntro;
  }
  if (!seen.afterAct1 && actsCompleted.includes(1)) {
    return DESKTOP_MAILS.afterAct1;
  }
  if (!seen.afterAct2 && actsCompleted.includes(2)) {
    return DESKTOP_MAILS.afterAct2;
  }

  return null;
}

function getSeenDesktopMails(progress) {
  const actsCompleted = progress?.acts_completed || [];
  const unlockedIds = ["firstDesktop"];

  if (actsCompleted.includes(0)) unlockedIds.push("afterIntro");
  if (actsCompleted.includes(1)) unlockedIds.push("afterAct1");
  if (actsCompleted.includes(2)) unlockedIds.push("afterAct2");

  const unlockedProgressMails = DESKTOP_MAIL_ORDER
    .filter(mailId => unlockedIds.includes(mailId) && DESKTOP_MAILS[mailId])
    .map(mailId => DESKTOP_MAILS[mailId]);

  return [...STATIC_INBOX_MAILS, ...unlockedProgressMails];
}

export default function DesktopInterface({ playerData, authUserId, onReturnToMenu, onAct3Start, onShutdownToMenu }) {
  const [view, setView] = useState("desktop"); // 'desktop', 'act-intro', or 'scene'
  const [currentAct, setCurrentAct] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { play } = useSound();
  // Track which acts have already seen the intro in this session
  const [seenActIntro, setSeenActIntro] = useState(() => ({}));
  const [playerProgress, setPlayerProgress] = useState(() => ({
    ...playerData.progress,
    desktop_mail_seen: playerData.progress?.desktop_mail_seen || {},
  }));
  const [openWindows, setOpenWindows] = useState([]); // ['files', 'notes', 'evidence']
  const [activeWindow, setActiveWindow] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [showSuspectSelect, setShowSuspectSelect] = useState(false);
  const [mailNotification, setMailNotification] = useState(null);
  const [mailInboxActiveId, setMailInboxActiveId] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [desktopVolume, setDesktopVolume] = useState(74);
  const [bgmVolume] = useState(0.1);
  const [evidenceVisible, setEvidenceVisible] = useState(
    playerData.progress.acts_completed.includes(2)
  );
  const [caseDocumentKey, setCaseDocumentKey] = useState(0);

  const filesDrag = useDraggable({ x: 60, y: 40 });
  const notesDrag = useDraggable({ x: 120, y: 80 });
  const evidenceDrag = useDraggable({ x: 90, y: 60 });
  const brunsonDrag = useDraggable({ x: 180, y: 70 });
  const summerDrag = useDraggable({ x: 210, y: 95 });
  const trashDrag = useDraggable({ x: 78, y: 210 });
  const redditDraftDrag = useDraggable({ x: 138, y: 150 });
  const musicDrag = useDraggable({ x: 230, y: 120 });
  const dinoDrag = useDraggable({ x: 190, y: 90 });
  const bgMusicRef = useRef(null);
  const bgResumeHandlerRef = useRef(null);
  const act3MusicRef = useRef(null);
  const act3ResumeHandlerRef = useRef(null);
  const volumePopupRef = useRef(null);
  const lastDesktopHoverRef = useRef(0);

  const desktopHover = () => {
    const now = Date.now();
    if (now - lastDesktopHoverRef.current < 150) return;
    lastDesktopHoverRef.current = now;
    play("scene_hover");
  };
  

  function clearResumeHandler() {
    if (bgResumeHandlerRef.current) {
      window.removeEventListener("click", bgResumeHandlerRef.current);
      bgResumeHandlerRef.current = null;
    }
  }

  function destroyDesktopAmbient() {
    const audio = bgMusicRef.current;
    if (!audio) return;
    audio.pause(); // Only pause, do not null or destroy
  }

  function clearAct3ResumeHandler() {
    if (act3ResumeHandlerRef.current) {
      window.removeEventListener("click", act3ResumeHandlerRef.current);
      act3ResumeHandlerRef.current = null;
    }
  }

  function destroyAct3Ambient() {
    const audio = act3MusicRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    audio.src = "";
    audio.load();
    act3MusicRef.current = null;
  }

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view !== "desktop" || showSuspectSelect) {
      clearResumeHandler();
      destroyDesktopAmbient();
      return;
    }

    let audio = bgMusicRef.current || window.__friendDesktopAmbient;
    if (!audio) {
      audio = new Audio("/Friend SFX/The Friend SFX - Desktop Bgm.mp3");
      audio.loop = true;
      bgMusicRef.current = audio;
      window.__friendDesktopAmbient = audio;
    }

    audio.volume = bgmVolume;
    if (audio.paused) {
      audio.play().catch(() => {
        clearResumeHandler();
        const resume = () => {
          if (bgMusicRef.current !== audio) return;
          audio.play();
          window.removeEventListener("click", resume);
          bgResumeHandlerRef.current = null;
        };
        bgResumeHandlerRef.current = resume;
        window.addEventListener("click", resume);
      });
    }

    return () => {
      clearResumeHandler();
    };
  }, [view, showSuspectSelect, bgmVolume]);

  useEffect(() => {
    const shouldPlayAct3Ambient =
      currentAct === 3 && (view === "act-intro" || showSuspectSelect);

    if (!shouldPlayAct3Ambient) {
      clearAct3ResumeHandler();
      destroyAct3Ambient();
      return;
    }

    let audio = act3MusicRef.current;
    if (!audio) {
      audio = new Audio(ACT3_AMBIENT_SRC);
      audio.loop = true;
      act3MusicRef.current = audio;
    }

    audio.volume = ACT3_AMBIENT_VOLUME;
    audio.play().catch(() => {
      clearAct3ResumeHandler();
      const resume = () => {
        if (act3MusicRef.current !== audio) return;
        audio.play().catch(() => {});
        window.removeEventListener("click", resume);
        act3ResumeHandlerRef.current = null;
      };
      act3ResumeHandlerRef.current = resume;
      window.addEventListener("click", resume);
    });

    return () => {
      clearAct3ResumeHandler();
    };
  }, [currentAct, view, showSuspectSelect]);

  useEffect(() => {
    return () => {
      clearResumeHandler();
      destroyDesktopAmbient();
      clearAct3ResumeHandler();
      destroyAct3Ambient();
    };
  }, []);
  useEffect(() => {
    function handleOutsideClick(event) {
      if (!showVolumePopup) return;
      if (volumePopupRef.current && !volumePopupRef.current.contains(event.target)) {
        setShowVolumePopup(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showVolumePopup]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        play("click_desktop");
        setShowStartMenu(prev => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showStartMenu]);

  function persistProgress(nextProgress) {
    setPlayerProgress(nextProgress);
    const updatedData = {
      ...playerData,
      current_act: nextProgress.current_act,
      acts_completed: nextProgress.acts_completed,
      scenes_visited: nextProgress.scenes_visited,
      locked_scenes: nextProgress.locked_scenes,
      desktop_mail_seen: nextProgress.desktop_mail_seen,
      progress: nextProgress,
    };

    // Save in the background so gameplay stays responsive.
    saveProgress(playerData.id, updatedData).catch(() => {});
  }

  function markMailAsSeen(mailId) {
    const seen = {
      ...(playerProgress.desktop_mail_seen || {}),
      [mailId]: true,
    };

    persistProgress({
      ...playerProgress,
      desktop_mail_seen: seen,
    });
  }

  useEffect(() => {
    if (view !== "desktop") return;

    const nextMail = getNextDesktopMail(playerProgress);
    if (!nextMail) return;

    const delay = nextMail.id === "firstDesktop" ? 3000 : 800;
    const timer = setTimeout(() => {
      setMailNotification(nextMail);
      markMailAsSeen(nextMail.id);
    }, delay);

    return () => clearTimeout(timer);
  }, [view]);

  function handleActSelect(actNumber, questionIndex = null) {
    // Prevent replaying completed acts
    if (playerProgress.acts_completed.includes(actNumber)) {
      return;
    }

    setCurrentAct(actNumber);
    setCurrentQuestion(typeof questionIndex === "number" ? questionIndex : null);

    // Act 3 should always play the slideshow prelude before suspect selection.
    if (actNumber === 3) {
      setShowSuspectSelect(false);
      setView("act-intro");
      return;
    }

    // Act 1/2 question folders already have per-question title screens in SceneView.
    // Skip the legacy act-intro page to avoid duplicate intros.
    if (typeof questionIndex === "number" && (actNumber === 1 || actNumber === 2)) {
      setView("scene");
      return;
    }

    // Only show ActIntro if no scenes have been played yet in this act
    const actKey = `act${actNumber}`;
    const actScenes = playerProgress?.scenes_visited?.[actKey];
    const hasPlayedScene = actScenes && (
      (Array.isArray(actScenes.introCompleted) && actScenes.introCompleted.length > 0) ||
      (Array.isArray(actScenes.completedQuestions) && actScenes.completedQuestions.length > 0)
    );
    if (!hasPlayedScene) {
      setView("act-intro");
    } else {
      if (actNumber === 3) {
        setShowSuspectSelect(true);
        setView("desktop");
      } else {
        setView("scene");
      }
    }
  }

  function handleActIntroDone() {
    setSeenActIntro(prev => ({ ...prev, [currentAct]: true }));
    if (currentAct === 3) {
      setShowSuspectSelect(true);
      setView("desktop");
    } else {
      setView("scene");
    }
  }

  function handleSuspectChosen(suspectId) {
    setShowSuspectSelect(false);
    onAct3Start(suspectId);
  }

  function handleCloseScene() {
    setView("desktop");
    setCurrentAct(null);
    setCurrentQuestion(null);
  }

  function handleQuestionComplete(actNumber, questionIndex, completedQuestions) {
    const actKey = `act${actNumber}`;
    const previousAct = playerProgress.scenes_visited?.[actKey] || {};
    const updatedCompleted = Array.isArray(completedQuestions)
      ? completedQuestions
      : Array.from(new Set([...(previousAct.completedQuestions || []), questionIndex]));

    const newProgress = {
      ...playerProgress,
      scenes_visited: {
        ...playerProgress.scenes_visited,
        [actKey]: {
          ...previousAct,
          completedQuestions: updatedCompleted,
        },
      },
    };

    persistProgress(newProgress);
    handleCloseScene();
  }

  function handleActComplete(actNumber) {
    const completedActs = playerProgress.acts_completed.includes(actNumber)
      ? playerProgress.acts_completed
      : [...playerProgress.acts_completed, actNumber];

    const newProgress = {
      ...playerProgress,
      current_act: Math.max(playerProgress.current_act, actNumber + 1),
      acts_completed: completedActs,
    };

    persistProgress(newProgress);
    handleCloseScene();

    // After Act 2, reveal the evidence folder and show the mail with the evidence preview.
    if (actNumber === 2) {
      setTimeout(() => {
        setEvidenceVisible(true);
      }, 5000);
    }
  }

  function handleProgressUpdate(partialProgress) {
    const newProgress = {
      ...playerProgress,
      ...partialProgress,
      scenes_visited: {
        ...playerProgress.scenes_visited,
        ...(partialProgress.scenes_visited || {}),
      },
    };

    persistProgress(newProgress);
  }

  function handleOpenMail() {
    const seenMails = getSeenDesktopMails(playerProgress);
    if (!seenMails.length) return;

    setMailNotification(null);
    setMailInboxActiveId(seenMails[seenMails.length - 1].id);
    openWindow("mail");
  }

  function openWindow(windowId) {
    if (windowId === "casedoc") {
      setCaseDocumentKey(prev => prev + 1);
    }

    if (!openWindows.includes(windowId)) {
      setOpenWindows(prev => [...prev, windowId]);
    }
    setActiveWindow(windowId);
  }

  function closeWindow(windowId) {
    setOpenWindows(prev => prev.filter(w => w !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  }

  function focusWindow(windowId) {
    setActiveWindow(windowId);
  }


  if (view === "act-intro") {
    if (currentAct === 0) {
      return <IntroPrelude onDone={handleActIntroDone} />;
    }

    if (currentAct === 3) {
      return <Act3Prelude onDone={handleActIntroDone} />;
    }

    return <ActIntro actNumber={currentAct} onDone={handleActIntroDone} />;
  }

  if (view === "scene") {
    return (
      <SceneView
        actNumber={currentAct}
        questionIndex={currentQuestion}
        playerProgress={playerProgress}
        onClose={handleCloseScene}
        onActComplete={handleActComplete}
        onQuestionComplete={handleQuestionComplete}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  return (
    <div className="desktop-interface">
      {/* Desktop wallpaper */}
      <div className="desktop-wallpaper">
        <div className="wallpaper-noise"></div>
      </div>

      {/* Desktop icons */}
      <div className="desktop-icons">
        <button
          className="desktop-icon"
          style={{ left: "clamp(64px, 5vw, 96px)", top: "clamp(36px, 7vh, 64px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("files");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("files");
          }}
        >
          <div className="desktop-icon-img">
            <img src="/icons/Folder.png" alt="Case Files" />
          </div>
          <span className="desktop-icon-label">#2016-0307-CHRIS Footage</span>
        </button>

        <button
          className="desktop-icon"
          style={{ left: "clamp(224px, 16vw, 320px)", top: "clamp(36px, 7vh, 64px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("casedoc");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("casedoc");
          }}
        >
          <div className="desktop-icon-img">
            <img src="/icons/Document.png" alt="Case File" />
          </div>
          <span className="desktop-icon-label">#2016-0307-CHRIS Case File.pdf</span>
        </button>

        <button
          className="desktop-icon"
          style={{ left: "clamp(64px, 5vw, 96px)", top: "clamp(184px, 29vh, 300px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("notes");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("notes");
          }}
        >
          <div className="desktop-icon-img">
            <img src="/icons/Notes.png" alt="Case Notes" />
          </div>
          <span className="desktop-icon-label">Case Notes.txt</span>
        </button>

        {evidenceVisible && (
          <button
            className="desktop-icon"
            style={{ left: "clamp(64px, 5vw, 96px)", top: "clamp(320px, 47vh, 468px)" }}
            onMouseEnter={desktopHover}
            onDoubleClick={() => {
              play("click_desktop");
              openWindow("evidence");
            }}
            onClick={() => {
              play("click_desktop");
              openWindow("evidence");
            }}
          >
            <div className="desktop-icon-img">
              <img src="/icons/Lock.png" alt="Evidence" />
            </div>
            <span className="desktop-icon-label">Evidence</span>
          </button>
        )}

        <button
          className="desktop-icon"
          style={{ left: "clamp(64px, 5vw, 96px)", top: "clamp(440px, 63vh, 640px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("trash");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("trash");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Bin.png" alt="Trash" />
          </div>
          <span className="desktop-icon-label">Trash</span>
        </button>

        <button
          className="desktop-icon"
          style={{ right: "clamp(360px, 28vw, 452px)", top: "clamp(36px, 7vh, 64px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("wishlist");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("wishlist");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Notes.png" alt="Wishlist" />
          </div>
          <span className="desktop-icon-label">Wishlist.txt</span>
        </button>

        <button
          className="desktop-icon"
          style={{ right: "clamp(212px, 16vw, 304px)", top: "clamp(36px, 7vh, 64px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("brunson");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("brunson");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Folder.png" alt="Brunson" />
          </div>
          <span className="desktop-icon-label">Brunson</span>
        </button>

        <button
          className="desktop-icon"
          style={{ right: "clamp(64px, 5vw, 156px)", top: "clamp(36px, 7vh, 64px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("summer");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("summer");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Folder.png" alt="Summer 2021" />
          </div>
          <span className="desktop-icon-label">Summer 2021</span>
        </button>

        <button
          className="desktop-icon desktop-icon--round"
          style={{ right: "clamp(212px, 16vw, 304px)", top: "clamp(184px, 29vh, 300px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            handleOpenMail();
          }}
          onClick={() => {
            play("click_desktop");
            handleOpenMail();
          }}    
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Mail.png" alt="Mail" />
          </div>
          <span className="desktop-icon-label">Mail</span>
        </button>

        <button
          className="desktop-icon desktop-icon--round"
          style={{ right: "clamp(64px, 5vw, 156px)", top: "clamp(184px, 29vh, 300px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("music");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("music");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Music Player.png" alt="Music Player" />
          </div>
          <span className="desktop-icon-label">Music Player</span>
        </button>

        <button
          className="desktop-icon"
          style={{ right: "clamp(64px, 5vw, 156px)", top: "clamp(320px, 47vh, 468px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("redditDraft");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("redditDraft");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Notes.png" alt="Reddit Draft" />
          </div>
          <span className="desktop-icon-label">Reddit Draft.txt</span>
        </button>

        <button
          className="desktop-icon"
          style={{ right: "clamp(212px, 16vw, 304px)", top: "clamp(320px, 47vh, 468px)" }}
          onMouseEnter={desktopHover}
          onDoubleClick={() => {
            play("click_desktop");
            openWindow("dino");
          }}
          onClick={() => {
            play("click_desktop");
            openWindow("dino");
          }}
          type="button"
        >
          <div className="desktop-icon-img">
            <img src="/icons/Browser.png" alt="Browser" />
          </div>
          <span className="desktop-icon-label">SurfNet</span>
        </button>
      </div>

      {/* Windows */}
      {openWindows.includes("files") && (
        <div
          className={`desktop-window ${activeWindow === "files" ? "active" : ""}`}
          onClick={() => focusWindow("files")}
          style={{
            zIndex: activeWindow === "files" ? 200 : 100,
            transform: `translate(${filesDrag.pos.x}px, ${filesDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <FileExplorer
            playerProgress={playerProgress}
            onActSelect={handleActSelect}
            onReturnToMenu={onReturnToMenu}
            onClose={() => closeWindow("files")}
            onDragMouseDown={filesDrag.onMouseDown}
          />
        </div>
      )}

      {openWindows.includes("notes") && (
        <div
          className={`desktop-window desktop-window--notes ${activeWindow === "notes" ? "active" : ""}`}
          onClick={() => focusWindow("notes")}
          style={{
            zIndex: activeWindow === "notes" ? 200 : 100,
            transform: `translate(${notesDrag.pos.x}px, ${notesDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Notepad
            onClose={() => closeWindow("notes")}
            onDragMouseDown={notesDrag.onMouseDown}
            storageKey={`friEND_notes_${authUserId ?? "guest"}`}
          />
        </div>
      )}

      {openWindows.includes("wishlist") && (
        <div
          className={`desktop-window desktop-window--notes ${activeWindow === "wishlist" ? "active" : ""}`}
          onClick={() => focusWindow("wishlist")}
          style={{
            zIndex: activeWindow === "wishlist" ? 200 : 100,
            transform: `translate(${notesDrag.pos.x}px, ${notesDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Notepad
            onClose={() => closeWindow("wishlist")}
            onDragMouseDown={notesDrag.onMouseDown}
            title="Wishlist"
            iconSrc="/icons/Notes.png"
            storageKey={`friEND_wishlist_${authUserId ?? "guest"}`}
            initialText={WISHLIST_DEFAULT_TEXT}
            placeholder=""
          />
        </div>
      )}

      {openWindows.includes("redditDraft") && (
        <div
          className={`desktop-window desktop-window--notes ${activeWindow === "redditDraft" ? "active" : ""}`}
          onClick={() => focusWindow("redditDraft")}
          style={{
            zIndex: activeWindow === "redditDraft" ? 200 : 100,
            transform: `translate(${redditDraftDrag.pos.x}px, ${redditDraftDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Notepad
            onClose={() => closeWindow("redditDraft")}
            onDragMouseDown={redditDraftDrag.onMouseDown}
            title="Reddit Draft"
            iconSrc="/icons/Notes.png"
            storageKey={`friEND_reddit_draft_${authUserId ?? "guest"}`}
            initialText={REDDIT_DRAFT_TEXT}
            placeholder=""
          />
        </div>
      )}

      {openWindows.includes("casedoc") && (
        <CaseDocument key={caseDocumentKey} onClose={() => closeWindow("casedoc")} />
      )}

      {openWindows.includes("evidence") && (
        <div
          className={`desktop-window ${activeWindow === "evidence" ? "active" : ""}`}
          onClick={() => focusWindow("evidence")}
          style={{
            zIndex: activeWindow === "evidence" ? 200 : 100,
            transform: `translate(${evidenceDrag.pos.x}px, ${evidenceDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <EvidenceFolder
            onClose={() => closeWindow("evidence")}
            onDragMouseDown={evidenceDrag.onMouseDown}
          />
        </div>
      )}

      {openWindows.includes("brunson") && (
        <div
          className={`desktop-window desktop-window--brunson ${activeWindow === "brunson" ? "active" : ""}`}
          onClick={() => focusWindow("brunson")}
          style={{
            zIndex: activeWindow === "brunson" ? 200 : 100,
            transform: `translate(${brunsonDrag.pos.x}px, ${brunsonDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <BrunsonGallery
            onClose={() => closeWindow("brunson")}
            onDragMouseDown={brunsonDrag.onMouseDown}
          />
        </div>
      )}

      {openWindows.includes("summer") && (
        <div
          className={`desktop-window desktop-window--brunson ${activeWindow === "summer" ? "active" : ""}`}
          onClick={() => focusWindow("summer")}
          style={{
            zIndex: activeWindow === "summer" ? 200 : 100,
            transform: `translate(${summerDrag.pos.x}px, ${summerDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <SummerGallery
            onClose={() => closeWindow("summer")}
            onDragMouseDown={summerDrag.onMouseDown}
          />
        </div>
      )}

      {openWindows.includes("trash") && (
        <div
          className={`desktop-window desktop-window--brunson ${activeWindow === "trash" ? "active" : ""}`}
          onClick={() => focusWindow("trash")}
          style={{
            zIndex: activeWindow === "trash" ? 200 : 100,
            transform: `translate(${trashDrag.pos.x}px, ${trashDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <TrashGallery
            onClose={() => closeWindow("trash")}
            onDragMouseDown={trashDrag.onMouseDown}
          />
        </div>
      )}

      <div
        className={`desktop-window desktop-window--music ${activeWindow === "music" ? "active" : ""}`}
        onClick={() => focusWindow("music")}
        style={{
          zIndex: activeWindow === "music" ? 200 : 100,
          transform: `translate(${musicDrag.pos.x}px, ${musicDrag.pos.y}px)`,
          position: "fixed",
          top: 0,
          left: 0,
          display: openWindows.includes("music") ? "block" : "none",
        }}
      >
        <MusicPlayer
          onClose={() => closeWindow("music")}
          masterVolume={desktopVolume / 100}
          onDragMouseDown={musicDrag.onMouseDown}
        />
      </div>

      {openWindows.includes("dino") && (
        <div
          className={`desktop-window desktop-window--dino ${activeWindow === "dino" ? "active" : ""}`}
          onClick={() => focusWindow("dino")}
          style={{
            zIndex: activeWindow === "dino" ? 200 : 100,
            transform: `translate(${dinoDrag.pos.x}px, ${dinoDrag.pos.y}px)`,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <DinoGameModal
            onClose={() => closeWindow("dino")}
            onDragMouseDown={dinoDrag.onMouseDown}
          />
        </div>
      )}

      {showSuspectSelect && (
        <SuspectSelect
          onSelect={handleSuspectChosen}
          onCancel={() => setShowSuspectSelect(false)}
          variant={currentAct === 3 ? "act3" : "default"}
        />
      )}

      {openWindows.includes("mail") && (
        <EmailModal
          emails={getSeenDesktopMails(playerProgress)}
          activeMailId={mailInboxActiveId}
          onClose={() => closeWindow("mail")}
        />
      )}

      {mailNotification && (
        <EmailNotificationPopup
          mail={mailNotification}
          onClose={() => setMailNotification(null)}
        />
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <div className="taskbar-left">
          <div className="taskbar-start-wrap">
            {showStartMenu && (
              <div className="taskbar-start-menu" role="menu" aria-label="Start menu">
                <button
                  className="taskbar-start-menu-item"
                  type="button"
                  onClick={() => {
                    play("click_desktop");
                    setShowStartMenu(false);
                  }}
                >
                  Back
                </button>
                <button
                  className="taskbar-start-menu-item"
                  type="button"
                  onClick={() => {
                    play("click_desktop");
                    setShowStartMenu(false);
                    onShutdownToMenu?.();
                  }}
                >
                  Shut Down
                </button>
              </div>
            )}

            <button
              className="taskbar-start"
              type="button"
              onClick={() => {
                play("click_desktop");
                setShowStartMenu(prev => !prev);
              }}
              aria-expanded={showStartMenu}
              aria-label="Open start menu"
            >
              <img src="/icons/PC.png" alt="Start" className="start-icon-img" />
              <span className="start-text">Menu</span>
            </button>
          </div>
          <div className="taskbar-divider"></div>
          {openWindows.map(w => (
            <button
              key={w}
              className={`taskbar-window-btn ${activeWindow === w ? "active" : ""}`}
              onMouseOver={desktopHover}
              onClick={() => focusWindow(w)}
            >
              {w === "files" ? (
                <>
                  <img src="/icons/Folder.png" alt="" className="taskbar-window-icon" />
                  <span>#2016-0307-CHRIS Footage</span>
                </>
              ) : w === "notes" ? (
                <>
                  <img src="/icons/Notes.png" alt="" className="taskbar-window-icon" />
                  <span>Case Notes.txt</span>
                </>
              ) : w === "wishlist" ? (
                <>
                  <img src="/icons/Document.png" alt="" className="taskbar-window-icon" />
                  <span>Wishlist.txt</span>
                </>
              ) : w === "evidence" ? (
                <>
                  <img src="/icons/Lock.png" alt="" className="taskbar-window-icon" />
                  <span>#2016-0307-CHRIS Evidence</span>
                </>
              ) : w === "brunson" ? (
                <>
                  <img src="/icons/Folder.png" alt="" className="taskbar-window-icon" />
                  <span>Brunson</span>
                </>
              ) : w === "summer" ? (
                <>
                  <img src="/icons/Folder.png" alt="" className="taskbar-window-icon" />
                  <span>Summer 2021</span>
                </>
              ) : w === "trash" ? (
                <>
                  <img src="/icons/Bin.png" alt="" className="taskbar-window-icon" />
                  <span>Trash</span>
                </>
              ) : w === "redditDraft" ? (
                <>
                  <img src="/icons/Notes.png" alt="" className="taskbar-window-icon" />
                  <span>Reddit Draft.txt</span>
                </>
              ) : w === "music" ? (
                <>
                  <img src="/icons/Music Player.png" alt="" className="taskbar-window-icon" />
                  <span>Music Player</span>
                </>
              ) : w === "mail" ? (
                <>
                  <img src="/icons/Mail.png" alt="" className="taskbar-window-icon" />
                  <span>Mail</span>
                </>
              ) : w === "dino" ? (
                <>
                  <img src="/icons/Image.png" alt="" className="taskbar-window-icon" />
                  <span>SurfNet</span>
                </>
              ) : (
                <>
                  <img src="/icons/Document.png" alt="" className="taskbar-window-icon" />
                  <span>#2016-0307-CHRIS Case File.pdf</span>
                </>
              )}
            </button>
          ))}
        </div>
        <div className="taskbar-right">
          <div className="taskbar-tray">
            <div className="taskbar-volume-wrap" ref={volumePopupRef}>
              {showVolumePopup && (
                <div className="taskbar-volume-popup" role="dialog" aria-label="Volume control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={desktopVolume}
                    onChange={(event) => setDesktopVolume(Number(event.target.value))}
                    className="taskbar-volume-slider"
                    aria-label="Volume"
                  />
                </div>
              )}
              <button
                className="tray-icon tray-icon-btn"
                type="button"
                aria-label="Toggle volume slider"
                onClick={() => setShowVolumePopup(prev => !prev)}
              >
                <img src="/icons/Volume.png" alt="Volume" className="tray-icon-img" />
              </button>
            </div>
            <span className="tray-icon"><img src="/icons/Battery.png" alt="Battery" className="tray-icon-img" /></span>
          </div>
          <div className="taskbar-clock">
            <div className="clock-time">{clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="clock-date">{clock.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}