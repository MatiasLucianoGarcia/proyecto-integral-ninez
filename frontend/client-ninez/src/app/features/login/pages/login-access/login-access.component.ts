import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-login-access',
	standalone: true,
	imports: [MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, CommonModule],
	templateUrl: './login-access.component.html',
	styleUrls: ['./login-access.component.scss'],
})
export class LoginAccessComponent {
	loginForm: FormGroup;
	hide = true;

	constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
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
