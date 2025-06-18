"use client";
import AuthTransition from "@/components/auth/AuthTransition";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Button from "@/app/components/ui/Button";

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
  };

  return (
    <AuthTransition>
      <AuthCard title="Reset your password">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
          />

          <div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    </AuthTransition>
  );
}
