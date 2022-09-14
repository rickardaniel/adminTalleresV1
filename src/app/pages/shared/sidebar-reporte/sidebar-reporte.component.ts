import { Component, OnInit } from '@angular/core';
declare function botonNav():any;
@Component({
  selector: 'app-sidebar-reporte',
  templateUrl: './sidebar-reporte.component.html',
  styleUrls: ['./sidebar-reporte.component.scss']
})
export class SidebarReporteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    botonNav();
  }

}
