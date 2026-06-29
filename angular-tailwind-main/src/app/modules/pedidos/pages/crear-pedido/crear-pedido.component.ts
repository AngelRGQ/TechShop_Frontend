import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Producto } from 'src/app/modules/productos/models/producto.model';
import { ProductoService } from 'src/app/modules/productos/services/producto.service';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

interface PedidoDraftItem {
  productoId: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  cantidad: number;
}

@Component({
  selector: 'app-crear-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="p-6">
      <div class="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Crear pedido</h1>
          <p class="mt-1 text-sm text-slate-500">
            Arma tu orden, valida cantidades y enviala a TechShop para su procesamiento.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/catalogo"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
            Ver catalogo
          </a>
          <a
            routerLink="/pedidos/mis-pedidos"
            class="rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            Ver mis pedidos
          </a>
        </div>
      </div>

      <div *ngIf="!esCliente" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
        Esta pantalla solo esta disponible para usuarios con rol CLIENTE.
      </div>

      <div *ngIf="esCliente" class="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div class="space-y-6">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Selecciona productos</h2>
                <p class="mt-1 text-sm text-slate-500">
                  Busca en el catalogo y agrega las cantidades que necesites para tu pedido.
                </p>
              </div>

              <div class="flex flex-col gap-3 sm:flex-row">
                <input
                  [(ngModel)]="busqueda"
                  (ngModelChange)="aplicarBusqueda()"
                  type="text"
                  placeholder="Buscar por nombre o codigo"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 sm:w-72"
                />
                <button
                  type="button"
                  (click)="cargarProductos()"
                  class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
                  Actualizar
                </button>
              </div>
            </div>

            <div *ngIf="loading" class="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Cargando catalogo disponible...
            </div>

            <div *ngIf="error" class="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {{ error }}
            </div>

            <div *ngIf="draftError" class="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {{ draftError }}
            </div>

            <div *ngIf="!loading && !error && productosFiltrados.length === 0" class="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No encontramos productos para esa busqueda.
            </div>

            <div *ngIf="!loading && productosFiltrados.length > 0" class="mt-6 grid gap-4 md:grid-cols-2">
              <article
                *ngFor="let producto of productosFiltrados"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ producto.codigo }}</div>
                    <h3 class="mt-1 text-base font-semibold text-slate-900">{{ producto.nombre }}</h3>
                    <p class="mt-1 text-sm text-slate-500">{{ producto.categoria || 'Sin categoria' }}</p>
                  </div>
                  <div class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                    Stock {{ producto.stock }}
                  </div>
                </div>

                <p *ngIf="producto.descripcion" class="mt-3 text-sm leading-6 text-slate-600">
                  {{ producto.descripcion }}
                </p>

                <div class="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Precio unitario</div>
                    <div class="mt-1 text-lg font-bold text-slate-900">
                      {{ producto.precio | currency:'USD':'symbol':'1.2-2' }}
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      [ngModel]="cantidadesPorProducto[producto.id] ?? 1"
                      (ngModelChange)="actualizarCantidadTemporal(producto.id, $event)"
                      type="number"
                      min="1"
                      [max]="producto.stock"
                      class="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      [disabled]="producto.stock === 0"
                      (click)="agregarProducto(producto)"
                      class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                      {{ producto.stock === 0 ? 'Sin stock' : 'Agregar' }}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <aside class="space-y-6">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Resumen del pedido</h2>
                <p class="mt-1 text-sm text-slate-500">
                  Ajusta cantidades y agrega notas antes de enviar la orden.
                </p>
              </div>
              <div class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                {{ totalUnidades }} item{{ totalUnidades === 1 ? '' : 's' }}
              </div>
            </div>

            <div *ngIf="items.length === 0" class="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Aun no agregaste productos. Selecciona articulos del catalogo para armar tu pedido.
            </div>

            <div *ngIf="items.length > 0" class="mt-6 space-y-3">
              <article *ngFor="let item of items" class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ item.codigo }}</div>
                    <h3 class="mt-1 text-sm font-semibold text-slate-900">{{ item.nombre }}</h3>
                    <div class="mt-1 text-sm text-slate-500">
                      {{ item.precio | currency:'USD':'symbol':'1.2-2' }} por unidad
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="quitarProducto(item.productoId)"
                    class="text-xs font-semibold text-rose-600 transition hover:text-rose-700">
                    Quitar
                  </button>
                </div>

                <div class="mt-4 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="cambiarCantidad(item.productoId, -1)"
                      class="h-9 w-9 rounded-lg border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:border-slate-400">
                      -
                    </button>
                    <input
                      [ngModel]="item.cantidad"
                      (ngModelChange)="actualizarCantidadDetalle(item.productoId, $event)"
                      type="number"
                      min="1"
                      [max]="item.stock"
                      class="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      (click)="cambiarCantidad(item.productoId, 1)"
                      class="h-9 w-9 rounded-lg border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:border-slate-400">
                      +
                    </button>
                  </div>

                  <div class="text-right">
                    <div class="text-xs uppercase tracking-wide text-slate-500">Subtotal</div>
                    <div class="text-sm font-semibold text-slate-900">
                      {{ item.precio * item.cantidad | currency:'USD':'symbol':'1.2-2' }}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div class="mt-6">
              <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Notas del pedido</label>
              <textarea
                [(ngModel)]="notas"
                rows="4"
                placeholder="Ejemplo: Entrega en jornada de la tarde o referencia interna del pedido."
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"></textarea>
            </div>

            <div *ngIf="submitError" class="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {{ submitError }}
            </div>

            <div *ngIf="mensaje" class="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {{ mensaje }}
            </div>

            <div class="mt-6 rounded-xl bg-slate-900 px-4 py-4 text-white">
              <div class="flex items-center justify-between text-sm">
                <span>Productos</span>
                <span>{{ totalUnidades }} unidad{{ totalUnidades === 1 ? '' : 'es' }}</span>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm font-medium text-slate-300">Total estimado</span>
                <span class="text-2xl font-bold">{{ totalPedido | currency:'USD':'symbol':'1.2-2' }}</span>
              </div>
            </div>

            <div class="mt-6 grid gap-3">
              <button
                type="button"
                [disabled]="enviando || items.length === 0"
                (click)="enviarPedido()"
                class="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200">
                {{ enviando ? 'Enviando pedido...' : 'Enviar pedido' }}
              </button>
              <button
                type="button"
                [disabled]="enviando || items.length === 0"
                (click)="limpiarPedido()"
                class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
                Vaciar resumen
              </button>
            </div>
          </div>

          <div *ngIf="pedidoCreado" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <h2 class="text-lg font-semibold text-emerald-900">Pedido enviado</h2>
            <p class="mt-2 text-sm text-emerald-800">
              Tu pedido #{{ pedidoCreado.id }} quedo registrado con estado {{ pedidoCreado.estado }}.
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              <a
                [routerLink]="['/pedidos', pedidoCreado.id]"
                class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
                Ver detalle
              </a>
              <a
                routerLink="/pedidos/mis-pedidos"
                class="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400">
                Ir a mis pedidos
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class CrearPedidoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  items: PedidoDraftItem[] = [];
  cantidadesPorProducto: Partial<Record<number, number>> = {};
  notas = '';
  busqueda = '';
  loading = true;
  enviando = false;
  error = '';
  draftError = '';
  submitError = '';
  mensaje = '';
  esCliente = false;
  pedidoCreado: Pedido | null = null;

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private sessionService: SessionService,
  ) {}

  get totalUnidades(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  get totalPedido(): number {
    return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  ngOnInit(): void {
    this.esCliente = this.sessionService.hasRole(['CLIENTE']);
    if (!this.esCliente) {
      this.loading = false;
      return;
    }

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = '';

    this.productoService.listar({ limite: 100 }).subscribe({
      next: (response) => {
        this.productos = (response.data ?? []).filter((producto) => (producto.activo ?? true));
        this.productos.forEach((producto) => {
          this.cantidadesPorProducto[producto.id] = this.cantidadesPorProducto[producto.id] ?? 1;
        });
        this.aplicarBusqueda();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el catalogo para crear el pedido.';
        this.loading = false;
      },
    });
  }

  aplicarBusqueda(): void {
    const termino = this.busqueda.trim().toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      !termino ||
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino)
    );
  }

  actualizarCantidadTemporal(productoId: number, value: number | string): void {
    const cantidad = this.normalizarCantidad(value);
    this.cantidadesPorProducto[productoId] = cantidad;
  }

  agregarProducto(producto: Producto): void {
    this.draftError = '';
    this.submitError = '';
    this.mensaje = '';

    const cantidadSolicitada = this.normalizarCantidad(this.cantidadesPorProducto[producto.id] ?? 1);
    if (cantidadSolicitada > producto.stock) {
      this.draftError = `La cantidad solicitada para ${producto.nombre} supera el stock disponible.`;
      this.cantidadesPorProducto[producto.id] = producto.stock || 1;
      return;
    }

    const existente = this.items.find((item) => item.productoId === producto.id);
    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidadSolicitada;
      if (nuevaCantidad > producto.stock) {
        this.draftError = `No puedes agregar mas de ${producto.stock} unidades de ${producto.nombre}.`;
        return;
      }

      existente.cantidad = nuevaCantidad;
    } else {
      this.items = [
        ...this.items,
        {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          cantidad: cantidadSolicitada,
        },
      ];
    }

    this.cantidadesPorProducto[producto.id] = 1;
    this.pedidoCreado = null;
  }

  cambiarCantidad(productoId: number, delta: number): void {
    const item = this.items.find((currentItem) => currentItem.productoId === productoId);
    if (!item) {
      return;
    }

    this.actualizarCantidadItem(item, item.cantidad + delta);
  }

  actualizarCantidadDetalle(productoId: number, value: number | string): void {
    const item = this.items.find((currentItem) => currentItem.productoId === productoId);
    if (!item) {
      return;
    }

    this.actualizarCantidadItem(item, value);
  }

  quitarProducto(productoId: number): void {
    this.items = this.items.filter((item) => item.productoId !== productoId);
    this.submitError = '';
    this.draftError = '';
  }

  limpiarPedido(): void {
    this.items = [];
    this.notas = '';
    this.draftError = '';
    this.submitError = '';
    this.mensaje = '';
    this.pedidoCreado = null;
  }

  enviarPedido(): void {
    if (this.items.length === 0) {
      this.submitError = 'Agrega al menos un producto antes de enviar el pedido.';
      return;
    }

    this.enviando = true;
    this.submitError = '';
    this.draftError = '';
    this.mensaje = '';

    this.pedidoService.crear({
      detalles: this.items.map((item) => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
      })),
      notas: this.notas.trim() || undefined,
    }).subscribe({
      next: (response) => {
        this.pedidoCreado = response.data;
        this.mensaje = response.mensaje || 'Pedido enviado correctamente.';
        this.items = [];
        this.notas = '';
        this.enviando = false;
      },
      error: (err) => {
        this.submitError = err.error?.mensaje || 'No se pudo crear el pedido.';
        this.enviando = false;
      },
    });
  }

  private actualizarCantidadItem(item: PedidoDraftItem, value: number | string): void {
    const cantidad = this.normalizarCantidad(value);
    item.cantidad = Math.min(cantidad, item.stock);
    this.items = [...this.items];

    if (cantidad > item.stock) {
      this.draftError = `La cantidad maxima para ${item.nombre} es ${item.stock}.`;
      return;
    }

    this.draftError = '';
    this.submitError = '';
    this.pedidoCreado = null;
  }

  private normalizarCantidad(value: number | string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return Math.floor(parsed);
  }
}
