export default function FileItem({
  file,
  isSelected,
  onSelect,
  onDoubleClick,
  isLocked,
}) {
  const isFolder = file.type === "folder";

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
        {isLocked ? "🔒" : file.icon || (isFolder ? "📁" : "📄")}
      </div>
      <div className="item-name">{file.name}</div>
    </div>
  );
}
