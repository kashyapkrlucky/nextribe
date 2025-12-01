"use client";
import React, { useState } from "react";
import Link from "next/link";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  if (!email || !password) { setError("Please enter your email and password."); return; }
  try {
    setLoading(true);
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Sign in failed.");
      return;
    }
    // Cookie is set by server; just redirect
    window.location.href = "/";
  } catch (e) {
    console.log(e);
    setError("Sign in failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex-1 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-600 mb-6">
            Sign in to continue to NextTribe.
          </p>

          {error ? (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                tabIndex={0}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                {/* <Link href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                tabIndex={0}
              />
            </div>

            {/* <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border border-gray-200"
                />
                Remember me
              </label>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60"
              tabIndex={0}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-700">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignIn