import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { catchError } from 'rxjs/operators'; // Asegúrate de importar catchError
import { of, throwError } from 'rxjs'; // Importar `of` y `throwError` para manejar los flujos de errores

@Injectable({
  providedIn: 'root',
})
export class ContratosService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerContrato(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  listContratos(page = 1, search: string = '') {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato?page=' + page + '&search=' + search;
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  configAll() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato/config';
    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  PagosAll(contratoId: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    // Cambiar la URL para incluir el contratoId como parte de la consulta
    let URL = `${URL_SERVICIOS}/contrato/pagos/${contratoId}`;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  updateContrato(ID_CONTRATO: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato/' + ID_CONTRATO;
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteContrato(ID_CONTRATO: string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato/' + ID_CONTRATO;
    return this.http
      .delete(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  registerTraslado(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/traslado';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  OptenerContrato(ID_CONTRATO: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/contrato/' + ID_CONTRATO;
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  UsuarioID(usuarioId: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    // Cambiar la URL para incluir el contratoId como parte de la consulta
    let URL = `${URL_SERVICIOS}/contrato/usuario/${usuarioId}`;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  ClienteID(clienteId: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    // Cambiar la URL para incluir el contratoId como parte de la consulta
    let URL = `${URL_SERVICIOS}/contrato/cliente/${clienteId}`;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  ServicioID(servicioId: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    // Cambiar la URL para incluir el contratoId como parte de la consulta
    let URL = `${URL_SERVICIOS}/contrato/tiposervicio/${servicioId}`;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  TrasladoAll(contratoId: number) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    // Cambiar la URL para incluir el contratoId como parte de la consulta
    let URL = `${URL_SERVICIOS}/contrato/traslados/${contratoId}`;

    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
      catchError((error) => {
        if (error.status === 404) {
          console.log('No se encontraron traslados para este contrato.');
          // Aquí puedes mostrar un mensaje de alerta o actualizar el estado de la UI
          return of(null); // Regresar un valor nulo o vacío
        } else {
          console.error('Error al obtener traslados:', error);
          return throwError(error); // Continuar propagando otros errores
        }
      })
    );
  }

  updatePago(ID_PAGO: string, data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/pago/' + ID_PAGO;
    console.log('Enviando solicitud PUT a la URL:', URL);
    console.log('Datos:', data);
    return this.http
      .put(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
