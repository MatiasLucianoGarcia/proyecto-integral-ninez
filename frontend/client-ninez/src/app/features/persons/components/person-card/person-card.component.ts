import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
	private router = inject(Router);
	person = input.required<Persona>();

	onViewDetails(): void {
		this.router.navigate(['/person-form'], {
			queryParams: {
				mode: 'view',
				dni: this.person().dni,
			},
		});
	}

	onEdit(): void {
		this.router.navigate(['/person-form'], {
			queryParams: {
				mode: 'edit',
				dni: this.person().dni,
			},
		});
	}
}
