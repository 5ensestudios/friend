import { useEffect, useState } from "react";
import sceneViewSource from "../components/dialouge/SceneView.jsx?raw";
import desktopInterfaceSource from "../pages/DesktopInterface.jsx?raw";
import cinematicEndingSource from "../pages/CinematicEnding.jsx?raw";
import caseIntroSource from "../pages/CaseIntro.jsx?raw";
import splashScreenSource from "../pages/SplashScreen.jsx?raw";
import mainMenuSource from "../pages/MainMenu.jsx?raw";

const STARTUP_ASSETS = [
  "/Images/5ENSE Logo.png",
  "/Images/The Friend Logo.png",
  "/Images/BG Menu.jpeg",
  "/Images/Louis Card.png",
  "/Images/May Card.png",
  "/Images/Johnny Card.png",
  "/Images/Richie Card.png",
  "/Images/Case%20File.png",
  "/icons/Battery.png",
  "/icons/Bin.png",
  "/icons/Document.png",
  "/icons/Folder.png",
  "/icons/Image.png",
  "/icons/Lock.png",
  "/icons/Mail.png",
  "/icons/Music Player.png",
  "/icons/Notes.png",
  "/icons/Pause.png",
  "/icons/PC.png",
  "/icons/Play.png",
  "/icons/Volume.png",
  "/sound/Friend Soundtrack.mp3",
  "/sound/typewriter.mp3",
  "/Friend SFX/Friend SFX - boot screen off.wav",
  "/Friend SFX/Friend SFX - boot screen on.wav",
  "/Friend SFX/Friend SFX - click .wav",
  "/Friend SFX/Friend SFX - email popup.wav",
  "/Friend SFX/Friend SFX - hover.wav",
  "/Friend SFX/Friend SFX - radio chirp.wav",
  "/Friend SFX/Friend SFX - radio siren.wav",
  "https://res.cloudinary.com/dknhgcjpf/video/upload/q_auto:good,f_auto/v1776172439/Loop-1_ixjhfu.mp4",
];

const ASSET_URL_REGEX = /["'`](https?:\/\/[^"'`]+|\/[^"'`]+\.(?:png|jpe?g|gif|webp|svg|mp3|wav|ogg|mp4|webm))["'`]/gi;

function extractAssetUrls(source) {
  if (!source) return [];

  const urls = [];
  let match;

  while ((match = ASSET_URL_REGEX.exec(source)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
}

const SOURCE_EXTRACTED_ASSETS = [
  ...extractAssetUrls(sceneViewSource),
  ...extractAssetUrls(desktopInterfaceSource),
  ...extractAssetUrls(cinematicEndingSource),
  ...extractAssetUrls(caseIntroSource),
  ...extractAssetUrls(splashScreenSource),
  ...extractAssetUrls(mainMenuSource),
];

const DEFAULT_ASSETS = Array.from(new Set([
  ...STARTUP_ASSETS,
  ...SOURCE_EXTRACTED_ASSETS,
]));

function loadImage(src) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

function loadMedia(src, kind) {
  return new Promise(resolve => {
    const media = document.createElement(kind);
    media.preload = "auto";

    const timeout = setTimeout(() => {
      done();
    }, 12000);

    const done = () => {
      clearTimeout(timeout);
      media.removeEventListener("canplaythrough", done);
      media.removeEventListener("error", done);
      resolve();
    };

    media.addEventListener("canplaythrough", done, { once: true });
    media.addEventListener("error", done, { once: true });
    media.src = src;
    media.load();
  });
}

function loadAsset(src) {
  const lower = src.toLowerCase();

  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp") || lower.endsWith(".gif") || lower.endsWith(".svg")) {
    return loadImage(src);
  }

  if (lower.endsWith(".mp3") || lower.endsWith(".wav") || lower.endsWith(".ogg")) {
    return loadMedia(src, "audio");
  }

  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) {
    return loadMedia(src, "video");
  }

  return fetch(src, { method: "GET" }).then(() => undefined).catch(() => undefined);
}

export function useAssetPreloader({ enabled = true, assets = DEFAULT_ASSETS } = {}) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!enabled || isDone) return;

    let cancelled = false;
    const uniqueAssets = Array.from(new Set(assets.filter(Boolean)));
    const total = uniqueAssets.length || 1;
    let loadedCount = 0;

    setProgress(0);

    Promise.allSettled(
      uniqueAssets.map(src =>
        loadAsset(src).finally(() => {
          loadedCount += 1;
          if (!cancelled) {
            setProgress((loadedCount / total) * 100);
          }
        })
      )
    ).finally(() => {
      if (!cancelled) {
        setProgress(100);
        setTimeout(() => {
          if (!cancelled) {
            setIsDone(true);
          }
        }, 120);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, assets, isDone]);

  return { progress, isDone };
}
