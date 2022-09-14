import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaOrdenComponent } from './nueva-orden/nueva-orden.component';

const routes: Routes = [
  {
    path:'nueva_orden', component: NuevaOrdenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenIngresoRoutingModule { }
