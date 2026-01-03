"use client";
import React, { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import { MailIcon, UserIcon } from "lucide-react";
import InputWithIcon from "@/components/ui/InputWithIcon";
import PasswordWithIcon from "@/components/ui/PasswordWithIcon";
import PageLink from "@/components/ui/PageLink";
import InlineLoader from "@/components/ui/InlineLoader";
import UserNameSub from "@/components/ui/UserNameSub";
import CustomToast from "@/components/ui/CustomToast";
import Button from "@/components/ui/Button";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useUserStore();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirm) {
      CustomToast("error", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      CustomToast("error", "Passwords do not match.");
      return;
    }
    if (!agree) {
      CustomToast("error", "You must accept the Terms to continue.");
      return;
    }

    try {
      setLoading(true);
      const result = await register({ username, email, password });
      if (result.status && result.data?.user && result.data?.token) {
        login(result.data.user, result.data.token);
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
      CustomToast("error", "Sign up failed. Please try again.");
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

          <form onSubmit={onSubmit} className="space-y-4">
            <InputWithIcon
              icon={<UserIcon className="w-4 h-4" />}
              label="Username"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
            />

            {username && (
              <UserNameSub username={username} setUsername={setUsername} />
            )}

            <InputWithIcon
              icon={<MailIcon className="h-5 w-5 text-gray-400" />}
              label="Email"
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <PasswordWithIcon
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />

            <PasswordWithIcon
              label="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              name="confirm"
            />

            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border border-gray-200 dark:border-gray-600"
              />
              I agree to the
              <PageLink url="/terms" text="Terms & Conditions" />
            </label>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} isLoading={loading} fullWidth>
                Create account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-slate-700 dark:text-slate-400">
            Already have an account? <PageLink url="/sign-in" text="Sign in" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
