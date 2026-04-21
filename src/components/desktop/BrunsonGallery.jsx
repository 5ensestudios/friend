import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import FileItem from "./FileItem";
import "../../styles/components/fileExplorer.css";
import "../../styles/components/brunsonGallery.css";

const BRUNSON_IMAGE_NAMES = [
  "bath time.png",
  "cutie brunsie.png",
  "distinguished gentleman.png",
  "sleepy baby (2).png",
  "sleepy baby.png",
  "surpriseeee.png",
];

function buildImageEntries() {
  return BRUNSON_IMAGE_NAMES.map((name, index) => ({
    id: `brunson_${index + 1}`,
    name,
    type: "image",
    icon: "/icons/Image.png",
    file_type: "PNG image",
    file_size: generateFakeSize(),
    created_date: "2016-03-25 16:52",
    description: "Brunson photo",
    src: encodeURI(`/Brunson-pics/Brunson/${name}`),
  }));
}

function generateFakeSize() {
  const mb = (Math.random() * 4 + 1).toFixed(2); // 1MB–5MB
  return `${mb} MB`;
}

export default function BrunsonGallery({ onClose, onDragMouseDown }) {
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
            <span className="window-title">Brunson</span>
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
          aria-label="Brunson image preview"
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
