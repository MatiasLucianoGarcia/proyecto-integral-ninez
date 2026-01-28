import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Actividad } from '../../domain/actividad.model';

@Component({
    selector: 'app-actividades-extra-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './actividad-list.component.html',
    styleUrls: ['./actividad-list.component.scss']
})
export class ActividadesExtraListComponent {
    @Input() actividades: Actividad[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<Actividad>();

    onDelete(actividad: Actividad): void {
        if (this.isViewMode) return;
        this.delete.emit(actividad);
    }
}
