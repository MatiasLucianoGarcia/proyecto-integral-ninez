import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-simple-item-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
        <div class="custom-dialog-container">
            <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nuevo' }} {{ data.title }}</h2>
            <mat-dialog-content>
                <form [formGroup]="form" class="dialog-form flex flex-col gap-4 pt-2">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>{{ data.label }}</mat-label>
                        <input matInput formControlName="nombre" [placeholder]="'Nombre del ' + data.title">
                        <mat-error *ngIf="form.get('nombre')?.hasError('required')">Este campo es requerido</mat-error>
                    </mat-form-field>

                    <mat-form-field *ngIf="data.secondaryField" appearance="outline" class="w-full">
                        <mat-label>{{ data.secondaryField.label }}</mat-label>
                        <input matInput [formControlName]="data.secondaryField.name" [placeholder]="data.secondaryField.label">
                    </mat-form-field>
                </form>
            </mat-dialog-content>

            <div mat-dialog-actions align="end">
                <button mat-button mat-dialog-close>Cancelar</button>
                <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">
                    {{ isEdit ? 'Guardar Cambios' : 'Crear' }}
                </button>
            </div>
        </div>
    `
})
export class SimpleItemDialogComponent {
    private fb = inject(FormBuilder);

    form: FormGroup;
    isEdit = false;

    constructor(
        public dialogRef: MatDialogRef<SimpleItemDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            label: string,
            item?: any,
            secondaryField?: { name: string, label: string }
        }
    ) {
        this.isEdit = !!data.item;
        const group: any = {
            nombre: [data.item?.nombre || '', Validators.required]
        };

        if (data.secondaryField) {
            group[data.secondaryField.name] = [data.item?.[data.secondaryField.name] || ''];
        }

        this.form = this.fb.group(group);
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
