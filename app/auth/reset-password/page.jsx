"use client";

import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import AuthTransition from "@/app/components/auth/AuthTransition";

export default function ResetPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reset password logic
  };

  return (
    <AuthTransition>
      <AuthCard title="Set a new password">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
          />

          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
          />

          <div>
            <Button type="submit" className="w-full">
              Reset password
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
