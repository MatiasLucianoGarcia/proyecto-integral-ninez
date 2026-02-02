import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../services/users.service';
import { User } from '../../../login/domain/user';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
    selector: 'app-user-dialog',
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
            <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Nuevo' }} Usuario</h2>
            <mat-dialog-content>
                <form [formGroup]="userForm" class="dialog-form flex flex-col gap-4 pt-2">
                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Nombre de Usuario</mat-label>
                        <input matInput formControlName="nombre" placeholder="Ej. juan.perez">
                        <mat-error *ngIf="userForm.get('nombre')?.hasError('required')">El nombre es requerido</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Contraseña</mat-label>
                        <input matInput formControlName="contraseña" type="password" [placeholder]="isEdit ? 'Dejar en blanco para mantener actual' : 'Ingrese contraseña'">
                        <mat-hint *ngIf="isEdit">Solo completar si desea cambiarla</mat-hint>
                        <mat-error *ngIf="userForm.get('contraseña')?.hasError('required')">La contraseña es requerida</mat-error>
                        <mat-error *ngIf="userForm.get('contraseña')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
                    </mat-form-field>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Entidad</mat-label>
                            <mat-select formControlName="id_entidad" placeholder="Seleccionar entidad">
                                <mat-option *ngFor="let ent of entities" [value]="ent.id">
                                    {{ ent.nombre }}
                                </mat-option>
                            </mat-select>
                            <mat-error *ngIf="userForm.get('id_entidad')?.hasError('required')">Campo requerido</mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="w-full">
                            <mat-label>Rol</mat-label>
                            <mat-select formControlName="id_rol" placeholder="Seleccionar rol">
                                <mat-option *ngFor="let rol of roles" [value]="rol.id">
                                    {{ rol.nombre_rol }}
                                </mat-option>
                            </mat-select>
                            <mat-error *ngIf="userForm.get('id_rol')?.hasError('required')">Campo requerido</mat-error>
                        </mat-form-field>
                    </div>
                </form>
            </mat-dialog-content>

            <div mat-dialog-actions align="end">
                <button mat-button mat-dialog-close>Cancelar</button>
                <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="save()">
                    {{ isEdit ? 'Guardar Cambios' : 'Crear Usuario' }}
                </button>
            </div>
        </div>
        `
})
export class UserDialogComponent implements OnInit {
    private fb = inject(FormBuilder);
    private usersService = inject(UsersService);
    private adminDataService = inject(AdminDataService);

    userForm: FormGroup;
    isEdit = false;
    entities: any[] = [];
    roles: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user?: User }
    ) {
        this.isEdit = !!data.user;
        this.userForm = this.fb.group({
            nombre: [data.user?.nombre || '', Validators.required],
            contraseña: [
                '',
                this.isEdit ? [] : [Validators.required, Validators.minLength(6)]
            ],
            id_entidad: [data.user?.entidad?.id || '', Validators.required],
            id_rol: [data.user?.rol?.id || '', Validators.required]
        });

        // Patch role id if we can find it. 
        // Wait, the User interface from 'login/domain/user' has `rol: { nombre_rol: string }`. It might NOT have `id`.
        // My backend service for `getAllUsuarios` returns `rol(id, nombre_rol)`. I need to update the User interface or cast it.
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.adminDataService.getEntities().subscribe(ents => this.entities = ents);
        this.adminDataService.getRoles().subscribe(roles => this.roles = roles);
    }

    save() {
        if (this.userForm.valid) {
            const formValue = this.userForm.value;

            // If edit and password is empty, remove it
            if (this.isEdit && !formValue.contraseña) {
                delete formValue.contraseña;
            }

            if (this.isEdit && this.data.user) {
                this.usersService.updateUser(this.data.user.id, formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            } else {
                this.usersService.createUser(formValue).subscribe({
                    next: () => this.dialogRef.close(true),
                    error: (err) => console.error(err)
                });
            }
        }
    }
}
