import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { identity } from 'rxjs';

@Component({
  selector: 'app-solicitudes',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      identifycation: ['', [Validators.required, Validators.minLength(5)]],
      area: ['', [Validators.required]],
      date: ['', [Validators.required]],
      typeDescription: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      // typeRequest: this.fb.group({
      //   type: ['', Validators.required],
      //   de: ['', Validators.required],
      // })
    });
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      // Aquí iría tu lógica para enviar los datos
    } else  {
      console.log('Formulario no válido');

    }
  }
}
