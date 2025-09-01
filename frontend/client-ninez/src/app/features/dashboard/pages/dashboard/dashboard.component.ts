import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
	selector: 'app-dashboard',
	imports: [NavBarComponent, MatDrawerContainer, MatDrawer, SidebarComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	private dashboardSidebarServices: DashboardSidebarService = inject(DashboardSidebarService);
	showSidebar = this.dashboardSidebarServices.getInfo();
}
