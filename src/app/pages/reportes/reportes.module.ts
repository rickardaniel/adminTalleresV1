import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReporteOrdenAbiertaComponent } from './reporte-orden-abierta/reporte-orden-abierta.component';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrdenIngresoModule } from '../orden-ingreso/orden-ingreso.module';
import { OrdenCerradaComponent } from './orden-cerrada/orden-cerrada.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ObjectToArrayPipe } from 'src/objectToArray.pipe';
import { ReporteXtecnicoComponent } from './reporte-x-tecnico/reporte-xtecnico.component';
import { OrdenAgendadaComponent } from './orden-agendada/orden-agendada.component';



@NgModule({
  declarations: [
    ReporteOrdenAbiertaComponent,
    OrdenCerradaComponent,
    CotizacionComponent,
    ReporteXtecnicoComponent,
    OrdenAgendadaComponent,

   
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    DataTablesModule,
    MDBBootstrapModule,
    ReactiveFormsModule,
    // OrdenIngresoModule,
    FormsModule,
    NgbModule
  ],
  providers:[
    DatePipe,
    TitleCasePipe,
    DecimalPipe
  ]
})
export class ReportesModule { }
