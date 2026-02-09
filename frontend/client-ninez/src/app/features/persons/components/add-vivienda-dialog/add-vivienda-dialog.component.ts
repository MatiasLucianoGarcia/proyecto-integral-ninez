import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViviendaService } from '../../services/vivienda.service';
import { CreateVivienda, TipoVivienda } from '../../domain/vivienda.model';

export interface ViviendaDialogData {
  dni: number;
}

@Component({
  selector: 'app-add-vivienda-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-vivienda-dialog.component.html',
  styleUrl: './add-vivienda-dialog.component.scss',
})
export class AddViviendaDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private viviendaService = inject(ViviendaService);

  viviendaForm: FormGroup;
  tiposVivienda = signal<TipoVivienda[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddViviendaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViviendaDialogData
  ) {
    this.viviendaForm = this.fb.group({
      tipo_vivienda: ['', Validators.required],
      observaciones: [''],
      fecha_real: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTiposVivienda();
  }

  private loadTiposVivienda(): void {
    this.viviendaService.getTiposVivienda().subscribe({
      next: (data) => this.tiposVivienda.set(data),
      error: (err) => console.error('Error loading tipos vivienda', err)
    });
  }

  onSubmit(): void {
    if (this.viviendaForm.valid) {
      const formValue = this.viviendaForm.value;
      const newVivienda: CreateVivienda = {
        dni: this.data.dni,
        tipo_vivienda: formValue.tipo_vivienda,
        observaciones: formValue.observaciones,
        fecha_real: formValue.fecha_real
      };
      this.dialogRef.close(newVivienda);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
