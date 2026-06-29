import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../constants/global';
import { CabecerasService } from './cabeceras.service';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cabeceras: CabecerasService,
  ) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), {
      headers: this.cabeceras.Headers(),
    });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, {
      headers: this.cabeceras.Headers(),
    });
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, {
      headers: this.cabeceras.Headers(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      headers: this.cabeceras.Headers(),
    });
  }

  private buildUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
}
