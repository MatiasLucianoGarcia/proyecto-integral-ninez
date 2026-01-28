import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PersonService } from '../../services/person.service';
import { FamilyService } from '../../services/family.service';
import { DomicilioService } from '../../services/domicilio.service';
import { ContactService } from '../../services/contact.service';
import { Persona } from '../../domain/persona.model';
import { Genero } from '../../domain/genero.model';
import { Nacionalidad } from '../../domain/nacionalidad.model';
import { FamilyMember } from '../../domain/familia.model';
import { Domicilio } from '../../domain/domicilio.model';
import { Contact } from '../../domain/contact.model';
import { FamilyTreeComponent } from '../family-tree/family-tree.component';
import { AddFamilyDialogComponent } from '../add-family-dialog/add-family-dialog.component';
import { SuggestedPersonCardComponent } from '../suggested-person-card/suggested-person-card.component';
import { AddressListComponent } from '../address-list/address-list.component';
import { AddAddressDialogComponent } from '../add-address-dialog/add-address-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { EducationListComponent } from '../education-list/education-list.component';
import { EscolaridadService } from '../../services/escolaridad.service';
import { Escolaridad } from '../../domain/escolaridad.model';
import { AddEducationDialogComponent } from '../add-education-dialog/add-education-dialog.component';
import { SaludService } from '../../services/salud.service';
import { Salud } from '../../domain/salud.model';
import { SaludGeneralComponent } from '../salud-general/salud-general.component';
import { ControlMedicoService } from '../../services/control-medico.service';
import { ControlMedico } from '../../domain/control-medico.model';
import { AddControlMedicoDialogComponent } from '../add-control-medico-dialog/add-control-medico-dialog.component';
import { ControlMedicoListComponent } from '../control-medico-list/control-medico-list.component';
import { UserDataService } from '../../../../features/login/data/user-data.service';
import { RolEnum } from '../../../../features/login/domain/enums/role-enum';


type FormMode = 'create' | 'edit' | 'view';

@Component({
	selector: 'app-person-form',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatChipsModule,
		MatDividerModule,
		MatTabsModule,
		MatDialogModule,
		MatSnackBarModule,
		FamilyTreeComponent,
		SuggestedPersonCardComponent,
		AddressListComponent,
		ContactListComponent,
		EducationListComponent,
		SaludGeneralComponent,
		ControlMedicoListComponent
	],
	templateUrl: './person-form.component.html',
	styleUrl: './person-form.component.scss',
})
export class PersonFormComponent implements OnInit {
	private fb = inject(FormBuilder);
	private personService = inject(PersonService);
	private familyService = inject(FamilyService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private snackBar = inject(MatSnackBar);
	private domicilioService = inject(DomicilioService);
	private contactService = inject(ContactService);
	private escolaridadService = inject(EscolaridadService);
	private saludService = inject(SaludService);
	private controlMedicoService = inject(ControlMedicoService);
	private userDataService = inject(UserDataService);

	personForm!: FormGroup;
	mode = signal<FormMode>('create');
	loading = signal(false);
	personDni = signal<string | null>(null);
	familyMembers = signal<FamilyMember[]>([]);
	loadingFamily = signal(false);
	suggestedFamily = signal<Persona[]>([]);
	loadingSuggestedFamily = signal(false);

	domicilios = signal<Domicilio[]>([]);
	loadingDomicilios = signal(false);

	contacts = signal<Contact[]>([]);
	loadingContacts = signal(false);

	escolaridades = signal<Escolaridad[]>([]);
	loadingEscolaridades = signal(false);

	salud = signal<Salud | null>(null);
	loadingSalud = signal(false);

	controlesMedicos = signal<ControlMedico[]>([]);
	loadingControles = signal(false);

	personData = signal<Persona | null>(null);

	// Opciones para los selects
	generos = signal<Genero[]>([]);
	nacionalidades = signal<Nacionalidad[]>([]);

	ngOnInit(): void {
		this.loadOptions();
		this.initForm();
		this.loadRouteData();
	}

	private loadOptions(): void {
		this.personService.getGeneros().subscribe({
			next: (data) => this.generos.set(data),
			error: (err) => console.error('Error cargando géneros', err)
		});

		this.personService.getNacionalidades().subscribe({
			next: (data) => this.nacionalidades.set(data),
			error: (err) => console.error('Error cargando nacionalidades', err)
		});
	}

	private loadRouteData(): void {
		this.route.queryParams.subscribe((params) => {
			const mode = params['mode'] as FormMode;
			const dni = params['id'] || params['dni']; // Handle both id and dni params for flexibility

			if (mode) {
				this.mode.set(mode);
			}

			if (dni) {
				this.personDni.set(dni);
				this.loadPersonData(dni);
				this.loadFamilyData(dni);
				this.loadSuggestedFamily(dni);
				this.loadDomicilios(dni);
				this.loadSuggestedFamily(dni);
				this.loadDomicilios(dni);
				this.loadDomicilios(dni);
				this.loadContacts(dni);
				this.loadEscolaridades(dni);
				this.loadSalud(dni);
				this.loadControles(dni);
			}

			// Si es modo view, deshabilitar todo el formulario
			if (this.mode() === 'view') {
				this.personForm.disable();
			}
		});
	}

	get canViewServicioLocal(): boolean {
		const user = this.userDataService.getUser();
		if (!user || !user.rol) {
			return false;
		}

		// Handle both string and object roles safely
		let roleName = '';
		if (typeof user.rol === 'string') {
			roleName = user.rol;
		} else if (typeof user.rol === 'object' && 'nombre_rol' in user.rol) {
			// @ts-ignore - We know it might be an object with nombre_rol based on runtime data
			roleName = user.rol.nombre_rol;
		}

		if (!roleName) return false;

		const normalizedRole = roleName.toLowerCase();
		return normalizedRole === 'administrador' || normalizedRole === 'proteccion';
	}

	private initForm(): void {
		this.personForm = this.fb.group({
			dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
			nombre: ['', [Validators.required, Validators.minLength(2)]],
			apellido: ['', [Validators.required, Validators.minLength(2)]],
			fecha_nacimiento: ['', Validators.required],
			genero: ['', Validators.required],
			nacionalidad: ['', Validators.required],
		});
	}



	private loadPersonData(dni: string): void {
		this.loading.set(true);
		this.personService.getPersonByDNI(dni).subscribe({
			next: (persona) => {
				this.loading.set(false);
				this.personForm.patchValue({
					dni: persona.dni,
					nombre: persona.nombre,
					apellido: persona.apellido,
					fecha_nacimiento: persona.fecha_nacimiento,
					genero: persona.genero?.id || '',
					nacionalidad: persona.nacionalidad?.id || '',
				});
			},
			error: (error) => {
				this.loading.set(false);
				console.error('Error al cargar persona:', error);
			},
		});
	}

	private loadFamilyData(dni: string): void {
		this.loadingFamily.set(true);
		this.familyService.getFamilyByDNI(Number(dni)).subscribe({
			next: (family) => {
				this.loadingFamily.set(false);
				this.familyMembers.set(family);
			},
			error: (error) => {
				this.loadingFamily.set(false);
				console.error('Error al cargar familia:', error);
				this.familyMembers.set([]);
			},
		});
	}

	onEditFamilyMember(member: FamilyMember): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'edit',
				currentPersonDni: Number(this.personDni()),
				familyMember: {
					dni_p1: Number(this.personDni()),
					dni_p2: member.persona.dni,
					id_parentezco1: member.parentezco.id,
					id_parentezco2: member.parentezco.id,
					observaciones: member.observaciones,
				},
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.updateFamilyRelation(member.id, result).subscribe({
					next: () => {
						this.snackBar.open('Familiar actualizado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadFamilyData(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al actualizar familiar:', error);
						this.snackBar.open('Error al actualizar familiar', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onDeleteFamilyMember(member: FamilyMember): void {
		const confirmed = confirm(`¿Está seguro de eliminar la relación familiar con ${member.persona.nombre} ${member.persona.apellido}?`);

		if (confirmed) {
			this.familyService.deleteFamilyRelation(member.id).subscribe({
				next: () => {
					this.snackBar.open('Familiar eliminado exitosamente', 'Cerrar', {
						duration: 3000,
					});
					this.loadFamilyData(this.personDni()!);
				},
				error: (error) => {
					console.error('Error al eliminar familiar:', error);
					this.snackBar.open('Error al eliminar familiar', 'Cerrar', {
						duration: 3000,
					});
				},
			});
		}
	}

	onViewFamilyMember(member: FamilyMember): void {
		// Navegar al detalle de la persona familiar
		this.router.navigate(['/person-form'], {
			queryParams: { mode: 'view', dni: member.persona.dni },
		});
	}

	onViewSuggestedPerson(person: Persona): void {
		this.router.navigate(['/person-form'], {
			queryParams: {
				mode: 'view',
				dni: person.dni,
			},
		});
	}

	onAddFamilyMember(): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'create',
				currentPersonDni: Number(this.personDni()),
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.createFamilyRelation(result).subscribe({
					next: () => {
						this.snackBar.open('Familiar agregado exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loadFamilyData(this.personDni()!);
					},
					error: (error) => {
						console.error('Error al agregar familiar:', error);
						this.snackBar.open('Error al agregar familiar', 'Cerrar', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	onSubmit(): void {
		if (this.personForm.valid && this.mode() !== 'view') {
			this.loading.set(true);
			const formValue = this.personForm.getRawValue();

			// Construct persona object, mapping id properties for selects
			const persona: any = {
				dni: Number(formValue.dni),
				nombre: formValue.nombre,
				apellido: formValue.apellido,
				fecha_nacimiento: formValue.fecha_nacimiento,
				// For selects, we send the ID as object {id: ...} to match backend expectation or just update specific fields
				genero: { id: formValue.genero },
				nacionalidad: { id: formValue.nacionalidad }
			};

			console.log('Guardando persona:', persona);

			if (this.mode() === 'create') {
				this.personService.createPerson(persona).subscribe({
					next: (newPerson) => {
						this.snackBar.open('Persona creada exitosamente', 'Cerrar', {
							duration: 3000,
						});
						this.loading.set(false);
						this.router.navigate(['/person-form'], {
							queryParams: { mode: 'view', dni: newPerson.dni },
						});
					},
					error: (err) => {
						console.error('Error al crear persona:', err);
						this.snackBar.open('Error al crear persona', 'Cerrar', {
							duration: 3000,
						});
						this.loading.set(false);
					}
				});
			} else {
				const currentPerson = this.personData();
				if (currentPerson && currentPerson.dni) {
					// Create a copy without DNI for update payload as it's not allowed in schema
					const { dni, ...personToUpdate } = persona;

					this.personService.updatePerson(currentPerson.dni, personToUpdate).subscribe({
						next: () => {
							this.snackBar.open('Persona actualizada exitosamente', 'Cerrar', {
								duration: 3000,
							});
							this.loading.set(false);
							this.router.navigate(['/person-form'], {
								queryParams: { mode: 'view', dni: currentPerson.dni },
							});
						},
						error: (err) => {
							console.error('Error al actualizar persona:', JSON.stringify(err));
							this.snackBar.open('Error al actualizar persona: ' + (err.error?.message || err.message), 'Cerrar', {
								duration: 5000,
							});
							this.loading.set(false);
						}
					});
				} else {
					console.error('No se puede actualizar: DNI de persona no encontrado');
					this.loading.set(false);
				}
			}
		}
	}

	onCancel(): void {
		this.goBack();
	}

	goBack(): void {
		this.router.navigate(['/dashboard']);
	}

	// Getters para facilitar el acceso en el template
	get isCreateMode(): boolean {
		return this.mode() === 'create';
	}

	get isEditMode(): boolean {
		return this.mode() === 'edit';
	}

	get isViewMode(): boolean {
		return this.mode() === 'view';
	}

	get formTitle(): string {
		switch (this.mode()) {
			case 'create':
				return 'Agregar Nueva Persona';
			case 'edit':
				return 'Editar Persona';
			case 'view':
				return 'Detalle de Persona';
			default:
				return 'Persona';
		}
	}

	get submitButtonText(): string {
		return this.isCreateMode ? 'Crear Persona' : 'Guardar Cambios';
	}

	private loadSuggestedFamily(dni: string): void {
		this.loadingSuggestedFamily.set(true);
		this.familyService.suggestFamily(Number(dni)).subscribe({
			next: (suggestions) => {
				this.suggestedFamily.set(suggestions);
				this.loadingSuggestedFamily.set(false);
			},
			error: (error) => {
				console.error('Error al cargar sugerencias de familiares:', error);
				this.suggestedFamily.set([]);
				this.loadingSuggestedFamily.set(false);
			},
		});
	}

	addSuggestedFamily(suggestion: Persona): void {
		const dialogRef = this.dialog.open(AddFamilyDialogComponent, {
			width: '600px',
			data: {
				mode: 'create',
				currentPersonDni: Number(this.personDni()),
				prefilledDni: suggestion.dni,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.familyService.createFamilyRelation(result).subscribe(() => {
					this.loadFamilyData(this.personDni()!);
					this.loadSuggestedFamily(this.personDni()!);
				});
			}
		});
	}

	private loadDomicilios(dni: string): void {
		this.loadingDomicilios.set(true);
		this.domicilioService.getDomicilios(Number(dni)).subscribe({
			next: (data) => {
				this.domicilios.set(data);
				this.loadingDomicilios.set(false);
			},
			error: (err) => {
				console.error('Error cargando domicilios', err);
				this.loadingDomicilios.set(false);
			}
		});
	}

	onAddDomicilio(): void {
		const dialogRef = this.dialog.open(AddAddressDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.domicilioService.crearDomicilio(result).subscribe({
					next: () => {
						this.snackBar.open('Domicilio agregado', 'Cerrar', { duration: 3000 });
						this.loadDomicilios(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando domicilio', err);
						this.snackBar.open('Error al crear domicilio', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteDomicilio(domicilio: Domicilio): void {
		this.domicilioService.eliminarDomicilio(domicilio.id!).subscribe({
			next: () => {
				this.snackBar.open('Domicilio eliminado', 'Cerrar', { duration: 3000 });
				this.loadDomicilios(this.personDni()!);
			},
			error: (err) => console.error('Error eliminando domicilio', err)
		});
	}

	private loadContacts(dni: string): void {
		this.loadingContacts.set(true);
		this.contactService.getContacts(Number(dni)).subscribe({
			next: (data) => {
				this.contacts.set(data);
				this.loadingContacts.set(false);
			},
			error: (err) => {
				console.error('Error cargando contactos', err);
				this.loadingContacts.set(false);
			}
		});
	}

	onAddContact(): void {
		const dialogRef = this.dialog.open(AddContactDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// Result is fully formed contact object ready for service
				this.contactService.addContact(result).subscribe({
					next: () => {
						this.snackBar.open('Contacto agregado', 'Cerrar', { duration: 3000 });
						this.loadContacts(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando contacto', err);
						this.snackBar.open('Error al crear contacto', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteContact(contact: Contact): void {
		this.contactService.deleteContact(contact.id!).subscribe({
			next: () => {
				this.snackBar.open('Contacto eliminado', 'Cerrar', { duration: 3000 });
				this.loadContacts(this.personDni()!);
			},
			error: (err) => console.error('Error eliminando contacto', err)
		});
	}

	private loadEscolaridades(dni: string): void {
		this.loadingEscolaridades.set(true);
		this.escolaridadService.getEscolaridades(Number(dni)).subscribe({
			next: (data) => {
				this.escolaridades.set(data);
				this.loadingEscolaridades.set(false);
			},
			error: (err) => {
				console.error('Error cargando escolaridades', err);
				this.loadingEscolaridades.set(false);
			}
		});
	}

	onAddEscolaridad(): void {
		const dialogRef = this.dialog.open(AddEducationDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.escolaridadService.createEscolaridad(result).subscribe({
					next: () => {
						this.snackBar.open('Escolaridad agregada correctamente', 'Cerrar', { duration: 3000 });
						this.loadEscolaridades(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando escolaridad', err);
						this.snackBar.open('Error al agregar escolaridad', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteEscolaridad(escolaridad: Escolaridad): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Escolaridad',
				message: `¿Está seguro de eliminar el registro de ${escolaridad.escuela}?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && escolaridad.id) {
				this.escolaridadService.deleteEscolaridad(escolaridad.id).subscribe({
					next: () => {
						this.snackBar.open('Escolaridad eliminada correctamente', 'Cerrar', { duration: 3000 });
						this.loadEscolaridades(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando escolaridad', err);
						this.snackBar.open('Error al eliminar escolaridad', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}
	private loadSalud(dni: string): void {
		this.loadingSalud.set(true);
		this.saludService.getSalud(Number(dni)).subscribe({
			next: (data) => {
				this.salud.set(data);
				this.loadingSalud.set(false);
			},
			error: (err) => {
				console.error('Error cargando salud', err);
				this.loadingSalud.set(false);
			}
		});
	}

	onUpdateSalud(data: Partial<Salud>): void {
		if (!this.personDni()) return;

		this.loadingSalud.set(true);
		this.saludService.updateSalud(Number(this.personDni()), data).subscribe({
			next: (updated) => {
				this.salud.set(updated);
				this.snackBar.open('Información de salud actualizada', 'Cerrar', { duration: 3000 });
				this.loadingSalud.set(false);
			},
			error: (err) => {
				console.error('Error actualizando salud', err);
				this.snackBar.open('Error al actualizar salud', 'Cerrar', { duration: 3000 });
				this.loadingSalud.set(false);
			}
		});
	}

	// === CONTROL MEDICO ACTIONS ===
	private loadControles(dni: string): void {
		this.loadingControles.set(true);
		this.controlMedicoService.getControles(Number(dni)).subscribe({
			next: (data) => {
				this.controlesMedicos.set(data);
				this.loadingControles.set(false);
			},
			error: (err) => {
				console.error('Error cargando controles médicos', err);
				this.loadingControles.set(false);
			}
		});
	}

	onAddControl(): void {
		const dialogRef = this.dialog.open(AddControlMedicoDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.controlMedicoService.createControl(result).subscribe({
					next: () => {
						this.snackBar.open('Control médico agregado', 'Cerrar', { duration: 3000 });
						this.loadControles(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando control médico', err);
						this.snackBar.open('Error al crear control', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteControl(control: ControlMedico): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Control Médico',
				message: `¿Está seguro de eliminar el control en ${control.unidad_sanitaria}?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && control.id) {
				this.controlMedicoService.deleteControl(control.id).subscribe({
					next: () => {
						this.snackBar.open('Control médico eliminado', 'Cerrar', { duration: 3000 });
						this.loadControles(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando control', err);
						this.snackBar.open('Error al eliminar control', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}
}
