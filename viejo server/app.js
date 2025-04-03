const express = require('express')
const app = express()
const port = 3000
const { exec } = require("child_process");
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "coop"
});

const fecha = new Date();
const anio = fecha.getFullYear();
const hoy = fecha.getDate();
const mes = fecha.getMonth() + 1; 
const fecha_completa=hoy+"/"+mes+"/"+anio


var html="";
app.use(express.static('public'));
var JsBarcode = require('jsbarcode');
var { createCanvas,loadImage  } = require("canvas");
const { Console } = require('console');
var canvas = createCanvas();
var sql=""
var medioenvio=""
var periodo="202410"
 var html_listado=""
var ip="localhost"
var sql_listado=""
var i=0
var sql_periodos
var html_select_periodos=""
con.connect(function(err) {

  if (err) throw err;
 // console.log("Conectado a la Base de Datos!");
});

//gerner html para clickear 

app.get('/listado', (req, res) => {
  sql_listado="select Nombre,Numero as medio_de_envio from envioxwhatsapp"
  sql_listado_correo="select copemae.correo as Nombre,copemae.correo as medio_de_envio from copemae WHERE copemae.correo!=''  GROUP BY copemae.correo"
  sql_periodos="select Periodo from deuda group by periodo ORDER BY PERIODO desc limit 20";
  html_select_periodos=""
  html_select_periodos+="<select id='select_periodos' class='form-select' aria-label='Periodos' onchange='cambiar_enlaces();'>"

  con.query(sql_periodos,null,function (err, result_periodos) {
      html_select_periodos+="<option value='"+result_periodos[0].Periodo+"' selected>"+result_periodos[0].Periodo+"</option>"
    for(var t=1;t<result_periodos.length;t++){
      html_select_periodos+="<option value='"+result_periodos[t].Periodo+"'>"+result_periodos[t].Periodo+"</option>"
    }
    html_select_periodos+="</select>"
  });

  con.query(sql_listado,null,function (err, result) {

    html_listado="<html><head><title>Recibo Pago COSEPAR</title><link rel='stylesheet' type='text/css' href='style.css' media='all'/>"
    html_listado+="<script src='buscador.js'></script>"
    html_listado+="<script src='funciones_externas.js'></script>"
    html_listado+="<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH' crossorigin='anonymous'>"
    html_listado+="<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js' integrity='sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz' crossorigin='anonymous'></script>" 
    html_listado+="</head><body>"
    html_listado+="<div class='listado_cont'>"
    html_listado+="<form><div class='form-group'><label>Buscar</label> <input id='searchTerm' type='text' onkeyup='doSearch()'/></div>"
    html_listado+="<div class='form-group'><label>Periodo</label> "+html_select_periodos+"</div>"
    html_listado+="</form>"
    html_listado+="<table id='datos' class='table table-striped table-hover'>"
    html_listado+="<tr><th scope='col'>#</th><th scope='col'>Nombre</th></tr>"

    for(i=0;i<result.length;i++){
      html_listado+="<tr><td>"+(i+1)+"</td>"
      html_listado+=" "+"<td><a href='' id='recibo?telefono="+result[i].medio_de_envio+"'>"+result[i].Nombre+"</a></td>"

    }

    if (err) throw err;
      {
        con.query(sql_listado_correo,null,function (err, result) {
          for(var j=0;j<result.length;j++){
          html_listado+="<tr><td>"+((i+1)+j)+"</td>"  
          html_listado+=" "+"<td><a href='' id='recibo?correo="+result[j].medio_de_envio+"'>"+result[j].Nombre+"</a></td>"
          }
          if (err) throw err;
          {
            html_listado+="</div></table</body></html>"
            res.send(html_listado)
          }
        });
        
      }
  });

  
});
//

app.get('/recibo', (req, res) => {
    html="<html><head><title>Recibo Pago COSEPAR</title><link rel='stylesheet' type='text/css' href='style.css' media='all'/><link rel='stylesheet' type='text/css' href='style_print.css' media='print'/>"
    html+="<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css'>"
    html+="</head><body>" 
  
  const data = req.query;

  periodo=data.periodo
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
  

  con.query(sql,[medioenvio,periodo],function (err, result) {
  
    var totalfac=0
    var htmlrecibo=""
    htmlrecibo+="<div class='cont-recibo'><h1>Cooperativa de Agua Potable, Vivienda, Consumo, Servicios Asistenciales y Otros Servicios Publicos de Arata Limitada</h1>"
    htmlrecibo+="<div class='fecha'>Recibo de Pago Fecha: "+fecha_completa+"</div>"
    htmlrecibo+="<div class='listado'><table class='tabla'>"

    for(var i=0;i<result.length;i++){

      
      if(result[i].FECPAGO!=null)
      {
        htmlrecibo+="<tr style='text-decoration: line-through;'>"
        totalfac+=0
      }
        else
        totalfac+=result[i].total

      htmlrecibo+="<td>"+result[i].ruta+"-"+result[i].folio+"-"+result[i].subfolio+"</td><td>"+result[i].nombre+"</td><td>"+result[i].direccion+"</td><td>"+"Periodo:"+convertirPeriodo(periodo)+"</td>"
      JsBarcode(canvas,formatearBarcode(result[i].ruta,result[i].folio,result[i].subfolio,periodo) ,{width:3,height:20});
      htmlrecibo+="<td>"+formatearImporte(result[i].total)+"</td>"
      htmlrecibo+='<td>'+'<img class="img-barras" src="' + canvas.toDataURL() + '"/>'+'</td>'
      htmlrecibo+='<td class=dowmload>'+'<a href='+"facturas"+"/"+convertirPeriodoSinBarra(periodo)+"/"+formatearNombreArchivo(result[i].ruta,result[i].folio,result[i].subfolio,periodo)+".pdf><span class='glyphicon glyphicon-download'></span></a>"+'</td>'
      htmlrecibo+="</tr>"

      

      }

      htmlrecibo+="<tr style='font-weight: bold;'><td colspan='4' style='text-align:right;'>Total:</td><td>"+formatearImporte(totalfac)+"</td><tr/></table></div></div>"
      
      if (err) throw err;
      {
        html+=htmlrecibo+htmlrecibo
        html+="</body></html>"
        res.send(html)
      }

    });


  });
  app.get('/listado-total-facturas', (req, res) => {

    sql_listado="select id,nombre,direccion,ruta,folio,subfolio from copemae where tipousu!=7 ORDER BY nombre,ruta,folio,subfolio"
    sql_periodos="select Periodo from deuda group by periodo ORDER BY PERIODO desc limit 20";
    html_select_periodos=""
    html_select_periodos+="<select id='select_periodos' class='form-select' aria-label='Periodos' onchange='cambiar_enlaces();'>"

    con.query(sql_periodos,null,function (err, result_periodos) {
      html_select_periodos+="<option value='"+result_periodos[0].Periodo+"' selected>"+result_periodos[0].Periodo+"</option>"
    for(var t=1;t<result_periodos.length;t++){
      html_select_periodos+="<option value='"+result_periodos[t].Periodo+"'>"+result_periodos[t].Periodo+"</option>"
    }
    html_select_periodos+="</select>"
    });
    
  
    con.query(sql_listado,null,function (err, result) {
  
      html_listado="<html><head><title>Listado Facturas COSEPAR</title><link rel='stylesheet' type='text/css' href='style.css' media='all'/>"
      html_listado+="<script src='buscador.js'></script>"
      html_listado+="<script src='funciones_externas.js'></script>"
      html_listado+="<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH' crossorigin='anonymous'>"
      html_listado+="<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js' integrity='sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz' crossorigin='anonymous'></script>" 
      html_listado+="</head><body>"
      html_listado+="<div class='listado_cont'>"
      html_listado+="<div class='form-group'><label>Periodo</label> "+html_select_periodos+"</div>"
      html_listado+="<form><div class='form-group'><label>Buscar</label> <input id='searchTerm' type='text' onkeyup='doSearch()'/></div>"
      html_listado+="</form>"
      html_listado+="<table id='datos' class='table table-striped table-hover'>"
      html_listado+="<tr><th scope='col'>#</th><th scope='col'>Nombre</th></tr>"
  
      for(i=0;i<result.length;i++){
        html_listado+="<tr><td>"+(i+1)+"</td>"
        html_listado+=" "+"<td><a href='' id='recibo?id="+result[i].id+"'>"+result[i].nombre+" - "+result[i].direccion+" - ("+result[i].ruta+"-"+result[i].folio+"-"+result[i].subfolio+")</a></td>"
      }
  
      
            if (err) throw err;
            {
              html_listado+="</div></table</body></html>"
              res.send(html_listado)
            }
          
        
        
    });
  
    
  });
  app.get('/bar-code', (req, res) => {
    const data = req.query;
    ruta=data.ruta;
    folio=data.folio;
    subfolio=data.subfolio;
    periodo=data.periodo;
    JsBarcode(canvas,formatearBarcode(ruta,folio,subfolio,periodo) ,{width:3,height:20});
    html_api_barcode='<img class="img-barras" src="' + canvas.toDataURL() + '"/>';
    
  
              
              res.send(html_api_barcode)
            
  });
  function convertirPeriodo(periodo){
    var newPeriodo=periodo.charAt(4)+periodo.charAt(5)+"/"+periodo.charAt(0)+periodo.charAt(1)+periodo.charAt(2)+periodo.charAt(3)
    return newPeriodo
  }
  function convertirPeriodoSinBarra(periodo){
    var newPeriodo=periodo.charAt(4)+periodo.charAt(5)+periodo.charAt(0)+periodo.charAt(1)+periodo.charAt(2)+periodo.charAt(3)
    return newPeriodo
  }
  function formatearImporte(total){
    return total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
  });
  }

  app.listen(port, () => {
  console.log(`Aplicacion de recibos corriendo en el puerto: ${port}`)
  console.log("No cerrar esta ventana. Solo minimizar");
  })
  function formatearBarcode(ruta,folio,subfolio,periodo){
    var stringVariable="00"
    var folio=folio.toString();

    if(folio.length==2)
      stringVariable="000"
    else
      if(folio.length==1)
        stringVariable="0000"
    
      var strdev="010"+ruta+stringVariable+folio+subfolio+periodo
     
      return strdev
  }
  function formatearNombreArchivo(ruta,folio,subfolio,periodo){
    var stringVariable="00"
    var folio=folio.toString();

    if(folio.length==2)
      stringVariable="000"
    else
      if(folio.length==1)
        stringVariable="0000"
    
      var strdev="010"+ruta+stringVariable+folio+subfolio+"-"+convertirPeriodoSinBarra(periodo)
     
      return strdev
  }