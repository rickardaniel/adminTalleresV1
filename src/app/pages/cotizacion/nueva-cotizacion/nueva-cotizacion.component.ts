import { DecimalPipe,Location, TitleCasePipe } from '@angular/common';
import { Component, OnInit,  TemplateRef, ViewChild } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { productoWORK } from '../../Modelos/arregloItemP.model';
import { Cliente } from '../../Modelos/cliente.model';


// declare function arregloAlias(i:any):any;
// declare function focoAlias(i:any):any;
// declare function getPrecioItem(i:any):any;
// declare function arregloValoresAuto(i: any, tam: any): any;
// declare function arregloValoresAuto2(i: any, tam: any): any;
// declare function SelectDefecto():any;

@Component({
  selector: 'app-nueva-cotizacion',
  templateUrl: './nueva-cotizacion.component.html',
  styleUrls: ['./nueva-cotizacion.component.scss']
})
export class NuevaCotizacionComponent implements OnInit {

  @ViewChild("modalSelecionarCliente") modalSelecionarCliente: TemplateRef<any> | undefined;
  @ViewChild("modalSelecionarPC ") modalSelecionarPC : TemplateRef<any> | undefined;
  @ViewChild("modalRegistrarCliente") modalRegistrarCliente: TemplateRef<any> | undefined;


    //Tabla
    page = 1;
    pageSize = 5;
    collectionSize:any;
    cliente : Cliente[];

    // Tabla PyS
    ps: productoWORK[];
    page1 = 1;
    pageSize1 = 5;
    collectionSize1:any;
    productoServicio:any=[];

   //REGISTRAR CLIENTE 
   cedulaGlobal='';
   tipoDocumento:any;

     //card Cliente creado

  cardClienteCreado:any=[];
   
  // Vehiculo
datosVehiculo:any=[];
// Atributos Vehiculo
atributos:any=[];
tamAtributos:any;
//Cliente
clientes:any=[];
clienteCard: any = [];
//Tecnicos
tecnicos:any =[];
tecnicoDefecto:any=[];
tecnicoDefectoN:any=[];
tecnicoDefectoA:any=[];
tecnicoDefectoId:any=[];
// Servicios
servicios:any = [];
servicioDefecto:any=[];
servicioDefectoId:any=[];
//ProductoServicio
infProducto:any=[];

//Datos LocalStorage
datosLocalStorage: any[];
//BODEGA id
puntoventa_id:any;
tecnico_id:any;

bodega_id:any;

//Precio Defecto
precioDefectoCliente:any;
cliente_id :any;

//PRODUCTOS
productos:any[]=[];
alias:any=[];

//Secuencia
secuencia:any;

//USER ID
user_id:any;

//Nueva Cantidad

nuevaCantidad:any;
productoFormCantidad:any;
enviarProducto:any=[];
position:any;
idOrden:any;

banderaClienteCreado =false;

//Total
total=0;


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

encerado:any;

  // BANDERAS IMPUTS
  banderaAutoExiste=false;
  banderaAutoCrea = false;
  banderaCardCliente:any;
  banderaIconTrash:any;
  banderaCarroNoExiste = false;
  banderaPaginacion:any;

  banderaAliasAbrir:any;
  banderaAliasCerrar:any;

  banderaOcultarStock:any;

  banderaCliente = false;
  banderaValidarDOC = true;

  bandera: any;
  dni:any;

  //MODALES
  modal:any;

   //STOCk
   stock:any;


  //FORMULARIO y EDICION PRODUCTO SERVICIO
      //VALOR PRODUCTO IVA
      costoProm:any;
      itemPre:any;
      ivaProd:any;
      totalValProd:any;
      precioDefecto:any;
      arregloItemP:any=[];

      totalS=0;
      subTotal12 = 0;
      subTotalcero = 0;
      subTotal = 0;
      iva12 = 0;

        //EDICION PRODUCTO SERVICIO

  tecSeleccionado:any;
  tecNombre:any;
  servSelecccionado:any;
  idTecSeleccionado:any;
  idServSeleccionado:any;
  aliasGlobal:any;

    //tipoUsuario - Cliente

    tipoUsuario:any=[];
    tipoUsuarioDefecto:any;
    tipoUsuarioID:any;

    email:any;

  constructor(private allService: AllServiceService,
              private modalService:NgbModal,
              public _router: Router, 
              public _location: Location,
              private titleCasePipe: TitleCasePipe
              ) { }

  ngOnInit(): void {
    this.enviarTecnico();
    this.enviarServicio();
    this.getSecuencia();
    // SelectDefecto();
    this.enviarTipoCliente()
  }

  refreshClientes() {
    const PRS :Cliente[]=this.clientes;  
    // console.log("CLIENTES", PRS);
    this.collectionSize = PRS.length;
    // console.log("TAMANIO", this.collectionSize);

    if(this.collectionSize <= this.pageSize){
      this.banderaPaginacion = false;
    }else{
      this.banderaPaginacion = true;
    }
    
      this.cliente = PRS
      .map((blablabla: any, i: number) => ({id: i + 1, ...blablabla}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);    
      
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
  refresh(): void {
		this._router.navigateByUrl("#/cotizacion/nueva_cotizacion", { skipLocationChange: true }).then(() => {
		// console.log(decodeURI(this._location.path()));
		this._router.navigate([decodeURI(this._location.path())]);
		});
	}
 
 
  formAuto = new FormGroup({
    placa: new FormControl('', [ Validators.required, Validators.minLength(6), Validators.maxLength(8), Validators.pattern('[a-z A-Z]{2,3}[0-9]{3,4}||[a-z A-Z]{1}')]) });
    // placa: new FormControl('', [ Validators.required]) });

    formCliente = new FormGroup({PersonaComercio_cedulaRuc: new FormControl('', [Validators.required,Validators.minLength(3), Validators.pattern('[a-z A-z]{3,30}||[0-9]{8-13}')]) });


      // FORM SELECCIONAR CLIENTE
  formElegirCliente = new FormGroup({});

  formBusquedaN = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(3), Validators.pattern('[a-z A-Z]{3,100}')]),
   
  })
  formBusquedaCU = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(1), Validators.pattern('[0-9]{1,6}')]),
   
  })
  formBusquedaCB = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4,20}')]),
   
  })
  // ================================== FORM PRODUCTO-SERVICIO ========================================

formProductoServicio = new FormGroup({
  cantidad: new FormControl(""),
  tecnicoS: new FormControl('',Validators.required),
  servicio: new FormControl('',Validators.required),
  alias: new FormControl('',Validators.required),
})

  //FORM COTIZACION

    // FORM NUEVA ORDEN
    formNuevaCotizacion = new FormGroup({
      cliente_id    : new FormControl(''),
      equipoattr_id : new FormControl(),
      valor         : new FormControl(),
      problema      : new FormControl('',  Validators.required),
      tecnico_id2    : new FormControl('', ),
      servicio_id   :new FormControl('', Validators.required),
      
      producto_id: new FormControl(''),
      productname: new FormControl(''),
      tiposprecio: new FormControl(''),
      cant: new FormControl(''),
      itemprecio: new FormControl(''),
      ivaporcent: new FormControl(''),
      iva: new FormControl(''),
      total: new FormControl(''),
      bodega_id:new FormControl(''),
      esservicio: new FormControl(''),
      costopromedio:new FormControl(''),
      tiposervicio_id : new FormControl(''),
      user_id: new FormControl(''),
      tecnico_id: new FormControl(''),
      puntoventa_id: new FormControl(''),
      alias:new FormControl()
    });
    get f() {
      return this.formAuto.controls;
    }
    get f1() {
      return this.formCliente.controls;
    }
    get fNC() {
      return this.formNuevaCotizacion.controls;
    }
    formCantidad = new FormGroup({
      c : new FormControl('', Validators.required),
      precio : new FormControl('', Validators.required),
      nombreT : new FormControl('', Validators.required),
      nombreS : new FormControl('', Validators.required),
      nombreA : new FormControl('', Validators.required),
    })
    formCantidadS = new FormGroup({
      c : new FormControl('', Validators.required),
      p : new FormControl('', Validators.required),
      
    })

     // ===================== SERVICIOS ================================
  enviarTecnico() {
    this.allService.getAl('tecnico/todos').then((data) => {
      this.tecnicos = data;
      this.tecnicoDefectoN =this.tecnicos[0].nombres;
      this.tecnicoDefectoA =this.tecnicos[0].apellidos;

      this.tecnicoDefecto = this.tecnicos[0].nombres + this.tecnicos[0].apellidos;
      this.tecnicoDefectoId =this.tecnicos[0].id
      // console.log('Tecnico Defecto',  this.tecnicoDefecto);
      // console.log('Tecnico Defecto ID', this.tecnicoDefectoId);   

    });
  }

  enviarServicio() {
    this.allService.getAl('producto/activo').then((data) => {
      this.servicios = data;
      // console.log(this.servicios);
      
      this.servicioDefecto = this.servicios[0].tipo;
      this.servicioDefectoId = this.servicios[0].id;

    });
  } 
  enviarTipoCliente(){
    this.allService.getSimpleCommon('get_clientetipo').then((data:any)=>{

      this.tipoUsuario = data;
      // console.log("tipos", this.tipoUsuario);

      this.tipoUsuarioDefecto = this.tipoUsuario[0].tipo;
      this.tipoUsuarioID = this.tipoUsuario[0].idclientetipo;
      
      
    })
  }
  getSecuencia() {
    this.allService.getAl('orden_abierta/secuencia').then((data: any) => {
      // console.log("secuencia",data);
      
      if(data==false){
        this.secuencia = 1;
      }else{
        this.secuencia= parseInt(data.secuencia) + 1;

      }
      
    });
    return this.secuencia;
  }



    // =================================== MODALES =========================================

    cerrarModal(){
      this.modal.close();
      this.ps=[];
    
    }
    

    // ============================== OBETNER ATRIBUTOS VEHÍCULO =============================

    enviarAtributo() {
      this.allService.getAl('atributo/activo').then((data) => {
        this.atributos  = data;
        this.tamAtributos = this.atributos.length;
      });
    }

    // ================================== OBTENER VEHÍCULO ===================================

    // obtenerVehiculo(form: any) {


    //   this.tamAtributos = 0;
    //   this.formNuevaCotizacion.get('valor')?.setValue('');
    //   form.valor='';
    //   this.encerado = form.valor;
    //   // console.log('enveradi' ,this.encerado);

    //   // arregloValoresAuto(0,0);
    //   // this.tamAtributos = 0;
    //   // this.formNuevaCotizacion.get('valor')?.setValue('');

    //   let placa = form.placa;
    //   this.formAuto.reset();
    //   // console.log('esta es la placa', placa);
    //   Swal.fire({
    //     allowOutsideClick:false,
    //     icon:'info',
    //     title:'Buscando vehículo',
    //     text:'Se está buscando su vehículo, espere por favor' ,
    //     });
    //     Swal.showLoading();
    //   this.allService.getAl('vehiculo/by_placa?placa=' + placa).then((data: any) => {
    //     // console.log(' respuesta ', data);
    //     if (data.rta == true || data.length > 0) {
          
    //       Swal.close();
    //       this.banderaAutoExiste = true;
    //       this.banderaAutoCrea= false;
    //       this.datosVehiculo = data;
    //       this.formAuto.reset();

  
    //     } else  {
    //       Swal.close();
    //       // Swal.fire({
    //       //   icon: 'error',
    //       //   title: '¡Error!',
    //       //   text: 'Placa no encontrada, registre vehículo ahora',
    //       //   timer: 3000,
    //       // });
  
    //       this.banderaAutoExiste = false;
    //       this.banderaAutoCrea = true;
    //       this.enviarAtributo();
    //       this.formAuto.reset();
  
    //     }
    //   });
    // }

    obtenerVehiculo(form: any) {
      this.tamAtributos = 0;
      this.formNuevaCotizacion.get('valor')?.setValue('');
      form.valor='';
      this.encerado = form.valor;
      // console.log('enveradi' ,this.encerado);

      // arregloValoresAuto(0,0);
      // this.tamAtributos = 0;
      // this.formNuevaCotizacion.get('valor')?.setValue('');

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
          this.formAuto.reset();

  
        } else  {
          // Swal.fire({
          //   icon: 'error',
          //   title: '¡Error!',
          //   text: 'Placa no encontrada, registre vehículo ahora',
          //   timer: 3000,
          // });
          Swal.close();
      
          this.enviarAtributo();
          this.banderaAutoExiste = false;
          this.banderaAutoCrea = true;
          // this.formAuto.reset();
  
        }
      });
    }
    // obtenerVehiculo(form: any) {

    //   this.tamAtributos = 0;
    //   this.formNuevaCotizacion.get('valor')?.setValue('');
    //   form.valor='';
    //   this.encerado = form.valor;
    //   // console.log('enveradi' ,this.encerado);
    //   let placa = form.placa;
    //   this.formAuto.reset();
    //   // console.log('esta es la placa', placa);
  
    //   Swal.fire({
    //     allowOutsideClick:false,
    //     icon:'info',
    //     title:'Buscando vehículo',
    //     text:'Se está buscando su vehículo, espere por favor' ,
    //     });
    //     Swal.showLoading();
  
    //     // vehiculo/usuario_por_placa?buscar=placaxx&tipo=placa
    //     let i:any;
    //   this.allService.getVC('vehiculo/usuario_por_placa?buscar='+placa+'&tipo=placa',i).subscribe((data: any) => {
    //   // this.allService.getAl('vehiculo/by_placa?placa=' + placa).then((data: any) => {
    //     // console.log(' respuesta ', data);
    //     if (data.rta_ve == true || data.length > 0) {
    //       Swal.close();
    //       this.banderaAutoExiste = true;
    //       this.banderaAutoCrea= false;
    //       this.datosVehiculo = data.vehiculo;
  
    //       this.clienteCard  = data.usuario;
    //       // console.log("cliente", this.clienteCard);
          
    //       this.precioDefectoCliente = this.clienteCard[0].default_price;
    //       this.cliente_id = this.clienteCard[0].ruc;
    //       this.email = this.clienteCard[0].email;
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
    //       this.cliente_id = this.clienteCard[0].ruc;
    //       this.dni = this.clienteCard[0].ruc;
    //       this.banderaCardCliente = true;
    //       this.formCliente.reset();
  
    //     } else  {
    //       Swal.close();
    //       this.banderaAutoExiste = false;
    //       this.banderaAutoCrea = true;
  
    //     }
    //   },(err)=>{
    //     // alert("CAMBIO")
    //     Swal.close();
  
    //     this.banderaCarroNoExiste = true;
    //     this.banderaAutoExiste = false;
    //     this.banderaAutoCrea = true;
    //     this.banderaCardCliente = false;
  
    //     // console.log(" valor bandera cuando no existe => ", this.banderaCarroNoExiste);
    //     this.enviarAtributo();
    //   });
    // }

// ================================== OBTENER CLIENTE ===================================
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
        this.precioDefectoCliente = this.clienteCard[0].default_price;
        // this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
        this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
        this.email = this.clienteCard[0].email;
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
//   this.banderaAutoCrea= false;
//   this.banderaAutoCrea =false;
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

//     if (data.rta_us == true) {

//       Swal.close();
//       // this.clientes = data.clientes;
//       this.clientes = data.usuario;
//       if(this.clientes.length>=2){
//         this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
//         this.formCliente.reset();
//         this.refreshClientes();
//         // let cel = this.clientes[0].celular;
//         // this.celular = cel;
//         this.dni = this.clienteCard[0].ruc
//         this.cliente_id = this.clienteCard[0].ruc;
//         this.email = this.clienteCard[0].email;
//         this.precioDefectoCliente = this.clienteCard[0].default_price;
//       }
//       else if(this.clientes.length=1){
//         this.clienteCard  = this.clientes;
//         this.cliente_id = this.clienteCard[0].ruc;
//         this.precioDefectoCliente = this.clienteCard[0].default_price;
//         this.email = this.clienteCard[0].email;
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
//         this.email = this.clienteCard[0].email;
//         this.precioDefectoCliente = this.clienteCard[0].default_price;
//         this.dni = this.clienteCard[0].ruc;
//         this.cliente_id = this.clienteCard[0].ruc;
//         this.banderaCardCliente = true;
//         this.formCliente.reset();
//         this.tamAtributos = 0;
//         this.formNuevaCotizacion.get('valor')?.setValue('');
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
//           console.log('this. datos vehiculo',this.datosVehiculo);
//         }
//       }
     
    
//     }else if (data.rta == false) {

//       Swal.close();
//       this.validarDocumento(form);
//     }
//   },(err)=>{
//     Swal.close();
//     // console.log("ENTRA ACA");
//     this.allService.getCliente(dni).then((data: any) => {

//       // console.log(data);
      
//       if (data.rta == true) {

//         Swal.close();
//         this.clientes = data.clientes;
//         if(this.clientes.length>=2){
//           this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
//           this.formCliente.reset();
//           this.refreshClientes();

//         }
//         else if(this.clientes.length=1){
                      
//           this.clienteCard  = this.clientes;
//           // console.log('cliente ', this.clienteCard);
          
          
//           if(this.clienteCard[0].nombres ==" FINAL"){
//             // console.log(this.clienteCard[0].nombres);
            
//             // console.log('entra al if');
//             this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
//             this.precioDefectoCliente = this.clienteCard[0].default_price;
//             this.email = this.clienteCard[0].email;
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
//             this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
//             this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc
//             this.precioDefectoCliente = this.clienteCard[0].default_price;
//             this.formAuto.reset();
//             this.banderaAutoCrea = true;

//             this.tamAtributos = 0;
//             this.formNuevaCotizacion.get('valor')?.setValue('');
//             form.valor='';
//             this.encerado = form.valor;
//             this.banderaCardCliente = true;
//             this.banderaAutoExiste = false;
//             // console.log("FINAL");
//             this.enviarAtributo();
            

//           }else if (this.clienteCard[0].nombres !="FINAL"){
//             // console.log("caso 2");
//             this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
//             this.precioDefectoCliente = this.clienteCard[0].default_price;
//             this.email = this.clienteCard[0].email;
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
//           this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
//           this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
//           this.precioDefectoCliente = this.clienteCard[0].default_price;

//           this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
//             // console.log(data);
      
//             if (data.rta_us == true) {
//               let cedula = data.usuario[0].ruc
//               this.dni = cedula
//               // console.log("========== cedula ep Pao", this.dni);
            
//               this.banderaCardCliente = true;
//               this.formCliente.reset();
//               this.tamAtributos = 0;
//               this.formNuevaCotizacion.get('valor')?.setValue('');
//               form.valor='';
//               this.encerado = form.valor;

//               if(this.banderaCarroNoExiste == true){
//                 this.banderaAutoCrea= false;
//               }else{
//                 this.banderaAutoExiste = true;
                
//               }
//               if(data.vehiculo.length == 0){
//                 this.enviarAtributo();
//                 this.banderaAutoExiste = true;
//                 this.banderaAutoCrea = false;
//                 this.banderaCardCliente = true;
                
    
//               }else{
//                 this.datosVehiculo = data.vehiculo;
//                 // console.log('this. datos vehiculo',this.datosVehiculo);
//               }


//             }
//           })
//         }
//         }
       

  
      
//       }else if (data.rta == false) {

//         Swal.close();


//         this.validarDocumento(form);
//       }

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
  
    // obtenerCliente(form: any) {

    //   this.banderaCardCliente = false;
    //   this.formCliente.reset();
    //   let dni = form.PersonaComercio_cedulaRuc;
    //   if( (form.PersonaComercio_cedulaRuc).length >2){

    //   Swal.fire({
    //     allowOutsideClick:false,
    //     icon:'info',
    //     title:'Buscando cliente',
    //     text:'Se está buscando al cliente, espere por favor' ,
    //     });
    //     Swal.showLoading();
    //   this.allService.getCliente(dni).then((data: any) => {
    //     // console.log(data);
  
    //     if (data.rta == true) {
    //       Swal.close();
      
    //       this.modal = this.modalService.open(this.modalSelecionarCliente, {size:'lg'});
    //       this.formCliente.reset();
    //       this.clientes = data.clientes;
    //       this.page=1;
    //       this.refreshClientes();
      

    //       // console.log('info del usuario que envío a la tabla => ', this.clientes);
  
  
    //     } else if (data.rta == false) {
    //       // Swal.fire({
    //       //   icon: 'error',
    //       //   title: '¡Error!',
    //       //   text: 'No se encontró al cliente',
    //       //   timer:3000
    //       // });
    //       Swal.close();

    //       this.validarDocumento(form);

    //       // this.modal = this.modalService.open(this.modalRegistrarCliente, {centered: true});
    //       // this.formValidarIdentifiacion.reset();
    //       // this.formRegistrarCliente.reset();
    //       // this.formValidarIdentifiacion.controls['cedula'].setValue(dni);
    //       // this.bandera= false;
    //       // this.banderaCliente = false;
    //       // this.banderaValidarDOC = true;
    //     }
    //   });
    // }
    // else{
    //   Swal.fire({
    //     icon: 'error',
    //     title: '¡Error!',
    //     text: 'No se puede buscar, ¡campo vacio!',
    //     showConfirmButton: false,
    //     timer:1500
    //   });
    //   this.formCliente.controls['PersonaComercio_cedulaRuc'].setValue('');
   
      
    // }
    // }

    // ============================ SELECCIONAR CLIENTE =============================

    seleccionarCliente(cliente: any) {
      this.clienteCard = [cliente];
      // this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
      this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
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
                  this.precioDefectoCliente = this.clienteCard[0].default_price;
                  this.email = this.clienteCard[0].email;
      this.cerrarModal();
                }
  //     // console.log('------ cliente que enviaré a la card ', cliente);
  //     this.clienteCard = [cliente];
  //     // console.log(this.clienteCard);
      
  //     let cel = this.clienteCard[0].celular;
  //     // ========================================================
  //     this.nombre = this.clienteCard[0].nombres+" "+this.clienteCard[0].apellidos;
  //     this.direccion = this.clienteCard[0].direccion;
  //     this.dni = this.clienteCard[0].PersonaComercio_cedulaRuc;
  //     this.celular = cel;
  //     // console.log('CEL', this.celular);
  //     let correo = this.clienteCard[0].email;
  //     this.correo = correo;
  //     this.precioDefectoCliente = this.clienteCard[0].default_price;
  //     let i:any;
  
  //     this.allService.getVC('vehiculo/usuario_por_placa?buscar='+this.dni+'&tipo=ci',i).subscribe((data: any) => {
  //       // this.allService.getCliente(dni).then((data: any) => {
  //         // console.log(data);
    
  //         if (data.rta_us == true ) {
    
  //           // Swal.close();
  //           this.clienteCard  = data.usuario;
  //           this.precioDefectoCliente = this.clienteCard[0].default_price;
  //           this.cliente_id = this.clienteCard[0].ruc;
  //           this.email = this.clienteCard[0].email;
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
  //           this.cliente_id = this.clienteCard[0].ruc;
  //           this.dni = this.clienteCard[0].ruc;
  //           this.banderaCardCliente = true;
  //           this.formCliente.reset();
  
  //           this.tamAtributos = 0;
  //           this.formNuevaCotizacion.get('valor')?.setValue('');
  //           let valor='';
  //           this.encerado = valor;
  
  //           // this.banderaAutoExiste = true;
  //           // this.banderaAutoCrea= false;
  //           // console.log('ENTRA ACA EN SELECCIONAR CLIENT');
            
  //         // console.log('VALOR BANDERA ', this.banderaCarroNoExiste);
          
  //           if(this.banderaCarroNoExiste == true){
  //             this.banderaAutoCrea= true;
  //           }else{
  //             this.banderaAutoExiste = true;
  //           }
  
  //           if(data.vehiculo.length == 0){
  //             this.enviarAtributo();
  //             this.banderaAutoExiste = false;
  //             this.banderaAutoCrea = true;
  //             this.banderaCardCliente = true;
              
  
  //           }else{
  //             this.datosVehiculo = data.vehiculo;
  //             // console.log('this. datos vehiculo',this.datosVehiculo);
  //           }
  
           
  //         }
  
  //         })
  //     this.cerrarModal();
  //   }
  // //   seleccionarCliente(cliente: any) {
  // //     this.clienteCard = [cliente];

  // //     // console.log('------ cliente que enviaré a la card ', this.clienteCard);

  // //     this.precioDefectoCliente = this.clienteCard[0].default_price;
  // //     this.cliente_id = this.clienteCard[0].PersonaComercio_cedulaRuc;
  // //     // console.log("Precio Defecto", this.precioDefectoCliente);
      
  // //     const dato1 = localStorage.getItem("Inflogueo");
  // //   let datos;
  // //  if(dato1) {
  // //   this.datosLocalStorage=JSON.parse(dato1);
  // //    datos = this.datosLocalStorage; 
  // //   }else console.log("ERROR");
  // //   let infAcceso1 =  Object.values(this.datosLocalStorage);
  // //   // console.log('inf login', infAcceso1);
  // //   let ptvid = infAcceso1[2][0].puntoventa_id;
  // //   let b_id = infAcceso1[2][0].bodega_id;
  // //   let uid = infAcceso1[1][0].id;
  // //   // console.log('punto venta_id',ptvid);

  // //   //GLOBALES
  // //   this.puntoventa_id = ptvid;
  // //   this.bodega_id = b_id;
  // //   this.user_id = uid;
  // //   // let puntoventa_id = ptvid
  // //   // let bodega_id = b_id;
  // //   // let user_id = uid;

     
  // //     this.banderaCardCliente = true;
  // //     this.cerrarModal();
      
  // //   this.formEditarCliente.setValue({
  // //     'PersonaComercio_cedulaRuc':this.cliente_id,
  // //     'nombres': this.titleCasePipe.transform(this.clienteCard[0].nombres),
  // //     'apellidos':this.titleCasePipe.transform(this.clienteCard[0].apellidos),
  // //     'razonsocial':this.clienteCard[0].nombres+' '+this.clienteCard[0].apellidos,
  // //     'direccion':this.clienteCard[0].direccion,
  // //     'telefonos': this.clienteCard[0].telefonos,
  // //     'celular':this.clienteCard[0].celular,
  // //     'email':this.clienteCard[0].email,
  // //     'clientetipo_idclientetipo':this.clienteCard[0].clientetipo_idclientetipo
     

  // //   })
  //   }

    abrirModal (ModalContent: any): void {
      this.modal = this.modalService.open(ModalContent,  { centered: true });
    }
    
// ========================= BUSCAR PRODUCTO SERVICIO ======================================
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
    
    if(data.length >= 1){
      Swal.close();

      this.modal = this.modalService.open(this.modalSelecionarPC, {size:'xl'});
      this.productoServicio = data;

      //OBTENER EL PRECIO DEFECTO

      this.precioDefecto = this.precioDefectoCliente;

      // console.log(this.precioDefecto);
      

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

      this.formProductoServicio.setValue({
        'cantidad':1,
        'tecnicoS':this.tecnicoDefectoId,
        'servicio': this.servicioDefectoId,
        'alias': ''
      })

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
  let nombre = form.nombre;
 this.formBusquedaCU.reset();
  // console.log("nombre capturado", nombre);

  if(nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      showConfirmButton: false,
      timer:1500
}) 
  }else{
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando Producto',
    text:'Se está buscando el producto, espere por favor' ,
    });
    Swal.showLoading();
  
    // this.allService.getSimple('producto/search_product_code?search='+nombre).then((data:any)=>{
      this.allService.getProductoMap(nombre).subscribe((data: any) => {
      // console.log('datos buiscador 2', data);
      
  if(data.length >= 1){

    Swal.close();

    this.modal = this.modalService.open(this.modalSelecionarPC, {size:'xl'});

    this.productoServicio = data;
    // console.log('---', this.productoServicio);
    
    this.precioDefecto = this.precioDefectoCliente
    // console.log('precio defecto',this.precioDefecto);


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
      // console.log('precios', this.arregloItemP); 
    
    this.page=1;

    this.refreshPyS();
   
  
    this.formProductoServicio.setValue({
      'cantidad':1,
      'tecnicoS':this.tecnicoDefectoId,
      'servicio': this.servicioDefectoId,
      'alias': ''
    })

    for (let k = 0; k < this.arregloItemP.length; k++) {
      this.formProductoServicio.get('precioPVP')?.setValue(k);
  }



    // this.tecnico_id = this.pedidoTecnicos[0].tys[0].tecnico_id;   
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
  let nombre = form.nombre;
 this.formBusquedaCB.reset();
  // console.log("nombre capturado", nombre);

  if(nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      showConfirmButton: false,
      timer:1500
}) 
  }else{
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

    this.modal = this.modalService.open(this.modalSelecionarPC, {size:'xl'});

    this.productoServicio = data.data;
    // console.log('---', this.productoServicio);
    
    this.precioDefecto = this.precioDefectoCliente;
    // console.log('precio defecto',this.precioDefecto);


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
      // console.log('precios', this.arregloItemP); 
    
    this.page=1;

    this.refreshPyS();
   
  
    this.formProductoServicio.setValue({
      'cantidad':1,
      'tecnicoS':this.tecnicoDefectoId,
      'servicio': this.servicioDefectoId,
      'alias': ''
    })

    for (let k = 0; k < this.arregloItemP.length; k++) {
      this.formProductoServicio.get('precioPVP')?.setValue(k);
  }



    // this.tecnico_id = this.pedidoTecnicos[0].tys[0].tecnico_id;   
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

  // focoAlias(i);


  let entradaAlias = document.getElementById('verAlias'+i);
  entradaAlias?.removeAttribute('hidden');

  let iEntradaAlias = document.getElementById('iAA'+i);
  iEntradaAlias?.setAttribute('hidden', '');
  

  let iEntradaAlias1 = document.getElementById('iAC'+i);
  iEntradaAlias1?.removeAttribute('hidden')

}
ocultarAlias(i:any){

  // focoAlias(i);
  let entradaAlias = document.getElementById('verAlias'+i);
  entradaAlias?.setAttribute('hidden','');

  let iac = document.getElementById('iAC'+i);
  iac?.setAttribute('hidden', '');

  let iaa =  document.getElementById('iAA'+i);
  iaa?.removeAttribute('hidden')


}

arregloAlias(i:any){
  let  x = (document.getElementById('verAlias'+i) as HTMLInputElement).value
  return x; 
}

aliasProducto(i:any){
    // let val = arregloAlias(i);
    let val = this.arregloAlias(i);
    // console.log("alias", val);
  return val;
}
productoRepetido(idP:any){
  // console.log("Id producto a agregar ", idP); 
  let tam = this.productos.length;
  let array = this.productos;
  // console.log('PRODUCTOS',this.productos);
  
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

  // console.log("Id producto a agregar ", idP);
  
  let tam = this.productos.length;
  let array = this.productos;
  // let bandera = false;
  let id;
  let cant;
  let c;
  for (let i = 0; i < tam; i++) {
    id= array[i].producto_id;
    cant = array[i].cant;
    // console.log("id productos => ", id);
    
    if(idP == id){
// console.log("producto existe ", idP);
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
// console.log("producto existe ", idP);
idP = i;
    }
  }
  return idP;
  
}

getPrecioItem(i:any){
  let x = (document.getElementById('precioItem'+i) as HTMLInputElement).value  
  let x1 = x.replace(',', '.');    
  return x1;
}
// =========================== AGREGAR PRODUCTO ========================================
agregarProducto1(el:any, i:any,form:any){
  // console.log(form);
  this.aliasProducto(i);
  this.infProducto = [el];
  let producto_id = el.id_producto;
  let esservicio = el.esServicio;
  let productname = el.pro_nom;
  let formPTS = this.formProductoServicio.value;
  let cant = formPTS.cantidad;
  let tiposervicio_id = formPTS.servicio;
  let t_id = formPTS.tecnicoS;
  let tecnico_id = t_id;
  let alias = this.aliasProducto(i);
  let tecnico_apellidos = '';
  let tecnico_nombres ="";
  let tipo = "";

for (let z = 0; z < this.tecnicos.length; z++) {
  if(t_id == this.tecnicos[z].id){
    tecnico_apellidos = this.tecnicos[z].apellidos;
    tecnico_nombres = this.tecnicos[z].nombres;
  }
}

for (let x = 0; x <this.servicios.length; x++) {
  if(tiposervicio_id == this.servicios[x].id){
    tipo = this.servicios[x].tipo;
  } 
}

//BODEGA ID
const dato = localStorage.getItem("Inflogueo");

  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);    
  }else console.log("ERROR");
  let infAcceso =  Object.values(this.datosLocalStorage);
  this.bodega_id = infAcceso[2][0].bodega_id;
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

    
      // itemprecio = parseFloat(getPrecioItem(i)) ;
      itemprecio = parseFloat(this.getPrecioItem(i)) ;
      if ((ivaporcent) == 12) {
        // console.log("entra");
        
        iva =  (itemprecio*ivaporcent)/100;
        // console.log(iva);
        
        total = itemprecio + iva
        costopromedio = total *cant;
        // console.log(total);
        
      } else if (ivaporcent == 0) { 
        // console.log("entra 2");
        
        iva = 0;
        total = itemprecio + iva;
        costopromedio = total *cant;
        
      } else if (ivaporcent == 8) {
        iva = (itemprecio*ivaporcent)/100
        total = itemprecio + iva;
        costopromedio = total *cant;
        
      }
      costopromedio = total * cant;
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
    pys = {
      alias,
      bodega_id,
      producto_id,
      esservicio,
      productname,
      cant,
      tiposprecio,
      itemprecio,
      iva,
      total,
      ivaporcent,
      costopromedio,
      tiposervicio_id,
      tecnico_apellidos,
      tecnico_nombres,
      tipo,
      tecnico_id,
    };

          this.productos.push(pys);
          console.log("============> 1 ",this.productos);
          
          let tamPRO = this.productos.length;
          this.totalS = total;
          this.subTotal12 = 0;
          this.subTotalcero = 0;
          this.subTotal = 0;
          this.iva12 = 0;
          for (let j = 0; j < tamPRO; j++) {
            // this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
            if(this.productos[j].ivaporcent == 12){
              this.subTotal12 += parseFloat(this.productos[j].itemprecio) * parseFloat(this.productos[j].cant)
              this.iva12 += parseFloat(this.productos[j].iva)  * parseFloat(this.productos[j].cant);
              // console.log("entra");
            }
             if(this.productos[j].ivaporcent == 0){ 
              this.subTotalcero += parseFloat(this.productos[j].itemprecio)  * parseFloat(this.productos[j].cant)
              // console.log(this.subTotalcero);  
            }
          }
          this.subTotal = this.subTotalcero + this.subTotal12;
          costopromedio = total * cant;
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
itemprecio = parseFloat(this.getPrecioItem(i)) ;
// itemprecio = parseFloat(getPrecioItem(i)) ;
if ((ivaporcent) == 12) {
  // console.log("entra");
  
  iva =  (itemprecio*ivaporcent)/100;
  // console.log(iva);
  
  total = itemprecio + iva
  costopromedio = total *cant;
  // console.log(total);
  
} else if (ivaporcent == 0) { 
  // console.log("entra 2");
  
  iva = 0;
  total = itemprecio + iva;
  costopromedio = total *cant;
  
} else if (ivaporcent == 8) {
  iva = (itemprecio*ivaporcent)/100
  total = itemprecio + iva;
  costopromedio = total *cant;
  
}
// costopromedio = total * cant;

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
// this.totalS = total;
// this.totalS = total;


pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id  };
this.productos.push(pys);

// console.log("============> 2 ",this.productos);
let tamPRO = this.productos.length;
// this.productos.push(pys);
// let tamPRO = pedPro[0].productos.length;
          this.totalS = total;
          this.subTotal12 = 0;
          this.subTotalcero = 0;
          this.subTotal = 0;
          this.iva12 = 0;
          for (let j = 0; j < tamPRO; j++) {
            // this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
            if(this.productos[j].ivaporcent == 12){
              this.subTotal12 += parseFloat(this.productos[j].itemprecio) * parseFloat(this.productos[j].cant)
              this.iva12 += parseFloat(this.productos[j].iva)  * parseFloat(this.productos[j].cant);
              // console.log("entra");
            }
             if(this.productos[j].ivaporcent == 0){ 
              this.subTotalcero += parseFloat(this.productos[j].itemprecio)  * parseFloat(this.productos[j].cant)
              // console.log(this.subTotalcero);  
            }
          }
          this.subTotal = this.subTotalcero + this.subTotal12;
          costopromedio = total * cant;


// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
//   // console.log("LO que imprimo => "+ this.total);
// }
    }

   }else{
tiposprecio = this.precioDefecto;
// let t = Number( getPrecioItem(i));
// total = t;


// if(ivaporcent=='12'){
// iva = (total*0.12);
// itemprecio= total-iva;


// }
// else if(ivaporcent=='0'){
//   itemprecio = total;
//   iva = 0;

// }else if(ivaporcent=='0'){
//   iva = total*0.08;
//   itemprecio= total-iva;
// }
// itemprecio = parseFloat(getPrecioItem(i)) ;
itemprecio = parseFloat(this.getPrecioItem(i)) ;
if ((ivaporcent) == 12) {
  // console.log("entra");
  
  iva =  (itemprecio*ivaporcent)/100;
  // console.log(iva);
  
  total = itemprecio + iva
  costopromedio = total *cant;
  // console.log(total);
  
} else if (ivaporcent == 0) { 
  // console.log("entra 2");
  
  iva = 0;
  total = itemprecio + iva;
  costopromedio = total *cant;
  
} else if (ivaporcent == 8) {
  iva = (itemprecio*ivaporcent)/100
  total = itemprecio + iva;
  costopromedio = total *cant;
  
}
costopromedio = total * cant;
// this.totalS = total;
costopromedio =total * cant;
pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id};
this.productos.push(pys);
// console.log("============> 3 ",this.productos);
this.formProductoServicio.setValue({
  'cantidad':1,
  'tecnicoS':this.tecnicoDefectoId,
  'servicio': this.servicioDefectoId,
  'alias': ''
})
   }
   let tamPRO = this.productos.length;
   this.totalS = total;
   this.total =0;
   this.subTotal12 = 0;
   this.subTotalcero = 0;
   this.subTotal = 0;
   this.iva12 = 0;
   for (let j = 0; j < tamPRO; j++) {
     this.total += parseFloat(this.productos[j].costopromedio);
     if(this.productos[j].ivaporcent == 12){
       this.subTotal12 += parseFloat(this.productos[j].itemprecio) * parseFloat(this.productos[j].cant)
       this.iva12 += parseFloat(this.productos[j].iva)  * parseFloat(this.productos[j].cant);
       // console.log("entra");
     }
      if(this.productos[j].ivaporcent == 0){ 
       this.subTotalcero += parseFloat(this.productos[j].itemprecio)  * parseFloat(this.productos[j].cant)
       // console.log(this.subTotalcero);  
     }
   }
   this.subTotal = this.subTotalcero + this.subTotal12;
   costopromedio = total * cant;

}

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
enviarDatosVehiculo(form: any) {

  let arrayIdAtributosAcrear = new Array(this.datosVehiculo.length);
  let arrayValoresaCrear = new Array(this.datosVehiculo.length);

  for (let i = 0; i < this.datosVehiculo.length; i++) {
    arrayIdAtributosAcrear[i] = this.datosVehiculo[i].equipoattr_id;
    // arrayValoresaCrear[i] = arregloValoresAuto2(i, this.datosVehiculo.length);
    arrayValoresaCrear[i] = this.arregloValoresAuto2(i, this.datosVehiculo.length);

  }

 
  form.equipoattr_id = arrayIdAtributosAcrear;
  form.valor = arrayValoresaCrear;
  form.cliente_id = this.cliente_id;
  form.bodega_id = this.bodega_id;
  form.user_id = this.user_id;
  // console.log('enviarDatos', form);
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

  form.equipoattr_id = arrayIdAtributosAcrear;
  form.valor = arrayValoresaCrear;
  form.cliente_id = this.cliente_id;
  form.bodega_id = this.bodega_id;
  form.user_id = this.user_id;
  // console.log('Form ingresar datos', form);
}

// ========================== QUITAR PRODUCTO ================================
quitarProducto(idE:any, pedPro:any){

  // console.log("posición que me llega =>", idE);
   let arreglo = pedPro;
  //  console.log(" -- ARREGLO ---",arreglo);
  let arregloPedido:any=[];
  for (let i = 0; i < arreglo.length; i++) {

    // console.log('id son => ', i);

    if(i != idE){

      arregloPedido.push(arreglo[i]);
  // console.log('id que continúan son = > ', i);
  
    }

  }
  pedPro= arregloPedido;
  this.productos = pedPro;
  
  // console.log('resultado', this.productos);

  let tamPRO = this.productos.length;
// console.log("tamPRO", tamPRO);
this.total=0;
this.total = 0;
this.subTotal12 = 0;
this.subTotalcero = 0;
this.subTotal = 0;
this.iva12 = 0;
for (let j = 0; j < tamPRO; j++) {
  this.total += parseFloat(this.productos[j].costopromedio);
  if(parseFloat(this.productos[j].ivaporcent) == 12){
    this.subTotal12 += parseFloat(this.productos[j].itemprecio) * parseFloat(this.productos[j].cant)
    this.iva12 += (parseFloat(this.productos[j].iva)* parseFloat(this.productos[j].cant))
    // console.log("entra");
  }
   if(parseFloat(this.productos[j].ivaporcent) == 0){ 
    this.subTotalcero += (parseFloat(this.productos[j].itemprecio)* parseFloat(this.productos[j].cant))
    // console.log(this.subTotalcero);  
  }
}
this.subTotal = this.subTotal12+ this.subTotalcero;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
// }

}

enviarPedido(pedPro:any, posicion:any){

  let arr = pedPro;
  let posicionArreglo = arr[posicion];
  this.productoFormCantidad = [posicionArreglo];
 
  this.position = posicion;
  this.idOrden = posicionArreglo.producto_id;
  this.enviarProducto = posicionArreglo.cant;

  // this.position = posicion;
// this.idOrden = posicionArreglo[0].producto_id;
    // this.enviarProducto = posicionArreglo[0].cant;
    this.aliasGlobal = this.productoFormCantidad[0].alias;
    this.tecSeleccionado = this.productoFormCantidad[0].tecnico_nombres+' '+this.productoFormCantidad[0].tecnico_apellidos;
    this.tecNombre = this.productoFormCantidad[0].tecnico_nombres;
    this.idTecSeleccionado = this.productoFormCantidad[0].tecnico_id;
    this.servSelecccionado = this.productoFormCantidad[0].tipo;
    this.idServSeleccionado = this.productoFormCantidad[0].tiposervicio_id;
  

  this.formCantidad.setValue({
    'c': this.productoFormCantidad[0].cant,
    // 'precio': this.decimalP.transform(this.productoFormCantidad[0].total,'.0-2')
    'precio': this.productoFormCantidad[0].itemprecio,
    'nombreT':this.idTecSeleccionado,
    'nombreS':this.idServSeleccionado,
    'nombreA':this.productoFormCantidad[0].alias
  })
  
  
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
      let bodega_id = arreglo.bodega_id;
      let ivaporcent = arreglo.ivaporcent;
      let tecnico_id = form.nombreT;
      // let total = precio;
      let iva = (precio * ivaporcent) / 100;
      let itemprecio = precio;
      let total = itemprecio + iva;
      let pys;
      let costopromedio = cant * total;
      let tecnico_apellidos: any;
      let tecnico_nombres: any;
      let tipo = '';
      let total_itemprecio = itemprecio * cant;
      let total_iva =  iva *cant;

  // let precio = parseFloat(form.precio);
  // let arreglo = pedPro[this.position];
  //   let producto_id = this.idOrden;
  //   // console.log("id Producto a agregar => ", producto_id);
    
  //   let esservicio = arreglo.esservicio;
  //   let productname = arreglo.productname;
  //   let cant = form.c;
  //   let tiposprecio = arreglo.tiposprecio;
  //   let bodega_id = arreglo.bodega_id;
  //   let ivaporcent = arreglo.ivaporcent;
  //   // let tecnico_id = arreglo.tecnico_id;
  //   let tecnico_id = form.nombreT;

  //   let total= precio;
  //   let iva = (total*ivaporcent)/100;
  //   let itemprecio = total - iva;
  //   let pys;
  //   let costopromedio= cant*total;
  //   let tecnico_apellidos:any;
  //   let tecnico_nombres:any;
  //   let tipo ='';


      // ==== OBTENER TECNICO =======
      for (let y = 0; y < this.tecnicos.length; y++) {
     
        if(form.nombreT == this.tecnicos[y].id){
  
          tecnico_apellidos = this.tecnicos[y].apellidos;
          tecnico_nombres = this.tecnicos[y].nombres;
          
        }
        
      }
  
      // ==== OBTENER SERVICIO =======
      for (let z = 0; z < this.servicios.length; z++) {
       
        if(form.nombreS == this.servicios[z].id){
  
          tipo = this.servicios[z].tipo;
          
        }
        
      }

      let tiposervicio_id = form.nombreS;
    // let tiposervicio_id = arreglo.tiposervicio_id;
    // let alias = arreglo.alias;
    let alias = form.nombreA;

    this.quitarProducto(this.position, pedPro);  
    pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tecnico_apellidos, tecnico_nombres, tipo , tiposervicio_id, tecnico_id};
    this.productos.push(pys);
    let tamPRO = this.productos.length;
this.total=0;
// let tamPRO = pedPro[0].productos.length;
// this.total = 0;
this.subTotal12 = 0;
this.subTotalcero = 0;
this.subTotal = 0;
this.iva12 = 0;
for (let j = 0; j < tamPRO; j++) {
  this.total += parseFloat(this.productos[j].costopromedio);
  if(parseFloat(this.productos[j].ivaporcent) == 12){
    this.subTotal12 += parseFloat(this.productos[j].itemprecio) * parseFloat(this.productos[j].cant)
    this.iva12 += (parseFloat(this.productos[j].iva)* parseFloat(this.productos[j].cant))
    // console.log("entra");
  }
   if(parseFloat(this.productos[j].ivaporcent) == 0){ 
    this.subTotalcero += (parseFloat(this.productos[j].itemprecio)* parseFloat(this.productos[j].cant))
    // console.log(this.subTotalcero);  
  }
}
this.subTotal = this.subTotalcero + this.subTotal12;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
//   // console.log("LO que imprimo => "+ this.total);
// }

    this.cerrarModal();
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

  // ==================================== Crear COTIZACION  ==================================== 
crearCotizacion(form:any,ps:any){
// console.log(form);

  const dato1 = localStorage.getItem("Inflogueo");
    let datos;
   if(dato1) {
    this.datosLocalStorage=JSON.parse(dato1);
     datos = this.datosLocalStorage; 
    }else console.log("ERROR");
    let infAcceso1 =  Object.values(this.datosLocalStorage);
    // console.log('inf login', infAcceso1);
    let ptvid = infAcceso1[2][0].puntoventa_id;
    let b_id = infAcceso1[2][0].bodega_id;
    let uid = infAcceso1[1][0].id;
    // console.log('punto venta_id',ptvid);

    //GLOBALES
    this.puntoventa_id = ptvid;
    this.bodega_id = b_id;
    this.user_id = uid;

  if(this.cliente_id && form.servicio_id){
    if((form.tecnico_id2).length == 0){
          if (this.tamAtributos != 0) {
            this.ingresarDatosVehiculo(form);   
          } else if (this.datosVehiculo.length > 0 && this.tamAtributos == 0) {
            this.enviarDatosVehiculo(form);
          }
    
        let puntoventa_id = this.puntoventa_id
        let bodega_id = this.bodega_id;
        let user_id = this.user_id
        let secuencia = this.secuencia;
        let cliente_id = this.cliente_id;

      let tamArreglo = ps.length;
      let productos = ps;
      let arrayAlias = new Array(tamArreglo);
      let arrayProducto_id = new Array(tamArreglo);
      let arrayProductName= new Array(tamArreglo);
      let arrayTiposPrecio = new Array(tamArreglo);
      let arrayCant = new Array(tamArreglo);
      let arrayItemPrecio =new Array(tamArreglo);
      let arrayIvaPorCent = new Array(tamArreglo);
      let arrayIva = new Array(tamArreglo);
      let arrayTotal = new Array(tamArreglo);
      let arrayEsServicio = new Array(tamArreglo);
      let arrayCostoProducto = new Array(tamArreglo);
      let arrayTecnicos = new Array(tamArreglo);
      let arrayTipoServicioId = new Array(tamArreglo);
      
    
      for (let i = 0; i < tamArreglo; i++) {
    
        let p_alias = productos[i].alias;
        let p_i = productos[i].producto_id;
        let p_n = productos[i].productname;
        let t_p = productos[i].tiposprecio;
        let c = productos[i].cant;
        
        let i_p = productos[i].itemprecio;
        let iv_p = productos[i].ivaporcent;
        let iva = productos[i].iva;
        let t = productos[i].total;
        let e_s = productos[i].esservicio;
        let c_p = productos[i].costopromedio;
    
        let t_s_id =productos[i].tiposervicio_id;
    
        let tec_id = productos[i].tecnico_id;
    
        arrayAlias[i]=p_alias;
        arrayProducto_id[i]=p_i;
        arrayProductName[i]=p_n;
        arrayTiposPrecio[i]= t_p;
        arrayCant[i]= c;
        arrayItemPrecio[i]= i_p;
        arrayIvaPorCent[i]= iv_p;
        arrayIva[i]= iva;
        arrayTotal[i]= t;
        arrayEsServicio[i]= e_s;
        arrayCostoProducto[i]=c_p;
        arrayTipoServicioId[i]=t_s_id;
    
        arrayTecnicos[i]= tec_id;
    
      }
      form.alias= arrayAlias;
      form.producto_id = arrayProducto_id;
      form.productname = arrayProductName;
      form.tiposprecio = arrayTiposPrecio;
      form.tecnico_id2 = this.tecnicoDefectoId;
      form.cant = arrayCant;
      form.itemprecio = arrayItemPrecio;
      form.ivaporcent = arrayIvaPorCent;
      form.iva = arrayIva;
      form.total = arrayTotal;
      form.bodega_id = bodega_id;
      form.esservicio = arrayEsServicio;
      form.costopromedio = arrayCostoProducto;
      form.puntoventa_id = puntoventa_id;
      form.tecnico_id = arrayTecnicos
      form.tiposervicio_id = arrayTipoServicioId;
      form.user_id = user_id   

      // console.log(form);
      

      if( form.valor[0] == '' ){
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Campos del vehículo no pueden ir en blanco',
          confirmButtonColor: '#818181'     
        });
  
      }else{
    
      // console.log('formulario que se envía', form);
    
          let dataform = new FormData();
    
          dataform.append("cliente_id", cliente_id);
          dataform.append("problema", form.problema);
          dataform.append("secuencia", secuencia);
          dataform.append("equipoattr_id", form.equipoattr_id);
          dataform.append("valor", form.valor);
          dataform.append("servicio_id", form.servicio_id);
          dataform.append("tecnico_id2", this.tecnicoDefectoId);
          dataform.append("producto_id", form.producto_id);
          dataform.append("productname", form.productname);
          dataform.append("tiposprecio", form.tiposprecio);
          dataform.append("cant", form.cant);
          dataform.append("itemprecio", form.itemprecio);
          dataform.append("iva", form.iva);
          dataform.append("ivaporcent", form.ivaporcent);
          dataform.append("total", form.total);
          dataform.append("costopromedio", form.costopromedio);
          dataform.append("esservicio", form.esservicio);
          dataform.append("tiposervicio_id", form.tiposervicio_id);
          dataform.append("tecnico_id", form.tecnico_id)
          dataform.append("alias", form.alias)
          dataform.append("puntoventa_id", puntoventa_id);
          dataform.append("bodega_id", bodega_id);
          dataform.append("user_id", user_id);
    

//  console.log(dataform.get('equipoattr_id'));
//         console.log('CLIENTE ID',dataform.get('cliente_id'));
//         console.log('PROBLEMA',dataform.get('problema'));
//         console.log('SECUIENCIA',dataform.get('secuencia'));
//         console.log("ATRIBUTO ID",dataform.get('equipoattr_id'));
//         console.log("ATRIBUTO VALOR",dataform.get('valor'));
//         console.log("SERVICIO ID",dataform.get('servicio_id'));
//         console.log("TECNICO ID",dataform.get('tecnico_id2'));
//         console.log("Producto ID",dataform.get('producto_id'));
//         console.log("ProductName",dataform.get('productname'));
//         console.log("Tipos precio",dataform.get('tiposprecio'));
//         console.log("Cantidad",dataform.get('cant'));
//         console.log("Item precio",dataform.get('itemprecio'));
//         console.log("Iva",dataform.get('iva'));
//         console.log("Ivaporcent",dataform.get('ivaporcent'));
//         console.log("total",dataform.get('total'));
//         console.log("Costopromedio",dataform.get('costopromedio'));
//         console.log("Es servicio",dataform.get('esservicio'));
//         console.log("Tipo servicio",dataform.get('tiposervicio_id'));
//         console.log("Tipo tecnico_id",dataform.get('tecnico_id'));
//         console.log("Alias",dataform.get('alias'));
//         console.log('PUNTO VENTA ID',dataform.get('puntoventa_id'));
//         console.log('BODEGA_ID',dataform.get('bodega_id'));
//         console.log('USER ID',dataform.get('user_id'));
        

            Swal.fire({
              title: 'Enviar Cotización',
              text: '¿Desea enviar la cotización al correo: '+ this.email + '?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#B5B5B5',
              cancelButtonColor: '#F51F36',
              cancelButtonText:'No',
              confirmButtonText: '¡Si, enviar!',
            }).then((result) => {
              if (result.isConfirmed) {


                if(this.correo==''){
                  Swal.fire({
                    allowOutsideClick:false,
                    icon:'info',
                    title:'Usuario sin correo',
                    text:'Usuario no tiene registrado un correo electrónico' ,
                    });
                }else{
                  // console.log("ENTRA ACa");
        this.allService.postAL(dataform,'cotizacion/insert').subscribe((data:any) =>{
            Swal.fire({
              allowOutsideClick:false,
              icon:'info',
              title:'Creando cotización',
              text:'Se está creando la cotización, espere por favor' ,
              });
              Swal.showLoading();
            if(data.rta == true){ 
            Swal.close
               Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Cotizacion Creada!',
                text: 'Cotizacion creada con éxito',
                timer: 1500,
                showConfirmButton:false
              });
              let tipo = 'cotizacion';
    let accion="ver";
    this.allService.getForOrden(data.id,tipo,accion).then((data:any)=>{
      // console.log(data);
      
      let url = data.slice(1);
      // console.log(url);
      // console.log(data.id);
      let link = this.allService.getUrlBaseTallerSINCORS();
      const a_target = this._router.serializeUrl(
        this._router.createUrlTree([link+url])
      );
      let r = a_target.slice(1);
      // console.log(r);
      window.open(r, '_blank');
    })

    let tipo1 = 'cotizacion';
    let accion1="send";
    let empresa = this.getNombreEmpresa();
  
    this.allService.getAl('hacer_pdf/'+accion1+'?oa_id='+data.id+'&tipo='+tipo1+'&emp='+empresa).then((data:any)=>{
      if(data.rta == undefined){
          Swal.close(); 
          Swal.fire({
            allowOutsideClick:false,
            icon:'success',
            title:'Cotización envíada al correo',
            text:'Se ha enviado cotización al correo',
            timer:1500,
            showConfirmButton:false
            // text:'Se ha enviado cotización al correo'+data.msg
          
          });
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


    let accion2='delete';

  setTimeout(() => {
    
    this.allService.getForOrden(data.id, tipo, accion2).then((data:any)=>{
    })
    
   }, 10000);
              this.refresh();



            }else{
              Swal.fire({
                allowOutsideClick: false,
                icon: 'error',
                title: 'Cotizacion no se pudo crear!',
                text: 'La cotizacion no se pudo guardar',
                timer: 1500,
                showConfirmButton:false
              })
            }
              
          },(error)=>{
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Cotizacion no se pudo crear!',
              text: 'Agregue productos/servicios ó Designe un vehículo a la cotización',
              confirmButtonColor: '#818181',
              // timer: 1200,
            })
          })
          }
        } else 
        if ( result.dismiss === Swal.DismissReason.cancel) {
    
          this.allService.postAL(dataform,'cotizacion/insert').subscribe((data:any) =>{        
            if(data.rta == true){ 
              Swal.close
                 Swal.fire({
                  allowOutsideClick: false,
                  icon: 'success',
                  title: 'Cotizacion Creada!',
                  text: 'Cotizacion creada con éxito',
                  showConfirmButton: false,
                  timer: 1500
                });
                let tipo = 'cotizacion';
      let accion="ver";
      this.allService.getForOrden(data.id,tipo,accion).then((data:any)=>{
        let url = data.slice(1);
        let link = this.allService.getUrlBaseTallerSINCORS();
        const a_target = this._router.serializeUrl(
          this._router.createUrlTree([link+url])
        );
        let r = a_target.slice(1);
        window.open(r, '_blank');
      })
      let accion2='delete';
      setTimeout(() => {  
        this.allService.getForOrden(data.id, tipo, accion2).then((data:any)=>{        
        }) 
       }, 10000);
       this.refresh();
    
              }else{
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Cotizacion no se pudo crear!',
                  text: 'La cotizacion no se pudo guardar',
                  showConfirmButton: false,
                  timer: 2000
                })
              }
          })
        }
      });
      }
        
  
    }else if(!form.tecnico_id ) {
  
      // idTECD = form.tecnico_id;
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Creando cotización',
      text:'Se está creando la cotización, espere por favor' ,
      });
      Swal.showLoading();
        
        if (this.atributos.length != 0) {
          this.ingresarDatosVehiculo(form);
    
        } else if (this.datosVehiculo.length > 0 || this.atributos.length != 0) {
          this.enviarDatosVehiculo(form);
        }
  
      let puntoventa_id = this.puntoventa_id
      let bodega_id = this.bodega_id;
      let user_id = this.user_id
        let secuencia = this.secuencia;
        let cliente_id = this.cliente_id;
  
   
   let tamArreglo = ps.length;
   let productos = ps;
  //  console.log("tam del arreglo => ", tamArreglo, '----->',productos);
   
  
    
    let arrayAlias = new Array(tamArreglo);
    let arrayProducto_id = new Array(tamArreglo);
    let arrayProductName= new Array(tamArreglo);
    let arrayTiposPrecio = new Array(tamArreglo);
    let arrayCant = new Array(tamArreglo);
    let arrayItemPrecio =new Array(tamArreglo);
    let arrayIvaPorCent = new Array(tamArreglo);
    let arrayIva = new Array(tamArreglo);
    let arrayTotal = new Array(tamArreglo);
    let arrayEsServicio = new Array(tamArreglo);
    let arrayCostoProducto = new Array(tamArreglo);
    let arrayTecnicos = new Array(tamArreglo);
    let arrayTipoServicioId = new Array(tamArreglo);
    
  
    for (let i = 0; i < tamArreglo; i++) {
  
      let p_alias = productos[i].alias;
      let p_i = productos[i].producto_id;
      let p_n = productos[i].productname;
      let t_p = productos[i].tiposprecio;
      let c = productos[i].cant;
      
      let i_p = productos[i].itemprecio;
      let iv_p = productos[i].ivaporcent;
      let iva = productos[i].iva;
      let t = productos[i].total;
      let e_s = productos[i].esservicio;
      let c_p = productos[i].costopromedio;
  
      let t_s_id =productos[i].tiposervicio_id;
  
      let tec_id = productos[i].tecnico_id;
  
      arrayAlias[i]=p_alias;
      arrayProducto_id[i]=p_i;
      arrayProductName[i]=p_n;
      arrayTiposPrecio[i]= t_p;
      arrayCant[i]= c;
      arrayItemPrecio[i]= i_p;
      arrayIvaPorCent[i]= iv_p;
      arrayIva[i]= iva;
      arrayTotal[i]= t;
      arrayEsServicio[i]= e_s;
      arrayCostoProducto[i]=c_p;
      arrayTipoServicioId[i]=t_s_id;
  
      arrayTecnicos[i]= tec_id;
  
    }
    form.alias= arrayAlias;
    form.producto_id = arrayProducto_id;
    form.productname = arrayProductName;
    form.tiposprecio = arrayTiposPrecio;
    // form.cant = arrayCant;
    form.cant = arrayCant;
    form.itemprecio = arrayItemPrecio;
    form.ivaporcent = arrayIvaPorCent;
    form.iva = arrayIva;
    form.total = arrayTotal;
    form.bodega_id = bodega_id;
    form.esservicio = arrayEsServicio;
    form.costopromedio = arrayCostoProducto;
    form.puntoventa_id = puntoventa_id;
    form.tecnico_id = arrayTecnicos
    form.tiposervicio_id = arrayTipoServicioId;
    form.user_id = user_id
  
    // console.log('formulario que se envía', form);

    if( form.valor[0] == '' ){
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Campos del vehículo no pueden ir en blanco',
        confirmButtonColor: '#818181'
    
      });

    }else{
  
        let dataform = new FormData();
  
        dataform.append("cliente_id", cliente_id);
        dataform.append("problema", form.problema);
        dataform.append("secuencia", secuencia);
        dataform.append("equipoattr_id", form.equipoattr_id);
        dataform.append("valor", form.valor);
        dataform.append("servicio_id", form.servicio_id);
        dataform.append("tecnico_id2", form.tecnico_id2);
        dataform.append("producto_id", form.producto_id);
        dataform.append("productname", form.productname);
        dataform.append("tiposprecio", form.tiposprecio);
        dataform.append("cant", form.cant);
        dataform.append("itemprecio", form.itemprecio);
        dataform.append("iva", form.iva);
        dataform.append("ivaporcent", form.ivaporcent);
        dataform.append("total", form.total);
        dataform.append("costopromedio", form.costopromedio);
        dataform.append("esservicio", form.esservicio);
        dataform.append("tiposervicio_id", form.tiposervicio_id);
        dataform.append("tecnico_id", form.tecnico_id)
        dataform.append("alias", form.alias)
        dataform.append("puntoventa_id", puntoventa_id);
        dataform.append("bodega_id", bodega_id);
        dataform.append("user_id", user_id);
  
      
  
        // console.log(dataform.get('equipoattr_id'));
        // console.log('CLIENTE ID',dataform.get('cliente_id'));
        // console.log('PROBLEMA',dataform.get('problema'));
        // console.log('SECUIENCIA',dataform.get('secuencia'));
        // console.log("ATRIBUTO ID",dataform.get('equipoattr_id'));
        // console.log("ATRIBUTO VALOR",dataform.get('valor'));
        // console.log("SERVICIO ID",dataform.get('servicio_id'));
        // console.log("TECNICO ID",dataform.get('tecnico_id2'));
        // console.log("Producto ID",dataform.get('producto_id'));
        // console.log("ProductName",dataform.get('productname'));
        // console.log("Tipos precio",dataform.get('tiposprecio'));
        // console.log("Cantidad",dataform.get('cant'));
        // console.log("Item precio",dataform.get('itemprecio'));
        // console.log("Iva",dataform.get('iva'));
        // console.log("Ivaporcent",dataform.get('ivaporcent'));
        // console.log("total",dataform.get('total'));
        // console.log("Costopromedio",dataform.get('costopromedio'));
        // console.log("Es servicio",dataform.get('esservicio'));
        // console.log("Tipo servicio",dataform.get('tiposervicio_id'));
        // console.log("Tipo tecnico_id",dataform.get('tecnico_id'));
        // console.log("Alias",dataform.get('alias'));
        // console.log('PUNTO VENTA ID',dataform.get('puntoventa_id'));
        // console.log('BODEGA_ID',dataform.get('bodega_id'));
        // console.log('USER ID',dataform.get('user_id'));
  
        // if(form.cliente_id == undefined){
        //   Swal.fire({
        //     icon: 'error',
        //     title: '¡Error!',
        //     text: 'Debe asignar un cliente a la orden',
        //     timer: 500
    
        //   });
    
    
          
    
        // }else{
          Swal.fire({
            title: 'Enviar Cotización',
            text: '¿Desea enviar la cotización al correo: '+ this.email + '?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#B5B5B5',
            cancelButtonColor: '#F51F36',
            cancelButtonText:'No',
            confirmButtonText: '¡Si, enviar!',
          }).then((result) => {
            if (result.isConfirmed) {
              if(this.correo==''){
                Swal.fire({
                  allowOutsideClick:false,
                  icon:'info',
                  title:'Usuario sin correo',
                  text:'Usuario no tiene registrado un correo electrónico' ,
                  });
              }else{
  
        this.allService.postAL(dataform,'cotizacion/insert').subscribe((data:any) =>{
          // console.log(data);
          
          if(data.rta == true){ 
            Swal.close
               Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Cotizacion Creada!',
                text: 'Cotizacion creada con éxito',
                showConfirmButton: false,
                timer: 1500
              });
              let tipo = 'cotizacion';
    let accion="ver";
    this.allService.getForOrden(data.id,tipo,accion).then((data:any)=>{
      let url = data.slice(1);
      let link = this.allService.getUrlBaseTallerSINCORS();
      const a_target = this._router.serializeUrl(
        this._router.createUrlTree([link+url])
      );
      let r = a_target.slice(1);
      // console.log(r);
      window.open(r, '_blank');
    })

    let tipo1 = 'cotizacion';
    let accion1="send";
    let empresa = this.getNombreEmpresa();
  
    this.allService.getAl('hacer_pdf/'+accion1+'?oa_id='+data.id+'&tipo='+tipo1+'&emp='+empresa).then((data:any)=>{
      if(data.rta == undefined){
          Swal.close(); 
          Swal.fire({
            allowOutsideClick:false,
            icon:'success',
            title:'Cotización envíada al correo',
            text:'Se ha enviado cotización al correo',
            timer:1500,
            showConfirmButton:false
            // text:'Se ha enviado cotización al correo'+data.msg
          
          });
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

    let accion2='delete';
    setTimeout(() => {  
      this.allService.getForOrden(data.id, tipo, accion2).then((data:any)=>{        
      }) 
     }, 10000);
     this.refresh();

            }else{
              Swal.fire({
                allowOutsideClick: false,
                icon: 'error',
                title: 'Cotizacion no se pudo crear!',
                text: 'La cotizacion no se pudo guardar',
                showConfirmButton: false,
                timer: 2000
              })
            }
        })
      }
    } else 
    if ( result.dismiss === Swal.DismissReason.cancel) {

      this.allService.postAL(dataform,'cotizacion/insert').subscribe((data:any) =>{        
        if(data.rta == true){ 
          Swal.close
             Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cotizacion Creada!',
              text: 'Cotizacion creada con éxito',
              showConfirmButton: false,
              timer: 1500
            });
            let tipo = 'cotizacion';
  let accion="ver";
  this.allService.getForOrden(data.id,tipo,accion).then((data:any)=>{
    let url = data.slice(1);
    let link = this.allService.getUrlBaseTallerSINCORS();
    const a_target = this._router.serializeUrl(
      this._router.createUrlTree([link+url])
    );
    let r = a_target.slice(1);
    window.open(r, '_blank');
  })
  let accion2='delete';
  setTimeout(() => {  
    this.allService.getForOrden(data.id, tipo, accion2).then((data:any)=>{        
    }) 
   }, 10000);
   this.refresh();

          }else{
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: 'Cotizacion no se pudo crear!',
              text: 'La cotizacion no se pudo guardar',
              showConfirmButton: false,
              timer: 2000
            })
          }
      })
      // alert("CASO B")
    }
  });

  
    }
  
  }

  }else{    
    Swal.fire({
    icon: 'error',
    title: '¡Error!',
    text: 'No se puede enviar un formulario vacío',
    confirmButtonColor: '#818181',
    
    }) 

  }

}

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

datosLS(){
  const dato = localStorage.getItem("Inflogueo");
    let datos;
  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
     datos = this.datosLocalStorage;
    
  }else console.log("ERROR");

  return datos;
}

cerrarModal2(){
  this.modal.close();
  this.formValidarIdentifiacion.reset();
  this.formRegistrarCliente.reset();
}

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

        this.formRegistrarCliente.get('cedula')?.setValue(this.cedulaGlobal);
        this.formRegistrarCliente.get('tipoCli')?.setValue(this.tipoUsuarioID);
        
        this.tipoDocumento = data.valor;

      }
   })

   return  this.tipoDocumento;

}

registrarCliente(form:any){

//BODEGA ID
const dato = localStorage.getItem("Inflogueo");

  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
    
  }else console.log("ERROR");
  
  let infAcceso =  Object.values(this.datosLocalStorage);
  
// console.log(infAcceso);

      let uid = infAcceso[2][0].empleado_id;
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
    timer:900
    });
  
  })
  
  
  }

}
