import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-add-contact-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-contact-dialog.component.html',
    styleUrls: ['./add-contact-dialog.component.scss']
})
export class AddContactDialogComponent {
    contactForm: FormGroup;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private contactService: ContactService,
        public dialogRef: MatDialogRef<AddContactDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dni: number }
    ) {
        this.contactForm = this.fb.group({
            telefono: ['', [Validators.required, Validators.pattern(/^\d{11,15}$/)]],
            fecha_real: [new Date()]
        });
    }

    onSubmit(): void {
        if (this.contactForm.valid) {
            const contactData = {
                dni: this.data.dni,
                ...this.contactForm.value
            };

            this.contactService.addContact(contactData).subscribe({
                next: (newContact) => {
                    this.dialogRef.close(newContact);
                },
                error: (err) => {
                    console.error('Error al crear contacto:', err);
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
