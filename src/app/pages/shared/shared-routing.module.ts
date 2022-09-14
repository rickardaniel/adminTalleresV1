import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { SidebarReporteComponent } from './sidebar-reporte/sidebar-reporte.component';

const routes: Routes = [
  {
    path:'navbar', component: NavBarComponent
  },
  {
    path:'sidebar', component: SideBarComponent
  },
  {
    path:'sidebar_reportes', component: SidebarReporteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
