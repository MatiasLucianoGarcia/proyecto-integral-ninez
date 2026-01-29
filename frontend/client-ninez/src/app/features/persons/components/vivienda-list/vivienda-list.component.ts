import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Vivienda } from '../../domain/vivienda.model';

@Component({
  selector: 'app-vivienda-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './vivienda-list.component.html',
  styleUrl: './vivienda-list.component.scss',
})
export class ViviendaListComponent {
  viviendas = input.required<Vivienda[]>();
  isViewMode = input<boolean>(false);

  deleteVivienda = output<Vivienda>();

  onDelete(vivienda: Vivienda): void {
    this.deleteVivienda.emit(vivienda);
  }
}
