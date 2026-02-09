import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-add-trabajo-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-trabajo-dialog.component.html',
    styleUrl: './add-trabajo-dialog.component.scss'
})
export class AddTrabajoDialogComponent {
    form: FormGroup;
    private fb = inject(FormBuilder);

    constructor(
        public dialogRef: MatDialogRef<AddTrabajoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.form = this.fb.group({
            dni: [data.dni, Validators.required],
            descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
            horario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            fecha_real: [new Date(), Validators.required]
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
