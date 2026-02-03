import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Escolaridad } from '../../domain/escolaridad.model';
import { sortByDateDesc } from '../../../../shared/utils/date-sorter';

@Component({
  selector: 'app-education-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './education-list.component.html',
  styleUrl: './education-list.component.scss'
})
export class EducationListComponent implements OnChanges {
  @Input({ required: true }) escolaridades: Escolaridad[] = [];
  @Input() isViewMode = false;
  @Output() delete = new EventEmitter<Escolaridad>();

  sortedEscolaridades: Escolaridad[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['escolaridades']) {
      this.sortedEscolaridades = sortByDateDesc(this.escolaridades);
    }
  }

  onDelete(item: Escolaridad): void {
    this.delete.emit(item);
  }
}
