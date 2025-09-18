import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URL!

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

let cached: { conn: Connection | null; promise: Promise<Connection> | null }  = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if (cached.conn) {
      return cached.conn;
    }
  
    if (!cached.promise) {
      const opts = {
        bufferCommands: true,
        maxPoolSize: 10,
      };
     
      cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
        console.log("MongoDB connected successfully!");
        return mongoose.connection;
      });
    }
  
    try {
      cached.conn = await cached.promise;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  
    return cached.conn;
  }