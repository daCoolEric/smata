// app/auth/verify-email/page.jsx
"use client";
import { useState } from "react";
import AuthTransition from "@/app/components/auth/AuthTransition";
import AuthCard from "@/app/components/auth/AuthCard";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("checking");

  const getStatusMessage = () => {
    return (
      <>
        We've sent a verification email to <strong>{email}</strong>.
        <br />
        Please check your inbox and click the verification link.
      </>
    );
  };

  return (
    <AuthTransition>
      <AuthCard
        title="Verify Your Email"
        subtitle="One last step to complete your registration"
      >
        <div className="text-center space-y-6">
          <div className="mb-6">
            <div className="text-gray-400">✉️</div>
          </div>

          <p className="text-gray-700">{getStatusMessage()}</p>

          <div className="mt-6">
            <Link href="/auth/signup">
              <Button className="w-full">Back to Sign Up</Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </div>
        </div>
      </AuthCard>
    </AuthTransition>
  );
}
