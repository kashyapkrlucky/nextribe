"use client";
import { Fragment, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Login page - Redirecting to home");
      window.location.replace('/');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Spinner/>;
  }

  return <Fragment>{children}</Fragment>;
}
