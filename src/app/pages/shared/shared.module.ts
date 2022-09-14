import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ModalTSComponent } from './modal-ts/modal-ts.component';
import { SidebarReporteComponent } from './sidebar-reporte/sidebar-reporte.component';



@NgModule({
  declarations: [
    NavBarComponent,
    SideBarComponent,
    UploadImageComponent,
    
    ModalTSComponent,
          SidebarReporteComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MDBBootstrapModule
  ],
  exports:[
    NavBarComponent,
    SideBarComponent,
    UploadImageComponent,
    ModalTSComponent,
    SidebarReporteComponent
  ]
})
export class SharedModule { }
