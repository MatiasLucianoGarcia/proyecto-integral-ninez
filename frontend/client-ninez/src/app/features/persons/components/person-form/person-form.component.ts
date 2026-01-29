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
import { TrabajoService } from '../../services/trabajo.service';
import { Trabajo } from '../../domain/trabajo.model';
import { AddTrabajoDialogComponent } from '../add-trabajo-dialog/add-trabajo-dialog.component';
import { TrabajoListComponent } from '../trabajo-list/trabajo-list.component';
import { UserDataService } from '../../../../features/login/data/user-data.service';
import { RolEnum } from '../../../../features/login/domain/enums/role-enum';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../domain/actividad.model';
import { AddActividadDialogComponent } from '../add-actividad-dialog/add-actividad-dialog.component';
import { ActividadesExtraListComponent } from '../actividad-list/actividad-list.component';
import { PerdidaService } from '../../services/perdida.service';
import { Perdida } from '../../domain/perdida.model';
import { AddPerdidaDialogComponent } from '../add-perdida-dialog/add-perdida-dialog.component';
import { PerdidaListComponent } from '../perdida-list/perdida-list.component';
import { IngresoService } from '../../services/ingreso.service';
import { Ingreso } from '../../domain/ingreso.model';
import { AddIngresoDialogComponent } from '../add-ingreso-dialog/add-ingreso-dialog.component';
import { IngresoListComponent } from '../ingreso-list/ingreso-list.component';
import { InteresesComponent } from '../intereses/intereses.component';
import { ArticulacionService } from '../../services/articulacion.service';
import { Articulacion } from '../../domain/articulacion.model';
import { AddArticulacionDialogComponent } from '../add-articulacion-dialog/add-articulacion-dialog.component';
import { ArticulacionListComponent } from '../articulacion-list/articulacion-list.component';


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
		ControlMedicoListComponent,
		TrabajoListComponent,
		ActividadesExtraListComponent,
		PerdidaListComponent,
		InteresesComponent,
		IngresoListComponent,
		ArticulacionListComponent
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
	private trabajoService = inject(TrabajoService);
	private actividadService = inject(ActividadService);
	private perdidaService = inject(PerdidaService);
	private ingresoService = inject(IngresoService);
	private articulacionService = inject(ArticulacionService);
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

	trabajos = signal<Trabajo[]>([]);
	loadingTrabajos = signal(false);

	actividades = signal<Actividad[]>([]);
	loadingActividades = signal(false);

	perdidas = signal<Perdida[]>([]);
	loadingPerdidas = signal(false);

	ingresos = signal<Ingreso[]>([]);
	loadingIngresos = signal(false);

	articulaciones = signal<Articulacion[]>([]);
	loadingArticulaciones = signal(false);

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
				this.loadTrabajos(dni);
				this.loadActividades(dni);
				this.loadPerdidas(dni);
				this.loadPerdidas(dni);
				this.loadIngresos(dni);
				this.loadArticulaciones(dni);
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
				this.personData.set(persona);
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

	// === TRABAJO ACTIONS ===
	private loadTrabajos(dni: string): void {
		this.loadingTrabajos.set(true);
		this.trabajoService.getTrabajos(Number(dni)).subscribe({
			next: (data) => {
				this.trabajos.set(data);
				this.loadingTrabajos.set(false);
			},
			error: (err) => {
				console.error('Error cargando trabajos', err);
				this.loadingTrabajos.set(false);
			}
		});
	}

	onAddTrabajo(): void {
		const dialogRef = this.dialog.open(AddTrabajoDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.trabajoService.createTrabajo(result).subscribe({
					next: () => {
						this.snackBar.open('Trabajo agregado', 'Cerrar', { duration: 3000 });
						this.loadTrabajos(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando trabajo', err);
						this.snackBar.open('Error al crear trabajo', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}



	// === INGRESO ACTIONS ===
	private loadIngresos(dni: string): void {
		this.loadingIngresos.set(true);
		this.ingresoService.getIngresosByDni(Number(dni)).subscribe({
			next: (data) => {
				this.ingresos.set(data);
				this.loadingIngresos.set(false);
			},
			error: (err) => {
				console.error('Error cargando ingresos', err);
				this.loadingIngresos.set(false);
			}
		});
	}

	onAddIngreso(): void {
		if (!this.personDni()) return;
		const dialogRef = this.dialog.open(AddIngresoDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.ingresoService.createIngreso(result).subscribe({
					next: () => {
						this.snackBar.open('Ingreso agregado', 'Cerrar', { duration: 3000 });
						this.loadIngresos(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando ingreso', err);
						let errorMessage = 'Error al crear ingreso';
						if (err.status === 400 && err.error?.message === 'Este ingreso ya existe') {
							errorMessage = 'El ingreso ya existe para este programa y persona';
						} else if (err.status === 400) {
							errorMessage = err.error?.message || 'Error en los datos del ingreso';
						}
						this.snackBar.open(errorMessage, 'Cerrar', {
							duration: 3000
						});
						this.loadingIngresos.set(false);
					}
				});
			}
		});
	}

	onDeleteIngreso(ingreso: Ingreso): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Ingreso',
				message: `¿Está seguro de eliminar este ingreso?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && ingreso.id) {
				this.ingresoService.deleteIngreso(ingreso.id).subscribe({
					next: () => {
						this.snackBar.open('Ingreso eliminado', 'Cerrar', { duration: 3000 });
						this.loadIngresos(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando ingreso', err);
						this.snackBar.open('Error al eliminar ingreso', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}


	onDeleteTrabajo(trabajo: Trabajo): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Trabajo',
				message: `¿Está seguro de eliminar el trabajo en ${trabajo.descripcion}?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && trabajo.id) {
				this.trabajoService.deleteTrabajo(trabajo.id).subscribe({
					next: () => {
						this.snackBar.open('Trabajo eliminado', 'Cerrar', { duration: 3000 });
						this.loadTrabajos(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando trabajo', err);
						this.snackBar.open('Error al eliminar trabajo', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	// === ACTIVIDAD ACTIONS ===
	private loadActividades(dni: string): void {
		this.loadingActividades.set(true);
		this.actividadService.getActividades(Number(dni)).subscribe({
			next: (data) => {
				this.actividades.set(data);
				this.loadingActividades.set(false);
			},
			error: (err) => {
				console.error('Error cargando actividades', err);
				this.loadingActividades.set(false);
			}
		});
	}

	onAddActividad(): void {
		if (!this.personDni()) return;
		const dialogRef = this.dialog.open(AddActividadDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.actividadService.createActividad(result).subscribe({
					next: () => {
						this.snackBar.open('Actividad agregada', 'Cerrar', { duration: 3000 });
						this.loadActividades(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando actividad', err);
						this.snackBar.open('Error al crear actividad', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteActividad(actividad: Actividad): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Actividad',
				message: `¿Está seguro de eliminar la actividad ${actividad.actividad}?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && actividad.id) {
				this.actividadService.deleteActividad(actividad.id).subscribe({
					next: () => {
						this.snackBar.open('Actividad eliminada', 'Cerrar', { duration: 3000 });
						this.loadActividades(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando actividad', err);
						this.snackBar.open('Error al eliminar actividad', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	// === PERDIDA ACTIONS ===
	private loadPerdidas(dni: string): void {
		this.loadingPerdidas.set(true);
		this.perdidaService.getPerdidas(Number(dni)).subscribe({
			next: (data) => {
				this.perdidas.set(data);
				this.loadingPerdidas.set(false);
			},
			error: (err) => {
				console.error('Error cargando pérdidas', err);
				this.loadingPerdidas.set(false);
			}
		});
	}

	onAddPerdida(): void {
		if (!this.personDni()) return;
		const dialogRef = this.dialog.open(AddPerdidaDialogComponent, {
			width: '500px',
			data: { dni: Number(this.personDni()) }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.perdidaService.createPerdida(result).subscribe({
					next: () => {
						this.snackBar.open('Pérdida agregada', 'Cerrar', { duration: 3000 });
						this.loadPerdidas(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando pérdida', err);
						this.snackBar.open('Error al crear pérdida', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeletePerdida(perdida: Perdida): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Pérdida',
				message: `¿Está seguro de eliminar la pérdida?`,
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && perdida.id) {
				this.perdidaService.deletePerdida(perdida.id).subscribe({
					next: () => {
						this.snackBar.open('Pérdida eliminada', 'Cerrar', { duration: 3000 });
						this.loadPerdidas(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando pérdida', err);
						this.snackBar.open('Error al eliminar pérdida', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}
	// === ARTICULACION ACTIONS ===
	private loadArticulaciones(dni: string): void {
		this.loadingArticulaciones.set(true);
		this.articulacionService.getArticulacionesByDni(Number(dni)).subscribe({
			next: (data) => {
				this.articulaciones.set(data);
				this.loadingArticulaciones.set(false);
			},
			error: (err) => {
				console.error('Error cargando articulaciones', err);
				this.loadingArticulaciones.set(false);
			}
		});
	}

	onAddArticulacion(): void {
		const dialogRef = this.dialog.open(AddArticulacionDialogComponent, {
			width: '500px',
			data: { ingresos: this.ingresos() } // Pass ingresos for selection
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.articulacionService.createArticulacion(result).subscribe({
					next: () => {
						this.snackBar.open('Articulación agregada', 'Cerrar', { duration: 3000 });
						this.loadArticulaciones(this.personDni()!);
					},
					error: (err) => {
						console.error('Error creando articulación', err);
						this.snackBar.open('Error al crear articulación', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}

	onDeleteArticulacion(articulacion: Articulacion): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar Articulación',
				message: '¿Está seguro de eliminar esta articulación?',
				confirmText: 'Eliminar',
				cancelText: 'Cancelar'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && articulacion.id) {
				this.articulacionService.deleteArticulacion(articulacion.id).subscribe({
					next: () => {
						this.snackBar.open('Articulación eliminada', 'Cerrar', { duration: 3000 });
						this.loadArticulaciones(this.personDni()!);
					},
					error: (err) => {
						console.error('Error eliminando articulación', err);
						this.snackBar.open('Error al eliminar articulación', 'Cerrar', { duration: 3000 });
					}
				});
			}
		});
	}
}
