import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild ,AfterViewInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AllServiceService } from '../../../services/all-service.service';
import { PlaneadorModel } from '../../Modelos/planeador.model';
import { Location, TitleCasePipe } from '@angular/common';
import { Cliente } from '../../Modelos/cliente.model';
import { combineLatest } from 'rxjs';
import Swiper from 'swiper';


// declare function slider6Refresh():any;
// declare function arregloValoresAuto(i: any, tam: any): any;
declare function slider6():any;
declare function filter():any;
declare function cerrarModal1(params:string):any;
declare function abrirModalCodigo1(modal:string):any;

@Component({
  selector: 'app-ver-planeador',
  templateUrl: './ver-planeador.component.html',
  styleUrls: ['./ver-planeador.component.scss']
})
export class VerPlaneadorComponent implements AfterContentInit,  OnInit, AfterViewInit{
  
  public isCollapsed1 = false;
  public isCollapsed2 = true;
  public isCollapsed = true;


  //Tabla
  page = 1;
  pageSize = 5;
  collectionSize:any;
  cliente : Cliente[];

  j:any;
  i:PlaneadorModel;
  elements:any=[];
  dataCorrectivo:any =[];
  dataPreventivo:any =[];
  elements2: any =[];
  estados:any=[];
  idOrden:any;
 ruc:any;
  //Inf card
  datosLocalStorage:any=[]

  urgentes:any;
  correctivo:any;
  preventivo:any;
  public modal : any;
  public modal1 : any;

  // Datos Correo
  nombreEmpresa: any;
  fechaOrden:any;
  nombre:any;
  direccion:any;
  celular: any;
  correo:any;
  placa:any;
  marca:any;
  modelo:any;
  // problema:any;


    //REGISTRAR CLIENTE 
    cedulaGlobal='';
    tipoDocumento:any;


  //BANDERAS
  banderaCard = false;
  banderaFacturar = false;
  banderaFacturarServicio =false;
  banderaFacturarProducto =false;


  banderaPrefactura = false;
  banderaCerrarCaso = false;
  banderaBusqueda = false;
  banderaAcciones = false;
  bandera: any;
  banderaVistaDefecto= true;
  banderaVistaTecnico = false;

  informacionOrden:any =[];
  pedidoProductos:any=[];
  tamPyS:any;
  pedidoTecnicos:any;
  
  //Desplazamiento Sweet

  elementoGeneral:any;

  dni:any;
  //TOTAL
  total1:any;
  subTotal12:any;
  subTotalcero:any;
  subTotal:any;
  iva12:any;
  // valorTotal:any;

  url="orden_abierta";
  url6='estado/activo';

  atributos:any;

  //GLOBALES
  problema:any;
  tecnico:any;
  tecID:any;
  servicio:any;
  servID:any;
  prioridad:any;
  priID:any;


      //Tecnicos
tecnicos:any =[];
//Prioridades
prioridades:any=[];
//Servicios
servicios:any=[];

vistaTecnicos:any=[];

//MANTENER VISTA
estadoVista:any;

placa1:any;
marca1:any;
kilometraje:any;

//Enviar SI TIENE PRODUCTOS

tieneS =0;
tieneP =0;
facturadoS =0;
facturadoP =0;

// Cliente Card 
clientes:any=[];
clienteCard:any=[];

banderaPaginacion:any;
banderaCliente = false;
banderaValidarDOC = true;
banderaClienteCreado =false;
  //tipoUsuario - Cliente

  tipoUsuario:any=[];
  tipoUsuarioDefecto:any;
  tipoUsuarioID:any;

  textoBuscar='';
  text='';
  apellido ='';
  telf='';
  email = '';
  dir ='';
  banderaActualizar = false;
  banderaCardU = false;
  banderaCardC = false;
  banderaCardP = false;
  banderaAC = false;
  public mySwiper: Swiper;
@ViewChild("modalRegistrarCliente") modalRegistrarCliente: TemplateRef<any> | undefined;
@ViewChild("modalSelecionarCliente") modalSelecionarCliente: TemplateRef<any> | undefined; 
@ViewChild("modalCambiarEstado") myModal: TemplateRef <any> | undefined;


constructor(private allService:AllServiceService,  private modalService  : NgbModal,
    public _router: Router, 
    public _location: Location,
    private titleCasePipe: TitleCasePipe
    
            ) { }

    ngOnInit(): void {


             this.enviarTipoCliente();
             this.dataTarjetas()
              
             combineLatest([
              this.allService.getAl('atributo/activo'),
              this.allService.getAl('tecnico/todos'),
              this.allService.getAl('producto/activo'),
              this.allService.getAl('prioridad/activo_oa'),
              this.allService.getALL('estado/activo', this.i)
             ]).subscribe(([atributo,tecnicos, producto,prioridad, estado])=>{
              this.atributos = atributo;
              this.tecnicos =tecnicos;
              this.servicios = producto;
              this.prioridades = prioridad;
              this.estados = estado
             })

            //  setTimeout(() => {
            //   this.mySwiper = new Swiper('.swiper-container', {
            //    slidesPerView: 4.3,
            //    freeMode: true,
            //    spaceBetween: 15,
       
            //  });
            // }, 2000);
    }

    ngAfterViewInit() {



    }
    onSlideNext(){
      this.mySwiper.slideNext();
    }
  
    onSlidePrev(){
      this.mySwiper.slidePrev();
    }
            
            ngAfterContentInit(): void {
              
            }

    // ngAfterContentInit(): void {
    //   this.enviarTecnico();
    //   this.enviarServicio();
    //   this.enviarPrioridad();
    //   this.enviarTipoCliente();
      
    //     setTimeout(() => {

    //       this.dataTarjetas()
          
    //      }, 700);
    //     this.enviarEstado();
    // }


  // ngOnInit(): void {

    cambiosDetectados(event:any){
      this.banderaActualizar =true
    }

  // }

  refreshClientes() {
    const PRS :Cliente[]=this.clientes;
    this.collectionSize = PRS.length;

    if(this.collectionSize <= this.pageSize){
      this.banderaPaginacion = false;
    }else{
      this.banderaPaginacion = true;
    }

      this.cliente = PRS
      .map((blablabla: any, i: number) => ({id: i + 1, ...blablabla}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }

  enviarAtributo() {
    this.allService.getAl('atributo/activo').then((data) => {
      this.atributos  = data;
    });
  }

  // enviarTecnico() {
  //   this.allService.getAl('tecnico/todos').then((data) => {
  //     this.tecnicos = data;  
  
  //   });
  // }
  // enviarServicio() {
  //   this.allService.getAl('producto/activo').then((data) => {
  //     this.servicios = data;

  //   });
  // } 
  
  // enviarPrioridad() {
  //   this.allService.getAl('prioridad/activo_oa').then((data) => {
  //     this.prioridades = data;
  //   });
  // } 


  // ======================= FORMULARIOS =============================

  formCambiarEstadoOrden = new FormGroup({
    estado: new FormControl('', Validators.required)
  })

  formEditarVehiculo= new FormGroup({
    equipoattr_id : new FormControl(''),
    valor: new FormControl(''),
    problema:new FormControl(''),
    tecnico_id : new FormControl(''),
    servicio_id: new FormControl(''),
    prioridad_id : new FormControl('')
  })

  // ============================ ABRIR MODAL =================================
abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent, {size: 'md'});
  
}
abrirModal1 (ModalContent: any): void {
  this.modal1 = this.modalService.open(ModalContent, {size: 'sm'});
  
}

buscar(event:any){

  this.textoBuscar = event
  // console.log(this.textoBuscar);
  // this.textoBuscar = event.detail.value;
  // console.log( this.textoBuscar);
  

 }

cerrarModal(){
  this.modal.close();
}
cerrarModal1(){
  this.modal1.close();
}

cerrarMODAL(){

  cerrarModal1("#modalEV");
  // this.closebutton.nativeElement.click();
  this.formEditarVehiculo.reset();
}
cerrarMODAL2(){
  cerrarModal1("#modalEU");

  this.banderaActualizar = false;
  this.formCliente.reset();
  this.formEditarVehiculo.reset();
  let btnAC = document.getElementById('btnAU');
  btnAC?.setAttribute('disabled','');
}
cerrarMODAL3(){
  cerrarModal1("#modalRC");
  this.formRegistrarCliente.reset();
}


async  listarTodos1(){
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Cargando Órdenes',
    text:'Se está cargando las órdenes, espere por favor' ,
    });
    Swal.showLoading();
await this.allService.getSimple('orden_abierta/planeador').then((data:any)=>{
    Swal.close();
    let data1 = new Array;
    let data2 = new Array;
    let data3 = new Array;

    for (let i = 0; i < data.length; i++) {
      if(data[i].prioridad == "URGENTE"){
        let cU = data[i];     
        data1.push(cU);
        this.elements = data1;
          
      }else if(data[i].prioridad == "CORRECTIVO"){
        let cU = data[i];     
        data2.push(cU);
        this.dataCorrectivo = data2;
      }else{
        let cU = data[i];     
        data3.push(cU);
        this.dataPreventivo = data3;
      }
      
    }
    // console.log(this.elements);
    // console.log(this.dataCorrectivo);
    // console.log(this.dataPreventivo);
  })
  this.estadoVista =1;
  
 }
//  vaciarArregloU(){
//   this.elements.splice(0, this.elements.length);
//   this.elements=[];
//   if(this.elements.length == 0){
//     this.banderaCardU = false;
//   }
// }
//  vaciarArregloC(){
//   this.dataCorrectivo.splice(0, this.dataCorrectivo.length);
//   this.dataCorrectivo=[];
//   if(this.dataCorrectivo.length == 0){
//     this.banderaCardC = false;
//   }
// }
//  vaciarArregloP(){
//   this.dataPreventivo.splice(0, this.dataPreventivo.length);
//   this.dataPreventivo=[];
//   if(this.dataPreventivo.length == 0){
//     this.banderaCardP = false;
//   }
// }
 async dataTarjetas(){


  await this.allService.getPlaneador('orden_abierta/planeador').subscribe(async (data:any)=>{
  // console.log(data);
this.elements =[];
this.dataCorrectivo =[];
this.dataPreventivo =[];

    Swal.close();
    let data1 = new Array;
    let data2 = new Array;
    let data3 = new Array;
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      if(data[i].prioridad == "URGENTE"){
        let cU = data[i];     
        data1.push(cU);
        this.elements = data1;
          
      }else if(data[i].prioridad == "CORRECTIVO"){
        let cU = data[i];     
        data2.push(cU);
        this.dataCorrectivo = data2;

      }else if(data[i].prioridad == "PREVENTIVO"){    
        let cU = data[i]; 
        data3.push(cU);
        this.dataPreventivo = data3;
      }      
    }

    if( this.elements.length >= 1){
      this.banderaCardU = true;
    }else if(this.elements.length == 0){
      this.banderaCardU = false;
    }
    if( this.dataCorrectivo.length >= 1){
      this.banderaCardC = true;
    }else if(this.dataCorrectivo.length == 0){
      this.banderaCardC = false;
    }
    if( this.dataPreventivo.length >= 1){
      this.banderaCardP = true;
    }else if(this.dataPreventivo.length == 0){
      this.banderaCardP = false;
    }


    // console.log(this.elements);
    // console.log(this.dataCorrectivo);
    // console.log(this.dataPreventivo);
    
  })
  this.estadoVista =1;
 }
//  async dataTarjetas(){
//   // Swal.fire({
//   //   allowOutsideClick:false,
//   //   icon:'info',
//   //   title:'Cargando Órdenes',
//   //   text:'Se está cargando las órdenes, espere por favor' ,
//   //   });
//   //   Swal.showLoading();
//   this.vaciarArregloU();
//   this.vaciarArregloC();
//   this.vaciarArregloP();

// await this.allService.getPlaneador('orden_abierta/planeador').subscribe((data:any)=>{
// // await this.allService.getSimple('orden_abierta/planeador').then((data:any)=>{
//   console.log(data);
//   // if(data.length == 0){
//   //   this.banderaCardU =false;
//   //   this.banderaCardC =false;
//   //   this.banderaCardP =false;
//   // }
  
//     Swal.close();
//     let data1 = new Array;
//     let data2 = new Array;
//     let data3 = new Array;
//     // console.log(data);
//     let cliente;
//     let estado;
//     let estado_id;
//     let fecha;
//     let hora;
//     let id;
//     let no;
//     let prioridad;
//     let valAuto:any = [];
//     let tecnico:any;
//     let ordenesU:any=[];
//     let ordenesC:any=[];
//     let ordenesP:any=[];
//     let completo:any;
//     let placa:any;
//     let marca:any;
//     let modelo:any;
//     let km:any;

//     for (let i = 0; i < data.length; i++) {
//       if(data[i].prioridad == "URGENTE"){
//         // let cU = data[i];
//         cliente = data[i].cliente;
//         estado = data[i].estado;
//         estado_id = data[i].estado_id;
//         fecha= data[i].fecha;
//         hora = data[i].hora;
//         id = data[i].id;
//         no = data[i].no;
     
//         prioridad = data[i].prioridad;
//          for (let j = 0; j < data[i].atributo.length; j++) {

//             if( data[i].atributo[j].nombre == 'PLACA'){
//               placa = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'MARCA'){
//               marca = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'MODELO'){
//               modelo = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'KILOMETRAJE'){
//               km = data[i].atributo[j].valor 
//             }

//             valAuto =[placa, marca, modelo, km];
//             // console.log(valAuto);
            
//          }
//          tecnico = data[i].tecnico;
//          completo = cliente+ no + valAuto[0] + valAuto[1]
//          ordenesU = {
//           cliente,
//           estado,
//           estado_id,
//           fecha,
//           hora,
//           id,
//           no,
//           prioridad,
//           valAuto,
//           tecnico,
//           completo
//          }

//         data1.push(ordenesU);
//         this.elements = data1;

//         if( this.elements.length >= 1){
//           this.banderaCardU = true;   
//         }

//       }else if(data[i].prioridad == "CORRECTIVO"){
//         // let cU = data[i];  
//          // let cU = data[i];
//          cliente = data[i].cliente;
//          estado = data[i].estado;
//          estado_id = data[i].estado_id;
//          fecha= data[i].fecha;
//          hora = data[i].hora;
//          id = data[i].id;
//          no = data[i].no;
      
//          prioridad = data[i].prioridad;
//           for (let j = 0; j < data[i].atributo.length; j++) {
 
//              if( data[i].atributo[j].nombre == 'PLACA'){
//                placa = data[i].atributo[j].valor 
//              }
//              if( data[i].atributo[j].nombre == 'MARCA'){
//                marca = data[i].atributo[j].valor 
//              }
//              if( data[i].atributo[j].nombre == 'MODELO'){
//                modelo = data[i].atributo[j].valor 
//              }
//              if( data[i].atributo[j].nombre == 'KILOMETRAJE'){
//                km = data[i].atributo[j].valor 
//              }
 
//              valAuto =[placa, marca, modelo, km];
//              // console.log(valAuto);
             
//           }
//           tecnico = data[i].tecnico;
//           completo = cliente+ no + valAuto[0] + valAuto[1]
//           ordenesC = {
//            cliente,
//            estado,
//            estado_id,
//            fecha,
//            hora,
//            id,
//            no,
//            prioridad,
//            valAuto,
//            tecnico,
//            completo
//           }
//          data2.push(ordenesC);   
//         this.dataCorrectivo = data2;
//         if( this.dataCorrectivo.length >= 1){
//           this.banderaCardC = true;
//           // console.log("ENTRA", this.dataCorrectivo.length );
//         }
//       }else{
//         // let cU = data[i];  
//         cliente = data[i].cliente;
//         estado = data[i].estado;
//         estado_id = data[i].estado_id;
//         fecha= data[i].fecha;
//         hora = data[i].hora;
//         id = data[i].id;
//         no = data[i].no;
     
//         prioridad = data[i].prioridad;
//          for (let j = 0; j < data[i].atributo.length; j++) {

//             if( data[i].atributo[j].nombre == 'PLACA'){
//               placa = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'MARCA'){
//               marca = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'MODELO'){
//               modelo = data[i].atributo[j].valor 
//             }
//             if( data[i].atributo[j].nombre == 'KILOMETRAJE'){
//               km = data[i].atributo[j].valor 
//             }

//             valAuto =[placa, marca, modelo, km];
//             // console.log(valAuto);
            
//          }
//          tecnico = data[i].tecnico;
//          completo = cliente+ no + valAuto[0] + valAuto[1]
//          ordenesP = {
//           cliente,
//           estado,
//           estado_id,
//           fecha,
//           hora,
//           id,
//           no,
//           prioridad,
//           valAuto,
//           tecnico,
//           completo
//          }
//         data3.push(ordenesP);      
//         // data3.push(cU);
//         this.dataPreventivo = data3;
//         if( this.dataPreventivo.length >= 1){
//           this.banderaCardP = true;
//           // console.log("ENTRA", this.dataPreventivo.length );
//         }else if(this.dataPreventivo.length == 0){
//           this.banderaCardP == false;
//         }
//       }
      
//     }
//     // console.log(this.elements);
//     // console.log(this.dataCorrectivo);
//     // console.log(this.dataPreventivo);
//   })
//   this.estadoVista =1;
//  }

 vistaPorPrioridad(){
  this.vistaTecnicos =[];
  // setTimeout(() => {
    // slider6();  
    // this.listarTodos1();
    this.dataTarjetas();
    this.estadoVista =1;
  
   
    // console.log("SI ENTRA AQYi");
    
  //  }, 100);
   this.banderaVistaDefecto = true;
   this.banderaVistaTecnico = false;

 }

   listarTodos(){
    this.allService.getAl('orden_abierta/planeador').then((data:any)=>{
      this.elements = data;
    })

   }
   enviarEstado(){
    this.allService.getALL('estado/activo', this.i).subscribe((data:any)=>{
       let est = JSON.parse(data);
       this.estados = est.data;
      //  console.log("estados => ", this.estados);    
    })       
}

enviarAtributoVehiculo(){

  cerrarModal1('#modalEO');

  let id = this.idOrden;
  // console.log("ID ORDEN", id);
  
  this.allService.getForID('orden_abierta', id).then((data:any)=>{
        let infoUsuario = [data];
        // console.log("INFO USUARIO",infoUsuario);
        this.atributos = infoUsuario[0].vehiculo;
        this.problema = infoUsuario[0].usuario[0].problema;
        this.tecnico = infoUsuario[0].tys[0].tecnico_nombres+' '+infoUsuario[0].tys[0].tecnico_apellidos;
        this.tecID = infoUsuario[0].tys[0].tecnico_id
        this.servicio = infoUsuario[0].tys[0].tipo;
        this.servID = infoUsuario[0].tys[0].servicio_id;
        this.prioridad =  infoUsuario[0].usuario[0].prioridad;
        this.priID =  infoUsuario[0].usuario[0].prioridad_id
        // console.log("datos vehiculo", this.atributos);
        // console.log("problema", this.problema);
    
        this.formEditarVehiculo.setValue({
    
          'equipoattr_id': '',
          'valor': '',
          'problema': this.problema,
          'tecnico_id': '',
          'servicio_id': '',
          'prioridad_id': ''
        })
        
      })
}

arregloValoresAuto(i:any, tam:any){
  let x;
  for (let j = 0; j < tam; j++) {
      // var x = document.getElementById("floatingInputNombre2" + i).value;
       x = (document.getElementById('floatingInputNombre1'+i) as HTMLInputElement).value;
  }
  return x;
}


ingresarDatosVehiculo(form: any) {
  let tamDV = this.atributos.length;
  let arrayIdAtributosAcrear = new Array(tamDV);
  let arrayValoresaCrear = new Array(tamDV);

  for (let i = 0; i < tamDV; i++) {
    arrayIdAtributosAcrear[i] = this.atributos[i].equipoattr_id;
    // arrayValoresaCrear[i] = arregloValoresAuto(i, tamDV);
    arrayValoresaCrear[i] = this.arregloValoresAuto(i, tamDV);
  }
  form.equipoattr_id = arrayIdAtributosAcrear;
  form.valor = arrayValoresaCrear;

  // console.log('Form ingresar datos', form);
}


editarCotizacionDATOS(form:any){

  if(form.tecnico_id !='' && form.servicio_id != '' && form.prioridad_id !=''){

//  console.log("ENTRA EN EL 1");
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();
  // console.log("FORM => ", form);
let atrVehi = form.equipoattr_id;
dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', form.tecnico_id);
dataform.append('servicio_id', form.servicio_id);
dataform.append('prioridad_id', form.prioridad_id);

// console.log("id ORden", this.idOrden);
this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {

    // console.log("DATA =>", data);
    this.cambiosRealizados();
    cerrarModal1('#modalEV')
    this.actualizarCards();
        
})
}else
if(form.tecnico_id.length != 0  && form.servicio_id.length !=0 && form.prioridad_id.length == 0)
{

this.ingresarDatosVehiculo(form);
  let dataform = new FormData();
let atrVehi = form.equipoattr_id;

dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', form.tecnico_id);
dataform.append('servicio_id', form.servicio_id);
dataform.append('prioridad_id', this.priID);


this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    this.cambiosRealizados();
    cerrarModal1('#modalEV')
    this.actualizarCards();

       
})

}else
if(form.tecnico_id.length != 0  && form.servicio_id.length ==0 && form.prioridad_id.length != 0){
this.ingresarDatosVehiculo(form);
let dataform = new FormData();


let atrVehi = form.equipoattr_id;

dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', form.tecnico_id);
dataform.append('servicio_id', this.servID);
dataform.append('prioridad_id', form.prioridad_id);



this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
(data:any) => {
  // console.log("DATA =>", data);
  this.cambiosRealizados();
  cerrarModal1('#modalEV')
  // cerrarModal1('#modalEV')
  this.actualizarCards();
})

}else
if(form.tecnico_id.length == 0  && form.servicio_id.length !=0 && form.prioridad_id.length != 0){
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();

  // console.log("FORM => ", form);
  

let atrVehi = form.equipoattr_id;

dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', this.tecID);
dataform.append('servicio_id', form.servicio_id);
dataform.append('prioridad_id', form.prioridad_id);


this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    this.cambiosRealizados();
    cerrarModal1('#modalEV')
    // cerrarModal1('#modalEV')
    this.actualizarCards();
})

}else 
if(form.tecnico_id.length == 0  && form.servicio_id.length !=0 && form.prioridad_id.length == 0){
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();

  // console.log("FORM => ", form);
  

let atrVehi = form.equipoattr_id;

dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', this.tecID);
dataform.append('servicio_id', form.servicio_id);
dataform.append('prioridad_id', this.priID);

this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    this.cambiosRealizados();
  
    // cerrarModal1('#modalEV')
    // this.formEditarVehiculo.reset();
    cerrarModal1('#modalEV')
    this.actualizarCards();
})

}else 
if(form.tecnico_id.length != 0  && form.servicio_id.length ==0 && form.prioridad_id.length == 0){
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();
  // console.log("FORM => ", form);
let atrVehi = form.equipoattr_id;  
dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', form.tecnico_id);
dataform.append('servicio_id', this.servID);
dataform.append('prioridad_id', this.priID);  

this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    this.cambiosRealizados();
    // cerrarModal1('#modalEV')
    cerrarModal1('#modalEV')
    this.actualizarCards();
})

}else
if(form.tecnico_id.length == 0  && form.servicio_id.length ==0 && form.prioridad_id.length != 0){
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();
  // console.log("FORM => ", form);
let atrVehi = form.equipoattr_id;  
dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', this.tecID);
dataform.append('servicio_id', this.servID);
dataform.append('prioridad_id',form.prioridad_id);  

this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    this.cambiosRealizados();  
    cerrarModal1('#modalEV')
   this.actualizarCards();
})
  
}else
  if(form.tecnico_id.length == 0  && form.servicio_id.length ==0 && form.prioridad_id.length == 0){
    // console.log("INGRESA ACA");
    
    this.ingresarDatosVehiculo(form);
    let dataform = new FormData();
    // console.log("FORM => ", form);
  let atrVehi = form.equipoattr_id;  
  dataform.append("equipoattr_id", atrVehi);
  dataform.append("valor", form.valor);
  dataform.append('problema', form.problema);
  dataform.append('tecnico_id', this.tecID);
  dataform.append('servicio_id', this.servID);
  dataform.append('prioridad_id',this.priID);  
  
  this.allService.postALL(dataform,'orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      this.cambiosRealizados();
      // cerrarModal1('#modalEV')
      cerrarModal1('#modalEV')
      this.actualizarCards();

  })
}
}


cambiosRealizados(){
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    showConfirmButton:false,
    text:'Se está realizando los cambios, espere por favor' ,
    });
    Swal.showLoading();
    setTimeout(() => {
      Swal.close();   
     }, 400);

}

actualizarCards(){
  if(this.estadoVista == 1){
   setTimeout(() => {
  //  console.log("TOICK");
   
      // this.refresh();   
      // this.listarTodos1()
      this.dataTarjetas();
      this.banderaVistaDefecto = true;
      this.banderaVistaTecnico = false;
   
     
   }, 500); 
  }else if(this.estadoVista == 1){
    // this.refresh(); 
    // this.listarTodos1()  
    this.dataTarjetas();
    this.banderaVistaDefecto = false;
    this.banderaVistaTecnico = true;
  }
}

enviarCI(id:any){
  this.allService.getForID(this.url, id).then((data:any)=>{
    let infoUsuario = [data];
    this.ruc  = infoUsuario[0].usuario[0].PersonaComercio_cedulaRuc;
    return this.ruc;
  })
}
enviarDatos1(id:any){

  this.allService.getForID(this.url, id).then((data:any)=>{
    let infoUsuario = [data];
    // console.log(infoUsuario);
    
    this.elements2 =infoUsuario;
    
    let secuencia = infoUsuario[0].usuario[0].secuencia;
    let idOrden = infoUsuario[0].usuario[0].id;
    let fecha = infoUsuario[0].usuario[0].fecha;
    let cliente = infoUsuario[0].usuario[0].nombres+" "+infoUsuario[0].usuario[0].apellidos;
    let problema = infoUsuario[0].usuario[0].problema;
    let PersonaComercio_cedulaRuc = infoUsuario[0].usuario[0].PersonaComercio_cedulaRuc;
    this.ruc = PersonaComercio_cedulaRuc;
    let atributos = infoUsuario[0].vehiculo;

    let placa1:any;
    let marca1:any;
    let kilometraje:any
    // console.log(atributos);
    
    let arrayValAuto=[];  
      for (let j = 0; j < atributos.length; j++) {
        let atriNombre = atributos[j].atributo;
        let atriNombre1 = atributos[j].atributo;
        let atriNombre2 = atributos[j].atributo;

        if(atriNombre == 'Placa'|| atriNombre == 'PLACA' ){
          this.placa1 = atributos[j].valor;
           placa1 = this.placa1;              
        }
        if(atriNombre1 == 'MARCA'|| atriNombre == 'Marca'  ){
          this.marca1 = atributos[j].valor;
           marca1 = this.marca1;
        }
        if(atriNombre2 == 'Kilometraje'|| atriNombre == 'KILOMETRAJE' ){
          this.kilometraje = atributos[j].valor;
           kilometraje = this.kilometraje;
        }
      }
        arrayValAuto =[placa1, marca1, kilometraje]  
      

    let default_price = infoUsuario[0].usuario[0].default_price;
    //Info para whatsApp y correo
    let direccion = infoUsuario[0].usuario[0].direccion;
    let correo = infoUsuario[0].usuario[0].email;
    let celular = infoUsuario[0].usuario[0].celular;
    this.informacionOrden = [{secuencia,idOrden, fecha, cliente, arrayValAuto, problema, default_price, PersonaComercio_cedulaRuc, direccion, correo, celular}];
      // console.log('arra ', this.informacionOrden);
      
    let tamPyS =this.elements2[0].pys.length;

    this.tamPyS = tamPyS;

    let estadoF = this.elements2[0].usuario[0].facturado;
    let estadoFS = this.elements2[0].usuario[0].ser_facturado;
    let estadoFP = this.elements2[0].usuario[0].pro_facturado;
    this.tieneS = this.elements2[0].usuario[0].ser_tiene;
    this.tieneP =this.elements2[0].usuario[0].pro_tiene;
    this.facturadoS = this.elements2[0].usuario[0].ser_facturado;
    this.facturadoP= this.elements2[0].usuario[0].pro_facturado;
    
    if(tamPyS == 0 && estadoF == 0 ){
  this.banderaPrefactura= true;
  this.banderaFacturar = false;
  this.banderaFacturarServicio = false;
  this.banderaFacturarProducto = false;
  this.banderaBusqueda = true;
  this.banderaAcciones = true;

    }else if( tamPyS > 0 && estadoF == 0 && estadoFS == 0 && estadoFP == 0 && this.tieneP==1 && this.tieneS == 1){
      this.banderaFacturar = true;
      this.banderaPrefactura = true;
      this.banderaFacturarServicio = true;
      this.banderaFacturarProducto = true;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = true;
      
    }else if( tamPyS > 0 && estadoF == 0 && estadoFS == 0 && estadoFP == 0 && this.tieneP==1 && this.tieneS == 0){
      this.banderaFacturar = true;
      this.banderaPrefactura = true;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = true;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = true;

    }else if( tamPyS > 0 && estadoF == 0 && estadoFS == 0 && estadoFP == 0 && this.tieneP==0 && this.tieneS == 1){
      this.banderaFacturar = true;
      this.banderaPrefactura = true;
      this.banderaFacturarServicio = true;
      this.banderaFacturarProducto = false;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = true;

    }else if( tamPyS > 0 && estadoF == 1 && estadoFS == 1 && (estadoFP == 0 && this.tieneP == 1 )){
      this.banderaFacturar = false;
      this.banderaPrefactura = false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = true;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = false;

    
    }else if( tamPyS > 0 && estadoF == 1 && estadoFP == 1 && (estadoFS == 0 && this.tieneS == 1 )){
      this.banderaFacturar = false;
      this.banderaPrefactura = false;
      this.banderaFacturarServicio = true;
      this.banderaFacturarProducto = false;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = false;

    
    }else if( tamPyS > 0 && estadoF == 1 && (estadoFS == 1 )&& (estadoFP == 0 && this.tieneP == 0 )){
      this.banderaFacturar = false;
      this.banderaPrefactura = false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = false;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = false;

    }else if( tamPyS > 0 && estadoF == 1 && (estadoFP == 1 )&& (estadoFS == 0 && this.tieneS == 0 )){
      this.banderaFacturar = false;
      this.banderaPrefactura = false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = false;
      this.banderaCerrarCaso = false;
      this.banderaBusqueda = true;
      this.banderaAcciones = false;


    }
    
    else if (tamPyS > 0 && estadoF==1){
      this.banderaFacturar= false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = false;
      this.banderaPrefactura = false;
      this.banderaBusqueda;
      this.banderaAcciones;
    }else {
      this.banderaFacturar= false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = false;
      this.banderaPrefactura = true;
      this.banderaBusqueda;
      this.banderaAcciones;
      
    }

    // ===================================================================================================

    let usuario = this.elements2[0].usuario[0].servicio;
    let productos = (this.elements2[0].pys);
    let tys =(this.elements2[0].tys);
    let array = new Array;
    let array2 = new Array;

    for (this.j = 0; this.j < productos.length; this.j++) {
     
      let element = productos[this.j];
      element = [element];
      array.push(element);
  
    }
    productos = array;
    let existeEmpleado = this.elements2[0].tys.length;

    if(existeEmpleado == 0){
      let tecnico = '';
      this.pedidoProductos = [{usuario, productos, tecnico}];
    }else{

      for (let i = 0; i < existeEmpleado; i++) {
        let element1 = tys[i];
        array2.push(element1);      
      }
      tys= array2;
      this.pedidoProductos = [{ productos}];
      this.pedidoTecnicos = [{tys}]
    }
    
    let tamPRO = this.pedidoProductos[0].productos.length;
    let product =this.pedidoProductos[0].productos;
    this.total1 =0;
    this.subTotal12=0;
    this.subTotalcero=0;
    this.subTotal=0;
    this.iva12=0;
    for (let i = 0; i < tamPRO; i++) {
      // console.log(product);
      if(product[i][0].ivaporcent == '12'){
      this.subTotal12 += (parseFloat(product[i][0].itemprecio) * parseFloat(product[i][0].cant));
      this.iva12 += (parseFloat(product[i][0].iva)* parseFloat(product[i][0].cant));
      // console.log( parseFloat(product[i][0].iva));
      // console.log(parseFloat(product[i][0].cant));
      
      }
      if(product[i][0].ivaporcent == '0'){
        this.subTotalcero +=(parseFloat(product[i][0].itemprecio) * parseFloat(product[i][0].cant));
      }
    this.subTotal = this.subTotal12 +this.subTotalcero;
     this.total1 += parseFloat(product[i][0].costopromedio); 
  
    }
    // console.log(this.pedidoProductos);
    
    // console.log(this.subTotal12);
    // console.log(this.subTotalcero);
    // console.log(this.subTotal);
    // console.log(this.iva12);
    // console.log(this.total1);
    
  })
  this.banderaCard= true;


  
}


// ================================== EDITAR CLIENTE =========================================

formEditarCliente = new FormGroup({

  PersonaComercio_cedulaRuc: new FormControl(''),
  nombres: new FormControl('', Validators.pattern('^[a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1]+$')),
  apellidos: new FormControl('',Validators.pattern('^[a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1]+$')),
  razonsocial: new FormControl(),
  direccion : new FormControl(''),
  telefonos : new FormControl(''),
  celular : new FormControl('',[Validators.pattern('[0-9]{8,13}') ]),
  email: new FormControl('', [ Validators.pattern('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')]),
  clientetipo_idclientetipo: new FormControl(''),

})

get f4(){
  return this.formEditarCliente.controls;
}


editarUsuario(){

  this.allService.getCliente(this.ruc).then((data: any) => {

    // console.log(data);
    
    if (data.rta == true) {

      Swal.close();
      this.clientes = data.clientes;
      if(this.clientes.length>=2){
        // this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
        // this.formCliente.reset();
        // this.refreshClientes();

      }
      else if(this.clientes.length=1){
                    
        this.clienteCard  = this.clientes;

        this.formEditarCliente.setValue({
          'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
          'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
          'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
          'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
          'direccion':this.clienteCard[0].direccion,
          'telefonos': this.clienteCard[0].celular,
          'celular':this.clienteCard[0].celular,
          'email':this.clienteCard[0].email,
          'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
         
    
        })
      }

    }
    })
}

enviarTipoCliente(){
  this.allService.getSimpleCommon('get_clientetipo').then((data:any)=>{
    this.tipoUsuario = data;
    this.tipoUsuarioDefecto = this.tipoUsuario[0].tipo;
    this.tipoUsuarioID = this.tipoUsuario[0].idclientetipo;    
  })
}

editarCliente(form:any){
  // console.log('Lo que trae', form);
  this.banderaAC = true;
  
  this.allService.postALCommon(form, 'update_all_client',).subscribe((data:any)=>{
  
  // Swal.fire({
  //   allowOutsideClick:false,
  //   icon:'success',
  //   title:'Cliente actualizado',
  //   text:'Cliente se ha actualizado con éxito' ,
  //   timer:900,
  //   showConfirmButton:false
  //   });
  
  setTimeout(() => {
    this.banderaAC =false;
     this.banderaActualizar = false;
     let btnAC = document.getElementById('btnAU');
     btnAC?.removeAttribute('disabled');
  }, 500);
  })

  

 
  
  }


  formCliente = new FormGroup({PersonaComercio_cedulaRuc: new FormControl('', [Validators.required, Validators.pattern('[a-z A-z]{3,30}||[0-9]{8-13}')]) });

  get f1() {
    return this.formCliente.controls;
  }

  obtenerCliente(form: any) {
    let btnAC = document.getElementById('btnAU');
     btnAC?.removeAttribute('disabled');

    // this.banderaCardCliente = false;
    // this.banderaAutoCrea= false;
    // this.banderaAutoCrea =false;
    this.formCliente.reset();
    let dni = form.PersonaComercio_cedulaRuc;
    if( (form.PersonaComercio_cedulaRuc).length >2){


    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Buscando cliente',
      text:'Se está buscando al cliente, espere por favor' ,
      });
      let i:any
      Swal.showLoading();
    //   this.allService.getVC('vehiculo/usuario_por_placa?buscar='+dni+'&tipo=ci',i).subscribe((data: any) => {
    //   // console.log(data);

    //   if (data.rta_us == true) {

    //     Swal.close();
    //     // this.clientes = data.clientes;
    //     this.clientes = data.usuario;
    //     if(this.clientes.length>=2){
    //       this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
    //       this.formCliente.reset();
    //       this.refreshClientes();

    //     }
    //     else if(this.clientes.length=1){
    //       this.clienteCard  = this.clientes;

    //       this.formEditarCliente.setValue({
    //         'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
    //         'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
    //         'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
    //         'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
    //         'direccion':this.clienteCard[0].direccion,
    //         'telefonos': this.clienteCard[0].celular,
    //         'celular':this.clienteCard[0].celular,
    //         'email':this.clienteCard[0].email,
    //         'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
           
      
    //       })

    //       this.dni = this.clienteCard[0].ruc;
    //       // this.banderaCardCliente = true;
    //       this.formCliente.reset();
    //       // this.tamAtributos = 0;
    //       // this.formNuevaOrden.get('valor')?.setValue('');
    //       form.valor='';
    //       // this.encerado = form.valor;

    //       // if(this.banderaCarroNoExiste == true){
    //       //   this.banderaAutoCrea= false;
    //       // }else{
    //       //   this.banderaAutoExiste = true;
    //       // }
      

    //       // this.banderaAutoExiste = true;
    //       // this.banderaAutoCrea= false;

    //     }
       
      
    //   }else if (data.rta == false) {

    //     Swal.close();
    //     this.validarDocumento(form);
    //   }
    // },(err)=>{
      // Swal.close();
      // console.log("ENTRA ACA");
      this.allService.getCliente(dni).then((data: any) => {

        // console.log(data);
        
        if (data.rta == true) {

          Swal.close();
          this.clientes = data.clientes;
          if(this.clientes.length>=2){
            this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
            this.formCliente.reset();
            this.refreshClientes();

          }
          else if(this.clientes.length=1){
                        
            this.clienteCard  = this.clientes;
            // console.log('cliente ', this.clienteCard);
            
            
            if(this.clienteCard[0].nombres ==" FINAL"){
              // console.log(this.clienteCard[0].nombres);
              
              // console.log('entra al if');
              
              this.formEditarCliente.setValue({
                'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
                'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
                'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
                'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
                'direccion':this.clienteCard[0].direccion,
                'telefonos': this.clienteCard[0].celular,
                'celular':this.clienteCard[0].celular,
                'email':this.clienteCard[0].email,
                'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
               
          
              })

              this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc


              // console.log("FINAL");
              this.enviarAtributo();
              

            }else if (this.clienteCard[0].nombres !="FINAL"){
              // console.log("caso 2");
              
            this.formEditarCliente.setValue({
              'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
              'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
              'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
              'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
              'direccion':this.clienteCard[0].direccion,
              'telefonos': this.clienteCard[0].celular,
              'celular':this.clienteCard[0].celular,
              'email':this.clienteCard[0].email,
              'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
             
        
            })
  
            this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
  
  
            this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
              // console.log(data);
        
              if (data.rta_us == true) {
                let cedula = data.usuario[0].ruc
                this.dni = cedula
                // console.log("========== cedula ep Pao", this.dni)


              }
            })
          }
          }
         
  
    
        
        }else if (data.rta == false) {
  
          Swal.close();
  
  
          this.validarDocumento(form);
        }

      })

      // this.validarDocumento(form);
    // });
  }
  else{
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, campo vacio!',
      showConfirmButton: false,
      timer:1500
    });
    this.formCliente.controls['PersonaComercio_cedulaRuc'].setValue('');
   
  }
  }



  validarDocumento(form:any){

    let ced = form.PersonaComercio_cedulaRuc;
    this.cedulaGlobal = ced;
     this.allService.getSimpleCommon('validar_cedula?ci='+ced).then((data:any)=>{
      if(data.valor == 0){
  
        Swal.fire({
          allowOutsideClick:false,
          icon:'warning',
          title:'Documento Incorrecto',
          text:'Ingrese un documento válido, intente nuevamente',
          confirmButtonColor: '#818181'
         
          });
      }else
        if(data.valor != 0){
          this.banderaCliente = true;
          this.banderaValidarDOC = false;

          console.log("AQUI");
          
  
            //  this.modal = this.modalService.open(this.modalRegistrarCliente, {centered: true});
            abrirModalCodigo1('#modalRC');
             this.bandera= false;
             this.banderaCliente = true;
  
          this.formRegistrarCliente.get('cedula')?.setValue(this.cedulaGlobal);
          this.formRegistrarCliente.get('tipoCli')?.setValue(this.tipoUsuarioID);
          
          this.tipoDocumento = data.valor;
  
        }
     })
  
     return  this.tipoDocumento;
  
  }



// ================================= REGISTRAR CLIENTE ===============================

formValidarIdentifiacion = new FormGroup({
  PersonaComercio_cedulaRuc: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(14)]),
})
formRegistrarCliente = new FormGroup({
  cedula: new FormControl(''),
  nombres: new FormControl('', [Validators.required, Validators.pattern('^[a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1]+$')]),
  apellidos: new FormControl('', [Validators.required, Validators.pattern('^[a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1]+$')]),
  razonsocial: new FormControl(''),
  direccion : new FormControl(''),
  telefonos : new FormControl(''),
  celular : new FormControl('',[Validators.required, Validators.pattern('[0-9]{8,13}') ]),
  email: new FormControl('', [ Validators.pattern('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$')]),
  tipoCli: new FormControl(''),
})
get f3(){
  return this.formRegistrarCliente.controls;
}

  seleccionarCliente(cliente: any) {
    // console.log('------ cliente que enviaré a la card ', cliente);
    this.clienteCard = [cliente];
    // console.log(this.clienteCard);
    
    let cel = this.clienteCard[0].celular;
    // ========================================================
    this.nombre = this.clienteCard[0].nombres+" "+this.clienteCard[0].apellidos;
    this.direccion = this.clienteCard[0].direccion;
    this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
    this.celular = cel;
    // console.log('CEL', this.celular);
    let correo = this.clienteCard[0].email;
    this.correo = correo;
    let i:any;

    this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
      // this.allService.getCliente(dni).then((data: any) => {
        // console.log(data);
  
        if (data.rta_us == true ) {
  
          // Swal.close();
          this.clienteCard  = data.usuario;

          this.formEditarCliente.setValue({
            'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
            'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
            'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
            'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
            'direccion':this.clienteCard[0].direccion,
            'telefonos': this.clienteCard[0].celular,
            'celular':this.clienteCard[0].celular,
            'email':this.clienteCard[0].email,
            'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo        
      
          })

          this.dni = this.clienteCard[0].ruc;
          // this.banderaCardCliente = true;
          this.formCliente.reset();

          this.cerrarModal();
         
        }

        })

  
  }

  registrarCliente(form:any){

    const dato1 = localStorage.getItem("Inflogueo");
    let datos;
      if(dato1) {
        this.datosLocalStorage=JSON.parse(dato1);
        datos = this.datosLocalStorage; 
        }else console.log("ERROR");
  
        let uid = datos.empleado[0].empleado_id;
        // console.log(uid);
  
    // console.log('Lo que trae el form', form);
    form.razonsocial = form.nombres+' '+form.apellidos;
    // form.tipoCli
    let vendedor_id = uid;
    let diasCredito = "0";
    let cupo_credito ="0";
    let es_pasaporte = this.tipoDocumento;
  
    let json = {
      cedula:form.cedula, nombres:form.nombres, apellidos: form.apellidos, razonsocial: form.razonsocial, direccion:form.direccion,
      telefonos: form.telefonos, email: form.email, celular:form.celular, tipoCli: form.tipoCli, vendedor_id:vendedor_id,diasCredito,cupo_credito,es_pasaporte
    }
    // console.log(json);
  
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Creando Cliente',
      text:'Se está creando el cliente, espere por favor' ,
      });
      Swal.showLoading();
    
    this.allService.postALCommon( json,'registrar_cliente').subscribe((data:any)=>{
  
     
      // console.log(data);
      if(data.rta == true){
        Swal.close();
        Swal.fire({
          allowOutsideClick:false,
          icon:'success',
          title:'Cliente creado',
          text:'Cliente se ha creado con éxito' ,
          timer:1500,
          showConfirmButton:false
          });
          this.cerrarMODAL3();
          this.banderaClienteCreado = true;
  
          this.allService.getCliente(form.cedula).then((data: any) => {
            this.clienteCard = data.clientes;
  
            this.seleccionarCliente(this.clienteCard[0]);
          })
  
          
  
  
      }else{
        Swal.fire({
          allowOutsideClick:false,
          icon:'warning',
          title:'Cliente no guardado',
          text:'Cliente ya se encuentra registrado' ,
          timer:2000,
          showConfirmButton:false
          });
      }
      
    })
  }

  formCedulaCliente = new FormGroup({
    cliente_id :new FormControl('')
  })

  cambiarUsuario(form:any){
    cerrarModal1('#modalEO');
    let ced = form.PersonaComercio_cedulaRuc

    let json = {cliente_id:ced}

    
    // console.log(json)
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Usuario de Orden',
      text:'Se está cambiando el usuario a la orden, espere' ,
      });
      Swal.showLoading();

    this.allService.postG('orden_abierta/edit_cliente/id/'+this.idOrden,json).subscribe((data:any)=>{
        // console.log(data);
        if(data.rta == true){
          Swal.close
          Swal.fire({
            allowOutsideClick:false,
            icon:'info',
            title:'Cliente actualizado',
            text:'Se ha actualizado el cliente de la orden' ,
            timer:800
            });
            Swal.showLoading();
          this.cerrarMODAL2();
  setTimeout(() => {
    // location.reload();
    // this.listarTodos1();
    this.dataTarjetas();
   
   }, 200);
         
          
        }
        
    })
    
  }
  


scrollToElement($element:any): void {
  // console.log($element);
  setTimeout(() => {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    // this.listarTodos1();    
   }, 800);
}

presentarCard(id:any){
  this.banderaCard = false;
}

// ======================================== BUSCAR ORDEN =====================================================

buscarOrden(){
  filter();
}

// ===================================== CAMBIAR ESTADO ORDEN ABIERTA ========================================

enviarIdOrden(id:any){
this.idOrden = id;
this.enviarCI(this.idOrden);


}



cambiarEstadoOrden(){   
  cerrarModal1('#modalEO');        
  Swal.fire({
    title: 'Enviar a Espera',
    text: '¿Está seguro de enviar la orden a espera? ' ,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#B5B5B5',
    cancelButtonColor: '#F51F36',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Si, enviar ahora!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.allService.getAl('estado/en_espera?id='+this.idOrden).then((data) => {
      
  
       
        Swal.fire({ title: 'Orden en espera!',
        text:  'Se ha enviado la orden a espera',
        showConfirmButton:false,
        icon: 'success',timer:1800});
        
      })
      setTimeout(() => {  
        // this.refresh();
        // this.listarTodos1()
        this.dataTarjetas();
       }, 800);

    }else {
    }
  })
}

refresh(): void {
  this._router.navigateByUrl("#/planeador/ver_planeador", { skipLocationChange: true }).then(() => {
  // console.log(decodeURI(this._location.path()));
  this._router.navigate([decodeURI(this._location.path())]);
  });
}



cerrarPlaneador(event:any){

  this.banderaCard = event;
  setTimeout(() => {
      
    // this.listarTodos1(); 
    this.dataTarjetas();   
   }, 200);
  //  setTimeout(() => {
  //   this.refresh();  
  //  }, 1000);
}

// ================================= VISTA TECNICOS =======================================

vistaPorTecnicos(){

  this.elements = [];
  this.dataCorrectivo =[];
  this.dataPreventivo =[];
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Cargando Vista por Técnicos',
    text:'Se está cargando las órdenes, espere por favor' ,
    });
    Swal.showLoading();
  this.allService.getSimple('orden_abierta/planeador_tecnico').then((data:any)=>{

    
    setTimeout(() => {
    
      this.vistaTecnicos = data;
      slider6();
      // console.log("SI ENTRA AQYi");
      
     }, 500);
    // this.vistaTecnicos = data;
    Swal.close();
    // console.log(this.vistaTecnicos);
   
    this.banderaVistaDefecto = false;
    this.banderaVistaTecnico = true;

  })
  
  // console.log(this.elements);
  this.estadoVista = 2;


  // console.log(this.elements);
}

}
