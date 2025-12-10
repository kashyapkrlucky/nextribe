"use client";
import React, { useState } from "react";
import Link from "next/link";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
  if (password !== confirm) { setError("Passwords do not match."); return; }
  if (!agree) { setError("You must accept the Terms to continue."); return; }

  try {
    setLoading(true);
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Sign up failed.");
      return;
    }
    // Redirect to sign-in after successful sign up
    window.location.href = "/sign-in";
  } catch (e) {
    console.log(e);
    setError("Sign up failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex-1 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Join NextTribe today.</p>

          {error ? (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

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
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border border-gray-200 dark:border-gray-600"
              />
              I agree to the <a className="text-indigo-600 hover:underline dark:text-indigo-400" href="#">Terms</a> and <a className="text-indigo-600 hover:underline dark:text-indigo-400" href="#">Privacy</a>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-700 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-600 hover:underline dark:text-indigo-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp