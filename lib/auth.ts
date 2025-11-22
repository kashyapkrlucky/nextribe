import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_KEY = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: Record<string, any>, opts?: { expiresIn?: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(opts?.expiresIn || "7d")
    .sign(JWT_KEY);
  return token;
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_KEY);
  return payload;
}

export function setAuthCookie(res: NextResponse, token: string, opts?: { maxAge?: number }) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: opts?.maxAge ?? 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) return null;
    const payload = await verifyToken(token);
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return sub;
  } catch {
    return null;
  }
}
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { IUser } from '@/models/User';

export async function getUserFromCookie(): Promise<{ id?: string; email?: string; name?: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return {
      id: typeof payload.sub === "string" ? payload.sub : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
      bio: typeof payload.bio === "string" ? payload.bio : undefined,
    } as { id?: string; email?: string; name?: string; bio?: string };

  } catch (error) {
    console.error('Error getting user from cookie:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUserFromCookie();
  return !!user;
}

export async function getCurrentUser(): Promise<{ user: IUser & { bio?: string } | null; isAuthenticated: boolean }> {
  const user = await getUserFromCookie();
  return {
    user: user ? JSON.parse(JSON.stringify(user)) : null,
    isAuthenticated: !!user
  };
}

// Example of a protected route helper for Next.js pages
export async function withAuth() {
  const user = await getUserFromCookie();
  
  if (!user) {
    return { 
      redirect: { 
        destination: '/login', 
        permanent: false 
      } 
    };
  }
  
  return { 
    props: { 
      user: JSON.parse(JSON.stringify(user)) 
    } 
  };
}
