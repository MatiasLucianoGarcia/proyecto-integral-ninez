import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-login-access',
	standalone: true,
	templateUrl: './login-access.component.html',
	styleUrls: ['./login-access.component.scss'],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatCheckboxModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
	],
})
export class LoginAccessComponent {
	private fb: FormBuilder = inject(FormBuilder);
	private router: Router = inject(Router);
	private loginService: LoginService = inject(LoginService);
	loginForm: FormGroup;
	hide = true;
	loading = signal(false);

	constructor() {
		// Check for saved user
		const savedUser = localStorage.getItem('savedUser');

		this.loginForm = this.fb.group({
			name: [savedUser || '', [Validators.required]],
			password: ['', Validators.required],
			rememberMe: [!!savedUser],
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.loading.set(true);
			const { name, password, rememberMe } = this.loginForm.value;

			console.log('Form Data:', this.loginForm.value);
			this.loginService.login(name, password).subscribe({
				next: (response) => {
					console.log('Login successful:', response);

					// Handle Remember Me
					if (rememberMe) {
						localStorage.setItem('savedUser', name);
					} else {
						localStorage.removeItem('savedUser');
					}

					this.router.navigate(['/dashboard']);
					// Loading remains true while navigating
				},
				error: (error) => {
					console.error('Login failed:', error);
					this.loginForm.setErrors({ invalidLogin: true });
					this.loading.set(false);
				},
			});
		}
	}
}
