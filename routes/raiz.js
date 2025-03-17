import { Router } from "express";
import { AppController } from "../controller/appController.js";
export const createAppRouter = ({ dataModel }) => {
  const router = Router();
  const appController = new AppController({ dataModel });

  router.get("/", (req, res) => {
    res.status(200).send("Its Works");
  });
  router.get("/periodos/:cant", appController.getPeriodos);
  router.get("/correos", appController.getCorreos);
  router.get("/telefonos", appController.getTelefonos);
  router.get(
    "/recibos-telefono/:telefono/:periodo",
    appController.getRecibosByTelAndPeriodo
  );
  router.get(
    "/recibos-correo/:correo/:periodo",
    appController.getRecibosByCorreoAndPeriodo
  );
  router.get("/recibos/:id/:periodo", appController.getRecibosByIdUser);
  return router;
};
