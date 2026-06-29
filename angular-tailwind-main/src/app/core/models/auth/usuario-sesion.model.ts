export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  cedula?: string | null;
  celular?: string | null;
  rol: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
  activo: boolean;
}
