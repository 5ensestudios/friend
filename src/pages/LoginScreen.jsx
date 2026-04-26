import { useEffect, useState } from "react";
import { useSound } from "../hooks/useSound";
import "../styles/pages/loginScreen.css";
import { loginUser, signUpUser } from "../firebase/auth";
import {
  createDefaultGameState,
  createPlayerDocument,
  loadProgress,
  saveProgress,
} from "../firebase/progress";

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email.";
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function LoginScreen({
  onAuthSuccess,
  onReturnToMenu,
  mode = "login",
  currentUserEmail = "",
  currentUsername = "Detective",
}) {
  const [ign, setIgn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { play } = useSound();

  const isPasswordOnlyLogin = mode === "login" && Boolean(currentUserEmail);

  useEffect(() => {
    if (isPasswordOnlyLogin) {
      setEmail(currentUserEmail);
    } else if (mode === "login") {
      setEmail("");
    }

    setPassword("");
    setError("");
  }, [mode, currentUserEmail, isPasswordOnlyLogin]);

  async function handleSubmit() {
    try {
      setError("");
      setIsLoading(true);

      if (mode === "register") {
        if (!ign.trim()) {
          setError("Please enter an IGN.");
          return;
        }

        if (!email.trim()) {
          setError("Please enter your email.");
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }

        const user = await signUpUser(email.trim(), password, ign.trim());
        const gameState = await createPlayerDocument(
          user.uid,
          user.email,
          ign.trim()
        );

        onAuthSuccess(gameState, user);
        return;
      }

      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }

      if (!password.trim()) {
        setError("Please enter your password.");
        return;
      }

      const user = await loginUser(email.trim(), password);
      let gameState = await loadProgress(user.uid);

      if (!gameState) {
        gameState = createDefaultGameState(
          user.uid,
          user.displayName || "Detective"
        );
        await saveProgress(user.uid, gameState);
      }

      onAuthSuccess(gameState, user);
    } catch (authError) {
      setError(getAuthErrorMessage(authError.code));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-bg" />

      <div className="login-clock">
        <div className="login-time">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
        <div className="login-date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="login-card">
        <div className="login-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-6 0-8 3-8 5v1h16v-1c0-2-2-5-8-5z" />
          </svg>
        </div>

        {mode === "register" ? (
          <>
            <p className="login-mode-label">Create Your Profile</p>

            <div className="login-fields">
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={ign}
                onChange={(e) => {
                  setIgn(e.target.value);
                  setError("");
                }}
                maxLength={20}
                onMouseEnter={() => play("hover_ui")}
              />

              <input
                className="login-input"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onMouseEnter={() => play("hover_ui")}
              />

              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onMouseEnter={() => play("hover_ui")}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              className="login-signin-btn"
              onMouseEnter={() => play("scene_hover")}
              onClick={() => {
                play("click_game");
                handleSubmit();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <p className="login-mode-label">Welcome back</p>

            {isPasswordOnlyLogin && (
              <div className="login-username">{currentUsername}</div>
            )}

            <div className="login-fields">
              {!isPasswordOnlyLogin && (
                <input
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onMouseEnter={() => play("scene_hove")}
                />
              )}

              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onMouseEnter={() => play("scene_hove")}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              className="login-signin-btn"
              onMouseEnter={() => play("scene_hover")}
              onClick={() => {
                play("click_game");
                handleSubmit();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Continue"}
            </button>
          </>
        )}
      </div>

      <div className="login-bottom-bar">
        <div className="login-bottom-icons">
          <button
            className="login-bottom-icon"
            title="Power"
            type="button"
            onMouseEnter={() => play("scene_hover")}
            onClick={() => {
              play("click_game");
              onReturnToMenu?.();
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.05.88-3.89 2.29-5.17L5.88 5.46A8.93 8.93 0 003 12c0 4.97 4.03 9 9 9s9-4.03 9-9a8.93 8.93 0 00-3.17-6.83z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}