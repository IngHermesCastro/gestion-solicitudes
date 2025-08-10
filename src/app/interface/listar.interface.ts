export interface ListaSolicitudes {
  solicitudes: Solicitude[];
}

export interface Solicitude {
  id:              string;
  fullName:        string;
  email:           string;
  identifycation:  string;
  area:            string;
  date:            string;
  typeDescription: string;
  description:     string;
  respuestaIA:     string;
  estado:          string;
  fecha:           Fecha;
}

export interface Fecha {
  _seconds:     number;
  _nanoseconds: number;
}
