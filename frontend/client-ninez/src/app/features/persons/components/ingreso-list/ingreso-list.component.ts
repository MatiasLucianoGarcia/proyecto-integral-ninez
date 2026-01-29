import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ingreso } from '../../domain/ingreso.model';

@Component({
    selector: 'app-ingreso-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
    templateUrl: './ingreso-list.component.html',
    styleUrl: './ingreso-list.component.scss',
})
export class IngresoListComponent {
    ingresos = input.required<Ingreso[]>();
    isViewMode = input<boolean>(false);

    deleteIngreso = output<Ingreso>();

    onDelete(ingreso: Ingreso): void {
        this.deleteIngreso.emit(ingreso);
    }
}
