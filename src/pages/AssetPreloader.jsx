import "../styles/pages/assetPreloader.css";

export default function AssetPreloader({ progress = 0 }) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="asset-preloader" aria-live="polite" aria-label="Loading assets">
      <div className="asset-preloader-container">
        <div className="asset-preloader-bar-container">
          <div className="asset-preloader-bar" style={{ width: `${safeProgress}%` }}></div>
        </div>
        <div className="asset-preloader-value">{safeProgress}%</div>
      </div>
    </div>
  );
}
