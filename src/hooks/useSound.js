import { useCallback } from "react";

const SOUND_PATHS = {
  hover: "/Friend SFX/Friend SFX - hover.wav",
  click: "/Friend SFX/Friend SFX - click .wav",
  emailPopup: "/Friend SFX/Friend SFX - email popup.wav",
  radioChirp: "/Friend SFX/Friend SFX - radio chirp.wav",
  bootScreenOn: "/Friend SFX/Friend SFX - boot screen on.wav",
  bootScreenOff: "/Friend SFX/Friend SFX - boot screen off.wav",
  radioSiren: "/Friend SFX/Friend SFX - radio siren.wav",
};

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
      audio.play().catch((err) => {
        console.warn(`Failed to play sound "${soundKey}":`, err);
      });
    } catch (err) {
      console.warn(`Error creating audio for "${soundKey}":`, err);
    }
  }, []);

  return { play };
}
