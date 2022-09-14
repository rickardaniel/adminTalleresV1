import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoTalleresComponent } from './acceso-talleres/acceso-talleres.component';

const routes: Routes = [
  {
    path:"acceso", component: AccesoTalleresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
