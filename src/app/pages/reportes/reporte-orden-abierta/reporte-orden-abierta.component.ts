import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import {   DatePipe, Location, TitleCasePipe  } from '@angular/common';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { VehiculoModel } from '../../Modelos/vehiculo.model';


const head = [['Nro. Orden', 'Fecha ', 'Cliente','Placa',' Marca',' Problema', 'Estado']]
declare function exportarReporteExcelOA() :any;
declare function exportarReportePDF(inf:any) :any;



@Component({
  selector: 'app-reporte-orden-abierta',
  templateUrl: './reporte-orden-abierta.component.html',
  styleUrls: ['./reporte-orden-abierta.component.scss']
})
export class ReporteOrdenAbiertaComponent implements OnInit {

  url='orden_abierta';
  fi:any;
  ff:any;
  idE:any;
  estadoActivo:any;
  searchText: string = '';

  // visuarlizador PDF
  pdfSrc:any;
  verPDF:any;

  previous: string;
   infReporte:any=[];
   datosOrden:any;
   infOrden:any=[];
   datosLS:any;
   
   //Usuario
   usuario:any =[];
   tys:any= [];
   datosV:any= [];
   placa:any;
   modelo:any;
   marca:any;
   placa1:any;
   marca1:any;
   kilometraje:any;
 

   //Modal
   modal:any;
   modal1:any;

    //Banderas
    banderaIconTrash:any;

    //Usuario ID
    public user_id:any;
    datosLocalStorage:any;


  prioridades:any;
  tecnicos:any;
  servicios:any;
  estados: any = [];

  // INFO DE LOS IMPUTS

  secuencia:any;
  datosVehiculo:any=[];
  infCliente:any;
  infTyS:any;
  idOrden:any;

  i: VehiculoModel;


  atributosVehiculo:any=[];
  arregloProvisional:any=[];

      //Banderas
      banderaPaginador = true;
      banderaPaginador2 = false;

      banderaSearchExcel= false;
      //nombre Empresa
      nombreEmpresa:any;

  titulos = ['Orden', 'Fecha','Cliente', 'Placa','Km','Marca', 'Problema','Estado','Acciones']
 

  @ViewChild(MdbTablePaginationComponent, { static: true })  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective; 

  constructor(private allService: AllServiceService,
    public _router: Router, public _location: Location,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private pipefecha: DatePipe,
     ) { }

  ngOnInit(): void {

    this.enviarEstado();

    // this.mdbTable.setDataSource(this.arregloProvisional);
    // this.arregloProvisional = this.mdbTable.getDataSource();
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

  // ================================ FORMULARIOS ======================================

  formReporte = new FormGroup({
    fechaI: new FormControl('', Validators.required),
    fechaF: new FormControl('', Validators.required),
    idEstado: new FormControl('', Validators.required),
  })

  formCambiarEstado = new FormGroup({
    estado:new FormControl('')
  })

  enviarEstado(){
    this.allService.getALL('estado/activo', this.i).subscribe((data:any)=>{
       let est = JSON.parse(data);
       this.estados = est.data;
      //  console.log("estados => ", this.estados);     
    
    for (let i = 0; i < this.estados.length; i++) {
     let element = this.estados[i].estado;  

    if(element =="1.ACTIVO"){

  // console.log('ELEMENT',element);
  
  this.estadoActivo = element;
  let fecha = new Date();
  let fecha2 = new Date();
  fecha2.setDate(fecha2.getDate() - 7)
  this.formReporte.setValue({
      'fechaI':this.pipefecha.transform (fecha2,'yyy-MM-dd','UTC'),
      // 'fechaI':'',
      'fechaF':this.pipefecha.transform (fecha,'yyy-MM-dd','UTC'),
      'idEstado':this.estadoActivo
    })
  }
}
    })     
}
 
vaciarArreglo(){
     this.arregloProvisional.splice(0, this.arregloProvisional.length);
     this.arregloProvisional=[];
}

buscarInformacionReporte(form:any){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Buscando Órdenes Abiertas',
    text:'Se está buscando órdenes abiertas, espere por favor' ,
    });
    Swal.showLoading();
  
 this.vaciarArreglo();

  this.fi= form.fechaI;
  this.ff= form.fechaF;
  this.idE = form.idEstado;

  this.allService.getAl("/orden_abierta/all?desde="+this.fi+"&hasta="+ this.ff+"&e="+ this.idE).then((data:any)=>{
    this.infReporte = data;
    // console.log("info => ", this.infReporte);
    
    let bandera = this.infReporte.rta;  

    if(data.length ==0){
      Swal.fire({
        allowOutsideClick:false,
        icon:'error',
        title:'Sin resultados',
        text:'Intente con una fecha anterior',
        confirmButtonColor: '#818181'

        });

    }else{
    
      if(bandera != false){
        Swal.close();
        Swal.fire({
          allowOutsideClick:false,
          icon:'info',
          title:'info',
          text:'Informacion encontrada',
          showConfirmButton:false,
          timer:1400
          });

          this.banderaSearchExcel= true;
    
      let arrayValAuto :any;
      let placa1:any;
      let marca1:any;
      let kilometraje:any;
      let arr;

      // console.log('mira lo que haces',this.infReporte);
      

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
          // console.log("factventa_id", factventa_id);
          
          if(factventa_id == null){
          arr = {cliente,es_cotizacion,estado, facturado, factventa_id,fecha,id,no,problema,tipo, arrayValAuto};         
          this.arregloProvisional.push(arr)
        }
        // else{
        //   arr = {cliente,es_cotizacion,estado, facturado, factventa_id,fecha,id,no,problema,tipo, arrayValAuto};         
        //   this.arregloProvisional.push(arr)
        //   console.log("entra acá", this.arregloProvisional);
          
        // }

        }
        
        // console.log(this.arregloProvisional);
        
        
        this.mdbTable.setDataSource(this.arregloProvisional);
        this.arregloProvisional = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
        // this.verPDF = false;
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
    }
  }
  },(err)=>{

    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: "Ingrese los criterios de busqueda",
      timer:2000,
      showConfirmButton:false
}) 

  })
  
}

enviarOrden1(el:any){
  this.datosOrden = [el];
}

enviarOrden(id:any){

this.allService.getForID(this.url,id).then((data)=>{
  this.datosOrden = data;
  this.usuario = this.datosOrden.usuario[0];
  this.datosV = this.datosOrden.vehiculo
  this.tys = this.datosOrden.tys;
  // console.log("datos user", this.usuario);
  // console.log("datos tys", this.tys);

  for (let i = 0; i < this.datosV.length; i++) {
    let nombre = this.datosV[i].atributo;
  
    if(nombre == 'PLACA'){
    this.placa = this.datosV[i].valor;
    }
    if(nombre == 'MARCA'){
      this.marca = this.datosV[i].valor;
      }
    if(nombre == 'MODELO'){
      this.modelo = this.datosV[i].valor;
      }

    
  }
  
})



const dato = localStorage.getItem("InfEmpresa");

  if(dato) {
    this.datosLocalStorage=JSON.parse(dato);
    
  }else console.log("ERROR");
  
  let infAcceso =  this.datosLocalStorage;
  this.datosLS = infAcceso;
  // console.log("Datos LS", this.datosLS);
  

}

visualizarPDF(id:any){
  // console.log("QUE PASA ", id);
  let tipo = 'oa';
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
    let tipo = 'oa';
    let accion="send";
    let band:any;
    let empresa = this.getNombreEmpresa();
    
    this.allService.getAl('hacer_pdf/'+accion+'?oa_id='+id+'&tipo='+tipo+'&emp='+empresa).then((data:any)=>{

      // console.log('RES',data);
      
      if(data.rta == undefined){
        Swal.close(); 
        Swal.fire({
          allowOutsideClick:false,
          icon:'success',
          title:'Orden envíada al correo ',
          text:'Se ha eviado la orden al correo',
          timer:1500,
          showConfirmButton:false
        
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
  },(error)=>{

    band = false;
    if(band == false){
      Swal.close();
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
    let tipo = 'oa';

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

cambiarEstado(id:any){

  // this.vaciarArreglo();

 Swal.fire({
  title: 'Enviar a Planeador',
  text: '¿Está seguro de enviar orden al planeador? ' ,
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#B5B5B5',
  cancelButtonColor: '#F51F36',
  cancelButtonText:'Cancelar',
  confirmButtonText: 'Si, enviar ahora!',

}).then((result) => {
  if (result.isConfirmed) {
    this.allService.getAl('estado/en_activo?id='+id).then((data) => {
      this.vaciarArreglo();  

      this.allService.getAl("/orden_abierta/all?desde="+this.fi+"&hasta="+ this.ff+"&e="+ this.idE).then((data:any)=>{
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
          }
          Swal.fire({ title: 'Cambio realizado!',
          text:  'Se ha enviado la orden al planeador',
          icon: 'success',
          showConfirmButton:false,
          timer:1500});

          // console.log("entrando", this.arregloProvisional);
          this.mdbTable.setDataSource(this.arregloProvisional);
          this.arregloProvisional = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
      
          })
           
            });
     
  }else {
    // Swal.fire({
    //   icon: 'error',
    //   title: '¡Error!',
    //   // text: msg
    //   text: 'No se ha podido cambiar la orden',
    //   timer:500
    // });
  }
})

}

abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent, {size:'xl'});
}
abrirModal1 (ModalContent1: any): void {
  this.modal1 = this.modalService.open(ModalContent1);
}
abrirModalPDF(ModalContent: any): void{
  this.modal = this.modalService.open(ModalContent, {size:'lg'}); 

}

cerrarModal(){
  this.modal.close();
}
cerrarModal1(){
  this.modal1.close();
}

exportarEXCEL(){
  exportarReporteExcelOA();
}
exportarPDF(){
  exportarReportePDF(this.arregloProvisional);
}

eliminarOrden(id:any){

  Swal.fire({
    title: 'Eliminar Orden',
    text: '¿Está seguro de eliminar la orden de ingreso?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#B5B5B5',
    cancelButtonColor: '#F51F36',
    cancelButtonText:'Cancelar',
    confirmButtonText: '!Si, eliminar!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.allService.get("/orden_abierta/eliminar_id?id="+id).then((data:any)=>{
      // console.log(data);
      
        if(data.rta==true){
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: '¡Orden Eliminar!',
            text: "Se ha elimnador la orden correctamente",
           
            showConfirmButton:false,
            timer:1600
          })

          this.vaciarArreglo();  

          this.allService.getAl("/orden_abierta/all?desde="+this.fi+"&hasta="+ this.ff+"&e="+ this.idE).then((data:any)=>{
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
              }
              Swal.fire({ title: 'Cambio realizado!',
              text:  'Se ha elimnado la orden correctamente',
              icon: 'success', 
              showConfirmButton:false,
              timer:1800});
    
              // console.log("entrando", this.arregloProvisional);
              this.mdbTable.setDataSource(this.arregloProvisional);
              this.arregloProvisional = this.mdbTable.getDataSource();
              this.previous = this.mdbTable.getDataSource();
          
              })







        }else{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: '¡Error!',
            text: "Orden no se ha podido eliminar",
           
            showConfirmButton:false,
            timer:1600
          })
        }
      })
    }
  });



}

}


