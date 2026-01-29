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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { EfectorService } from '../../services/efector.service';
import { Efector } from '../../domain/efector.model';
import { CreateArticulacion } from '../../domain/articulacion.model';
import { Ingreso } from '../../domain/ingreso.model';

export interface ArticulacionDialogData {
  ingresos: Ingreso[];
}

@Component({
  selector: 'app-add-articulacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './add-articulacion-dialog.component.html',
  styleUrl: './add-articulacion-dialog.component.scss',
})
export class AddArticulacionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private efectorService = inject(EfectorService);

  articulacionForm: FormGroup;
  efectores = signal<Efector[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddArticulacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArticulacionDialogData
  ) {
    this.articulacionForm = this.fb.group({
      id_ingreso: ['', Validators.required],
      id_efector: ['', Validators.required],
      fecha_articulacion: [new Date(), Validators.required],
      observacion: ['']
    });
  }

  ngOnInit(): void {
    this.loadEfectores();
  }

  private loadEfectores(): void {
    this.efectorService.getEfectores().subscribe({
      next: (data) => this.efectores.set(data),
      error: (err) => console.error('Error loading efectores', err)
    });
  }

  onSubmit(): void {
    if (this.articulacionForm.valid) {
      const formValue = this.articulacionForm.value;
      const newArticulacion: CreateArticulacion = {
        id_ingreso: formValue.id_ingreso,
        id_efector: formValue.id_efector,
        fecha_articulacion: formValue.fecha_articulacion,
        observacion: formValue.observacion
      };
      this.dialogRef.close(newArticulacion);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
