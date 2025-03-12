import { Router } from "express";
import { AppController } from "../controller/appController.js";
export const createAppRouter = ({ dataModel }) => {
  const router = Router();
  const appController = new AppController({ dataModel });

  router.get("/", (req, res) => {
    res.status(200).send("Its Works");
  });

  router.get("/telefonos", appController.getTelefonos);
  return router;
};
