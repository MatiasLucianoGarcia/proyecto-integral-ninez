import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Escolaridad } from '../../domain/escolaridad.model';

@Component({
  selector: 'app-education-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './education-list.component.html',
  styleUrl: './education-list.component.scss'
})
export class EducationListComponent {
  @Input({ required: true }) escolaridades: Escolaridad[] = [];
  @Input() isViewMode = false;
  @Output() delete = new EventEmitter<Escolaridad>();

  onDelete(item: Escolaridad): void {
    this.delete.emit(item);
  }
}
