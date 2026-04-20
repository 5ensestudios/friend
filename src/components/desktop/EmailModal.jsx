import { useEffect, useState, useRef } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/emailModal.css";

export default function EmailModal({ emails = [], activeMailId = null, onClose }) {
  const sortedEmails = Array.isArray(emails) ? emails : [];

  const [selectedMailId, setSelectedMailId] = useState(() => activeMailId ?? null);
  const { play } = useSound();
  const popupPlayedRef = useRef(false);

  useEffect(() => {
    if (!popupPlayedRef.current && sortedEmails.length > 0) {
      play("emailPopup");
      popupPlayedRef.current = true;
    }
  }, [play, sortedEmails.length]);

  useEffect(() => {
    if (!sortedEmails.length) return;

    const currentIsValid = selectedMailId && sortedEmails.some(mail => mail.id === selectedMailId);
    if (currentIsValid) return;

    if (activeMailId && sortedEmails.some(mail => mail.id === activeMailId)) {
      setSelectedMailId(activeMailId);
      return;
    }

    setSelectedMailId(sortedEmails[sortedEmails.length - 1].id);
  }, [activeMailId, sortedEmails, selectedMailId]);

  const selectedMail =
    sortedEmails.find(mail => mail.id === selectedMailId) ||
    sortedEmails[sortedEmails.length - 1] ||
    null;

  if (!selectedMail) return null;

  return (
    <div className="email-modal" role="dialog" aria-live="polite" aria-label="Mail notification">
      <div className="email-modal-header">
        <div className="email-modal-title-wrap">
          <img src="/icons/Mail.png" alt="" className="email-modal-title-icon" />
          <span className="email-modal-title">CASE FILES</span>
        </div>
        <button
          className="email-modal-close"
          type="button"
          aria-label="Close mail"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="email-modal-content">
        <div className="email-modal-list" aria-label="Mail list">
          {sortedEmails.map(mail => (
            <button
              key={mail.id}
              type="button"
              className={`email-modal-row ${selectedMail.id === mail.id ? "selected" : ""}`}
              onClick={() => setSelectedMailId(mail.id)}
              title={`${mail.from} - ${mail.subject}`}
            >
              <span className="email-modal-from">{mail.from}</span>
              <span className="email-modal-subject">{mail.subject}</span>
            </button>
          ))}
        </div>

        <div className="email-modal-preview">
          <div className="email-modal-preview-header">Corrupted files</div>
          <div className="email-modal-preview-body">
            <p><strong>To:</strong> pr0xy@unusual.net</p>
            <p><strong>{selectedMail.subject}</strong></p>

            {selectedMail.lines.map((line, index) => (
              line ? (
                <p key={`${selectedMail.id}-${index}`}>{line}</p>
              ) : (
                <div key={`${selectedMail.id}-${index}`} className="email-modal-gap" />
              )
            ))}

            <p><strong>Attachment:</strong> {selectedMail.attachment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
