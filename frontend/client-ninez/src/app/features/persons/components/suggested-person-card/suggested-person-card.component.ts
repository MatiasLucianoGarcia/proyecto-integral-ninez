import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Persona } from '../../domain/persona.model';

@Component({
	selector: 'app-suggested-person-card',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './suggested-person-card.component.html',
	styleUrls: ['./suggested-person-card.component.scss'],
})
export class SuggestedPersonCardComponent {
	@Input({ required: true }) person!: Persona;

	@Output() add = new EventEmitter<Persona>();
	@Output() view = new EventEmitter<Persona>();

	onAdd(): void {
		this.add.emit(this.person);
	}
}
