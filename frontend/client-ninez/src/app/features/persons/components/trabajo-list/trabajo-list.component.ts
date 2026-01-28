import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Trabajo } from '../../domain/trabajo.model';

@Component({
    selector: 'app-trabajo-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './trabajo-list.component.html',
    styleUrl: './trabajo-list.component.scss'
})
export class TrabajoListComponent {
    @Input() trabajos: Trabajo[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<Trabajo>();

    onDelete(trabajo: Trabajo): void {
        if (this.isViewMode) return;
        this.delete.emit(trabajo);
    }
}
