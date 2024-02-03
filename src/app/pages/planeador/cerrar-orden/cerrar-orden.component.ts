import { Component, Input, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
import { PlaneadorModel } from '../../Modelos/planeador.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, DecimalPipe } from '@angular/common';
import { productoWORK } from '../../Modelos/arregloItemP.model';

declare function abrirModalCodigo1(params:string):any;
declare function cerrarModal1(params:string):any;
declare function valSeleccionado(i:any):any;
declare function valSeleccionadoT(i:any,tam: any):any;

// declare function getPrecioItem(i:any):any;
// declare function arregloAlias2(i:any):any;



@Component({
  selector: 'app-cerrar-orden',
  templateUrl: './cerrar-orden.component.html',
  styleUrls: ['./cerrar-orden.component.scss']
})
export class CerrarOrdenComponent implements OnInit {

  @Input('elements3') elements3:any;
  @Input('informacionOrden') informacionOrden:any;
  @Input('banderaCard') banderaCard:any;
  @Output() SBCO = new EventEmitter<any>();



    // Tabla PyS
    ps: productoWORK[];
    page1 = 1;
    pageSize1 = 5;
    collectionSize1:any;
    productoServicio1:any=[];

//EDITAR PRODUCTO

nuevaCantidad:any;

total:any;

  i:PlaneadorModel;
  elements:any=[];
  elements4:any=[];
  previous: string;
  infProducto:any=[];
  url="orden_abierta";
  url1='prioridad';
  url2 ='orden_cerrada'
  prioridades:any=[];
  productoServicio:any=[];
  //User id
  user_id:any;
  datosLocalStorage:any;

  // MODIFICAR CANTIDAD
  position:any;
  idOrden:any;
  enviarProducto:any=[];

  // Modal
  modal:any;
  productoFormCantidad:any;

  pedidoProductos:any =[];

  //INF PRODUCTO
  puntoventa_id:any;
  tecnico_id:any;
  tecnicos:any;
  servicios:any;
  bodega_id:any;

  nombreEmpresa:any;
  productos:any[]=[];
  alias:any=[];
  
  
   //STOCk
   stock:any;

//Precio Defecto
precioDefectoCliente:any;
cliente_id :any;

banderaPaginacion:any;


// check de salida 
controles:any =[];
arregloCategoria:any=[];
evaluacion:any=[];
banderaCheckIN:any;
tamVAL:any;

arregloCalificacion:any=[];

  //FORMULARIO y EDICION PRODUCTO SERVICIO
      //VALOR PRODUCTO IVA
      costoProm:any;
      itemPre:any;
      ivaProd:any;
      totalValProd:any;
      precioDefecto:any;
      arregloItemP:any=[];

      totalS:any;

        //EDICION PRODUCTO SERVICIO

  tecSeleccionado:any;
  tecNombre:any;
  servSelecccionado:any;
  idTecSeleccionado:any;
  idServSeleccionado:any;
  aliasGlobal:any;

  banderaAliasAbrir:any;
  banderaAliasCerrar:any;
  
  priId:any;
  priValor:any;

  cerrarO = CerrarOrdenComponent;

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild("modalSelecionarPC ") modalSelecionarPC : TemplateRef<any> | undefined;
  @ViewChild("modalControl") modalControl: TemplateRef<any> | undefined;


  constructor(private allService: AllServiceService,
    private modalService: NgbModal,
    private decimalP :DecimalPipe,
    private fechaPipe: DatePipe,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.enviarPrioridad();
    this.listarTodos1();
  }

  refreshPyS() {
    const PRS1 :productoWORK[]=this.arregloItemP;  
    this.collectionSize1 = PRS1.length;
    if(this.collectionSize1 <= this.pageSize1){
      this.banderaPaginacion = false;
    }else{
      this.banderaPaginacion = true;
    }
      this.ps = PRS1
      .map((pys: any, i: number) => ({id: i + 1, ...pys}))
      .slice((this.page1 - 1) * this.pageSize1, (this.page1 - 1) * this.pageSize1 + this.pageSize1);    
      // console.log('PS',this.ps);  
      
  }

  abrirModal (ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent);
  }

  cerrarModal(){
    this.modal.close();
  }
  

  listarTodos1(){
    this.allService.getALLPlaneador(this.url, this.i).subscribe((data:any)=>{
   this.elements = data.data;
   
    })
   }

   enviarPrioridad(){
    this.allService.getAllOA(this.url1+'/activo_oc').then((data:any)=>{
      // console.log("activos ", data);
      
      this.prioridades = data.data;

      // console.log(" prioridades => ", this.prioridades);
      // this.priId= this.prioridades[0].pri_id;
      // this.priValor = this.prioridades[0].nombre;
      
    })
  }

  // ================================= FORMULARIOS ======================================

  formBusquedaN = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(3), Validators.pattern('[a-z A-Z]{3,100}')]),
   
  })
  formBusquedaCU = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(1), Validators.pattern('[0-9]{1,6}')]),
   
  })
  formBusquedaCB = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4,20}')]),
   
  })

formCantidad = new FormGroup({
  c : new FormControl('',  Validators.required),
  kilometro : new FormControl('', Validators.required),
  precio : new FormControl('', Validators.required),
  nombreA : new FormControl('', Validators.required),
})


formProductoServicio = new FormGroup({
  // nombre: new FormControl(""),
  cantidad: new FormControl("", [Validators.required]),
  km:new FormControl('', [Validators.required]),
  alias: new FormControl(''),
})

get fp(){
  return this.formProductoServicio.controls;
}


formCerrarOrden = new FormGroup({
nro_ordenAbierta: new FormControl(''),
recomendacion: new FormControl('', Validators.required),
kmActual : new FormControl(''),
nombreRetira:new FormControl(''),
fechaProximoMan:new FormControl(null),
fechaPm_str: new FormControl(null),
kmProximoMan:new FormControl(null),
prodProx_nombre:new FormControl(''),
prodProx_cant: new FormControl(''),
prodProx_km: new FormControl(''),
prodProx_pU: new FormControl(''),
prodProx_pT: new FormControl(''),
prodProx_priori:new FormControl(''),
prodProx_id:new FormControl(''),
prodProx_ivaporcent:new FormControl(''),
prodProx_iva:new FormControl(''),
user_id : new FormControl(''),
prodProx_alias: new FormControl(''),
esservicio: new FormControl(''),
})

get f()
{
    return this.formCerrarOrden.controls;   
}

// ================================================= METODOS ===========================================

arregloAlias2(i:any){
  let  x = (document.getElementById('verAlias2'+i) as HTMLInputElement).value
  return x; 
}

aliasProducto(i:any){
  let val = this.arregloAlias2(i);
  // let val = arregloAlias2(i);
return val;
}

buscarProductoServicio(form:any){


  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      showConfirmButton: false,
      timer:1500
}) 
  }else{
  
    this.formProductoServicio.reset();
  let nombre = form.nombre;
  this.formBusquedaN.reset();
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando Producto',
    text:'Se está buscando el producto, espere por favor' ,
    });
    Swal.showLoading();
  
// this.allService.getProductosServicios(nombre).then((data:any)=>{
  this.allService.getProductoMap(nombre).subscribe((data: any) => {
  
  // console.log(data);
  
  if(data.length >= 1){
    Swal.close();
    abrirModalCodigo1('#modalTyS');
    this.productoServicio = data;
    this.precioDefecto = this.informacionOrden[0].default_price;

    let arr :any=[];
    let arr2 :any=[];
    let codigo2:any;
    let esServicio:any;
    let id_producto:any;
    let impuesto_porcent:any;
    let ivaporcent:any;
    let pro_nom:any
    let precios:any=[];
    let stock:any;
    let ivaval:any;
    let valor:any;
    let valor_mas_iva:any;

    for (let i = 0; i < this.productoServicio.length; i++) {
      this.stock = this.productoServicio[i].stock;
      stock = this.stock;
      codigo2 =  this.productoServicio[i].codigo2;
      esServicio = this.productoServicio[i].esServicio;
      id_producto = this.productoServicio[i].id_producto;
      impuesto_porcent = this.productoServicio[i].impuesto_porcent;
      ivaporcent = this.productoServicio[i].ivaporcent;
      pro_nom = this.productoServicio[i].pro_nom;
      precios = this.productoServicio[i].precios;

      for (let j = 0; j < this.productoServicio[i].precios.length; j++) {

        if(this.productoServicio[i].precios[j].id_tipo == this.precioDefecto){
          ivaval = this.productoServicio[i].precios[j].ivaval;
          valor = this.productoServicio[i].precios[j].valor;
          valor_mas_iva = this.productoServicio[i].precios[j].valor_mas_iva;
        }
        
      }

        arr= {stock, codigo2, esServicio, id_producto,impuesto_porcent,ivaporcent,pro_nom,precios, ivaval, valor, valor_mas_iva};
        arr2.push(arr);

      }

      this.arregloItemP = arr2;
    this.page1 =1;
    this.refreshPyS();


    this.formProductoServicio.get('cantidad')?.setValue('1');
   
    for (let k = 0; k < this.arregloItemP.length; k++) {
      this.formProductoServicio.get('precioPVP')?.setValue(k);
  }

    this.banderaAliasAbrir= true;
    this.banderaAliasCerrar= false;
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      showConfirmButton: false,
      timer:2000
}) 
}
})
}
}
buscarProductoNombreUnico(form:any){


  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      showConfirmButton: false,
      timer:1500
}) 
  }else{
  
    this.formProductoServicio.reset();
  let nombre = form.nombre;
  this.formBusquedaCU.reset();
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando Producto',
    text:'Se está buscando el producto, espere por favor' ,
    });
    Swal.showLoading();
  
  // this.allService.getSimple('producto/search_product_code?search='+nombre).then((data:any)=>{
    this.allService.getProductoMap(nombre).subscribe((data: any) => {
  
  if(data.rta == true){
    Swal.close();
    abrirModalCodigo1('#modalTyS');
    this.productoServicio = data;
    this.precioDefecto = this.informacionOrden[0].default_price;

    let arr :any=[];
    let arr2 :any=[];
    let codigo2:any;
    let esServicio:any;
    let id_producto:any;
    let impuesto_porcent:any;
    let ivaporcent:any;
    let pro_nom:any
    let precios:any=[];
    let stock:any;
    let ivaval:any;
    let valor:any;
    let valor_mas_iva:any;

    for (let i = 0; i < this.productoServicio.length; i++) {
      this.stock = this.productoServicio[i].stock;
      stock = this.stock;
      codigo2 =  this.productoServicio[i].codigo2;
      esServicio = this.productoServicio[i].esServicio;
      id_producto = this.productoServicio[i].id_producto;
      impuesto_porcent = this.productoServicio[i].impuesto_porcent;
      ivaporcent = this.productoServicio[i].ivaporcent;
      pro_nom = this.productoServicio[i].pro_nom;
      precios = this.productoServicio[i].precios;

      for (let j = 0; j < this.productoServicio[i].precios.length; j++) {

        if(this.productoServicio[i].precios[j].id_tipo == this.precioDefecto){
          ivaval = this.productoServicio[i].precios[j].ivaval;
          valor = this.productoServicio[i].precios[j].valor;
          valor_mas_iva = this.productoServicio[i].precios[j].valor_mas_iva;
        }
        
      }

        arr= {stock, codigo2, esServicio, id_producto,impuesto_porcent,ivaporcent,pro_nom,precios, ivaval, valor, valor_mas_iva};
        arr2.push(arr);

      }

      this.arregloItemP = arr2;
    this.page1 =1;
    this.refreshPyS();


    this.formProductoServicio.get('cantidad')?.setValue('1');
   
    for (let k = 0; k < this.arregloItemP.length; k++) {
      this.formProductoServicio.get('precioPVP')?.setValue(k);
  }

    this.banderaAliasAbrir= true;
    this.banderaAliasCerrar= false;
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      showConfirmButton: false,
      timer:2000
}) 
}
})
}
}
buscarProductoCodBarras(form:any){


  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      showConfirmButton: false,
      timer:1500
}) 
  }else{
  
    this.formProductoServicio.reset();
  let nombre = form.nombre;
  this.formBusquedaCB.reset();
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando Producto',
    text:'Se está buscando el producto, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.getSimple('producto/search_product_codebar?search='+nombre).then((data:any)=>{
  
  if(data.rta == true){
    Swal.close();
    abrirModalCodigo1('#modalTyS');
    this.productoServicio = data.data;
    this.precioDefecto = this.informacionOrden[0].default_price;

    let arr :any=[];
    let arr2 :any=[];
    let codigo2:any;
    let esServicio:any;
    let id_producto:any;
    let impuesto_porcent:any;
    let ivaporcent:any;
    let pro_nom:any
    let precios:any=[];
    let stock:any;
    let ivaval:any;
    let valor:any;
    let valor_mas_iva:any;

    for (let i = 0; i < this.productoServicio.length; i++) {
      this.stock = this.productoServicio[i].stockactual;
      stock = this.stock;
      codigo2 =  this.productoServicio[i].codigo2;
      esServicio = this.productoServicio[i].esServicio;
      id_producto = this.productoServicio[i].id_producto;
      impuesto_porcent = this.productoServicio[i].impuesto_porcent;
      ivaporcent = this.productoServicio[i].ivaporcent;
      pro_nom = this.productoServicio[i].pro_nom;
      precios = this.productoServicio[i].precios;

      for (let j = 0; j < this.productoServicio[i].precios.length; j++) {

        if(this.productoServicio[i].precios[j].id_tipo == this.precioDefecto){
          ivaval = this.productoServicio[i].precios[j].ivaval;
          valor = this.productoServicio[i].precios[j].valor;
          valor_mas_iva = this.productoServicio[i].precios[j].valor_mas_iva;
        }
        
      }

        arr= {stock, codigo2, esServicio, id_producto,impuesto_porcent,ivaporcent,pro_nom,precios, ivaval, valor, valor_mas_iva};
        arr2.push(arr);

      }

      this.arregloItemP = arr2;
    this.page1 =1;
    this.refreshPyS();


    this.formProductoServicio.get('cantidad')?.setValue('1');
   
    for (let k = 0; k < this.arregloItemP.length; k++) {
      this.formProductoServicio.get('precioPVP')?.setValue(k);
  }

    this.banderaAliasAbrir= true;
    this.banderaAliasCerrar= false;
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      showConfirmButton: false,
      timer:2000
}) 
}
})
}
}


desplegarAlias(i:any){
  let entradaAlias = document.getElementById('verAlias2'+i);
  entradaAlias?.removeAttribute('hidden');

  let iEntradaAlias = document.getElementById('iAA'+i);
  iEntradaAlias?.setAttribute('hidden', '');

  let iEntradaAlias1 = document.getElementById('iAC'+i);
  iEntradaAlias1?.removeAttribute('hidden')


}
ocultarAlias(i:any){
  let entradaAlias = document.getElementById('verAlias'+i);
  entradaAlias?.setAttribute('hidden','');

  let iac = document.getElementById('iAC'+i);
  iac?.setAttribute('hidden', '');

  let iaa =  document.getElementById('iAA'+i);
  iaa?.removeAttribute('hidden')


}

salirModal(){
  cerrarModal1('#modalTyS');
  this.ps =[];
  // console.log(this.ps);
  
  
}



ocultarTabla(){
  let tabla = document.getElementById('tablaProductoServicio1');
  tabla?.setAttribute('hidden','');
}


getPrecioItem(i:any){
  let x = (document.getElementById('precioItem'+i) as HTMLInputElement).value  
  let x1 = x.replace(',', '.');    
  return x1;
}

agregarProducto1(el:any, i:any,form:any){

// console.log(form);
  this.aliasProducto(i);

  this.infProducto = [el];
  let producto_id = el.id_producto;
  let esservicio = el.esServicio;
  let productname = el.pro_nom;
  let formPTS = this.formProductoServicio.value;
  let cant = formPTS.cantidad;
  let km = formPTS.km;
  // let arrA = this.informacionOrden[0].atributos;
  // let tamArr = this.informacionOrden[0].atributos.length;
  let kilometraje = this.informacionOrden[0].arrayValAuto[2];
  let tipo = "";

  
  // for (let z = 0; z < tamArr; z++) {
  //   let variable = arrA[z].atributo;

  //   if(variable == 'KILOMETRAJE'){
  //    kilometraje = arrA[z].valor;
  //   }
    
  // }

  let kmT = km+ parseFloat(kilometraje);
  let alias = this.aliasProducto(i);

  // console.log(alias);
  
  this.precioDefectoCliente = el.tiposprecio;

  
//BODEGA ID
const dato = localStorage.getItem("Inflogueo");

  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
    
  }else console.log("ERROR");

  let infAcceso  = new Array;
infAcceso=  Object.values(this.datosLocalStorage);

  this.bodega_id = infAcceso[2][0].bodega_id;

  let precioDefectoCliente = this.precioDefectoCliente;
  let arregloPrecios = this.infProducto[0].precios;
  let bodega_id = this.bodega_id;
  let ivaporcent = this.infProducto[0].impuesto_porcent;
  let costopromedio:any;
  let itemprecio;
  let iva;
  let total:any;
  let pys;
  let tiposprecio;

      
   if(this.productoRepetido(producto_id)==true){

    if(this.infProducto[0].esServicio =='1'){
      // alert("DEBE SUMARSE");

      tiposprecio = this.precioDefecto;
      itemprecio =Number( this.getPrecioItem(i));
      // itemprecio =Number( getPrecioItem(i));
// total = t;


if(ivaporcent=='12'){
iva = (itemprecio*0.12);
total= itemprecio+iva;
}
else if(ivaporcent=='0'){
  iva = 0;
  total= itemprecio+iva;
}else if(ivaporcent=='0'){
  iva = (itemprecio*0.8);
  total= itemprecio+iva;
}

      // total = getPrecioItem(i);
      // if(ivaporcent=='12'){
      // iva = total*0.12;
      // itemprecio= total-iva;
      
      
      // }
      // else if(ivaporcent=='0'){
      //   itemprecio = total;
      //   iva = 0;
      
      // }else if(ivaporcent=='0'){
      //   iva = total*0.08;
      //   itemprecio= total-iva;
      // }
      this.totalS = total;
     
    // }   
    this.totalS = total;
    costopromedio =total * cant;
    pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tipo,kmT };
    this.productos.push(pys);
    // console.log("============== 1",this.productos);
    }

    else
    {

 

let val = parseFloat( this.productoRepetidoSumarCantidad(producto_id));

let posicion = this.productoRepetidoPosicion(producto_id);

this.nuevaCantidad = parseFloat(formPTS.cantidad);
cant =  parseFloat(this.nuevaCantidad + val);

this.totalS = cant*this.totalS;

this.quitarProducto(posicion, this.productos);


tiposprecio = this.precioDefecto;
itemprecio =Number( this.getPrecioItem(i));
// itemprecio =Number( getPrecioItem(i));
// total = t;


if(ivaporcent=='12'){
iva = (itemprecio*0.12);
total= itemprecio+iva;
}
else if(ivaporcent=='0'){
  iva = 0;
  total= itemprecio+iva;
}else if(ivaporcent=='0'){
  iva = (itemprecio*0.8);
  total= itemprecio+iva;
}

// total = getPrecioItem(i);
// if(ivaporcent=='12'){
// iva = total*0.12;
// itemprecio= total-iva;


// }
// else if(ivaporcent=='0'){
//   itemprecio = total;
//   iva = 0;

// }else if(ivaporcent=='0'){
//   iva = total*0.08;
//   itemprecio= total-iva;
// }
this.totalS = total;
// this.totalS = total;
costopromedio =total * cant;

pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tipo,kmT  };
this.productos.push(pys);

// console.log("============== 2",this.productos);

let tamPRO = this.productos.length;

this.total=0;
for (let j = 0; j < tamPRO; j++) {
  this.total += parseFloat( this.productos[j].costopromedio);
}
    }


   }else{

    tiposprecio = this.precioDefecto;
let t = Number( this.getPrecioItem(i));
// let t = Number( getPrecioItem(i));
itemprecio =t;
// total = t;


if(ivaporcent=='12'){
iva = (itemprecio*0.12);
total= itemprecio+iva;
}
else if(ivaporcent=='0'){
  iva = 0;
  total= itemprecio+iva;
}else if(ivaporcent=='0'){
  iva = (itemprecio*0.8);
  total= itemprecio+iva;
}
this.totalS = total;
costopromedio =total * cant;
pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio,   tipo,kmT};
this.productos.push(pys);

// console.log("============== 3",this.productos);

this.formProductoServicio.reset();
this.formProductoServicio.get('cantidad')?.setValue(1);

}

}



// ========================== QUITAR PRODUCTO ================================
quitarProducto(idE:any, pedPro:any){
   let arreglo = pedPro;
  let arregloPedido:any=[];
  for (let i = 0; i < arreglo.length; i++) {
    if(i != idE){
      arregloPedido.push(arreglo[i]);
    }
  }
  pedPro= arregloPedido;
  this.productos = pedPro;
  
  let tamPRO = this.productos.length;
this.total=0;
for (let j = 0; j < tamPRO; j++) {
  this.total += parseFloat( this.productos[j].costopromedio);
}

}


productoRepetido(idP:any){
  let tam = this.productos.length;
  let array = this.productos;
  
  let bandera = false;
  let id;
  for (let i = 0; i < tam; i++) {
    id= array[i].producto_id;
    // console.log("id productos => ", id);
    
    if(idP == id){
// console.log("producto existe ", idP);
bandera = true;
    }
  }
  return bandera;
}



productoRepetidoSumarCantidad(idP:any){
  
  let tam = this.productos.length;
  let array = this.productos;
  // let bandera = false;
  let id;
  let cant;
  let c;
  for (let i = 0; i < tam; i++) {
    id= array[i].producto_id;
    cant = array[i].cant;
    
    if(idP == id){
      c = cant;

    }
  }
  return c;
}

productoRepetidoPosicion(idP:any){

  
  let tam = this.productos.length;
  let array = this.productos;

  let id;
  let i;
  for (i = 0; i < tam; i++) {
    id= array[i].producto_id;
     
    if(idP == id){
idP = i;

    }
  }
  return idP;
  
}


modificarCantidad(form:any, pedPro:any ){
  
  let c = form.c;
  let precio = parseFloat(form.precio);

  
  let arreglo = pedPro[this.position];
  
  
    let producto_id = this.idOrden;

    
    let esservicio = arreglo.esservicio;
    let productname = arreglo.productname;
    let cant = c;
    let tiposprecio = arreglo.tiposprecio;
    let bodega_id = this.bodega_id;
    let ivaporcent = arreglo.ivaporcent;

    let itemprecio= precio;
    let iva = (itemprecio*ivaporcent)/100;
    let total = itemprecio + iva;
    let pys;
    let costopromedio= cant*total;
  
    let tipo = arreglo.tipo;
    let alias = form.nombreA;
    let kmT = form.kilometro;
    this.quitarProducto(this.position, pedPro);  
    pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio,   tipo,kmT };
    this.productos.push(pys);
    
    Swal.fire({
      allowOutsideClick:false,
      icon:'success',
      title:'Cambios realizados',
      text:'La orden se ha editado correctamente',
      timer: 1200,
      showConfirmButton:false

      });

    let tamPRO = this.productos.length;
// console.log("tamPRO", tamPRO);
// console.log("Costo", this.productos[0].costopromedio);
this.total=0;
for (let j = 0; j < tamPRO; j++) {
  this.total += parseFloat( this.productos[j].costopromedio);
  // console.log("LO que imprimo => "+ this.total);
}

    // this.cerrarModal();
    cerrarModal1('#modalEditarOC');

    this.formCantidad.reset();
  }


  getNombreEmpresa(){
    const dato = localStorage.getItem("api_system");
    let empresa ='';
  if(dato) {
    empresa = dato;
    
  }else console.log("ERROR");
  let emp = empresa.slice(21, -1)
  
  this.nombreEmpresa = emp;
  
  return this.nombreEmpresa;
  }
guardarOrdenCerrada(idOrden:any, atributos:any, form:any, ordenCerrada:any){



  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'info',
    text:'Cerrando Orden, espere por favor' ,
    });
    Swal.showLoading();

let tamArreglo = ordenCerrada.length;
let servicios = ordenCerrada;

// console.log("tamanio arreglo -> ", tamArreglo);

let arrayCantidad = new Array(tamArreglo);
let arrayNombreServicio = new Array(tamArreglo);
let arrayValor= new Array(tamArreglo);
let arrayCostoPromedio= new Array(tamArreglo);
let arraykm = new Array(tamArreglo);
let arrayPrioridadProxima = new Array(tamArreglo);
let arrayServicio = new Array(tamArreglo);
let arrayAlias = new Array(tamArreglo);

let arrayProductoId =  new Array(tamArreglo);

let arrayIvaPorCent = new Array(tamArreglo);
let arrayIVa = new Array(tamArreglo);

let kmActual:any;

for (let i = 0; i < tamArreglo; i++) {

   let cant = servicios[i].cant;
   let nombreServicio = servicios[i].productname;
   let precio = servicios[i].itemprecio;
   let costopromedio = servicios[i].costopromedio;
   let esServicio = servicios[i].esservicio;
   let alias = servicios[i].alias;
   let km = servicios[i].kmT;
   let prioP = form.prodProx_priori;

   let productoID = servicios[i].producto_id;

   let ivaporcent = servicios[i].ivaporcent;
   let iva = servicios[i].iva;

   arrayCantidad[i]=cant;
   arrayNombreServicio[i]=nombreServicio;
   arrayValor[i]=precio;
   arrayCostoPromedio[i]=costopromedio;
   arrayServicio[i]= esServicio;
   arrayAlias[i]=alias;
   arraykm[i] = km;
   arrayPrioridadProxima[i]=prioP;

   arrayProductoId[i] = productoID; 
   arrayIvaPorCent[i] = ivaporcent;
   arrayIVa[i]= iva;

  
   

}

kmActual  = this.informacionOrden[0].arrayValAuto[2];


if(this.arregloCalificacion.length==0){
  form.items='';
  form.revision='';
}
else
    {
 
    form.items = this.arregloCalificacion[1];
    form.revision = this.arregloCalificacion[0];
    }



if(form.items==''&& form.revision==''){

  Swal.fire({
    title: 'Control de Salida',
    text: 'No ha realizado el control de salida, ¿Está seguro de cerrar la orden?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#B5B5B5',
    cancelButtonColor: '#F51F36',
    cancelButtonText:'Cancelar',
    confirmButtonText: '!Si, cerrar ahora!',
  }).then((result) => {
    if (result.isConfirmed) {

      let fechaDATE = form.fechaProximoMan;
let fechaString = this.fechaPipe.transform(fechaDATE, 'longDate','UTC');

form.fechaPm_str = fechaString;
form.nro_ordenAbierta = idOrden;
form.kmActual = parseFloat(kmActual);
let kpm = form.kmProximoMan ;
form.kmProximoMan = parseFloat(kpm)+form.kmActual;
form.prodProx_cant = arrayCantidad;
form.prodProx_nombre = arrayNombreServicio;
form.prodProx_km = arraykm;
form.prodProx_pU = arrayValor;
form.prodProx_pT = arrayCostoPromedio;

form.prodProx_ivaporcent = arrayIvaPorCent;
form.prodProx_iva = arrayIVa;

form.prodProx_alias = arrayAlias;
form.esservicio= arrayServicio;
form.prodProx_priori = arrayPrioridadProxima;
form.prodProx_id = arrayProductoId;

// console.log('form lleno', form);


const dato = localStorage.getItem("Inflogueo");

if(dato) {
  this.datosLocalStorage=JSON.parse(dato);
  
}else console.log("ERROR");

let infAcceso  = new Array;
infAcceso=  Object.values(this.datosLocalStorage);
let user_id = infAcceso[1][0].id;
form.user_id = user_id;


// console.log('form ', form);

  this.allService.postALL(form,'orden_cerrada').subscribe(data=>{

      // console.log("datos enviados => ", data);

        Swal.close(); 
        Swal.fire({
        allowOutsideClick:false,
        icon:'success',
        title:'Operación Exitosa',
        text:'La orden se ha cerrado con éxito',
        timer: 2000,
      showConfirmButton:false
      });
  
    let bandera = false;
    // setTimeout(() => {
    //   this.SBCO.emit(bandera);
    //  }, 200);
    let tipo = 'oc';
  let accion="send";
  let empresa = this.getNombreEmpresa();
  
  this.allService.getAl('hacer_pdf/'+accion+'?oa_id='+idOrden+'&tipo='+tipo+'&emp='+empresa).then((data:any)=>{
    // console.log(data);
    
    if(data.rta == undefined){
        // Swal.close(); 
        // Swal.fire({
        //   allowOutsideClick:false,
        //   icon:'success',
        //   title:'Orden envíada al correo',
        //   text:'Se ha eviado la orden al correo',
        //   timer:2000,
        //   showConfirmButton:false       
        // });
        // location.reload();
      }else{
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: '¡Correo no se pudo enviar!',
      text: 'Cliente no tiene registrado un correo electrónico',
      confirmButtonColor: '#818181'
   
    })
      }
  })
   
    cerrarModal1('#bd-example-modal-xl');
    // location.reload();
  },(err)=>{    
    Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, no se pudo cerrar la orden',
          confirmButtonColor: '#818181'
    })      
  
  })            
    }                                           

    });

}else
// if(form.items !=''&& form.revision!='')
{
  let fechaDATE = form.fechaProximoMan;
let fechaString = this.fechaPipe.transform(fechaDATE, 'longDate','UTC');

form.fechaPm_str = fechaString;
form.nro_ordenAbierta = idOrden;
form.kmActual = parseFloat(kmActual);
let kpm = form.kmProximoMan ;
form.kmProximoMan = parseFloat(kpm)+form.kmActual;
form.prodProx_cant = arrayCantidad;
form.prodProx_nombre = arrayNombreServicio;
form.prodProx_km = arraykm;
form.prodProx_pU = arrayValor;
form.prodProx_pT = arrayCostoPromedio;

form.prodProx_ivaporcent = arrayIvaPorCent;
form.prodProx_iva = arrayIVa;

form.prodProx_alias = arrayAlias;
form.esservicio= arrayServicio;
form.prodProx_priori = arrayPrioridadProxima;
form.prodProx_id = arrayProductoId;

// console.log('form lleno', form);


const dato = localStorage.getItem("Inflogueo");

if(dato) {
  this.datosLocalStorage=JSON.parse(dato);
  
}else console.log("ERROR");

let infAcceso  = new Array;
infAcceso=  Object.values(this.datosLocalStorage);
let user_id = infAcceso[1][0].id;
form.user_id = user_id;


// console.log('form ', form);
  this.allService.postALL(form,'orden_cerrada').subscribe(data=>{

    // console.log("datos enviados => ", data);

      Swal.close(); 
      Swal.fire({
      allowOutsideClick:false,
      icon:'success',
      title:'Operación Exitosa',
      text:'La orden se ha cerrado con éxito',
      timer: 2000,
    showConfirmButton:false
    });

  let bandera = false;

  let tipo = 'oc';
  let accion="send";
  let empresa = this.getNombreEmpresa();
  
  this.allService.getAl('hacer_pdf/'+accion+'?oa_id='+idOrden+'&tipo='+tipo+'&emp='+empresa).then((data:any)=>{
    if(data.rta == undefined){
        // Swal.close(); 
        // Swal.fire({
        //   allowOutsideClick:false,
        //   icon:'success',
        //   title:'Orden envíada al correo',
        //   text:'Se ha eviado la orden al correo',
        //   timer:2000,
        //   showConfirmButton:false       
        // });
        location.reload();
      }else{
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: '¡Correo no se pudo enviar!',
      text: 'Cliente no tiene registrado un correo electrónico',
      confirmButtonColor: '#818181'
   
    })
      }
  })
  
  location.reload();

  cerrarModal1('#bd-example-modal-xl');
},(err)=>{    
  Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error, no se pudo cerrar la orden',
        confirmButtonColor: '#818181'
  })      

}) 
}


}


resetearForm(){
  this.formCerrarOrden.reset();
  this.ocultarTabla();
  this.quitarProducto(0,0)

}

  printJS(){
    print();
  }



    enviarPedido(pedPro:any, posicion:any){

      // console.log("Pedido que me llega =>", pedPro);
      // console.log("posicón que ocupa en el arreglo => ", posicion);
      let arr = pedPro;
      let posicionArreglo = arr[posicion];
      this.productoFormCantidad = [posicionArreglo];
      // console.log("Arreglo al que pertenece => ", this.productoFormCantidad);
      // console.log("Arreglo al que pertenece => ", posicionArreglo);
      this.position = posicion;
      this.idOrden = posicionArreglo.producto_id;
      this.enviarProducto = posicionArreglo.cant;
      this.formCantidad.setValue({
        'c': this.enviarProducto,
        'kilometro': this.productoFormCantidad[0].kmT,

        // 'precio': this.decimalP.transform(this.productoFormCantidad[0].total,'.0-2')
        'precio': this.productoFormCantidad[0].itemprecio,
         'nombreA':this.productoFormCantidad[0].alias
        // 'precio': this.decimalP.transform(this.productoFormCantidad[0].costopromedio,'.0-2')
      })
      
      
      }


  // ============================== MODIFICAR CANTIDAD ===============================

  

    cerrar(){
      this.modalService.dismissAll(this.cerrarO);
    }

    // ========================== CHECK DE SALIDA ===================================


    formCheck = new FormGroup({
      val: new FormControl( Validators.required),
      item: new FormControl()
     //  revision: new FormControl( Validators.required),
     //  items: new FormControl()
    })

    listarTodos(){

      let i = 0;
      this.allService.getALL('control_calidad/activo_all', i).subscribe((data:any)=>{
        this.controles = data;
        let arreglo = new Array;
        let arreglo2 = new Array;
    
        for (let i = 0; i < this.controles.length; i++) {
          for (let j = 0; j < this.controles[i].items.length; j++) {     
            arreglo = this.controles[i].items[j];
            arreglo2.push(arreglo);
          }
        }
        // console.log(arreglo2);
        this.arregloCategoria = arreglo2;
      })

      let j = 0;
      this.allService.getSimple('control_calidad/all_rev_activo').then((data:any)=>{
        this.evaluacion = data
      })
      this.modal = this.modalService.open(this.modalControl, {size:'lg'});

    }

    isChecked(j:any){
      let band = valSeleccionado(j);
      this.banderaCheckIN = band;
      // console.log(this.banderaCheckIN);
      
    }
    guardarCheck(form:any){

      if(this.banderaCheckIN == true){
      
        let tam = this.arregloCategoria.length;
        let arrayCalificacionItem = new Array(tam);
        let arr= new Array;
        let arr2= new Array;
        for (let i = 0; i < tam; i++) {
          arrayCalificacionItem[i] = valSeleccionadoT(i, tam);
          arr= this.arregloCategoria[i].id;
              arr2.push(arr);
        }
      
       
        
            form.val = arrayCalificacionItem;
            form.item= arr2;
            this.arregloCalificacion=[form.val, form.item];
            // console.log(form);
            // console.log('arreglo', this.arregloCalificacion);
            // console.log(form);
            Swal.fire({
              allowOutsideClick:false,
              icon:'info',
              title:'Guardando Calificación',
              text:'La calificación se ha guardado con éxito',
              timer:1500,
              showConfirmButton:false
              });
         
              this.cerrarModal();
              this.formCheck.reset();
              let btnCS = document.getElementById('btnCCS');
              btnCS?.setAttribute('disabled','');
      
      }else{
      
              Swal.fire({
                allowOutsideClick:false,
                icon:'error',
                title:'Campos vacíos',
                text:'Debe completar el check de control de acceso',
                confirmButtonColor: '#818181'
              
                });
      
            }
      
            
      }
  


  

}
