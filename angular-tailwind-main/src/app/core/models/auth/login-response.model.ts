import { UsuarioSesion } from './usuario-sesion.model';

export interface LoginResponse {
  data: {
    token: string;
    usuario: UsuarioSesion;
  };
}
