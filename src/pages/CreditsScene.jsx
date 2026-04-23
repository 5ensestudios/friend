import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/pages/creditsScene.css";

const CONTENT_FADE_MS = 700;
const CREDITS_BGM_SRC = "/Friend SFX/Black Static Halo.mp3";
const CREDITS_BGM_DELAY_MS = 5000;
const CREDITS_BGM_VOLUME = 0.8;

const SLIDES = [
  {
    id: "blank",
    type: "blank",
    holdMs: 5000,
  },
  {
    id: "friend-logo",
    type: "logo",
    src: "/Images/The Friend Logo.png",
    alt: "The Friend logo",
    holdMs: 10000,
  },
  {
    id: "team",
    type: "team",
    holdMs: 12000,
  },
  {
    id: "eana",
    type: "person",
    name: "EANA MAE TAGANA",
    role: "Game Director, Visual Designer, & Writer",
    holdMs: 8000,
  },
  {
    id: "frederick",
    type: "person",
    name: "FREDERICK ARAGO",
    role: "Media Producer & Post-Production Lead",
    holdMs: 8000,
  },
  {
    id: "nathan",
    type: "person",
    name: "NATHAN BARTOLO",
    role: "Lead Developer & Sound Designer",
    holdMs: 8000,
  },
  {
    id: "john",
    type: "person",
    name: "JOHN RICHARD ROBLE",
    role: "Production Assistance & Audio Support",
    holdMs: 8000,
  },
  {
    id: "christian",
    type: "person",
    name: "CHRISTIAN DARREL TAN",
    role: "Production Assistance & Development Support",
    holdMs: 8000,
  },
  {
    id: "studio-logo",
    type: "logo",
    src: "/Images/5ENSE Logo.png",
    alt: "5ENSE Studios logo",
    holdMs: 30000,
  },
];

const TEAM_ROWS = [
  ["NATHAN BARTOLO", "Louis"],
  ["EANA MAE TAGANA", "May"],
  ["FREDERICK ARAGO", "Johnny"],
  ["JOHN RICHARD ROBLE", "Richard"],
  ["CHRISTIAN DARREL TAN", "Chris"],
];

function TeamCredits() {
  return (
    <div className="credits-team" role="group" aria-label="Team credits">
      {TEAM_ROWS.map(([name, role]) => (
        <div key={name + role} className="credits-team-row">
          <p className="credits-team-name">{name}</p>
          <p className="credits-team-role">{role}</p>
        </div>
        ))}
    </div>
  );
}

function SlideContent({ slide }) {
  if (!slide || slide.type === "blank") {
    return null;
  }

  if (slide.type === "logo") {
    return (
      <div className="credits-logo-wrap">
        <img
          className={`credits-logo ${slide.id === "studio-logo" ? "credits-logo--studio" : ""}`}
          src={slide.src}
          alt={slide.alt}
        />
      </div>
    );
  }

  if (slide.type === "team") {
    return <TeamCredits />;
  }

  return (
    <div className="credits-person" role="group" aria-label={slide.name + " credits"}>
      <h1 className="credits-person-name">{slide.name}</h1>
      <p className="credits-person-role">{slide.role}</p>
    </div>
  );
}

export default function CreditsScene({ onDone }) {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isPreviewMode = import.meta.env.DEV && searchParams.get("creditsPreview") === "1";
  const initialSlide = Number.parseInt(searchParams.get("creditsSlide") || "0", 10);
  const safeInitialSlide = Number.isFinite(initialSlide)
    ? Math.max(0, Math.min(SLIDES.length - 1, initialSlide))
    : 0;

  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState("in");
  const onDoneRef = useRef(onDone);
  const creditsBgmRef = useRef(null);
  const creditsBgmResumeRef = useRef(null);
  const slide = useMemo(() => SLIDES[slideIndex], [slideIndex]);

  useEffect(() => {
    if (!isPreviewMode) return;
    setSlideIndex(safeInitialSlide);
  }, [isPreviewMode, safeInitialSlide]);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const audio = new Audio(CREDITS_BGM_SRC);
    audio.loop = true;
    audio.volume = CREDITS_BGM_VOLUME;
    creditsBgmRef.current = audio;

    const startTimer = setTimeout(() => {
      audio.play().catch(() => {
        const resume = () => {
          audio.play().catch(() => {});
          window.removeEventListener("click", resume);
          creditsBgmResumeRef.current = null;
        };

        creditsBgmResumeRef.current = resume;
        window.addEventListener("click", resume, { once: true });
      });
    }, CREDITS_BGM_DELAY_MS);

    return () => {
      clearTimeout(startTimer);

      if (creditsBgmResumeRef.current) {
        window.removeEventListener("click", creditsBgmResumeRef.current);
        creditsBgmResumeRef.current = null;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      audio.src = "";
      audio.load();
      creditsBgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isPreviewMode) {
      setPhase("in");
      return;
    }

    if (!slide) {
      onDoneRef.current?.();
      return;
    }

    setPhase("in");

    const fadeOutTimer = setTimeout(() => {
      setPhase("out");
    }, slide.holdMs);

    const nextTimer = setTimeout(() => {
      if (slideIndex >= SLIDES.length - 1) {
        onDoneRef.current?.();
        return;
      }
      setSlideIndex((prev) => prev + 1);
    }, slide.holdMs + CONTENT_FADE_MS);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextTimer);
    };
  }, [isPreviewMode, slide, slideIndex]);

  useEffect(() => {
    if (!isPreviewMode) return;

    function handlePreviewKeys(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1));
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSlideIndex((prev) => Math.max(0, prev - 1));
      }

      if (event.key === "Home") {
        event.preventDefault();
        setSlideIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setSlideIndex(SLIDES.length - 1);
      }
    }

    window.addEventListener("keydown", handlePreviewKeys);
    return () => window.removeEventListener("keydown", handlePreviewKeys);
  }, [isPreviewMode]);

  return (
    <div className="credits-scene" aria-label="End credits" role="dialog">
      <div className={`credits-content credits-content--${phase}`}>
        <SlideContent slide={slide} />
      </div>
      {isPreviewMode && (
        <div className="credits-preview-hud" aria-live="polite">
          <span>Preview</span>
          <span>{slideIndex + 1}/{SLIDES.length}</span>
          <span>←/→ switch</span>
        </div>
      )}
    </div>
  );
}
