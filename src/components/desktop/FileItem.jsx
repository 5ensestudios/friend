export default function FileItem({
  file,
  isSelected,
  onSelect,
  onDoubleClick,
  isLocked,
}) {
  const isFolder = file.type === "folder";
  const iconSrc = isLocked
    ? "/icons/Lock.png"
    : file.icon || (isFolder ? "/icons/Folder.png" : "/icons/Document.png");

  return (
    <div
      className={`file-list-item ${isSelected ? "selected" : ""} ${
        isLocked ? "locked" : ""
      }`}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      title={file.description || file.name}
    >
      <div className="item-icon">
        <img src={iconSrc} alt="" className="item-icon-img" />
      </div>
      <div className="item-name">{file.name}</div>
    </div>
  );
}
