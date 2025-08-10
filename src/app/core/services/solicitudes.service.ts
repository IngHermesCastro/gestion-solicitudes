import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListaSolicitudes } from '../../interface/listar.interface';
import { Observable } from 'rxjs';
import { ActualizarRespuesta } from '../../interface/actualizar.interface';

@Injectable({providedIn: 'root'})
export class SolicitudesService {
   private readonly API_URL = 'https://us-central1-tablas-de-referencia.cloudfunctions.net/listarSolicitudes';



  constructor(private http: HttpClient) {}

  // metodo para obtener las solicitudes
  listarSolicitudes(): Observable<ListaSolicitudes> {
    return this.http.get<ListaSolicitudes>(this.API_URL);
  }
  // metodo para actualizar una Respuesta
actualizarRespuesta(id: string, nuevaRespuesta: string): Observable<ActualizarRespuesta> {
  const url = `https://us-central1-tablas-de-referencia.cloudfunctions.net/actualizarRespuestaIA`;
  const body = {
    id: id,
    nuevaRespuesta: nuevaRespuesta
  };

  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.patch<ActualizarRespuesta>(url, body, { headers });
}
}
