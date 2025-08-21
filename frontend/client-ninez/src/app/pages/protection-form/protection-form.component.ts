import { Component, inject } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { PersonService } from './services/person.service';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-protection-form',
  imports: [MatInputModule,ReactiveFormsModule],
  templateUrl: './protection-form.component.html',
  styleUrl: './protection-form.component.scss'
})
export class ProtectionFormComponent {
  private loginService: LoginService = inject(LoginService);
  private personService = inject(PersonService);
  userData = this.loginService.getUser();

  click() {
    const person = {
      dni: 12345678,
      nombre: 'John',
      apellido: 'Doe',
      fechaNacimiento: new Date('1990-01-01'),
      id_genero: 1, // Assuming 1 is
      id_nacionalidad: 1, // Assuming
      token:this.userData()?.token || ''
    };
   this.personService.savePerson(person).subscribe({
      next: (response) => {
        console.log('Person saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving person:', error);
      }
    });
  }
}
