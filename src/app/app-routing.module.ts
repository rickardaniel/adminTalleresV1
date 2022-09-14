import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoGuardGuard } from './guards/acceso-guard.guard';
import { NuevaOrdenComponent } from './pages/orden-ingreso/nueva-orden/nueva-orden.component';

const routes: Routes = [

  {
    path:'login', loadChildren:()=>import('./pages/login/login.module').then(m=>m.LoginModule)
  },
  {
    path:'orden/nueva_orden', component: NuevaOrdenComponent, canActivate:[AccesoGuardGuard]
  },
  {
    path:'', redirectTo:'orden/nueva_orden', pathMatch:'full'
  },
  {
    path:'orden', loadChildren:()=>import('./pages/orden-ingreso/orden-ingreso.module').then(m=>m.OrdenIngresoModule), canActivate:[AccesoGuardGuard]
  },
  {
    path:'header', loadChildren:()=>import('./pages/shared/shared.module').then(m=>m.SharedModule),canActivate:[AccesoGuardGuard]
  },
  {
    path:'talleres', loadChildren:()=>import('./pages/talleres/talleres.module').then(m=>m.TalleresModule),canActivate:[AccesoGuardGuard]
  },
  {
    path:'planeador', loadChildren:()=>import('./pages/planeador/planeador.module').then(m=>m.PlaneadorModule),canActivate:[AccesoGuardGuard]
  },
  {
    path:'reportes', loadChildren:()=>import('./pages/reportes/reportes.module').then(m=>m.ReportesModule),canActivate:[AccesoGuardGuard]
  },
  {
    path:'cotizacion', loadChildren:()=>import('./pages/cotizacion/cotizacion.module').then(m=>m.CotizacionModule),canActivate:[AccesoGuardGuard]
  },
  {
    path:'facturar', loadChildren:()=>import('./pages/facturacion-lote/facturacion-lote.module').then(m=>m.FacturacionLoteModule),canActivate:[AccesoGuardGuard]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
