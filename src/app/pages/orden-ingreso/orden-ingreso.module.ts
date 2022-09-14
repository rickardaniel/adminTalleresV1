import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';

import { OrdenIngresoRoutingModule } from './orden-ingreso-routing.module';
import { NuevaOrdenComponent } from './nueva-orden/nueva-orden.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    NuevaOrdenComponent
  ],
  imports: [
    CommonModule,
    OrdenIngresoRoutingModule,
    SharedModule,
    HttpClientModule,
    MDBBootstrapModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    DatePipe,
    TitleCasePipe
  ],
  exports:[
    NuevaOrdenComponent
  ]
})
export class OrdenIngresoModule { }
