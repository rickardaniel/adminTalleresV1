import { DatePipe,DecimalPipe,Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { productoWORK } from '../../Modelos/arregloItemP.model';
declare function exportarReporteExcelC() :any;
// declare function arregloValoresAuto(i: any, tam: any): any;
declare function cerrarModal(params:string):any;
declare function cerrarModal1(params:string):any;
// declare function arregloAlias(i:any):any;
declare function abrirModalCodigo(params:string, params1:string):any;
declare function abrirModalCodigo1(params:string):any;
declare function getStock(i:any):any;
// declare function getPrecioItem(i:any):any;




@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {

   //FECHAS
   fi:any;
   ff:any;

   // Tabla PyS
   ps: productoWORK[];
   page = 1;
   pageSize = 5;
   collectionSize:any;
   productoServicio:any=[];

     //INFO REPORTE
  infReporte:any=[];
  searchText: string = '';
  previous: string;

    //ARREGLO PROVISIONAL
    arregloProvisional:any=[];

    placa1:any;
    marca1:any;
    kilometraje:any;

  // control stock
  controlStock:any;
    
//Total
total:any;


    //Banderas
    banderaPaginador = true;
    banderaPaginador2 = false;
    banderaSearchExcel= false;

    //Modal
    modal:any;
    modal1:any;
    idOrden:any;
    idOrdenFinal:any;

    //Atributos Vehiculo
    atributos:any;

    //ProductosOrden
    productos:any=[];
    //ProductoServicio
    infProducto:any=[];

    //Datos LocalStorage
datosLocalStorage: any[];
//BODEGA id
bodega_id:any;

    //Precio Defecto
precioDefectoCliente:any;
cliente_id :any;

//Nueva Cantidad

nuevaCantidad:any;
productoFormCantidad:any;
enviarProducto:any=[];
position:any;
// idOrden:any;

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
//Prioridad
prioridades:any=[];


banderaPaginacion:any;

banderaAliasAbrir:any;
banderaAliasCerrar:any;

 //GLOBALES
 puntoventa_id:any;
//  bodega_id : any;
 user_id : any;
 problema:any;
 tecnico:any;
 tecID:any;
 servicio:any;
 servID:any;
 prioridad:any;
 priID:any;

 //RESPUESTA METODO
 data:any;

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

        //nombre Empresa
        nombreEmpresa:any;

  @ViewChild(MdbTablePaginationComponent, { static: true })  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective; 

  @ViewChild("modalSelecionarPC ") modalSelecionarPC : TemplateRef<any> | undefined;
  @ViewChild("modalListarStock ") modalListarStock : TemplateRef<any> | undefined;

  constructor(
    private allService:AllServiceService,
    private pipefecha: DatePipe,
    private cdRef: ChangeDetectorRef,
    public _router: Router, public _location: Location,
    private modalService: NgbModal,
    private decimalP :DecimalPipe

  ) { }

  ngOnInit(): void {
    this.enviarTecnico();
    this.enviarServicio();
    this.enviarEstado1();
    this.enviarPrioridad();
    this.getControlStock()
    this.previous = this.mdbTable.getDataSource();
  }

  @HostListener('input') oninput() {
    this.searchItems();
  } 

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
        this.mdbTable.setDataSource(this.previous);
        this.arregloProvisional = this.mdbTable.getDataSource();      
    }

    if (this.searchText) {
        this.arregloProvisional = this.mdbTable.searchLocalDataBy(this.searchText);
        this.mdbTable.setDataSource(prev);
    }
}
ngAfterViewInit() {
  this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
  this.mdbTablePagination.calculateFirstItemIndex();
  this.mdbTablePagination.calculateLastItemIndex();
  this.cdRef.detectChanges();
}

// refreshPS() {
//   const PRS1 :productoServicio[]=this.productoServicio;  
//   this.collectionSize1 = PRS1.length;
//   if(this.collectionSize1 <= this.pageSize1){
//     this.banderaPaginacion = false;
//   }else{
//     this.banderaPaginacion = true;
//   }
//     this.ps = PRS1
//     .map((pys1: any, i1: number) => ({id1: i1 + 1, ...pys1}))
//     .slice((this.page1 - 1) * this.pageSize1, (this.page1 - 1) * this.pageSize1 + this.pageSize1);    
    
// }
refreshPyS() {
  const PRS1 :productoWORK[]=this.arregloItemP;  
  this.collectionSize = PRS1.length;
  if(this.collectionSize <= this.pageSize){
    this.banderaPaginacion = false;
  }else{
    this.banderaPaginacion = true;
  }
    this.ps = PRS1
    .map((pys: any, i: number) => ({id: i + 1, ...pys}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);    
    // console.log('PS',this.ps); 
}

  formReporte = new FormGroup({
    fechaI: new FormControl('', Validators.required),
    fechaF: new FormControl('', Validators.required),
    // idEstado: new FormControl('', Validators.required),
  })
  formBusquedaN = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(3), Validators.pattern('[a-z A-Z]{3,100}')]),
   
  })
  formBusquedaCU = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(1), Validators.pattern('[0-9]{1,6}')]),
   
  })
  formBusquedaCB = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4,20}')]),
   
  })
  formProductoServicio = new FormGroup({
    cantidad: new FormControl(""),
    tecnicoS: new FormControl('',Validators.required),
    servicio: new FormControl('',Validators.required),
    alias: new FormControl('',Validators.required),
  })

  formEditarVehiculo= new FormGroup({
    equipoattr_id : new FormControl(''),
    valor: new FormControl(''),
    problema:new FormControl(''),
    tecnico_id : new FormControl(''),
    servicio_id: new FormControl(''),
    prioridad_id : new FormControl('')
  })

  formCantidad = new FormGroup({
    c : new FormControl('', Validators.required),
    precio : new FormControl('', Validators.required),
    nombreT : new FormControl('', Validators.required),
    nombreS : new FormControl('', Validators.required),
    nombreA : new FormControl('', Validators.required),
  })
  formEditarPYS = new FormGroup({
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
  })

  // ======================MODALES==================================

  abrirModal (ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent, {size:'md'});
  }
  abrirModal1 (ModalContent: any): void {
    this.modal1 = this.modalService.open(ModalContent, {size:'xl'});
  }
  cerrarModal(){
    this.modal.close();
  }

  cerrarModal1(){
    this.modalService.dismissAll(this.modalListarStock);
  }

   // =========================METODOS=============================

enviarEstado1(){
  let fecha = new Date();
  let fecha2 = new Date();
  fecha2.setDate(fecha2.getDate() - 7)
  this.formReporte.setValue({
      'fechaI':this.pipefecha.transform (fecha2,'yyy-MM-dd','UTC'),
      'fechaF':this.pipefecha.transform (fecha,'yyy-MM-dd','UTC'),
    })
}

enviarTecnico() {
  this.allService.getAl('tecnico/todos').then((data) => {
    this.tecnicos = data;
    this.tecnicoDefectoN =this.tecnicos[0].nombres;
    this.tecnicoDefectoA =this.tecnicos[0].apellidos;

    this.tecnicoDefecto = this.tecnicos[0].nombres + this.tecnicos[0].apellidos;
    this.tecnicoDefectoId =this.tecnicos[0].id  

  });
}
enviarServicio() {
  this.allService.getAl('producto/activo').then((data) => {
    this.servicios = data;
      
    this.servicioDefecto = this.servicios[0].tipo;
    this.servicioDefectoId = this.servicios[0].id;
  });
} 

getControlStock(){
  this.allService.getAl('/producto/ver_stock').then((data:any)=>{
    this.controlStock = data;
    // console.log('controlar Stock',this.controlStock);
    

  })
}

enviarPrioridad() {
  this.allService.getAl('prioridad/activo_oa').then((data) => {
    this.prioridades = data;
  });
} 

  buscarInformacionReporte(form:any){

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Buscando Cotizaciones',
      text:'Se está buscando las cotizaciones, espere por favor' ,
      });
      Swal.showLoading();
    this.vaciarArreglo();
    this.fi= form.fechaI;
    this.ff= form.fechaF;

    // /cotizacion/all?desde=2022-03-04&hasta=2022-03-18&format=json
    this.allService.getAl("/cotizacion/all?desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
      this.infReporte = data;


      if(data.length ==0){
        Swal.fire({
          allowOutsideClick:false,
          icon:'error',
          title:'Sin resultados',
          text:'Intente con una fecha anterior',
          confirmButtonColor: '#818181'
  
          });
  
      }else{
      let bandera = data.rta;  
      
      if(bandera != false){
          Swal.fire({
            allowOutsideClick:false,
            icon:'info',
            title:'info',
            text:'Informacion encontrada',
            timer:1500,
            showConfirmButton:false
            });

            this.banderaSearchExcel= true;

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
                  if(atriNombre1 == 'MARCA'|| atriNombre == 'AÑO FABRICACION' ){
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
      
              // console.log("entrando", this.arregloProvisional);
        
        
              this.mdbTable.setDataSource(this.arregloProvisional);
              this.arregloProvisional = this.mdbTable.getDataSource();
              this.previous = this.mdbTable.getDataSource();
              this.banderaPaginador= false;
              let pag = document.getElementById('tablaPresentar');
              pag?.removeAttribute("hidden");
              let pag1 = document.getElementById('pag');
              pag1?.removeAttribute("hidden");

  
        }else{
  
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: this.infReporte.msg,
            timer:2000,
            showConfirmButton:false
      }) 
      }}
    })
  }


  visualizarPDF(id:any){
    // console.log("QUE PASA ", id);
    let tipo = 'cotizacion';
    let accion="ver";
    this.allService.getForOrden(id,tipo,accion).then((data:any)=>{
  
      // console.log(data);
      
      let url = data.slice(1);
  
      let link = this.allService.getUrlBaseTallerSINCORS();
      const a_target = this._router.serializeUrl(
        this._router.createUrlTree([link+url])
      );
      let r = a_target.slice(1);
      // console.log(r);
      window.open(r, '_blank');
    })
    let accion2='delete';
    setTimeout(() => {
      
      this.allService.getForOrden(id, tipo, accion2).then((data:any)=>{
        // console.log('SE EJECUTO',data);    
      })
     }, 20000);
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

  enviarCorreo(id:any){
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Envíando correo, espere por favor'
  
      });
      Swal.showLoading();
      let tipo = 'cotizacion';
      let accion="send";
      let empresa = this.getNombreEmpresa();
    
      this.allService.getAl('hacer_pdf/'+accion+'?oa_id='+id+'&tipo='+tipo+'&emp='+empresa).then((data:any)=>{
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
  }
  sendWhatsApp(id:any){
    
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Envíando WhatsApp, espere por favor'
  
      });
      Swal.showLoading();
      let tipo = 'cotizacion';
  
  //  this.allService.getAl('hacer_pdf/enviar_wa?oa_id='+id+'&tipo='+tipo).then((data:any)=>{
    this.allService.sendWhatsApp(+id,tipo).then((data:any)=>{
  
    // console.log("REspuesta => ", data);
    Swal.close();
    if(data==false){
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: '¡No se pudo enviar WhatsApp!',
        text: "Usuario no tiene registrado un número de teléfono",
        confirmButtonColor: '#818181'
     
      })
    }else{
      Swal.close();
      window.open(data, '_blank');
    }
    })
  }

  vaciarArreglo(){
  
    this.arregloProvisional.splice(0, this.arregloProvisional.length);
    this.arregloProvisional=[];

}

  cambiarAOrden(id:any){
    
    Swal.fire({
      title: 'Cambiar a Orden',
      text: '¿Está seguro de cambiar la cotización a orden de trabajo? ' ,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#818181',
      cancelButtonColor: '#F51F36',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, cambiar ahora!',

    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          allowOutsideClick:false,
          icon:'info',
          title:'info',
          text:'Realizando el cambio, espere por favor'
      
          });
          Swal.showLoading();

        this.allService.getAl('cotizacion/activar?id='+ id).then((data:any) => {
      
          

          // console.log("lo que responde", data);

          this.data = data;

          if(data.rta == false){

            Swal.close();
              this.modalService.open(this.modalListarStock,{ centered: true });

          }else{
            Swal.close();

            Swal.fire({
              allowOutsideClick:false,
              icon:'success',
              title:'Cambio realizado ',
              text:'Se ha eviado la cotizacion  al planeador',
              timer:2000,
              showConfirmButton:false
            });
          

          this.vaciarArreglo();   
          this.allService.getAl("/cotizacion/all?desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
            this.infReporte = data;
            let bandera = data.rta;  
              if(bandera != true){
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
                if(atriNombre1 == 'MARCA'|| atriNombre == 'AÑO FABRICACION' ){
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
          }
       
    
          // console.log("entrando", this.arregloProvisional);
 
          this.mdbTable.setDataSource(this.arregloProvisional);
          this.arregloProvisional = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
          
        })
        // Swal.fire({ title: 'Cambio realizado!',
        // text:  'Se ha cambiado la cotización a orden de trabajo',
        // icon: 'success',timer:500});

        }
        });
      }

 
  })
}

exportarEXCEL(){
  exportarReporteExcelC();
}

exportarPDF(){

  

  // exportarReportePDFC(this.arregloProvisional);

}

// ================================ EDITAR ORDEN ============================

enviarIdOrden(id:any){
  // console.log("id orden aqui =>", id);
  this.idOrden = id;
  this.idOrdenFinal = id;
  // abrirModalCodigo('#ModalCrear', 'openMG');
  }

enviarAtributoVehiculo(){
    let id = this.idOrden;
    // console.log("ID ORDEN", id);

    cerrarModal1('#ModalCrear');
    this.allService.getForID('orden_abierta', id).then((data:any)=>{
      let infoUsuario = [data];
      // console.log(infoUsuario);
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
  enviarDatosOrden(){
    let id = this.idOrden;
    // console.log("ID ORDEN", id);

    cerrarModal('#modalEO');
    
    this.allService.getForID('orden_abierta', id).then((data:any)=>{
      let infoUsuario = [data];
      // console.log(infoUsuario);
      this.atributos = infoUsuario[0].vehiculo;
      // console.log("datos vehiculo", this.atributos);
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
      arrayValoresaCrear[i] = this.arregloValoresAuto(i, tamDV);
      // arrayValoresaCrear[i] = arregloValoresAuto(i, tamDV);
  
    }
  
    form.equipoattr_id = arrayIdAtributosAcrear;
    form.valor = arrayValoresaCrear;
  
    // console.log('Form ingresar datos', form);
  }

  cerrarModalCodigo(modal:string){
    // console.log("nombre modal", modal);
    cerrarModal('#bd-example-modal-xl');
  }


  actualizarTabla(){
    this.vaciarArreglo();   
          this.allService.getAl("/cotizacion/all?desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
            this.infReporte = data;
            let bandera = data.rta;  
              if(bandera != true){
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
                if(atriNombre1 == 'MARCA'|| atriNombre == 'AÑO FABRICACION' ){
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
          }
          Swal.fire({ title: 'Cambio realizado!',
          text:  'Se ha cambiado la cotización a orden de trabajo',
          icon: 'success',timer:1500, showConfirmButton:false});
    
          // console.log("entrando", this.arregloProvisional);
 
          this.mdbTable.setDataSource(this.arregloProvisional);
          this.arregloProvisional = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
          
        })
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

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            }) 

          this.actualizarTabla();
  })

}else
if(form.tecnico_id.length != 0  && form.servicio_id.length !=0 && form.prioridad_id.length == 0)
{

  this.ingresarDatosVehiculo(form);
    let dataform = new FormData();

    // console.log("FORM => ", form);
    
  
  let atrVehi = form.equipoattr_id;
  
  dataform.append("equipoattr_id", atrVehi);
  dataform.append("valor", form.valor);
  dataform.append('problema', form.problema);
  dataform.append('tecnico_id', form.tecnico_id);
  dataform.append('servicio_id', form.servicio_id);
  dataform.append('prioridad_id', this.priID);


  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            })
            this.actualizarTabla();  
  })

}else
if(form.tecnico_id.length != 0  && form.servicio_id.length ==0 && form.prioridad_id.length != 0){
  this.ingresarDatosVehiculo(form);
  let dataform = new FormData();

  // console.log("FORM => ", form);
  

let atrVehi = form.equipoattr_id;

dataform.append("equipoattr_id", atrVehi);
dataform.append("valor", form.valor);
dataform.append('problema', form.problema);
dataform.append('tecnico_id', form.tecnico_id);
dataform.append('servicio_id', this.servID);
dataform.append('prioridad_id', form.prioridad_id);


Swal.fire({
  allowOutsideClick:false,
  icon:'info',
  title:'Realizando cambios',
  text:'Se está guardando los cambios, espere por favor' ,
  });
  Swal.showLoading();

this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
  (data:any) => {
    // console.log("DATA =>", data);
    Swal.close();
    cerrarModal1('#modalEV')
    this.formEditarVehiculo.reset();
    Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Cambios guardados',
            text: 'Atributos editados correctamente',
            timer: 1500
          })  
          this.actualizarTabla();  
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
  
  
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            })    
            this.actualizarTabla(); 
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
  
  
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            })  
            this.actualizarTabla();   
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
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            })  
            this.actualizarTabla();   
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
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Realizando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  
  this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
    (data:any) => {
      // console.log("DATA =>", data);
      Swal.close();
      cerrarModal1('#modalEV')
      this.formEditarVehiculo.reset();
      Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Cambios guardados',
              text: 'Atributos editados correctamente',
              timer: 1500,
              showConfirmButton:false
            })  
            this.actualizarTabla();   
  })
    
  }else
    if(form.tecnico_id.length == 0  && form.servicio_id.length ==0 && form.prioridad_id.length == 0){
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
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Realizando cambios',
      text:'Se está guardando los cambios, espere por favor' ,
      });
      Swal.showLoading();
    
    this.allService.postALL(dataform,'/orden_abierta/update_by_id/id/'+this.idOrden).subscribe(
      (data:any) => {
        // console.log("DATA =>", data);
        Swal.close();
        cerrarModal1('#modalEV')
        this.formEditarVehiculo.reset();
        Swal.fire({
                allowOutsideClick: false,
                icon: 'success',
                title: 'Cambios guardados',
                text: 'Atributos editados correctamente',
                timer: 1500,
                showConfirmButton:false
              })  
              this.actualizarTabla();   
    })
  }
  }

  enviarPyS(){

    // this.cerrarModal1();

    cerrarModal1('#ModalCrear');
 
    let id = this.idOrden;
    // console.log("ID", id);
    

    this.allService.getForID('orden_abierta', id).then((data:any)=>{

      let infoUsuario = [data];
      
      // console.log("INF",infoUsuario);   
      this.productos = infoUsuario[0].pys;   
      this.precioDefectoCliente = infoUsuario[0].usuario[0].default_price;  
      // console.log("datos PYS", this.productos);
      let total =0;
      for (let i = 0; i < this.productos.length; i++) {
      total += parseFloat( this.productos[i].costopromedio);
      }
      this.total = total;
    })
  }
  // enviarPyS1(id:any){

  //   this.cerrarModal1();
 
  //   // let id = this.idOrden;
  //   console.log("ID", id);
    

  //   this.allService.getForID('orden_abierta', id).then((data:any)=>{

  //     let infoUsuario = [data];
      
  //     console.log("INF",infoUsuario);   
  //     this.productos = infoUsuario[0].pys;   
  //     this.precioDefectoCliente = infoUsuario[0].usuario[0].default_price;  
  //     console.log("datos PYS", this.productos);
  //     let total =0;
  //     for (let i = 0; i < this.productos.length; i++) {
  //     total += parseFloat( this.productos[i].costopromedio);
  //     }
  //     this.total = total;
  //   })
  // }

  cerrarMODAL(){
    cerrarModal1("#modalEV");
    this.formEditarVehiculo.reset();
  }
// ========================= BUSCAR PRODUCTO SERVICIO ======================================
buscarProductoCodBarras(form:any){
  let nombre = form.nombre;

  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      confirmButtonColor: '#818181',
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

     //OBTENER EL PRECIO DEFECTO

     this.precioDefecto = this.precioDefectoCliente;

    //  console.log('precio defecto',this.precioDefecto);

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
      //  console.log('precios', this.arregloItemP); 

    
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
      this.banderaAliasAbrir= true;
      this.banderaAliasCerrar= false;


  
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      timer:1600,
      showConfirmButton:false
}) 

}

})
  }
}
buscarProductoNombreUnico(form:any){
  let nombre = form.nombre;

  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      confirmButtonColor: '#818181',
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
      if(data.length >= 1){
    Swal.close();

    abrirModalCodigo1('#modalTyS');
    this.productoServicio = data;

     //OBTENER EL PRECIO DEFECTO

     this.precioDefecto = this.precioDefectoCliente;

    //  console.log('precio defecto',this.precioDefecto);

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
      //  console.log('precios', this.arregloItemP); 

    
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
      this.banderaAliasAbrir= true;
      this.banderaAliasCerrar= false;


  
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      timer:1600,
      showConfirmButton:false
}) 

}

})
  }
}
buscarProductoServicio(form:any){
  let nombre = form.nombre;

  if(form.nombre==''){
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se puede buscar, ¡campo vacio!',
      confirmButtonColor: '#818181',
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
  
    this.allService.getProductoMap(nombre).subscribe((data: any) => {
    // this.allService.getProductosServicios(nombre).then((data:any)=>{
      if(data.length >= 1){
    Swal.close();

    abrirModalCodigo1('#modalTyS');
    this.productoServicio = data;

     //OBTENER EL PRECIO DEFECTO

     this.precioDefecto = this.precioDefectoCliente;

    //  console.log('precio defecto',this.precioDefecto);

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
      //  console.log('precios', this.arregloItemP); 

    
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
      this.banderaAliasAbrir= true;
      this.banderaAliasCerrar= false;


  
    
  }else{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se encontran productos con el criterio de búsqueda ingresado',
      timer:1600,
      showConfirmButton:false
}) 

}

})
  }
}

  // =========================== EDITAR PRODUCTOS/SERVICIOS ====================================

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
    
    // console.log('resultado', pedPro);
  
    let tamPRO = this.productos.length;
  // console.log("tamPRO", tamPRO);
  this.total=0;
  for (let j = 0; j < tamPRO; j++) {
    this.total += parseFloat( this.productos[j].costopromedio);
    // console.log("LO que imprimo => "+ this.total);
  }
  
  }
 
desplegarAlias(i:any){
  let entradaAlias = document.getElementById('verAlias'+i);
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
arregloAlias(i:any){
  let  x = (document.getElementById('verAlias'+i) as HTMLInputElement).value
  return x; 
}


aliasProducto(i:any){
    let val = this.arregloAlias(i);
    // let val = arregloAlias(i);
    // console.log("alias", val);
  return val;
}



// ========================AGREGAR PRODUCTOS ==========================
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

  // console.log("Id producto a agregar ", idP);
  
  let tam = this.productos.length;
  let array = this.productos;

  let id;
  let i;
  for (i = 0; i < tam; i++) {
    id= array[i].producto_id;
 
    // console.log("id productos => ", id);
    
    if(idP == id){
// console.log("producto existe ", idP);
idP = i;
// console.log("POSICION QUE RETORNA EL MËEETODO => ", idP);

    }
  }
  return idP;
  
}

// agregarProducto1(el:any, i:any,form:any, esServicio:any){

//   if(this.controlStock =='1'){
//     let stock = getStock(i);

//   if(form.cantidad > (stock)   && esServicio != '1'  ){
//     Swal.fire({
//       icon: 'error',
//       title: '¡Error!',
//       text: 'Stock insuficiente',
//       timer:2000,
//       showConfirmButton:false
// }) 
// }
// else{

//   this.aliasProducto(i);


//   this.infProducto = [el];

//   // console.log('EL QUE AGREGO',this.infProducto);

//   let producto_id = el.id_producto;
//   let esservicio = el.esServicio;
//   let productname = el.pro_nom;
//   let formPTS = this.formProductoServicio.value;
//   let cant = formPTS.cantidad;
//   let tiposervicio_id = formPTS.servicio;
//   let t_id = formPTS.tecnicoS;
//   let tecnico_id = t_id;
//   let alias = this.aliasProducto(i);
//   let tecnico_apellidos = '';
//   let tecnico_nombres ="";
//   let tipo = "";

  

// for (let z = 0; z < this.tecnicos.length; z++) {
//   if(t_id == this.tecnicos[z].id){
//     tecnico_apellidos = this.tecnicos[z].apellidos;
//     tecnico_nombres = this.tecnicos[z].nombres;
//   }
// }

// for (let x = 0; x <this.servicios.length; x++) {
//   if(tiposervicio_id == this.servicios[x].id){
//     tipo = this.servicios[x].tipo;
//   } 
// }

// //BODEGA ID
// const dato = localStorage.getItem("Inflogueo");

//   if(dato) {
//     this.datosLocalStorage=JSON.parse(dato);
    
//   }else console.log("ERROR");
  
//   let infAcceso =  Object.values(this.datosLocalStorage);


//   this.bodega_id = infAcceso[2][0].bodega_id;
//   let bodega_id = this.bodega_id;
//   let ivaporcent = this.infProducto[0].impuesto_porcent;
//   let costopromedio:any;
//   let itemprecio;
//   let iva;
//   let total;
//   let pys;
//   let tiposprecio;

//   if(this.productoRepetido(producto_id)==true){

//     if(this.infProducto[0].esServicio =='1'){
//       // alert("DEBE SUMARSE");

//       tiposprecio = this.precioDefecto;

//       total = getPrecioItem(i);
//       if(ivaporcent=='12'){
//       iva = total*0.12;
//       itemprecio= total-iva;
      
      
//       }
//       else if(ivaporcent=='0'){
//         itemprecio = total;
//         iva = 0;
      
//       }else if(ivaporcent=='0'){
//         iva = total*0.08;
//         itemprecio= total-iva;
//       }
//       this.totalS = total;
     
//     // }   
//     this.totalS = total;
//     costopromedio =total * cant;
//     pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id  };
//     this.productos.push(pys);
//     // console.log(this.productos);
  
//     }

//     else
//     {

 

// let val = parseFloat( this.productoRepetidoSumarCantidad(producto_id));
// let posicion = this.productoRepetidoPosicion(producto_id);
// this.nuevaCantidad = parseFloat(formPTS.cantidad);
// cant =  parseFloat(this.nuevaCantidad + val);

// this.totalS = cant*this.totalS;
// if(cant >= (this.stock+1) && esservicio =='0'){
  
//   Swal.fire({
//     icon: 'error',
//     title: '¡Error!',
//     text: 'Stock insuficiente ',
//     timer:2000,
//     showConfirmButton:false

//   })
// //   // alert("Stock insuficiente")
// }else{

// this.quitarProducto(posicion, this.productos);
  

// tiposprecio = this.precioDefecto;

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
// // this.totalS = total;
// costopromedio =total * cant;

// pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id  };
// this.productos.push(pys);

// let tamPRO = this.productos.length;

// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
// }
// }
//     }

//    }else{
//     tiposprecio = this.precioDefecto;
//     let t = Number( getPrecioItem(i));
//     total = t;
//     // total =  getPrecioItem(i);
    
//     // console.log("total que viene", total);
    
    
//     if(ivaporcent=='12'){
//     iva = (total*0.12);
//     itemprecio= total-iva;
    
    
//     }
//     else if(ivaporcent=='0'){
//       itemprecio = total;
//       iva = 0;
    
//     }else if(ivaporcent=='0'){
//       iva = total*0.08;
//       itemprecio= total-iva;
//     }
//     this.totalS = total;
//     costopromedio =total * cant;
//     pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id};
//     this.productos.push(pys);
    
//     this.formProductoServicio.setValue({
//       'cantidad':1,
//       'tecnicoS':this.tecnicoDefectoId,
//       'servicio': this.servicioDefectoId,
//       'alias': ''
//     })
//     let tamPRO = this.productos.length;

// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
//   // console.log("LO que imprimo => "+ this.total);
// }
//   }
  
       



// }
//   }
//   else
//   if(this.controlStock =='0'){

// // ============== SIN CONTROL STOCK ===================
//     this.aliasProducto(i);


//   this.infProducto = [el];

//   // console.log('EL QUE AGREGO',this.infProducto);

//   let producto_id = el.id_producto;
//   let esservicio = el.esServicio;
//   let productname = el.pro_nom;
//   let formPTS = this.formProductoServicio.value;
//   let cant = formPTS.cantidad;
//   let tiposervicio_id = formPTS.servicio;
//   let t_id = formPTS.tecnicoS;
//   let tecnico_id = t_id;
//   let alias = this.aliasProducto(i);
//   let tecnico_apellidos = '';
//   let tecnico_nombres ="";
//   let tipo = "";

  

// for (let z = 0; z < this.tecnicos.length; z++) {
//   if(t_id == this.tecnicos[z].id){
//     tecnico_apellidos = this.tecnicos[z].apellidos;
//     tecnico_nombres = this.tecnicos[z].nombres;
//   }
// }

// for (let x = 0; x <this.servicios.length; x++) {
//   if(tiposervicio_id == this.servicios[x].id){
//     tipo = this.servicios[x].tipo;
//   } 
// }

// //BODEGA ID
// const dato = localStorage.getItem("Inflogueo");

//   if(dato) {
//     this.datosLocalStorage=JSON.parse(dato);
    
//   }else console.log("ERROR");
  
//   let infAcceso =  Object.values(this.datosLocalStorage);


//   this.bodega_id = infAcceso[2][0].bodega_id;
//   let bodega_id = this.bodega_id;
//   let ivaporcent = this.infProducto[0].impuesto_porcent;
//   let costopromedio:any;
//   let itemprecio;
//   let iva;
//   let total;
//   let pys;
//   let tiposprecio;


//    if(this.productoRepetido(producto_id)==true){

//     if(this.infProducto[0].esServicio =='1'){
//       // alert("DEBE SUMARSE");

//       tiposprecio = this.precioDefecto;

//       total = getPrecioItem(i);
//       if(ivaporcent=='12'){
//       iva = total*0.12;
//       itemprecio= total-iva;
      
      
//       }
//       else if(ivaporcent=='0'){
//         itemprecio = total;
//         iva = 0;
      
//       }else if(ivaporcent=='0'){
//         iva = total*0.08;
//         itemprecio= total-iva;
//       }
//       this.totalS = total;
     
//     // }   
//     this.totalS = total;
//     costopromedio =total * cant;
//     pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id  };
//     this.productos.push(pys);
//     // console.log(this.productos);
  
//     }

//     else
//     {

 

// let val = parseFloat( this.productoRepetidoSumarCantidad(producto_id));
// // console.log("CANT QUE ME LLEGA ===>", val);

// let posicion = this.productoRepetidoPosicion(producto_id);
// // console.log("POSTION", posicion);



// this.nuevaCantidad = parseFloat(formPTS.cantidad);
// cant =  parseFloat(this.nuevaCantidad + val);

// this.totalS = cant*this.totalS;

// this.quitarProducto(posicion, this.productos);
  

// tiposprecio = this.precioDefecto;

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
// // this.totalS = total;
// costopromedio =total * cant;

// pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id  };
// this.productos.push(pys);

// let tamPRO = this.productos.length;

// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
//   // console.log("LO que imprimo => "+ this.total);
// }
//     }

//    }else{
 
// tiposprecio = this.precioDefecto;
// let t = Number( getPrecioItem(i));
// total = t;
// // total =  getPrecioItem(i);

// // console.log("total que viene", total);


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
// this.totalS = total;
// costopromedio =total * cant;
// pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tiposervicio_id, tecnico_apellidos, tecnico_nombres, tipo, tecnico_id};
// this.productos.push(pys);

// this.formProductoServicio.setValue({
//   'cantidad':1,
//   'tecnicoS':this.tecnicoDefectoId,
//   'servicio': this.servicioDefectoId,
//   'alias': ''
// })
//    }
//  let tamPRO = this.productos.length;

// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
//   // console.log("LO que imprimo => "+ this.total);
// }
//   }
// }

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
let t = Number( this.getPrecioItem(i));
total = t;


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

// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
// }


}
modificarCantidad(form:any, pedPro:any ){
  
  if(this.controlStock =='1'){

    let precio = parseFloat(form.precio);

  
  let arreglo = pedPro[this.position];
  
    let producto_id = this.idOrden;
    
    let esservicio = arreglo.esservicio;
    let productname = arreglo.productname;
    let cant = form.c;
    let tiposprecio = arreglo.tiposprecio;
    let bodega_id = arreglo.bodega_id;
    let ivaporcent = arreglo.ivaporcent;
    // let tecnico_id = arreglo.tecnico_id;
    let tecnico_id = form.nombreT;

    let total= precio;
    let iva = (total*ivaporcent)/100;
    let itemprecio = total - iva;
    let pys;
    let costopromedio= cant*total;
    let tecnico_apellidos:any;
    let tecnico_nombres:any;
    let tipo ='';


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

    let alias = form.nombreA;
    if(cant >= (this.stock+1) && esservicio =='0'){
    
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Stock insuficiente',
        timer:2000,
        showConfirmButton:false
    
      })
    }else{

      this.quitarProducto(this.position, pedPro);  
      pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tecnico_apellidos, tecnico_nombres, tipo , tiposervicio_id, tecnico_id};
      this.productos.push(pys);
      
      // console.log('arreglo modificado', this.productos);
  
      let tamPRO = this.productos.length;
  ;
  this.total=0;
  for (let j = 0; j < tamPRO; j++) {
    this.total += parseFloat( this.productos[j].costopromedio);
  }
  
      cerrarModal1('#exampleModal');
      this.formCantidad.reset();
    }

  }

    // ==================CONTROL STOCk NO ===========================
    else 
    if(this.controlStock =='0'){
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

cerrarModal1('#exampleModal');
    this.formCantidad.reset();
  }

  
//   // let c = form.c;
//   let precio = parseFloat(form.precio);

  
//   let arreglo = pedPro[this.position];
  
//     let producto_id = this.idOrden;
    
//     let esservicio = arreglo.esservicio;
//     let productname = arreglo.productname;
//     let cant = form.c;
//     let tiposprecio = arreglo.tiposprecio;
//     let bodega_id = arreglo.bodega_id;
//     let ivaporcent = arreglo.ivaporcent;
//     // let tecnico_id = arreglo.tecnico_id;
//     let tecnico_id = form.nombreT;

//     let total= precio;
//     let iva = (total*ivaporcent)/100;
//     let itemprecio = total - iva;
//     let pys;
//     let costopromedio= cant*total;
//     let tecnico_apellidos:any;
//     let tecnico_nombres:any;
//     let tipo ='';


//       // ==== OBTENER TECNICO =======
//       for (let y = 0; y < this.tecnicos.length; y++) {
     
//         if(form.nombreT == this.tecnicos[y].id){
  
//           tecnico_apellidos = this.tecnicos[y].apellidos;
//           tecnico_nombres = this.tecnicos[y].nombres;
          
//         }
        
//       }
  
//       // ==== OBTENER SERVICIO =======
//       for (let z = 0; z < this.servicios.length; z++) {
       
//         if(form.nombreS == this.servicios[z].id){
  
//           tipo = this.servicios[z].tipo;
          
//         }
        
//       }

//       let tiposervicio_id = form.nombreS;

//     let alias = form.nombreA;

    

//     this.quitarProducto(this.position, pedPro);  
//     pys= {alias,bodega_id, producto_id, esservicio,productname,cant,tiposprecio,itemprecio, iva, total, ivaporcent, costopromedio, tecnico_apellidos, tecnico_nombres, tipo , tiposervicio_id, tecnico_id};
//     this.productos.push(pys);
    
//     // console.log('arreglo modificado', this.productos);

//     let tamPRO = this.productos.length;
// ;
// this.total=0;
// for (let j = 0; j < tamPRO; j++) {
//   this.total += parseFloat( this.productos[j].costopromedio);
// }

//     cerrarModal1('#exampleModal');
//     this.formCantidad.reset();
//   }
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

  modificarCotizacion(form:any, ps:any){

    // console.log("THIS ID ORDEN",  this.idOrden);
    
    
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


  
  // console.log("pedido recibido", ps);

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
 
  form.cant = arrayCant;
  form.itemprecio = arrayItemPrecio;
  form.ivaporcent = arrayIvaPorCent;
  form.iva = arrayIva;
  form.total = arrayTotal;
  form.bodega_id = this.bodega_id;
  form.esservicio = arrayEsServicio;
  form.costopromedio = arrayCostoProducto;
  form.puntoventa_id =  this.puntoventa_id;
  form.tecnico_id = arrayTecnicos
  form.tiposervicio_id = arrayTipoServicioId;
  form.user_id = this.user_id

    // console.log(form);    

    // console.log("id", this.idOrden);
    
    this.allService.postAL(form, 'cotizacion/add_prods_cotizacion/id/'+this.idOrdenFinal).subscribe((data:any)=>{

      Swal.fire({
        allowOutsideClick:false,
        icon:'success',
        title:'Actualizando cotización',
        text:'Se ha actualizado la cotización Correctamente' ,
        timer:1500,
        showConfirmButton:false
        });
        cerrarModal1('#modalEPS');
          
    },(error)=>{
      Swal.fire({
        allowOutsideClick:false,
        icon:'error',
        title:'No se pudo actualizar la cotización',
        text:'No se actualizó la cotización' ,
        timer:1600,
        showConfirmButton:false
        });  
    });
      // })
    

  }

  openModal(){
    abrirModalCodigo('#ModalCrear', 'openMG');
  }
}
