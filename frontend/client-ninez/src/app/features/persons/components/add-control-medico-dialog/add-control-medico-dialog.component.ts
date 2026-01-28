import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-add-control-medico-dialog',
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
    templateUrl: './add-control-medico-dialog.component.html',
    styleUrl: './add-control-medico-dialog.component.scss'
})
export class AddControlMedicoDialogComponent {
    form: FormGroup;
    private fb = inject(FormBuilder);

    constructor(
        public dialogRef: MatDialogRef<AddControlMedicoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.form = this.fb.group({
            dni: [data.dni, Validators.required],
            unidad_sanitaria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            observaciones: ['', [Validators.maxLength(255)]]
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
