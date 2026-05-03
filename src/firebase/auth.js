import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";

export async function signUpUser(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (username) {
    await updateProfile(credential.user, {
      displayName: username,
    });
  }

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function deleteUserAccount(user, credentials = null) {
  if (!user) return;

  if (credentials?.email && credentials?.password) {
    const credential = EmailAuthProvider.credential(credentials.email, credentials.password);
    await reauthenticateWithCredential(user, credential);
  }

  await deleteUser(user);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}