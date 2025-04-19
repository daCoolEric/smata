"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center flex flex-col items-center justify-center ">
        <h1 className="text-3xl font-bold mb-6">Welcome to Smata</h1>
        <p className="mb-8 text-lg">
          Your intelligent study companion for better learning
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
