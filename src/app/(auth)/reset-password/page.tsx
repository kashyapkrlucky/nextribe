"use client";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PasswordWithIcon from "@/components/ui/PasswordWithIcon";
import { useUserStore } from "@/store/useUserStore";
import Button from "@/components/ui/Button";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("t");
  const tokenError = !token ? "Invalid or expired reset link" : "";
  const { validateToken, resetPassword } = useUserStore();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(tokenError);

    if (tokenError) return;

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Token is already validated on component mount, no need to validate again here

    setIsLoading(true);
    // Call the actual resetPassword function
    try {
      await resetPassword(token!, password);
      setError("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      setError(message);
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, color: "", text: "" };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    const strengthMap = {
      0: { color: "bg-gray-300", text: "" },
      1: { color: "bg-red-500", text: "Weak" },
      2: { color: "bg-orange-500", text: "Fair" },
      3: { color: "bg-yellow-500", text: "Good" },
      4: { color: "bg-blue-500", text: "Strong" },
      5: { color: "bg-green-500", text: "Very Strong" },
    };

    return { strength, ...strengthMap[strength as keyof typeof strengthMap] };
  };

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const validateTokenAsync = async () => {
      if (token) {
        try {
          const isValid = await validateToken(token);
          setTokenValid(isValid);
        } catch {
          setTokenValid(false);
        }
      } else {
        setTokenValid(false);
      }
    };

    validateTokenAsync();
  }, [token, validateToken]);

  if (!token || tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="mb-4 text-lg">Invalid or expired reset link</p>
          <Link
            href="/login"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            Go back to login
          </Link>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="text-lg">Validating reset link...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 transition-all duration-300 ">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-3"
            >
              <Lock className="w-10 h-10 text-white" />
            </Link>
            <h1 className="text-4xl font-bold mb-3">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg">
              Create your new secure password
            </p>
          </div>

          {(tokenError || error) && !isSuccess && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{tokenError || error}</p>
            </div>
          )}

          {!isSuccess ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordWithIcon
                  label="Password"
                  error={error && !password ? "Password is required" : ""}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                />

                <PasswordWithIcon
                  label="Confirm Password"
                  error={
                    error && password !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="confirmPassword"
                />

                <Button
                  type="submit"
                  disabled={!password || !confirmPassword || isLoading}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transform transition-all duration-300 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </span>
                  <ArrowRight
                    className={`h-5 w-5 relative z-10 transition-transform duration-300 ${
                      isLoading ? "animate-spin" : "group-hover:translate-x-1"
                    }`}
                  />
                  </Button>
              </form>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back to </span>
                  <Link
                    href="/login"
                    className="text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">
                Password Reset Successful!
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Your password has been successfully updated
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
              >
                Continue to Login
                <ArrowRight className="h-5 w-5" />
              </Link>
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
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
