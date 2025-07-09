// app/auth/layout.js

// Force dynamic rendering for all auth pages
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }) {
  return <div className="auth-layout">{children}</div>;
}
