import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { IUser } from '@/types/index.types';

// Server-side only functions
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_KEY = new TextEncoder().encode(JWT_SECRET);

// Server-side token functions
export async function signToken(payload: Record<string, unknown>, opts?: { expiresIn?: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(opts?.expiresIn || "7d")
    .sign(JWT_KEY);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_KEY);
    return { payload, error: null };
  } catch (err) {
    console.error('Token verification failed:', err);
    return { payload: null, error: 'Invalid or expired token' };
  }
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
    const { payload } = await verifyToken(token);
    if (!payload) return null;
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return sub;
  } catch {
    return null;
  }
}

// Client-side compatible functions
export async function getCurrentUserClient() {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Server-side only function
export async function getUserFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_KEY);
    
    // Return a partial IUser that matches the required fields
    return {
      _id: typeof payload.sub === "string" ? payload.sub : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
      // Add required fields with default values
      passwordHash: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IUser & { _id: string };
  } catch (err) {
    console.error('Error getting user from cookie:', err);
    return null;
  }
}

// Universal auth functions
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') {
    // Server-side check
    const user = await getUserFromCookie();
    return !!user;
  } else {
    // Client-side check
    const user = await getCurrentUserClient();
    return !!user;
  }
}

export async function getCurrentUser(): Promise<{ user: IUser & { _id: string } | null; isAuthenticated: boolean }> {
  if (typeof window === 'undefined') {
    // Server-side
    const user = await getUserFromCookie();
    return {
      user: user ? { ...user, _id: '' } : null,
      isAuthenticated: !!user
    };
  } else {
    // Client-side
    const user = await getCurrentUserClient();
    return {
      user: user || { _id: "" },
      isAuthenticated: !!user
    };
  }
}

// Protected route helper for Next.js pages
export async function withAuth() {
  const user = typeof window === 'undefined' 
    ? await getUserFromCookie() 
    : await getCurrentUserClient();
  
  if (!user) {
    return { 
      redirect: { 
        destination: '/sign-in', 
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
