const { port, mongoUri } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');
const app = require('./app');

if (!process.env.AUTH_TOKEN_SECRET) {
  console.warn('AUTH_TOKEN_SECRET is unset; authentication tokens will be invalidated when the server restarts.');
}
if (process.env.NODE_ENV === 'production' && (!process.env.AUTH_TOKEN_SECRET || process.env.AUTH_TOKEN_SECRET.length < 32)) {
  throw new Error('Production requires AUTH_TOKEN_SECRET to contain at least 32 characters.');
}

async function start() {
  try {
    await connectDatabase(mongoUri);
    console.log(`Connected to MongoDB`);
  } catch (err) {
    if (mongoUri && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost')) {
      console.warn(`[database] Remote MongoDB connection failed (${err.message}). Retrying with local MongoDB...`);
      await connectDatabase('mongodb://127.0.0.1:27017/skillchain');
      console.log(`Connected to local MongoDB (fallback)`);
    } else {
      throw err;
    }
  }

  const server = app.listen(port, () => console.log(`SkillChain server listening on port ${port}`));

  async function shutdown(signal) {
    console.log(`${signal} received`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exit(1);
});