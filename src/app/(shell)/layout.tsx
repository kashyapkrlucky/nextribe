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

  const userinfo = {
    email: user?.email || "",
    name: user?.name || "",
    id: user?._id.toString() || "",
  };
  return (
    <main className="w-full flex-1 flex flex-col lg:flex-row gap-6 p-6">
      <LeftSideBar user={userinfo} />
      {children}
    </main>
  );
}
