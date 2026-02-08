import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { UserDataService } from '../../../login/data/user-data.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,

    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
    private userDataService = inject(UserDataService);
    private profileService = inject(ProfileService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);

    user = this.userDataService.getUser();
    hidePassword = true;
    loading = signal(false);

    passForm: FormGroup = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    onSubmit(formDirective: FormGroupDirective) {
        if (this.passForm.valid) {
            this.loading.set(true);
            const newPass = this.passForm.get('password')?.value;

            this.profileService.updatePassword(newPass).subscribe({
                next: () => {
                    this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
                    this.loading.set(false);
                    // Reset standard form and the directive to clear submitted/touched state
                    formDirective.resetForm();
                    this.passForm.reset();
                },
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Error al actualizar contraseña', 'Cerrar', { duration: 3000 });
                    this.loading.set(false);
                }
            });
        }
    }
}
