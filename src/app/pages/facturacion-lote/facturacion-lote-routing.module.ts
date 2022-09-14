import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturarFlotaComponent } from './facturar-flota/facturar-flota.component';

const routes: Routes = [
  {
    path:'facturar_flota', component: FacturarFlotaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionLoteRoutingModule { }
