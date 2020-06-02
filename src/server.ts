import express from 'express';
import { createConnection, Connection } from 'typeorm';

import registerRoutes from './routes';
import config from './config';

export const app: {
  db: Connection;
  server: express.Express;
} = {
  db: null,
  server: null,
};

export const bootstrap = async () => {
  app.server = express();

  app.db = await createConnection(config.db);

  await app.db.runMigrations();

  registerRoutes(app.server);

  return app;
};
