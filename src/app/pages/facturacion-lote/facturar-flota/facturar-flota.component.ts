import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturar-flota',
  templateUrl: './facturar-flota.component.html',
  styleUrls: ['./facturar-flota.component.scss']
})
export class FacturarFlotaComponent implements OnInit {

  ordenesFlota:any=[];
  infReporte:any=[];

  //atributos

  placa1:any;
  marca1:any;
  kilometraje:any;

  arregloProvisional:any=[];

  infForID:any=[];

  arr:any=[];
  arr2:any=[];

  arregloGlobal:any=[];
  //bandera
  banderaEBT= false;
  banderaTotales = false;
  banderaFacturar = false;

  //TOTAL
  totalS=0;
  totalP=0;
  totalG=0;

  subTotal12S = 0;
  subTotalceroS = 0;
  subTotalS = 0;
  iva12S = 0;
  subTotal12SP = 0;
  subTotalceroSP = 0;
  subTotalSP = 0;
  iva12SP = 0;

  //Factura
  datosLocalStorage:any;
  bodega_id:any;
  puntoventa_id:any;
  ci_ruc:any;
  user_id:any;
  idFactura:any;
  idOrdenes:any=[];

  factura1:any;
  totalcompra1:any;
  creditoval1:any;

  constructor(
    private allService: AllServiceService

  ) { }

  ngOnInit(): void {
  }


  //FORMULARIOS
  formFacturarFlota = new FormGroup({
    ci_ruc:new FormControl('', [Validators.required, Validators.min(10), Validators.pattern('[0-9]{10,14}')])
  })


  get f() {
    return this.formFacturarFlota.controls;
  }

  locationreload() {
    location.reload();      
    }

  buscarFlota(form:any){

    let ci_ruc= form.ci_ruc;
    this.ci_ruc = ci_ruc;
    // console.log(ci_ruc);

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Buscando Flota',
      text:'Se está buscando su vehículo, espere por favor' ,
      });
      Swal.showLoading();

      this.allService.getAl('orden_abierta/busqueda_ruc?ruc='+ci_ruc).then((data:any)=>{
        Swal.close();

        // console.log("LO QUE TRAE",data);
        
        this.infReporte = data;
        if(data.length ==0){
          Swal.fire({
            allowOutsideClick:false,
            icon:'error',
            title:'Sin resultados',
            confirmButtonColor: '#818181',
            text:'Identificación no tiene órdenes asignadas',
    
            });
            
            this.formFacturarFlota.reset();

        }else{



        let arrayValAuto :any;
        let placa1:any;
        let marca1:any;
        let kilometraje:any;
        let arr;
  
          for (let i = 0; i < this.infReporte.length; i++) {
  
            for (let j = 0; j < this.infReporte[i].atributo.length; j++) {
              let atriNombre = this.infReporte[i].atributo[j].nombre;
              let atriNombre1 = this.infReporte[i].atributo[j].nombre;
              let atriNombre2 = this.infReporte[i].atributo[j].nombre;
  
              if(atriNombre == 'Placa'|| atriNombre == 'PLACA' ){
                this.placa1 = this.infReporte[i].atributo[j].valor;
                 placa1 = this.placa1;              
              }
              if(atriNombre1 == 'MARCA'|| atriNombre == 'Marca' ){
                this.marca1 = this.infReporte[i].atributo[j].valor;
                 marca1 = this.marca1;
              }
              if(atriNombre2 == 'Kilometraje'|| atriNombre == 'KILOMETRAJE' ){
                this.kilometraje = this.infReporte[i].atributo[j].valor;
                 kilometraje = this.kilometraje;
              }
  
              arrayValAuto =[placa1, marca1, kilometraje]  
            }
            let cliente = this.infReporte[i].cliente;
            let es_cotizacion = this.infReporte[i].es_cotizacion;
            let estado = this.infReporte[i].estado;
            let facturado = this.infReporte[i].facturado;
            let factventa_id= this.infReporte[i].factventa_id;
            let fecha = this.infReporte[i].fecha;
            let id = this.infReporte[i].id;
            let no = this.infReporte[i].no;
            let problema = this.infReporte[i].problema;
            let tipo = this.infReporte[i].tipo;
            
            arr = {cliente,es_cotizacion,estado, facturado, factventa_id,fecha,id,no,problema,tipo, arrayValAuto};         
            this.arregloProvisional.push(arr)
      }
      // console.log(this.arregloProvisional);
      
    this.formFacturarFlota.reset();
    this.banderaEBT = true;
        }
  })

}


enviar_Tabla(id:any, position :any){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Agregando flota',
    text:'Se está agregando órdenes de la flota, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.getForID('orden_abierta',id).then((data:any)=>{
    this.infForID = data;
    // console.log(data);
    this.infForID =[data.pys,data.usuario[0].id,data.usuario[0].secuencia ]
   this.arr2.push(this.infForID);
  this.arregloGlobal = this.arr2;
  //  console.log("arreglo push ",this.arregloGlobal);
   let btnEF = document.getElementById('btnAgregarFlota'+position);
   btnEF?.setAttribute('disabled', '');
   let btnBF = document.getElementById('btnBorrarFlota'+position);
   btnBF?.removeAttribute('disabled');
  
   let tamPROT = this.arr2.length;
   
   this.totalS=0;
   this.totalP=0;
   this.subTotal12S = 0;
   this.subTotalceroS = 0;
   this.subTotal12S = 0;
   this.iva12S = 0;
   this.subTotal12SP = 0;
   this.subTotalceroSP = 0;
   this.subTotal12SP = 0;
   this.iva12SP = 0;
   for (let k = 0; k < tamPROT; k++) {
    let tamPRO = this.arr2[k][0].length;
    // console.log(tamPRO);
    for (let j = 0; j < tamPRO; j++) {
      if(this.arr2[k][0][j].esservicio =='1'){
       this.totalS += parseFloat( this.arr2[k][0][j].itemprecio)* parseFloat(this.arr2[k][0][j].cant);
       if(this.arr2[k][0][j].ivaporcent == 12){
        this.subTotal12S += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
        this.iva12S += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
        // console.log("entra");
      }
       if(this.arr2[k][0][j].ivaporcent == 0){ 
        this.subTotalceroS += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
        // console.log(this.subTotalcero);  
      }
      }else if(this.arr2[k][0][j].esservicio =='0'){
       this.totalP += parseFloat( this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant);
       if(this.arr2[k][0][j].ivaporcent == 12){
        this.subTotal12SP += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
        this.iva12SP += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
        // console.log("entra");
      }
       if(this.arr2[k][0][j].ivaporcent == 0){ 
        this.subTotalceroSP += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
        // console.log(this.subTotalcero);  
      }
      }
    }
    this.subTotalS = this.subTotal12S + this.subTotalceroS;
    this.subTotalSP = this.subTotal12SP + this.subTotalceroSP;
   }

   Swal.close();
   this.totalG = this.totalS+this.totalP;
   this.banderaTotales = true;
   this.banderaFacturar = true;
   
   let btnAF = document.getElementById('btnET');
   btnAF?.setAttribute('disabled', '');

  //  console.log(this.totalS);
  //  console.log(this.totalP);
   

  })


}

enviarTODOS(){
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Agregando flota',
    text:'Se está agregando órdenes de la flota, espere por favor' ,
    });
    Swal.showLoading();
  let tam = this.infReporte.length;
  // console.log("tam", tam);
  let id:any;
  for (let i = 0; i < tam; i++) {
     id = this.infReporte[i].id;
    let position = i;

       this.allService.getForID('orden_abierta',id).then((data:any)=>{
        Swal.close();
        this.infForID = data;

        this.infForID =[data.pys,data.usuario[0].id,data.usuario[0].secuencia ]
        this.arr2.push(this.infForID);
       this.arregloGlobal = this.arr2;
        // console.log("arreglo push ",this.arregloGlobal);
        let btnEF = document.getElementById('btnAgregarFlota'+position);
        btnEF?.setAttribute('disabled', '');
        let btnBF = document.getElementById('btnBorrarFlota'+position);
        btnBF?.removeAttribute('disabled');
       
        let tamPROT = this.arr2.length;
        
        this.totalS=0;
        this.totalP=0;
        this.subTotal12S = 0;
        this.subTotalceroS = 0;
        this.subTotal12S = 0;
        this.iva12S = 0;
        this.subTotal12SP = 0;
        this.subTotalceroSP = 0;
        this.subTotal12SP = 0;
        this.iva12SP = 0;
        for (let k = 0; k < tamPROT; k++) {
         let tamPRO = this.arr2[k][0].length;
        //  console.log(tamPRO);
        for (let j = 0; j < tamPRO; j++) {
          if(this.arr2[k][0][j].esservicio =='1'){
           this.totalS += parseFloat( this.arr2[k][0][j].costopromedio)* parseFloat(this.arr2[k][0][j].cant);
           if(this.arr2[k][0][j].ivaporcent == 12){
            this.subTotal12S += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
            this.iva12S += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
            // console.log("entra");
          }
           if(this.arr2[k][0][j].ivaporcent == 0){ 
            this.subTotalceroS += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
            // console.log(this.subTotalcero);  
          }
          }else if(this.arr2[k][0][j].esservicio =='0'){
            
           this.totalP += parseFloat( this.arr2[k][0][j].costopromedio) * parseFloat(this.arr2[k][0][j].cant);
           if(this.arr2[k][0][j].ivaporcent == 12){
            this.subTotal12SP += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
            this.iva12SP += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
            // console.log("entra");
          }
           if(this.arr2[k][0][j].ivaporcent == 0){ 
            this.subTotalceroSP += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
            // console.log(this.subTotalcero);  
          }
          }
        }
        this.subTotalS = this.subTotal12S + this.subTotalceroS;
        this.subTotalSP = this.subTotal12SP + this.subTotalceroSP;
        }

        this.totalG = this.totalS+this.totalP;
        //  console.log(this.totalS);
        //  console.log(this.totalP);  
        this.banderaTotales = true;
        this.banderaFacturar = true;
         if(this.totalG == 0){
           this.banderaTotales = false;
           this.banderaFacturar = false;
         }
       })  
  }

  let btnET = document.getElementById('btnET');
  btnET?.setAttribute('disabled', '');
}



quitar_Tabla(id:any, position:any ){

  // console.log("position",position);
  let arreglo = this.arr2;
  //  console.log(" -- ARREGLO ---",arreglo);
  let arregloPedido:any=[];
  for (let i = 0; i < arreglo.length; i++) {
    let idA = arreglo[i][1];
    if(idA != id){
      arregloPedido.push(arreglo[i]);
    }
  }
  this.arr2 = arregloPedido;
  this.arregloGlobal = this.arr2;
  // console.log("ELIMINADo",this.arregloGlobal);
  let btnBF = document.getElementById('btnBorrarFlota'+position);
  btnBF?.setAttribute('disabled', '');
  let btnEF = document.getElementById('btnAgregarFlota'+position);
  btnEF?.removeAttribute('disabled');
  let tamPROT = this.arr2.length;
   
   this.totalS=0;
   this.totalP=0;
   this.subTotal12S = 0;
   this.subTotalceroS = 0;
   this.subTotal12S = 0;
   this.iva12S = 0;
   this.subTotal12SP = 0;
   this.subTotalceroSP = 0;
   this.subTotal12SP = 0;
   this.iva12SP = 0;
   for (let k = 0; k < tamPROT; k++) {
    let tamPRO = this.arr2[k][0].length;
    // console.log(tamPRO);
    for (let j = 0; j < tamPRO; j++) {
      if(this.arr2[k][0][j].esservicio =='1'){
       this.totalS += parseFloat( this.arr2[k][0][j].itemprecio)* parseFloat(this.arr2[k][0][j].cant);
       if(this.arr2[k][0][j].ivaporcent == 12){
        this.subTotal12S += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
        this.iva12S += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
        // console.log("entra");
      }
       if(this.arr2[k][0][j].ivaporcent == 0){ 
        this.subTotalceroS += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
        // console.log(this.subTotalcero);  
      }
      }else if(this.arr2[k][0][j].esservicio =='0'){
       this.totalP += parseFloat( this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant);
       if(this.arr2[k][0][j].ivaporcent == 12){
        this.subTotal12SP += parseFloat(this.arr2[k][0][j].itemprecio) * parseFloat(this.arr2[k][0][j].cant)
        this.iva12SP += parseFloat(this.arr2[k][0][j].iva)  * parseFloat(this.arr2[k][0][j].cant);
        // console.log("entra");
      }
       if(this.arr2[k][0][j].ivaporcent == 0){ 
        this.subTotalceroSP += parseFloat(this.arr2[k][0][j].itemprecio)  * parseFloat(this.arr2[k][0][j].cant)
        // console.log(this.subTotalcero);  
      }
      }
    }
    this.subTotalS = this.subTotal12S + this.subTotalceroS;
    this.subTotalSP = this.subTotal12SP + this.subTotalceroSP;
   }

   this.totalG = this.totalS+this.totalP;
  //  console.log(this.totalS);
  //  console.log(this.totalP);

   if(this.totalG == 0){
     this.banderaTotales = false;
     this.banderaFacturar = false;
     let btnAF = document.getElementById('btnET');
     btnAF?.removeAttribute('disabled');
   }

}

quitarTODOS(){

  let tam = this.infReporte.length;
  // console.log("tam", tam);

  for (let k = 0; k < tam; k++) {
   let position = k;

this.arr2.pop();
 this.arregloGlobal = this.arr2;
//  console.log("ELIMINADo",this.arregloGlobal);
 let btnBF = document.getElementById('btnBorrarFlota'+position);
 btnBF?.setAttribute('disabled', '');
 let btnEF = document.getElementById('btnAgregarFlota'+position);
 btnEF?.removeAttribute('disabled');

}
let tamPROT = this.arr2.length;
this.totalS=0;
   this.totalP=0;
   for (let k = 0; k < tamPROT; k++) {
    let tamPRO = this.arr2[k][0].length;
    // console.log(tamPRO);
    for (let j = 0; j < tamPRO; j++) {
      if(this.arr2[k][0][j].esservicio =='1'){
       this.totalS += parseFloat( this.arr2[k][0][j].costopromedio);
      }else if(this.arr2[k][0][j].esservicio =='0'){
       this.totalP += parseFloat( this.arr2[k][0][j].costopromedio);
 
      }
    }
   }

   this.totalG = this.totalS+this.totalP;
  //  console.log(this.totalS);
  //  console.log(this.totalP);
  //  this.totalG = this.totalS+this.totalP;
   //  console.log(this.totalS);
   //  console.log(this.totalP);
 
    if(this.totalG == 0){
      this.banderaTotales = false;
      this.banderaFacturar = false;
    }

   let btnET = document.getElementById('btnET');
   btnET?.removeAttribute('disabled');
}


// ========================================== METODOS EN LAS TABLAS =============================================

quitarProductoTabla(idP:any, nOrden:any, pos:any, idORden:any){

  // console.log("idP", idP);
  // console.log('nOrden', nOrden);
  // console.log('pos', pos);
  // console.log("idOrden", idORden);

  // console.log("PROD", this.arr2);
  
  let arreglo = this.arr2;
  //  console.log(" -- ARREGLO ---",arreglo);
  let arregloPedido:any=[];

  for (let j = 0; j < arreglo.length; j++) {
    // console.log("puestos", j);
    

    for (let i = 0; i < arreglo[j][0].length; i++) {

      // console.log("posiscioens", i);
      
      // console.log('id son => ', i);
  
      if(i != pos){
        
        
        arregloPedido.push(arreglo[j][0][i]);
    // console.log('id que continúan son = > ', i);
      }
    }
  }

  this.arr2 = arregloPedido;

  console.log("Arreglo modificado", this.arr2);
  
  


}


getUserID(){

  const dato = localStorage.getItem("Inflogueo");
  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
    
  }else console.log("ERROR");

  // console.log(this.datosLocalStorage);
  let userID = this.datosLocalStorage.empleado[0].id;
  return userID;

}

getPuntoVentaID(){
  const dato = localStorage.getItem("Inflogueo");
  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
    
  }else console.log("ERROR");

  console.log(this.datosLocalStorage);
  let bodegaID = this.datosLocalStorage.puntosventa[0].puntoventa_id;
  return bodegaID;

}

hacerFactura(){
  let idsOrdenes:any;
  let pedido = this.arr2;
  // console.log('productos', pedido);
  
  let tamArreglo = pedido.length;

  // console.log('tam',tamArreglo);
  

  let Producto_codigo= "";
  let itemcantidad= 1;
  let itempreciobruto= 1;
  let itemprecioxcantidadbruto= 1;
  let descuentofactporcent= 0;
  let descuentofactvalor= 0;
  let recargofactporcent= 0;
  let recargofactvalor= 0;
 //  ----------------------
  let itemprecioneto= 1;
  let itemprecioxcantidadneto= 1;
  let ivaporcent= 12;
  let ivavalitemprecioneto= 0; 
  let itemprecioiva= 1;
  let ivavalprecioxcantidadneto= 0;
  let itemxcantidadprecioiva= 1;
  let estaAnulada= 0;
  let  bodega_id = this.bodega_id;
  let tiposprecio_tipoprecio= '';
  let itembaseiva= 1;
  let totitembaseiva= 1;
  let iceporcent= null;
  let  iceval= 0;  /// TAMBIEN VA EN FACTURA
  let priceice= null;
  let totalpriceice= null;
  let totivaval= 0;
  let priceiva= 1;
  let totalpriceiva= 1;
 //  this.detalle= 0; // TAMBIEN VA EN FACTURA
  let meses_garantia= 0;
  let unidad= 0;

  //totalServicios
  let sts = 0;

  //TotalProductos
  let stp = 0;

  //Tarifas
  let tt12=0;
  let tt0 =0;
  let tt8 = 0;


  //ARREGLO DETALLE
  const arrDetalle = new Array;
  let detalle = 0;

  let detalleProducto;
  let arrayIdsO = new Array(tamArreglo);

for (let z = 0; z < tamArreglo; z++) {
  let p_aIDs = pedido[z][1];  
    arrayIdsO[z]=p_aIDs;
}

this.idOrdenes = arrayIdsO;
// console.log("ids ordenes", this.idOrdenes);

  
  for (let i = 0; i < tamArreglo; i++) {
    
    let tam2 = pedido[i][0].length;
   for (let j = 0; j < tam2; j++) {
   
      
    
    Producto_codigo = pedido[i][0][j].producto_id;    
    itemcantidad = pedido[i][0][j].cant;
    itempreciobruto = pedido[i][0][j].itemprecio;
    itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
    itemprecioneto = itempreciobruto;
    itemprecioxcantidadneto = itemprecioxcantidadbruto;
    ivaporcent = pedido[i][0][j].ivaporcent;
    ivavalitemprecioneto = pedido[i][0][j].iva;
    itemprecioiva = itemcantidad * pedido[i][0][j].total;
    ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
    itemxcantidadprecioiva = itemprecioiva;
    bodega_id = pedido[i][0][j].bodega_id;
    tiposprecio_tipoprecio = pedido[i][0][j].tiposprecio;
    itembaseiva = itempreciobruto;
    totitembaseiva = itemprecioxcantidadbruto;
    totivaval = ivavalprecioxcantidadneto;
    priceiva = pedido[i][0][j].total;
    totalpriceiva = itemcantidad* priceiva;

    if(pedido[i][0][j].esservicio == "1"){
      sts += itemcantidad*itempreciobruto;
     
    }else if(pedido[i][0][j].esservicio == "0"){
      stp += itemcantidad*itempreciobruto;
    }

    if(ivaporcent == 12){
      tt12 += itemcantidad*itempreciobruto;
    }else if(ivaporcent == 0){
     tt0 += itemcantidad*itempreciobruto;
    }else if(ivaporcent == 8){
      tt8 += itemcantidad*itempreciobruto;
    }

   // let detalle = 0;
    detalleProducto ={Producto_codigo, itemcantidad, itempreciobruto, itemprecioxcantidadbruto, descuentofactporcent, descuentofactvalor, recargofactporcent, recargofactvalor,
     itemprecioneto, itemprecioxcantidadneto, ivaporcent, ivavalitemprecioneto, itemprecioiva, ivavalprecioxcantidadneto, itemxcantidadprecioiva, estaAnulada, bodega_id, 
    tiposprecio_tipoprecio, itembaseiva, totitembaseiva, iceporcent, iceval, priceice, totalpriceice, totivaval, priceiva, totalpriceiva, detalle, meses_garantia, unidad}
    arrDetalle.push(detalleProducto);
  }
 
 
 // =================== FACTURA

 let creditoval = 0; //ya
 let recargovalor =0; //ya 
 let descuentovalor = 0; 
 
 let baseiva = tt12;
 let nro_orden = "";
 let servicios = 0;
 let subtbrutoservicios = sts;
 let subtbrutobienes = stp;
 let tarifadocebruto = baseiva;
 let tarifacerobruto = tt0;
 let subtotalBruto = subtbrutobienes + subtbrutoservicios;
 let subtotalNeto = tarifacerobruto + tarifadocebruto;

let tival=0;


for (let i = 0; i < arrDetalle.length; i++) {
 
  tival = tival + arrDetalle[i].totivaval;
 
  
}


 let ivaval = tival;
 let totalCompra = subtotalNeto + ivaval;
 let observaciones ="";
 let valorrecibidoefectivo = 0;
 let valorcambio = 0;
 let subtnetobienes = subtbrutobienes;
 let subtnetoservicios = subtbrutoservicios;
 let tarifaceroneto = tarifacerobruto;
 let tarifadoceneto = tarifadocebruto;
 let efectivoval = 0;


 let factura ={
   creditoval,
   recargovalor,
   subtotalBruto,
   descuentovalor,
   subtotalNeto,
   ivaval,
   totalCompra,
   observaciones,
   valorrecibidoefectivo,
   valorcambio,
   tarifacerobruto,
   tarifaceroneto,
   tarifadocebruto,
   tarifadoceneto,
   subtbrutobienes,
   subtbrutoservicios,
   subtnetobienes,
   subtnetoservicios,
   iceval,
   efectivoval,
   baseiva,
   nro_orden ,
   servicios,
 };


this.factura1 = factura;
this.totalcompra1 = totalCompra;
this.creditoval1 = creditoval;
}//

let creditoval = this.creditoval1;
let factura = this.factura1;
let totalCompra = this.totalcompra1;
let user_id = this.getUserID();

this.user_id = user_id;
let puntoventa_id = this.getPuntoVentaID();
this.puntoventa_id = puntoventa_id;
let type = "prefactura";
let PersonaComercio_cedulaRuc = this.ci_ruc;

let efecval = totalCompra;
let fecha_vence = "";


 let cliente={
  PersonaComercio_cedulaRuc
 }

let json = {factura, detalle: arrDetalle, user_id, puntoventa_id, type, cliente, efectivo_val:efecval, creditoval, fecha_vence};

console.log("JSON", json);

// this.allService.postFacturar(json).subscribe((data:any) =>{

// //  console.log("AQUI SE DEBE MOSTRAR ",data);
//  // console.log(data.rta.id_venta, 'ID venta')


// //  this.banderaCard = false;

// Swal.close(); 

// Swal.fire({
//   allowOutsideClick:false,
//   icon:'success',
//   title:'Factura de la flota generada',
//   text:data.rta.msg,
//   timer:1200
// })

// //  abrirModalCerrarOrden();

//  // this.banderaFacturar = false;
//  // this.banderaPrefactura = false;
//  // this.banderaAcciones = false;
//  // this.banderaBusqueda = false;

 
//  // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
//  // this.cerrarPlaneadorDetalle();
 

//  this.idFactura = data.rta.venta_id;
// //  console.log('ID FACTURA',this.idFactura);
 
//  let ids = this.idOrdenes;
//  let user_id = this.user_id;
//  let json2 ={
//    ids, user_id
//  }
// //  console.log('json2', json2);
 
//  if(this.idFactura){
//    // this.allService.postAL('orden_abierta/add_factura?id='+this.idOrden+'&fv='+this.idFactura).then((data:any)=>{
//    this.allService.postAL( json2,'orden_abierta/add_factid/fv/'+this.idFactura).subscribe((data:any)=>{
//     //  console.log("LO QUE DEVUELVE",data);
     
//    })

//  }

//  setTimeout(() => {

//   this.locationreload();
  
  
//  }, 1000);
 
 
// },(err)=>{    
//  Swal.fire({
//        icon: 'error',
//        title: 'Oops...',
//        text: 'Error, no se pudo guardar factura',
//        timer: 500
//  })      

// })

}


}
