import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FamilyMember } from '../../domain/familia.model';

@Component({
	selector: 'app-family-tree',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
	templateUrl: './family-tree.component.html',
	styleUrl: './family-tree.component.scss',
})
export class FamilyTreeComponent {
	familyMembers = input.required<FamilyMember[]>();
	isViewMode = input<boolean>(false);

	editMember = output<FamilyMember>();
	deleteMember = output<FamilyMember>();
	viewMember = output<FamilyMember>();

	getRelationIcon(relation: string): string {
		const relationMap: { [key: string]: string } = {
			padre: 'man',
			madre: 'woman',
			hijo: 'child_care',
			hija: 'child_care',
			hermano: 'people',
			hermana: 'people',
			abuelo: 'elderly',
			abuela: 'elderly',
			tio: 'person',
			tia: 'person',
			primo: 'groups',
			prima: 'groups',
			cónyuge: 'favorite',
			esposo: 'favorite',
			esposa: 'favorite',
		};

		const lowerRelation = relation?.toLowerCase() || '';
		for (const [key, icon] of Object.entries(relationMap)) {
			if (lowerRelation.includes(key)) {
				return icon;
			}
		}
		return 'person';
	}

	getRelationColor(relation: string): string {
		const lowerRelation = relation?.toLowerCase() || '';

		if (lowerRelation.includes('padre') || lowerRelation.includes('madre')) {
			return 'primary';
		}
		if (lowerRelation.includes('hijo') || lowerRelation.includes('hija')) {
			return 'accent';
		}
		if (lowerRelation.includes('hermano') || lowerRelation.includes('hermana')) {
			return 'warn';
		}
		if (lowerRelation.includes('cónyuge') || lowerRelation.includes('esposo') || lowerRelation.includes('esposa')) {
			return 'primary';
		}
		return 'default';
	}

	onEdit(member: FamilyMember): void {
		this.editMember.emit(member);
	}

	onDelete(member: FamilyMember): void {
		this.deleteMember.emit(member);
	}

	onView(member: FamilyMember): void {
		this.viewMember.emit(member);
	}

	calculateAge(birthDate: Date): number {
		if (!birthDate) return 0;
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	}
}
