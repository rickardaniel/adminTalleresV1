import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AllServiceService } from '../services/all-service.service';


@Injectable({
  providedIn: 'root'
})
export class AccesoGuardGuard implements CanActivate {

  constructor(private router: Router,private allService :AllServiceService){}
  canActivate(){

    if (!this.allService.estaAutenticado()) {
      this.router.navigate(['/login/acceso']);
      return false;
  }
        return true;
}
}
