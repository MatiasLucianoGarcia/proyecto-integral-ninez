import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlMedico } from '../../domain/control-medico.model';

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
export class ControlMedicoListComponent {
    @Input() controles: ControlMedico[] = [];
    @Input() isViewMode = false;
    @Output() delete = new EventEmitter<ControlMedico>();

    onDelete(control: ControlMedico): void {
        if (this.isViewMode) return;
        this.delete.emit(control);
    }
}
