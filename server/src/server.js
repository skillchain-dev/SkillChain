const app = require('./app');
const { port, mongoUri } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');

async function start() {
  await connectDatabase(mongoUri);
  console.log(`Connected to MongoDB`);

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