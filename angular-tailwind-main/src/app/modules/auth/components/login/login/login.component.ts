import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { LoginResponse } from 'src/app/core/models/auth/login-response.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div class="mb-8 text-center">
          <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">TechShop</h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ modo === 'login' ? 'Inicia sesion en tu cuenta' : 'Crea tu cuenta de cliente para comprar' }}
          </p>
        </div>

        <div class="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-medium">
          <button
            type="button"
            (click)="cambiarModo('login')"
            [class]="modo === 'login'
              ? 'rounded-lg bg-white px-3 py-2 text-gray-900 shadow-sm'
              : 'rounded-lg px-3 py-2 text-gray-500 transition hover:text-gray-700'">
            Iniciar sesion
          </button>
          <button
            type="button"
            (click)="cambiarModo('register')"
            [class]="modo === 'register'
              ? 'rounded-lg bg-white px-3 py-2 text-gray-900 shadow-sm'
              : 'rounded-lg px-3 py-2 text-gray-500 transition hover:text-gray-700'">
            Crear cuenta
          </button>
        </div>

        <div *ngIf="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ error }}
        </div>

        <div *ngIf="mensaje" class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {{ mensaje }}
        </div>

        <form (ngSubmit)="onSubmit()" #authForm="ngForm" class="space-y-4">
          <div *ngIf="modo === 'register'">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              [(ngModel)]="nombre"
              name="nombre"
              required
              placeholder="Tu nombre"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div *ngIf="modo === 'register'">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Cedula
            </label>
            <input
              type="text"
              [(ngModel)]="cedula"
              name="cedula"
              required
              placeholder="Numero de identificacion"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div *ngIf="modo === 'register'">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Celular
            </label>
            <input
              type="tel"
              [(ngModel)]="celular"
              name="celular"
              required
              placeholder="Numero de celular"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Correo electronico
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="correo@techshop.com"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Contrasena
            </label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Minimo 6 caracteres"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div *ngIf="modo === 'register'">
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Confirmar contrasena
            </label>
            <input
              type="password"
              [(ngModel)]="confirmarPassword"
              name="confirmarPassword"
              required
              placeholder="Repite tu contrasena"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            [disabled]="loading || !email || !password || (modo === 'register' && (!nombre || !cedula || !celular || !confirmarPassword))"
            class="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <span *ngIf="!loading">{{ modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta' }}</span>
            <span *ngIf="loading">{{ modo === 'login' ? 'Ingresando...' : 'Creando cuenta...' }}</span>
          </button>
        </form>

        <div class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center text-xs text-gray-500">
          <p class="mb-1 font-medium text-gray-600">Credenciales de prueba</p>
          <p>admintechshop.com / 123456</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  modo: 'login' | 'register' = 'login';
  email    = '';
  password = '';
  nombre   = '';
  cedula   = '';
  celular  = '';
  confirmarPassword = '';
  loading  = false;
  error    = '';
  mensaje  = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.modo === 'register') {
      this.onRegister();
      return;
    }

    this.onLogin();
  }

  cambiarModo(modo: 'login' | 'register'): void {
    this.modo = modo;
    this.error = '';
    this.mensaje = '';
    this.loading = false;
  }

  private onLogin(): void {
    this.loading = true;
    this.error   = '';
    this.mensaje = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res: LoginResponse) => {
        this.redirigirPorRol(res);
      },
      error: (err: HttpErrorResponse) => {
        this.error   = err.error?.mensaje || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }

  private onRegister(): void {
    if (!this.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    if (!this.cedula.trim()) {
      this.error = 'La cedula es obligatoria.';
      return;
    }

    if (!this.celular.trim()) {
      this.error = 'El celular es obligatorio.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contrasena debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contrasenas no coinciden.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.mensaje = '';

    const payload = {
      nombre: this.nombre.trim(),
      email: this.email.trim(),
      cedula: this.cedula.trim(),
      celular: this.celular.trim(),
      password: this.password,
    };

    this.authService.register(payload)
      .pipe(switchMap(() => this.authService.login(payload.email, payload.password)))
      .subscribe({
        next: (res: LoginResponse) => {
          this.mensaje = 'Cuenta creada correctamente.';
          this.redirigirPorRol(res);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.mensaje || 'No se pudo crear la cuenta.';
          this.loading = false;
        },
      });
  }

  private redirigirPorRol(res: LoginResponse): void {
    const rol = res.data.usuario.rol;

    if (rol === 'ADMIN') {
      this.router.navigate(['/productos']);
    } else if (rol === 'CLIENTE') {
      this.router.navigate(['/pedidos/mis-pedidos']);
    } else {
      this.router.navigate(['/catalogo']);
    }
  }
}
