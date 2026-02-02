import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
    selector: 'app-rol-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
        <div class="custom-dialog-container">
            <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nuevo' }} Rol</h2>
            <mat-dialog-content>
                <form [formGroup]="form" class="dialog-form flex flex-col gap-4 pt-2">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Nombre del Rol</mat-label>
                        <input matInput formControlName="nombre_rol" placeholder="Ej. Administrador">
                        <mat-error *ngIf="form.get('nombre_rol')?.hasError('required')">El nombre es requerido</mat-error>
                    </mat-form-field>
                </form>
            </mat-dialog-content>

            <div mat-dialog-actions align="end">
                <button mat-button mat-dialog-close>Cancelar</button>
                <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">
                    {{ isEdit ? 'Guardar Cambios' : 'Crear Rol' }}
                </button>
            </div>
        </div>
    `
})
export class RolDialogComponent {
    private fb = inject(FormBuilder);
    private adminDataService = inject(AdminDataService);

    form: FormGroup;
    isEdit = false;

    constructor(
        public dialogRef: MatDialogRef<RolDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { rol?: any }
    ) {
        this.isEdit = !!data.rol;
        this.form = this.fb.group({
            nombre_rol: [data.rol?.nombre_rol || '', Validators.required]
        });
    }

    save() {
        if (this.form.valid) {
            const formValue = this.form.value;

            if (this.isEdit && this.data.rol) {
                this.adminDataService.updateRole(this.data.rol.id, formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            } else {
                this.adminDataService.createRole(formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            }
        }
    }
}
