// cabeceras.ts
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CabecerasService {
  constructor() {}


    public HeadersArchivos(){

        return new HttpHeaders({
            //'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": JSON.parse(localStorage.getItem("TokenTarjetasStop")! as string)!.token
        });
   }



    public Headers() {
        debugger
        if(JSON.parse(localStorage.getItem("TokenTarjetasStop")! as string)){
        return new HttpHeaders({
            "Content-type": 'application/json',
            "Authorization": JSON.parse(localStorage.getItem("TokenTarjetasStop")! as string)!.token
        });
    }else{
        return new HttpHeaders({
            "Content-type": 'application/json',
        });
    }
    }


}