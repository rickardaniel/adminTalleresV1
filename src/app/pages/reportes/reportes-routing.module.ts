import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { OrdenAgendadaComponent } from './orden-agendada/orden-agendada.component';
import { OrdenCerradaComponent } from './orden-cerrada/orden-cerrada.component';

import { ReporteOrdenAbiertaComponent } from './reporte-orden-abierta/reporte-orden-abierta.component';
import { ReporteXtecnicoComponent } from './reporte-x-tecnico/reporte-xtecnico.component';


const routes: Routes = [
  {
    path:'reporte_orden_abierta', component: ReporteOrdenAbiertaComponent
  },
  {
    path:'orden_cerrada', component: OrdenCerradaComponent
  },
  {
    path:'cotizacion', component: CotizacionComponent
  },
  {
    path:'reporte_tecnico', component: ReporteXtecnicoComponent
  },
  {
    path:'orden_agendada', component: OrdenAgendadaComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
