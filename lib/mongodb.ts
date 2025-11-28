import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://codecrunchenthusiast:Rana%40123@cluster0.l2jyof7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Add type declaration for global.mongoose
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: any; promise: Promise<any> | null } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached?.conn) {
    return cached!.conn;
  }

  if (!(cached?.promise)) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return cached;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    (cached ?? (global.mongoose = { conn: null, promise: null })).promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect; 