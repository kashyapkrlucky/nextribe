"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import { CheckIcon, MailIcon, UserIcon, XIcon } from "lucide-react";
import InputWithIcon from "@/components/ui/InputWithIcon";
import PasswordWithIcon from "@/components/ui/PasswordWithIcon";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useUserStore();
  const { login } = useAuth();

  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null;
    checking: boolean;
    message: string;
    suggestions: string[];
  }>({
    available: null,
    checking: false,
    message: "",
    suggestions: [],
  });

  // Debounced username check function
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 7) {
      setUsernameStatus({
        available: null,
        checking: false,
        message: "",
        suggestions: [],
      });
      return;
    }

    setUsernameStatus((prev) => ({ ...prev, checking: true }));

    try {
      const response = await fetch(
        `/api/auth/username?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsernameStatus({
          available: data.available,
          checking: false,
          message: data.message,
          suggestions: data.suggestions || [],
        });
      } else {
        setUsernameStatus({
          available: null,
          checking: false,
          message: data.error || "Error checking username",
          suggestions: [],
        });
      }
    } catch {
      setUsernameStatus({
        available: null,
        checking: false,
        message: "Network error",
        suggestions: [],
      });
    }
  }, []);

  // Debounce effect for username checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length >= 7) {
        checkUsernameAvailability(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsernameAvailability]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("You must accept the Terms to continue.");
      return;
    }

    try {
      setLoading(true);
      const result = await register({ username, email, password });
      console.log("Register result:", result);

      if (result.status === 200 && result.data?.user && result.data?.token) {
        console.log("Registration successful, logging in...");
        login(result.data.user, result.data.token);
        window.location.href = "/";
      }
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
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Join NextTribe today.
          </p>

          {error ? (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe123"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div> */}

            <InputWithIcon
              icon={<UserIcon className="w-4 h-4" />}
              label="Username"
              error={error}
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
            />

            {username && (
              <div className="px-1">
                {usernameStatus.checking && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-transparent"></div>
                    Checking availability...
                  </div>
                )}

                {!usernameStatus.checking &&
                  usernameStatus.available !== null && (
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          usernameStatus.available
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {usernameStatus.available ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <XIcon className="h-4 w-4" />
                        )}
                        {usernameStatus.message}
                      </div>

                      {/* Show suggestions if username is taken */}
                      {!usernameStatus.available &&
                        usernameStatus.suggestions.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Suggestions: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {usernameStatus.suggestions.map(
                                (suggestion, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setUsername(suggestion);
                                      setError("");
                                    }}
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
              </div>
            )}

            <InputWithIcon
              icon={<MailIcon className="h-5 w-5 text-gray-400" />}
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

            <PasswordWithIcon
              label="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              name="confirm"
              error={error}
            />

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border border-gray-200 dark:border-gray-600"
              />
              I agree to the
              <a
                className="text-indigo-600 hover:underline dark:text-indigo-400"
                href="#"
              >
                Terms
              </a>
              and
              <a
                className="text-indigo-600 hover:underline dark:text-indigo-400"
                href="#"
              >
                Privacy
              </a>
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
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
