import { useEffect, useState } from "react";
import "../styles/pages/tutorialPage.css";

export default function TutorialPage({ onBack }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  function handleBack() {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);
    setTimeout(() => onBack?.(), 500);
  }

  return (
    <div
      className={`tutorial-page ${isVisible ? "tutorial-page--visible" : ""} ${isLeaving ? "tutorial-page--leaving" : ""}`}
      role="dialog"
      aria-label="How to play"
    >
      <div className="tutorial-content">
        <h1 className="tutorial-title">How to Play</h1>

        <section className="tutorial-section">
          <h2 className="tutorial-heading">Navigate the Interface</h2>
          <p className="tutorial-copy">
            The system operates like a real computer desktop right in your browser. You will need to
            manually open files and folders to begin.
          </p>
        </section>

        <section className="tutorial-section">
          <h2 className="tutorial-heading">Watch the Footage</h2>
          <p className="tutorial-copy">
            The core piece to your investigation are the video files. Watch the recovered interviews
            closely to piece together the timeline of what happened.
          </p>
        </section>

        <section className="tutorial-section">
          <h2 className="tutorial-heading">Choose Your Perspectives</h2>
          <p className="tutorial-copy">
            You will not hear everyone&apos;s side of the story. As you dig deeper, your access becomes
            restricted. You will frequently be forced to choose. Decide whose perspective you need-or
            suspect-the most.
          </p>
        </section>

        <section className="tutorial-section">
          <h2 className="tutorial-heading">Connect the Pieces</h2>
          <p className="tutorial-copy">
            Explore the files to gain context, navigate the story, and ultimately make your choice. The
            rest is for you to uncover.
          </p>
        </section>

        <button className="tutorial-back" type="button" onClick={handleBack}>
          BACK
        </button>
      </div>
    </div>
  );
}
