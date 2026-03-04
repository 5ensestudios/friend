import { useState, useEffect } from "react";
import FileItem from "./FileItem";
import "../../styles/components/fileExplorer.css";

export default function FileExplorer({
  playerProgress,
  onActSelect,
  onReturnToMenu,
}) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileStructure, setFileStructure] = useState(null);

  useEffect(() => {
    loadFileSystem();
  }, []);

  async function loadFileSystem() {
    // Hardcoded file structure for now
    const structure = {
      rootFolders: [
        {
          id: "acts_folder",
          name: "CASE FILES",
          type: "folder",
          icon: "📁",
          locked: false,
          children: [
            {
              id: "introductory_act",
              name: "INTRODUCTORY - The First Interviews",
              type: "file",
              icon: "📄",
              locked: false,
              required_act: 0,
              act_number: 0,
              file_size: "2.4 MB",
              created_date: "2016-03-07",
              description: "Initial interview statements from all suspects",
            },
            {
              id: "act1_file",
              name: "ACT I - The Incident",
              type: "file",
              icon: "📄",
              locked: playerProgress.current_act < 1,
              required_act: 1,
              unlocks_after_act: 0,
              act_number: 1,
              file_size: "5.8 MB",
              created_date: "2016-03-07",
              description: "Detailed recounts of what happened last night",
            },
            {
              id: "act2_file",
              name: "ACT II - The Motives",
              type: "file",
              icon: "📄",
              locked: playerProgress.current_act < 2,
              required_act: 2,
              unlocks_after_act: 1,
              act_number: 2,
              file_size: "4.2 MB",
              created_date: "2016-03-07",
              description: "Background and motivations of each suspect",
            },
            {
              id: "act3_file",
              name: "ACT III - The Truth",
              type: "file",
              icon: "📄",
              locked: playerProgress.current_act < 3,
              required_act: 3,
              unlocks_after_act: 2,
              act_number: 3,
              file_size: "3.1 MB",
              created_date: "2016-03-07",
              description: "Confrontation and truth revelation",
            },
          ],
        },
      ],
    };
    setFileStructure(structure);
  }

  function isFileLocked(file) {
    if (file.required_act === undefined) return false;
    return playerProgress.current_act < file.required_act;
  }

  function handleFileClick(file) {
    if (isFileLocked(file)) {
      alert(
        `⚠️ LOCKED\n\nYou must complete ACT ${file.unlocks_after_act} first.`
      );
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
    <div className="file-explorer-window">
      <div className="window-header">
        <div className="window-title-bar">
          <button
            className="window-nav-button"
            onClick={handleBack}
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
            {currentFolder ? currentFolder.name : "CASE FILES"}
          </span>
        </div>
        <button
          className="window-close"
          onClick={onReturnToMenu}
          title="Return to Menu"
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
              />
            )
          )}
        </div>

        {selectedFile && (
          <div className="file-preview">
            <div className="preview-header">Properties</div>
            <div className="preview-content">
              <p>
                <strong>Name:</strong> {selectedFile.name}
              </p>
              {selectedFile.file_size && (
                <p>
                  <strong>Size:</strong> {selectedFile.file_size}
                </p>
              )}
              {selectedFile.created_date && (
                <p>
                  <strong>Date:</strong> {selectedFile.created_date}
                </p>
              )}
              {selectedFile.description && (
                <p>
                  <strong>Description:</strong> {selectedFile.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}