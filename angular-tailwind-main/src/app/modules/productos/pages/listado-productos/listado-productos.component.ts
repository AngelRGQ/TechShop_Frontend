import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="p-6">
      <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ esCliente ? 'Catalogo' : 'Productos' }}</h1>
          <p class="text-sm text-slate-500">
            {{ esCliente ? 'Consulta el catalogo disponible en TechShop.' : 'Consulta el inventario y el estado del stock.' }}
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            *ngIf="esCliente"
            routerLink="/pedidos/crear"
            class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            Armar pedido
          </a>
          <input
            [(ngModel)]="busqueda"
            (ngModelChange)="aplicarBusqueda()"
            type="text"
            placeholder="Buscar por nombre o codigo"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <button
            *ngIf="!esCliente"
            type="button"
            (click)="toggleBajoStock()"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            {{ soloBajoStock ? 'Ver todos' : 'Ver bajo stock' }}
          </button>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div *ngIf="loading" class="px-4 py-6 text-sm text-slate-500">
          Cargando productos...
        </div>

        <div *ngIf="error" class="px-4 py-6 text-sm text-rose-600">
          {{ error }}
        </div>

        <div *ngIf="!loading && !error && productos.length === 0" class="px-4 py-6 text-sm text-slate-500">
          No hay productos disponibles.
        </div>

        <div *ngIf="!loading && productos.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Codigo</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Categoria</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Precio</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Stock</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let producto of productosFiltrados">
                <td class="px-4 py-3 text-sm text-slate-700">{{ producto.codigo }}</td>
                <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ producto.nombre }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ producto.categoria || 'Sin categoria' }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ producto.precio | currency:'USD':'symbol':'1.2-2' }}</td>
                <td class="px-4 py-3 text-sm" [ngClass]="producto.stock <= 5 ? 'font-semibold text-amber-700' : 'text-slate-700'">
                  {{ producto.stock }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class ListadoProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  loading = true;
  error = '';
  busqueda = '';
  soloBajoStock = false;
  esCliente = false;

  constructor(
    private productoService: ProductoService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.esCliente = this.sessionService.hasRole(['CLIENTE']);
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = '';

    const request$ = this.soloBajoStock
      ? this.productoService.listarBajoStock()
      : this.productoService.listar({ busqueda: this.busqueda });

    request$.subscribe({
      next: (response) => {
        this.productos = response.data ?? [];
        this.productosFiltrados = [...this.productos];
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos.';
        this.loading = false;
      },
    });
  }

  aplicarBusqueda(): void {
    if (this.soloBajoStock) {
      const termino = this.busqueda.trim().toLowerCase();
      this.productosFiltrados = this.productos.filter((producto) =>
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.codigo.toLowerCase().includes(termino)
      );
      return;
    }

    this.cargarProductos();
  }

  toggleBajoStock(): void {
    this.soloBajoStock = !this.soloBajoStock;
    this.cargarProductos();
  }
}
