import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { AccesoTalleresComponent } from './acceso-talleres/acceso-talleres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectToArrayPipe } from 'src/objectToArray.pipe';
@NgModule({
  declarations: [
    AccesoTalleresComponent,
    ObjectToArrayPipe
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
  ]
})
export class LoginModule { }
