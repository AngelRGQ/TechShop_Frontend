import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class Mensajes {

  constructor() { }

  mensajeError(Mensaje: any) {
    Swal.fire({
      customClass:{
          confirmButton:'inline-flex  items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold leading-6 text-primary-foreground shadow transition duration-150 ease-in-out'
        },
      title: "Error",
      text: Mensaje,
      icon: 'error',
      confirmButtonText: 'Ok'
    })

  }


  mensajeCorrecto(Mensaje: any) {
    Swal.fire({
      customClass:{
          confirmButton:'inline-flex  items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold leading-6 text-primary-foreground shadow transition duration-150 ease-in-out'
      },
      title: "Correcto",
      text: Mensaje,
      icon: 'success',
      confirmButtonText: 'Ok'
    })

  }

  mensajeAdvertencia(Mensaje: any) {
    Swal.fire({
      customClass:{
        confirmButton:'inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold leading-6 text-primary-foreground shadow transition duration-150 ease-in-out'
      },
      title: "Atención",
      text: Mensaje,
      icon: 'warning',  // Cambiado aquí
      confirmButtonText: 'Ok'
    });
  }
  
}