import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaCotizacionComponent } from './nueva-cotizacion/nueva-cotizacion.component';

const routes: Routes = [
  {
    path:'nueva_cotizacion', component: NuevaCotizacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionRoutingModule { }
