import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { ServicioModel } from '../../Modelos/servicio.model';
declare function cerrarModal(params:string):any;

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {

  searchText: string = '';
 
  elements :any=[];
  elements1 :any=[];
  elements2:any;
  previous: string;
  // url: 'producto';
  respuesta:any;
  public modal : any;

  // eA= EditarAtributoComponent;
  // path ='bus';
  i: ServicioModel;

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;


  constructor(private allService: AllServiceService, private cdRef: ChangeDetectorRef,private modalService  : NgbModal) { }

  ngOnInit(): void {

    this.listarTodos();
  }
  @HostListener('input') oninput() {
    this.searchItems();
  } 

  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
        this.mdbTable.setDataSource(this.previous);
        this.elements = this.mdbTable.getDataSource();
        
    }
        
    if (this.searchText) {
        this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
        this.mdbTable.setDataSource(prev);

    }
}

ngAfterViewInit() {
  this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
  this.mdbTablePagination.calculateFirstItemIndex();
  this.mdbTablePagination.calculateLastItemIndex();
  this.cdRef.detectChanges();
}

// ================================================= FORMULARIOS=========================================================


formCrear = new FormGroup({
  tipo: new FormControl('', [Validators.required]),
  prefix: new FormControl('', [Validators.required])
  // orden: new FormControl('', [Validators.required])
  })
  
  formEditar = new FormGroup({
    tipo: new FormControl('', [Validators.required]),
    prefix: new FormControl('', [Validators.required])
    // orden: new FormControl('', [Validators.required])
    })
  
  get f()
  {
      return this.formCrear.controls;   
  }
  get f1()
  {
      return this.formEditar  .controls;   
  }
  
  resetear(){
  
  }

  enviar(el:any){
    this.elements1 = el;
    }
    
    // ============================ ABRIR MODAL =================================
    abrirModal (ModalContent: any): void {
      this.modal = this.modalService.open(ModalContent);
    }
    
    cerrarModal(){
      this.modal.close();
    }


  //  ==========================================+ METODOS CRUD ROLES +======================================================

listarTodos(){

  this.allService.getAl('producto/all').then((data:any)=>{
    this.elements = data;
    // console.log("data servicios =>", this.elements);
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();

  })

}

// =============================================== BUSCAR POR ID ============================================================

obtenerPorID(id:string){

  // console.log("Id que me llega => ", id);
  this.allService.getAl('producto/by_id?id='+id).then((data:any)=>{
    this.elements1 = data;
    // console.log("Datos unicos=", this.elements1);
    this.formEditar.setValue({
    'tipo': this.elements1.tipo,
    'prefix': this.elements1.prefix
    });
    // console.log("datos actualizar", this.formEditar.value);
  })
  
}


// ==================================================== CREAR ===============================================================

crear(form: ServicioModel){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando servicio',
    text:'Se está creando el servicio, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'producto/insert').subscribe(data=>{
    // console.log("esto debe guardarse ", data);
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Servicio creado correctamente',
      timer:1500,
      showConfirmButton:false
      });
      this.formCrear.reset();
      this.listarTodos();
      this.modal.close();
  },(err)=>{    
Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: err.error.message,
      confirmButtonColor: '#818181'

      })      
   
        }) 
}


// ================================================== ACTUALIZAR ============================================================

editar( form:ServicioModel, id: string){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();

  // console.log("id que debe llegar", id);
  this.allService.postAL(form, 'producto/update_by_id/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Servicio actualizado correctamente',
      timer:1500,
      showConfirmButton:false
      }); 
      this.modal.close();
      this.listarTodos();
  },(err)=>{    
    Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: err.error.message + ' Ha ocurrido algo inesperado',
          confirmButtonColor: '#818181'
    })      
        // console.log(err.error.message + ' Ha ocurrido algo inesperado');
          this.formEditar.reset();
      }) 
}

// =================================================== HABILITAR ======================================================================


deshabilitar(id:any){

  // console.log("id que debe llegar =>", id);
  this.allService.getAl('/producto/disable?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Servicio deshabilitado',
      text: '¡El servicio se ha deshabilitado correctamente!',
      timer:1500,
      showConfirmButton:false
    })
    this.modal.close()
    this.listarTodos();
  })
  
}

// =================================================== DESHABILITAR ======================================================================

habilitar(id:string){

  this.allService.getAl('/producto/enable?id='+id).then((data:any)=>{
    // console.log("Servicio habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Servicio habilitado',
      text: '¡El servicio se ha habilitado correctamente!',   
      timer:1500,
      showConfirmButton:false
    })
    this.modal.close()
   this.listarTodos();
  })

}
}
