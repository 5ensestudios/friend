import { useCallback } from "react";

const SOUND_PATHS = {
  scene_hover: "/Friend SFX/Friend SFX - hover game .wav",
  click_desktop: "/Friend SFX/Friend SFX - click desktop .wav",
  click_game: "/Friend SFX/Friend SFX - click game.wav",
  emailPopup: "/Friend SFX/Friend SFX - email popup.wav",
  bootScreenOn: "/Friend SFX/Friend SFX - boot screenon_off.wav",
  bootScreenOff: "/Friend SFX/Friend SFX - boot screenon_off.wav",
  glitch: "/Friend SFX/Friend SFX - glitch effect.wav",
  dino: "/Friend SFX/Friend SFX - dino jump.wav",
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
