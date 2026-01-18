import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Persona } from '../../domain';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-person-card',
	imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
	templateUrl: './person-card.component.html',
	styleUrl: './person-card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCardComponent {
	person = input.required<Persona>();
}
