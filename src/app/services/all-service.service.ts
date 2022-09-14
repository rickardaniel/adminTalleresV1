import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class AllServiceService {

  urlBase = '';
  urlLogin = environment.accesoLogin;
  urlCors = environment.CORS;
  urlCommon = environment.common;
  urlTaller = environment.taller;
  urlEPL = environment.EPlogin;
  // urlTalleres = this.urlCors + environment.urlDemo;
  urlTalleres = '';
  // urlTalleres2 =  environment.urlDemo2;
  // urlCliente = environment.urlCliente;

  urlClient = environment.cliente;
  empresa:any;
  datosLocalStorage:any;
  datosOnlyEmpresa:any;
  //EMPRESA

  // urlEMPRESAINI = localStorage.getItem('linkEmpresa');
  // urlEMPRESAFIN = "common/talleres/";



  URL = this.urlTalleres+'orden_abierta/all';
  urlCambiarEstadoOrden =this.urlTalleres+"orden_abierta/edit_estado/id/";
  // urlCorreo = environment.urlSendMessage;

  constructor(private http:HttpClient ) { }



  // ==================================== LOGIN ===================================================

  getEmpresa(cedula:any){
    return new Promise((resolve)=>{
      // console.log(this.urlCors+this.urlLogin+cedula );
      
      this.http.get(this.urlCors+this.urlLogin+cedula ).subscribe(data =>{
        // console.log(this.urlCors+this.urlLogin+cedula);
        // console.log("data", data);
        

       resolve(data);
      })
    })
  }

  login(url:string,user:string, pass:string){
    return new Promise((resolve)=>{
      // console.log(url+this.urlCommon+this.urlEPL+'user='+user+'&pwd='+pass);
      
      this.http.get(url+this.urlCommon+this.urlEPL+'user='+user+'&pwd='+pass).subscribe(data =>{
        resolve(data);
      })
    })
  }

  saveLocalStorage(url: string, data:any) {
    localStorage.setItem('api_system', url);
    localStorage.setItem('Inflogueo', JSON.stringify(data));
    // this.urlBase = url;
  }

  getUrlBaseTaller(){
    return this.urlCors + localStorage.getItem('api_system') + this.urlTaller;
  }
  getUrlBaseTallerSINCORS(){
    return localStorage.getItem('api_system');
  }
  getUrlBaseTallerSINCORS1(){
    return localStorage.getItem('api_system')+ this.urlTaller;
  }

  getUrlBaseCommon() {
    return this.urlCors + localStorage.getItem('api_system') + this.urlCommon;
  }
  getUrlBaseCommonSINCORS() {
    return localStorage.getItem('api_system') + this.urlCommon;
  }

  estaAutenticado(): boolean {

    if ( localStorage.getItem('Inflogueo') == null ) {      
      return false;
    }
    return true;
  }

  getForOrden( id:string, tipo:string,accion:string){
    return new Promise ((resolve)=>{
      this.http.get(this.getUrlBaseTaller()+'hacer_pdf/'+accion+'?oa_id='+id+'&tipo='+tipo).subscribe(data=>{
        resolve(data);
      })
    })
  }

// ====================================== METODO GET GENERAL ==============================================

// getAll(url:string){
//   return new Promise((resolve)=>{
//     this.http.get(this.urlTalleres+url+'/activo').subscribe(data=>{
//       resolve(data);
//     })
//   })
// }
// ====================================== METODO GET ORDEN ABIERTA ==============================================

getAllOA(url:string){
  return new Promise((resolve)=>{
    this.http.get(this.getUrlBaseTaller()+url).subscribe(data=>{
      resolve(data);
    })
  })
}
// =========================================== METODO GET PRODUCTOS SERVICIOS ==============================================

getProductosServicios( item:string){
 return new Promise((resolve)=>{
   this.http.get(this.getUrlBaseCommonSINCORS()+'search_product_name_code?search='+item).subscribe(data=>{
     resolve(data);
   })
 })
}
getProductoMap( item:string){
  return this.http.get(this.getUrlBaseCommonSINCORS()+'search_product_name_code?search='+item)
  .pipe(
      map((res:any)=>{        
        return res.data.map((prod:any) => ({
                  codigo2:prod.codigo2,
                  esServicio:prod.esServicio,
                  id_producto:prod.id_producto,
                  impuesto_porcent:prod.impuesto_porcent,
                  ivaporcent:prod.ivaporcent,
                  precios:prod.precios,
                  pro_nom:prod.pro_nom,
                  stock:prod.stockactual              
        }))    
    
      })    
                  
       );
  // return  this.http.get(this.getUrlBaseCommonSINCORS()+'search_product_name_code?search='+item)
  // .pipe(
  //     map((resp1:any)=>{
        
  //       return resp1.map((prod:any) => ({
  //         codigo2:prod.codigo2,
  //         esServicio:prod.esServicio,
  //         id_producto:prod.id_producto,
  //         impuesto_porcent:prod.impuesto_porcent,
  //         ivaporcent:prod.ivaporcent,
  //         precios:prod.precios,
  //         pro_nom:prod.pro_nom,
  //         stock:prod.stock
  //       }))    
  //     })                
  //      );
}

  // ====================================== METODO GET ==================================================


  getALL(url:string, i:any):Observable<any[]>{
    return this.http.get<any[]>(this.getUrlBaseTaller()+url+'/all');
  }
  getVC(url:string, i:any):Observable<any[]>{
    // console.log(this.getUrlBaseTaller()+url);
    
    return this.http.get<any[]>(this.getUrlBaseTaller()+url);
  }

  getALLPlaneador(url:string, i:any):Observable<any[]>{
    return this.http.get<any[]>(this.getUrlBaseTaller()+url+'/planeador');
  }




  getAl( coleccion:string ) {
    const url = this.getUrlBaseTaller() + coleccion;

    // console.log(url);
    
    let Options = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' })
    }
    return new Promise((resolve) => {
     
      
        this.http.get(url, Options).subscribe((result: any) => {
          // console.log(result);
          if (result.data) {
            resolve(result.data);
          } else if(result.secuencia) {
            resolve(result);
            } else {
              resolve(false);
            }
          // }
        },
        (error) => {
          // console.log(error);
          resolve(error.error);
        }
        );
    });
  }

  getSimple(url:any){
    return new Promise((resolve)=>{
        this.http.get(this.getUrlBaseTaller()+url).subscribe(data =>{
          resolve(data);
        })
    })
  }
  getPlaneador(url:any){
    return this.http.get(this.getUrlBaseTaller()+url)
            .pipe(
                map((resp:any)=>{
                  return resp.map((pla:any) => ({
                    cliente: pla.cliente, 
                    estado_id:pla.estado_id, 
                    estado:pla.estado,
                    fecha:pla.fecha,
                    hora:pla.hora,
                    id:pla.id,
                    no:pla.no,
                    prioridad:pla.prioridad,
                    tecnico:pla.tecnico[0].tecnico,
                    atributo: pla.atributo,
                    atrs: pla.atributo[0].valor,
                    atrs1: pla.atributo[1].valor,
                    completa:pla.cliente+' '+pla.no+' '+pla.tecnico[0].tecnico+' '+pla.atributo[0].valor+' '+pla.atributo[1].valor
                  }))    
                })                
                 );
  }
  getSimpleCommon(url:any){
    return new Promise((resolve)=>{
        this.http.get(this.getUrlBaseCommonSINCORS()+url).subscribe(data =>{
          resolve(data);
        })
    })
  }

  // ===================================== METODO GET VEHÍCULO =======================================
  getCliente( ci:string){
    return new Promise((resolve)=>{
      this.http.get( this.getUrlBaseCommonSINCORS()+this.urlClient+ci ).subscribe(data=>{
        resolve(data);

      })
    })
  }

  // ======================================== PAGINA REPORTE ==========================================

  getReporte(fi:any, ff:any, id:any){
    return new Promise((resolve)=>{
      this.http.get(this.urlTalleres+"/orden_abierta/all?desde="+fi+"&hasta="+ff+"&e="+id).subscribe(data=>{
        resolve(data);
      })
    })

  }
  getReporte2(fi:any, ff:any, id:any, i:any):Observable<any[]>{
    return this.http.get<any[]>(this.urlTalleres+"/orden_abierta/all?desde="+fi+"&hasta="+ff+"&e="+id);
  }


  getURLDATA(fi:any, ff:any, id:any){
   return this.urlTalleres+"orden_abierta/all?desde="+fi+"&hasta="+ff+"&e="+id+"&format=json"
  }


// ======================== SEND WHATSAPP ==========================
sendWhatsApp(id:any, tipo:any){
  return new Promise((resolve)=>{
return this.http.get(this.getUrlBaseTaller()+'hacer_pdf/enviar_wa?oa_id='+id+'&tipo='+tipo).subscribe((data:any)=>{
  resolve(data);
})
  })
}




// ================================================================================

enviarCorreo(id:any, tipo:any){
  return new Promise((resolve)=>{
    return this.http.get(this.getUrlBaseTaller()+'hacer_pdf/send?oa_id='+id+'&tipo='+tipo).subscribe((data:any)=>{

      resolve(data);
    })
})
}

get(contenido:any){
  return new Promise((resolve)=>{
    this.http.get(this.getUrlBaseTaller()+contenido).subscribe(data=>{
      resolve(data);
    })
  })
}

  // ====================================== OBTENER POR ID ===========================================


  getForID( url:string, id:string){
    return new Promise ((resolve)=>{
      this.http.get(this.getUrlBaseTaller()+url+'/by_id?id='+id).subscribe(data=>{
        resolve(data);

        // console.log("url por ID = ", this.urlTalleres+url+'/oneByID?id='+id);

      })
    })
  }
  getForIDOrdenAbierta( url:string, id:string){
    return new Promise ((resolve)=>{
      this.http.get(this.getUrlBaseTaller()+url+'/by_id_edit?id='+id).subscribe(data=>{
        resolve(data);
      })
    })
  }


  // ====================================== METODO POST ==================================================


  postALL(form:any, url:string){
    return this.http.post(this.getUrlBaseTaller()+url+'/insert', form);
  }
  postG1(url:string,form:any ){
    console.log(this.getUrlBaseTallerSINCORS1()+url);
    
    return this.http.post(this.getUrlBaseTallerSINCORS1()+url, form);
  }
  postG( url:string, form:any){
    return this.http.post(this.getUrlBaseTaller()+url, form);
  }

  // POST GENERAL
  postAL(form:any, url:string){
    // console.log(this.getUrlBaseTaller()+url);
    
    return this.http.post(this.getUrlBaseTaller()+url, form);
  }
  postALCommon(JSON:any, url:string){
    return this.http.post(this.getUrlBaseCommon()+url, JSON);
  }


  postPS(form:any, url:string, id:any){

    return this.http.post(this.getUrlBaseTaller()+url+'/add_prefactura/id/'+id, form);

  }

  // ======================================== ENVIAR CORREO ============================================
//  postMail(JSON:any){
//    return this.http.post(this.urlCorreo, JSON);
//  }

 postFacturar(JSON:any){
//  return this.http.post(this.urlCors+"https://sofpymes.com/demotalleres/common/movil/insert_factura_o_prefactura", JSON);
 return this.http.post( this.getUrlBaseCommon()+'insert_factura_o_prefactura', JSON);
 }

//  ========================================== MODIFICAR ESTADO ORDEN ABIERTA ==================================

// postCambiarEstadoOrden(form:any, id:any){
//   return this.http.post(this.urlCambiarEstadoOrden+id, form);
// }

  // ====================================== METODO PUT ==================================================

  putALL(form:any, url:string, id:string){
    return this.http.post(this.getUrlBaseTaller()+url+'/update_by_id/id/'+id, form);
  }

    // =========================================== HABILITAR ==================================================

    enable(form: any, url:string,id: string, ){
      let Options ={
        headers: new HttpHeaders({
          'Content-type': 'application/json'
        }),
        body:form
      }
      return this.http.get(this.getUrlBaseTaller()+url+'/enable?id='+id, Options)
    }


      // ====================================== DESHABILITAR ==================================================

  // disabled(form: any,url:string, id:string){
  //   let Options ={
  //     headers: new HttpHeaders({
  //       'Content-type': 'application/json'
  //     }),
  //     body:form
  //   }
  //   return this.http.get(this.urlTalleres+url+'/delete?id='+id, Options)
  // }

  anularOrden(url:string, id:string){
    return this.http.get(this.getUrlBaseTaller()+url+'/delete_id?id='+id)
  }

  disabled2(form: any,url:string, id:string){
    let Options ={
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      body:form
    }
    return this.http.get(this.getUrlBaseTaller()+url+'/disable?id='+id, Options)
  }

}
