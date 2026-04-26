import { useCallback } from "react";

const SOUND_PATHS = {
  scene_hover: "/Friend SFX/Friend SFX - hover game .wav",
  click_desktop: "/Friend SFX/Friend SFX - click desktop .wav",
  click_game: "/Friend SFX/Friend SFX - click game.wav",
  emailPopup: "/Friend SFX/Friend SFX - email popup.wav",
  bootScreenOn: "/Friend SFX/Friend SFX - boot screen on.wav",
  bootScreenOff: "/Friend SFX/Friend SFX - boot screen off.wav",
  static: "/Friend SFX/Friend SFX - boot screenon_off.wav",
  glitch: "/Friend SFX/Friend SFX - glitch effect .wav",
  dino: "/Friend SFX/Friend SFX - dino jump.wav",
  dinoGameOver: "/Friend SFX/bgm - dino game over.wav",
  radioSiren: "/Friend SFX/Case Intro.mp3",

};

const activeSounds = new Set();

export function useSound() {
  const play = useCallback((soundKey, options = {}) => {
    const path = SOUND_PATHS[soundKey];
    if (!path) {
      console.warn(`Sound "${soundKey}" not found`);
      return;
    }

    try {
      const audio = new Audio(path);
      audio.volume = options.volume ?? 0.7;
      audio.currentTime = 0;
      activeSounds.add(audio);
      const cleanup = () => {
        activeSounds.delete(audio);
      };
      audio.addEventListener("ended", cleanup);
      audio.addEventListener("pause", cleanup);
      audio.play().catch((err) => {
        cleanup();
        console.warn(`Failed to play sound "${soundKey}":`, err);
      });
    } catch (err) {
      console.warn(`Error creating audio for "${soundKey}":`, err);
    }
  }, []);

  return { play };
}

export function stopAllSoundEffects() {
  activeSounds.forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      // ignore bad audio state
    }
  });
  activeSounds.clear();
}
