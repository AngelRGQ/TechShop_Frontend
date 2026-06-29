import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioSesion } from '../../models/auth/usuario-sesion.model';
import { ApiResponse } from '../../models/shared/api-response.model';
import { PeticionesService } from '../http/peticiones.service';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private router: Router, 
    private peticiones: PeticionesService,
    private sessionService: SessionService
  ) { }

  obtenerPerfil(): Observable<ApiResponse<UsuarioSesion>> {
    // Nota: Backend debe implementar GET /api/auth/perfil
    // Actualmente se asume que devuelve los datos del usuario del token
    return this.peticiones.get<ApiResponse<UsuarioSesion>>('/auth/perfil');
  }

  listarUsuariosSistema(): Observable<ApiResponse<UsuarioSesion[]>> {
    return this.peticiones.get<ApiResponse<UsuarioSesion[]>>('/auth/usuarios');
  }

  actualizarPerfil(payload: { nombre: string; celular: string }): Observable<ApiResponse<UsuarioSesion>> {
    return this.peticiones.put<ApiResponse<UsuarioSesion>>('/auth/perfil', payload);
  }

  cambiarPassword(payload: { passwordActual: string; passwordNuevo: string }): Observable<ApiResponse<null>> {
    return this.peticiones.post<ApiResponse<null>>('/auth/password', payload);
  }

  salir(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
