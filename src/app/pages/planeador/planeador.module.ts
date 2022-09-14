import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

import { PlaneadorRoutingModule } from './planeador-routing.module';
import { VerPlaneadorComponent } from './ver-planeador/ver-planeador.component';
import { SharedModule } from '../shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PlaneadorDetalleComponent } from './planeador-detalle/planeador-detalle.component';
import { RouterModule } from '@angular/router';
import { CerrarOrdenComponent } from './cerrar-orden/cerrar-orden.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ObjectToArrayPipe } from 'src/objectToArray.pipe';
import { PipeTransformPipe } from 'src/app/pipes/pipe-transform.pipe';

@NgModule({
  declarations: [
    VerPlaneadorComponent,
    PlaneadorDetalleComponent,
    CerrarOrdenComponent,
    PipeTransformPipe
    // TitleCasePipe
    // ObjectToArrayPipe
  ],
  imports: [
    CommonModule,
    PlaneadorRoutingModule,
    SharedModule,
    MDBBootstrapModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    NgbModule,
    FormsModule,

  
  ],
  exports:[
    PlaneadorDetalleComponent
  ],
  providers: [
    // DecimalPipe,
    // DatePipe,
  ],
  bootstrap: [PlaneadorDetalleComponent]
})
export class PlaneadorModule { }
