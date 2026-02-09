import { Component, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';
import { Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserDataService } from '../../../login/data/user-data.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-nav-bar',
	imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatMenuModule, MatBadgeModule, MatDividerModule, RouterModule],
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.scss',
	standalone: true,
})
export class NavBarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	private router = inject(Router);
	private userService = inject(UserDataService);
	user = this.userService.getUser();
	@Output() menuClick = new EventEmitter<void>();
	opened: Signal<boolean> = this.dashboardSidebarService.getInfo();

	toggleSidebar() {
		this.dashboardSidebarService.setInfo(!this.opened());
	}

	logout() {
		this.userService.clearUser();
		this.router.navigate(['/login']);
	}
}
