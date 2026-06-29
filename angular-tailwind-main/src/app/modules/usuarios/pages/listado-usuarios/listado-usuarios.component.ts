import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioSesion } from 'src/app/core/models/auth/usuario-sesion.model';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-listado-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="p-6">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Usuarios del sistema</h1>
          <p class="mt-1 text-sm text-slate-500">
            Vista administrativa de clientes, vendedores y administradores registrados.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            [(ngModel)]="busqueda"
            (ngModelChange)="aplicarFiltros()"
            type="text"
            placeholder="Buscar por nombre, email o cedula"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <select
            [(ngModel)]="rolSeleccionado"
            (ngModelChange)="aplicarFiltros()"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">Todos los roles</option>
            <option value="CLIENTE">Clientes</option>
            <option value="VENDEDOR">Vendedores</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>
      </div>

      <div class="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        La cedula se almacena cifrada en base de datos y aqui se muestra desencriptada desde el backend para usuarios con rol ADMIN.
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div *ngIf="loading" class="px-4 py-6 text-sm text-slate-500">Cargando usuarios...</div>
        <div *ngIf="error" class="px-4 py-6 text-sm text-rose-600">{{ error }}</div>
        <div *ngIf="!loading && !error && usuariosFiltrados.length === 0" class="px-4 py-6 text-sm text-slate-500">
          No hay usuarios para los filtros seleccionados.
        </div>

        <div *ngIf="!loading && usuariosFiltrados.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cedula</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Celular</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Rol</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let usuario of usuariosFiltrados">
                <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ usuario.nombre }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ usuario.email }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ usuario.cedula || 'Sin registrar' }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ usuario.celular || 'Sin registrar' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    [ngClass]="{
                      'bg-slate-900 text-white': usuario.rol === 'ADMIN',
                      'bg-amber-100 text-amber-800': usuario.rol === 'VENDEDOR',
                      'bg-emerald-100 text-emerald-800': usuario.rol === 'CLIENTE'
                    }">
                    {{ usuario.rol }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm" [ngClass]="usuario.activo ? 'text-emerald-700' : 'text-rose-600'">
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class ListadoUsuariosComponent implements OnInit {
  usuarios: UsuarioSesion[] = [];
  usuariosFiltrados: UsuarioSesion[] = [];
  loading = true;
  error = '';
  busqueda = '';
  rolSeleccionado = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.listarUsuariosSistema().subscribe({
      next: (response) => {
        this.usuarios = response.data ?? [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'El endpoint de usuarios no esta disponible en el backend actual. Reinicia el servidor backend y prueba de nuevo.';
        } else if (err.status === 403) {
          this.error = err.error?.mensaje || 'Tu usuario no tiene permisos para ver esta pantalla.';
        } else {
          this.error = err.error?.mensaje || err.message || 'No se pudieron cargar los usuarios.';
        }
        this.loading = false;
      },
    });
  }

  aplicarFiltros(): void {
    const termino = this.busqueda.trim().toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter((usuario) => {
      const coincideRol = !this.rolSeleccionado || usuario.rol === this.rolSeleccionado;
      const coincideBusqueda =
        !termino ||
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino) ||
        (usuario.cedula || '').toLowerCase().includes(termino);

      return coincideRol && coincideBusqueda;
    });
  }
}
