import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Articulacion } from '../../domain/articulacion.model';

@Component({
  selector: 'app-articulacion-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
  templateUrl: './articulacion-list.component.html',
  styleUrl: './articulacion-list.component.scss',
})
export class ArticulacionListComponent {
  articulaciones = input.required<Articulacion[]>();
  isViewMode = input<boolean>(false);

  deleteArticulacion = output<Articulacion>();

  onDelete(articulacion: Articulacion): void {
    this.deleteArticulacion.emit(articulacion);
  }
}
