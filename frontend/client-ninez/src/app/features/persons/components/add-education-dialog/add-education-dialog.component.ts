import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Escolaridad } from '../../domain/escolaridad.model';

@Component({
  selector: 'app-add-education-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-education-dialog.component.html',
  styleUrl: './add-education-dialog.component.scss'
})
export class AddEducationDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddEducationDialogComponent>);

  educationForm: FormGroup;
  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dni: number }) {
    this.educationForm = this.fb.group({
      dni: [data.dni, Validators.required],
      escuela: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nivel: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      anio: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.educationForm.valid) {
      const formValue = this.educationForm.getRawValue();
      const escolaridad: Escolaridad = {
        dni: formValue.dni,
        escuela: formValue.escuela,
        nivel: formValue.nivel,
        anio: formValue.anio
      };
      this.dialogRef.close(escolaridad);
    }
  }
}
