import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
    selector: 'app-parentezco-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    template: `
        <div class="custom-dialog-container">
            <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nuevo' }} Parentesco</h2>
            <mat-dialog-content>
                <form [formGroup]="form" class="dialog-form flex flex-col gap-4 pt-2">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Descripción</mat-label>
                        <input matInput formControlName="descripcion" placeholder="Ej. Padre">
                        <mat-error *ngIf="form.get('descripcion')?.hasError('required')">Este campo es requerido</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Parentesco Inverso</mat-label>
                        <mat-select formControlName="id_inverso">
                            <mat-option [value]="null">-- Ninguno --</mat-option>
                            <mat-option *ngFor="let p of availableParentezcos" [value]="p.id">
                                {{ p.descripcion }}
                            </mat-option>
                        </mat-select>
                        <mat-hint>Ej. El inverso de "Padre" es "Hijo"</mat-hint>
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
export class ParentezcoDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private adminDataService = inject(AdminDataService);

    form: FormGroup;
    isEdit = false;
    availableParentezcos: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<ParentezcoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { item?: any }
    ) {
        this.isEdit = !!data.item;
        this.form = this.fb.group({
            descripcion: [data.item?.descripcion || '', Validators.required],
            id_inverso: [data.item?.id_inverso || null]
        });
    }

    ngOnInit() {
        this.adminDataService.getParentezcos().subscribe(data => {
            // Filter out self to avoid selecting itself as inverse (though technically possible, usually confusing)
            // Actually, for "Sibling" it makes sense. But for "Father" it doesn't.
            // Let's just exclude the current item if editing to avoid circular reference bugs in UI if any, 
            // but backend handles it fine. Let's allow everything except simple ID check.
            this.availableParentezcos = data.filter(p => !this.isEdit || p.id !== this.data.item.id);
        });
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
