import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
declare function exportarReporteExcelOAG() :any;
declare function exportarReportePDFAG(inf:any) :any;
@Component({
  selector: 'app-orden-agendada',
  templateUrl: './orden-agendada.component.html',
  styleUrls: ['./orden-agendada.component.scss']
})
export class OrdenAgendadaComponent implements OnInit {

       //INFO REPORTE
       infReporte:any=[];
       searchText: string = '';
       previous: string;
       datosLocalStorage:any=[]
      //FECHAS
      fi:any;
      ff:any;
     
      //ARREGLO PROVISIONAL
      arregloProvisional:any=[];
      placa1:any;
      marca1:any;
      kilometraje:any;

          //Banderas
    banderaPaginador = true;
    banderaPaginador2 = false;
    banderaSearchExcel= false;

           //nombre Empresa
           nombreEmpresa:any;
    
    @ViewChild(MdbTablePaginationComponent, { static: true })  mdbTablePagination: MdbTablePaginationComponent;
    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;   
  constructor(
            private allService:AllServiceService,
            private cdRef: ChangeDetectorRef,
              public _router: Router, public _location: Location,
              private pipefecha: DatePipe,

            ) { }

  ngOnInit(): void {
    this.enviarEstado1();
    this.mdbTable.setDataSource(this.arregloProvisional);
    this.arregloProvisional = this.mdbTable.getDataSource();
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

  formReporte = new FormGroup({
    fechaI: new FormControl('', Validators.required),
    fechaF: new FormControl('', Validators.required),
  })

  formAgendar = new FormGroup({
  bodega_id : new FormControl(''),
  user_id : new FormControl(''),
  puntoventa_id : new FormControl(''),
  })
  enviarEstado1(){
    let fecha = new Date();
    let fecha2 = new Date();
    fecha2.setDate(fecha2.getDate() - 14)
    this.formReporte.setValue({
        'fechaI':this.pipefecha.transform (fecha2,'yyy-MM-dd','UTC'),
        'fechaF':this.pipefecha.transform (fecha,'yyy-MM-dd','UTC'),
      })
  }
  

  buscarInformacionReporte(form:any){

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'Buscando Órdenes Agendadas',
      text:'Se está buscando órdenes agendadas, espere por favor' ,
      });
      Swal.showLoading();
    this.vaciarArreglo();
    this.fi= form.fechaI;
    this.ff= form.fechaF;

    // /cotizacion/all?desde=2022-03-04&hasta=2022-03-18&format=json
    this.allService.getAl("agendar_citas/all?desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
      // common/talleres/agendar_citas/all?desde=2022-05-15&hasta=2022-06-20
      this.infReporte = data;

      console.log('aqui',this.infReporte);
      
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
            console.log('entra aca');
            
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
                if(atriNombre1 == 'MARCA'|| atriNombre == 'Marca'  ){
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
              // let es_cotizacion = this.infReporte[i].es_cotizacion;
              let fechaProximoMan = this.infReporte[i].fechaProximoMan;
              let kmProximoMan = this.infReporte[i].kmProximoMan;
              // let nombreRetira= this.infReporte[i].nombreRetira;
              // let fecha = this.infReporte[i].fecha;
              let id = this.infReporte[i].id;
              let no = this.infReporte[i].no;
              let problema = this.infReporte[i].recomendacion;
              // let secuencia =this.infReporte[i].secuencia;
              let tipo = this.infReporte[i].tipo;
              let fechaPm_str = this.infReporte[i].fechaPm_str;
              let fue_confirmada = this.infReporte[i].fue_confirmada;
              arr = {cliente,no,fechaProximoMan, fechaPm_str, kmProximoMan,id,problema,tipo, arrayValAuto, fue_confirmada};         
              // arr = {cliente,fechaProximoMan, fechaPm_str, kmProximoMan, nombreRetira,fecha,id,no,problema,tipo, secuencia, arrayValAuto};         
              this.arregloProvisional.push(arr)
            }
      
              console.log("entrando", this.arregloProvisional);
        
        
              this.mdbTable.setDataSource(this.arregloProvisional);
              this.arregloProvisional = this.mdbTable.getDataSource();
              this.previous = this.mdbTable.getDataSource();
              this.banderaPaginador= false;
              let pag = document.getElementById('tablaOrdenesAgendadas');
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

  vaciarArreglo(){
  
    this.arregloProvisional.splice(0, this.arregloProvisional.length);
    this.arregloProvisional=[];

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

activarOrdenAgendada(id:any){

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
  
 let datos = this.datosLS();
 let bodega_id = parseInt(datos.puntosventa[0].bodega_id);
 let user_id = parseInt(datos.empleado[0].id);
 let puntoventa_id = parseInt(datos.puntosventa[0].id)
//  let json ={
//   "user_id": user_id,
//   "puntoventa_id": puntoventa_id,
//   "bodega_id":bodega_id
//  }
this.formAgendar.setValue({
  'bodega_id':bodega_id,
  'user_id': user_id,
  'puntoventa_id':puntoventa_id
})

console.log(this.formAgendar.value);


 this.allService.postAL(this.formAgendar.value,'agendar_citas/confirmar/id/'+id).subscribe((data:any)=>{

  if(data.rta == true){
    Swal.fire({
      allowOutsideClick:false,
      icon:'success',
      title:'Orden Activada',
      text:' Se ha activado la orden correctamente',
      confirmButtonColor: '#818181'

      });

      this.allService.getAl("agendar_citas/all?desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
        this.infReporte = data;
        this.vaciarArreglo();  
        // console.log('aqui',this.infReporte);
        
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
              console.log('entra aca');
              
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
                  if(atriNombre1 == 'MARCA'|| atriNombre == 'Marca'  ){
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
                let no = this.infReporte[i].no;
                let fechaProximoMan = this.infReporte[i].fechaProximoMan;
                let kmProximoMan = this.infReporte[i].kmProximoMan;
                let id = this.infReporte[i].id;
                let problema = this.infReporte[i].recomendacion;
                let tipo = this.infReporte[i].tipo;
                let fechaPm_str = this.infReporte[i].fechaPm_str;
                let fue_confirmada = this.infReporte[i].fue_confirmada;
                arr = {cliente, no,fechaProximoMan, fechaPm_str, kmProximoMan,id,problema,tipo, arrayValAuto, fue_confirmada};         
                this.arregloProvisional.push(arr)
              }
             
                this.mdbTable.setDataSource(this.arregloProvisional);
                this.arregloProvisional = this.mdbTable.getDataSource();
                this.previous = this.mdbTable.getDataSource();
                this.banderaPaginador= false;
                let pag = document.getElementById('tablaOrdenesAgendadas');
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

 })
 
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
visualizarPDF(id:any){
  console.log("id que llega ", id);
  let tipo = 'agenda';
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
    let tipo = 'agenda';
    let accion="send";
    let empresa = this.getNombreEmpresa();
  
    this.allService.getAl('hacer_pdf/'+accion+'?oa_id='+id+'&tipo='+tipo+'&emp='+empresa).then((data:any)=>{
      if(data.rta == undefined){
          Swal.close(); 
          Swal.fire({
            allowOutsideClick:false,
            icon:'success',
            title:'Orden Agendada',
            text:'Se ha enviado la orden agendada al correo',
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
    let tipo = 'agenda';

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

exportarEXCEL(){
  exportarReporteExcelOAG();
}
exportarPDF(){

  exportarReportePDFAG(this.arregloProvisional);

}
}
