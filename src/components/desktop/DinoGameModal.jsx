import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "../../hooks/useSound";
import "../../styles/components/dinoGameModal.css";
const DINO_IMAGE_SRC = "/icons/Dino.png";
const WORLD_WIDTH = 760;
const WORLD_HEIGHT = 250;
const GROUND_Y = 206;
const DINO_X = 72;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 44;
const GRAVITY = 2250;
const JUMP_VELOCITY = 700;
const BASE_SPEED = 330;
const MAX_SPEED = 830;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function DinoGameModal({ onClose, onDragMouseDown }) {
  const { play } = useSound();
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const gameRef = useRef(null);
  const dinoImageRef = useRef(null);

  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = Number(localStorage.getItem("friend_dino_best") || 0);
    return Number.isFinite(saved) ? saved : 0;
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      dinoY: GROUND_Y - DINO_HEIGHT,
      dinoVelocityY: 0,
      isJumping: false,
      speed: BASE_SPEED,
      score: 0,
      spawnTimer: randomRange(0.8, 1.4),
      obstacles: [],
      lastTime: performance.now(),
      ticks: 0,
      running: false,
      started: false,
    };

    setScore(0);
    setIsOver(false);
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const game = gameRef.current;

    if (!canvas || !game) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 0.5);
    ctx.lineTo(WORLD_WIDTH, GROUND_Y + 0.5);
    ctx.stroke();

    const dinoImage = dinoImageRef.current;
    if (dinoImage && dinoImage.complete) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(dinoImage, DINO_X, game.dinoY, DINO_WIDTH, DINO_HEIGHT);
    } else {
      // Fallback so gameplay still works while asset is loading.
      ctx.fillStyle = "#000000";
      ctx.fillRect(DINO_X, game.dinoY, DINO_WIDTH, DINO_HEIGHT);
      ctx.fillStyle = "#eaf4ef";
      ctx.fillRect(DINO_X + DINO_WIDTH - 9, game.dinoY + 7, 4, 4);
    }

    game.obstacles.forEach((obstacle) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }, []);

  const gameLoop = useCallback(
    (time) => {
      const game = gameRef.current;
      if (!game || !game.running) return;

      const delta = Math.min(0.033, (time - game.lastTime) / 1000);
      game.lastTime = time;
      game.ticks += delta;
      game.speed = Math.min(MAX_SPEED, BASE_SPEED + game.score * 0.52);

      if (game.isJumping) {
        game.dinoVelocityY += GRAVITY * delta;
        game.dinoY += game.dinoVelocityY * delta;

        const groundY = GROUND_Y - DINO_HEIGHT;
        if (game.dinoY >= groundY) {
          game.dinoY = groundY;
          game.dinoVelocityY = 0;
          game.isJumping = false;
        }
      }

      game.spawnTimer -= delta;
      if (game.spawnTimer <= 0) {
        const height = randomRange(34, 62);
        game.obstacles.push({
          type: "block",
          x: WORLD_WIDTH + randomRange(24, 90),
          y: GROUND_Y - height,
          width: randomRange(20, 32),
          height,
        });

        const pace = (game.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
        game.spawnTimer = randomRange(0.72, 1.35) - pace * 0.24;
      }

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed * delta;
      });
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -36);

      const dinoRect = {
        x: DINO_X + 6,
        y: game.dinoY + 2,
        width: DINO_WIDTH - 10,
        height: DINO_HEIGHT - 5,
      };

      const hit = game.obstacles.some((obstacle) => {
        const obstacleRect = {
          x: obstacle.x + 2,
          y: obstacle.y + 2,
          width: obstacle.width - 4,
          height: obstacle.height - 4,
        };

        return (
          dinoRect.x < obstacleRect.x + obstacleRect.width &&
          dinoRect.x + dinoRect.width > obstacleRect.x &&
          dinoRect.y < obstacleRect.y + obstacleRect.height &&
          dinoRect.y + dinoRect.height > obstacleRect.y
        );
      });

      if (hit) {
        game.running = false;
        setIsOver(true);

        const finalScore = Math.floor(game.score);
        if (finalScore > bestScore) {
          setBestScore(finalScore);
          localStorage.setItem("friend_dino_best", String(finalScore));
        }
        return;
      }

      game.score += delta * 35;
      setScore(Math.floor(game.score));
      drawFrame();
      frameRef.current = requestAnimationFrame(gameLoop);
    },
    [bestScore, drawFrame]
  );

  useEffect(() => {
    const dinoImage = new Image();
    dinoImage.src = DINO_IMAGE_SRC;
    dinoImage.onload = () => {
      dinoImageRef.current = dinoImage;
      drawFrame();
    };
    dinoImageRef.current = dinoImage;

    return () => {
      if (dinoImageRef.current === dinoImage) {
        dinoImageRef.current = null;
      }
    };
  }, [drawFrame]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    drawFrame();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [drawFrame, gameLoop]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const game = gameRef.current;
      if (!game) return;

      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key === " " || event.key === "ArrowUp") {
        event.preventDefault();

        if (isOver) {
          resetGame();
          return;
        }

        if (!game.started) {
          game.started = true;
          game.running = true;
          game.lastTime = performance.now();
          frameRef.current = requestAnimationFrame(gameLoop);
        }

        if (!game.isJumping) {
          play("dino");

          game.isJumping = true;
          game.dinoVelocityY = -JUMP_VELOCITY;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [gameLoop, isOver, onClose, resetGame]);

  const scoreLabel = useMemo(() => String(score).padStart(5, "0"), [score]);
  const bestLabel = useMemo(() => String(bestScore).padStart(5, "0"), [bestScore]);

  return (
    <div className="dino-modal" role="dialog" aria-label="Dino Browser Game">
      <div className="dino-modal-header" onMouseDown={onDragMouseDown}>
        <div className="dino-modal-browser-tabs" aria-hidden="true">
          <div className="dino-modal-tab dino-modal-tab--active">
            <img src="/icons/Browser.png" alt="" className="dino-modal-tab-icon" />
            <span className="dino-modal-tab-text">SurfNet</span>
          </div>
        </div>
        <button
          className="dino-modal-close"
          type="button"
          onClick={() => {
            play("click_desktop");
            onClose();
          }}
          aria-label="Close Dino game"
        >
          ✕
        </button>
      </div>

      <div className="dino-modal-toolbar" aria-hidden="true">
        <div className="dino-modal-nav-group">
          <span className="dino-modal-nav-btn">←</span>
          <span className="dino-modal-nav-btn">→</span>
        </div>
        <div className="dino-modal-address-bar">
          surfnet://network-error/106
        </div>
      </div>

      <div className="dino-modal-canvas-shell">
        <div className="dino-modal-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          className="dino-modal-canvas"
          aria-label="Dino runner gameplay"
        />
        {isOver && (
          <div className="dino-modal-game-over">
            <div className="dino-modal-game-over-text">Game Over</div>
            <div className="dino-modal-restart-hint">Press Space to Restart</div>
          </div>
        )}
        </div>
      </div>

      <div className="dino-modal-footer">
        <div className="dino-modal-footer-row">
          <span className="dino-modal-help">Press space to play</span>
          <span className="dino-modal-scoreline">Score {scoreLabel} High Score {bestLabel}</span>
        </div>
        <h3 className="dino-modal-error-title">Network Error</h3>
        <p className="dino-modal-error-text">Please check your network connection, or try connecting to the wi-fi.</p>
      </div>
    </div>
  );
}
