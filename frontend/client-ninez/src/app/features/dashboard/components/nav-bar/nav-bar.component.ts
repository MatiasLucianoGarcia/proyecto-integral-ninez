import { Component, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSidebarService } from '../../services/dashboard-sidebar.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-nav-bar',
	imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule],
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.scss',
	standalone: true,
})
export class NavBarComponent {
	private dashboardSidebarService: DashboardSidebarService = inject(DashboardSidebarService);
	opened: Signal<boolean> = this.dashboardSidebarService.getInfo();

	toggleSidebar() {
		this.dashboardSidebarService.setInfo(!this.opened());
	}
	@Output() menuClick = new EventEmitter<void>();
}
