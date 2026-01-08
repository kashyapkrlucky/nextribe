import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/styles/globals.css";
import { APP_OPENGRAPH_DESCRIPTION, APP_OPENGRAPH_TITLE, APP_OPENGRAPH_TYPE, APP_URL } from "@/core/constants";
import { Toaster } from "react-hot-toast";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

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
  return (
    <html lang="en">
      <body className={`flex flex-col h-screen ${openSans.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
