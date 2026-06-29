import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CabecerasService } from 'src/app/core/constants/cabeceras';
import { environment } from 'src/app/core/constants/global';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  constructor(private http: HttpClient, private _servicioCabeceras: CabecerasService) {}

  private ejecutarQueryPostsArchivos<T>(query: string, body: any) {
    const url = API_URL + query;
    return this.http.post<T>(url, body, { headers: this._servicioCabeceras.HeadersArchivos() });
  }

  private ejecutarQueryPost<T>(query: string, body: any) {
    const url = API_URL + query;
    return this.http.post<T>(url, body, { headers: this._servicioCabeceras.Headers() });
  }

  private ejecutarQueryGet<T>(query: string) {
    const url = API_URL + query;
    return this.http.get<T>(url, { headers: this._servicioCabeceras.Headers() });
  }

  private ejecutarQueryPut<T>(query: string, body: any) {
    const url = API_URL + query;
    return this.http.put<T>(url, body, { headers: this._servicioCabeceras.Headers() });
  }

  private ejecutarQueryDelete<T>(query: string) {
    const url = API_URL + query;
    return this.http.delete<T>(url, { headers: this._servicioCabeceras.Headers() });
  }

  private ejecutarQueryPutArchivos<T>(query: string, body: any) {
    const url = API_URL + query;
    return this.http.put<T>(url, body, { headers: this._servicioCabeceras.HeadersArchivos() });
  }

  // Métodos públicos unificados para TechShop
  public get<T>(endpoint: string) { return this.ejecutarQueryGet<T>(endpoint); }
  public post<T>(endpoint: string, body: any) { return this.ejecutarQueryPost<T>(endpoint, body); }
  public put<T>(endpoint: string, body: any) { return this.ejecutarQueryPut<T>(endpoint, body); }
  public delete<T>(endpoint: string) { return this.ejecutarQueryDelete<T>(endpoint); }
}