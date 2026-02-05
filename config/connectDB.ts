import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

/*
  Extend the global object to cache the MongoDB connection.
  This is REQUIRED in Next.js to prevent multiple connections
  during hot reloads (development) and serverless executions (production).
*/
type MongooseConnection = Awaited<ReturnType<typeof mongoose.connect>>;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongoose: MongooseCache | undefined ;
}

/*
  Reuse existing cached connection if it exists.
  Otherwise, initialize the cache.
*/
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

const connectDB = async () => {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(process.env.MONGODB_URI!);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
};

export default connectDB;