import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { UsersService } from '../../services/users.service';
import { AdminDataService } from '../../services/admin-data.service';

import { UserDialogComponent } from 'src/app/features/admin/components/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { EntidadDialogComponent } from 'src/app/features/admin/components/entidad-dialog/entidad-dialog.component';
import { RolDialogComponent } from 'src/app/features/admin/components/rol-dialog/rol-dialog.component';

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
    MatDialogModule,
    MatTabsModule
  ],
  styleUrl: './users-page.component.scss',
  template: `
    <div class="page-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <mat-icon class="title-icon">manage_accounts</mat-icon>
            <div>
              <h1 class="title">Administración del Sistema</h1>
              <p class="subtitle">Gestiona usuarios, roles y entidades</p>
            </div>
          </div>
        </div>
        
        <!-- Dynamic Action Button -->
        <div class="header-actions">
           @if (currentTabIndex === 0) {
             <button mat-flat-button class="add-button" (click)="openUserDialog()">
              <mat-icon>add</mat-icon>
              Nuevo Usuario
            </button>
           } @else if (currentTabIndex === 1) {
             <button mat-flat-button class="add-button" (click)="openEntityDialog()">
              <mat-icon>add</mat-icon>
              Nueva Entidad
            </button>
           } @else {
             <button mat-flat-button class="add-button" (click)="openRoleDialog()">
              <mat-icon>add</mat-icon>
              Nuevo Rol
            </button>
           }
        </div>
      </div>

      <mat-tab-group class="custom-tabs" animationDuration="0ms" [(selectedIndex)]="currentTabIndex">
        
        <!-- Pestaña Usuarios -->
        <mat-tab label="Usuarios">
          <div class="tab-content pt-6"> 
            
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
        </mat-tab>

        <!-- Pestaña Entidades -->
        <mat-tab label="Entidades">
           <div class="tab-content pt-6">
              <div class="content-section">
                 <div class="entities-list">
                    <div *ngFor="let entity of entities" class="user-card">
                       <div class="user-info">
                          <div class="user-avatar !bg-emerald-100 !text-emerald-600">
                             <mat-icon>business</mat-icon>
                          </div>
                          <div class="user-details">
                             <h3>{{ entity.nombre }}</h3>
                             <p class="text-xs text-gray-500 mt-1 line-clamp-3" *ngIf="entity.descripcion">{{ entity.descripcion }}</p>
                             <p class="text-xs text-gray-400 mt-1">ID: {{ entity.id }}</p>
                          </div>
                       </div>
                       <div class="card-actions">
                          <button mat-icon-button [matMenuTriggerFor]="entityMenu">
                             <mat-icon>more_vert</mat-icon>
                          </button>
                       </div>
                       <mat-menu #entityMenu="matMenu">
                          <button mat-menu-item (click)="openEntityDialog(entity)">
                             <mat-icon color="primary">edit</mat-icon>
                             <span>Editar</span>
                          </button>
                          <button mat-menu-item (click)="deleteEntity(entity)">
                             <mat-icon color="warn">delete</mat-icon>
                             <span>Eliminar</span>
                          </button>
                       </mat-menu>
                    </div>
                 </div>
              </div>
           </div>
        </mat-tab>

        <!-- Pestaña Roles -->
        <mat-tab label="Roles">
           <div class="tab-content pt-6">
               <div class="content-section">
                  <div class="entities-list">
                     <div *ngFor="let rol of roles" class="user-card">
                        <div class="user-info">
                           <div class="user-avatar !bg-purple-100 !text-purple-600">
                              <mat-icon>security</mat-icon>
                           </div>
                           <div class="user-details">
                              <h3>{{ rol.nombre_rol }}</h3>
                              <p class="text-xs text-gray-400">ID: {{ rol.id }}</p>
                           </div>
                        </div>
                        <div class="card-actions">
                           <button mat-icon-button [matMenuTriggerFor]="rolMenu">
                              <mat-icon>more_vert</mat-icon>
                           </button>
                        </div>
                        <mat-menu #rolMenu="matMenu">
                           <button mat-menu-item (click)="openRoleDialog(rol)">
                              <mat-icon color="primary">edit</mat-icon>
                              <span>Editar</span>
                           </button>
                           <button mat-menu-item (click)="deleteRole(rol)">
                              <mat-icon color="warn">delete</mat-icon>
                              <span>Eliminar</span>
                           </button>
                        </mat-menu>
                     </div>
                  </div>
               </div>
           </div>
        </mat-tab>

      </mat-tab-group>
    </div>
    `
})
export class UsersPageComponent implements OnInit {
  private usersService = inject(UsersService);
  private adminDataService = inject(AdminDataService);
  private dialog = inject(MatDialog);

  users: User[] = [];
  entities: any[] = [];
  roles: any[] = [];

  entityGroups: EntityGroup[] = [];

  currentTabIndex = 0;

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadUsers();
    this.loadEntities();
    this.loadRoles();
  }

  // --- Users Logic ---

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.groupUsersByEntity();
      },
      error: (err) => console.error('Error loading users', err)
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
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar al usuario ${user.nombre}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error deleting user', err)
        });
      }
    });
  }

  // --- Entities Logic ---

  loadEntities() {
    this.adminDataService.getEntities().subscribe(ents => this.entities = ents);
  }

  openEntityDialog(entity?: any) {
    const dialogRef = this.dialog.open(EntidadDialogComponent, {
      width: '800px',
      data: { entity },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEntities();
        this.loadUsers(); // Refresh users too as entity names might change
      }
    });
  }

  deleteEntity(entity: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Entidad',
        message: `¿Seguro de eliminar la entidad ${entity.nombre}?`,
        confirmText: 'Eliminar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminDataService.deleteEntity(entity.id).subscribe({
          next: () => {
            this.loadEntities();
            this.loadUsers();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  // --- Roles Logic ---

  loadRoles() {
    this.adminDataService.getRoles().subscribe(roles => this.roles = roles);
  }

  openRoleDialog(rol?: any) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '500px',
      data: { rol },
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadRoles();
    });
  }

  deleteRole(rol: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Rol',
        message: `¿Seguro de eliminar el rol ${rol.nombre_rol}?`,
        confirmText: 'Eliminar'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminDataService.deleteRole(rol.id).subscribe({
          next: () => this.loadRoles(),
          error: (err) => console.error(err)
        });
      }
    });
  }
}
