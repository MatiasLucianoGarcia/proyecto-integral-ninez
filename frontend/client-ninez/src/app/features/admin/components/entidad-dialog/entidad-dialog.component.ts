import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
    selector: 'app-entidad-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule
    ],
    template: `
        <div class="custom-dialog-container">
            <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nueva' }} Entidad</h2>
            <mat-dialog-content>
                <form [formGroup]="form" class="dialog-form flex flex-col gap-4 pt-2">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Nombre de la Entidad</mat-label>
                        <input matInput formControlName="nombre" placeholder="Ej. Ministerio de Salud">
                        <mat-error *ngIf="form.get('nombre')?.hasError('required')">El nombre es requerido</mat-error>
                    </mat-form-field>

                     <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Descripción</mat-label>
                        <textarea matInput formControlName="descripcion" rows="4" placeholder="Ingrese una descripción detallada..."></textarea>
                    </mat-form-field>

                    <div class="py-2">
                        <mat-checkbox formControlName="servicio_local" color="primary">¿Es Servicio Local?</mat-checkbox>
                    </div>
                </form>
            </mat-dialog-content>

            <div mat-dialog-actions align="end">
                <button mat-button mat-dialog-close>Cancelar</button>
                <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">
                    {{ isEdit ? 'Guardar Cambios' : 'Crear Entidad' }}
                </button>
            </div>
        </div>
    `
})
export class EntidadDialogComponent {
    private fb = inject(FormBuilder);
    private adminDataService = inject(AdminDataService);

    form: FormGroup;
    isEdit = false;

    constructor(
        public dialogRef: MatDialogRef<EntidadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { entity?: any }
    ) {
        this.isEdit = !!data.entity;
        this.form = this.fb.group({
            nombre: [data.entity?.nombre || '', Validators.required],
            descripcion: [data.entity?.descripcion || ''],
            servicio_local: [data.entity?.servicio_local || false, Validators.required]
        });
    }

    save() {
        if (this.form.valid) {
            const formValue = this.form.value;

            if (this.isEdit && this.data.entity) {
                this.adminDataService.updateEntity(this.data.entity.id, formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            } else {
                this.adminDataService.createEntity(formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            }
        }
    }
}
