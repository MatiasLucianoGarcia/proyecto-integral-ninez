import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Perdida } from '../../domain/perdida.model';
import { sortByDateDesc } from '../../../../shared/utils/date-sorter';

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
export class PerdidaListComponent implements OnChanges {
    @Input() perdidas: Perdida[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<Perdida>();

    sortedPerdidas: Perdida[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['perdidas']) {
            this.sortedPerdidas = sortByDateDesc(this.perdidas);
        }
    }

    onDelete(perdida: Perdida): void {
        if (this.isViewMode) return;
        this.delete.emit(perdida);
    }
}
