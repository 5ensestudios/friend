import { useEffect, useState } from "react";
import sceneViewSource from "../components/dialouge/SceneView.jsx?raw";
import desktopInterfaceSource from "../pages/DesktopInterface.jsx?raw";
import cinematicEndingSource from "../pages/CinematicEnding.jsx?raw";
import caseIntroSource from "../pages/CaseIntro.jsx?raw";
import splashScreenSource from "../pages/SplashScreen.jsx?raw";
import mainMenuSource from "../pages/MainMenu.jsx?raw";

const STARTUP_ASSETS = [
  // IMAGES
  "/Images/5ENSE Logo.png",
  "/Images/The Friend Logo.png",
  "/Images/BG Menu.jpeg",
  "/Images/Louis Card.png",
  "/Images/May Card.png",
  "/Images/Johnny Card.png",
  "/Images/Richie Card.png",
  "/Images/Case File.png",
  "/Images/friend icon.png",
  "/Images/Game Design.png",

  // ICONS
  "/icons/Audio Player.png",
  "/icons/Battery.png",
  "/icons/Bin.png",
  "/icons/Browser.png",
  "/icons/Dino.png",
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

  // FONTS
  "/fonts/Brunson Rough.ttf",
  "/fonts/GlacialIndifference-Bold.otf",
  "/fonts/GlacialIndifference-Italic.otf",
  "/fonts/GlacialIndifference-Regular.otf",

  // SOUND
  "/sound/Friend Soundtrack.mp3",
  "/sound/typewriter.mp3",

  // FRIEND SFX (all)
  "/Friend SFX/bgm - dino game over.wav",
  "/Friend SFX/Black Static Halo.mp3",
  "/Friend SFX/Case Intro.mp3",
  "/Friend SFX/Friend SFX - ambient act.mp3",
  "/Friend SFX/Friend SFX - ambient desktop.wav",
  "/Friend SFX/Friend SFX - ambient scenes act.wav",
  "/Friend SFX/Friend SFX - boot screen off.wav",
  "/Friend SFX/Friend SFX - boot screen on.wav",
  "/Friend SFX/Friend SFX - boot screenon_off.wav",
  "/Friend SFX/Friend SFX - click desktop .wav",
  "/Friend SFX/Friend SFX - click game.wav",
  "/Friend SFX/Friend SFX - dino jump.wav",
  "/Friend SFX/Friend SFX - email popup.wav",
  "/Friend SFX/Friend SFX - glitch effect .wav",
  "/Friend SFX/Friend SFX - hover game .wav",
  "/Friend SFX/Friend SFX - radio siren.wav",
  "/Friend SFX/The Friend SFX - Desktop Bgm.mp3",

  // VIDEOS (all main, plus all acts/characters)
  "/videos/Act 3 placeholder.mp4",
  "/videos/Loop-1.mp4",
  // Johnny
  "/videos/Johnny/Johnny Act 3.mp4",
  "/videos/Johnny/Johnny Act 1/Johnny Act 1 - 1.1.mp4",
  "/videos/Johnny/Johnny Act 1/Johnny Act 1 - 1.2.mp4",
  "/videos/Johnny/Johnny Act 1/Johnny Act 1 - 2.mp4",
  "/videos/Johnny/Johnny Act 1/Johnny Act 1 - 3.mp4",
  "/videos/Johnny/Johnny Act 1/Johnny Act 1 - 4.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.1.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.2.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 1.3.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 2.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 3.1.mp4",
  "/videos/Johnny/Johnny Act 2/Johnny Act 2 - 3.2.mp4",
  "/videos/Johnny/Johnny Intro/Johnny Intro 1.mp4",
  "/videos/Johnny/Johnny Intro/Johnny Intro 2.mp4",
  "/videos/Johnny/Johnny Intro/Johnny Intro 3.mp4",
  "/videos/Johnny/Johnny Intro/Johnny Intro 4.mp4",
  // Louis
  "/videos/Louis/Louis Act 3.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 1.1.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 1.2.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 1.3.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 2.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 3.mp4",
  "/videos/Louis/Louis Act 1/Louis Act 1 - 4.mp4",
  "/videos/Louis/Louis Act 2/Louis Act 2 - 1.1.mp4",
  "/videos/Louis/Louis Act 2/Louis Act 2 - 1.2.mp4",
  "/videos/Louis/Louis Act 2/Louis Act 2 - 2.mp4",
  "/videos/Louis/Louis Act 2/Louis Act 2 - 3.mp4",
  "/videos/Louis/Louis Intro/Louis Intro 1.mp4",
  "/videos/Louis/Louis Intro/Louis Intro 2.mp4",
  "/videos/Louis/Louis Intro/Louis Intro 3.mp4",
  // May
  "/videos/May/May Act 3.mp4",
  "/videos/May/May Act 1/May Act 1 - 1.1.mp4",
  "/videos/May/May Act 1/May Act 1 - 1.2.mp4",
  "/videos/May/May Act 1/May Act 1 - 1.3.mp4",
  "/videos/May/May Act 1/May Act 1 - 2.mp4",
  "/videos/May/May Act 1/May Act 1 - 3.mp4",
  "/videos/May/May Act 1/May Act 1 - 4.mp4",
  "/videos/May/May Act 2/May Act 2 - 1.mp4",
  "/videos/May/May Act 2/May Act 2 - 2.mp4",
  "/videos/May/May Act 2/May Act 2 - 3.mp4",
  "/videos/May/May Intro/May Intro 1.mp4",
  "/videos/May/May Intro/May Intro 2.mp4",
  "/videos/May/May Intro/May Intro 3.mp4",
  // Richard
  "/videos/Richard/Richard Act 3.mp4",
  "/videos/Richard/Richie Act 1/Richie Act 1 - 1.1.mp4",
  "/videos/Richard/Richie Act 1/Richie Act 1 - 1.2.mp4",
  "/videos/Richard/Richie Act 1/Richie Act 1 - 2.mp4",
  "/videos/Richard/Richie Act 1/Richie Act 1 - 3.mp4",
  "/videos/Richard/Richie Act 1/Richie Act 1 - 4.mp4",
  "/videos/Richard/Richie Act 2/Richie Act 2 - 1.1.mp4",
  "/videos/Richard/Richie Act 2/Richie Act 2 - 1.2.mp4",
  "/videos/Richard/Richie Act 2/Richie Act 2 - 2.mp4",
  "/videos/Richard/Richie Act 2/Richie Act 2 - 3.mp4",
  "/videos/Richard/Richie Intro/Richie Intro 1.mp4",
  "/videos/Richard/Richie Intro/Richie Intro 2.mp4",
  "/videos/Richard/Richie Intro/Richie Intro 3.mp4",
  // Cloud video
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
