import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/shared/api-response.model';
import { PeticionesService } from '../../../core/services/http/peticiones.service';
import { Pedido } from '../models/pedido.model';
import { DetallePedido } from '../models/detalle-pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  constructor(private api: PeticionesService) {}

  listar(estado?: string): Observable<ApiResponse<Pedido[]>> {
    const query = estado ? `/pedidos?estado=${encodeURIComponent(estado)}` : '/pedidos';
    return this.api.get<ApiResponse<Pedido[]>>(query);
  }

  obtenerPorId(id: number): Observable<ApiResponse<Pedido>> {
    return this.api.get<ApiResponse<Pedido>>(`/pedidos/${id}`);
  }

  crear(payload: { detalles: { productoId: number; cantidad: number }[]; notas?: string }): Observable<ApiResponse<Pedido>> {
    return this.api.post<ApiResponse<Pedido>>('/pedidos', payload);
  }

  cancelar(id: number): Observable<ApiResponse<Pedido>> {
    return this.api.put<ApiResponse<Pedido>>(`/pedidos/${id}/cancelar`, {});
  }

  procesar(id: number): Observable<ApiResponse<{ pedidoId: number; estado: string; mensaje: string; detallesStock: DetallePedido[] }>> {
    return this.api.post<ApiResponse<{ pedidoId: number; estado: string; mensaje: string; detallesStock: DetallePedido[] }>>(`/pedidos/${id}/procesar`, {});
  }

  rechazar(id: number, motivo: string): Observable<ApiResponse<{ pedidoId: number; estado: string; mensaje: string }>> {
    return this.api.post<ApiResponse<{ pedidoId: number; estado: string; mensaje: string }>>(`/pedidos/${id}/rechazar`, { motivo });
  }
}
