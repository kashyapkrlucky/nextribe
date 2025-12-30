"use client";
import React, { useState } from "react";
import Link from "next/link";
import InputWithIcon from "@/components/ui/InputWithIcon";
import { UserIcon } from "lucide-react";
import PasswordWithIcon from "@/components/ui/PasswordWithIcon";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();
  const { login: authLogin } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.status === 200 && result.data?.user && result.data?.token) {
      console.log("Login successful, redirecting...");
      authLogin(result.data.user, result.data.token);
      window.location.href = "/";
    }
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
        <div className="bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Sign in to continue to NextTribe.
          </p>

          {error ? (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <InputWithIcon
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              label="Email"
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="Enter your email"
            />

            <PasswordWithIcon
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              error={error}
            />

            <div className="flex items-center justify-end">
              <Link
                href="#"
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60"
              tabIndex={0}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-700 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
