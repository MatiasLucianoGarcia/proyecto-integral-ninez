import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CreateIngreso } from '../../domain/ingreso.model';
import { EfectorService } from '../../services/efector.service';
import { ProgramaService } from '../../services/programa.service';
import { FamilyService } from '../../services/family.service';
import { Efector } from '../../domain/efector.model';
import { Programa } from '../../domain/programa.model';
import { FamilyMember } from '../../domain/familia.model';

export interface IngresoDialogData {
    dni: number;
}

@Component({
    selector: 'app-add-ingreso-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    templateUrl: './add-ingreso-dialog.component.html',
    styleUrl: './add-ingreso-dialog.component.scss',
})
export class AddIngresoDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private efectorService = inject(EfectorService);
    private programaService = inject(ProgramaService);
    private familyService = inject(FamilyService);

    ingresoForm: FormGroup;
    efectores = signal<Efector[]>([]);
    programas = signal<Programa[]>([]);
    familyMembers = signal<FamilyMember[]>([]);

    constructor(
        public dialogRef: MatDialogRef<AddIngresoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IngresoDialogData
    ) {
        this.ingresoForm = this.fb.group({
            id_efector: [''],
            id_programa: ['', Validators.required],
            dni_familiar: [''],
            observaciones: ['']
        });
    }

    ngOnInit(): void {
        this.loadOptions();
    }

    private loadOptions(): void {
        this.efectorService.getEfectores().subscribe({
            next: (data) => this.efectores.set(data),
            error: (err) => console.error('Error loading efectores', err)
        });

        this.programaService.getProgramas().subscribe({
            next: (data) => this.programas.set(data),
            error: (err) => console.error('Error loading programas', err)
        });

        this.familyService.getFamilyByDNI(this.data.dni).subscribe({
            next: (data) => this.familyMembers.set(data),
            error: (err) => console.error('Error loading family', err)
        });
    }

    onSubmit(): void {
        if (this.ingresoForm.valid) {
            const formValue = this.ingresoForm.value;
            const newIngreso: CreateIngreso = {
                dni: this.data.dni,
                id_efector: formValue.id_efector || null,
                id_programa: formValue.id_programa,
                dni_familiar: formValue.dni_familiar || null,
                fecha_ingreso: new Date(),
                observaciones: formValue.observaciones
            };
            this.dialogRef.close(newIngreso);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
