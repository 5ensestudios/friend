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
const LOOP_VIDEO = "/videos/Loop-1.mp4";

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
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["/videos/Louis/Louis Intro/Louis Intro 1.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["/videos/Louis/Louis Intro/Louis Intro 2.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["/videos/Louis/Louis Intro/Louis Intro 3.mp4"] },
  ],
  may: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["/videos/May/May Intro/May Intro 1.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["/videos/May/May Intro/May Intro 2.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["/videos/May/May Intro/May Intro 3.mp4"] },
  ],
  johnny: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["/videos/Johnny/Johnny Intro/Johnny Intro 1.mp4"] },
    { question: "Detective: Just state your name.", clips: ["/videos/Johnny/Johnny Intro/Johnny Intro 2.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["/videos/Johnny/Johnny Intro/Johnny Intro 3.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["/videos/Johnny/Johnny Intro/Johnny Intro 4.mp4"] },
  ],
  richard: [
    { question: "Detective: Before we start, for the record, can you state your name.", clips: ["/videos/Richard/Richie Intro/Richie Intro 1.mp4"] },
    { question: "Detective: Do you have any idea why we're here?", clips: ["/videos/Richard/Richie Intro/Richie Intro 2.mp4"] },
    { question: "Detective: Your friend has passed away.", clips: ["/videos/Richard/Richie Intro/Richie Intro 3.mp4"] },
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
            { question: "Detective: What happened last night?", clips: ["/videos/May/May Act 1/May Act 1 - 1.1.mp4"], skipPause: true },
            { question: "Detective: Can we continue?", clips: ["/videos/May/May Act 1/May Act 1 - 1.2.mp4"] },
            { question: "Detective: What was the prank?", clips: ["/videos/May/May Act 1/May Act 1 - 1.3.mp4"] },
          ],
          johnny: [
            { question: "Detective: What happened last night?", clips: ["/videos/Johnny/Johnny Act 1/Johnny Act 1 - 1.1.mp4"] },
            { question: "Detective: Payback for what?", clips: ["/videos/Johnny/Johnny Act 1/Johnny Act 1 - 1.2.mp4"] },
          ],
          louis: [
            { question: "Detective: What happened last night?", clips: ["/videos/Louis/Louis Act 1/Louis Act 1 - 1.1.mp4"] },
            { question: "Detective: What did she suggest?", clips: ["/videos/Louis/Louis Act 1/Louis Act 1 - 1.2.mp4", "/videos/Louis/Louis Act 1/Louis Act 1 - 1.3.mp4"] },
          ],
          richard: [
            { question: "Detective: What happened last night?", clips: ["/videos/Richard/Richie Act 1/Richie Act 1 - 1.1.mp4"] },
            { question: "Detective: Who came up with the idea?", clips: ["/videos/Richard/Richie Act 1/Richie Act 1 - 1.2.mp4"] },
          ],
        },
      },
      {
        label: "The pills found at the crime scene — where did they come from?",
        characters: {
          may:     [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["/videos/May/May Act 1/May Act 1 - 2.mp4"] }],
          johnny:  [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["/videos/Johnny/Johnny Act 1/Johnny Act 1 - 2.mp4"] }],
          louis:   [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["/videos/Louis/Louis Act 1/Louis Act 1 - 2.mp4"] }],
          richard: [{ question: "Detective: The pills found at the crime scene — where did they come from?", clips: ["/videos/Richard/Richie Act 1/Richie Act 1 - 2.mp4"] }],
        },
      },
      {
        label: "Can you recount the whole night for me?",
        characters: {
          may:     [{ question: "Detective: Can you recount the whole night for me?", clips: ["/videos/May/May Act 1/May Act 1 - 3.mp4"] }],
          johnny:  [{ question: "Detective: Can you recount the whole night for me?", clips: ["/videos/Johnny/Johnny Act 1/Johnny Act 1 - 3.mp4"] }],
          louis:   [{ question: "Detective: Can you recount the whole night for me?", clips: ["/videos/Louis/Louis Act 1/Louis Act 1 - 3.mp4"] }],
          richard: [{ question: "Detective: Can you recount the whole night for me?", clips: ["/videos/Richard/Richie Act 1/Richie Act 1 - 3.mp4"] }],
        },
      },
      {
        label: "Do you think any one of you could have had the intention to want this?",
        characters: {
          may:     [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["/videos/May/May Act 1/May Act 1 - 4.mp4"] }],
          johnny:  [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["/videos/Johnny/Johnny Act 1/Johnny Act 1 - 4.mp4"] }],
          louis:   [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["/videos/Louis/Louis Act 1/Louis Act 1 - 4.mp4"] }],
          richard: [{ question: "Detective: Do you think any one of you could have had the intention to want this?", clips: ["/videos/Richard/Richie Act 1/Richie Act 1 - 4.mp4"] }],
        },
      },
    ],
  },
  2: {
    questions: [
      {
        label: "What did Chris do?",
        characters: {
          may:     [{ question: "Detective: What did Chris do?", clips: ["/videos/May/May Act 2/May Act 2 - 1.mp4"] }],
          johnny:  [{ question: "Detective: What did Chris do?", clips: ["/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.1.mp4", "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.2.mp4", "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.3.mp4"] }],
          louis:   [{ question: "Detective: What did Chris do?", clips: ["/videos/Louis/Louis Act 2/Louis Act 2 - 1.1.mp4", "/videos/Louis/Louis Act 2/Louis Act 2 - 1.2.mp4"] }],
          richard: [{ question: "Detective: What did Chris do?", clips: ["/videos/Richard/Richie Act 2/Richie Act 2 - 1.1.mp4", "/videos/Richard/Richie Act 2/Richie Act 2 - 1.2.mp4"] }],
        },
      },
      {
        label: "What is the group usually like with Chris around?",
        characters: {
          may:     [{ question: "Detective: What is the group usually like with Chris around?", clips: ["/videos/May/May Act 2/May Act 2 - 2.mp4"] }],
          johnny:  [{ question: "Detective: What is the group usually like with Chris around?", clips: ["/videos/Johnny/Johnny Act 2/Johnny Act 2 - 2.mp4"] }],
          louis:   [{ question: "Detective: What is the group usually like with Chris around?", clips: ["/videos/Louis/Louis Act 2/Louis Act 2 - 2.mp4"] }],
          richard: [{ question: "Detective: What is the group usually like with Chris around?", clips: ["/videos/Richard/Richie Act 2/Richie Act 2 - 2.mp4"] }],
        },
      },
      {
        label: "What is your relationship like with Chris?",
        characters: {
          may:     [{ question: "Detective: What is your relationship like with Chris?", clips: ["/videos/May/May Act 2/May Act 2 - 3.mp4"] }],
          johnny:  [{ question: "Detective: What is your relationship like with Chris?", clips: ["/videos/Johnny/Johnny Act 2/Johnny Act 2 - 3.1.mp4", "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 3.2.mp4"] }],
          louis:   [{ question: "Detective: What is your relationship like with Chris?", clips: ["/videos/Louis/Louis Act 2/Louis Act 2 - 3.mp4"] }],
          richard: [{ question: "Detective: What is your relationship like with Chris?", clips: ["/videos/Richard/Richie Act 2/Richie Act 2 - 3.mp4"] }],
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

/* ════════════════════════════════════
   VideoSequence
   Plays an array of clips in order.
   onEnded fires only after the last clip finishes.
   ════════════════════════════════════ */
function VideoSequence({ clips, autoPlay = false, controls = false, loop = false, onEnded, paused = false }) {
  const [clipIndex, setClipIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setClipIndex(0);
  }, [clips]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (paused) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
  }, [paused]);

  function handleClipEnded() {
    const next = clipIndex + 1;
    if (next < clips.length) {
      setClipIndex(next);
    } else {
      onEnded?.();
    }
  }

  const src = clips?.[clipIndex] ?? "";

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      autoPlay={autoPlay}
      controls={controls}
      loop={loop}
      playsInline
      onEnded={handleClipEnded}
    />
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
            <div className={`video-stage${phase === "pending" ? " video-stage--pending" : ""}`}>
              {phase === "question" && (
                <>
                  <VideoSequence clips={[LOOP_VIDEO]} autoPlay controls={false} loop paused={paused} />
                  <video className="question-bg-video" src={LOOP_VIDEO} autoPlay loop muted playsInline />
                  <div className="question-overlay">
                    <p className="question-text">
                      <TypewriterLine
                        key={`intro-${introChar}-${introExIdx}`}
                        text={introExchange?.question || ""}
                        speed={55}
                        onDone={() => setIsTypingDone(true)}
                        paused={paused}
                      />
                    </p>
                  </div>
                </>
              )}
              {(phase === "answer" || phase === "pending") && (
                <>
                  <VideoSequence
                    key={`intro-ans-${introChar}-${introExIdx}`}
                    clips={introExchange?.clips || []}
                    autoPlay
                    controls={false}
                    onEnded={handleIntroAnswerEnded}
                    paused={paused || phase === "pending"}
                  />
                  {phase === "pending" && (
                    <div className={`pending-overlay${tapFading ? " fading" : ""}`} onClick={handleTapToContinue}>
                      <span className="tap-to-continue">tap to continue</span>
                    </div>
                  )}
                </>
              )}
            </div>
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
            <div className={`video-stage${phase === "pending" ? " video-stage--pending" : ""}`}>
              {phase === "question" && (
                <>
                  <VideoSequence clips={[LOOP_VIDEO]} autoPlay controls={false} loop paused={paused} />
                  <video className="question-bg-video" src={LOOP_VIDEO} autoPlay loop muted playsInline />
                  <div className="question-overlay">
                    <p className="question-text">
                      <TypewriterLine
                        key={`act${actNumber}-${qIdx}-${activePick}-${pickSubIdx}`}
                        text={pickExchange?.question || ""}
                        speed={55}
                        onDone={() => setIsTypingDone(true)}
                        paused={paused}
                      />
                    </p>
                  </div>
                </>
              )}
              {(phase === "answer" || phase === "pending") && (
                <>
                  <VideoSequence
                    key={`act${actNumber}-ans-${qIdx}-${activePick}-${pickSubIdx}`}
                    clips={pickExchange?.clips || []}
                    autoPlay
                    controls={false}
                    onEnded={handlePickAnswerEnded}
                    paused={paused || phase === "pending"}
                  />
                  {phase === "pending" && (
                    <div className={`pending-overlay${tapFading ? " fading" : ""}`} onClick={handleTapToContinue}>
                      <span className="tap-to-continue">tap to continue</span>
                    </div>
                  )}
                </>
              )}
            </div>
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
