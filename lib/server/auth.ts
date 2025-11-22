import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

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
