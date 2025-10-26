import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-login-access',
	standalone: true,
	templateUrl: './login-access.component.html',
	styleUrls: ['./login-access.component.scss'],
	imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, ReactiveFormsModule],
})
export class LoginAccessComponent {
	private fb: FormBuilder = inject(FormBuilder);
	private router: Router = inject(Router);
	private loginService: LoginService = inject(LoginService);
	loginForm: FormGroup;
	hide = true;

	constructor() {
		this.loginForm = this.fb.group({
			name: ['', [Validators.required]],
			password: ['', Validators.required],
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			console.log('Form Data:', this.loginForm.value);
			this.loginService.login(this.loginForm.value.name, this.loginForm.value.password).subscribe({
				next: (response) => {
					console.log('Login successful:', response);
					this.router.navigate(['/dashboard']);
				},
				error: (error) => {
					console.error('Login failed:', error);
					this.loginForm.setErrors({ invalidLogin: true });
				},
			});
		}
	}
}
