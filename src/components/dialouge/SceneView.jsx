import { useEffect, useState, useRef } from "react";
import "../../styles/components/dialogue.css";

/* ── Characters ── */
const CHARACTERS = [
  { id: "louis",   name: "Louis",   role: "",  image: "/Images/Louis%20Card.png"  },
  { id: "may",     name: "May",     role: "",    image: "/Images/May%20Card.png"    },
  { id: "johnny",  name: "Johnny",  role: "",     image: "/Images/Johnny%20Card.png" },
  { id: "richard", name: "Richard", role: "", image: "/Images/Richie%20Card.png" },
];

/* ── Shared ambient loop (plays while detective types the question) ── */
const LOOP_VIDEO = "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172439/Loop-1_ixjhfu.mp4";

/* ── Act display titles ── */
const ACT_TITLES = {
  0: "INTRODUCTORY — The First Interviews",
  1: "ACT I — The Incident",
  2: "ACT II — The Motives",
};

/* ══════════════════════════════════════════════════════════
   ACT 0 — Intro (per-character full sequential interview)
   ══════════════════════════════════════════════════════════ */
const ACT0 = {
  louis: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172842/Louis_Intro_1_hcnsmh.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172848/Louis_Intro_2_jlmhxg.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172856/Louis_Intro_3_m77jia.mp4"] },
  ],
  may: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172759/May_Intro_1_pybdgw.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172763/May_Intro_2_bp5ptj.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172761/May_Intro_3_eedt7s.mp4"] },
  ],
  johnny: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172887/Johnny_Intro_1_d5oe7i.mp4"] },
    { question: "Detective: Just state your name.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172884/Johnny_Intro_2_yhwrvn.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172890/Johnny_Intro_3_kociav.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172895/Johnny_Intro_4_unxvca.mp4"] },
  ],
  richard: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172814/Richie_Intro_1_nxscml.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172818/Richie_Intro_2_gdmq2h.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172814/Richie_Intro_3_anhig1.mp4"] },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════
   ACTS 1 & 2 — Per-question 2-picks mechanic
   Per question: player picks 2 of 4 suspects to hear from.
   Each character may have multiple sub-exchanges (follow-ups auto-play).
   ═══════════════════════════════════════════════════════════════════════ */
const ACTS = {
  1: {
    questions: [
      {
        label: "What happened last night?",
        characters: {
          may: [
            { question: "Detective: What happened last night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172755/May_Act_1_-_1.1_wkh6dx.mp4"], skipPause: true },
            { question: "Detective: Can we continue?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172754/May_Act_1_-_1.2_sbgp4p.mp4"] },
            { question: "Detective: What was the prank?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172761/May_Act_1_-_1.3_q0eqlr.mp4"] },
          ],
          johnny: [
            { question: "Detective: What happened last night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172892/Johnny_Act_1_-_1.1_e7vlbq.mp4"] },
            { question: "Detective: Payback for what?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172885/Johnny_Act_1_-_1.2_n0rrw2.mp4"] },
          ],
          louis: [
            { question: "Detective: Are you okay?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172843/Louis_Act_1_-_1.1_snx0zw.mp4"] },
            { question: "Detective: What happened last night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172851/Louis_Act_1_-_1.2_ayj4xx.mp4"] },
            { question: "Detective: What did she suggest?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172842/Louis_Act_1_-_1.3_eogg24.mp4"] },
          ],
          richard: [
            { question: "Detective: What happened last night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172824/Richie_Act_1_-_1.1_bokofh.mp4"] },
            { question: "Detective: Who came up with the idea?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172812/Richie_Act_1_-_1.2_ed2zgl.mp4"] },
          ],
        },
      },
      {
        label: "The pills found at the crime scene — where did they come from?",
        characters: {
          may:     [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172762/May_Act_1_-_2_u81pqp.mp4"] }],
          johnny:  [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172892/Johnny_Act_1_-_2_kefchu.mp4"] }],
          louis:   [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172847/Louis_Act_1_-_2_ry5txz.mp4"] }],
          richard: [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172819/Richie_Act_1_-_2_y8cnrt.mp4"] }],
        },
      },
      {
        label: "Can you recount the whole night for me?",
        characters: {
          may:     [{ question: "Detective: Can you recount the whole night for me?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776183534/May_Act_1_-_3_1_jxmmka.mp4"] }],
          johnny:  [{ question: "Detective: Can you recount the whole night for me?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172903/Johnny_Act_1_-_3_s7zcyh.mp4"] }],
          louis:   [{ question: "Detective: Can you recount the whole night for me?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172871/Louis_Act_1_-_3_iss1xd.mp4"] }],
          richard: [{ question: "Detective: Can you recount the whole night for me?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172835/Richie_Act_1_-_3_nxx6yu.mp4"] }],
        },
      },
      {
        label: "Do you think any one of you could have had the intention to want this?",
        characters: {
          may:     [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172760/May_Act_1_-_4_dtuaje.mp4"] }],
          johnny:  [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172888/Johnny_Act_1_-_4_mymvj2.mp4"] }],
          louis:   [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172845/Louis_Act_1_-_4_ugcjgu.mp4"] }],
          richard: [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172812/Richie_Act_1_-_4_kr8byp.mp4"] }],
        },
      },
    ],
  },
  2: {
    questions: [
      {
        label: "What did Chris do?",
        characters: {
          may:     [{ question: "Detective: What did Chris do?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172765/May_Act_2_-_1_laeik2.mp4"] }],
          johnny:  [
            { 
              question: "Detective: What did Chris do?", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172886/Johnny_Act_2_-_1.1_opsrh4.mp4"]
             },
             {
              question: "Detective: What do you mean by that?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172897/Johnny_Act_2_-_1.2_ikito2.mp4"]
             },
             {
              question: "Detective: Anything else?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172893/Johnny_Act_2_-_1.3_wbvejo.mp4"]
             }
            ],
          louis:   [
            { 
              question: "Detective: What did Chris do?", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172847/Louis_Act_2_-_1.1_ksi5cc.mp4"] 
            },
            {
              question: "Detective: In what way?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172849/Louis_Act_2_-_1.2_ghrd9c.mp4"]
            }
          ],
          richard: [
            { question: "Detective: What did Chris do?", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172815/Richie_Act_2_-_1.1_v0bpkx.mp4"]
            },
            {
              question: "Detective: Did you notice this on anyone else?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172828/Richie_Act_2_-_1.2_dkevvs.mp4"]
            }
            ],
       },
      },
      {
        label: "What is the group usually like with Chris around?",
        characters: {
          may:     [{ question: "Detective: What is the group usually like with Chris around?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172767/May_Act_2_-_2_tu5xvt.mp4"] }],
          johnny:  [{ question: "Detective: What is the group usually like with Chris around?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172891/Johnny_Act_2_-_2_l14aym.mp4"] }],
          louis:   [{ question: "Detective: What is the group usually like with Chris around?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172848/Louis_Act_2_-_2_dxdii1.mp4"] }],
          richard: [{ question: "Detective: What is the group usually like with Chris around?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172833/Richie_Act_2_-_2_y6kjk5.mp4"] }],
        },
      },
      {
        label: "What is your relationship like with Chris?",
        characters: {
          may:     [{ question: "Detective: What is your relationship like with Chris?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172768/May_Act_2_-_3_cnx6o8.mp4"] }],
          johnny:  [
            { question: "Detective: What is your relationship like with Chris?", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172895/Johnny_Act_2_-_3.1_dtekyv.mp4"] 
            },
            {
              question: "Detective: Like that night?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172889/Johnny_Act_2_-_3.2_ftvjje.mp4"]
            }
          ],
          louis:   [{ question: "Detective: What is your relationship like with Chris?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172854/Louis_Act_2_-_3_lrb22a.mp4"] }],
          richard: [{ question: "Detective: What is your relationship like with Chris?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172835/Richie_Act_2_-_3_ijox6c.mp4"] }],
        },
      },
    ],
  },
};

/* ════════════════════════════════════
   TypewriterLine
   ════════════════════════════════════ */
function TypewriterLine({ text, speed = 55, onDone, paused = false }) {
  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      if (audioRef.current) { audioRef.current.pause(); }
      return;
    }
    // If already finished or no text, don't restart
    if (!text || index >= text.length) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/typewriter.mp3");
      audioRef.current.volume = 0.35;
    }
    intervalRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        const char = text[prev] ?? "";
        if (audioRef.current && char.trim() !== "") {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        if (next >= text.length) {
          clearInterval(intervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setTimeout(() => onDoneRef.current?.(), 0);
        }
        return next;
      });
    }, speed);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [text, speed, paused]);

  // Reset index when text changes
  useEffect(() => {
    setIndex(0);
  }, [text]);

  // Handle empty text
  useEffect(() => {
    if (!text) {
      const t = setTimeout(() => onDoneRef.current?.(), 50);
      return () => clearTimeout(t);
    }
  }, [text]);

  return <>{text.slice(0, index)}</>;
}

// Preload a video and report when it's ready to play through
function useVideoPreload(src) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    if (!src) return;
    setReady(false);
    const el = document.createElement('video');
    el.src = src;
    el.preload = 'auto';
    el.muted = true;
    el.playsInline = true;
    const onReady = () => setReady(true);
    el.addEventListener('canplaythrough', onReady, { once: true });
    el.load();
    videoRef.current = el;
    return () => {
      el.removeEventListener('canplaythrough', onReady);
      el.src = '';
      videoRef.current = null;
    };
  }, [src]);
  return ready;
}

// CinematicStage: handles loop video, preloading, and seamless transition
function CinematicStage({ loopSrc, actSrc, question, onDone, paused }) {
  const [typingDone, setTypingDone] = useState(false);
  const [showAct, setShowAct] = useState(false);
  const [actStarted, setActStarted] = useState(false);
  const loopRef = useRef(null);
  const actRef = useRef(null);
  const actReady = useVideoPreload(actSrc);



  // When both typing and actReady, show act video
  useEffect(() => {
    if (!typingDone) return;

    const timer = setTimeout(() => {
      setShowAct(true);
    }, 2000); // Delay before showing act video
    
    return () => clearTimeout(timer);

  }, [typingDone]);

  // When act video is shown, play it
  useEffect(() => {
    if (showAct && actRef.current && !actStarted) {
      setActStarted(true);
      actRef.current.play().catch(() => {});
    }
  }, [showAct, actStarted]);

  // Reset state if actSrc changes
  useEffect(() => {
    setTypingDone(false);
    setShowAct(false);
    setActStarted(false);
  }, [actSrc, question]);

  return (
    <div className="video-stage" style={{ position: 'relative' }}>
      {/* Loop video: visible until act is ready */}
      {!showAct && (
        <video
          ref={loopRef}
          src={loopSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      {/* Act video: only shown when ready */}
      {showAct && (
        <video
          ref={actRef}
          src={actSrc}
          autoPlay
          controls={false}
          playsInline
          onEnded={onDone}
        />
      )}
      {/* Question overlay: only during loop phase */}
      {!showAct && (
        <div className="question-overlay">
          <p className="question-text">
            <TypewriterLine
              key={question}
              text={question}
              speed={55}
              onDone={() => setTypingDone(true)}
              paused={paused}
            />
          </p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════
   SceneView
   ════════════════════════════════════ */
export default function SceneView({ actNumber, playerProgress, onClose, onActComplete, onProgressUpdate }) {
  const actKey = `act${actNumber}`;
  const saved = playerProgress?.scenes_visited?.[actKey] || {};

  /* ── ACT 0 state ── */
  const [introChar, setIntroChar] = useState(saved.introChar ?? null);
  const [introExIdx, setIntroExIdx] = useState(saved.introExIdx ?? 0);
  const [introCompleted, setIntroCompleted] = useState(saved.introCompleted ?? []);

  /* ── ACTS 1 & 2 state ── */
  const [qIdx, setQIdx] = useState(saved.qIdx ?? 0);
  const [picksThisQ, setPicksThisQ] = useState(saved.picksThisQ ?? []);
  const [activePick, setActivePick] = useState(saved.activePick ?? null);
  const [pickSubIdx, setPickSubIdx] = useState(saved.pickSubIdx ?? 0);

  /* ── Shared ── */
  const [phase, setPhase] = useState(saved.phase ?? "selection");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [pendingLastClip, setPendingLastClip] = useState(null);
  const [tapFading, setTapFading] = useState(false);
  const [paused, setPaused] = useState(false);

  /* ── ESC key listener ── */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setPaused(p => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const progressRef = useRef(onProgressUpdate);
  useEffect(() => { progressRef.current = onProgressUpdate; }, [onProgressUpdate]);

  /* Persist progress */
  useEffect(() => {
    const persistedPhase = phase === "answer" || phase === "pending"
      ? "question"
      : phase;

    progressRef.current({
      scenes_visited: {
        [actKey]: {
          introChar, introExIdx, introCompleted,
          qIdx, picksThisQ, activePick, pickSubIdx,
          phase: persistedPhase,
        },
      },
    });
  }, [actKey, introChar, introExIdx, introCompleted, qIdx, picksThisQ, activePick, pickSubIdx, phase]);

  /* Auto-advance: typewriter done → 2s → answer video */
  useEffect(() => {
    if (phase !== "question" || !isTypingDone || paused) return;
    const t = setTimeout(() => {
      setPhase("answer");
      setIsTypingDone(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, isTypingDone, paused]);

  /* ── ACT 0 handlers ── */
  function handleIntroPickChar(charId) {
    if (introCompleted.includes(charId)) return;
    setIntroChar(charId);
    setIntroExIdx(0);
    setPhase("question");
    setIsTypingDone(false);
  }

  function handleIntroAnswerEnded() {
    if (introExchange?.skipPause) {
      advanceIntro();
      return;
    }
    const clips = introExchange?.clips || [];
    setPendingLastClip(clips[clips.length - 1] || null);
    setPhase("pending");
  }

  function advanceIntro() {
    setPendingLastClip(null);
    const exchanges = ACT0[introChar];
    const next = introExIdx + 1;
    if (next < exchanges.length) {
      setIntroExIdx(next);
      setPhase("question");
      setIsTypingDone(false);
      return;
    }
    const updated = introCompleted.includes(introChar)
      ? introCompleted
      : [...introCompleted, introChar];
    setIntroCompleted(updated);
    setIntroChar(null);
    setIntroExIdx(0);
    if (updated.length === CHARACTERS.length) {
      setPhase("complete");
    } else {
      setPhase("selection");
    }
  }

  /* ── ACTS 1 & 2 handlers ── */
  function handlePickChar(charId) {
    if (picksThisQ.includes(charId)) return;
    setActivePick(charId);
    setPickSubIdx(0);
    setPhase("question");
    setIsTypingDone(false);
  }

  function handlePickAnswerEnded() {
    if (pickExchange?.skipPause) {
      advancePick();
      return;
    }
    const clips = pickExchange?.clips || [];
    setPendingLastClip(clips[clips.length - 1] || null);
    setPhase("pending");
  }

  function advancePick() {
    setPendingLastClip(null);
    const qData = ACTS[actNumber].questions[qIdx];
    const exchanges = qData.characters[activePick];
    const nextSub = pickSubIdx + 1;
    if (nextSub < exchanges.length) {
      setPickSubIdx(nextSub);
      setPhase("question");
      setIsTypingDone(false);
      return;
    }
    const updatedPicks = [...picksThisQ, activePick];
    setPicksThisQ(updatedPicks);
    setActivePick(null);
    setPickSubIdx(0);
    if (updatedPicks.length < 2) {
      setPhase("selection");
    } else {
      const nextQ = qIdx + 1;
      if (nextQ < ACTS[actNumber].questions.length) {
        setQIdx(nextQ);
        setPicksThisQ([]);
        setPhase("selection");
      } else {
        setPhase("complete");
      }
    }
  }

  function handleTapToContinue() {
    if (tapFading) return;
    setTapFading(true);
    setTimeout(() => {
      setTapFading(false);
      if (isAct0) advanceIntro(); else advancePick();
    }, 500);
  }

  /* ── Derived ── */
  const isAct0 = actNumber === 0;
  const hasActData = Boolean(ACTS[actNumber]);
  const introExchange = isAct0 && introChar ? ACT0[introChar]?.[introExIdx] : null;
  const currentQ = !isAct0 && hasActData ? ACTS[actNumber].questions[qIdx] : null;
  const pickExchanges = currentQ && activePick ? currentQ.characters[activePick] : null;
  const pickExchange = pickExchanges?.[pickSubIdx];
  /* ── Unavailable fallback ── */

  useEffect(() => {
    if (!pickExchange?.clips?.[0]) return;
    const video = document.createElement("video");
    video.src = pickExchange.clips[0];
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.load();
    return () => { video.src = ""; };
  }, [pickExchange]);

  if (!isAct0 && !hasActData) {
    return (
      <div className="scene-view">
        <div className="scene-content">
          <p>THIS ACT IS NOT YET AVAILABLE</p>
        </div>
        {paused && (
          <div className="pause-overlay" onClick={() => setPaused(false)}>
            <div className="pause-menu" onClick={e => e.stopPropagation()}>
              <h2 className="pause-title">PAUSED</h2>
              <button className="pause-option" onClick={() => setPaused(false)}>Resume</button>
              <button className="pause-option" onClick={onClose}>Back to Desktop</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className="scene-view">

      {/* ════ PAUSE MENU ════ */}
      {paused && (
        <div className="pause-overlay" onClick={() => setPaused(false)}>
          <div className="pause-menu" onClick={e => e.stopPropagation()}>
            <h2 className="pause-title">PAUSED</h2>
            <button className="pause-option" onClick={() => setPaused(false)}>Resume</button>
            <button className="pause-option" onClick={onClose}>Back to Desktop</button>
          </div>
        </div>
      )}

      {/* ════ ACT 0 ════ */}
      {isAct0 && (
        phase === "complete" ? (
          <div className="scene-content">
            <p className="act-title-label">{ACT_TITLES[0]} — COMPLETE</p>
            <div className="scene-footer">
              <button onClick={() => onActComplete(0)}>CONTINUE <span>&#8594;</span></button>
            </div>
          </div>
        ) : introChar ? (
          <div className="scene-content scene-content--cinematic">
            <CinematicStage
              loopSrc={LOOP_VIDEO}
              actSrc={introExchange?.clips?.[0]}
              question={introExchange?.question || ""}
              onDone={handleIntroAnswerEnded}
              paused={paused}
            />
            {phase === "pending" && (
              <div className={`pending-overlay${tapFading ? " fading" : ""}`} onClick={handleTapToContinue}>
                <span className="tap-to-continue">tap to continue</span>
              </div>
            )}
          </div>
        ) : (
          <div className="scene-content">
            <p className="act-title-label">{ACT_TITLES[0]}</p>
            <div className="suspect-grid">
              {CHARACTERS.map(c => {
                const done = introCompleted.includes(c.id);
                return (
                  <button key={c.id} disabled={done} onClick={() => handleIntroPickChar(c.id)}>
                    <img src={c.image} alt={c.name} className="suspect-card-img" />
                    <div className="suspect-card-info">
                      <strong>{c.name}</strong>
                      <span>{done ? "INTERVIEWED ✓" : c.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* ════ ACTS 1 & 2 ════ */}
      {!isAct0 && hasActData && (
        phase === "complete" ? (
          <div className="scene-content">
            <p className="act-title-label">{ACT_TITLES[actNumber]} — COMPLETE</p>
            <div className="scene-footer">
              <button onClick={() => onActComplete(actNumber)}>CONTINUE <span>&#8594;</span></button>
            </div>
          </div>
        ) : activePick ? (
          <div className="scene-content scene-content--cinematic">
            <CinematicStage
              loopSrc={LOOP_VIDEO}
              actSrc={pickExchange?.clips?.[0]}
              question={pickExchange?.question || ""}
              onDone={handlePickAnswerEnded}
              paused={paused}
            />
            {phase === "pending" && (
              <div className={`pending-overlay${tapFading ? " fading" : ""}`} onClick={handleTapToContinue}>
                <span className="tap-to-continue">tap to continue</span>
              </div>
            )}
          </div>
        ) : (
          <div className="scene-content">
            <div className="act-question-banner">
              <span className="act-question-label">{ACT_TITLES[actNumber]}</span>
              <p className="act-question-text">{currentQ?.label}</p>
              <span className="act-picks-remaining">
                {picksThisQ.length === 0
                  ? "Choose 2 suspects to question"
                  : "Choose 1 more suspect"}
              </span>
            </div>
            <div className="suspect-grid">
              {CHARACTERS.map(c => {
                const picked = picksThisQ.includes(c.id);
                return (
                  <button key={c.id} disabled={picked} onClick={() => handlePickChar(c.id)}>
                    <img src={c.image} alt={c.name} className="suspect-card-img" />
                    <div className="suspect-card-info">
                      <strong>{c.name}</strong>
                      <span>{picked ? "QUESTIONED ✓" : c.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
