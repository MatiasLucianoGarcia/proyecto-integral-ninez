import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { Salud } from '../../domain/salud.model';

@Component({
    selector: 'app-salud-general',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDividerModule
    ],
    templateUrl: './salud-general.component.html',
    styleUrl: './salud-general.component.scss'
})
export class SaludGeneralComponent implements OnChanges {
    @Input() salud: Salud | null = null;
    @Input() isViewMode = false;
    @Output() save = new EventEmitter<Partial<Salud>>();

    private fb = inject(FormBuilder);

    isEditing = signal(false);
    saludForm!: FormGroup;

    constructor() {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['salud'] && this.salud) {
            this.updateForm(this.salud);
        }
    }

    private initForm(): void {
        this.saludForm = this.fb.group({
            nombre: [''], // Obra Social
            enfermedad_cronica: [''],
            tratamiento_prolongado: [''],
            discapacidad: [''],
            adicciones: ['']
        });
    }

    private updateForm(data: Salud): void {
        this.saludForm.patchValue({
            nombre: data.nombre || '',
            enfermedad_cronica: data.enfermedad_cronica || '',
            tratamiento_prolongado: data.tratamiento_prolongado || '',
            discapacidad: data.discapacidad || '',
            adicciones: data.adicciones || ''
        });
    }

    toggleEdit(): void {
        if (this.isViewMode) return;
        this.isEditing.set(true);
    }

    onCancel(): void {
        this.isEditing.set(false);
        if (this.salud) {
            this.updateForm(this.salud);
        } else {
            this.saludForm.reset();
        }
    }

    onSave(): void {
        if (this.saludForm.valid) {
            this.save.emit(this.saludForm.value);
            this.isEditing.set(false);
        }
    }
}
