import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/components/dinoGameModal.css";

const WORLD_WIDTH = 760;
const WORLD_HEIGHT = 250;
const GROUND_Y = 206;
const DINO_X = 72;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 44;
const DINO_DUCK_HEIGHT = 28;
const GRAVITY = 2250;
const JUMP_VELOCITY = 840;
const BASE_SPEED = 330;
const MAX_SPEED = 830;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function DinoGameModal({ onClose, onDragMouseDown }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const gameRef = useRef(null);

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
      isDucking: false,
      speed: BASE_SPEED,
      score: 0,
      spawnTimer: randomRange(0.8, 1.4),
      obstacles: [],
      lastTime: performance.now(),
      ticks: 0,
      running: true,
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

    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    sky.addColorStop(0, "#f4f8f1");
    sky.addColorStop(0.64, "#d3e6d8");
    sky.addColorStop(1, "#b5d0c2");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    ctx.strokeStyle = "rgba(24, 43, 48, 0.36)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 0.5);
    ctx.lineTo(WORLD_WIDTH, GROUND_Y + 0.5);
    ctx.stroke();

    ctx.fillStyle = "rgba(19, 44, 50, 0.2)";
    const offset = (game.ticks * game.speed * 0.12) % 28;
    for (let x = -offset; x < WORLD_WIDTH; x += 28) {
      ctx.fillRect(x, GROUND_Y + 8, 14, 2);
    }

    const dinoHeight = game.isDucking && !game.isJumping ? DINO_DUCK_HEIGHT : DINO_HEIGHT;
    const dinoY = game.dinoY + (DINO_HEIGHT - dinoHeight);

    ctx.fillStyle = "#183d44";
    ctx.fillRect(DINO_X, dinoY, DINO_WIDTH, dinoHeight);

    ctx.fillStyle = "#eaf4ef";
    ctx.fillRect(DINO_X + DINO_WIDTH - 9, dinoY + 7, 4, 4);

    game.obstacles.forEach((obstacle) => {
      ctx.fillStyle = obstacle.type === "bird" ? "#1f5550" : "#245049";

      if (obstacle.type === "bird") {
        ctx.beginPath();
        ctx.ellipse(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          obstacle.height / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
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
        if (Math.random() > 0.72) {
          game.obstacles.push({
            type: "bird",
            x: WORLD_WIDTH + randomRange(24, 90),
            y: GROUND_Y - randomRange(68, 124),
            width: 42,
            height: 24,
          });
        } else {
          const height = randomRange(34, 62);
          game.obstacles.push({
            type: "cactus",
            x: WORLD_WIDTH + randomRange(24, 90),
            y: GROUND_Y - height,
            width: randomRange(20, 32),
            height,
          });
        }

        const pace = (game.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
        game.spawnTimer = randomRange(0.72, 1.35) - pace * 0.24;
      }

      game.obstacles.forEach((obstacle) => {
        obstacle.x -= game.speed * delta;
      });
      game.obstacles = game.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -36);

      const dinoHeight = game.isDucking && !game.isJumping ? DINO_DUCK_HEIGHT : DINO_HEIGHT;
      const dinoRect = {
        x: DINO_X + 6,
        y: game.dinoY + (DINO_HEIGHT - dinoHeight) + 2,
        width: DINO_WIDTH - 10,
        height: dinoHeight - 5,
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
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    drawFrame();
    game.lastTime = performance.now();
    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [drawFrame, gameLoop, isOver]);

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

        if (!game.isJumping) {
          game.isJumping = true;
          game.isDucking = false;
          game.dinoVelocityY = -JUMP_VELOCITY;
        }
      }

      if (event.key === "ArrowDown") {
        game.isDucking = true;
      }
    };

    const onKeyUp = (event) => {
      const game = gameRef.current;
      if (!game) return;

      if (event.key === "ArrowDown") {
        game.isDucking = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isOver, onClose, resetGame]);

  const scoreLabel = useMemo(() => String(score).padStart(5, "0"), [score]);
  const bestLabel = useMemo(() => String(bestScore).padStart(5, "0"), [bestScore]);

  return (
    <div className="dino-modal" role="dialog" aria-label="Dino Browser Game">
      <div className="dino-modal-header" onMouseDown={onDragMouseDown}>
        <div className="dino-modal-title-wrap">
          <span className="dino-modal-dot" aria-hidden="true" />
          <span className="dino-modal-title">Browser Dino</span>
        </div>
        <button className="dino-modal-close" type="button" onClick={onClose} aria-label="Close Dino game">
          ✕
        </button>
      </div>

      <div className="dino-modal-hud">
        <span>Score {scoreLabel}</span>
        <span>Best {bestLabel}</span>
      </div>

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

      <div className="dino-modal-footer">
        <span className="dino-modal-help">Space/Up jump, Down duck, Esc close</span>
      </div>
    </div>
  );
}
