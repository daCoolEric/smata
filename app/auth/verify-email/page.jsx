// app/auth/verify-email/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/config/supabaseConfig";
import AuthTransition from "@/app/components/auth/AuthTransition";
import AuthCard from "@/app/components/auth/AuthCard";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setStatus("invalid");
      setLoading(false);
      return;
    }

    const checkVerification = async () => {
      try {
        // 1. First check if we have a session in the URL (for email confirmation)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!sessionError && session?.user?.email === email) {
          await handleVerifiedUser(session.user);
          return;
        }

        // 2. If no session, check if user exists and is verified
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!userError && user?.email === email && user?.email_confirmed_at) {
          await handleVerifiedUser(user);
          return;
        }

        // 3. Set up listener for future auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user?.email === email) {
            await handleVerifiedUser(session.user);
            subscription?.unsubscribe();
          }
        });

        setStatus("waiting");
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message || "Verification failed");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    const handleVerifiedUser = async (user) => {
      await createUserProfile(user);
      setStatus("verified");
      router.push("/profile/setup");
    };

    checkVerification();

    return () => {
      supabase.auth
        .onAuthStateChange(() => {})
        .data.subscription?.unsubscribe();
    };
  }, [email, router]);

  const createUserProfile = async (user) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
      };

      const { error } = await supabase.from("profiles").insert(profileData);

      if (error && !error.message.includes("duplicate key")) {
        console.error("Profile creation error:", error);
      }
    } catch (err) {
      console.error("Profile creation failed:", err);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;
      setStatus("resent");
    } catch (err) {
      setError(err.message || "Failed to resend verification");
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "checking":
        return "Checking your email verification status...";
      case "waiting":
        return (
          <>
            We've sent a verification email to <strong>{email}</strong>.
            <br />
            Please check your inbox and click the verification link.
          </>
        );
      case "resent":
        return (
          <>
            New verification email sent to <strong>{email}</strong>.
            <br />
            Please check your inbox again.
          </>
        );
      case "verified":
        return "Email verified! Redirecting you to your profile...";
      case "invalid":
        return "Invalid verification link. Please try signing up again.";
      case "error":
        return error || "An error occurred during verification.";
      default:
        return "Processing your request...";
    }
  };

  return (
    <AuthTransition>
      <AuthCard
        title="Verify Your Email"
        subtitle="One last step to complete your registration"
      >
        <div className="text-center space-y-6">
          <div className="mb-6">
            {status === "verified" ? (
              <div className="text-green-600">✓</div>
            ) : (
              <div className="text-gray-400">✉️</div>
            )}
          </div>

          <p className="text-gray-700">{getStatusMessage()}</p>

          {status === "waiting" && (
            <div className="mt-6">
              <Button
                onClick={resendVerification}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}

          {(status === "invalid" || status === "error") && (
            <div className="mt-6">
              <Link href="/auth/signup">
                <Button className="w-full">Back to Sign Up</Button>
              </Link>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </div>
        </div>
      </AuthCard>
    </AuthTransition>
  );
}
