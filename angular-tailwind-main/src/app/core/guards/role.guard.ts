import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioSesion } from '../models/auth/usuario-sesion.model';
import { SessionService } from '../services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const rolesPermitidos = (route.data['roles'] as UsuarioSesion['rol'][] | undefined) ?? [];
    const identity = this.sessionService.getIdentity();

    if (!identity) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (rolesPermitidos.length === 0 || rolesPermitidos.includes(identity.rol)) {
      return true;
    }

    this.router.navigate([this.getDefaultRoute(identity.rol)]);
    return false;
  }

  private getDefaultRoute(rol: UsuarioSesion['rol']): string {
    if (rol === 'ADMIN') {
      return '/productos';
    }

    if (rol === 'CLIENTE') {
      return '/pedidos/mis-pedidos';
    }

    return '/catalogo';
  }
}
