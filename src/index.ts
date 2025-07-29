import { connectDB } from './config';
import AbabilWalletServer from '@/_server';

const server = new AbabilWalletServer();

(async () => {
  await connectDB();
  await server.init();
})();

process.on('uncaughtException', () => {
  server.shutdown();
});

process.on('unhandledRejection', () => {
  server.shutdown();
});

process.on('SIGINT', () => {
  server.shutdown();
});

process.on('SIGTERM', () => {
  server.shutdown();
});
