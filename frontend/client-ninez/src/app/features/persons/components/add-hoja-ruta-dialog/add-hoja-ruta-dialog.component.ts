import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ServicioLocalService } from '../../services/servicio-local.service';
import { ServicioLocal } from '../../domain/servicio-local.model';

@Component({
    selector: 'app-add-hoja-ruta-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule
    ],
    templateUrl: './add-hoja-ruta-dialog.component.html',
    styleUrls: ['./add-hoja-ruta-dialog.component.scss']
})
export class AddHojaRutaDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private servicioLocalService = inject(ServicioLocalService);

    form: FormGroup;
    serviciosLocales: ServicioLocal[] = [];

    constructor(
        public dialogRef: MatDialogRef<AddHojaRutaDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.form = this.fb.group({
            id_servicio_local: ['', Validators.required],
            fecha: [new Date(), Validators.required],
            actividad: ['', [Validators.required, Validators.minLength(5)]],
            resultado: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

    ngOnInit(): void {
        this.loadServiciosLocales();
    }

    loadServiciosLocales(): void {
        // We need to fetch available services for this person to link the Hoja Ruta
        this.servicioLocalService.getServiciosLocalesByDni(this.data.dni).subscribe({
            next: (data) => {
                this.serviciosLocales = data;
                // If there is only one service, select it automatically
                if (data.length === 1) {
                    this.form.patchValue({ id_servicio_local: data[0].id });
                }
            },
            error: (err) => console.error('Error loading servicios locales', err)
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.form.valid) {
            // Format date to YYYY-MM-DD
            const rawDate = this.form.value.fecha;
            const formattedDate = new Date(rawDate).toISOString().split('T')[0];

            const result = {
                ...this.form.value,
                fecha: formattedDate
            };

            this.dialogRef.close(result);
        }
    }
}
