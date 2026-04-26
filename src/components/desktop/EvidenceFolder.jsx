import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import FileItem from "./FileItem";
import { useSound } from "../../hooks/useSound";
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
    name: "Dispatch Call.mp3",
    type: "file",
    icon: "/icons/Audio Player.png",
    asset_path: "/evidence/Dispatch%20Call.mp3",
    file_type: "MP3 Audio",
    file_size: "3.2 MB",
    created_date: "03-07-2016 01:12",
    description: "Recorded dispatch call audio.",
  },
  {
    id: "evidence_04",
    name: "medical_examiner_report.pdf",
    type: "file",
    icon: "/icons/Document.png",
    asset_path: "/evidence/medical_examiner_report.png",
    file_type: "PDF Image",
    file_size: "2.4 MB",
    created_date: "03-07-2016 01:48",
    description: "Medical examiner report image (asset linked).",
  },
  {
    id: "evidence_05",
    name: "scene_item_zolpidem.png",
    type: "file",
    icon: "/icons/Image.png",
    asset_path: "/evidence/scene_item _zolpidem.png",
    file_type: "PNG Image",
    file_size: "1.1 MB",
    created_date: "03-07-2016 02:12",
    description: "Scene item photo containing zolpidem evidence (placeholder, asset pending).",
  },
  {
    id: "evidence_06",
    name: "scene_victim_chris.png",
    type: "file",
    icon: "/icons/Image.png",
    asset_path: "/evidence/scene_victim_chris.png",
    file_type: "PNG Image",
    file_size: "2.0 MB",
    created_date: "03-07-2016 02:48",
    description: "Victim evidence photo (placeholder, asset pending).",
  },
  {
    id: "evidence_07",
    name: "search_history_log.csv",
    type: "file",
    icon: "/icons/Document.png",
    asset_path: "/evidence/search_history_log.png",
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
    asset_path: "/evidence/pharmacy_prescription.png",
    file_type: "PDF Document",
    file_size: "1.7 MB",
    created_date: "03-07-2016 03:48",
    description: "Pharmacy prescription record (placeholder, asset pending).",
  },
];

export default function EvidenceFolder({ onClose, onDragMouseDown }) {
  const [selectedFile, setSelectedFile] = useState(EVIDENCE_FILES[0]);
  const [openedFile, setOpenedFile] = useState(null);
  const [openedAudioFile, setOpenedAudioFile] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const { play } = useSound();

  function isImageFile(file) {
    return /\.(png|jpe?g|gif|webp)$/i.test(file.asset_path || "");
  }

  function isAudioFile(file) {
    return /\.(mp3|wav|ogg)$/i.test(file.asset_path || "");
  }

  function handleOpenFile(file) {
    if (!file.asset_path) {
      return;
    }

    if (isImageFile(file)) {
      setOpenedFile(file);
      return;
    }

    if (isAudioFile(file)) {
      setOpenedAudioFile(file);
      return;
    }

    window.open(file.asset_path, "_blank", "noopener,noreferrer");
  }

  function closeAudioPopup() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setOpenedAudioFile(null);
  }

  function toggleAudioPlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      setIsAudioPlaying(true);
      return;
    }

    audio.pause();
    setIsAudioPlaying(false);
  }

  function handleAudioSeek(event) {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setAudioProgress(nextTime);
  }

  useEffect(() => {
    if (!openedAudioFile) return;

    const audio = new Audio(openedAudioFile.asset_path);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.volume = 0.4;

    function updateMetadata() {
      setAudioDuration(audio.duration || 1);
      setAudioProgress(audio.currentTime || 0);
    }

    function updateProgress() {
      setAudioProgress(audio.currentTime || 0);
    }

    function handleEnded() {
      setIsAudioPlaying(false);
    }

    audio.addEventListener("loadedmetadata", updateMetadata);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    audio.load();

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      setIsAudioPlaying(false);
      setAudioProgress(0);
      setAudioDuration(1);
      audio.removeEventListener("loadedmetadata", updateMetadata);
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [openedAudioFile]);

  const audioFillPercent = Math.min(100, (audioProgress / (audioDuration || 1)) * 100);
  const audioProgressStyle = {
    background: `linear-gradient(to right, #b33838 0%, #b33838 ${audioFillPercent}%, #ffffff ${audioFillPercent}%, #ffffff 100%)`,
  };

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
          onClick={() => {
            play("click_desktop");
            onClose();
          }}
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
              playClickSound
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
          onClick={() => {
            play("click_desktop");
            setOpenedFile(null);
          }}
          role="dialog"
          aria-label="Evidence image preview"
        >
          <div className="evidence-image-popup-frame" onClick={event => event.stopPropagation()}>
            <button
              className="evidence-image-popup-close"
              type="button"
              aria-label="Close image preview"
              onClick={() => {
                play("click_desktop");
                setOpenedFile(null);
              }}
            >
              ✕
            </button>
            <img
              src={openedFile.asset_path}
              alt={openedFile.name}
              className={`evidence-image-popup-photo${openedFile.id === "evidence_04" ? " medical-report" : ""}`}
            />
          </div>
        </div>,
        document.body
      )}

      {openedAudioFile && typeof document !== "undefined" && createPortal(
        <div
          className="evidence-audio-popup-backdrop"
          onClick={closeAudioPopup}
          role="dialog"
          aria-label="Evidence audio preview"
        >
          <div className="evidence-audio-popup" onClick={event => event.stopPropagation()}>
            <div className="evidence-audio-popup-header">
              <div className="evidence-audio-popup-title-group">
                <img
                  src="/icons/Audio Player.png"
                  alt="Audio Player icon"
                  className="evidence-audio-popup-icon"
                />
                <div className="evidence-audio-popup-title">Audio Player</div>
              </div>
              <button
                className="evidence-audio-popup-close"
                type="button"
                aria-label="Close audio preview"
                onClick={closeAudioPopup}
              >
                ✕
              </button>
            </div>
            <div className="evidence-audio-popup-body">
            </div>
            <div className="evidence-audio-popup-footer">
              <div className="evidence-audio-popup-filename-bar">
                <span className="evidence-audio-popup-track-label">{openedAudioFile.name}</span>
              </div>
              <div className="evidence-audio-popup-controls">
                <button
                  className="evidence-audio-play"
                  type="button"
                  onClick={toggleAudioPlayback}
                  aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                >
                  {isAudioPlaying ? "❚❚" : "▶"}
                </button>
                <input
                  className="evidence-audio-progress"
                  type="range"
                  min="0"
                  max={audioDuration || 1}
                  value={audioProgress}
                  step="0.01"
                  onChange={handleAudioSeek}
                  onClick={e => e.stopPropagation()}
                  style={audioProgressStyle}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
