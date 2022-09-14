import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
declare function cerrarModal1(params:string):any;
// declare function arregloValoresAuto(i: any, tam: any): any;
@Component({
  selector: 'app-control-calidad',
  templateUrl: './control-calidad.component.html',
  styleUrls: ['./control-calidad.component.scss']
})
export class ControlCalidadComponent implements OnInit {


  //TABLA
  previous: string;
  searchText: string = '';
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;

//bandera

banderaTrash= false;
banderaTrash2= false;

categorias:any=[];
elements1:any=[];
itemsA:any=[];
categoria:any;
descripcion:any;

  modal:any;
  arregloManejado:any=[];

  //CALIFICACIONES
  evaluacion:any=[];
  elements2:any=[];

  //itemsBorrados

  itemsBorrados:any=[];


  constructor(
    private allService: AllServiceService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {

    this.listarTodos();
    this.listarTodos1();
  }


  // =================== FORMULARIOS ============================

  formCrearC = new FormGroup({
    nombre: new FormControl('', Validators.required),
    items : this.fb.array(['']),
    descripcion : new FormControl('', Validators.required)
  })
  formEditarC = new FormGroup({
    nombre: new FormControl('', Validators.required),
    items : this.fb.array(['']),
    // itemS : new FormControl('', Validators.required),
    descripcion : new FormControl('', Validators.required),
    borrados: new FormControl('')
  })
  get f()
{
    return this.formCrearC.controls;   
}
  get f1()
{
    return this.formEditarC.controls;   
}


formCrearCAL = new FormGroup({
  nombre: new FormControl('', Validators.required)
})
formEditarCAL = new FormGroup({
  nombre: new FormControl('', Validators.required)
})

get f2()
{
    return this.formCrearCAL.controls;   
}
  get f3()
{
    return this.formEditarCAL.controls;   
}

  // ============================ ABRIR MODAL =================================
abrirModal (ModalContent: any): void {
  this.modal = this.modalService.open(ModalContent,{size:'md'});
}
cerrarModal(){
  this.modal.close();
}
resetear(){
  this.formCrearC.reset();

  let tam = this.items.length;
  // console.log('tam',tam);

  for (let i = 1; i < tam; i++) {
   
    this.items.removeAt(0);
  }
  if(tam == tam){
this.banderaTrash = false;
  }
  
}
resetear2(){
  // this.formEditarC.reset();

  let tam = this.itemS.length;
  // console.log('tam',tam);

  for (let i = 1; i < tam; i++) {
   
    this.itemS.removeAt(0);
  }
//   if(tam == tam){
// this.banderaTrash = false;
//   }
this.banderaTrash = true;
  
}

get items() {
  return this.formCrearC.get('items') as FormArray;
}
get itemS() {
  return this.formEditarC.get('items') as FormArray;
}

agregarI() {
  this.items.push(this.fb.control(['']));
  this.banderaTrash = true;
  this.banderaTrash2 = true;
}

borrarTS(i:any) {

  this.items.removeAt(i);
  if(this.items.length == 1){
    this.banderaTrash= false;
  }

}

agregarI2() {
  this.itemS.push(this.fb.control(['']));
  // this.servicio.push(this.fb.control(''));
  if(this.itemS.length>0){
    this.banderaTrash = true;
    this.banderaTrash2 = true;
  }
 
}

borrarTS2(i:any) {

  this.itemS.removeAt(i);
  if(this.itemS.length == 0){
    this.banderaTrash= false;
  }
  else
  if(this.itemS.length == 0 && this.itemsA.length>0 ){
    this.banderaTrash2 = true;
  }

  else
  if(this.itemsA.length==0 && this.itemS.length==1){
    this.banderaTrash = false;
  }

}
borradoFISICO(idE:any, id:any){

  // console.log('Position',idE);
  // console.log('idItem', id);
  // let iB=[id];
  this.itemsBorrados.push(id);
  // console.log(this.itemsBorrados);
  
  let arreglo = this.itemsA;
 
  let arregloPedido:any=[];
  for (let i = 0; i < this.itemsA.length; i++) {

    if(i != idE){
      arregloPedido.push(arreglo[i]);
    }
  }
  this.itemsA = arregloPedido;

  // console.log("items", this.itemsA);
  

  if(this.itemsA.length == 1  && this.itemS.length == 0){
    this.banderaTrash2= false;
  }else 

  if(this.itemsA.length == 1 && this.itemS.length > 0){
    this.banderaTrash2= true;
  }
  // console.log('nuev', this.itemsA);
  else 
  if(this.itemS.length ==1 && this.itemsA==0){
    this.banderaTrash= false;
  }
}



arregloValoresAuto(i:any, tam:any){
  let x;
  for (let j = 0; j < tam; j++) {
      // var x = document.getElementById("floatingInputNombre2" + i).value;
       x = (document.getElementById('floatingInputNombre1'+i) as HTMLInputElement).value;
  }
  return x;
}

// ================================ METODOS CRUD ========================================

ingresarNombreItem(form: any) {
  let arrayIdAtributosAcrear = new Array(this.itemsA.length);
  let arrayValoresaCrear = new Array(this.itemsA.length);

  for (let i = 0; i < this.itemsA.length; i++) {
    arrayIdAtributosAcrear[i] = this.itemsA[i].nombre;
    arrayValoresaCrear[i] = this.arregloValoresAuto(i, this.itemsA.length);
    // arrayValoresaCrear[i] = arregloValoresAuto(i, this.itemsA.length);

  }
  form.items = arrayValoresaCrear;

}


listarTodos(){
  let i = 0;
  this.allService.getALL('control_calidad', i).subscribe((data:any)=>{
    this.categorias = data;
    // console.log("data atributos =>", this.categorias);

  })
}

crear(form:any){

  console.log(form);
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando categorías control de calidad',
    text:'Se está creando las categorías , espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'control_calidad/insert').subscribe((data:any)=>{
    console.log("RES", data);

    Swal.close();

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Categoria creada correctamente',
      timer:1200,
      showConfirmButton:false
      });
    
      this.modal.close(); 
       this.listarTodos();

  })
}

obtenerPorID(id:string){

  this.itemS.removeAt(0);
  // console.log("Id que me llega => ", id);
  this.allService.getSimple('control_calidad/all_item?id_c='+id).then((data:any)=>{
    this.elements1 = data;

    this.itemsA = this.elements1.items;
    this.categoria = this.elements1.categoria[0].nombre;
    this.descripcion = this.elements1.categoria[0].descripcion;
    // console.log("Datos unicos=", this.elements1);

    this.formEditarC.setValue({
      'nombre':this.categoria,
      'items':[],
      'descripcion': this.descripcion,
      'borrados':''

    })

    if(this.itemsA.length==1){
      this.banderaTrash2 = false;
    }else
    if(this.itemsA.length > 0){
      this.banderaTrash2 = true;
    }
    this.itemS.removeAt(0);
  })
  
}

editar( form:any, el: string){
  
  // console.log('itemsA',this.itemsA);
  // console.log("id que debe llegar", el);
  // console.log('form', form);
  form.borrados = this.itemsBorrados;
  this.arregloManejado = el;
  let id = this.arregloManejado.categoria[0].id;

  // console.log("nombre que me llega", form.nombre);  
  // console.log("descripcion que me llega", form.descripcion);  
  // console.log("items que llega", form.items);  

  let arr = new Array;
  let arr2 = new Array;
  let valForm = new Array;
  
  if(form.items.length==0){

    for (let i = 0; i < this.itemsA.length; i++) {
      this.ingresarNombreItem(form);
    }

  }else
    if(form.items.length >0 && this.itemsA.length > 0){

      for (let i = 0; i < this.itemsA.length; i++) {
        arr = this.itemsA[i].nombre;
        arr2.push(arr);
      }
      valForm = form.items;
      form.items = arr2.concat(valForm);
    }
  // console.log('AL FINAL',form);
  
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'control_calidad/update_categoria/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Categoría actualizada correctamente',
      timer:1200,
      showConfirmButton:false
      }); 
      cerrarModal1('#modalEC')
      this.listarTodos();
  },(err)=>{   
    
    // console.log(err);
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Categoría actualizada correctamente',
      timer:1200,
      showConfirmButton:false
      }); 
    
    // Swal.fire({
    //       icon: 'error',
    //       title: '¡Error!',
    //       text: err.error.message + ' Ha ocurrido algo inesperado',
    //       confirmButtonColor: '#818181'
    // })      
        // console.log(err.error.message + ' Ha ocurrido algo inesperado');
        cerrarModal1('#modalEC');
          this.formEditarC.reset();
      }) 
}




deshabilitar(id:any){
  // console.log("id que debe llegar =>", id); 

  this.allService.getAl('control_calidad/disable?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Categoría deshabilitada',
      text: '¡La categoría se ha deshabilitado correctamente!',
      timer:1200,
      showConfirmButton:false  
    })
    // this.modal.close()
    this.listarTodos();
  })
}

habilitar(id:string){

  this.allService.getAl('control_calidad/enable?id='+id).then((data:any)=>{
    // console.log("Atributo habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Categoría habilitada',
      text: '¡La categoría se ha habilitado correctamente!',   
      timer:1200,
      showConfirmButton:false
    })
    // this.modal.close()
   this.listarTodos();
  })

}


cerrarMODAL(){
  cerrarModal1("#modalEC");
  this.formEditarC.reset();
}


// ====================================== CRUD CALIFICACION ==================================


listarTodos1(){
  let i = 0;
  this.allService.getSimple('control_calidad/all_revision').then((data:any)=>{
    this.evaluacion = data;
    // console.log("data evaluacion =>", this.evaluacion);
  })
}

crearE(form:any){

  // console.log(form);
  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Creando categorías control de calidad',
    text:'Se está creando las categorías , espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'control_calidad/insert_revision').subscribe((data:any)=>{
    // console.log("RES", data);

    Swal.close();

    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Parámetro de evaluación creado correctamente',
      timer:1200,
      showConfirmButton:false
      });
    
      this.modal.close(); 
       this.listarTodos1();

  })
}

obtenerPorIDE(id:string){

  this.allService.getSimple('control_calidad/revision_id?id='+id).then((data:any)=>{
    this.elements2 = data.data;
    // console.log(this.elements2 );
    this.formEditarCAL.setValue({
      'nombre':this.elements2[0].nombre,
    })

  })
}

editarE( form:any, id: string){

  

  Swal.fire({
    allowOutsideClick:false,
    icon:'info',
    title:'Guardando cambios',
    text:'Se está guardando los cambios, espere por favor' ,
    });
    Swal.showLoading();

  this.allService.postAL(form, 'control_calidad/update_revision/id/'+id).subscribe(data=>{
    // console.log("unidad mofificada"); 
    Swal.close();
    Swal.fire({
      allowOutsideClick:false,
      icon:'info',
      title:'info',
      text:'Parámetro actualizado correctamente',
      timer:1200,
      showConfirmButton:false
      }); 
      this.modal.close();
      this.listarTodos1();
  },(err)=>{    
    Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: err.error.message + ' Ha ocurrido algo inesperado',
          confirmButtonColor: '#818181'
    })      
        // console.log(err.error.message + ' Ha ocurrido algo inesperado');
          this.formEditarCAL.reset();
      }) 
}


deshabilitarE(id:any){
  // console.log("id que debe llegar =>", id); 

  this.allService.getAl('control_calidad/disable_revision?id='+id).then((data:any)=>{
    Swal.fire({
      icon: 'success',
      title: 'Parámetro deshabilitado',
      text: '¡Parámetro deshabilitado correctamente!',
      timer:1200,
      showConfirmButton:false 
    })
    // this.modal.close()
    this.listarTodos1();
  })
}

habilitarE(id:string){

  this.allService.getAl('control_calidad/enable_revision?id='+id).then((data:any)=>{
    // console.log("Atributo habilitada", data);
    Swal.fire({
      icon: 'success',
      title: 'Parámetro habilitado',
      text: '¡El Parámetro se ha habilitado correctamente!',   
      timer:1200,
      showConfirmButton:false
    })
    // this.modal.close()
   this.listarTodos1();
  })

}


}
