import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Mensajes } from '../constants/mensajes';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private mensajes: Mensajes, private _servicioUsuario:UsuarioService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorizedError();
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError() {
    debugger
    this._servicioUsuario.salir();
    this.router.navigate(['/auth/sign-in']); // Redirigir al login si es necesario
  }
}