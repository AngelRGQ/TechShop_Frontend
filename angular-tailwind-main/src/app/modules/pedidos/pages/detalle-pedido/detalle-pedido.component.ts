import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="p-6">
      <h1 class="text-2xl font-bold text-slate-900">Detalle del pedido</h1>

      <div class="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div *ngIf="loading" class="text-sm text-slate-500">Cargando detalle...</div>
        <div *ngIf="error" class="text-sm text-rose-600">{{ error }}</div>

        <div *ngIf="!loading && pedido">
          <div class="mb-4 text-sm text-slate-600">Pedido #{{ pedido.id }}</div>
          <div class="mb-2 text-sm">Estado: <span class="font-semibold">{{ pedido.estado }}</span></div>
          <div class="mb-2 text-sm">Total: <span class="font-semibold">{{ pedido.total | currency:'USD':'symbol':'1.2-2' }}</span></div>
          <div class="mb-2 text-sm" *ngIf="pedido.notas">Notas: <span class="font-semibold">{{ pedido.notas }}</span></div>
          <div class="mb-2 text-sm text-rose-600" *ngIf="pedido.motivo_rechazo">Motivo de rechazo: {{ pedido.motivo_rechazo }}</div>

          <div class="mt-4 flex gap-3" *ngIf="pedido.estado === 'PENDIENTE'">
            <button
              *ngIf="esCliente"
              type="button"
              (click)="cancelar()"
              class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
              Cancelar pedido
            </button>
            <button
              *ngIf="puedeProcesar"
              type="button"
              (click)="procesar()"
              class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Procesar
            </button>
            <button
              *ngIf="puedeProcesar"
              type="button"
              (click)="rechazar()"
              class="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
              Rechazar
            </button>
          </div>

          <div *ngIf="pedido.detalles?.length" class="mt-4">
            <h2 class="mb-2 text-sm font-semibold text-slate-800">Productos</h2>
            <ul class="space-y-2">
              <li *ngFor="let detalle of pedido.detalles" class="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ detalle.producto_nombre || detalle.codigo || ('Producto #' + detalle.producto_id) }}
                - Cantidad: {{ detalle.cantidad }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DetallePedidoComponent implements OnInit {
  pedido: Pedido | null = null;
  loading = true;
  error = '';
  esCliente = false;
  puedeProcesar = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.esCliente = this.sessionService.hasRole(['CLIENTE']);
    this.puedeProcesar = this.sessionService.hasRole(['ADMIN', 'VENDEDOR']);

    this.cargarPedido();
  }

  cargarPedido(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Pedido invalido.';
      this.loading = false;
      return;
    }

    this.pedidoService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.pedido = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el detalle del pedido.';
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    if (!this.pedido) return;

    this.pedidoService.cancelar(this.pedido.id).subscribe({
      next: () => {
        if (this.pedido) this.pedido.estado = 'CANCELADO';
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo cancelar el pedido.';
      },
    });
  }

  procesar(): void {
    if (!this.pedido) return;

    this.pedidoService.procesar(this.pedido.id).subscribe({
      next: () => this.cargarPedido(),
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo procesar el pedido.';
      },
    });
  }

  rechazar(): void {
    if (!this.pedido) return;

    const motivo = window.prompt('Motivo de rechazo:');
    if (!motivo?.trim()) return;

    this.pedidoService.rechazar(this.pedido.id, motivo.trim()).subscribe({
      next: () => this.cargarPedido(),
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo rechazar el pedido.';
      },
    });
  }
}
