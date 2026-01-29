import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CondicionesVidaService } from '../../services/condiciones-vida.service';
import { CondicionesVida } from '../../domain/condiciones-vida.model';

@Component({
    selector: 'app-condiciones-vida',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './condiciones-vida.component.html',
    styleUrl: './condiciones-vida.component.scss'
})
export class CondicionesVidaComponent {
    private fb = inject(FormBuilder);
    private condicionesService = inject(CondicionesVidaService);
    private snackBar = inject(MatSnackBar);

    dni = input.required<number | string>();
    isViewMode = input<boolean>(false);

    form: FormGroup;
    loading = signal<boolean>(false);
    currentData = signal<CondicionesVida | null>(null);

    // List of conditions to iterate over in template
    conditions = [
        { key: 'acceso_luz', label: 'Acceso a Luz Eléctrica' },
        { key: 'acceso_gas', label: 'Acceso a Gas Natural' },
        { key: 'acceso_agua', label: 'Acceso a Agua Potable' },
        { key: 'acceso_internet', label: 'Acceso a Internet' },
        { key: 'alimentos_propios', label: 'Produce Alimentos Propios' }
    ];

    constructor() {
        this.form = this.fb.group({
            acceso_luz: [false],
            acceso_gas: [false],
            acceso_agua: [false],
            acceso_internet: [false],
            alimentos_propios: [false]
        });

        // Effect to load data when DNI changes
        effect(() => {
            const currentDni = this.dni();
            if (currentDni) {
                this.loadData(Number(currentDni));
            }
        });

        // No need for form enable/disable logic anymore since we handle it in template
    }

    toggleCondition(key: string): void {
        if (this.isViewMode()) return;

        const control = this.form.get(key);
        if (control) {
            control.setValue(!control.value);
            this.form.markAsDirty();
        }
    }

    loadData(dni: number): void {
        this.loading.set(true);
        this.condicionesService.getCondicionesVida(dni).subscribe({
            next: (data) => {
                this.currentData.set(data);
                this.form.patchValue({
                    acceso_luz: data.acceso_luz,
                    acceso_gas: data.acceso_gas,
                    acceso_agua: data.acceso_agua,
                    acceso_internet: data.acceso_internet,
                    alimentos_propios: data.alimentos_propios
                });
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading condiciones de vida', err);
                this.loading.set(false);
            }
        });
    }

    onSave(): void {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.condicionesService.updateCondicionesVida(Number(this.dni()), this.form.value).subscribe({
            next: () => {
                this.snackBar.open('Condiciones de vida actualizadas', 'Cerrar', { duration: 3000 });
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error updating condiciones de vida', err);
                this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
                this.loading.set(false);
            }
        });
    }
}
