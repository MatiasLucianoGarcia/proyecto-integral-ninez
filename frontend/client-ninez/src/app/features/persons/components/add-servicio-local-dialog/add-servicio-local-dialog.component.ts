import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ServicioLocalService } from '../../services/servicio-local.service';
import { EfectorService } from '../../services/efector.service';
import { EquipoLocal, DerechoVulnerado } from '../../domain/servicio-local.model';
import { Efector } from '../../domain/efector.model';

@Component({
    selector: 'app-add-servicio-local-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-servicio-local-dialog.component.html',
    styleUrl: './add-servicio-local-dialog.component.scss'
})
export class AddServicioLocalDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private servicioLocalService = inject(ServicioLocalService);
    private efectorService = inject(EfectorService);
    private dialogRef = inject(MatDialogRef<AddServicioLocalDialogComponent>);

    form: FormGroup;
    equipos: EquipoLocal[] = [];
    efectores: Efector[] = [];
    derechos: DerechoVulnerado[] = [];

    constructor() {
        this.form = this.fb.group({
            id_equipo: [null, Validators.required],
            fecha_ingreso: [new Date(), Validators.required], // Default to today
            motivo_ingreso: ['', Validators.required],
            id_efector: [null, Validators.required],
            id_derecho: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDropdowns();
    }

    loadDropdowns(): void {
        this.servicioLocalService.getEquiposLocales().subscribe(data => this.equipos = data);
        this.servicioLocalService.getDerechosVulnerados().subscribe(data => this.derechos = data);
        this.efectorService.getEfectores().subscribe(data => this.efectores = data);
    }

    onSubmit(): void {
        if (this.form.valid) {
            // Format date to YYYY-MM-DD
            const rawDate = this.form.value.fecha_ingreso;
            const formattedDate = new Date(rawDate).toISOString().split('T')[0];

            const payload = {
                ...this.form.value,
                fecha_ingreso: formattedDate
            };

            this.dialogRef.close(payload);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
