import { useSound } from "../../hooks/useSound";

export default function FileItem({
  file,
  isSelected,
  onSelect,
  onDoubleClick,
  isLocked,
  playClickSound = false,
}) {
  const { play } = useSound();
  const isFolder = file.type === "folder";
  const iconSrc = isLocked
    ? "/icons/Lock.png"
    : file.icon || (isFolder ? "/icons/Folder.png" : "/icons/Document.png");

  function handleClick() {
    if (playClickSound) {
      play("click_desktop");
    }
    onSelect?.();
  }

  function handleDoubleClick() {
    if (playClickSound) {
      play("click_desktop");
    }
    onDoubleClick?.();
  }

  return (
    <div
      className={`file-list-item ${isSelected ? "selected" : ""} ${
        isLocked ? "locked" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={file.description || file.name}
    >
      <div className="item-icon">
        <img src={iconSrc} alt="" className="item-icon-img" />
      </div>
      <div className="item-name">{file.name}</div>
    </div>
  );
}
