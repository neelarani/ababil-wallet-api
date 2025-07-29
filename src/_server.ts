import { createServer, Server } from 'http';
import app from '@/_app';
import { ENV } from '@/config';
import mongoose from 'mongoose';

class AbabilWalletServer {
  protected server: Server;

  constructor() {
    this.server = createServer(app);
  }

  init = async () => {
    try {
      this.server.listen(ENV.PORT, () => {
        console.log(`Server listening at: http://localhost:${ENV.PORT}`);
      });
    } catch (error) {
      console.error(
        `Failed to start the Server`,
        error instanceof Error && error
      );

      if (this.server.listening) {
        mongoose.connection.close(true);
        this.server.close(err => {
          if (err) {
            console.log('Error closing server:', err);
            process.exit(1);
          } else {
            console.log('Server has been closed');
          }
        });
      }
      console.log('Database disconnected');
      process.exit(1);
    }
  };

  shutdown = async () => {
    try {
      if (this.server.listening) {
        this.server.close(err => {
          if (err) {
            console.log('Error closing server:', err);
            process.exit(1);
          } else {
            console.log('Server has been closed');
          }
        });
      }

      await mongoose.connection.close(false);
      console.log('Database disconnected');

      process.exit(0);
    } catch (error) {
      console.log('Error during shutdown:', error);
      process.exit(1);
    }
  };
}

export default AbabilWalletServer;
