import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedidos-pendientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="p-6">
      <h1 class="text-2xl font-bold text-slate-900">Pedidos pendientes</h1>
      <p class="mt-1 text-sm text-slate-500">Bandeja operativa para el equipo de ventas.</p>

      <div class="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div *ngIf="loading" class="px-4 py-6 text-sm text-slate-500">Cargando pedidos pendientes...</div>
        <div *ngIf="error" class="px-4 py-6 text-sm text-rose-600">{{ error }}</div>
        <div *ngIf="!loading && !error && pedidos.length === 0" class="px-4 py-6 text-sm text-slate-500">
          No hay pedidos pendientes.
        </div>

        <div *ngIf="!loading && pedidos.length > 0" class="divide-y divide-slate-100">
          <article *ngFor="let pedido of pedidos" class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div>
                <a [routerLink]="['/pedidos', pedido.id]" class="text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Pedido #{{ pedido.id }}
                </a>
                <div class="text-xs text-slate-500">{{ pedido.cliente_nombre || 'Cliente' }}</div>
              </div>
              <div class="flex items-center gap-3">
                <div class="text-sm font-semibold text-amber-700">{{ pedido.estado }}</div>
                <button
                  type="button"
                  (click)="procesar(pedido.id)"
                  class="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Procesar
                </button>
                <button
                  type="button"
                  (click)="rechazar(pedido.id)"
                  class="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                  Rechazar
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class PedidosPendientesComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = true;
  error = '';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.listar('PENDIENTE').subscribe({
      next: (response) => {
        this.pedidos = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los pedidos pendientes.';
        this.loading = false;
      },
    });
  }

  procesar(id: number): void {
    this.pedidoService.procesar(id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo procesar el pedido.';
      },
    });
  }

  rechazar(id: number): void {
    const motivo = window.prompt('Motivo de rechazo:');
    if (!motivo?.trim()) {
      return;
    }

    this.pedidoService.rechazar(id, motivo.trim()).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo rechazar el pedido.';
      },
    });
  }
}
