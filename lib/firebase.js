import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only in browser environment
const app =
  typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;

const SESSION_TIMEOUT_MINUTES = 30; // 30 minutes inactivity timeout

export function initializeSessionTimeout() {
  let activityTimer;
  let tokenCheckInterval;

  const resetActivityTimer = () => {
    if (activityTimer) clearTimeout(activityTimer);
    activityTimer = setTimeout(
      () => handleTimeout(),
      SESSION_TIMEOUT_MINUTES * 60 * 1000
    );
  };

  const handleTimeout = () => {
    signOut(auth);
    if (typeof window !== "undefined") {
      window.location.href = "/login?reason=timeout";
    }
  };

  const setupActivityListeners = () => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", resetActivityTimer);
      window.addEventListener("keypress", resetActivityTimer);
      window.addEventListener("scroll", resetActivityTimer);
      window.addEventListener("click", resetActivityTimer);
      window.addEventListener("touchstart", resetActivityTimer);
    }
  };

  const cleanupActivityListeners = () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keypress", resetActivityTimer);
      window.removeEventListener("scroll", resetActivityTimer);
      window.removeEventListener("click", resetActivityTimer);
      window.removeEventListener("touchstart", resetActivityTimer);
    }
  };

  const startTokenValidation = (user) => {
    // Check token every 5 minutes
    tokenCheckInterval = setInterval(async () => {
      try {
        const token = await getIdToken(user);
        const expirationTime = new Date(
          JSON.parse(atob(token.split(".")[1])).exp * 1000
        );
        if (Date.now() > expirationTime) {
          handleTimeout();
        }
      } catch (error) {
        handleTimeout();
      }
    }, 5 * 60 * 1000);
  };

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      resetActivityTimer();
      setupActivityListeners();
      startTokenValidation(user);
    } else {
      if (activityTimer) clearTimeout(activityTimer);
      if (tokenCheckInterval) clearInterval(tokenCheckInterval);
      cleanupActivityListeners();
    }
  });

  return () => {
    unsubscribe();
    if (activityTimer) clearTimeout(activityTimer);
    if (tokenCheckInterval) clearInterval(tokenCheckInterval);
    cleanupActivityListeners();
  };
}

export { auth };
