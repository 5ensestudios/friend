import { useEffect } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/emailNotificationPopup.css";

export default function EmailNotificationPopup({ mail, onClose }) {
  const { play } = useSound();

  useEffect(() => {
    if (!mail) return;
    play("emailPopup");

    const autoClose = setTimeout(() => {
      onClose?.();
    }, 5500);

    return () => clearTimeout(autoClose);
  }, [mail, onClose, play]);

  if (!mail) return null;

  return (
    <div className="email-notification-overlay" role="status" aria-live="polite">
      <div className="email-notification">
        <div className="email-notification-top">
          <div className="email-notification-title-wrap">
            <img src="/icons/Mail.png" alt="" className="email-notification-icon" />
            <span className="email-notification-title">Mail Notification</span>
          </div>
          <button
            type="button"
            className="email-notification-close"
            onClick={onClose}
            aria-label="Dismiss mail notification"
          >
            ✕
          </button>
        </div>

        <div className="email-notification-body">
          <p className="email-notification-from"><strong>From:</strong> {mail.from}</p>
          <p className="email-notification-subject"><strong>Subject:</strong> {mail.subject}</p>

          {Array.isArray(mail.lines) && mail.lines.map((line, index) => (
            line ? (
              <p key={`${mail.id}-line-${index}`} className="email-notification-line">{line}</p>
            ) : (
              <div key={`${mail.id}-gap-${index}`} className="email-notification-gap" />
            )
          ))}

          <p className="email-notification-attachment"><strong>Attachment:</strong> {mail.attachment}</p>
        </div>
      </div>
    </div>
  );
}
