import { bootstrap } from "./server";
import config from "./config";

bootstrap()
  .then((app) => {
    app.server.listen(config.port, () => {
      console.log(`ShockSeed is running on ${config.port}!`);
      app.nms.run();
    });
  })
  .catch((err) => console.error("Couldn't start the ShockSeed server:\n", err));
