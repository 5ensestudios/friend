import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FileItem from "./FileItem";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/fileExplorer.css";

const FILE_TYPE_LABEL = "File folder";

const ACT_QUESTIONS = {
  1: [
    "#1",
    "#2",
    "#3",
    "#4",
  ],
  2: [
    "#1",
    "#2",
    "#3",
  ],
};

const QUESTION_FILE_SIZES = {
  1: ["512 MB", "128 MB", "256 MB", "128 MB"],
  2: ["150 MB", "210 MB", "240 MB"],
};

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

function buildQuestionFolders(actNumber) {
  const questions = ACT_QUESTIONS[actNumber] || [];
  const sizes = QUESTION_FILE_SIZES[actNumber] || [];
  const dateStart = new Date("2016-03-07T00:00:00");
  const dateEnd = new Date("2016-03-07T23:59:00");
  return questions.map((label, index) => ({
    id: `act${actNumber}_q${index + 1}`,
    name: `${label}`,
    type: "folder",
    icon: "/icons/Folder.png",
    act_number: actNumber,
    question_index: index,
    
    t: actNumber,
    required_question: index > 0 ? index - 1 : undefined,
    unlocks_after_question: index > 0 ? index - 1 : undefined,
    file_type: FILE_TYPE_LABEL,
    file_size: sizes[index] || "128 MB",
    created_date: randomDateInRange(dateStart, dateEnd),
    description: label,
  }));
}

export default function FileExplorer({
  playerProgress,
  onActSelect,
  onReturnToMenu,
  onClose,
  onDragMouseDown,
}) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileStructure, setFileStructure] = useState(null);
  const [showLockedPopup, setShowLockedPopup] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    loadFileSystem();
  }, []);

  useEffect(() => {
    const items = currentFolder?.children || fileStructure?.rootFolders || [];
    if (!items.length) {
      setSelectedFile(null);
      return;
    }

    const stillVisible = selectedFile && items.some(item => item.id === selectedFile.id);
    if (!stillVisible) {
      setSelectedFile(items[0]);
    }
  }, [currentFolder, fileStructure, selectedFile]);

  async function loadFileSystem() {
    const rootDateStart = new Date("2016-03-07T00:00:00");
    const rootDateEnd = new Date("2016-03-07T23:59:00");
    // Hardcoded file structure for now
    const structure = {
      rootFolders: [
        {
          id: "introductory_act",
          name: "4:00:37 AM",
          type: "file",
          icon: "/icons/Folder.png",
          required_act: 0,
          act_number: 0,
          file_type: FILE_TYPE_LABEL,
          property_name: "4:00:37 AM",
          file_size: "400 MB",
          created_date: randomDateInRange(rootDateStart, rootDateEnd),
          description: "4:00:37 AM",
        },
        {
          id: "act1_folder",
          name: "4:12:10 AM",
          type: "folder",
          icon: "/icons/Folder.png",
          required_act: 1,
          unlocks_after_act: 0,
          act_number: 1,
          file_type: FILE_TYPE_LABEL,
          property_name: "4:12:10 AM",
          file_size: "1 GB",
          created_date: randomDateInRange(rootDateStart, rootDateEnd),
          description: "4:12:10 AM",
          children: buildQuestionFolders(1),
        },
        {
          id: "act2_folder",
          name: "5:08:07 AM",
          type: "folder",
          icon: "/icons/Folder.png",
          required_act: 2,
          unlocks_after_act: 1,
          act_number: 2,
          file_type: FILE_TYPE_LABEL,
          property_name: "5:08:07 AM",
          file_size: "600 MB",
          created_date: randomDateInRange(rootDateStart, rootDateEnd),
          description: "5:08:07 AM",
          children: buildQuestionFolders(2),
        },
        {
          id: "act3_file",
          name: "???",
          type: "file",
          icon: "/icons/Folder.png",
          required_act: 3,
          unlocks_after_act: 2,
          act_number: 3,
          file_type: FILE_TYPE_LABEL,
          property_name: "????",
          file_size: "300 MB",
          created_date: randomDateInRange(rootDateStart, rootDateEnd),
          description: "???",
        },
      ],
    };
    setFileStructure(structure);
  }

  function getCompletedQuestions(actNumber) {
    return playerProgress?.scenes_visited?.[`act${actNumber}`]?.completedQuestions || [];
  }

  function isFileLocked(file) {
    if (file.required_act !== undefined && playerProgress.current_act < file.required_act) {
      return true;
    }

    if (file.required_question !== undefined && file.act_number !== undefined) {
      const completedQuestions = getCompletedQuestions(file.act_number);
      return !completedQuestions.includes(file.required_question);
    }

    return false;
  }

  function getLockMessage(file) {
    if (file.required_act !== undefined && playerProgress.current_act < file.required_act) {
      const requiredAct = file.unlocks_after_act ?? Math.max(0, file.required_act - 1);
      return `⚠️ LOCKED\n\nYou must complete ACT ${requiredAct} first.`;
    }

    if (file.required_question !== undefined && file.act_number !== undefined) {
      const completedQuestions = getCompletedQuestions(file.act_number);
      if (completedQuestions.includes(file.required_question)) {
        return null;
      }
      const requiredQuestion = file.required_question + 1;
      return `⚠️ LOCKED\n\nYou must complete Question #${requiredQuestion} first.`;
    }

    return null;
  }

  function closeLockedPopup() {
    setShowLockedPopup(false);
  }

  function handleFileClick(file) {
    if (isFileLocked(file)) {
      setShowLockedPopup(true);
      return;
    }

    if (file.question_index !== undefined && file.act_number !== undefined) {
      onActSelect(file.act_number, file.question_index);
      return;
    }

    if (file.type === "file" && file.act_number !== undefined) {
      onActSelect(file.act_number);
    } else {
      setCurrentFolder(file);
    }
  }

  function handleBack() {
    setCurrentFolder(null);
    setSelectedFile(null);
  }

  return (
    <>
      <div className="file-explorer-window">
        <div className="window-header">
        <div className="window-title-bar" onMouseDown={onDragMouseDown} style={{ cursor: "grab" }}>
          <button
            className="window-nav-button"
            onClick={() => {
              play("click_desktop");
              handleBack();
            }}
            disabled={!currentFolder}
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
          <span className="window-title">
            {currentFolder ? currentFolder.name : "#2016-0307-CHRIS Footage"}
          </span>
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
        <div className="file-list">
          {(currentFolder?.children || fileStructure?.rootFolders || []).map(
            (item) => (
              <FileItem
                key={item.id}
                file={item}
                isLocked={isFileLocked(item)}
                onDoubleClick={() => handleFileClick(item)}
                onSelect={() => setSelectedFile(item)}
                isSelected={selectedFile?.id === item.id}
                playClickSound
              />
            )
          )}
        </div>

        <div className="file-preview">
          <div className="preview-header">Properties</div>
          <div className="preview-content">
            {selectedFile ? (
              <>
                <p>
                  <span className="preview-label">Name:</span> <span className="preview-value">{selectedFile.property_name || selectedFile.name}</span>
                </p>
                {selectedFile.created_date && (
                  <p>
                    <span className="preview-label">Date Modified:</span> <span className="preview-value">{selectedFile.created_date}</span>
                  </p>
                )}
                {(selectedFile.file_type || selectedFile.type) && (
                  <p>
                    <span className="preview-label">File Type:</span> <span className="preview-value">{selectedFile.file_type || selectedFile.type}</span>
                  </p>
                )}
                {selectedFile.file_size && (
                  <p>
                    <span className="preview-label">Size:</span> <span className="preview-value">{selectedFile.file_size}</span>
                  </p>
                )}
              </>
            ) : (
              <p>Select a folder to view its properties.</p>
            )}
          </div>
        </div>
      </div>
    </div>
      {showLockedPopup && typeof document !== "undefined" && createPortal(
        <div className="locked-popup-overlay" role="dialog" aria-modal="true">
          <div className="locked-popup-box" onClick={(event) => event.stopPropagation()}>
            <div className="locked-popup-title">Error: Parity_Mismatch</div>
            <div className="locked-popup-message">Data stream unstable. File contains 0% valid headers. Waiting for cross-reference injection.</div>
            <button
              className="locked-popup-button"
              type="button"
              onClick={closeLockedPopup}
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}