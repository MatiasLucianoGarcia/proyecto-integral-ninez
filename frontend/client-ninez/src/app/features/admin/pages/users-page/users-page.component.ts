import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { UserDialogComponent } from 'src/app/features/admin/components/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { User } from '../../../login/domain/user';

interface EntityGroup {
  entityName: string;
  users: User[];
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule
  ],
  styleUrl: './users-page.component.scss',
  template: `
    <div class="page-container">
      <!-- Header Section (Matches SearchPersonComponent) -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <mat-icon class="title-icon">manage_accounts</mat-icon>
            <div>
              <h1 class="title">Administración de Usuarios</h1>
              <p class="subtitle">Gestiona el acceso y los roles de los usuarios del sistema</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
           <button mat-flat-button class="add-button" (click)="openUserDialog()">
            <mat-icon>add</mat-icon>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="users.length === 0" class="empty-state">
          <mat-icon>people_outline</mat-icon>
          <h3>No hay usuarios</h3>
          <p>No se encontraron usuarios registrados o hubo un error al cargar.</p>
          <button mat-stroked-button color="primary" (click)="loadUsers()">Recargar</button>
      </div>

      <!-- Users Content -->
      <div class="content-section" *ngIf="users.length > 0">
        <div *ngFor="let group of entityGroups" class="entity-group">
          
          <div class="group-header">
            <div class="group-title">
                <div class="group-icon">
                    <mat-icon>business</mat-icon>
                </div>
                <h2>{{ group.entityName }}</h2>
            </div>
            <span class="user-count">
              {{ group.users.length }} usuarios
            </span>
          </div>

          <div class="users-grid">
            <div *ngFor="let user of group.users" class="user-card">
              <div class="user-info">
                  <div class="user-avatar">
                    {{ user.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-details">
                    <h3>{{ user.nombre }}</h3>
                    <div class="role-badge" 
                         [ngClass]="{'admin': user.rol.nombre_rol === 'Administrador', 'user': user.rol.nombre_rol !== 'Administrador'}">
                        {{ user.rol.nombre_rol }}
                    </div>
                  </div>
              </div>
              
              <div class="card-actions">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
              
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="openUserDialog(user)">
                  <mat-icon color="primary">edit</mat-icon>
                  <span>Editar</span>
                </button>
                <button mat-menu-item (click)="deleteUser(user)">
                  <mat-icon color="warn">delete</mat-icon>
                  <span>Eliminar</span>
                </button>
              </mat-menu>
            </div>
          </div>

        </div>
      </div>
    </div>
    `
})
export class UsersPageComponent implements OnInit {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  users: User[] = [];
  entityGroups: EntityGroup[] = [];

  ngOnInit() {
    console.log('UsersPageComponent initialized');
    this.loadUsers();
  }

  loadUsers() {
    console.log('Loading users...');
    this.usersService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        this.users = users;
        this.groupUsersByEntity();
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  groupUsersByEntity() {
    const groups: { [key: string]: User[] } = {};

    this.users.forEach(user => {
      const entityName = user.entidad?.nombre || 'Sin Entidad';
      if (!groups[entityName]) {
        groups[entityName] = [];
      }
      groups[entityName].push(user);
    });

    this.entityGroups = Object.keys(groups).map(key => ({
      entityName: key,
      users: groups[key]
    })).sort((a, b) => a.entityName.localeCompare(b.entityName));

    console.log('Entity Groups:', this.entityGroups);
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar al usuario ${user.nombre}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => {
            console.error('Error deleting user', err);
            // Optional: Show error snackbar
          }
        });
      }
    });
  }
}
