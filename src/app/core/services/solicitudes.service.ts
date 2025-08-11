import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListaSolicitudes } from '../../interface/listar.interface';
import { Observable } from 'rxjs';
import { ActualizarRespuesta } from '../../interface/actualizar.interface';
import { environment } from '../../environment/environment';

export interface Solicitud {
  fullName: string;
  email: string;
  identifycation: string;
  area: string;
  date: string;
  typeDescription: string;
  description: string;
}
export interface RespuestaBackend {
  id: string;
  respuesta?: string;
  mensaje?: string;
}


@Injectable({ providedIn: 'root' })
export class SolicitudesService {

  constructor(private http: HttpClient) { }

  // metodo para obtener las solicitudes
  listarSolicitudes(): Observable<ListaSolicitudes> {
    return this.http.get<ListaSolicitudes>(`${environment.apiUrl}/listarSolicitudes`);
  }
  // metodo para actualizar una Respuesta
  actualizarRespuesta(id: string, nuevaRespuesta: string): Observable<ActualizarRespuesta> {
    const url = `${environment.apiUrl}/actualizarRespuestaIA`;
    const body = {
      id: id,
      nuevaRespuesta: nuevaRespuesta
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.patch<ActualizarRespuesta>(url, body, { headers });
  }

  //Metodo para Crear nueva solicitud
  crearSolicitud(solicitud: Solicitud): Observable<RespuestaBackend> {
    return this.http.post<RespuestaBackend>(`${environment.apiUrl}/generarRespuestaIA`, solicitud);
  }

}
