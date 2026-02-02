import { Component, inject } from '@angular/core';
import { NavBarComponent } from '../../dashboard/components/nav-bar/nav-bar.component';
import { DashboardSidebarService } from '../../dashboard/services/dashboard-sidebar.service';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [NavBarComponent, MatDrawerContainer, MatDrawer, SidebarComponent, RouterOutlet],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
    private dashboardSidebarServices: DashboardSidebarService = inject(DashboardSidebarService);
    showSidebar = this.dashboardSidebarServices.getInfo();
}
