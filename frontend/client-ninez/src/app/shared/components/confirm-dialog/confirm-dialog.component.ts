import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="warn">warning</mat-icon> {{ data.title }}
      </h2>
    </div>
    <div mat-dialog-content class="dialog-content">
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end" class="dialog-actions">
      <button mat-stroked-button (click)="onCancel()" class="cancel-button">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-button">
        {{ data.confirmText || 'Eliminar' }}
      </button>
    </div>
  `,
    styles: [`
    .dialog-header {
      padding: 16px 24px 0;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
    .dialog-content {
      padding: 16px 24px; 
      p { margin: 0; font-size: 16px;}
    }
    .dialog-actions {
      padding: 8px 24px 16px;
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
