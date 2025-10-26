import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserDataService } from '../../features/login/data/user-data.service';

@Injectable({
	providedIn: 'root',
})
export class SessionGuard implements CanActivate {
	constructor(private userDataService: UserDataService, private router: Router) {}

	canActivate(): boolean {
		const user = this.userDataService.getUser();
		if (user) {
			console.log('User is logged in:', user);
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}
