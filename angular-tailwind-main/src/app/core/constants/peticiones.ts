import { HttpClient} from '@angular/common/http';

import { Injectable, } from '@angular/core';

import { CabecerasService } from './cabeceras';
import { environment } from './global';



const API_URL = environment.apiUrl;



@Injectable({
  providedIn: 'root'
})
export class PeticionesService {


  constructor(private http: HttpClient, public _servicioCabeceras:CabecerasService) {}

  public  ejecutarQueryPostsArchivos<T>(query: string, body: any) {
    query = API_URL + query;
    return this.http.post<T>(query, body, {headers:this._servicioCabeceras.HeadersArchivos()})
  }

   public  ejecutarQueryPost<T>(query: string, body: any) {
    query = API_URL + query;
    return this.http.post<T>(query, body, {headers:this._servicioCabeceras.Headers()})
  }


  public ejecutarQueryGet<T>(query: string) {
    query = API_URL + query;
    return this.http.get<T>(query, { headers:this._servicioCabeceras.Headers()})
  }

 
  public  ejecutarQueryPut<T>(query: string, body:any) {
    query = API_URL + query;
    return this.http.put<T>(query, body,{headers:this._servicioCabeceras.Headers()})
  }

  public  ejecutarQueryDelete<T>(query: string) {
    query = API_URL + query;
    return this.http.delete<T>(query, { headers:this._servicioCabeceras.Headers() })

  }

  public ejecutarQueryPutArchivos<T>(query: string, body: any) {
    query = API_URL + query;
    return this.http.put<T>(query, body, {headers: this._servicioCabeceras.HeadersArchivos()});
  }
  

}