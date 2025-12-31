"use client";
import InputWithIcon from "@/components/ui/InputWithIcon";
import { ArrowRight, Mail, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const { isLoading, forgotPassword, passwordLinkSent } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      forgotPassword(email);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEmail(value);
    setError("");
  };

  return (
    <main className="flex-1 w-full flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
            >
              <Lock className="w-10 h-10 text-white" />
            </Link>
            <h1 className="text-4xl font-bold ">
              Password Recovery
            </h1>
            <p className="text-gray-600 text-sm">
              No worries! We&apos;ll send you reset instructions
            </p>
          </div>

          {!passwordLinkSent ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <InputWithIcon
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    label="Email Address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    placeholder="john@gmail.com"
                    />
                </div>

                <Button
                  type="submit"
                  disabled={!email || isLoading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                  </span>
                  <ArrowRight
                    className={`h-5 w-5 relative z-10 transition-transform duration-300 ${
                      isLoading ? "animate-spin" : "group-hover:translate-x-1"
                    }`}
                  />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  
                  <span className="text-sm">Remember your password? </span>
                  <Link
                    href="/login"
                    className="text-purple-600 hover:text-purple-200 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">
                Check Your Email
              </h2>
              <p className="text-gray-700 text-sm">
                We&apos;ve sent password reset instructions to <span className="font-medium">{email}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={() =>
                    useUserStore.setState({ passwordLinkSent: false })
                  }
                  className="inline-block text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Try again
                </button>
              </p>
              
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Need help?{" "}
            <Link
              href="/support"
              className="text-purple-300 hover:text-purple-200 transition-colors duration-200"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
