import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	standalone: true,
	imports: [MatSidenavModule, MatButtonModule],
})
export class SidebarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	showSidebar = this.dashboardSidebarService.getInfo();
}
