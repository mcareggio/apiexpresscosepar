export class AppController {
  constructor({ dataModel }) {
    this.datamodel = dataModel;
  }

  getTelefonos = async (req, res) => {
    const telefonos = await this.datamodel.getAllTelefonos();
    res.json(telefonos);
  };
}
