import { deleteDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

const PLAYERS_COLLECTION = "players";
const LOCAL_STORAGE_KEY_PREFIX = "friEND_gameState_";

function getLocalStorageKey(userId) {
  return `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
}

function readLocalGameState(userId) {
  if (!userId || typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeLocalGameState(userId, gameState) {
  if (!userId || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getLocalStorageKey(userId), JSON.stringify(gameState));
  } catch {
    // Ignore storage failures and continue with Firestore if available.
  }
}

function removeLocalGameState(userId) {
  if (!userId || typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(getLocalStorageKey(userId));
  } catch {
    // Ignore storage failures.
  }
}

export function createDefaultGameState(userId, username = "Detective") {
  return {
    id: userId,
    username,
    current_act: 0,
    acts_completed: [],
    scenes_visited: {},
    locked_scenes: {},
    choices_made: [],
    desktop_mail_seen: {},
    progress: {
      current_act: 0,
      acts_completed: [],
      scenes_visited: {},
      locked_scenes: {},
      desktop_mail_seen: {},
    },
  };
}

export async function createPlayerDocument(userId, email, username) {
  const gameState = createDefaultGameState(userId, username);

  writeLocalGameState(userId, gameState);

  try {
    await setDoc(doc(db, PLAYERS_COLLECTION, userId), {
      email,
      username,
      gameState,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch {
    // If Firestore rules block the write, keep the account usable with local progress.
  }

  return gameState;
}

export async function saveProgress(userId, gameState) {
  writeLocalGameState(userId, gameState);

  try {
    await setDoc(
      doc(db, PLAYERS_COLLECTION, userId),
      {
        username: gameState.username,
        gameState,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Ignore Firestore permission failures and keep the local copy.
  }
}

export async function loadProgress(userId) {
  try {
    const snapshot = await getDoc(doc(db, PLAYERS_COLLECTION, userId));

    if (!snapshot.exists()) {
      return readLocalGameState(userId);
    }

    const data = snapshot.data();
    const gameState = data.gameState || null;
    if (gameState) {
      writeLocalGameState(userId, gameState);
    }
    return gameState;
  } catch {
    return readLocalGameState(userId);
  }
}

export async function deletePlayerDocument(userId) {
  if (!userId) return;

  removeLocalGameState(userId);

  try {
    await deleteDoc(doc(db, PLAYERS_COLLECTION, userId));
  } catch {
    // Ignore permission failures during cleanup.
  }
}