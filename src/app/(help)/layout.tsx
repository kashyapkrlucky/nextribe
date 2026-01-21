"use client";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import NavBar from "@/components/layout/NavBar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Spinner />}>
      <NavBar />
      <main className="flex-1 w-full h-full overflow-y-auto">{children}</main>
    </Suspense>
  );
}
