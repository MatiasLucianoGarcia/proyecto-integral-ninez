import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlMedico } from '../../domain/control-medico.model';
import { sortByDateDesc } from '../../../../shared/utils/date-sorter';

@Component({
    selector: 'app-control-medico-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './control-medico-list.component.html',
    styleUrl: './control-medico-list.component.scss'
})
export class ControlMedicoListComponent implements OnChanges {
    @Input() controles: ControlMedico[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<ControlMedico>();

    sortedControles: ControlMedico[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['controles']) {
            this.sortedControles = sortByDateDesc(this.controles);
        }
    }

    onDelete(control: ControlMedico): void {
        if (this.isViewMode) return;
        this.delete.emit(control);
    }
}
