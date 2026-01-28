import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-add-perdida-dialog',
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
      <mat-icon class="title-icon">heart_broken</mat-icon>
      Agregar Pérdida
    </h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-field">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="descripcion" rows="4" placeholder="Describa la pérdida significativa..."></textarea>
            <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Requerido</mat-error>
            <mat-error *ngIf="form.get('descripcion')?.hasError('minlength')">Mínimo 5 caracteres</mat-error>
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
export class AddPerdidaDialogComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddPerdidaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.form = this.fb.group({
            dni: [data.dni, Validators.required],
            descripcion: ['', [Validators.required, Validators.minLength(5)]]
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
