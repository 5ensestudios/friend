import { createPortal } from "react-dom";
import { useState } from "react";
import FileItem from "./FileItem";
import "../../styles/components/fileExplorer.css";
import "../../styles/components/evidenceFolder.css";

const EVIDENCE_FILES = [
  {
    id: "evidence_01",
    name: "chat_extraction_01.png",
    type: "file",
    icon: "/icons/Image.png",
    asset_path: "/evidence/chat_extraction_01.png",
    file_type: "PNG Image",
    file_size: "1.4 MB",
    created_date: "03-07-2016 00:12",
    description: "Exported chat extraction image 01 (asset linked).",
  },
  {
    id: "evidence_02",
    name: "chat_extraction_02.png",
    type: "file",
    icon: "/icons/Image.png",
    asset_path: "/evidence/chat_extraction_02.png",
    file_type: "PNG Image",
    file_size: "1.8 MB",
    created_date: "03-07-2016 00:48",
    description: "Exported chat extraction image 02 (asset linked).",
  },
  {
    id: "evidence_03",
    name: "dispatch_call.mp3",
    type: "file",
    icon: "/icons/Music Player.png",
    file_type: "MP3 Audio",
    file_size: "3.2 MB",
    created_date: "03-07-2016 01:12",
    description: "Recorded dispatch call audio (placeholder, asset pending).",
  },
  {
    id: "evidence_04",
    name: "medical_examiner_report-1.png",
    type: "file",
    icon: "/icons/Image.png",
    asset_path: "/evidence/medical_examiner_report-1.png",
    file_type: "PNG Image",
    file_size: "2.4 MB",
    created_date: "03-07-2016 01:48",
    description: "Medical examiner report image (asset linked).",
  },
  {
    id: "evidence_05",
    name: "scene_item_zolpidem.png",
    type: "file",
    icon: "/icons/Image.png",
    file_type: "PNG Image",
    file_size: "1.1 MB",
    created_date: "03-07-2016 02:12",
    description: "Scene item photo containing zolpidem evidence (placeholder, asset pending).",
  },
  {
    id: "evidence_06",
    name: "victim.png",
    type: "file",
    icon: "/icons/Image.png",
    file_type: "PNG Image",
    file_size: "2.0 MB",
    created_date: "03-07-2016 02:48",
    description: "Victim evidence photo (placeholder, asset pending).",
  },
  {
    id: "evidence_07",
    name: "search_history_log.csv",
    type: "file",
    icon: "/icons/Image.png",
    file_type: "CSV File",
    file_size: "0.6 MB",
    created_date: "03-07-2016 03:12",
    description: "Search history export log (placeholder, asset pending).",
  },
  {
    id: "evidence_08",
    name: "pharmacy_prescription.pdf",
    type: "file",
    icon: "/icons/Document.png",
    file_type: "PDF Document",
    file_size: "1.7 MB",
    created_date: "03-07-2016 03:48",
    description: "Pharmacy prescription record (placeholder, asset pending).",
  },
];

export default function EvidenceFolder({ onClose, onDragMouseDown }) {
  const [selectedFile, setSelectedFile] = useState(EVIDENCE_FILES[0]);
  const [openedFile, setOpenedFile] = useState(null);

  function isImageFile(file) {
    return /\.(png|jpe?g|gif|webp)$/i.test(file.name);
  }

  function handleOpenFile(file) {
    if (!file.asset_path) {
      return;
    }

    if (isImageFile(file)) {
      setOpenedFile(file);
      return;
    }

    window.open(file.asset_path, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="evidence-folder file-explorer-window">
      <div className="window-header">
        <div className="window-title-bar" onMouseDown={onDragMouseDown} style={{ cursor: "grab" }}>
          <button
            className="window-nav-button"
            disabled
            title="Back"
          >
            ←
          </button>
          <button
            className="window-nav-button"
            disabled
            title="Forward"
          >
            →
          </button>
          <span className="window-title">#2016-0307-CHRIS Evidence</span>
        </div>
        <button
          className="window-close"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="window-content">
        <div className="file-list evidence-file-list">
          {EVIDENCE_FILES.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onDoubleClick={() => handleOpenFile(file)}
              onSelect={() => setSelectedFile(file)}
              isSelected={selectedFile?.id === file.id}
              isLocked={false}
            />
          ))}
        </div>

        <div className="file-preview evidence-preview-panel">
          <div className="preview-header">Properties</div>
          <div className="preview-content">
            {selectedFile && (
              <>
                <p>
                  <span className="preview-label">Name:</span> <span className="preview-value">{selectedFile.name}</span>
                </p>
                <p>
                  <span className="preview-label">Date Modified:</span> <span className="preview-value">{selectedFile.created_date}</span>
                </p>
                <p>
                  <span className="preview-label">File Type:</span> <span className="preview-value">{selectedFile.file_type}</span>
                </p>
                <p>
                  <span className="preview-label">Size:</span> <span className="preview-value">{selectedFile.file_size}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      </div>

      {openedFile && typeof document !== "undefined" && createPortal(
        <div
          className="evidence-image-popup-backdrop"
          onClick={() => setOpenedFile(null)}
          role="dialog"
          aria-label="Evidence image preview"
        >
          <div className="evidence-image-popup-frame" onClick={event => event.stopPropagation()}>
            <button
              className="evidence-image-popup-close"
              type="button"
              aria-label="Close image preview"
              onClick={() => setOpenedFile(null)}
            >
              ✕
            </button>
            <img
              src={openedFile.asset_path}
              alt={openedFile.name}
              className="evidence-image-popup-photo"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
