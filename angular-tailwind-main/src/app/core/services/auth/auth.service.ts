import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../constants/global';
import { UsuarioSesion } from '../../models/auth/usuario-sesion.model';
import { LoginResponse } from '../../models/auth/login-response.model';
import { ApiResponse } from '../../models/shared/api-response.model';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionService: SessionService,
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.sessionService.saveSession(
            response.data.token,
            response.data.usuario,
          );
        }),
      );
  }

  register(payload: { nombre: string; email: string; password: string; cedula: string; celular: string }): Observable<ApiResponse<UsuarioSesion>> {
    return this.http.post<ApiResponse<UsuarioSesion>>(`${this.apiUrl}/register`, payload);
  }

  logout(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
