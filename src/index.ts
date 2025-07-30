import { connectDB } from './config';
import AbabilWalletServer from '@/_server';
import { seedSuperAdmin } from './shared/common/seedSuperAdmin';

const server = new AbabilWalletServer();

(async () => {
  await connectDB();
  await seedSuperAdmin();
  await server.init();
})();

process.on('uncaughtException', err => {
  console.log(err);
  server.shutdown();
});

process.on('unhandledRejection', err => {
  console.log(err);
  server.shutdown();
});

process.on('SIGINT', () => {
  server.shutdown();
});

process.on('SIGTERM', () => {
  server.shutdown();
});
