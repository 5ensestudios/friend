import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/components/musicPlayer.css";

const MUSIC_TRACKS = [
  { id: "track_1", title: "bury a friend", artist: "Billie Eilish", src: "/music player/Billie Eilish - bury a friend.mp3" },
  { id: "track_2", title: "Within", artist: "Daft Punk", src: "/music player/Daft Punk - Within (Official Audio).mp3" },
  { id: "track_3", title: "Mascara", artist: "Deftones", src: "/music player/Mascara.mp3" },
  { id: "track_4", title: "10AM Save The World", artist: "Metro Boomin", src: "/music player/Metro Boomin - 10AMSave The World (Instrumental) (1).mp3" },
  { id: "track_5", title: "Eventually", artist: "Tame Impala", src: "/music player/Tame Impala - Eventually (Audio).mp3" },
  { id: "track_6", title: "Come As You Are", artist: "Nirvana", src: "/music player/Nirvana - Come As You Are (Lyrics).mp3" },
  { id: "track_7", title: "Karma Polie", artist: "Radiohead", src: "/music player/Karma Police.mp3" },
];

function normalizeTrackSrc(path) {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.replace(/^\//, "");
  const encodedPath = cleanPath
    .split("/")
    .map(segment => encodeURIComponent(segment))
    .join("/");

  return `${cleanBase}/${encodedPath}`;
}

function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "--:--";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function MusicPlayer({ onClose, masterVolume = 1, onDragMouseDown }) {
  const tracks = useMemo(() => MUSIC_TRACKS, []);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackDurations, setTrackDurations] = useState({});
  const audioRef = useRef(null);

  const activeTrack = tracks[activeTrackIndex];
  const activeTrackSrc = normalizeTrackSrc(activeTrack.src);
  const timelineMax = duration > 0 ? duration : 1;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, masterVolume));
  }, [masterVolume]);

  useEffect(() => {
    let cancelled = false;

    async function loadDurations() {
      const nextDurations = {};

      await Promise.all(
        tracks.map(track => new Promise(resolve => {
          const probe = new Audio();
          probe.src = normalizeTrackSrc(track.src);
          probe.preload = "metadata";

          const finalize = () => {
            nextDurations[track.id] = Number.isFinite(probe.duration) ? probe.duration : 0;
            resolve();
          };

          probe.addEventListener("loadedmetadata", finalize, { once: true });
          probe.addEventListener("error", finalize, { once: true });
        }))
      );

      if (!cancelled) {
        setTrackDurations(nextDurations);
      }
    }

    loadDurations();

    return () => {
      cancelled = true;
    };
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setCurrentTime(0);
    setDuration(trackDurations[activeTrack.id] || 0);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [activeTrack, activeTrackSrc, isPlaying, trackDurations]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
      return;
    }

    audio.pause();
  }, [isPlaying]);

  async function togglePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (!audio.src) {
        audio.src = activeTrackSrc;
        audio.load();
      }
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function handleTrackSelect(index) {
    setActiveTrackIndex(index);
  }

  function handleSeek(event) {
    const nextTime = Number(event.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <div className="music-player-window" role="dialog" aria-label="Music Player">
      <audio
        ref={audioRef}
        src={activeTrackSrc}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="music-player-header" onMouseDown={onDragMouseDown}>
        <div className="music-player-title-wrap">
          <span className="music-player-dot" aria-hidden="true" />
          <span className="music-player-title">Music Player</span>
        </div>
        <button className="music-player-close" type="button" onClick={onClose} aria-label="Close music player">✕</button>
      </div>

      <div className="music-player-list-head">
        <span>Track</span>
        <span>Length</span>
      </div>

      <div className="music-player-list">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            type="button"
            className={`music-player-row ${index === activeTrackIndex ? "active" : ""}`}
            onClick={() => handleTrackSelect(index)}
            title={`${track.title} - ${track.artist}`}
          >
            <span className="music-player-track-name">{index + 1}. {track.title} - {track.artist}</span>
            <span className="music-player-track-length">{formatDuration(trackDurations[track.id])}</span>
          </button>
        ))}
      </div>

      <div className="music-player-controls">
        <button className="music-player-play" type="button" onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <input
          type="range"
          min="0"
          max={timelineMax}
          step="0.01"
          value={Math.min(currentTime, timelineMax)}
          onChange={handleSeek}
          className="music-player-timeline"
          aria-label="Song timeline"
        />
      </div>
    </div>
  );
}
