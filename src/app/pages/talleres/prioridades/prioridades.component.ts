import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { PrioridadModel } from '../../Modelos/prioridad.model';

@Component({
  selector: 'app-prioridades',
  templateUrl: './prioridades.component.html',
  styleUrls: ['./prioridades.component.scss']
})
export class PrioridadesComponent implements OnInit {

  searchText: string = '';
  elements :any=[];
  elements1 :any=[];
  elements2:any;
  previous: string;
  
  public modal : any;

  i: PrioridadModel;

  url='prioridad';

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
  nombre: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  tipo: new FormControl('')
  })
  
  formEditar = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    tipo: new FormControl('')
    })
  
  get f()
  {
      return this.formCrear.controls;   
  }
  get f1()
  {
      return this.formEditar.controls;   
  }
  
  resetear(){
    this.formCrear.reset();
  
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

  this.allService.getAl('prioridad/all').then((data:any)=>{
    this.elements = data;
    // console.log("data prioridad =>", this.elements);
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  })
}

// ==================================================== CREAR ===============================================================


crear(form: PrioridadModel){
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando prioridad',
    text:'Se está creando la prioridad , espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'prioridad/insert').subscribe(data=>{
    console.log("esto debe guardarse ", data);
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Prioridad creada correctamente',
      timer:1200,
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

// =============================================== BUSCAR POR ID ============================================================

obtenerPorID(id:string){

  // console.log("Id que me llega => ", id);
  this.allService.getAl('prioridad/by_id?id='+id).then((data:any)=>{
    this.elements1 = data;
    // console.log("Datos unicos=", this.elements1);
      this.formEditar.setValue({
    'nombre': this.elements1.nombre,
    'descripcion': this.elements1.descripcion,
    'tipo': this.elements1.tipo,
    });
    // console.log("datos actualizar", this.formEditar.value);
  })


}

// ================================================== ACTUALIZAR ============================================================
editar( form:PrioridadModel, id: string){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  // console.log("id que debe llegar", id);
  this.allService.postAL(form, 'prioridad/update_by_id/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Prioridad actualizada correctamente',
      timer:1200,
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


// =================================================== DESHABILITAR ======================================================================


deshabilitar(id:any){

  // console.log("id que debe llegar =>", id); 

  this.allService.getAl('/prioridad/disable?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Prioridad deshabilitada',
      text: '¡La prioridad se ha deshabilitado correctamente!',
      timer:1200,
      showConfirmButton:false   
    })
    this.modal.close()
    this.listarTodos();
  })

}


// =================================================== HABILITAR ======================================================================

habilitar(id:string){


  this.allService.getAl('/prioridad/enable?id='+id).then((data:any)=>{
    // console.log("Atributo habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Prioridad habilitada',
      text: '¡La priorirdad se ha habilitado correctamente!',   
      timer:1200,
      showConfirmButton:false
    })
    this.modal.close()
   this.listarTodos();
  })

}

}
