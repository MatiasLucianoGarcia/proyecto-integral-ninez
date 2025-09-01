import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	imports: [MatSidenavModule, MatButtonModule],
	standalone: true,
})
export class SidebarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	showSidebar = this.dashboardSidebarService.getInfo();
}
