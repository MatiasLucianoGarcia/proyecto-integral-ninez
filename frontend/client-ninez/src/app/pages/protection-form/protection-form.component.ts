import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../features/login/services/login.service';
import { PersonService } from './services/person.service';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-protection-form',
  imports: [MatInputModule, MatCardModule, MatIconModule, ReactiveFormsModule,CommonModule, MatSelectModule,    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './protection-form.component.html',
  styleUrl: './protection-form.component.scss'
})
export class ProtectionFormComponent implements OnInit {
  private loginService: LoginService = inject(LoginService);
  private personService = inject(PersonService);
  private fb = inject(FormBuilder);
  userData = this.loginService.getUser();
  generos: any[] = [];
  nacionalidades: any[] = [];

  protectionForm = this.fb.group({
    familiares: this.fb.array([this.createFamiliarGroup()])
  });

  ngOnInit() {
  // Suponiendo que tienes personService.getGeneros() y getNacionalidades()
  this.personService.getAllPersons().subscribe(data => {
    this.generos = data;
    console.log(this.generos);
  });
  // this.personService.get().subscribe(data => this.nacionalidades = data);
  }

  get familiares(): FormArray {
    return this.protectionForm.get('familiares') as FormArray;
  }

  createFamiliarGroup(): FormGroup {
    return this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      id_genero: ['', Validators.required],
      id_nacionalidad: ['', Validators.required]
    });
  }

  addFamiliar() {
    this.familiares.push(this.createFamiliarGroup());
  }

  removeFamiliar(index: number) {
    this.familiares.removeAt(index);
  }

  onSubmit() {
    if (this.protectionForm.valid) {
      this.familiares.value.forEach((familiar: any) => {
        this.personService.savePerson({ ...familiar }).subscribe({
          next: (response) => {
            console.log('Familiar guardado:', response);
          },
          error: (error) => {
            console.error('Error al guardar:', error);
          }
        });
      });
    }
  }
}