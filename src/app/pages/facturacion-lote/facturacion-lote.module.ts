import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturacionLoteRoutingModule } from './facturacion-lote-routing.module';
import { FacturarFlotaComponent } from './facturar-flota/facturar-flota.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [
    FacturarFlotaComponent
  ],
  imports: [
    CommonModule,
    FacturacionLoteRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    
  ]
})
export class FacturacionLoteModule { }
