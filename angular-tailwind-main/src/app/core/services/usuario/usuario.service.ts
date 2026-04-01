import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, } from '@angular/core';
//import { environment } from 'src/app/core/constants/global';
import { Router } from '@angular/router';
//import { PeticionesService } from '../../constants/peticiones';


import { EntidadRespuesta } from '../../models/EntidadRespuesta';
import { EntidadBusqueda } from '../../models/EntidadBusqueda';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public identity?: any;
  public token: any;

  constructor(public router: Router, private http: HttpClient, public peticiones: PeticionesService) { }


  autenticarUsuario(usuario: any, getHash: string) {
    if (getHash) {
      usuario.getHash = getHash;
    }
    let params = JSON.stringify(usuario);
    return this.peticiones.ejecutarQueryPost<EntidadRespuesta>(`autenticarUsuario`, params)
  }
  obtenerUsuarioLicencias(idUsuario: number) {
    return this.peticiones.ejecutarQueryGet<EntidadRespuesta>(`obtenerUsuarioLicencias/${idUsuario}`)
  }

  listarAreas() {
    return this.peticiones.ejecutarQueryGet<EntidadRespuesta>(`listarAreas`)
  }

  obtenerAreas() {
    return this.peticiones.ejecutarQueryGet<EntidadRespuesta>(`obtenerAreas`)
  }

  listarUsuariosActivosTarjetas() {
    return this.peticiones.ejecutarQueryGet<EntidadRespuesta>(`listarUsuariosActivosTarjetas`)
  }

  obtenerMiUsuario(idUsuario: number) {
    return this.peticiones.ejecutarQueryGet<EntidadRespuesta>(`obtenerMiUsuario/${idUsuario}`)
  }


  actualizarContrasenia(idUsuario: number, contrasenia: any) {
    let params = JSON.stringify(contrasenia);
    console.log("entere actuaizar")
    return this.peticiones.ejecutarQueryPut<EntidadRespuesta>(`actualizarContrasenia/${idUsuario}`, params)
  }


  actualizarEstadoLicencia(idLicencia:number,obj:any) {
    let params = JSON.stringify(obj);
    return this.peticiones.ejecutarQueryPut<EntidadRespuesta>(`actualizarEstadoLicencia/${idLicencia}`, params)
  }

  getIdentity() {
    let identity = localStorage.getItem("IdentityTarjetasStop");
    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    let token = localStorage.getItem("TokenTarjetasStop");
    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }


  async salir() {
    debugger;
    localStorage.removeItem("IdentityTarjetasStop");
    localStorage.removeItem("TokenTarjetasStop");
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }
}