import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  salir(){
    Swal.fire({
      title: 'Cerrar Sesión',
      text: '¿Está seguro de cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#B5B5B5',
      cancelButtonColor: '#F51F36',
      cancelButtonText:'Cancelar',
      confirmButtonText: '!Si, cerrar sesión!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('Inflogueo');
        // localStorage.removeItem('InfEmpresa');
        localStorage.removeItem('api_system');
        this.route.navigateByUrl('login/acceso')
      }
    });
  }
}
