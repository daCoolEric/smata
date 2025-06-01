import { auth } from "./firebase";
import { signOut } from "firebase/auth";

export const logout = async () => {
  try {
    await signOut(auth);
    return true; // Sign-out successful
  } catch (error) {
    console.error("Error signing out: ", error);
    return false; // Sign-out failed
  }
};
