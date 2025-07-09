"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthTransition from "@/app/components/auth/AuthTransition";
import AuthCard from "@/app/components/auth/AuthCard";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import SocialButtons from "@/app/components/auth/SocialButtons";
import { supabase } from "@/app/config/supabaseConfig";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    // Dynamically import Supabase client only on the client side
    import("@/app/config/supabaseConfig").then((module) => {
      setSupabase(module.supabase);
    });
  }, []);

  if (!supabase) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Sign up with Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (authError) throw authError;

      // 2. Verify user was created
      if (!user || !user.id) {
        throw new Error("User creation failed - no user ID available");
      }

      console.log("User created:", user.id);
      console.log("Email confirmed:", user.email_confirmed_at);

      // 3. Handle different scenarios based on email confirmation
      if (!user.email_confirmed_at) {
        // Email confirmation required - don't create profile yet
        console.log("Email confirmation required");
        router.push(
          "/auth/verify-email?email=" + encodeURIComponent(formData.email)
        );
        return;
      }

      // 4. For confirmed users, try to get session with better debugging
      let session = null;
      let attempts = 0;

      while (attempts < 10 && !session) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          break;
        }

        session = currentSession;
        attempts++;

        console.log(`Session attempt ${attempts}:`, {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          authUid: session ? "Set" : "Not set",
        });

        // Also try refreshing the session
        if (!session && attempts === 5) {
          console.log("Trying to refresh session...");
          const {
            data: { session: refreshedSession },
          } = await supabase.auth.refreshSession();
          session = refreshedSession;
        }
      }

      // 5. Create profile - try different approaches
      if (session && session.user) {
        // Method A: Use authenticated session
        await createProfileWithSession(session.user);
      } else {
        // Method B: Use service function or trigger
        console.log("No session found, using alternative method");
        await createProfileDirect(user);
      }

      router.push("/profile/setup");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Method A: Create profile with authenticated session
  const createProfileWithSession = async (user) => {
    // Double-check that we have an authenticated context
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    console.log("Current authenticated user:", {
      sessionUserId: user.id,
      currentUserId: currentUser?.id,
      match: user.id === currentUser?.id,
    });

    if (!currentUser || currentUser.id !== user.id) {
      throw new Error("Authentication context mismatch");
    }

    const profileData = {
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    };

    console.log("Attempting to insert profile:", profileData);

    const { data, error } = await supabase
      .from("profiles")
      .insert(profileData)
      .select();

    if (error) {
      console.error("Profile creation error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Profile creation failed: ${error.message}`);
    }

    console.log("Profile created with session:", data);
  };

  // Method B: Create profile using RPC function (requires database function)
  const createProfileDirect = async (user) => {
    // First, try using an RPC function
    const { error: rpcError } = await supabase.rpc("create_user_profile", {
      user_id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    });

    if (rpcError) {
      console.error("RPC profile creation failed:", rpcError);
      // If RPC fails, the profile will be created by database trigger
      // or during the email confirmation callback
      console.log("Profile will be created via trigger or callback");
    } else {
      console.log("Profile created via RPC");
    }
  };

  return (
    <AuthTransition>
      <AuthCard
        title="Create your account"
        subtitle="Join our learning community"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
              placeholder="John"
            />

            <Input
              label="Last name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            placeholder="your@email.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="••••••••"
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <SocialButtons
          onGoogle={() => handleSocialLogin("google")}
          onApple={() => handleSocialLogin("apple")}
          onMicrosoft={() => handleSocialLogin("azure")}
          loading={loading}
        />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthTransition>
  );
}
