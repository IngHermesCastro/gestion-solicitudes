import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { identity } from 'rxjs';
import Swal from 'sweetalert2';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-solicitudes',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesComponent {
  form: FormGroup;
  enviando = false;
  showFormErrors = false;

  constructor(private fb: FormBuilder, private solicitudesService: SolicitudesService) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      identifycation: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      area: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', [Validators.required]],
      typeDescription: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    // Establecer fecha actual por defecto
    this.form.patchValue({
      date: new Date().toISOString().split('T')[0]
    });
  }

  /**
   * Verifica si un campo específico es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.showFormErrors));
  }

  /**
   * Verifica si un campo específico es válido
   */
  isFieldValid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error apropiado para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    const errors = field.errors;
    const fieldNames: Record<string, string> = {
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      identifycation: 'Número de identificación',
      area: 'Área de trabajo',
      date: 'Fecha',
      typeDescription: 'Tipo de solicitud',
      description: 'Descripción'
    };

    const friendlyName = fieldNames[fieldName] || fieldName;

    // Mensajes de error personalizados
    if (errors['required']) {
      return `${friendlyName} es requerido`;
    }

    if (errors['email']) {
      return 'Ingrese un correo electrónico válido';
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${friendlyName} debe tener al menos ${requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${friendlyName} no puede tener más de ${requiredLength} caracteres`;
    }

    if (errors['pattern']) {
      if (fieldName === 'identifycation') {
        return 'Solo se permiten números en la identificación';
      }
      return `${friendlyName} tiene un formato inválido`;
    }

    // Mensaje genérico para otros tipos de errores
    return `${friendlyName} es inválido`;
  }

  /**
   * Obtiene el conteo de caracteres para el textarea de descripción
   */
  getCharacterCount(): number {
    const description = this.form.get('description')?.value || '';
    return description.length;
  }

  /**
   * Marca todos los campos como touched para mostrar errores
   */
  private marcarCamposComoTouched() {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Convierte el valor numérico del tipo de solicitud a texto
   */
  private getTypeDescriptionText(value: string): string {
    const tipos: Record<string, string> = {
      '1': '🔧 Solicitud de Mantenimiento',
      '2': '📋 Solicitud de Reclamo',
      '3': '❓ Solicitud de Consulta'
    };
    return tipos[value] || value;
  }

  /**
   * Valida y envía el formulario
   */
  onSubmit() {
    // Activar mostrar errores
    this.showFormErrors = true;

    if (this.form.valid && !this.enviando) {
      this.enviando = true;

      const solicitudData = {
        ...this.form.value,
        typeDescription: this.getTypeDescriptionText(this.form.value.typeDescription)
      };

      this.solicitudesService.crearSolicitud(solicitudData).subscribe({
        next: (response) => {
          // Resetear estado de errores
          this.showFormErrors = false;

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            html: `
              <p>Solicitud enviada correctamente</p>
              <div class="text-left mt-4">
                <p class="font-semibold">Respuesta generada automáticamente:</p>
                <p class="mt-2">${response.respuesta}</p>
                <p class="mt-4 text-sm italic">${response.mensaje}</p>
              </div>
            `,
            confirmButtonText: 'Aceptar',
            timerProgressBar: true
          });

          // Reset del formulario
          this.form.reset();
          // Restablecer fecha actual
          this.form.patchValue({
            date: new Date().toISOString().split('T')[0]
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'No se pudo enviar la solicitud. Por favor intenta nuevamente.',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al enviar solicitud:', err);
        },
        complete: () => {
          this.enviando = false;
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.marcarCamposComoTouched();

      // Mostrar alerta de errores
      const invalidFields = Object.keys(this.form.controls)
        .filter(key => this.form.get(key)?.invalid)
        .map(key => {
          const fieldNames: Record<string, string> = {
            fullName: 'Nombre completo',
            email: 'Correo electrónico',
            identifycation: 'Número de identificación',
            area: 'Área de trabajo',
            date: 'Fecha',
            typeDescription: 'Tipo de solicitud',
            description: 'Descripción'
          };
          return fieldNames[key] || key;
        });

      Swal.fire({
        icon: 'warning',
        title: '¡Formulario incompleto!',
        html: `
          <p>Por favor, complete los siguientes campos:</p>
          <ul class="text-left mt-3 list-disc list-inside">
            ${invalidFields.map(field => `<li>${field}</li>`).join('')}
          </ul>
        `,
        confirmButtonText: 'Revisar formulario',
        confirmButtonColor: '#ef4444'
      });

      // Hacer scroll al primer campo con error
      this.scrollToFirstError();
    }
  }

  /**
   * Hace scroll al primer campo que tiene error
   */
  private scrollToFirstError() {
    setTimeout(() => {
      const firstErrorElement = document.querySelector('.input-error, .select-error, .textarea-error');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  /**
   * Método para limpiar el formulario (opcional)
   */
  limpiarFormulario() {
    this.form.reset();
    this.showFormErrors = false;
    this.form.patchValue({
      date: new Date().toISOString().split('T')[0]
    });
  }
}
