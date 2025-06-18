"use client";
import AuthTransition from "@/app/components/auth/AuthTransition";
import AuthCard from "@/app/components/auth/AuthCard";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import SocialButtons from "@/app/components/auth/SocialButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/home/dashboard");
    }
  }, [user, loading, router]);

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <AuthTransition>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue your learning journey"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>

        <SocialButtons
          onGoogle={handleSignInWithGoogle}
          onApple={() => console.log("Apple login")}
          onMicrosoft={() => console.log("Microsoft login")}
        />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </div>
      </AuthCard>
    </AuthTransition>
  );
}
