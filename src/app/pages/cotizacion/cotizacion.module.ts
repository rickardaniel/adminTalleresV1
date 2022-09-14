import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';

import { CotizacionRoutingModule } from './cotizacion-routing.module';
import { NuevaCotizacionComponent } from './nueva-cotizacion/nueva-cotizacion.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule} from 'angular-bootstrap-md';


@NgModule({
  declarations: [
    NuevaCotizacionComponent
  ],
  imports: [
    CommonModule,
    CotizacionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    MDBBootstrapModule.forRoot()
  
  ],
  providers: [
    DecimalPipe,
    TitleCasePipe
    // DatePipe
  ],
})
export class CotizacionModule { }
