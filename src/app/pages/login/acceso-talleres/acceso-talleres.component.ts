import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AllServiceService } from 'src/app/services/all-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-acceso-talleres',
  templateUrl: './acceso-talleres.component.html',
  styleUrls: ['./acceso-talleres.component.scss']
})
export class AccesoTalleresComponent implements OnInit {

  public shop     : any;
  public modal    : any;
  public elements2: any;
  public elements = [];

  constructor(
    private allService    : AllServiceService,
    private route         : Router,
    private modalService  : NgbModal,
    private formBuilder   : FormBuilder
  ) { }

  public formRecuperarEmpresa =  this.formBuilder.group({
    ruc: ['', [Validators.required, Validators.minLength(10)]]
  })

  public formIngresoTalleres = this.formBuilder.group({
    user: ['', [Validators.required]],
    pass: ['', [Validators.required,Validators.minLength(4)]]
  })

  ngOnInit(): void {
  }

  get e() { return this.formRecuperarEmpresa.controls; }
  get credentials() { return this.formIngresoTalleres.controls; }

  openMediumModal (ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent,{ centered: true, size:'md'});
  }

  obtenerEmpresa (ModalContent:any){
    if (this.formRecuperarEmpresa.valid){
      let form =this.formRecuperarEmpresa.value;
      this.allService.getEmpresa(form.ruc).then((data:any)=>{
        // console.log("EMPRESAS",data);

        // localStorage.setItem('InfEmpresa', JSON.stringify(data))
        if (data.length > 0 ){
          if(data.length > 1) {
            this.elements = data;
            this.openMediumModal(ModalContent);
            // localStorage.setItem('InfEmpresa', JSON.stringify(this.elements))
          } else this.shop = data[0];
        } else {
          Swal.fire({
            icon  : 'error',
            title : '¡Error!',
            text  :'RUC no existe'
          })
        }
      })
    } else {
      Swal.fire({
        icon  : 'error',
        title : '¡Error!',
        text  : 'El campo no puede enviarse vacio, Debe ingresar un ruc válido'
      });
      this.formRecuperarEmpresa.reset();
    }
  }

  accesoTalleres (){
    Swal.fire({
      allowOutsideClick:false,
      icon  : 'info',
      title : 'info',
      text  : 'Espere por favor'
      });
    Swal.showLoading();
    let url = this.shop.url;
    this.allService.login(url, this.formIngresoTalleres.value.user, this.formIngresoTalleres.value.pass).then((data:any)=>{
      // console.log(data);
      // this.elements2 = data;
      Swal.close();
      if ( data.rta == true ){
        // if (data.puntosventa.length < 1 ){
        //   Swal.fire({
        //     icon  : 'warning',
        //     title : '¡Advertencia!',
        //     text  : data.msg
        //   });
        // } else {
          this.elements2 = data;
          // let urlShop = (this.shop.url).replace('"', '');
          this.allService.saveLocalStorage(this.shop.url, this.elements2);
          this.route.navigateByUrl('/orden/nueva_orden');
        // }
      }else{
        Swal.fire({
          icon  : 'warning',
          title : '¡Advertencia!',
          text  : data.msg
        });
      }
    });
  }

  saveShop(sellected : any){
    this.shop = sellected

    // console.log("ELEGIDA",this.shop.url);
    // localStorage.setItem('linkEmpresa', JSON.stringify(this.shop.url));
    
    
    this.modal.close();
  }

}
