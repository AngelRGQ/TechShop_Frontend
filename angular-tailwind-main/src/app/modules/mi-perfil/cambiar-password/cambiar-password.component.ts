import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario/usuario.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="p-6">
      <div class="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">Cambiar password</h2>
        <p class="mt-1 text-sm text-slate-500">Actualiza la credencial del usuario autenticado.</p>

        <form class="mt-6 space-y-4" (ngSubmit)="guardar()">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Password actual</label>
            <input [(ngModel)]="passwordActual" name="passwordActual" type="password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nuevo password</label>
            <input [(ngModel)]="passwordNuevo" name="passwordNuevo" type="password" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div *ngIf="mensaje" class="text-sm text-emerald-700">{{ mensaje }}</div>
          <div *ngIf="error" class="text-sm text-rose-600">{{ error }}</div>

          <button type="submit" class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Guardar cambios
          </button>
        </form>
      </div>
    </section>
  `,
})
export class CambiarPasswordComponent {
  passwordActual = '';
  passwordNuevo = '';
  mensaje = '';
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    this.usuarioService.cambiarPassword({
      passwordActual: this.passwordActual,
      passwordNuevo: this.passwordNuevo,
    }).subscribe({
      next: (response) => {
        this.mensaje = response.mensaje || 'Password actualizado correctamente.';
        this.passwordActual = '';
        this.passwordNuevo = '';
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo actualizar el password.';
      },
    });
  }
}
