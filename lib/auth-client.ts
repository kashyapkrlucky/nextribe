'use client';

import { IUser } from '@/types/index.types';

/**
 * Client-side function to get the user ID from the auth token
 * @returns {string | null} The user ID if authenticated, null otherwise
 */
export function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') {
    console.warn('getUserIdFromToken should only be called on the client side');
    return null;
  }

  try {
    // Get the token from cookies
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!cookieValue) return null;

    // Decode the JWT token (client-side only, no verification)
    const payload = JSON.parse(atob(cookieValue.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
}

/**
 * Client-side function to fetch the current user
 * @returns {Promise<IUser | null>} The current user if authenticated, null otherwise
 */
export async function getCurrentUserClient(): Promise<IUser | null> {
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

/**
 * Client-side function to check if the user is authenticated
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise
 */
export async function isAuthenticatedClient(): Promise<boolean> {
  const user = await getCurrentUserClient();
  return !!user;
}
