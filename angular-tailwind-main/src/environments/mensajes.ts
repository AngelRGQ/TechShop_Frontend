import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class Mensajes {

  constructor() { }

  mensajeError(Mensaje: any) {
    Swal.fire({
      title: "Error",
      text: Mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    })

  }


  mensajeCorrecto(Mensaje: any) {
    Swal.fire({
      customClass:{
        confirmButton:'btn btn-primary'
      },
      title: "Correcto",
      text: Mensaje,
      icon: 'success',
      confirmButtonText: 'Ok'
    })

  }
}