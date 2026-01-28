"use client";
import React, { useState } from "react";
import InputWithIcon from "@/components/ui/InputWithIcon";
import PasswordWithIcon from "@/components/ui/PasswordWithIcon";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import CustomToast from "@/components/ui/CustomToast";
import PageLink from "@/components/ui/PageLink";
import { MailIcon } from "lucide-react";
import {
  DONT_HAVE_AN_ACCOUNT,
  FILL_IN_ALL_FIELDS,
  HOME_PATH,
  INVALID_EMAIL_OR_PASSWORD,
  SIGN_IN_TO_CONTINUE,
  WELCOME,
  FORGOT_PASSWORD,
} from "@/core/constants/app";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();
  const { login: authLogin } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      CustomToast("error", FILL_IN_ALL_FIELDS);
      return;
    }
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.status && result.data?.user && result.data?.token) {
        authLogin(result.data.user, result.data.token);
        window.location.href = HOME_PATH;
      }
    } catch (e) {
      console.log(e);
      CustomToast("error", INVALID_EMAIL_OR_PASSWORD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-2 bg-white border border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <Text variant="h2" className="mb-1">{WELCOME}</Text>
        <Text variant="body-sm" color="muted" className="mb-6">
          {SIGN_IN_TO_CONTINUE}
        </Text>

        <form onSubmit={onSubmit} className="space-y-4">
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

          <div className="flex items-center justify-end">
            <PageLink url="/forgot-password" text={FORGOT_PASSWORD} />
          </div>

          <Button type="submit" disabled={loading} tabIndex={0} fullWidth>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-6">
          <Text variant="body-sm" color="secondary">
            {DONT_HAVE_AN_ACCOUNT} &nbsp;
            <PageLink url="/sign-up" text="Create one" />
          </Text>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
