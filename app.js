import express, { json } from "express";
import { createAppRouter } from "./routes/raiz.js";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
export const createApp = ({ dataModel }) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");
  app.use(corsMiddleware());
  app.use("/", createAppRouter({ dataModel }));
  const PORT = 4000;
  console.log(PORT);
  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
