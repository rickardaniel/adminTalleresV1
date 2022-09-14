import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { EstadoModel } from '../../Modelos/estado.model';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {
  searchText: string = '';
  elements :any=[];
  elements1 :any=[];
  elements2:any;
  previous: string;
  public modal : any;

  i: EstadoModel;

  url='estado';

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;

  constructor(private allService: AllServiceService, private cdRef: ChangeDetectorRef,  private modalService  : NgbModal) { }

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
  estado: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  })
  
  formEditar = new FormGroup({
    estado: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
  })
  
  get f()
  {
      return this.formCrear.controls;   
  }
  get f1()
  {
      return this.formEditar.controls;   
  }
  
 

  enviar(el:any){
    this.elements1 = el;
    }
  resetear(){
      this.formCrear.reset()
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
    this.allService.getALL(this.url,this.i).subscribe((data:any) => {

        this.elements= JSON.parse(data);
        this.elements = this.elements.data;
        // console.log("data atributos =>", this.elements);       
        this.mdbTable.setDataSource(this.elements);
        this.elements = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      });
  }

// ==================================================== CREAR ===============================================================


crear(form: EstadoModel){
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando estado',
    text:'Se está creando el estado , espere por favor' ,
    });
    Swal.showLoading();
  this.allService.postAL(form, 'estado/insert').subscribe(data=>{
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

// =============================================== BUSCAR POR ID ============================================================

obtenerPorID(id:string){
  // console.log("Id que me llega => ", id);
  this.allService.getAl('estado/by_id?id='+id).then((data:any)=>{
    this.elements1 = data;
    // console.log("Datos unicos=", this.elements1);
      this.formEditar.setValue({
    'estado': this.elements1.estado,
    'descripcion': this.elements1.descripcion
    });
    // console.log("datos actualizar", this.formEditar.value);
  })
}



// ================================================== ACTUALIZAR ============================================================
editar( form:EstadoModel, id: string){

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();
  // console.log("id que debe llegar", id);
  this.allService.postAL(form, 'estado/update_by_id/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 

    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Estado actualizado correctamente',
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

  this.allService.getAl('/estado/disable?id='+id).then((data:any)=>{
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


// =================================================== HABILITAR ======================================================================

habilitar(id:string){

  this.allService.getAl('/estado/enable?id='+id).then((data:any)=>{
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
}