import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerPlaneadorComponent } from './ver-planeador/ver-planeador.component';
import { CerrarOrdenComponent } from './cerrar-orden/cerrar-orden.component';
import { PlaneadorDetalleComponent } from './planeador-detalle/planeador-detalle.component';

const routes: Routes = [
  {
    path:'ver_planeador', component: VerPlaneadorComponent
  },
  // {
  //   path:'planeador_detalle', component: PlaneadorDetalleComponent
  // },
  {
    path:'cerrar_orden', component: CerrarOrdenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaneadorRoutingModule { }
