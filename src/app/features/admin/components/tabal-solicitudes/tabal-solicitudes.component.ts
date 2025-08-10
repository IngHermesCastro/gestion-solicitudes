import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitude } from '../../../../interface/listar.interface';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { ModalComponent } from "../modal/modal.component";
import Swal from 'sweetalert2';


@Component({
  selector: 'tabla-solicitudes',
  imports: [CommonModule, ModalComponent],
  templateUrl: './tabal-solicitudes.component.html',
  styleUrl: './tabal-solicitudes.component.css',

})
export class TabalSolicitudesComponent {
  descripcion = 'respuesta API';
  respuestaIA = 'respuesta IA';
  modalVisible = false;

  solicitude: Solicitude[] = [];
  solicitudSeleccionada: Solicitude | null = null; // Solicitud seleccionada para el modal

  constructor(private solicitudesService: SolicitudesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.solicitudesService.listarSolicitudes().subscribe((data) => {
      this.solicitude = data.solicitudes;
      console.log('Datos aqui estan: ', this.solicitude);
      this.cdr.detectChanges();
    });
  }

  abrirModal(solicitud: Solicitude): void {
    this.solicitudSeleccionada = { ...solicitud }; // Clonar la solicitud seleccionada
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.solicitudSeleccionada = null; // Limpiar la solicitud seleccionada
  }

  guardarRespuesta(nuevaRespuesta: string): void {
  if (this.solicitudSeleccionada) {
    this.solicitudesService
      .actualizarRespuesta(this.solicitudSeleccionada.id, nuevaRespuesta)
      .subscribe({
        next: (response) => {
          console.log('Respuesta actualizada: ', response);
          const solicitud = this.solicitude.find(
            (s) => s.id === this.solicitudSeleccionada?.id
          );
          if (solicitud) {
            solicitud.respuestaIA = nuevaRespuesta;
          }
          this.cdr.detectChanges();

          // Mostrar SweetAlert de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La respuesta se ha guardado correctamente, Recuerda que esta respuesta el Usuario la recibiá por Correo electrónico',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.cerrarModal();
            }
          });
        },
        error: (err) => {
          console.error('Error detallado:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo guardar la respuesta',
            showConfirmButton: true
          });
        }
      });
  }
}
}
