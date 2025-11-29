import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { getUserFromCookie } from "@/lib/auth";
import NavBar from "@/components/layout/NavBar";
import { APP_OPENGRAPH_DESCRIPTION, APP_OPENGRAPH_TITLE, APP_OPENGRAPH_TYPE, APP_URL } from "@/core/constants/app";

const geistSans = Geist();
const geistMono = Geist_Mono();

export const metadata: Metadata = {
  title: APP_OPENGRAPH_TITLE,
  description: APP_OPENGRAPH_DESCRIPTION,
  openGraph: {
    title: APP_OPENGRAPH_TITLE,
    description: APP_OPENGRAPH_DESCRIPTION,
    type: APP_OPENGRAPH_TYPE,
    url: APP_URL,
  },
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
    <html lang="en">
      <body className={`flex flex-col ${geistSans} ${geistMono}`}>
        <NavBar user={userinfo} />
        {children}
      </body>
    </html>
  );
}
