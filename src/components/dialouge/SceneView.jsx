import { useEffect, useState, useRef } from "react";
import { useSound } from "../../hooks/useSound";
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

const QUESTION_TITLE_SCREENS = {
  1: [
    {
      title: "ACT 1",
      subtitle: "The Incident - Part 1",
      description: "Reconstruct the night, find out where each one of them was.",
    },
    {
      title: "ACT 1",
      subtitle: "The Incident - Part 2",
    },
    {
      title: "ACT 1",
      subtitle: "The Incident - Part 3",
    },
    {
      title: "ACT 1",
      subtitle: "The Incident - Part 4",
    },
  ],
};

const QUESTION_PROMPT_SCREENS = {
  1: [
    "What happened that night?",
    "Where did the pills come from?",
    "Can they recount the whole night?",
    "Could a friend have done this?",
  ],
  2: [
    "What did Chris do?",
    "What were they all like together?",
    "What was their personal relationship with him?",
  ],
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
            { question: "Detective: I need you to walk me through the evening, from when everyone got together to when the paramedics arrived. What exactly happened that night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172755/May_Act_1_-_1.1_wkh6dx.mp4"], skipPause: true },
            { question: "Detective: Can we continue?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172754/May_Act_1_-_1.2_sbgp4p.mp4"] },
            { question: "Detective: What was the prank?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172761/May_Act_1_-_1.3_q0eqlr.mp4"] },
          ],
          johnny: [
            { question: "Detective: Start at the beginning and walk me through it, from when you all met up to when the paramedics got there. What happened that night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172892/Johnny_Act_1_-_1.1_e7vlbq.mp4"] },
            { question: "Detective: Payback for what?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172885/Johnny_Act_1_-_1.2_n0rrw2.mp4"] },
          ],
          louis: [
            { question: "Detective: Are you okay?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172843/Louis_Act_1_-_1.1_snx0zw.mp4"] },
            { question: "Detective: I need a full timeline from when everyone gathered to the moment paramedics arrived. What exactly happened that night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172851/Louis_Act_1_-_1.2_ayj4xx.mp4"] },
            { question: "Detective: What did she suggest?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172842/Louis_Act_1_-_1.3_eogg24.mp4"] },
          ],
          richard: [
            { question: "Detective: Give me a complete account of the evening, from the get-together to when emergency responders arrived. What happened that night?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172824/Richie_Act_1_-_1.1_bokofh.mp4"] },
            { question: "Detective: Who came up with the idea?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172812/Richie_Act_1_-_1.2_ed2zgl.mp4"] },
          ],
        },
      },
      {
        label: "The pills found at the crime scene — where did they come from?",
        characters: {
          may:     [{ question: "Detective: The pills were a heavy sedative. They didn’t just appear on the counter. Someone brought them, and someone crushed them. Where did those pills actually come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172762/May_Act_1_-_2_u81pqp.mp4"] }],
          johnny:  [{ question: "Detective: Those pills were a strong sedative. They didn’t magically show up. Someone brought them in, and someone crushed them. So where did they come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172892/Johnny_Act_1_-_2_kefchu.mp4"] }],
          louis:   [{ question: "Detective: We’re talking about a heavy sedative. It didn’t just appear on that counter. Someone brought it, and someone crushed it. Where did those pills come from?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172847/Louis_Act_1_-_2_ry5txz.mp4"] }],
          richard: [{ question: "Detective: The pills were a potent sedative. They weren’t random. Someone brought them, and someone crushed them. Tell me where those pills actually came from.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172819/Richie_Act_1_-_2_y8cnrt.mp4"] }],
        },
      },
      {
        label: "Can you recount the whole night for me?",
        characters: {
          may:     [{ question: "Detective: From your perspective, I need every detail you can remember. Recount the whole night and leave nothing out.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776183534/May_Act_1_-_3_1_jxmmka.mp4"] }],
          johnny:  [{ question: "Detective: I want your full version of the night, step by step, with every detail you remember. Don’t skip anything.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172903/Johnny_Act_1_-_3_s7zcyh.mp4"] }],
          louis:   [{ question: "Detective: Give me your perspective in full. Recount the entire night with as much detail as you can, and don’t leave anything out.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172871/Louis_Act_1_-_3_iss1xd.mp4"] }],
          richard: [{ question: "Detective: I need a complete recount from your point of view. Include every detail you can remember, and leave nothing out.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172835/Richie_Act_1_-_3_nxx6yu.mp4"] }],
        },
      },
      {
        label: "Do you think any one of you could have had the intention to want this?",
        characters: {
          may:     [{ question: "Detective: Looking back, do you think any of your friends could have intended this outcome? Is anyone in that group capable of turning a prank into something fatal?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172760/May_Act_1_-_4_dtuaje.mp4"] }],
          johnny:  [{ question: "Detective: Thinking back now, do you believe anyone in your group might have wanted this to happen? Who could have pushed a prank into something deadly?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172888/Johnny_Act_1_-_4_mymvj2.mp4"] }],
          louis:   [{ question: "Detective: In hindsight, do you think one of your friends had the intention for this? Is there anyone you believe could have let a prank become fatal?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172845/Louis_Act_1_-_4_ugcjgu.mp4"] }],
          richard: [{ question: "Detective: Looking back on that night, do you think anyone in your group was capable of wanting this? Could someone have deliberately turned a prank into a fatal incident?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172812/Richie_Act_1_-_4_kr8byp.mp4"] }],
        },
      },
    ],
  },
  2: {
    questions: [
      {
        label: "What did Chris do?",
        characters: {
          may:     [{ question: "Detective: Let's talk about Chris, specifically his behavior. What exactly did he do that night, or any other night, that made the group feel like a prank was the only way to deal with him?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172765/May_Act_2_-_1_laeik2.mp4"] }],
          johnny:  [
            { 
              question: "Detective: Let's talk about Chris and the way he acted. What exactly did he do that night, or before that, that made the group think a prank was the only way to handle him?", 
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
              question: "Detective: I want to focus on Chris's behavior. What did he do, that night or before, that made everyone feel a prank was the only option left?", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172847/Louis_Act_2_-_1.1_ksi5cc.mp4"] 
            },
            {
              question: "Detective: In what way?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172849/Louis_Act_2_-_1.2_ghrd9c.mp4"]
            }
          ],
          richard: [
            { question: "Detective: Let's talk about Chris. What exactly did he do that night, or on other nights, that made the group think a prank was the only way to deal with him?", 
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
          may:     [{ question: "Detective: You all call yourselves friends. I want to know what that was actually like.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172767/May_Act_2_-_2_tu5xvt.mp4"] }],
          johnny:  [{ question: "Detective: So you all call yourselves friends... tell me what that was really like.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172891/Johnny_Act_2_-_2_l14aym.mp4"] }],
          louis:   [{ question: "Detective: You describe each other as friends. I need to understand what that dynamic was actually like.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172848/Louis_Act_2_-_2_dxdii1.mp4"] }],
          richard: [{ question: "Detective: You all say you were friends. Walk me through what that was like inside the group.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172833/Richie_Act_2_-_2_y6kjk5.mp4"] }],
        },
      },
      {
        label: "What is your relationship like with Chris?",
        characters: {
          may:     [{ question: "Detective: I want to move away from the group for a second. Tell me about your personal relationship with him, one-on-one.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172768/May_Act_2_-_3_cnx6o8.mp4"] }],
          johnny:  [
            { question: "Detective: Let's step away from the group. Tell me about your one-on-one relationship with Chris.", 
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172895/Johnny_Act_2_-_3.1_dtekyv.mp4"] 
            },
            {
              question: "Detective: Like that night?",
              clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172889/Johnny_Act_2_-_3.2_ftvjje.mp4"]
            }
          ],
          louis:   [{ question: "Detective: I want to focus just on you and Chris. What was your personal relationship with him like, one-on-one?", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172854/Louis_Act_2_-_3_lrb22a.mp4"] }],
          richard: [{ question: "Detective: Forget the group for a moment. Tell me about your personal relationship with Chris, one-on-one.", clips: ["https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172835/Richie_Act_2_-_3_ijox6c.mp4"] }],
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
function CinematicStage({ loopSrc, actSrc, question, onDone, paused, onOpenPauseMenu, showProceed = false, onProceed, isProceedFading = false }) {
  const [typingDone, setTypingDone] = useState(false);
  const [showAct, setShowAct] = useState(false);
  const [actStarted, setActStarted] = useState(false);
  const [awaitingQuestionProceed, setAwaitingQuestionProceed] = useState(false);
  const loopRef = useRef(null);
  const actRef = useRef(null);
  const actReady = useVideoPreload(actSrc);
  const shouldShowProceed = showProceed || awaitingQuestionProceed;



  // Pause on the typed question and wait for user proceed before showing answer video.
  useEffect(() => {
    if (!typingDone) return;
    setAwaitingQuestionProceed(true);
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
    setAwaitingQuestionProceed(false);
  }, [actSrc, question]);

  function handlePause() {
    onOpenPauseMenu?.();
  }

  function handleProceed(event) {
    event?.stopPropagation?.();
    if (awaitingQuestionProceed) {
      if (!actReady) return;
      setAwaitingQuestionProceed(false);
      setShowAct(true);
      return;
    }
    onProceed?.();
  }

  function handlePendingTap(event) {
    if (!shouldShowProceed) return;
    if (event.target.closest("button, a, input, textarea, select, label")) return;
    handleProceed();
  }

  return (
    <div className="video-stage-shell" onClick={handlePendingTap}>
      <div className="video-stage" style={{ position: "relative" }}>
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
                text={question.replace(/^Detective:\s*/i, "")}
                speed={55}
                onDone={() => setTypingDone(true)}
                paused={paused}
              />
            </p>
          </div>
        )}
      </div>

      <div className={`video-bottom-bar${isProceedFading ? " fading" : ""}`}>
        <div className="video-controls" aria-label="Video controls">
          <button
            className="video-control-btn"
            type="button"
            aria-label="Play"
            disabled
          >
            <img src="/icons/Play.png" alt="Play" className="video-control-icon" />
          </button>
          <button
            className="video-control-btn"
            type="button"
            onClick={handlePause}
            aria-label="Pause"
          >
            <img src="/icons/Pause.png" alt="Pause" className="video-control-icon" />
          </button>
        </div>

        <div className="video-actions">
          {shouldShowProceed && (
            <button
              className="pending-proceed"
              type="button"
              onClick={handleProceed}
              disabled={awaitingQuestionProceed && !actReady}
            >
              Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   SceneView
   ════════════════════════════════════ */
export default function SceneView({
  actNumber,
  questionIndex,
  playerProgress,
  onClose,
  onActComplete,
  onQuestionComplete,
  onProgressUpdate,
}) {
  function getQuestionTitleScreenData(targetAct, targetQIdx) {
    const custom = QUESTION_TITLE_SCREENS[targetAct]?.[targetQIdx];
    if (custom) return custom;

    if (targetAct === 2) {
      return {
        title: "ACT 2",
        subtitle: `The Motives - Part ${targetQIdx + 1}`,
        description: "Look beyond what they are showing on the surface, what hidden truths do they hide?",
      };
    }

    return {
      title: `ACT ${targetAct}`,
      subtitle: `Part ${targetQIdx + 1}`,
    };
  }

  function getQuestionPromptScreenText(targetAct, targetQIdx) {
    const custom = QUESTION_PROMPT_SCREENS[targetAct]?.[targetQIdx];
    if (custom) return custom;
    return ACTS[targetAct]?.questions?.[targetQIdx]?.label || "";
  }

  const actKey = `act${actNumber}`;
  const saved = playerProgress?.scenes_visited?.[actKey] || {};
  const isAct0 = actNumber === 0;
  const { play } = useSound();

  /* ── ACT 0 state ── */
  const [introChar, setIntroChar] = useState(saved.introChar ?? null);
  const [introExIdx, setIntroExIdx] = useState(saved.introExIdx ?? 0);
  const [introCompleted, setIntroCompleted] = useState(saved.introCompleted ?? []);

  /* ── ACTS 1 & 2 state ── */
  const [completedQuestions, setCompletedQuestions] = useState(saved.completedQuestions ?? []);
  const initialQIdx = typeof questionIndex === "number" ? questionIndex : (saved.qIdx ?? 0);
  const [qIdx, setQIdx] = useState(initialQIdx);
  const [picksThisQ, setPicksThisQ] = useState(saved.picksThisQ ?? []);
  const [activePick, setActivePick] = useState(saved.activePick ?? null);
  const [pickSubIdx, setPickSubIdx] = useState(saved.pickSubIdx ?? 0);

  /* ── Shared ── */
  const shouldShowQuestionTitle =
    !isAct0 &&
    typeof questionIndex === "number" &&
    typeof qIdx === "number";
  const [phase, setPhase] = useState(
    shouldShowQuestionTitle ? "question-intro" : (saved.phase ?? "selection")
  );
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

  useEffect(() => {
    if (typeof questionIndex !== "number") return;
    const completed = saved.completedQuestions || [];
    const isAlreadyCompleted = completed.includes(questionIndex);
    setQIdx(questionIndex);
    setPicksThisQ([]);
    setActivePick(null);
    setPickSubIdx(0);
    setPendingLastClip(null);
    setIsTypingDone(false);
    if ((actNumber === 1 || actNumber === 2) && isAlreadyCompleted) {
      setPhase("question-complete");
      return;
    }
    setPhase("question-intro");
  }, [questionIndex, actNumber, saved.completedQuestions]);

  useEffect(() => {
    if (isAct0) return;
    if (phase !== "question-intro" && phase !== "question-slide") return;
    const timer = setTimeout(() => {
      if (phase === "question-intro") {
        if (actNumber === 1 && qIdx === 1) {
          setPhase("question-warning");
          return;
        }
        setPhase("question-slide");
      } else {
        setPhase("selection");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [phase, isAct0, actNumber, qIdx]);

  /* Persist progress */
  useEffect(() => {
    const persistedPhase = phase === "question-intro" || phase === "question-slide" || phase === "question-complete" || phase === "question-warning"
      ? "selection"
      : (phase === "answer" || phase === "pending"
        ? "question"
        : phase);

    progressRef.current({
      scenes_visited: {
        [actKey]: {
          introChar, introExIdx, introCompleted,
          qIdx, picksThisQ, activePick, pickSubIdx,
          phase: persistedPhase,
          completedQuestions,
        },
      },
    });
  }, [
    actKey,
    introChar,
    introExIdx,
    introCompleted,
    qIdx,
    picksThisQ,
    activePick,
    pickSubIdx,
    phase,
    completedQuestions,
  ]);

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
    const requiredPicks = (actNumber === 1 && qIdx === 0) ? CHARACTERS.length : 2;
    if (updatedPicks.length < requiredPicks) {
      setPhase("selection");
      return;
    }

    const updatedCompleted = completedQuestions.includes(qIdx)
      ? completedQuestions
      : [...completedQuestions, qIdx];

    setCompletedQuestions(updatedCompleted);
    setPicksThisQ([]);

    if (actNumber === 1) {
      setPhase("question-complete");
      return;
    }

    if (qIdx + 1 >= ACTS[actNumber].questions.length) {
      setPhase("question-complete");
    } else {
      setPhase("selection");
      onQuestionComplete?.(actNumber, qIdx, updatedCompleted);
    }
  }

  function handleQuestionCompleteContinue() {
    const updatedCompleted = completedQuestions.includes(qIdx)
      ? completedQuestions
      : [...completedQuestions, qIdx];

    onQuestionComplete?.(actNumber, qIdx, updatedCompleted);

    if (qIdx + 1 >= ACTS[actNumber].questions.length) {
      play("radioChirp");
      onActComplete?.(actNumber);
      return;
    }

    play("radioChirp");
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
              <button className="pause-option" onClick={onClose}>Home</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderActComplete(title, subtitle, onContinue) {
    return (
      <div className="scene-content scene-content--complete">
        <div className="act-complete-panel">
          <h2 className="act-complete-title">{title}</h2>
          <p className="act-complete-copy">{subtitle}</p>
          <button
            className="act-complete-button"
            onClick={onContinue || (() => onActComplete(actNumber))}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  function renderQuestionIntro() {
    const info = getQuestionTitleScreenData(actNumber, qIdx);
    return (
      <div className="scene-content scene-content--question-intro">
        <div className="question-intro-card">
          <h1 className="question-intro-title">{info.title}</h1>
          <p className="question-intro-subtitle">{info.subtitle}</p>
          {info.description && <p className="question-intro-desc">{info.description}</p>}
        </div>
      </div>
    );
  }

  function renderQuestionPromptSlide() {
    const text = getQuestionPromptScreenText(actNumber, qIdx);
    return (
      <div className="scene-content scene-content--question-slide">
        <p className="question-slide-text">{text}</p>
      </div>
    );
  }

  function renderQuestionCompleteError() {
    return renderActComplete(
      "Error 1004: Unexpected EOF (End of File)",
      "File structure unreadable. Bit-rot detected. Did you see what you needed?",
      handleQuestionCompleteContinue
    );
  }

  function renderQuestionWarning() {
    return renderActComplete(
      "System Alert: Critical Integrity Failure",
      "Data corruption detected in the entire folder. Only two files in all the following sequences are recoverable. Select priority suspects carefully.",
      () => setPhase("question-slide")
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
            <button className="pause-option" onClick={onClose}>Home</button>
          </div>
        </div>
      )}

      {/* ════ ACT 0 ════ */}
      {isAct0 && (
        phase === "complete" ? (
          renderActComplete(
            "Error 0x80030005: Unexpected EOF (End of File)",
            `File structure unreadable. Bit-rot detected. Did you see what you needed?`
          )
        ) : introChar ? (
          <div className="scene-content scene-content--cinematic">
            <CinematicStage
              loopSrc={LOOP_VIDEO}
              actSrc={introExchange?.clips?.[0]}
              question={introExchange?.question || ""}
              onDone={handleIntroAnswerEnded}
              paused={paused}
              onOpenPauseMenu={() => setPaused(true)}
              showProceed={phase === "pending"}
              onProceed={handleTapToContinue}
              isProceedFading={tapFading}
            />
          </div>
        ) : (
          <div className="scene-content">
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
        phase === "question-intro" ? (
          renderQuestionIntro()
        ) : phase === "question-warning" ? (
          renderQuestionWarning()
        ) : phase === "question-slide" ? (
          renderQuestionPromptSlide()
        ) : phase === "question-complete" ? (
          renderQuestionCompleteError()
        ) : phase === "complete" ? (
          renderActComplete(
            "ACT COMPLETE",
            `${ACT_TITLES[actNumber]} has been finished. Continue to the next act.`
          )
        ) : activePick ? (
          <div className="scene-content scene-content--cinematic">
            <CinematicStage
              loopSrc={LOOP_VIDEO}
              actSrc={pickExchange?.clips?.[0]}
              question={pickExchange?.question || ""}
              onDone={handlePickAnswerEnded}
              paused={paused}
              onOpenPauseMenu={() => setPaused(true)}
              showProceed={phase === "pending"}
              onProceed={handleTapToContinue}
              isProceedFading={tapFading}
            />
          </div>
        ) : (
          <div className="scene-content">
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
