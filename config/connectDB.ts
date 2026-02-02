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

declare global {
    var mongoose: {
        Types: any;
        conn: MongooseConnection | null;
        promise: Promise<MongooseConnection> | null;
    };
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

/*
  Main function to connect to MongoDB.
  It returns a connected mongoose instance.
*/
async function connectDB(): Promise<ReturnType<typeof mongoose.connect>> {

    /*
      If a connection already exists, reuse it.
      This avoids creating multiple MongoDB connections.
    */
    if (cached.conn) {
        return cached.conn;
    }

    /*
      If there is no ongoing connection promise,
      create one and store it in the global cache.
    */
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            /*
              Disables mongoose buffering.
              Recommended for serverless environments.
            */
            bufferCommands: false,
        });
    }

    /*
      Await the connection promise and store
      the resolved connection for reuse.
    */
    cached.conn = await cached.promise;

    /*
      Return the active MongoDB connection.
    */
    return cached.conn;
}

/*
  Export the connection function.
  It can be safely called in API routes, server actions,
  or Server Components.
*/
export default connectDB;
