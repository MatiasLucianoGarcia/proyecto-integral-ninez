import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InteresesService } from '../../services/intereses.service';
import { Intereses } from '../../domain/intereses.model';

@Component({
    selector: 'app-intereses',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './intereses.component.html',
    styleUrls: ['./intereses.component.scss']
})
export class InteresesComponent implements OnInit {
    @Input() dni!: number | string;
    @Input() isViewMode = false;

    private fb = inject(FormBuilder);
    private interesesService = inject(InteresesService);
    private snackBar = inject(MatSnackBar);

    form: FormGroup;
    loading = signal(false);
    initialData: Intereses | null = null;

    constructor() {
        this.form = this.fb.group({
            gustos: [''],
            vinculos_significativos: [''],
            datos_desarrollo: ['']
        });
    }

    ngOnInit(): void {
        if (this.dni) {
            this.loadIntereses();
        }
    }

    loadIntereses(): void {
        this.loading.set(true);
        this.interesesService.getIntereses(Number(this.dni)).subscribe({
            next: (data) => {
                if (data) {
                    this.initialData = data;
                    this.form.patchValue({
                        gustos: data.gustos || '',
                        vinculos_significativos: data.vinculos_significativos || '',
                        datos_desarrollo: data.datos_desarrollo || ''
                    });
                }
                if (this.isViewMode) {
                    this.form.disable();
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error cargando intereses', err);
                // Si es 404, no es error, es que no existe data aun.
                this.loading.set(false);
                if (this.isViewMode) {
                    this.form.disable();
                }
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid || this.isViewMode) return;

        this.loading.set(true);
        const dataToSave = {
            ...this.form.value
        };

        this.interesesService.updateIntereses(Number(this.dni), dataToSave).subscribe({
            next: (response) => {
                this.snackBar.open('Información actualizada correctamente', 'Cerrar', { duration: 3000 });
                this.initialData = response;
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error actualizando intereses', err);
                this.snackBar.open('Error al actualizar información', 'Cerrar', { duration: 3000 });
                this.loading.set(false);
            }
        });
    }
}
