export class AppController {
  constructor({ dataModel }) {
    this.datamodel = dataModel;
  }

  getRecibosByTelAndPeriodo = async (req, res) => {
    const { telefono, periodo } = req.query;
    const recibos = await this.datamodel.getRecibosByTelAndPeriodo({
      telefono,
      periodo,
    });
    res.status(200).json(recibos);
  };
  getRecibosByCorreoAndPeriodo = async (req, res) => {
    const { telefono, periodo } = req.query;
    const recibos = await this.datamodel.getRecibosByCorreoAndPeriodo({
      telefono,
      periodo,
    });
    res.status(200).json(recibos);
  };
  getTelefonos = async (req, res) => {
    const telefonos = await this.datamodel.getAllTelefonos();
    res.json(telefonos);
  };
}
