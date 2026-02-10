import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SearchPersonComponent } from '../../../persons/components/search-person/search-person.component';
import { DashboardAlertsComponent } from '../../components/dashboard-alerts/dashboard-alerts.component';

@Component({
	selector: 'app-dashboard',
	imports: [NavBarComponent, MatDrawerContainer, MatDrawer, SidebarComponent, SearchPersonComponent, DashboardAlertsComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	private dashboardSidebarServices: DashboardSidebarService = inject(DashboardSidebarService);
	showSidebar = this.dashboardSidebarServices.getInfo();
}
