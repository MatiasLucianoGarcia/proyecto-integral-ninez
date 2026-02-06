
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-drill-down-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        RouterModule
    ],
    templateUrl: './drill-down-dialog.component.html',
    styleUrls: ['./drill-down-dialog.component.scss']
})
export class DrillDownDialogComponent implements OnInit {
    displayedColumns: string[] = ['nombre', 'apellido', 'dni', 'acciones'];

    constructor(
        public dialogRef: MatDialogRef<DrillDownDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, people: any[] }
    ) { }

    ngOnInit(): void {
    }

    onClose(): void {
        this.dialogRef.close();
    }

    verPersona(id: number): void {
    }
}