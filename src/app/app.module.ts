import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdenIngresoModule } from './pages/orden-ingreso/orden-ingreso.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportesModule } from './pages/reportes/reportes.module';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AccesoGuardGuard } from './guards/acceso-guard.guard';
import { CotizacionModule } from './pages/cotizacion/cotizacion.module';
import { TalleresModule } from './pages/talleres/talleres.module';
import { PlaneadorModule } from './pages/planeador/planeador.module';
import { FacturacionLoteModule } from './pages/facturacion-lote/facturacion-lote.module';
// import { ObjectToArrayPipe } from 'src/objectToArray.pipe';
// import { PipeTransformPipe } from './pipes/pipe-transform.pipe';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    // PipeTransformPipe,
    // PipeTransformPipe

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OrdenIngresoModule,
    ReportesModule,
    NgbModule,
    CotizacionModule,
    TalleresModule, 
    FacturacionLoteModule,

  ],
  providers: [
    {provide:LOCALE_ID, useValue:'es'},
    {provide: LocationStrategy, useClass: HashLocationStrategy }, AccesoGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
