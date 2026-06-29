import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/shared/api-response.model';
import { PeticionesService } from '../../../core/services/http/peticiones.service';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private api: PeticionesService) {}

  listar(params?: { pagina?: number; limite?: number; busqueda?: string }): Observable<ApiResponse<Producto[]>> {
    const searchParams = new URLSearchParams();

    if (params?.pagina) searchParams.set('pagina', String(params.pagina));
    if (params?.limite) searchParams.set('limite', String(params.limite));
    if (params?.busqueda) searchParams.set('busqueda', params.busqueda);

    const query = searchParams.toString();
    return this.api.get<ApiResponse<Producto[]>>(`/productos${query ? `?${query}` : ''}`);
  }

  obtenerPorId(id: number): Observable<ApiResponse<Producto>> {
    return this.api.get<ApiResponse<Producto>>(`/productos/${id}`);
  }

  listarBajoStock(): Observable<ApiResponse<Producto[]>> {
    return this.api.get<ApiResponse<Producto[]>>('/productos/bajo-stock');
  }

  crear(payload: Omit<Producto, 'id'>): Observable<ApiResponse<Producto>> {
    return this.api.post<ApiResponse<Producto>>('/productos', payload);
  }

  actualizar(id: number, payload: Partial<Omit<Producto, 'id'>>): Observable<ApiResponse<Producto>> {
    return this.api.put<ApiResponse<Producto>>(`/productos/${id}`, payload);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.api.delete<ApiResponse<null>>(`/productos/${id}`);
  }
}
