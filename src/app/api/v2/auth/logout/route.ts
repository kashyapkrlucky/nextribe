import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  clearAuthCookie(res);
  return res;
}

// Optionally support GET to allow anchor/link-based logout if needed
export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  clearAuthCookie(res);
  return res;
}
