import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Mis pedidos</h1>
          <p class="mt-1 text-sm text-slate-500">Historial de pedidos del cliente autenticado.</p>
        </div>

        <a
          routerLink="/pedidos/crear"
          class="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
          Crear nuevo pedido
        </a>
      </div>

      <div class="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div *ngIf="loading" class="px-4 py-6 text-sm text-slate-500">Cargando pedidos...</div>
        <div *ngIf="error" class="px-4 py-6 text-sm text-rose-600">{{ error }}</div>
        <div *ngIf="!loading && !error && pedidos.length === 0" class="px-4 py-6 text-sm text-slate-500">
          Aun no hay pedidos registrados.
          <a routerLink="/pedidos/crear" class="ml-1 font-semibold text-slate-900 underline underline-offset-2">
            Crear el primero
          </a>
          .
        </div>

        <div *ngIf="!loading && pedidos.length > 0" class="divide-y divide-slate-100">
          <article *ngFor="let pedido of pedidos" class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div>
                <a [routerLink]="['/pedidos', pedido.id]" class="text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Pedido #{{ pedido.id }}
                </a>
                <div class="text-xs text-slate-500">Estado: {{ pedido.estado }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-700">
                  {{ pedido.total | currency:'USD':'symbol':'1.2-2' }}
                </div>
                <button
                  *ngIf="pedido.estado === 'PENDIENTE'"
                  type="button"
                  (click)="cancelar(pedido.id)"
                  class="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700">
                  Cancelar pedido
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = true;
  error = '';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (response) => {
        this.pedidos = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar tus pedidos.';
        this.loading = false;
      },
    });
  }

  cancelar(id: number): void {
    this.pedidoService.cancelar(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.map((pedido) =>
          pedido.id === id ? { ...pedido, estado: 'CANCELADO' } : pedido
        );
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo cancelar el pedido.';
      },
    });
  }
}
