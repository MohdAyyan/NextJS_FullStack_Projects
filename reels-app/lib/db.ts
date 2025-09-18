import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: { conn: Connection | null; promise: Promise<Connection> | null } | undefined = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Type assertion to ensure cached is not undefined after initialization
const mongooseCache = cached!;

export async function connectToDatabase() {
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    mongooseCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    mongooseCache.conn = await mongooseCache.promise;
  } catch (e) {
    mongooseCache.promise = null;
    throw e;
  }

  return mongooseCache.conn;
}
