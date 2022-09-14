import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { PoliticaModel } from '../../Modelos/politicas.model';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.scss']
})
export class PoliticasComponent implements OnInit {

  searchText: string = '';
 
  elements :any=[];
  elements1:any=[];
  elements2:any;
  previous: string;
  i: PoliticaModel
  public modal : any;
  nota:any;
  activarStock:any=[];

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;


  constructor(private allService: AllServiceService, private cdRef: ChangeDetectorRef,private modalService  : NgbModal) { }

  ngOnInit(): void {
    this.listarTodos();
    this.listarTodosSTOCk();
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




    formEditar = new FormGroup({
      nota: new FormControl('', [Validators.required]),
      // detalle: new FormControl('', [Validators.required])
      })
  
  get f()
  {
      return this.formEditar.controls;   
  }
  
  resetear(){
  this.formEditar.reset();
  }

  abrirModal (ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent,{size:'lg'});
  }
  cerrarModal(){
    this.modal.close();
  }

  //  ==========================================+ METODOS CRUD ROLES +======================================================

listarTodos(){
  this.allService.getAl('politica/by_id').then(data => {
    // console.log(data);
    this.elements = data;
    let texto = this.elements[0].valor2;
   let nota=  texto.slice(11, -11);
  // console.log(nota);
    this.nota = nota;
  // console.log("politica ", this.elements);
  
      this.mdbTable.setDataSource(this.elements);
      this.elements = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });
}
// =============================================== BUSCAR POR ID ============================================================

obtenerPorID(id:string){

  // console.log("Id que me llega => ", id);
  this.allService.getAl('politica/by_id').then((data:any)=>{
    this.elements1 = data;
    let texto = this.elements[0].valor2;
    let nota=  texto.slice(11, -11);
  //  console.log(nota);
     this.nota = nota;
    // console.log("Datos unicos=", this.elements1);
    this.formEditar.setValue({
      'nota': this.elements1[0].valor2,
      // 'detalle': this.elements1.detalle
    });
    // console.log("datos actualizar", this.formEditar.value);
  })
  
}

// ==================================================== CREAR ===============================================================


crear(form:any){
}

// ================================================== ACTUALIZAR ============================================================
// ================================================== ACTUALIZAR ============================================================

editar( form:PoliticaModel, id: string){
  // console.log("id que debe llegar", id);

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'politica/edit_nota/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Política actualizada correctamente',
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
    // =============================== CRUD CONTROL DE STOCK =============================

    listarTodosSTOCk(){
      this.allService.getAl('producto/by_id_stock').then((data:any)=>{
          this.activarStock = data
          // console.log('lo qe', this.activarStock);
      })
    }
    habilitar(id:string){

      this.allService.getAl('/producto/enable_stock?id='+id).then((data:any)=>{
        // console.log("Atributo habilitada", data);

        Swal.fire({
          icon: 'success',
          title: 'Control Stock Activado',
          text: '¡El control de stock se ha activado correctamente!',
          timer:1200,
          showConfirmButton:false  
        })

  
       this.listarTodosSTOCk();
      })
    
    }

    deshabilitar(id:any){
      // console.log("id que debe llegar =>", id); 
    
      this.allService.getAl('/producto/disable_stock?id='+id).then((data:any)=>{
        Swal.fire({
          icon: 'success',
          title: 'Control Stock desactivado',
          text: '¡El control de stock se ha desactivado correctamente!',   
          timer:1200,
          showConfirmButton:false
        })
    
        this.listarTodosSTOCk();
      })
    }

    

    
}
