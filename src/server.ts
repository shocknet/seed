import express from "express";
import registerRoutes from "./routes";

export const app: {
  server: express.Express;
} = {
  server: null,
};

export const bootstrap = async () => {
  app.server = express();

  registerRoutes(app.server);

  return app;
};
