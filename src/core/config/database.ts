import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const g = global as GlobalWithMongoose;

if (!g.mongooseCache) {
  g.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (g.mongooseCache?.conn) return g.mongooseCache.conn;
  if (!g.mongooseCache?.promise) {
    g.mongooseCache!.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  g.mongooseCache!.conn = await g.mongooseCache!.promise;
  return g.mongooseCache!.conn;
}