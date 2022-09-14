import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeTransform'
})
export class PipeTransformPipe implements PipeTransform {

 transform(arreglo: any[],texto: string): any[] {
    // console.log(arreglo);
    if(texto === ''){
      return arreglo
    }
    texto = texto.toLowerCase();

    // console.log(arreglo);
    
   return arreglo.filter(item=>{
      return (item.completa.toLowerCase()) 
              .includes(texto)
    })
    
    // return arreglo;
  }
}
