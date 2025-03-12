import { Router } from "express";
import { AppController } from "../controller/appController.js";
export const createAppRouter = ({ dataModel }) => {
  const router = Router();
  const appController = new AppController({ dataModel });

  router.get("/", (req, res) => {
    res.status(200).send("Its Works");
  });

  router.get("/telefonos", appController.getTelefonos);
  router.get("/recibos-telefono", appController.getRecibosByTelAndPeriodo);
  router.get("/recibos-correo", appController.getRecibosByTelAndPeriodo);
  return router;
};
