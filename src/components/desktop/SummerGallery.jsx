import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import FileItem from "./FileItem";
import "../../styles/components/fileExplorer.css";
import "../../styles/components/brunsonGallery.css";

const SUMMER_IMAGE_NAMES = [
  "img_8865.png",
  "img_8867.png",
  "img_8868.png",
  "img_8869.png",
  "img_8870.png",
  "img_8871.png",
  "img_8873.png",
  "img_8874.png",
];

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatDateTime(date) {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}-${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function randomDateInRange(start, end) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const randomMs = Math.floor(Math.random() * (endMs - startMs + 1)) + startMs;
  return formatDateTime(new Date(randomMs));
}

function buildImageEntries() {
  const dateStart = new Date("2021-06-01T07:30:00");
  const dateEnd = new Date("2021-08-31T23:15:00");
  return SUMMER_IMAGE_NAMES.map((name, index) => ({
    id: `summer_${index + 1}`,
    name,
    type: "image",
    icon: "/icons/Image.png",
    file_type: "PNG image",
    file_size: generateFakeSize(),
    created_date: randomDateInRange(dateStart, dateEnd),
    description: "Summer 2021 photo",
    src: encodeURI(`/Summer 2021/${name}`),
  }));
}

function generateFakeSize() {
  const mb = (Math.random() * 4 + 1).toFixed(2); // 1MB–5MB
  return `${mb} MB`;
}

export default function SummerGallery({ onClose, onDragMouseDown }) {
  const images = useMemo(() => buildImageEntries(), []);
  const [selectedFile, setSelectedFile] = useState(images[0] || null);
  const [openedImage, setOpenedImage] = useState(null);

  function handleOpenImage(file) {
    setOpenedImage(file);
  }

  return (
    <>
      <div className="file-explorer-window brunson-gallery-window">
        <div className="window-header">
          <div className="window-title-bar" onMouseDown={onDragMouseDown} style={{ cursor: "grab" }}>
            <button className="window-nav-button" disabled title="Back">←</button>
            <button className="window-nav-button" disabled title="Forward">→</button>
            <span className="window-title">Summer 2021</span>
          </div>
          <button className="window-close" onClick={onClose} title="Close">✕</button>
        </div>

        <div className="window-content">
          <div className="file-list brunson-gallery-list">
            {images.map(item => (
              <FileItem
                key={item.id}
                file={item}
                isLocked={false}
                onDoubleClick={() => handleOpenImage(item)}
                onSelect={() => setSelectedFile(item)}
                isSelected={selectedFile?.id === item.id}
              />
            ))}
          </div>

          <div className="file-preview brunson-gallery-preview">
            <div className="preview-header">Properties</div>
            <div className="preview-content">
              {selectedFile ? (
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
                    <span className="preview-label">File Size:</span> <span className="preview-value">{selectedFile.file_size}</span>
                  </p>
                </>
              ) : (
                <p>Select a photo to preview its details.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {openedImage && typeof document !== "undefined" && createPortal(
        <div
          className="brunson-image-popup-backdrop"
          onClick={() => setOpenedImage(null)}
          role="dialog"
          aria-label="Summer 2021 image preview"
        >
          <div className="brunson-image-popup-frame" onClick={event => event.stopPropagation()}>
            <button
              className="brunson-image-popup-close"
              type="button"
              aria-label="Close image preview"
              onClick={() => setOpenedImage(null)}
            >
              ✕
            </button>
            <img
              src={openedImage.src}
              alt={openedImage.name}
              className="brunson-image-popup-photo"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
