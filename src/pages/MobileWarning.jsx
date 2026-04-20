import "../styles/pages/mobileWarning.css";

export default function MobileWarning() {
  return (
    <div className="mobile-warning">
      <div className="mobile-warning-content">
        <div className="mobile-warning-logo-wrap">
          <img
            src="/Images/The Friend Logo.png"
            alt="The Friend"
            className="mobile-warning-logo"
          />
        </div>
        <div className="mobile-warning-text-wrap">
          <p className="mobile-warning-text-large">
            For the best experience, play on a larger screen.
          </p>
          <p className="mobile-warning-text-small">
            © 2026 5ENSE STUDIOS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
