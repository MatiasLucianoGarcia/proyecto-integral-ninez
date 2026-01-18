import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	standalone: true,
	imports: [MatSidenavModule, MatButtonModule, MatIconModule, RouterLink],
})
export class SidebarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	showSidebar = this.dashboardSidebarService.getInfo();
}
