import type { Metadata } from "next";
import { getUserFromCookie } from "@/lib/auth";
import LeftSideBar from "@/components/layout/LeftSideBar";

export const metadata: Metadata = {
  title: "Nextribe | Home",
  description: "Connect and collaborate with communities",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookie();

  return (
    <main className="w-full flex-1 overflow-y-auto p-4">
      <div className="w-full flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        <LeftSideBar user={user!} />
        {children}
      </div>
    </main>
  );
}
