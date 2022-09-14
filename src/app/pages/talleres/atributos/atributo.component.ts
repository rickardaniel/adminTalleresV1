import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { AtributoModel } from '../../Modelos/atributo.model';

@Component({
  selector: 'app-atributo',
  templateUrl: './atributo.component.html',
  styleUrls: ['./atributo.component.scss']
})
export class AtributoComponent implements OnInit {
  
  elements :any=[];
  elements1:any=[];
  public modal : any;
  previous: string;
  searchText: string = '';

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  constructor(private allService: AllServiceService, private cdRef: ChangeDetectorRef,   private modalService  : NgbModal) { }

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
nombreattr: new FormControl('', [Validators.required]),
descripcion: new FormControl('', [Validators.required])
})

formEditar = new FormGroup({
  nombreattr: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required])
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
  this.formCrear.reset()
}

// ============================ ABRIR MODAL =================================
abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent,{size:'md'});
}

cerrarModal(){
  this.modal.close();
}

enviar(el:any){
this.elements1 = el;
}


//  ==========================================+ METODOS CRUD ROLES +======================================================

listarTodos(){
  this.allService.getAl('atributo/all').then((data:any)=>{
    this.elements = data;
    // console.log("data atributos =>", this.elements);
    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  })
}
// =============================================== BUSCAR POR ID ============================================================

obtenerPorID(id:string){

  // console.log("Id que me llega => ", id);
  this.allService.getAl('atributo/by_id?id='+id).then((data:any)=>{
    this.elements1 = data;
    // console.log("Datos unicos=", this.elements1);
    this.formEditar.setValue({
      'nombreattr': this.elements1.nombreattr,
      'descripcion': this.elements1.descripcion
    });
    // console.log("datos actualizar", this.formEditar.value);
  })
  
}

// ==================================================== CREAR ===============================================================

crear(form: AtributoModel){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando atributo',
    text:'Se está creando el atributo , espere por favor' ,
    });
    Swal.showLoading();
  this.allService.postAL(form, 'atributo/insert').subscribe(data=>{
    // console.log("esto debe guardarse ", data);
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Atributo creado correctamente',
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
// ================================================== ACTUALIZAR ============================================================

editar( form:AtributoModel, id: string){
  // console.log("id que debe llegar", id);

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'atributo/update_by_id/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Atributo actualizado correctamente',
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

// =================================================== HABILITAR ======================================================================


deshabilitar(id:any){
  // console.log("id que debe llegar =>", id); 

  this.allService.getAl('/atributo/disable?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Atributo deshabilitado',
      text: '¡El atributo se ha deshabilitado correctamente!',
      timer:1200,
      showConfirmButton:false
    })
    this.modal.close()
    this.listarTodos();
  })
}

// =================================================== DESHABILITAR ======================================================================

habilitar(id:string){

  this.allService.getAl('/atributo/enable?id='+id).then((data:any)=>{
    // console.log("Atributo habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Atributo habilitado',
      text: '¡El atributo se ha habilitado correctamente!',   
      timer:1200,
      showConfirmButton:false
    })
    this.modal.close()
   this.listarTodos();
  })

}

// ======================= VER PLANEADOR =========================

verPlaneador(id:any){

  // console.log('id', id);
  
  this.allService.getAl('/atributo/en_planeador?id='+id).then((data:any)=>{
    // console.log("Atributo habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Atributo visible en tarjetas planeador',
      text: '¡Se ha agregado el atributo a las tarjetas!',   
      timer:1500,
      showConfirmButton:false
    })
    // this.modal.close()
   this.listarTodos();
  })
}

quitarPlaneador(id:any){


  this.allService.getAl('/atributo/no_en_planeador?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Atributo no visible en tarjetas planeador',
      text: '¡Se ha quitado el atributo de las tarjetas!',
      timer:1500,
      showConfirmButton:false  
    })
    // this.modal.close()
    this.listarTodos();
  })
}


}