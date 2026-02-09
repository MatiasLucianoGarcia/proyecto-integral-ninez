import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateDomicilio } from '../../domain/domicilio.model';

export interface AddressDialogData {
    dni: number;
}

@Component({
    selector: 'app-add-address-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-address-dialog.component.html',
    styleUrl: './add-address-dialog.component.scss',
})
export class AddAddressDialogComponent {
    private fb = inject(FormBuilder);

    addressForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<AddAddressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AddressDialogData
    ) {
        this.addressForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            numero: ['', [Validators.required]],
            fecha_real: [new Date(), Validators.required],
        });
    }

    onSubmit(): void {
        if (this.addressForm.valid) {
            const formValue = this.addressForm.value;
            const newAddress: CreateDomicilio = {
                dni: this.data.dni,
                nombre: formValue.nombre,
                numero: formValue.numero,
                fecha_real: formValue.fecha_real,
            };
            this.dialogRef.close(newAddress);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
