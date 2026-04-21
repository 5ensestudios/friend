import { useEffect, useState } from "react";
import "../../styles/components/emailModal.css";

export default function EmailModal({ emails = [], activeMailId = null, onClose }) {
  const sortedEmails = Array.isArray(emails) ? emails : [];

  const [selectedMailId, setSelectedMailId] = useState(() => activeMailId ?? null);

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

  const previewMetaLabel = selectedMail?.previewMeta?.label || "To";
  const previewMetaValue = selectedMail?.previewMeta?.value || "pr0xy@securemail.net";

  if (!selectedMail) return null;

  return (
    <div className="email-modal" role="dialog" aria-live="polite" aria-label="Mail notification">
      <div className="email-modal-header">
        <div className="email-modal-title-wrap">
          <img src="/icons/Mail.png" alt="" className="email-modal-title-icon" />
          <span className="email-modal-title">Mail Notification</span>
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
            <p><strong>{previewMetaLabel}:</strong> {previewMetaValue}</p>
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
