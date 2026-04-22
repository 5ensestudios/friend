import { deleteDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

const PLAYERS_COLLECTION = "players";

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

  await setDoc(doc(db, PLAYERS_COLLECTION, userId), {
    email,
    username,
    gameState,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return gameState;
}

export async function saveProgress(userId, gameState) {
  await setDoc(
    doc(db, PLAYERS_COLLECTION, userId),
    {
      username: gameState.username,
      gameState,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function loadProgress(userId) {
  const snapshot = await getDoc(doc(db, PLAYERS_COLLECTION, userId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return data.gameState || null;
}

export async function deletePlayerDocument(userId) {
  if (!userId) return;
  await deleteDoc(doc(db, PLAYERS_COLLECTION, userId));
}