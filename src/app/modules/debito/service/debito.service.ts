import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, tap } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root',
})
export class DebitoService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  serchClientes(cedula: string, contrato: string): Observable<any> {
    let LINK = '';
    if (cedula) {
      LINK += '&cli_cedula=' + cedula; // Pasar cédula como parámetro
    }
    if (contrato) {
      LINK += '&con_numero_contrato=' + contrato; // Pasar contrato como parámetro
    }

    let URL = URL_SERVICIOS + '/debito/search-debito?p=1' + LINK;
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  registerDebio(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/debito';
    return this.http
      .post(URL, data, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  listDebitos(page = 1, search: string = '') {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authservice.token,
    });
    let URL = URL_SERVICIOS + '/debito?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
      tap((resp) => console.log('Respuesta desde el servicio:', resp)) // Verifica la respuesta
    );
  }
}
