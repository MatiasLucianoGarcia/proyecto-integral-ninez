import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Persona } from '../../domain';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-person-card',
	imports: [MatButtonModule, MatCardModule],
	templateUrl: './person-card.component.html',
	styleUrl: './person-card.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCardComponent {
	person = input.required<Persona>();
}
