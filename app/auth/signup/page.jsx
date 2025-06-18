"use client";
import AuthTransition from "@/app/components/auth/AuthTransition";
import AuthCard from "@/app/components/auth/AuthCard";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import SocialButtons from "@/app/components/auth/SocialButtons";
import Link from "next/link";

export default function SignupPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic
  };

  return (
    <AuthTransition>
      <AuthCard
        title="Create your account"
        subtitle="Join our learning community"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              placeholder="John"
            />

            <Input
              label="Last name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              placeholder="Doe"
            />
          </div>

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
            autoComplete="new-password"
            required
            placeholder="••••••••"
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>
        </form>

        <SocialButtons
          onGoogle={() => console.log("Google signup")}
          onApple={() => console.log("Apple signup")}
          onMicrosoft={() => console.log("Microsoft signup")}
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
