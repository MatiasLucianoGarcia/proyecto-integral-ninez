import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';
import { UserDataService } from '../../../login/data/user-data.service';
import { computed } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	standalone: true,
	imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule, RouterLink],
})
export class SidebarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	private userDataService = inject(UserDataService);

	showSidebar = this.dashboardSidebarService.getInfo();

	isAdmin = computed(() => {
		const user = this.userDataService.getUser();
		return user?.rol?.nombre_rol === 'Administrador';
	});

	canViewDerechosReport = computed(() => {
		return true; // Visible para todos
	});
}
