import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { IUser } from '@/types/index.types';
import { Types } from "mongoose";

// Constants
const TOKEN_NAME = 'token';
const DEFAULT_EXPIRATION = '7d';
const TOKEN_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Initialize JWT key
const getJwtKey = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return new TextEncoder().encode(JWT_SECRET);
};

// Types
type TokenPayload = {
  sub: string;
  email: string;
  name?: string;
};

type AuthResult = {
  user: IUser | null;
  isAuthenticated: boolean;
  error?: string;
};

// Token operations
export const signToken = async (payload: { sub: string; email: string; name?: string }): Promise<string> => {
  const key = getJwtKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(DEFAULT_EXPIRATION)
    .sign(key);
};

export const createAuthToken = signToken; // For backward compatibility

export const verifyAuthToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJwtKey());
    return { payload: payload as TokenPayload, error: null };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { payload: null, error: 'Invalid or expired token' };
  }
};

// Cookie management
export const setAuthCookie = (response: NextResponse, token: string, options: { maxAge?: number } = {}): void => {
  response.cookies.set({
    name: TOKEN_NAME,
    value: token,
    ...TOKEN_OPTIONS,
    ...(options.maxAge && { maxAge: options.maxAge }),
  });
};

export const clearAuthCookie = (response: NextResponse): void => {
  response.cookies.set({
    name: TOKEN_NAME,
    value: '',
    ...TOKEN_OPTIONS,
    maxAge: 0,
  });
};

// Session management
export const getCurrentUser = async (): Promise<AuthResult> => {
  const user = await getUserFromRequest();
  return {
    user,
    isAuthenticated: !!user,
  };
};

export const getUserIdFromCookie = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    const { payload, error } = await verifyAuthToken(token);
    if (error || !payload?.sub) return null;
    return payload.sub;
  } catch (error) {
    console.error('Error getting token from request:', error);
    return null;
  }
};

export const getUserFromCookie = async (): Promise<IUser | null> => {
  const token = await getTokenFromRequest();
  if (!token) return null;

  const { payload, error } = await verifyAuthToken(token);
  if (error || !payload?.sub) return null;

  // In a real app, fetch user from database
  // const user = await db.user.findUnique({ where: { id: payload.sub } });
  
  // Mock implementation
  return {
    _id: new Types.ObjectId(payload.sub),
    email: payload.email,
    name: payload.name || 'Anonymous',
  };
};

export const requireAuth = async (): Promise<AuthResult> => {
  const result = await getCurrentUser();
  if (!result.isAuthenticated) {
    return { ...result, error: 'Authentication required' };
  }
  return result;
};

// Internal helpers
const getTokenFromRequest = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAME)?.value || null;
  } catch (error) {
    console.error('Error getting token from request:', error);
    return null;
  }
};

export const getUserIdFromRequest = async (): Promise<string | null> => {
  const token = await getTokenFromRequest();
  if (!token) return null;

  const { payload, error } = await verifyAuthToken(token);
  if (error || !payload?.sub) return null;
  
  return payload.sub;
};

const getUserFromRequest = async (): Promise<IUser | null> => {
  const token = await getTokenFromRequest();
  if (!token) return null;

  const { payload, error } = await verifyAuthToken(token);
  if (error || !payload?.sub) return null;

  // In a real app, fetch user from database
  // const user = await db.user.findUnique({ where: { id: payload.sub } });
  
  // Mock implementation
  return {
    _id: new Types.ObjectId(payload.sub),
    email: payload.email,
    name: payload.name || 'Anonymous',
  };
};


export async function getServerUser() {
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
    };
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}
