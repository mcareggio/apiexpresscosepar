import mysql from "mysql2/promise";
import dbconf from "../dbconf.json" assert { type: "json" };
//JSON.parse();
console.log(dbconf.dbconf);
const connection = await mysql.createConnection(dbconf.dbconf);

export class DataModel {
  static async getAllTelefonos() {
    try {
      const [results, fields] = await connection.query(
        'SELECT * FROM `copemae` WHERE `nombre` LIKE "%Marcos%"'
      );

      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
      console.log(err);
    }
    const test = "okkk";
    return test;
  }
}
