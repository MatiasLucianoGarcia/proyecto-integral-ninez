import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Domicilio } from '../../domain/domicilio.model';

@Component({
    selector: 'app-address-list',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
    templateUrl: './address-list.component.html',
    styleUrl: './address-list.component.scss',
})
export class AddressListComponent {
    domicilios = input.required<Domicilio[]>();
    isViewMode = input<boolean>(false);

    deleteAddress = output<Domicilio>();

    onDelete(domicilio: Domicilio): void {
        this.deleteAddress.emit(domicilio);
    }
}
