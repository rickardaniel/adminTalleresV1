import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalleresRoutingModule } from './talleres-routing.module';

import { ServiciosComponent } from './servicios/servicios.component';
import { EstadosComponent } from './estados/estados.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { PrioridadesComponent } from './prioridades/prioridades.component';
import { SharedModule } from '../shared/shared.module';
import { AtributoComponent } from './atributos/atributo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ControlCalidadComponent } from './control-calidad/control-calidad.component';



@NgModule({
  declarations: [
    AtributoComponent,
    ServiciosComponent,
    EstadosComponent,
    PoliticasComponent,
    PrioridadesComponent,
    ControlCalidadComponent

  
  ],
  imports: [
    CommonModule,
    TalleresRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
 
  ],
})
export class TalleresModule { }
