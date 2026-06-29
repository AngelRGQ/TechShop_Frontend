import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioSesion } from '../../models/auth/usuario-sesion.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly tokenKey = 'token';
  private readonly identityKey = 'identity';
  private readonly identitySubject = new BehaviorSubject<UsuarioSesion | null>(this.readIdentity());

  saveSession(token: string, usuario: UsuarioSesion): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.identityKey, JSON.stringify(usuario));
    this.identitySubject.next(usuario);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getIdentity(): UsuarioSesion | null {
    return this.identitySubject.value;
  }

  updateIdentity(usuario: UsuarioSesion): void {
    localStorage.setItem(this.identityKey, JSON.stringify(usuario));
    this.identitySubject.next(usuario);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.identityKey);
    this.identitySubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getIdentity();
  }

  hasRole(roles: UsuarioSesion['rol'][]): boolean {
    const identity = this.getIdentity();
    return !!identity && roles.includes(identity.rol);
  }

  get identityChanges$() {
    return this.identitySubject.asObservable();
  }

  private readIdentity(): UsuarioSesion | null {
    const value = localStorage.getItem(this.identityKey);
    return value ? (JSON.parse(value) as UsuarioSesion) : null;
  }
}
