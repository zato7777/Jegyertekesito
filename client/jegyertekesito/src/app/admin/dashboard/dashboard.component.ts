import { Component, ViewChild, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatNavList, MatToolbar, RouterOutlet, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  isSmallScreen = false;

  constructor(private observer: BreakpointObserver) {}

  ngOnInit() {}

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}