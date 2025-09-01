import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DashboardSidebarService {
	private infoSource = signal<boolean>(false);

	setInfo(info: boolean) {
		this.infoSource.set(info);
	}

	getInfo(): Signal<boolean> {
		return this.infoSource.asReadonly();
	}
}
