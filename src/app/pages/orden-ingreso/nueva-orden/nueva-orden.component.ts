import {Component,OnInit,ViewChild,ElementRef, TemplateRef} from '@angular/core';

// LIBRERIAS
import Swal from 'sweetalert2';
import {FormGroup,FormControl,Validators,FormBuilder,FormArray} from '@angular/forms';
// MODELOS
import { VehiculoModel } from '../../Modelos/vehiculo.model';
import { ServicioModel } from '../../Modelos/servicio.model';
import { EstadoModel } from '../../Modelos/estado.model';

// SERVICIOS
import { AllServiceService } from 'src/app/services/all-service.service';
import { DatePipe,  Location, TitleCasePipe  } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../Modelos/cliente.model';
import { AutoModel } from '../../Modelos/Auto.model';
import { combineLatest } from 'rxjs';

// declare function arregloValoresAuto(i: any, tam: any): any;
// declare function arregloValoresAuto2(i: any, tam: any): any;
declare function valSeleccionado(i:any):any;
declare function valSeleccionadoT(i:any,tam: any):any;

@Component({
  selector: 'app-nueva-orden',
  templateUrl: './nueva-orden.component.html',
  styleUrls: ['./nueva-orden.component.scss'],
})
export class NuevaOrdenComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild('inputFile1') myInputVariable1: ElementRef;
  @ViewChild('inputFile2') myInputVariable2: ElementRef;
  @ViewChild('inputFile3') myInputVariable3: ElementRef;

  @ViewChild("modalSelecionarCliente") modalSelecionarCliente: TemplateRef<any> | undefined;
  @ViewChild("modalSelecionarCliente2") modalSelecionarCliente2: TemplateRef<any> | undefined;
  @ViewChild("modalSelecionarAuto") modalSelecionarAuto: TemplateRef<any> | undefined;
  @ViewChild("modalControl") modalControl: TemplateRef<any> | undefined;
  @ViewChild("modalRegistrarCliente") modalRegistrarCliente: TemplateRef<any> | undefined;
  @ViewChild("modalRegistrarClienteCARD") modalRegistrarClienteCARD: TemplateRef<any> | undefined;
  @ViewChild("modalPUNTOVENTA") modalPUNTOVENTA: TemplateRef<any> | undefined;

  //MODAL
  modal:any;
  //Tabla Elegir usuario
  page = 1;
  pageSize = 5;
  collectionSize:any;
  cliente : Cliente[];
  //Tabla Elegir usuario
  page1 = 1;
  pageSize1 = 5;
  collectionSize1:any;
  auto : AutoModel[];
  // listaVehiculos:any=[];
  autos:any=[];

  bandera: any;
  secuencia: any;
  secuenciaFinal: any;
  id: any;
  atributos: any = [];
  tamAtributos:any;

  prioridades: any = [];
  tecnicos: any = [];
  servicios: any = [];
  datosVehiculo: any = [];
  clientes: any = [];
  estados: any = [];

  // VALORES DE LOS IMPUTS PARA EL PDF
 
  prioridad: any;
  tec: any;
  serv: any;

  //USUARIO CEDULA O RUC
  dni:any;

  // BANDERAS IMPUTS
  banderaAutoExiste=false;
  banderaAutoCrea = false;
  banderaCardCliente:any;
  banderaIconTrash:any;

  banderaPaginacion:any;
  banderaPaginacion1:any;
  banderaCliente = false;
  banderaValidarDOC = true;
  banderaClienteCreado =false;

  // BANDERA BUTTON VER VEHICULOS
  banderaTieneVehiculos:boolean;

  banderaCarroNoExiste = false;

  //REGISTRAR CLIENTE 
  cedulaGlobal='';
  tipoDocumento:any;


  //Usuario ID
  public user_id:any;
  puntoventa_id:any;
  datosLocalStorage:any;

  // Tamaño TyS
  tamTys:any;
  clienteCard: any = [];
  previous: string;

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
  problema:any;

  //datos Defecto

  priDefectoID='';
  priDefectoNombre='';

  tecDefectoID='';
  tecDefectoNombre='';

  servDefectoID:any;
  servDefectoNombre:any;
  //card Cliente creado

  cardClienteCreado:any=[];


  encerado :any;
  url7 = 'orden_abierta';

  public images = {
    front : '',
    right : '',
    back  : '',
    left  : ''
  };

  i: VehiculoModel;
  i2: ServicioModel;
  i3: EstadoModel;

  // CONTROLES CHECK

  controles:any=[];
  evaluacion:any=[];

  valBueno:any;
  valMalo:any;

  tamVAL:any;
  arregloCategoria:any=[];
  arregloCalificacion:any=[];
  banderaCheckIN:any;

  //tipoUsuario - Cliente

  tipoUsuario:any=[];
  tipoUsuarioDefecto:any;
  tipoUsuarioID:any;
  
  //Banderas Vehiculo y cliente

  bTV:boolean;
  bTC:boolean;
  bPV:boolean;
  bPC:boolean;

  opcionBusquedaPlaca:any;
  opcionBusquedaRUC:any;

 
  puntosVenta:any=[];
  banderaPuntosVenta:any;

  constructor(
    private allService: AllServiceService,
    private fb: FormBuilder,
    private date: DatePipe,
    public _router: Router, public _location: Location,
    private modalService: NgbModal,
    private titleCasePipe: TitleCasePipe

  ) {

    // this.refreshClientes();
  }

  ngOnInit(): void {
this.funcionDatosLocalStorage();
this.enviarTipoCliente()

    this.celular;

    combineLatest ([
      this.allService.getAl('tecnico/todos'),
      this.allService.getAl('prioridad/activo_oa'),
      this.allService.getAl('producto/activo'),
      this.allService.getAl('estado/activo')

    ]).subscribe( ([tecnicos,prioridad,servicios, estado])=>{
      this.tecnicos = tecnicos;
      this.prioridades = prioridad;
      this.servicios = servicios;
      this.estados = estado;

      this.priDefectoNombre = this.prioridades[0].nombre;
      this.priDefectoID = this.prioridades[0].pri_id;

      this.tecDefectoNombre = this.tecnicos[0].nombres+' '+ this.tecnicos[0].apellidos;
      this.tecDefectoID = this.tecnicos[0].id;

      this.servDefectoNombre = this.servicios[0].tipo;
      this.servDefectoID = this.servicios[0].id;

    })

    // setTimeout(() => {
    //   this.enviarTecnico();
    //   this.enviarServicio();
    //   this.enviarEstado();
    //   this.enviarPrioridad();
    //   this.enviarTipoCliente()
    //   this.elegirTipoBusqueda();
    //   // this.onlyPlaca();
    //   // this.onlyRUC();
    //  }, 400);
     this.secuencia = this.secuenciaFinal;
     this.getSecuencia();
  }


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
      // console.log(this.cliente);
      
  }

  refreshAutos() {
    const PRS1 :AutoModel[]=this.autos;  
    this.collectionSize1 = PRS1.length;
    if(this.collectionSize1 <= this.pageSize1){
      this.banderaPaginacion = false;
    }else{
      this.banderaPaginacion = true;
    }
      this.auto = PRS1
      .map((pys: any, i: number) => ({id: i + 1, ...pys}))
      .slice((this.page1 - 1) * this.pageSize1, (this.page1 - 1) * this.pageSize1 + this.pageSize1);    
      // console.log('PS',this.ps); 
  }


  refresh(): void {
    this._router.navigateByUrl("#/orden/nueva_orden", { skipLocationChange: true }).then(() => {
    this._router.navigate([decodeURI(this._location.path())]);
    });
  }

   locationreload() {
    location.reload();
  }

  // =======================================FORMULARIOS===========================================

  // FORM BUSCAR AUTO

  formAuto = new FormGroup({
    placa: new FormControl('', [ Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern('[a-z A-Z]{2,3}[0-9]{3,4}||[a-z A-Z]{1}')]) });
  
    formAuto2 = new FormGroup({
    placa2: new FormControl('', [ Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern('[a-z A-Z]{2,3}[0-9]{3,4}||[a-z A-Z]{1}')]) });
  // placa: new FormControl('', [ Validators.required]) });

  formCliente = new FormGroup({PersonaComercio_cedulaRuc: new FormControl('', [Validators.required, Validators.pattern('[a-z A-z]{3,30}||[0-9]{8-13}')]) });
  formCliente2 = new FormGroup({PersonaComercio_cedulaRuc: new FormControl('', [Validators.required, Validators.pattern('[a-z A-z]{3,30}||[0-9]{8-13}')]) });

  // FORM SELECCIONAR CLIENTE
  formElegirCliente = new FormGroup({});

  //FORM CORREO

  formCorreo = new FormGroup({
  sender_mail:new FormControl('enviar.correos.developer@gmail.com'),
  sender_password: new FormControl('developer.correos'),
  receiver: new FormControl(''),
  entity_mail: new FormControl(''),
  subject: new FormControl('Envío de Orden de Ingreso de vehículo'),
  text: new FormControl(''),
  body:new FormControl('')
  });

  // FORM NUEVA ORDEN
  formNuevaOrden = new FormGroup({
    cliente_id    : new FormControl(''),
    equipoattr_id : new FormControl(),
    valor         : new FormControl(),
    problema      : new FormControl('', Validators.required),
    tecnico_id    : this.fb.array(['']),
    servicio_id   : this.fb.array(['']),
    items: new FormControl(''),
    revision: new FormControl(''),
    secuencia     : new FormControl(''),
    prioridad_id  : new FormControl(''),
    evidencias    : this.fb.array([]),
    puntoventa_id: new FormControl(''),
  });


  get f() {
    return this.formAuto.controls;
  }
  get f1() {
    return this.formCliente.controls;
  }
  get f11() {
    return this.formCliente2.controls;
  }
  get f2() {
    return this.formNuevaOrden.controls;
  }

  get tecnico() {
    return this.formNuevaOrden.get('tecnico_id') as FormArray;
  }
  get servicio() {
    return this.formNuevaOrden.get('servicio_id') as FormArray;
  }
// =======================MODAL SELECCIONAR CLIENTE =============================


abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent, {size:'lg'});
}

cerrarModal(){
  this.modal.close();
  // this.autos =[];
}
cerrarModal2(){
  this.modal.close();
  this.formValidarIdentifiacion.reset();
  this.formRegistrarCliente.reset();
}

// =====================AGREGAR TECNICOS Y SERVICIOS ============================

  agregarTS() {
    this.tecnico.push(this.fb.control(['']));
    this.servicio.push(this.fb.control(''));
    this.banderaIconTrash = true;

  }

  borrarTS(i:any, ser:any) {
    let tam = ser.length-1;
    let idex = 1;
    if(tam != idex){
      this.banderaIconTrash = true;
    }else{
      this.banderaIconTrash = false;
    }
    this.tecnico.removeAt(i);
    this.servicio.removeAt(i);
  }

  enviarAtributo() {
    this.allService.getAl('atributo/activo').then((data) => {
      this.atributos  = data;
      this.tamAtributos = this.atributos.length;
    });
  }

  enviarTipoCliente(){
    this.allService.getSimpleCommon('get_clientetipo').then((data:any)=>{
      this.tipoUsuario = data;
      // console.log(this.tipoUsuario);
      
      this.tipoUsuarioDefecto = this.tipoUsuario[0].tipo;
      this.tipoUsuarioID = this.tipoUsuario[0].idclientetipo;    
    })
  }
  // enviarPrioridad() {
  //   this.allService.getAl('prioridad/activo_oa').then((data) => {
  //     this.prioridades  = data;
  //     this.priDefectoNombre = this.prioridades[0].nombre;
  //     this.priDefectoID = this.prioridades[0].pri_id;
  //   });
  // }


  // enviarTecnico() {
  //   this.allService.getAl('tecnico/todos').then((data) => {
  //   this.tecnicos = data;
  //   this.tecDefectoNombre = this.tecnicos[0].nombres+' '+ this.tecnicos[0].apellidos;
  //   this.tecDefectoID = this.tecnicos[0].id;
  //   });
  // }

  // enviarServicio() {
  //   this.allService.getAl('producto/activo').then((data) => {
  //     this.servicios = data;
  //     this.servDefectoNombre = this.servicios[0].tipo;
  //     this.servDefectoID = this.servicios[0].id;
  //   });
  // }
  // enviarEstado() {
  //   this.allService.getAl('estado/activo').then((data) => {
  //     this.estados = data;
  //   });
  // }

  getSecuencia() {
    this.allService.getAl('orden_abierta/secuencia').then((data: any) => {
      if(data==false){
        this.secuencia = 1;
      }else{
        this.secuencia= parseInt(data.secuencia) + 1;
      }
    });
    return this.secuencia;
  }

  elegirTipoBusqueda(){
    //  this.opcionBusquedaPlaca = this.onlyPlaca();
    //  this.opcionBusquedaRUC = this.onlyRUC();
    //  if(this.opcionBusquedaPlaca == 1){
    //   console.log('Cuando busca por placa');
      
    //  }else if(this.opcionBusquedaRUC == 2){
    //   console.log('Cuando busca por RUC');
    //  }
    
  }


  getNombreEmpresa(){
    const dato = localStorage.getItem("InfEmpresa");
  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);

  }else console.log("ERROR");

  let infAcceso =  this.datosLocalStorage;

  this.nombreEmpresa = infAcceso[0].nombre;

  return this.nombreEmpresa;
  }
  // armarPDF(){

  // this.nombreEmpresa = this.getNombreEmpresa();
  //   let fecha = new Date;
  //   this.fechaOrden = this.date.transform (fecha,'EEEE, dd/MM/yyyy','UTC' );
  //   this.formCorreo.get('receiver')?.setValue(this.correo);
  //     let t = this.formNuevaOrden.value.tecnico_id;
  //     let p = this.formNuevaOrden.value.prioridad_id;
  //     let s = this.formNuevaOrden.value.servicio_id;
  //     // console.log(t);
  //     for (let i = 0; i < this.tecnicos.length; i++) {
  //         if(t == this.tecnicos[i].id){
  //           this.tec = this.tecnicos[i].nombres+' '+ this.tecnicos[i].apellidos;
  //         }
  //     }
  //     // console.log(p);
  //     for(let j=0; j < this.prioridades.length; j++){
  //       if(p == this.prioridades[j].pri_id){
  //         this.prioridad = this.prioridades[j].nombre;
  //       }
  //     }

  //     for (let k = 0; k < this.servicios.length ; k++) {
  //       if(s == this.servicios[k].id){
  //         this.serv = this.servicios[k].tipo;
  //       }
  //     }

  // }

// =============================METODO BUSCAR VEHICULO ==============================

obtenerVehiculo(form: any) {


  this.tamAtributos = 0;
  this.formNuevaOrden.get('valor')?.setValue('');
  form.valor='';
  this.encerado = form.valor;
  // console.log('enveradi' ,this.encerado);


  let placa = form.placa;
  this.formAuto.reset();
  // console.log('esta es la placa', placa);

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando vehículo',
    text:'Se está buscando su vehículo, espere por favor' ,
    });
    Swal.showLoading();
  this.allService.getAl('vehiculo/by_placa?placa=' + placa).then((data: any) => {
    // console.log(' respuesta ', data);
    if (data.rta == true || data.length > 0) {
      Swal.close();
      this.banderaAutoExiste = true;
      this.banderaAutoCrea= false;
      this.datosVehiculo = data;

      for (let i = 0; i < this.datosVehiculo.length; i++) {
          if(this.datosVehiculo[i].nombreattr == 'PLACA'){
            this.placa = this.datosVehiculo[i].valor;
          }
          if(this.datosVehiculo[i].nombreattr == 'MARCA'){
            this.marca = this.datosVehiculo[i].valor;
          }
          if(this.datosVehiculo[i].nombreattr == 'MODELO'){
            this.modelo = this.datosVehiculo[i].valor;
          }

      }

    } else  {
      // Swal.fire({
      //   icon: 'error',
      //   title: '¡Error!',
      //   text: 'Placa no encontrada, registre vehículo ahora',
      //   timer: 1100,
      // });
      Swal.close();
      this.banderaAutoExiste = false;
      this.banderaAutoCrea = true;
      this.enviarAtributo();

    }
  });
}

  // obtenerVehiculo(form: any) {

  //   this.tamAtributos = 0;
  //   this.formNuevaOrden.get('valor')?.setValue('');
  //   form.valor='';
  //   this.encerado = form.valor;
  //   let placa = form.placa;
  //   this.formAuto.reset();
  //   Swal.fire({
  //     allowOutsideClick:false,
  //     icon:'info',
  //     title:'Buscando vehículo',
  //     text:'Se está buscando su vehículo, espere por favor' ,
  //     });
  //     Swal.showLoading();
  //     let i:any;
  //   this.allService.getVC('vehiculo/usuario_por_placa?buscar='+placa+'&tipo=placa',i).subscribe((data: any) => {
  //     // this.bTC = true;
  //     // this.bTV = true;
  //     // this.bPC = true;
  //     if(this.bTC == true && this.bTV == true && this.bPC == true){
  //       console.log("ACA CUANDO QUIERO CAMBIAR DE AUTO");
  //       if (data.rta_ve == true || data.length > 0) {
  //         Swal.close();
  //         this.banderaAutoExiste = true;
  //         this.banderaAutoCrea= false;
  //         this.datosVehiculo = data.vehiculo;
  //         // this.clienteCard  = data.usuario;
  
  //         // this.formEditarCliente.setValue({
  //         //   'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //         //   'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //         //   'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //         //   'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //         //   'direccion':this.clienteCard[0].direccion,
  //         //   'telefonos': this.clienteCard[0].celular,
  //         //   'celular':this.clienteCard[0].celular,
  //         //   'email':this.clienteCard[0].email,
  //         //   'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
  //         // })
  //         // =======================================
  //           this.bPV = true;
  //           this.bTV = true;
  //           this.bTC = true;
  
  //         // =======================================
  
  //         this.dni = this.clienteCard[0].ruc;
  //         this.banderaCardCliente = true;
  //         this.formCliente.reset();
  
  //       } else  {
  //         Swal.close();
  //         this.banderaAutoExiste = false;
  //         this.banderaAutoCrea = true;
  
  //       }
  //     }else{

     



  //     if (data.rta_ve == true || data.length > 0) {
  //       Swal.close();
  //       this.banderaAutoExiste = true;
  //       this.banderaAutoCrea= false;
  //       this.datosVehiculo = data.vehiculo;
  //       this.clienteCard  = data.usuario;

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
  //       // =======================================
  //         this.bPV = true;
  //         this.bTV = true;
  //         this.bTC = true;

  //       // =======================================

  //       this.dni = this.clienteCard[0].ruc;
  //       this.banderaCardCliente = true;
  //       this.formCliente.reset();

  //     } else  {
  //       Swal.close();
  //       this.banderaAutoExiste = false;
  //       this.banderaAutoCrea = true;

  //     }
  //   }
  //   },(err)=>{
  //     // alert("CAMBIO")
  //     Swal.close();

  //     this.banderaCarroNoExiste = true;
  //     this.banderaAutoExiste = false;
  //     this.banderaAutoCrea = true;
  //     // this.banderaCardCliente = false;

  //             // =======================================
  //             this.bPV = true;
  //             this.bTV = false;
  //             this.bTC = false;
    
  //           // =======================================

  //     // console.log(" valor bandera cuando no existe => ", this.banderaCarroNoExiste);
  //     this.enviarAtributo();
  //   });
  // }


  

  // =============================METODO BUSCAR CLIENTE ==============================

  obtenerCliente(form: any) {

    this.banderaCardCliente = false;
    this.formCliente.reset();
    let dni = form.PersonaComercio_cedulaRuc;
    if( (form.PersonaComercio_cedulaRuc).length >3){
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Buscando cliente',
      text:'Se está buscando al cliente, espere por favor' ,
      });
      Swal.showLoading();
    this.allService.getCliente(dni).then((data: any) => {
      // console.log(data);
      
      if (data.rta == true) {
        Swal.close();
        if(data.clientes.length == 1){
          this.clienteCard = data.clientes;

         
          
       
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
          this.banderaCardCliente = true;
          this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
        }else {
        this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
        this.formCliente.reset();
        this.clientes = data.clientes;
        this.refreshClientes();
        let cel = this.clientes[0].celular;
        this.celular = cel;
      }
      } else if (data.rta == false) {
        // Swal.fire({
        //   icon: 'error',
        //   title: '¡Error!',
        //   text: 'No se encontró al cliente',
        //   timer:2000
        // });
        Swal.close();
        this.validarDocumento(form);
      }
    });
  }
  else{
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, campo vacio!',
      timer:2000
    });
    this.formCliente.controls['PersonaComercio_cedulaRuc'].setValue('');
  }
  }


  // obtenerCliente(form: any) {

  //   this.banderaCardCliente = false;
  //   // this.banderaAutoCrea= false;
  //   this.formCliente.reset();
  //   let dni = form.PersonaComercio_cedulaRuc;
  //   if( (form.PersonaComercio_cedulaRuc).length >2){


  //   Swal.fire({
  //     allowOutsideClick:false,
  //     icon:'info',
  //     title:'Buscando cliente',
  //     text:'Se está buscando al cliente, espere por favor' ,
  //     });
  //     let i:any
  //     Swal.showLoading();
  //     this.allService.getVC('vehiculo/usuario_por_placa?buscar='+dni+'&tipo=ci',i).subscribe((data: any) => {
  //     // console.log(data);
  //     if(this.bPV == true && this.bTV == true && this.bTC == true){
  //       // console.log("ENTRA AC");
  //       if (data.rta_us == true) {

  //         Swal.close();
  //         // this.clientes = data.clientes;
  //         this.clientes = data.usuario;
  //         if(this.clientes.length>=2){
  //           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //           this.formCliente.reset();
  //           this.refreshClientes();
  //           let cel = this.clientes[0].celular;
  //           this.celular = cel;
  //         }
  //         else if(this.clientes.length=1){
  //           this.clienteCard  = this.clientes;
  
  //           this.formEditarCliente.setValue({
  //             'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //             'direccion':this.clienteCard[0].direccion,
  //             'telefonos': this.clienteCard[0].celular,
  //             'celular':this.clienteCard[0].celular,
  //             'email':this.clienteCard[0].email,
  //             'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
             
        
  //           })
  
  //           this.dni = this.clienteCard[0].ruc;
  //           this.banderaCardCliente = true;
  //           this.formCliente.reset();
  //           this.tamAtributos = 0;
  //           this.formNuevaOrden.get('valor')?.setValue('');
  //           form.valor='';
  //           this.encerado = form.valor;
  
  //           // if(this.banderaCarroNoExiste == true){
  //           //   this.banderaAutoCrea= false;
  //           // }else{
  //           //   this.banderaAutoExiste = true;
  //           // }
        
  
  //           // this.banderaAutoExiste = true;
  //           // this.banderaAutoCrea= false;
  
  //           // if(data.vehiculo.length == 0){
  //           //   this.enviarAtributo();
  //           //   this.banderaAutoExiste = false;
  //           //   this.banderaAutoCrea = true;
  //           //   this.banderaCardCliente = true;
              
  
  //           // }else{
  //           //   this.datosVehiculo = data.vehiculo;
  //           //   // console.log('this. datos vehiculo',this.datosVehiculo);
  //           // }
  //         }
         
        
  //       }else if (data.rta == false) {
  
  //         Swal.close();
  //         this.validarDocumento(form);
  //       }
  //       // this.bPV = true;
  //       // this.bTV = false;
  //       // this.bTC = false;
  //     } else if(this.bPV == true && this.bTV == false && this.bTC == false){
  //       // console.log("Entra aca cuando no hay vehioculo");
  //       if (data.rta_us == true) {

  //         Swal.close();
  //         // this.clientes = data.clientes;
  //         this.clientes = data.usuario;
  //         if(this.clientes.length>=2){
  //           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //           this.formCliente.reset();
  //           this.refreshClientes();
  //           let cel = this.clientes[0].celular;
  //           this.celular = cel;
  //         }
  //         else if(this.clientes.length=1){

  //           console.log("ENTRA AAUI CUANDO CREA VEHICULO");
            
  //           this.clienteCard  = this.clientes;
  
  //           this.formEditarCliente.setValue({
  //             'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //             'direccion':this.clienteCard[0].direccion,
  //             'telefonos': this.clienteCard[0].celular,
  //             'celular':this.clienteCard[0].celular,
  //             'email':this.clienteCard[0].email,
  //             'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
             
        
  //           })
  
  //           this.dni = this.clienteCard[0].ruc;
  //           this.banderaCardCliente = true;
  //           this.formCliente.reset();
  //           this.banderaAutoCrea= true;
  //         }
         
        
  //       }else if (data.rta == false) {
  
  //         Swal.close();
  //         this.validarDocumento(form);
  //       }
  //     }else{

  //     if (data.rta_us == true) {

  //       Swal.close();
  //       // this.clientes = data.clientes;
  //       this.clientes = data.usuario;
  //       if(this.clientes.length>=2){
  //         this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //         this.formCliente.reset();
  //         this.refreshClientes();
  //         let cel = this.clientes[0].celular;
  //         this.celular = cel;
  //       }
  //       else if(this.clientes.length=1){

  //         console.log("CASO IDEAL");
          
  //         this.clienteCard  = this.clientes;

  //         this.formEditarCliente.setValue({
  //           'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //           'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //           'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //           'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //           'direccion':this.clienteCard[0].direccion,
  //           'telefonos': this.clienteCard[0].celular,
  //           'celular':this.clienteCard[0].celular,
  //           'email':this.clienteCard[0].email,
  //           'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
  //         })

  //         // ===========================

  //         this.bTC = true;
  //         this.bTV = true;
  //         this.bPC = true;

  //         // ===========================

  //         this.dni = this.clienteCard[0].ruc;
  //         this.banderaCardCliente = true;
  //         this.formCliente.reset();
  //         this.tamAtributos = 0;
  //         this.formNuevaOrden.get('valor')?.setValue('');
  //         form.valor='';
  //         this.encerado = form.valor;

  //         if(this.banderaCarroNoExiste == true){
  //           this.banderaAutoCrea= false;
  //         }else{
  //           this.banderaAutoExiste = true;
  //         }
      

  //         // this.banderaAutoExiste = true;
  //         // this.banderaAutoCrea= false;

  //         if(data.vehiculo.length == 0){
  //           this.enviarAtributo();
  //           this.banderaAutoExiste = false;
  //           this.banderaAutoCrea = true;
  //           this.banderaCardCliente = true;
            

  //         }else{
  //           this.datosVehiculo = data.vehiculo;
  //         }
  //       }
       
      
  //     }else if (data.rta == false) {

  //       Swal.close();
  //       this.validarDocumento(form);
  //     }
  //   }
  //   },(err)=>{
  //     Swal.close();
  //     // console.log("ENTRA ACA");
  //     this.allService.getCliente(dni).then((data: any) => {
  //       if(this.bPV == true && this.bTV == true && this.bTC == true){
  //         console.log("ENTRA AC 2");
  //         if (data.rta == true) {

  //           Swal.close();
  //           this.clientes = data.clientes;
  //           if(this.clientes.length>=2){
  //             this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //             this.formCliente.reset();
  //             this.refreshClientes();
  //             let cel = this.clientes[0].celular;
  //             this.celular = cel;
  //           }
  //           else if(this.clientes.length=1){                     
  //             this.clienteCard  = this.clientes;
  //             if(this.clienteCard[0].nombres ==" FINAL"){
  
  //               this.formEditarCliente.setValue({
  //                 'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
  //                 'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //                 'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //                 'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //                 'direccion':this.clienteCard[0].direccion,
  //                 'telefonos': this.clienteCard[0].celular,
  //                 'celular':this.clienteCard[0].celular,
  //                 'email':this.clienteCard[0].email,
  //                 'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
  //               })
  
  //               this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc
  
  //               this.formAuto.reset();
  //               this.banderaAutoCrea = true;
  
  //               this.tamAtributos = 0;
  //               this.formNuevaOrden.get('valor')?.setValue('');
  //               form.valor='';
  //               this.encerado = form.valor;
  //               // this.banderaCardCliente = true;
  //               // this.banderaAutoExiste = false;
  //               // console.log("FINAL");
  //               this.enviarAtributo();
                
  
  //             }else if (this.clienteCard[0].nombres !="FINAL"){
  //               // console.log("caso 2");
                
  //             this.formEditarCliente.setValue({
  //               'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
  //               'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //               'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //               'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //               'direccion':this.clienteCard[0].direccion,
  //               'telefonos': this.clienteCard[0].celular,
  //               'celular':this.clienteCard[0].celular,
  //               'email':this.clienteCard[0].email,
  //               'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
               
          
  //             })
    
  //             this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
    
    
  //             this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
  //               // console.log(data);
          
  //               if (data.rta_us == true) {
  //                 let cedula = data.usuario[0].ruc
  //                 this.dni = cedula
  //                 // console.log("========== cedula ep Pao", this.dni);
  //               console.log("ENTRA ACA final");
                
  //                 this.banderaCardCliente = true;
  //                 this.formCliente.reset();
  //                 this.tamAtributos = 0;
  //                 this.formNuevaOrden.get('valor')?.setValue('');
  //                 form.valor='';
  //                 this.encerado = form.valor;
                  
  //               }
  //             })
  //           }
  //           }
           
    
      
          
  //         }else if (data.rta == false) {
    
  //           Swal.close();
  //           this.validarDocumento(form);
  //         }
  //       } 
        
       
  //       else{

  //       console.log("LOG ACA");
        
  //       if (data.rta == true) {

  //         Swal.close();
  //         this.clientes = data.clientes;
  //         if(this.clientes.length>=2){
  //           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //           this.formCliente.reset();
  //           this.refreshClientes();
  //           let cel = this.clientes[0].celular;
  //           this.celular = cel;
  //         }
  //         else if(this.clientes.length=1){   
  //           console.log("entra  caundo es igual a 1");
                              
  //           this.clienteCard  = this.clientes;
  //           if(this.clienteCard[0].nombres ==" FINAL"){

  //             this.formEditarCliente.setValue({
  //               'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
  //               'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //               'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //               'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //               'direccion':this.clienteCard[0].direccion,
  //               'telefonos': this.clienteCard[0].celular,
  //               'celular':this.clienteCard[0].celular,
  //               'email':this.clienteCard[0].email,
  //               'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
  //             })

  //             this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc

  //             this.formAuto.reset();
  //             this.banderaAutoCrea = true;

  //             this.tamAtributos = 0;
  //             this.formNuevaOrden.get('valor')?.setValue('');
  //             form.valor='';
  //             this.encerado = form.valor;
  //             this.banderaCardCliente = true;
  //             this.banderaAutoExiste = false;
  //             // console.log("FINAL");
  //             this.enviarAtributo();
              

  //           }else if (this.clienteCard[0].nombres !="FINAL"){
  //             console.log("caso 2");
              
  //           this.formEditarCliente.setValue({
  //             'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
  //             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //             'direccion':this.clienteCard[0].direccion,
  //             'telefonos': this.clienteCard[0].celular,
  //             'celular':this.clienteCard[0].celular,
  //             'email':this.clienteCard[0].email,
  //             'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
             
        
  //           })
  
  //           this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
  
  
  //           this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
  //             // console.log(data);
        
  //             if (data.rta_us == true) {
  //               let cedula = data.usuario[0].ruc
  //               this.dni = cedula
  //               // console.log("========== cedula ep Pao", this.dni);
              
  //               this.banderaCardCliente = true;
  //               this.formCliente.reset();
  //               this.tamAtributos = 0;
  //               this.formNuevaOrden.get('valor')?.setValue('');
  //               form.valor='';
  //               this.encerado = form.valor;
  //               this.banderaAutoExiste = true;
  //               this.datosVehiculo = data.vehiculo
  //               // if(this.banderaCarroNoExiste == true){
  //               //   this.banderaAutoCrea= false;
  //               // }else{
  //               //   this.banderaAutoExiste = true;
                  
  //               // }
            
               
      
  //               // if(data.vehiculo.length == 0){
  //               //   this.enviarAtributo();
  //               //   this.banderaAutoExiste = true;
  //               //   this.banderaAutoCrea = false;
  //               //   this.banderaCardCliente = true;
                  
      
  //               // }else{
  //               //   this.datosVehiculo = data.vehiculo;
  //               //   // console.log('this. datos vehiculo',this.datosVehiculo);
  //               // }


  //             }
  //           })
  //         }
  //         }
         
  
    
        
  //       }else if (data.rta == false) {
  
  //         Swal.close();
  
  
  //         this.validarDocumento(form);
  //       }
  //     }
  //     })

  //     // this.validarDocumento(form);
  //   });
  // }
  // else{
  //   Swal.fire({
  //     icon: 'error',
  //     title: '¡Error!',
  //     text: 'No se puede buscar, campo vacio!',
  //     showConfirmButton: false,
  //     timer:1500
  //   });
  //   this.formCliente.controls['PersonaComercio_cedulaRuc'].setValue('');
   
  // }
  // }

   // ============================= METODO SELECCIONAR CLIENTE ==============================
  
   seleccionarCliente(cliente: any) {
    this.clienteCard = [cliente];
    this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
    this.banderaCardCliente = true;
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
    this.cerrarModal();


  }
  // seleccionarCliente(cliente: any) {
  //   this.clienteCard = [cliente];
  //   let cel = this.clienteCard[0].celular;
  //   // ========================================================
  //   this.nombre = this.clienteCard[0].nombres+" "+this.clienteCard[0].apellidos;
  //   this.direccion = this.clienteCard[0].direccion;
  //   this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
  //   this.celular = cel;
  //   // console.log('CEL', this.celular);
  //   let correo = this.clienteCard[0].email;
  //   this.correo = correo;
  //   let i:any;

  //   this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {

  //     if(this.bPV == true && this.bTV == true && this.bTC == true){
  //       console.log("ENTRA AC 3");

  //       if (data.rta_us == true ) {
  
  //         // Swal.close();
  //         this.clienteCard  = data.usuario;

  //         this.formEditarCliente.setValue({
  //           'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //           'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //           'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //           'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //           'direccion':this.clienteCard[0].direccion,
  //           'telefonos': this.clienteCard[0].celular,
  //           'celular':this.clienteCard[0].celular,
  //           'email':this.clienteCard[0].email,
  //           'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo        
  //         })

  //         this.dni = this.clienteCard[0].ruc;
  //         this.banderaCardCliente = true;
  //         this.formCliente.reset();

  //         this.tamAtributos = 0;
  //         this.formNuevaOrden.get('valor')?.setValue('');
  //         let valor='';
  //         this.encerado = valor;
  //       }

      
  //     }else if(this.bPV == true && this.bTV == false && this.bTC == false){
  //       console.log("Entra aca cuando no hay vehioculo");
  //       if (data.rta_us == true) {

  //         Swal.close();
  //         // this.clientes = data.clientes;
  //         this.clientes = data.usuario;
  //         if(this.clientes.length>=2){
  //           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
  //           this.formCliente.reset();
  //           this.refreshClientes();
  //           let cel = this.clientes[0].celular;
  //           this.celular = cel;
  //         }
  //         else if(this.clientes.length=1){

  //           console.log("ENTRA AAUI CUANDO CREA VEHICULO");
            
  //           this.clienteCard  = this.clientes;
  
  //           this.formEditarCliente.setValue({
  //             'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //             'direccion':this.clienteCard[0].direccion,
  //             'telefonos': this.clienteCard[0].celular,
  //             'celular':this.clienteCard[0].celular,
  //             'email':this.clienteCard[0].email,
  //             'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo
             
        
  //           })
  
  //           this.dni = this.clienteCard[0].ruc;
  //           this.banderaCardCliente = true;
  //           this.formCliente.reset();
  //           this.banderaAutoCrea= true;
  //         }
         
        
  //       }else if (data.rta == false) {
  
  //         // Swal.close();
  //         // this.validarDocumento(form);
  //       }
  //     }else{
  //       if (data.rta_us == true ) {
  //         console.log("Caso final ");
          
  //         // Swal.close();
  //         this.clienteCard  = data.usuario;

  //         this.formEditarCliente.setValue({
  //           'PersonaComercio_cedulaRuc':this.clienteCard[0].ruc,
  //           'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  //           'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  //           'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  //           'direccion':this.clienteCard[0].direccion,
  //           'telefonos': this.clienteCard[0].celular,
  //           'celular':this.clienteCard[0].celular,
  //           'email':this.clienteCard[0].email,
  //           'clientetipo_idclientetipo':this.clienteCard[0].idclientetipo        
      
  //         })

  //         this.dni = this.clienteCard[0].ruc;
  //         this.banderaCardCliente = true;
  //         this.formCliente.reset();

  //         this.tamAtributos = 0;
  //         this.formNuevaOrden.get('valor')?.setValue('');
  //         let valor='';
  //         this.encerado = valor;
  //         if(this.banderaCarroNoExiste == true){
  //           this.banderaAutoCrea= true;
  //         }else{
  //           this.banderaAutoExiste = true;
  //         }

  //         if(data.vehiculo.length == 0){
  //           this.enviarAtributo();
  //           this.banderaAutoExiste = false;
  //           this.banderaAutoCrea = true;
  //           this.banderaCardCliente = true;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  //         }else{
  //           this.datosVehiculo = data.vehiculo;
  //           // console.log('this. datos vehiculo',this.datosVehiculo);
  //         } 
  //       }
  //     }
  //       })

  //   this.cerrarModal();
  // }

  // ======================================= CREAR ORDEN ================================================

  // CUANDO EL VEHICULO EXISTE

  arregloValoresAuto2(i:any, tam:any){
    let x;
    for (let j = 0; j < tam; j++) {
        // var x = document.getElementById("floatingInputNombre2" + i).value;
         x = (document.getElementById('floatingInputNombre2'+i) as HTMLInputElement).value;
    }
    return x;
  }
  arregloValoresAuto(i:any, tam:any){
    let x;
    for (let j = 0; j < tam; j++) {
        // var x = document.getElementById("floatingInputNombre2" + i).value;
         x = (document.getElementById('floatingInputNombre1'+i) as HTMLInputElement).value;
    }
    return x;
  }


  enviarDatosVehiculo(form:any) {

    let arrayIdAtributosAcrear = new Array(this.datosVehiculo.length);
    let arrayValoresaCrear = new Array(this.datosVehiculo.length);

    // console.log("si entra");
    
    for (let i = 0; i < this.datosVehiculo.length; i++) {
      arrayIdAtributosAcrear[i] = this.datosVehiculo[i].equipoattr_id;
      // arrayValoresaCrear[i] = arregloValoresAuto2(i, this.datosVehiculo.length);
      arrayValoresaCrear[i] = this.arregloValoresAuto2(i, this.datosVehiculo.length);
    }

    if(form.prioridad_id =='' && form.tecnico_id=='' && form.servicio_id ==''){
      form.prioridad_id = this.priDefectoID;
      form.tecnico_id = this.tecDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id !='' && form.tecnico_id=='' && form.servicio_id ==''){
      form.tecnico_id = this.tecDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id ==''){
      form.prioridad_id = this.priDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id =='' && form.tecnico_id=='' && form.servicio_id !=''){
      form.prioridad_id = this.priDefectoID;
      form.tecnico_id = this.tecDefectoID;
    }else

      if(form.prioridad_id !='' && form.tecnico_id !='' && form.servicio_id ==''){
        form.servicio_id = this.servDefectoID;
      }else
      if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id !=''){
        form.prioridad_id = this.priDefectoID;
      }
      else
      if(form.prioridad_id !='' && form.tecnico_id =='' && form.servicio_id !=''){
        form.tecnico_id = this.tecDefectoID;
      }
      else
      if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id ==''){
        form.prioridad_id = this.priDefectoID;
        form.tecnico_id = this.servDefectoID;
      }
    // else{

    // form.prioridad_id = form.prioridad_id;
    form.secuencia = this.secuencia
    form.cliente_id = this.dni;
    form.equipoattr_id = arrayIdAtributosAcrear;
    form.valor = arrayValoresaCrear;
    form.puntoventa_id = this.puntoventa_id;
    // console.log('enviarDatos', form);
    // }
  }

  // CUANDO EL VEHICULO NO EXISTE
  ingresarDatosVehiculo(form: any) {
    let arrayIdAtributosAcrear = new Array(this.atributos.length);
    let arrayValoresaCrear = new Array(this.atributos.length);

    for (let i = 0; i < this.atributos.length; i++) {
      arrayIdAtributosAcrear[i] = this.atributos[i].id;
      // arrayValoresaCrear[i] = arregloValoresAuto(i, this.atributos.length);
      arrayValoresaCrear[i] = this.arregloValoresAuto(i, this.atributos.length);

    }
    if(form.prioridad_id =='' && form.tecnico_id=='' && form.servicio_id ==''){
      form.prioridad_id = this.priDefectoID;
      form.tecnico_id = this.tecDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id !='' && form.tecnico_id=='' && form.servicio_id ==''){
      form.tecnico_id = this.tecDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id ==''){
      form.prioridad_id = this.priDefectoID;
      form.servicio_id= this.servDefectoID;
    }else

    if(form.prioridad_id =='' && form.tecnico_id=='' && form.servicio_id !=''){
      form.prioridad_id = this.priDefectoID;
      form.tecnico_id = this.tecDefectoID;
    }else

      if(form.prioridad_id !='' && form.tecnico_id !='' && form.servicio_id ==''){
        form.servicio_id = this.servDefectoID;
      }else
      if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id !=''){
        form.prioridad_id = this.priDefectoID;
      }
      else
      if(form.prioridad_id !='' && form.tecnico_id =='' && form.servicio_id !=''){
        form.tecnico_id = this.tecDefectoID;
      }
      else
      if(form.prioridad_id =='' && form.tecnico_id !='' && form.servicio_id ==''){
        form.prioridad_id = this.priDefectoID;
        form.tecnico_id = this.servDefectoID;
      }
    // else{

    // form.prioridad_id = form.prioridad_id;
    form.secuencia = this.secuencia
    form.cliente_id = this.dni;
    form.equipoattr_id = arrayIdAtributosAcrear;
    form.valor = arrayValoresaCrear;
    form.puntoventa_id = this.puntoventa_id;
    // console.log('Form ingresar datos', form);
  // }
}

  resetSave(form:any){

    this.getSecuencia();
    this.formNuevaOrden.reset();
    this.formAuto.reset();
    this.formCliente.reset();
    this.banderaCardCliente = false;
    this.banderaAutoExiste = false;
    this.banderaAutoCrea = false;
    this.bandera = true;
    let a = 0;
    this.secuencia = a + 1;
    this.secuenciaFinal = this.secuencia;
    form.tecnico_id.setValue= '';
    form.servicio_id.setValue = '';
    form.evidencias.setValue = '';




  }

  funcionDatosLocalStorage(){
    const dato = localStorage.getItem('Inflogueo');
    // $('#box').addClass("verde");

    if(dato) {
    this.datosLocalStorage=JSON.parse(dato);

  }else
   console.log("ERROR");

   this.puntosVenta = this.datosLocalStorage.puntosventa;
   if(this.puntosVenta.length>1){
    this.banderaPuntosVenta = true;
   }else if(this.puntosVenta.length==1){
    this.banderaPuntosVenta = false;
   }
  //  console.log('PuntosVenta',this.puntosVenta);
   
  }

 // ============================= METODO CREAR ORDEN ==============================

  crearOrden(form: any) {

    // console.log('asi viene',form);
    

    this.bandera = false;
    const dato = localStorage.getItem('Inflogueo');
    // $('#box').addClass("verde");

    if(dato) {
    this.datosLocalStorage=JSON.parse(dato);

  }else
   console.log("ERROR");

  let infAcceso = this.datosLocalStorage;
  let pVID = this.datosLocalStorage.puntosventa.length;
  // console.log(pVID);
  

  this.user_id = infAcceso.empleado[0].id;
  // console.log(infAcceso);

 
  // this.puntoventa_id = infAcceso.puntosventa[pVID].puntoventa_id;

  if(this.banderaPuntosVenta == true){
    this.puntoventa_id = form.puntoventa_id;
  }else if(this.banderaPuntosVenta == true){
    this.puntoventa_id = infAcceso.puntosventa[0].puntoventa_id;
  }

  if(this.puntoventa_id == ''){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Debe seleccionar un punto de venta',
      timer: 2000,
      showConfirmButton: false,
    });
  }else{

  
  

  // console.log(this.puntoventa_id);
  

  // console.log(this.tamAtributos);
  

    if (this.tamAtributos != 0) {
      // console.log('this.tamAtributos',this.tamAtributos);
      
    
      this.ingresarDatosVehiculo(form);
      // console.log("entra aca");
    // } else if(this.tamAtributos == undefined){ 
    //   // this.enviarDatosVehiculo(form);
  } else if (this.datosVehiculo.length > 0 && this.tamAtributos == 0) {
    this.enviarDatosVehiculo(form);
    // console.log("entra aca 2");
    
    }

    if(form.cliente_id == '' ){
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Debe asignar un cliente',
        timer:2000,
        showConfirmButton:false

      });


    }else{

      if( form.valor[0] == '' ){
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Campos del vehículo no pueden ir en blanco',
          confirmButtonColor: '#818181'

        });

      }else{
        

    let dataform = new FormData();
    // console.log("form Donde entra",form);

    let atrVehi = form.equipoattr_id;
    if(this.arregloCalificacion.length==0){
      form.item='';
      form.revision='';
    }
    else
    {


 
    form.items = this.arregloCalificacion[1];
    form.revision = this.arregloCalificacion[0];
    }

    if(form.items==''&& form.revision==''){
      Swal.fire({
        title: 'Control de Ingreso',
        text: 'No ha realizado el control de ingreso, ¿Está seguro de crear la orden?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#B5B5B5',
        cancelButtonColor: '#F51F36',
        cancelButtonText:'Cancelar',
        confirmButtonText: '!Si, crear ahora!',
      }).then((result) => {
        if (result.isConfirmed) {

            
  // if(infAcceso.count_puntosventa > 1){
  //   console.log("ENTRA ACA primera",this.datosLocalStorage.puntosventa );
  //   this.modal = this.modalService.open(this.modalPUNTOVENTA, {size:'sm'});
          
          // console.log(form);
    

          dataform.append("equipoattr_id", atrVehi);
          dataform.append("cliente_id", form.cliente_id);
          dataform.append("prioridad_id", form.prioridad_id);
          dataform.append("problema", form.problema);
          dataform.append("secuencia",form.secuencia);
          dataform.append("servicio_id", form.servicio_id );
          dataform.append("tecnico_id", form.tecnico_id );
          dataform.append("user_id", this.user_id);
          dataform.append("valor", form.valor);
          dataform.append("puntoventa_id", this.puntoventa_id);
          dataform.append("items", form.items);
          dataform.append("revision", form.revision);
          
          if(Object.keys(this.images).length ) {
            Object.entries(this.images).forEach(([key, value])=>{
              dataform.append('evidencias[]', value);
              console.log(dataform.get('evidencias[]'));
            });
          }
    
      
        //  ====== PROBLEMA REPORTE============
      
          let tam = form.tecnico_id.length;
          // console.log("tamanio del arreglo tecnico", tam);
      
          this.tamTys = tam;
      
          if(form.cliente_id == undefined){
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'Debe asignar un cliente a la orden',
              timer: 2000
            });
          }else{
            Swal.fire({
              allowOutsideClick: false,
              icon: 'info',
              title: 'Creando Orden',
              text: 'Se está creando la orden, ¡Espere por favor!',
              timer: 2000
            })
            Swal.showLoading();
          this.allService.postAL(dataform, 'orden_abierta/insert').subscribe(
            
            (data:any) => {
              // console.log("DATA =>", data);
              this.id = data.id;
              Swal.close();
              Swal.fire({
                      allowOutsideClick: false,
                      icon: 'success',
                      title: 'Orden Creada',
                      text: 'Orden creada correctamente',
                      showConfirmButton:false,
                      timer: 2000
                    })
                    setTimeout(() => {
                      this.locationreload(); 
                     }, 1000);        
            },(err)=>{
              if(err.status == 400 ||err.status == 500  ){
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Error al crear la orden',
                  text: 'Debe asignar un vehículo a la orden',        
                })
              }else{
                Swal.fire({
                  icon: 'error',
                  title: '¡Error!',
                  text: 'Orden no se ha podido grabar',
                });
                this.id;
              }
            })  
          };

          
        }
      // }else if(infAcceso.count_puntosventa = 1){
      //   console.log('ENTRA ACA 2');
        
      // }
      }); 
    }else{

      
      dataform.append("equipoattr_id", atrVehi);
      dataform.append("cliente_id", form.cliente_id);
      dataform.append("prioridad_id", form.prioridad_id);
      dataform.append("problema", form.problema);
      dataform.append("secuencia",form.secuencia);
      dataform.append("servicio_id", form.servicio_id );
      dataform.append("tecnico_id", form.tecnico_id );
      dataform.append("user_id", this.user_id);
      dataform.append("valor", form.valor);
      dataform.append("puntoventa_id", this.puntoventa_id);
      dataform.append("items", form.items);
      dataform.append("revision", form.revision);
      
      if(Object.keys(this.images).length ) {
        Object.entries(this.images).forEach(([key, value])=>{
          dataform.append('evidencias[]', value);
          console.log(dataform.get('evidencias[]'));
        });
      }
  
      // console.log(form);
      
      let tam = form.tecnico_id.length;
      // console.log("tamanio del arreglo tecnico", tam);
  
      this.tamTys = tam;
  
      if(form.cliente_id == undefined){
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Debe asignar un cliente a la orden',
          timer: 2000
        });
      }else{
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'Creando Orden',
          text: 'Se está creando la orden, ¡Espere por favor!',
          
        })
        Swal.showLoading();
      this.allService.postAL(dataform, 'orden_abierta/insert').subscribe(
        (data:any) => {
          // console.log("DATA =>", data);
          this.id = data.id;
          Swal.close();
          Swal.fire({
                  allowOutsideClick: false,
                  icon: 'success',
                  title: 'Orden Creada',
                  text: 'Orden creada correctamente',
                  timer: 2000,
                  showConfirmButton: false
                })
                setTimeout(() => {
                  this.locationreload(); 
                 }, 1000);        
        },(err)=>{
          // console.log("aca");
          
        
          if(err.status == 400 ||err.status == 500  ){
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Error al crear la orden',
              text: 'Debe asignar un vehículo a la orden',        
            })
          }else{
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'Orden no se ha podido grabar',
            });
            this.id;
          }
        })  
      }

    }
    return this.bandera;
    }
  }
}

  }

  getImageFront(image:any) {
    // console.log(image);
    this.images.front = image;
  }
  getImageRight(image:any) {
    this.images.right = image;
  }
  getImageBack(image:any) {
    this.images.back = image;
  }
  getImageLeft(image:any) {
    this.images.left = image;
  }


// =================== METODOS CHECK =========================

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

  this.modal = this.modalService.open(this.modalControl, {size:'lg'});
}

listarTodos1(){
  let i = 0;
  this.allService.getSimple('control_calidad/all_rev_activo').then((data:any)=>{
    this.evaluacion = data
  })
}

 //FORM

 formCheck = new FormGroup({
   val: new FormControl( Validators.required),
   item: new FormControl()
 })

//  function valSeleccionado(i){
//   var icheck1 = document.querySelector('input[name='+"flexRadioDefault"+i+']:checked').value
//   let bandera = false;
//   if(icheck1!=''){
//       bandera = true;
//   }
//   return bandera;
// }
// function valSeleccionadoT(i,tam ){
//   for (let j = 0; j < tam; j++) {
//       var icheck = document.querySelector('input[name='+"flexRadioDefault"+i+']:checked').value
//   }
  
//   return icheck;
// }

valSeleccionado(i:any){
  let icheck1;
  icheck1 = (document.querySelector('input[name='+"flexRadioDefault"+i+']:checked') as HTMLInputElement).value
  let bandera = false;
  if(icheck1!=''){
      bandera = true;
  }
  return bandera;
}

valSeleccionadoT(i:any, tam:any){

}


 isChecked(j:any){
   let band = valSeleccionado(j);
  //  let band = this.valSeleccionado(j);
   this.banderaCheckIN = band;
 }


 guardarCheck(form:any){

if(this.banderaCheckIN == true){

  let tam = this.arregloCategoria.length;
  let arrayCalificacionItem = new Array(tam);
  let arr= new Array;
  let arr2= new Array;

  for (let i = 0; i < tam; i++) {
    arrayCalificacionItem[i] = valSeleccionadoT(i, tam);
    // arrayCalificacionItem[i] = this.valSeleccionadoT(i, tam);
    arr= this.arregloCategoria[i].id;
        arr2.push(arr);
  }
  
      form.val = arrayCalificacionItem;
      form.item= arr2;
      this.arregloCalificacion=[form.val, form.item];
      // console.log('arreglo', this.arregloCalificacion);
      // console.log(form);
      Swal.fire({
        allowOutsideClick:false,
        icon:'info',
        title:'Guardando Calificación',
        text:'Se está guardando la calificación, espere por favor',
        timer: 1500,
        showConfirmButton:false
        });
        this.cerrarModal();
        let btnC = document.getElementById('btnAbrirCheck');
        btnC?.setAttribute('disabled','')
        this.formCheck.reset();

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



// validarDocumento(form:any, bandera:boolean){

//   let ced = form.PersonaComercio_cedulaRuc;
//   this.cedulaGlobal = ced;
//    this.allService.getSimpleCommon('validar_cedula?ci='+ced).then((data:any)=>{
//     if(data.valor == 0){
//       Swal.fire({
//         allowOutsideClick:false,
//         icon:'warning',
//         title:'Documento Incorrecto',
//         text:'Ingrese un documento válido, intente nuevamente',
//         confirmButtonColor: '#818181'
       
//         });
//     }else
//       if(data.valor != 0){
//         this.banderaCliente = true;
//         this.banderaValidarDOC = false;

//         if(bandera == true){
//           this.modal = this.modalService.open(this.modalRegistrarClienteCARD, {centered: true});
//           this.bandera= false;
//           this.banderaCliente = true;
//           this.formRegistrarCliente.get('cedula')?.setValue(this.cedulaGlobal);
//           this.formRegistrarCliente.get('tipoCli')?.setValue(this.tipoUsuarioID);    
//           this.tipoDocumento = data.valor;
//         }else{
//           this.modal = this.modalService.open(this.modalRegistrarCliente, {centered: true});
//           this.bandera= false;
//           this.banderaCliente = true;
//           this.formRegistrarCliente.get('cedula')?.setValue(this.cedulaGlobal);
//           this.formRegistrarCliente.get('tipoCli')?.setValue(this.tipoUsuarioID);    
//           this.tipoDocumento = data.valor;
//         }



//       }
//    })

//    return  this.tipoDocumento;

// }

validarDocumento(form:any){

  let ced = form.PersonaComercio_cedulaRuc;
  this.cedulaGlobal = ced;
   this.allService.getSimpleCommon('validar_cedula?ci='+ced).then((data:any)=>{
    // console.log("cedula", data);
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

           this.modal = this.modalService.open(this.modalRegistrarCliente, {centered: true});
          //  this.formValidarIdentifiacion.reset();
          //  this.formRegistrarCliente.reset();
           // this.formValidarIdentifiacion.controls['cedula'].setValue(dni);
           // this.formRegistrarCliente.controls['tipoCli'].setValue(this.tecDefectoID);
           this.bandera= false;
           this.banderaCliente = true;
          //  this.banderaValidarDOC = true;
        // console.log(this.tipoUsuarioID);
        
        this.formRegistrarCliente.get('cedula')?.setValue(this.cedulaGlobal);
        this.formRegistrarCliente.get('tipoCli')?.setValue(this.tipoUsuarioID);
        
        this.tipoDocumento = data.valor;

      }
   })

   return  this.tipoDocumento;

}

datosLS(){
  const dato = localStorage.getItem("Inflogueo");
    let datos;
  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
     datos = this.datosLocalStorage;
    
  }else console.log("ERROR");

  return datos;
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
        this.cerrarModal();
        this.banderaClienteCreado = true;

        this.allService.getCliente(form.cedula).then((data: any) => {
          this.cardClienteCreado = data.clientes;

          this.seleccionarCliente(this.cardClienteCreado[0]);
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
registrarCliente2(form:any){

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
        this.cerrarModal();
        this.banderaClienteCreado = true;

        this.allService.getCliente(form.cedula).then((data: any) => {
          this.clienteCard = data.clientes;

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
          // this.seleccionarCliente(this.cardClienteCreado[0]);
          this.formRegistrarCliente.reset();
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



editarCliente(form:any){
// console.log('Lo que trae', form);

this.allService.postALCommon(form, 'update_all_client',).subscribe((data:any)=>{

Swal.fire({
  allowOutsideClick:false,
  icon:'success',
  title:'Cliente actualizado',
  text:'Cliente se ha actualizado con éxito' ,
  timer:900,
  showConfirmButton:false
  });

})


}

// onlyPlaca(){
//   let valPlaca =(document.getElementById('placa') as HTMLInputElement).value  
//   if(valPlaca == '1'){
//     let ruc = document.getElementById('form1');
//     ruc?.removeAttribute('readonly')
//     let placa = document.getElementById('form2');
//     placa?.setAttribute('readonly','')
//     this.banderaAutoExiste = false;
//     this.banderaAutoCrea = false;
//     this.banderaCardCliente = false;
    
//   }
// }
// onlyRUC(){
//   let valRUC =(document.getElementById('ruc') as HTMLInputElement).value  
//   if(valRUC == '2'){
//     let placa = document.getElementById('form2');
//     placa?.removeAttribute('readonly')
//     let ruc = document.getElementById('form1');
//     ruc?.setAttribute('readonly','')
//     this.banderaAutoExiste = false;
//     this.banderaAutoCrea = false;
//     this.banderaCardCliente = false;
    
//   }
//   return valRUC;
// }
// obtenerPlacaN(){
//   console.log("entra aca");
// }

// // VERIFICA SI EL NUMERO INGRESADO ES CADENA O NUMERO
 isNum(val:any){
  return !isNaN(val)
}

// METODO BUSCAR CLIENTE POR CEDULA Y ESTE VIENE CON SUS VEHICULOS
// clientesPorCedulaRUC(form:any,ced:any, i:any){
//  this.allService.getVC('vehiculo/lista_por_usuario?buscar='+ced, i).subscribe((data:any)=>{
//     console.log(data);
//     if(data.usuario.length>0){
//       Swal.close();
//       this.autos = data.lista;
//       console.log('AUTOS => ', this.autos);
//       this.clienteCard = data.usuario;
//       this.banderaCardCliente = true;
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


//       if(data.total == 0){
//         console.log("No tiene vehiculos mandar a crear auto");
//         this.banderaAutoCrea = true;
//         this.banderaAutoExiste = false;
//         this.banderaTieneVehiculos = false;
//         this.enviarAtributo();
        
//       }else if(data.total == 1){
//         console.log("cliente tine un solo vehiculo se le asigna el primero");
//         this.datosVehiculo = this.autos[0];
//         this.banderaAutoExiste = true;
        
//       }else if(data.total>1){
//         console.log("caso 3"); 
        
//         this.modal = this.modalService.open(this.modalSelecionarAuto, {size:'lg'});
//         this.refreshAutos();
//         this.banderaTieneVehiculos = true;
//       }
      
//     }else{
//       console.log("Usuario no existe a crearlo");
//       Swal.close();
//       let banderaCardP = false; 
//       this.validarDocumento(form,banderaCardP);
      
//     }
    
//     })
// }

// buscarCliente(cedula:any){

//   this.formCliente.reset();
//   Swal.fire({
//     allowOutsideClick:false,
//     icon:'info',
//     title:'Buscando Cliente',
//     text:'Se está buscando el cliente, espere por favor' ,
//     });
//     Swal.showLoading();
//   let ced = cedula.PersonaComercio_cedulaRuc;
//   console.log(ced);
//   if(this.isNum(ced)){
//     // console.log("es numero");
//     let i:any
//     this.clientesPorCedulaRUC(cedula,ced, i);
//     this.tamAtributos = 0;
//     this.formNuevaOrden.get('valor')?.setValue('');
//     // form.valor='';
//     // this.encerado = form.valor;
    
//   }else{
//     console.log("no es numero", ced);
//     this.allService.getCliente(ced).then((data: any) => {
//       console.log(data);
//       if(data.rta == true){
//       if(data.clientes.length == 1){

//         console.log('entra a esta caso');
         
//         let nombre = data.clientes[0].nombres;
//         this.clientes = data.clientes;
//         let dni = data.clientes[0].PersonaComercio_cedulaRuc;
//         console.log(dni);
//         let i:any
//         if(nombre == 'FINAL' || nombre == ' FINAL' || nombre=='CONSUMIDOR'){
//           Swal.close();
//           this.clienteCard = this.clientes;
//           this.formEditarCliente.setValue({
//             'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
//             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
//             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
//             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
//             'direccion':this.clienteCard[0].direccion,
//             'telefonos': this.clienteCard[0].celular,
//             'celular':this.clienteCard[0].celular,
//             'email':this.clienteCard[0].email,
//             'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
//           })

//           this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//           this.formCliente.reset();
//           this.banderaCardCliente = true;
//           this.enviarAtributo();
//           this.banderaAutoCrea = true;
//           this.banderaAutoExiste= false;
//           this.tamAtributos = 0;
//           this.formNuevaOrden.get('valor')?.setValue('');
//         }else{
//           this.clientesPorCedulaRUC(cedula,dni, i);
//           this.tamAtributos = 0;
//           this.formNuevaOrden.get('valor')?.setValue('');
//         }
       
        
          
//       }else if (data.clientes.length >= 2){ 
//         this.clientes = data.clientes;
//         console.log(data.clientes);
         
//         Swal.close();
//         // this.clientes = data.clientes;
//         this.modal = this.modalService.open(this.modalSelecionarCliente2, {size:'lg'});
//         this.refreshClientes();
//       }
//     }else{
//       Swal.close();
//       Swal.fire({
//         allowOutsideClick:false,
//         icon:'error',
//         title:'Cliente no existe',
//         text:'No se han encontrado coincidencias' ,
//         showConfirmButton: false,
//         timer: 1800

//         });
//     }
//     })
    
//   }
  

// }

// seleccionarVehiculo(vehiculo:any){
//  this.cerrarModal();
// console.log("vehiculo recibido", vehiculo);
// this.datosVehiculo = vehiculo;
// this.banderaAutoCrea = false;
// this.banderaAutoExiste = true;
// this.tamAtributos = 0;
// this.formNuevaOrden.get('valor')?.setValue('');
// }
// verListaVehiculos(){
//   this.modal = this.modalService.open(this.modalSelecionarAuto, {size:'lg'});
//   this.refreshAutos();
// }

// buscarVehiculo(placa:any){
  
//   console.log('esto es',placa);
//   Swal.fire({
//     allowOutsideClick:false,
//     icon:'info',
//     title:'Buscando vehículo',
//     text:'Se está buscando el vehículo, espere por favor' ,
//     });
//     Swal.showLoading();
  
//   let plac = placa.placa2;
//   console.log(plac);
  
//   if(plac == null){
//     Swal.fire({
//       allowOutsideClick:false,
//       icon:'error',
//       title:'Ingrese placa',
//       text:'Campo búsqueda placa vacío' ,
//       showConfirmButton: false,
//       timer:1200
//       });
//   }else{
//   if(plac.length == 0){
//     Swal.close();
// Swal.fire({
//   allowOutsideClick:false,
//   icon:'error',
//   title:'Ingrese placa',
//   text:'Campo búsqueda placa vacío' ,
//   showConfirmButton: false,
//   timer:1200
//   });
//   }else{

//   console.log('placa recibida', plac);
//      this.allService.getAl('vehiculo/by_placa?placa=' + plac).then((data: any) => {
//       // console.log(data);

//       if(data.rta == true || data.length > 0){

//         Swal.close();
//         this.datosVehiculo = data;
//         this.banderaAutoExiste= true;
//         this.banderaAutoCrea = false;
//         this.formAuto2.reset();
//         this.tamAtributos = 0;
//         this.banderaTieneVehiculos;
//         console.log(this.banderaTieneVehiculos);
        
//       }else
//       if(data.status = 200){
//         this,this.formAuto2.reset();
//         this.banderaAutoExiste= false;
//         this.banderaAutoCrea = true;
//         this.allService.getAl('atributo/activo').then((data) => {
//           this.atributos  = data;
//           this.tamAtributos = this.atributos.length;
//           this.banderaTieneVehiculos;
//         Swal.close();

//       })
//     }    
//      })
//     }
//   }
// }

// cambiarUsuario(form:any){
//   console.log(form);
// if(form.PersonaComercio_cedulaRuc == null){
//   Swal.fire({
//     allowOutsideClick:false,
//     icon:'error',
//     title:'Ingrese nombre/ruc',
//     text:'Campo búsqueda cliente vacío' ,
//     showConfirmButton: false,
//     timer:1500
//     });
// }
// if(form.PersonaComercio_cedulaRuc == ''){
//   Swal.fire({
//     allowOutsideClick:false,
//     icon:'error',
//     title:'Ingrese nombre/ruc',
//     text:'Campo búsqueda cliente vacío' ,
//     showConfirmButton: false,
//     timer:1500
//     });
// }else{
//   Swal.fire({
//     allowOutsideClick:false,
//     icon:'info',
//     title:'Cambiando Cliente',
//     text:'Se está cambiando el cliente, espere por favor' ,
//     });
//   Swal.showLoading();
//   let dni = form.PersonaComercio_cedulaRuc;
//   console.log(' ==== dni',dni);
//   if(this.isNum(dni)){
//     this.allService.getCliente(dni).then((data: any) => {
//       console.log(data);
//       if(data.rta == true){
//         this.clienteCard = data.clientes;

//         Swal.close();
//         this.formEditarCliente.setValue({
//           'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
//           'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
//           'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
//           'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
//           'direccion':this.clienteCard[0].direccion,
//           'telefonos': this.clienteCard[0].celular,
//           'celular':this.clienteCard[0].celular,
//           'email':this.clienteCard[0].email,
//           'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
//         })
//         this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//         this.formCliente2.reset();
//       }else{
//         console.log("entra a crear desde la card ", dni);
//         Swal.close();
//         let banderaCardA = true; 
//         this.validarDocumento(form, banderaCardA);
//       }
   
//       // this.tamAtributos = 0;
//       // this.formNuevaOrden.get('valor')?.setValue('');
//         })
//   }else{

//     console.log('busca por palabra');
//     this.allService.getCliente(dni).then((data: any) => {
//       this.clientes = data.clientes;
//       if(data.rta == true){

//         if(data.clientes.length == 1){

//           Swal.close();
//           this.clienteCard = data.clientes;
//           this.formEditarCliente.setValue({
//             'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
//             'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
//             'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
//             'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
//             'direccion':this.clienteCard[0].direccion,
//             'telefonos': this.clienteCard[0].celular,
//             'celular':this.clienteCard[0].celular,
//             'email':this.clienteCard[0].email,
//             'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
//           })
//           this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//           this.formCliente2.reset();
//           // this.tamAtributos = 0;
//           // this.formNuevaOrden.get('valor')?.setValue('');
            
//         }else if (data.clientes.length >= 2){ 
//           console.log(data.clientes);
           
//           Swal.close();
//           // this.clientes = data.clientes;
//           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
//           this.refreshClientes();
//           this.formCliente2.reset();
//         }
//       }else {
//         this.formCliente2.reset();
//         Swal.close();
//         Swal.fire({
//           allowOutsideClick:false,
//           icon:'error',
//           title:'Cliente no existe',
//           text:'No se han encontrado coincidencias' ,
//           showConfirmButton: false,
//           timer: 1800
  
//           }); 
//       }
//     })  
//   }
// }
// }
// seleccionarClienteF(cliente:any){

//   this.banderaCardCliente = true;
//   console.log(cliente);
//   this.clienteCard = cliente;
//   this.formEditarCliente.setValue({
//     'PersonaComercio_cedulaRuc':this.clienteCard.PersonaComercio_cedulaRuc,
//     'nombres': this.titleCasePipe.transform(this.clienteCard.nombres),
//     'apellidos':this.titleCasePipe.transform(this.clienteCard.apellidos),
//     'razonsocial':this.clienteCard.nombres+' '+this.clienteCard.apellidos,
//     'direccion':this.clienteCard.direccion,
//     'telefonos': this.clienteCard.celular,
//     'celular':this.clienteCard.celular,
//     'email':this.clienteCard.email,
//     'clientetipo_idclientetipo':this.clienteCard.clientetipo_idclientetipo        
//   })
//   this.dni= this.clienteCard.PersonaComercio_cedulaRuc
//   this.cerrarModal();
//   // this.tamAtributos = 0;
//   // this.formNuevaOrden.get('valor')?.setValue('');
// }

// seleccionarClienteF1(dni:any){
//   this.cerrarModal();
//   console.log(dni);
//   let i:any
//   let form:any;
//   this.clientesPorCedulaRUC(form,dni, i);
//   // this.tamAtributos = 0;
//   // this.formNuevaOrden.get('valor')?.setValue('');
// }
  
// seleccionarCliente(cliente: any) {
//   this.clienteCard = [cliente];
//   this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//   this.allService.getCliente(this.dni).then((data: any) => {

//     this.clienteCard = data.clientes;
//     this.formEditarCliente.setValue({
//               'PersonaComercio_cedulaRuc':this.clienteCard[0].PersonaComercio_cedulaRuc,
//               'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
//               'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
//               'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
//               'direccion':this.clienteCard[0].direccion,
//               'telefonos': this.clienteCard[0].celular,
//               'celular':this.clienteCard[0].celular,
//               'email':this.clienteCard[0].email,
//               'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo        
//             })
    
//             this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//             this.banderaCardCliente = true;
//             this.formCliente.reset();
//             this.tamAtributos = 0;
//             this.formNuevaOrden.get('valor')?.setValue('');
//             let valor='';
//             this.encerado = valor;

//             this.enviarAtributo();
//             this.banderaAutoExiste = false;
//             this.banderaAutoCrea = true;
//             this.formRegistrarCliente.reset();
//             this.banderaTieneVehiculos = false;
//   })
//   this.cerrarModal();
// }

}

