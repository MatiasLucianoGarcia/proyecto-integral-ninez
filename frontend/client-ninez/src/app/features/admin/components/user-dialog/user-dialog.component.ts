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
        <div class="dialog-container">
            <div class="dialog-header flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 class="text-xl font-bold text-gray-800 m-0 tracking-tight">{{ isEdit ? 'Editar' : 'Nuevo' }} Usuario</h2>
                <button mat-icon-button mat-dialog-close class="text-gray-400 hover:text-gray-600">
                    <mat-icon>close</mat-icon>
                </button>
            </div>

            <mat-dialog-content class="!p-6">
                <form [formGroup]="userForm" class="flex flex-col gap-5">
                    <div class="form-section">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input matInput formControlName="nombre" placeholder="Ej. juan.perez">
                            <mat-error *ngIf="userForm.get('nombre')?.hasError('required')">El nombre es requerido</mat-error>
                        </mat-form-field>
                    </div>

                    <div class="form-section">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <mat-form-field appearance="outline" class="w-full">
                            <input matInput formControlName="contraseña" type="password" [placeholder]="isEdit ? 'Dejar en blanco para mantener actual' : 'Ingrese contraseña'">
                            <mat-hint *ngIf="isEdit" class="text-xs text-gray-400">Solo completar si desea cambiarla</mat-hint>
                            <mat-error *ngIf="userForm.get('contraseña')?.hasError('required')">La contraseña es requerida</mat-error>
                            <mat-error *ngIf="userForm.get('contraseña')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
                        </mat-form-field>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-section">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
                            <mat-form-field appearance="outline" class="w-full">
                                <mat-select formControlName="id_entidad" placeholder="Seleccionar entidad">
                                    <mat-option *ngFor="let ent of entities" [value]="ent.id">
                                        {{ ent.nombre }}
                                    </mat-option>
                                </mat-select>
                                <mat-error *ngIf="userForm.get('id_entidad')?.hasError('required')">Campo requerido</mat-error>
                            </mat-form-field>
                        </div>

                        <div class="form-section">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <mat-form-field appearance="outline" class="w-full">
                                <mat-select formControlName="id_rol" placeholder="Seleccionar rol">
                                    <mat-option *ngFor="let rol of roles" [value]="rol.id">
                                        {{ rol.nombre_rol }}
                                    </mat-option>
                                </mat-select>
                                <mat-error *ngIf="userForm.get('id_rol')?.hasError('required')">Campo requerido</mat-error>
                            </mat-form-field>
                        </div>
                    </div>
                </form>
            </mat-dialog-content>

            <div mat-dialog-actions align="end" class="!p-6 !border-t !border-gray-100 !bg-gray-50/50">
                <button mat-stroked-button mat-dialog-close class="!rounded-full !px-6 border-gray-300 text-gray-600">Cancelar</button>
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
