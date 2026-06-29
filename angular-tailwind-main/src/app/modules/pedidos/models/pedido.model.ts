import { DetallePedido } from './detalle-pedido.model';

export interface Pedido {
  id: number;
  cliente_id?: number;
  cliente_nombre?: string;
  cliente_email?: string;
  estado: string;
  total: number;
  notas?: string;
  fecha_creacion?: string;
  fecha_procesado?: string;
  motivo_rechazo?: string;
  detalles?: DetallePedido[];
}
