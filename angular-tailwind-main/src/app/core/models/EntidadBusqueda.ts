import moment from "moment";

export class EntidadBusqueda {
    public fecha: string = moment().format('YYYY-MM-DD');
    public  numeroPagina:number=0;
    public  tamanioLote:number=10
    public  palabra:string=""
  }