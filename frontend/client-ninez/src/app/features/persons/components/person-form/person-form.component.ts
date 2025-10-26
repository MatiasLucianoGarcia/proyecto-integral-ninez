import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../domain/persona.model';
import { debounceTime } from 'rxjs';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-person-form',
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './person-form.component.html',
	styleUrl: './person-form.component.scss',
})
export class PersonFormComponent implements OnInit {
	personaForm!: FormGroup;
	personaExistente: boolean = false;
	cargando: boolean = false;

	constructor(private fb: FormBuilder, private personaService: PersonaService) {}

	ngOnInit(): void {
		this.personaForm = this.fb.group({
			dni: ['', [Validators.required, Validators.minLength(7)]],
			nombre: [{ value: '', disabled: true }, Validators.required],
			apellido: [{ value: '', disabled: true }, Validators.required],
			fecha_nacimiento: [{ value: '', disabled: true }, Validators.required],
			genero: [{ value: '', disabled: true }, Validators.required],
			nacionalidad: [{ value: '', disabled: true }, Validators.required],
		});

		this.personaForm
			.get('dni')
			?.valueChanges.pipe(debounceTime(500))
			.subscribe((dni) => {
				if (dni && dni.length >= 7) {
					this.buscarPersonaPorDni(dni);
				} else {
					this.resetForm();
				}
			});
	}

	buscarPersonaPorDni(dni: string) {
		this.cargando = true;
		this.personaService.getPersonaPorDni(Number(dni)).subscribe({
			next: (persona) => {
				this.cargando = false;
				if (persona) {
					this.personaExistente = true;
					this.personaForm.patchValue(persona);
					this.habilitarCampos(true);
				} else {
					this.personaExistente = false;
					this.habilitarCampos(false);
				}
			},
			error: () => {
				this.cargando = false;
				this.personaExistente = false;
				this.habilitarCampos(false);
			},
		});
	}

	habilitarCampos(existe: boolean) {
		const campos = ['nombre', 'apellido', 'fecha_nacimiento', 'genero', 'nacionalidad'];
		campos.forEach((campo) => {
			if (existe) {
				this.personaForm.get(campo)?.enable();
			} else {
				this.personaForm.get(campo)?.enable();
				this.personaForm.get(campo)?.reset();
			}
		});
	}

	resetForm() {
		this.personaExistente = false;
		const campos = ['nombre', 'apellido', 'fecha_nacimiento', 'genero', 'nacionalidad'];
		campos.forEach((campo) => {
			this.personaForm.get(campo)?.disable();
			this.personaForm.get(campo)?.reset();
		});
	}

	onSubmit() {
		if (this.personaForm.valid) {
			const persona: Persona = this.personaForm.getRawValue();
			if (this.personaExistente) {
				this.personaService.actualizarPersona(persona).subscribe();
			} else {
				this.personaService.crearPersona(persona).subscribe();
			}
		}
	}
}
