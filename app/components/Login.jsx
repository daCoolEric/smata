"use client";
import { useAuth } from "@/context/AuthContext";
// import { Button } from "./ui/button"; // Or your button component

export default function Login() {
  const { googleSignIn, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to Smata</h1>
          <p className="mb-8 text-lg">
            Your intelligent study companion for better learning
          </p>
          <button
            onClick={googleSignIn}
            className="flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
          <p className="mb-6">You're now signed in as {user.email}</p>
          <button
            onClick={logOut}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
