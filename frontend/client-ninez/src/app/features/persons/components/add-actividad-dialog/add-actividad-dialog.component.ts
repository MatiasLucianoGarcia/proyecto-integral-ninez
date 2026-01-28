import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Actividad } from '../../domain/actividad.model';

@Component({
    selector: 'app-add-actividad-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
    ],
    template: `
    <h2 mat-dialog-title>
      <mat-icon class="title-icon">sports_soccer</mat-icon>
      Agregar Actividad
    </h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-field">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Actividad</mat-label>
            <input matInput formControlName="actividad" placeholder="Ej: Fútbol, Piano, Inglés">
            <mat-error *ngIf="form.get('actividad')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Horario</mat-label>
            <input matInput formControlName="horario" placeholder="Ej: Lunes y Miércoles 18hs">
            <mat-error *ngIf="form.get('horario')?.hasError('required')">Requerido</mat-error>
          </mat-form-field>
        </div>

        <div class="form-field">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Observaciones</mat-label>
            <textarea matInput formControlName="observaciones" rows="3"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
    styles: [`
    .title-icon { margin-right: 8px; vertical-align: middle; color: var(--primary-color); }
    .full-width { width: 100%; }
    .form-field { margin-bottom: 16px; }
    mat-dialog-content { min-width: 400px; }
  `]
})
export class AddActividadDialogComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddActividadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.form = this.fb.group({
            dni: [data.dni, Validators.required],
            actividad: ['', Validators.required],
            horario: ['', Validators.required],
            observaciones: ['']
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
