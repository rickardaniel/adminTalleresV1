import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
declare function exportarReporteExcelTEC(nombre:any) :any;
declare function exportarReportePDFReporteTEC(inf:any,suT:any,pagT:any) :any;
declare function getValSelect():any;

@Component({
  selector: 'app-reporte-xtecnico',
  templateUrl: './reporte-xtecnico.component.html',
  styleUrls: ['./reporte-xtecnico.component.scss']
})
export class ReporteXtecnicoComponent implements OnInit {
  searchText: string = '';
  previous: string;
  tecnicos:any =[];
  tecDefectoNombre :any;
  tecNombre:any;
  tecDefectoID:any;

  //val form global
  fi:any;
  ff:any;
  idE:any;
  // Inf REPORTE
  infReporte:any=[];
//banderas
  banderaPaginador = true;
  banderaPaginador2 = false;
  banderaSearchExcel= false;
  tecSelecionado='';
  precioTotalOrdenes:any;
  sumaPrecioTotalOrdenes=0;
  
  atributosVehiculo:any=[];
  //ARREGLO PROVISIONAL
  arregloProvisional:any=[];
   placa1:any;
   marca1:any;
   kilometraje:any;
   
   //modal
   modal:any;

  @ViewChild(MdbTablePaginationComponent, { static: true })  mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective; 

  constructor(
    private allService: AllServiceService,
    private pipefecha: DatePipe,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private pipeDecimal: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.enviarTecnico();
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


// ========================= FORMULARIO =================================
formReporte = new FormGroup({
  fechaI: new FormControl(),
  fechaF: new FormControl(),
  idTecnico: new FormControl(),
  // valN: new FormControl(),
  valA: new FormControl()

})


enviarTecnico() {
  this.allService.getAl('tecnico/todos').then((data) => {
    this.tecnicos = data;
    // console.log(this.tecnicos);
    
  this.tecDefectoNombre = this.tecnicos[0].nombres+' '+ this.tecnicos[0].apellidos;
  this.tecNombre = this.tecnicos[0].nombres;
  this.tecDefectoID = this.tecnicos[0].id;
  let fecha = new Date();
  let fecha2 = new Date();
  fecha2.setDate(fecha2.getDate() - 7)
  this.formReporte.setValue({
      'fechaI':this.pipefecha.transform (fecha2,'yyy-MM-dd','UTC'),
      // 'fechaI':'',
      'fechaF':this.pipefecha.transform (fecha,'yyy-MM-dd','UTC'),
      'idTecnico':this.tecDefectoID,
      // 'valN': this.tecNombre,
      'valA': '',
    })


  });
}


abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent, {size:'sm', centered:true});
}
 
vaciarArreglo(){
  this.arregloProvisional.splice(0, this.arregloProvisional.length);
  this.arregloProvisional=[];
}

buscarInformacionReporte(form:any){
  this.sumaPrecioTotalOrdenes =0;
  // this.tecSelecionado = form.valA;
  // this.tecSelecionado = getValSelect();

  // console.log(this.tecSelecionado);
  

Swal.fire({
  allowOutsideClick:false,
  icon:'info',
  title:'Buscando Órdenes de Trabajo',
  text:'Se está buscando órdenes de trabajo, espere por favor' ,
  });
  Swal.showLoading();

this.vaciarArreglo();

this.fi= form.fechaI;
this.ff= form.fechaF;
this.idE = form.idTecnico;
this.allService.getAl("tecnico/por_tecnico?id="+ this.idE+"&desde="+this.fi+"&hasta="+ this.ff).then((data:any)=>{
  // console.log(data);
  

  if(data.length == 0){
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'error',
      title:'No se encontraron resultados',
      text:'Intente con una fecha anterior',
      confirmButtonColor: '#818181'

      });
  }else
  {
    // console.log('dadaadadata', data);
    
    if(data.rta == false){
      Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'error',
      title:'Sin resultados',
      text:'Intente con una fecha anterior',
      confirmButtonColor: '#818181'
      });

    }else{

  
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Informacion encontrada',
      timer:1400,
      showConfirmButton:false
      });

  this.banderaSearchExcel= true;
  this.infReporte = data;
  // console.log(this.infReporte);

  let arrayValAuto :any;
      let placa1:any;
      let marca1:any;
      let kilometraje:any;
      let arr;
      let sumaTP:any;
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

        for (let k = 0; k < this.infReporte[i].servicio.length; k++) {
          this.sumaPrecioTotalOrdenes += parseFloat( this.infReporte[i].servicio[k].costopromedio);
          
          // console.log('total',this.sumaPrecioTotalOrdenes);
          
        }
        // let cliente = this.infReporte[i].cliente;
        // let es_cotizacion = this.infReporte[i].es_cotizacion;
        // let estado = this.infReporte[i].estado;
        // let facturado = this.infReporte[i].facturado;
        // let factventa_id= this.infReporte[i].factventa_id;
        let fecha = this.infReporte[i].fecha;
        let id = this.infReporte[i].id;
        let no = this.infReporte[i].no;
        let problema = this.infReporte[i].problema;
        let tecnico = this.infReporte[i].tecnico;
        let arrServicio =new Array;
        this.precioTotalOrdenes = this.infReporte[i].total;
        arrServicio = this.infReporte[i].servicio;
        // let tipo = this.infReporte[i].tipo;

      //   if(factventa_id == null){
      //   arr = {cliente,es_cotizacion,estado, facturado, factventa_id,fecha,id,no,problema,tipo, arrayValAuto};         
      //   this.arregloProvisional.push(arr)
      // }
      // arr = {cliente,es_cotizacion,estado, facturado, factventa_id,fecha,id,no,problema,tipo, arrayValAuto};         
      arr = {fecha,id,no,problema, arrayValAuto, arrServicio, tecnico};         
      this.arregloProvisional.push(arr)


      }
      this.mdbTable.setDataSource(this.arregloProvisional);
      this.arregloProvisional = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
      // this.verPDF = false;
      this.banderaPaginador= false;
      let pag = document.getElementById('tablaPresentar');
      pag?.removeAttribute("hidden");
      let pag1 = document.getElementById('pag');
      pag1?.removeAttribute("hidden");

      // console.log(this.arregloProvisional);
      

}  }

},(err)=>{

  Swal.close();
  // alert('ALGO DEBE SALIR');
})

}
cerrarModal(){
  this.modal.close();
}

formPorcentaje= new FormGroup({
  percent : new FormControl()
})


// exportarPDF(){
//   let spto = this.sumaPrecioTotalOrdenes;
//   exportarReportePDFReporteTEC(this.arregloProvisional, spto);
// }
exportarEXCEL(nombre:any){
 
  exportarReporteExcelTEC(nombre);
}


enviarPorcentaje(form:any){

  let valPercent = form.percent;
  // console.log(valPercent);
  this.cerrarModal();
  this.formPorcentaje.reset();

  let spto = this.sumaPrecioTotalOrdenes;
  // let pagoTecnico =  (spto*valPercent)/100 ; 
  let pagoTecnico =  this.pipeDecimal.transform((spto*valPercent)/100 ,'.0-2' ) 
  // console.log('PagoTecnico', pagoTecnico);
  

  exportarReportePDFReporteTEC(this.arregloProvisional, spto, pagoTecnico);

}
}
