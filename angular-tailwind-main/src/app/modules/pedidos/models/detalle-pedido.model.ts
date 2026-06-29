export interface DetallePedido {
  producto_id: number;
  producto_nombre?: string;
  codigo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}
