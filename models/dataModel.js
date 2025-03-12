import mysql from "mysql2/promise";
import dbconf from "../dbconf.json" assert { type: "json" };

export class DataModel {
  static async getAllTelefonos() {
    let [results, fields] = [];
    try {
      const connection = await mysql.createConnection(dbconf.dbconf);
      [results, fields] = await connection.query(
        "SELECT * FROM `envioxwhatsapp` "
      );
    } catch (err) {
      console.log(err);
    }

    return results;
  }
  static async getRecibosByTelAndPeriodo({ telefono, periodo }) {
    let [results, fields] = [];
    console.log(telefono + " " + periodo);
    try {
      const connection = await mysql.createConnection(dbconf.dbconf);
      [results, fields] = await connection.query(
        "select copemae.nombre,copemae.direccion,numero_rutafolio.ruta,numero_rutafolio.telefono,numero_rutafolio.folio,numero_rutafolio.subfolio,Periodo,TOTALFINAL as total,deuda.FECPAGO from numero_rutafolio left join copemae on copemae.ruta=numero_rutafolio.ruta and copemae.folio=numero_rutafolio.folio and copemae.subfolio=numero_rutafolio.subfolio left join envioxwhatsapp on envioxwhatsapp.Numero=numero_rutafolio.telefono left join deuda on numero_rutafolio.ruta=deuda.RUTA and numero_rutafolio.folio=deuda.folio and numero_rutafolio.subfolio=deuda.SUBFOLIO where telefono=? and periodo=?  order by envioxwhatsapp.Numero,periodo desc",
        [telefono, periodo]
      );
    } catch (err) {
      console.log(err);
    }

    return results;
  }
  static async getRecibosByCorreoAndPeriodo({ correo, periodo }) {
    let [results, fields] = [];
    console.log(telefono + " " + periodo);
    try {
      const connection = await mysql.createConnection(dbconf.dbconf);
      [results, fields] = await connection.query(
        "SELECT copemae.nombre,copemae.direccion,copemae.ruta,copemae.folio,copemae.subfolio,copemae.correo,deuda.periodo,deuda.totalfinal as total,deuda.FECPAGO from copemae left join deuda on copemae.ruta=deuda.ruta and copemae.folio=deuda.folio and copemae.subfolio=deuda.SUBFOLIO where correo=? and periodo=? ORDER BY correo,Periodo desc",
        [correo, periodo]
      );
    } catch (err) {
      console.log(err);
    }

    return results;
  }
}
/*

if(data.telefono!==undefined)
  {
  sql="select copemae.nombre,copemae.direccion,numero_rutafolio.ruta,numero_rutafolio.telefono,numero_rutafolio.folio,numero_rutafolio.subfolio,Periodo,TOTALFINAL as total,deuda.FECPAGO from numero_rutafolio left join copemae on copemae.ruta=numero_rutafolio.ruta and copemae.folio=numero_rutafolio.folio and copemae.subfolio=numero_rutafolio.subfolio left join envioxwhatsapp on envioxwhatsapp.Numero=numero_rutafolio.telefono left join deuda on numero_rutafolio.ruta=deuda.RUTA and numero_rutafolio.folio=deuda.folio and numero_rutafolio.subfolio=deuda.SUBFOLIO where telefono=? and periodo=?  order by envioxwhatsapp.Numero,periodo desc"
  medioenvio=data.telefono
  }
  else
  if(data.correo!==undefined)
  {
  sql="SELECT copemae.nombre,copemae.direccion,copemae.ruta,copemae.folio,copemae.subfolio,copemae.correo,deuda.periodo,deuda.totalfinal as total,deuda.FECPAGO from copemae left join deuda on copemae.ruta=deuda.ruta and copemae.folio=deuda.folio and copemae.subfolio=deuda.SUBFOLIO where correo=? and periodo=? ORDER BY correo,Periodo desc"
  medioenvio=data.correo
  }
  else
  {
    sql="SELECT copemae.nombre,copemae.direccion,copemae.ruta,copemae.folio,copemae.subfolio,copemae.correo,deuda.periodo,deuda.totalfinal as total,deuda.FECPAGO from copemae left join deuda on copemae.ruta=deuda.ruta and copemae.folio=deuda.folio and copemae.subfolio=deuda.SUBFOLIO where copemae.id=? and periodo=? "
    medioenvio=data.id
  }
  

sql_listado="select Nombre,Numero as medio_de_envio from envioxwhatsapp"
  sql_listado_correo="select copemae.correo as Nombre,copemae.correo as medio_de_envio from copemae WHERE copemae.correo!=''  GROUP BY copemae.correo"
  sql_periodos="select Periodo from deuda group by periodo ORDER BY PERIODO desc limit 20";
*/
