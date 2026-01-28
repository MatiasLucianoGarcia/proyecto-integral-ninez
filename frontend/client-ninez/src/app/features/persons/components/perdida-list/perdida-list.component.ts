import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Perdida } from '../../domain/perdida.model';

@Component({
    selector: 'app-perdida-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './perdida-list.component.html',
    styleUrls: ['./perdida-list.component.scss']
})
export class PerdidaListComponent {
    @Input() perdidas: Perdida[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<Perdida>();

    onDelete(perdida: Perdida): void {
        if (this.isViewMode) return;
        this.delete.emit(perdida);
    }
}
