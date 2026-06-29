import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from '../services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.sessionService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    const identity = this.sessionService.getIdentity();
    const rolesValidos = ['ADMIN', 'VENDEDOR', 'CLIENTE'];

    if (!identity || !rolesValidos.includes(identity.rol)) {
      this.sessionService.clearSession();
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}