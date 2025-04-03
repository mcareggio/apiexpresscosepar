export class AppController {
  constructor({ dataModel }) {
    this.datamodel = dataModel;
  }

  getRecibosByTelAndPeriodo = async (req, res) => {
    const { telefono, periodo } = req.params;
    const recibos = await this.datamodel.getRecibosByTelAndPeriodo({
      telefono,
      periodo,
    });
    res.status(200).json(recibos);
  };
  getRecibosByCorreoAndPeriodo = async (req, res) => {
    const { correo, periodo } = req.params;
    const recibos = await this.datamodel.getRecibosByCorreoAndPeriodo({
      correo,
      periodo,
    });
    res.status(200).json(recibos);
  };
  getRecibosByIdUser = async (req, res) => {
    const { id, periodo } = req.params;
    const recibos = await this.datamodel.getRecibosByIdUser({
      id: id,
      periodo: periodo,
    });
    res.json(recibos);
  };
  getTelefonos = async (req, res) => {
    const telefonos = await this.datamodel.getAllTelefonos();
    res.json(telefonos);
  };
  getCorreos = async (req, res) => {
    const telefonos = await this.datamodel.getAllCorreos();
    res.json(telefonos);
  };
  getPeriodos = async (req, res) => {
    const { cant } = req.params;
    const periodos = await this.datamodel.getPeriodos({ cant });
    res.json(periodos);
  };
  getUsuariosEnvio = async (req, res) => {
    const usuarios_envio = await this.datamodel.getUsuariosEnvio({});
    res.json(usuarios_envio);
  };
  getUsuariosEnvioBusqueda = async (req, res) => {
    const { search } = req.params;
    const usuarios_envio = await this.datamodel.getUsuariosEnvioBusqueda({
      search,
    });
    res.json(usuarios_envio);
  };
}
