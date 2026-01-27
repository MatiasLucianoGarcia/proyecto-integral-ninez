import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Contact } from '../../domain/contact.model';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
    @Input() contacts: Contact[] = [];
    @Input() isViewMode = false;
    @Output() deleteContact = new EventEmitter<number>();


    onDelete(id: number | undefined): void {
        if (id) {
            this.deleteContact.emit(id);
        }
    }
}
