import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { AllServiceService } from 'src/app/services/all-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { productoWORK } from '../../Modelos/arregloItemP.model';
import { combineLatest } from 'rxjs';

// declare function arregloAlias(i: any): any;
declare function abrirModalCerrarOrden(): any;
declare function getStock(i: any): any;
// declare function getPrecioItem(i: any): any;
// declare function SelectDefecto(): any;

@Component({
  selector: 'app-planeador-detalle',
  templateUrl: './planeador-detalle.component.html',
  styleUrls: ['./planeador-detalle.component.scss'],
})
export class PlaneadorDetalleComponent implements OnInit {
  @Input('elements2') elements2: any;
  @Input('tamPyS') tamPyS: any;
  @Input('total') total: any;
  @Input('banderaCard') banderaCard: any;
  @Input('pedidoProductos') pedidoProductos: any;
  @Input('pedidoTecnicos') pedidoTecnicos: any;
  @Input('informacionOrden') informacionOrden: any;
  @Input('banderaFacturar') banderaFacturar: any;
  @Input('banderaFacturarServicio') banderaFacturarServicio: any;
  @Input('banderaFacturarProducto') banderaFacturarProducto: any;
  @Input('banderaPrefactura') banderaPrefactura: any;
  @Input('banderaCerrarCaso') banderaCerrarCaso: any;
  @Input('banderaBusqueda') banderaBusqueda: any;
  @Input('banderaAcciones') banderaAcciones: any;
  @Input('tieneS') tieneS: any;
  @Input('tieneP') tieneP: any;
  @Input('facturadoS') facturadoS: any;
  @Input('facturadoP') facturadoP: any;

  //IVA
  @Input('subTotal12') subTotal12: any;
  @Input('subTotalcero') subTotalcero: any;
  @Input('subTotal') subTotal: any;
  @Input('iva12') iva12: any;


  @Output() CDP = new EventEmitter<any>();

  //Tabla
  page = 1;
  pageSize = 10;
  collectionSize: any;
  ps: productoWORK[];

  infProducto: any = [];
  elements3: any = [];
  tecnico: any = [];
  infOrden: any = [];
  productoServicio: any = [];
  productoServicio1: any = [];
  cantidad: any = [];
  previous: string;

  detalle = new Array();

  //User ID
  user_id: any;

  // Valores FORMULARIO
  valoresPrefactura: any = [];
  peticion: any[] = [];
  productos: any = [];
  pedido: any = [];
  datosLocalStorage: any[];

  //Modal
  public modal: any;

  // CAMBIAR CANTIDAD
  nuevaCantidad: any;
  cant: any;
  tecnicoServicio: any = [];
  tecnicoOrden: any = [];
  enviarProducto: any = [];
  position: any;
  idOrden: any;
  productoFormCantidad: any;

  // Información quitar de la prefactura:any;
  idFactura: any;

  url: 'producto';
  url1: 'orden_abierta';

  arregloProductos: any;

  //PDF y WHATSAPP
  nombreEmpresa: any;
  secuencia: any;
  cliente: any;
  direccion: any;
  celular: any;
  observacion: any;
  placa: any;
  marca: any;
  modelo: any;
  fecha: any;
  productosPDF: any;

  //bandera hijo a Padre
  banderaHijoaPadre: any;
  banderaPaginacion: any;

  puntoventa_id: any;
  tecnico_id: any;
  tecnicos: any;
  servicios: any;
  bodega_id: any;

  //TOTAL SERVICIO
  totalS: any;

  //STOCk
  stock=0;
  stockOriginal =0;
  // arregloStock :any =[];
  //VALOR PRODUCTO IVA
  costoProm: any;
  itemPre: any;
  ivaProd: any;
  totalValProd: any;
  precioDefecto: any;
  arregloItemP: any = [];

  //EDICION PRODUCTO SERVICIO

  tecSeleccionado: any;
  tecNombre: any;
  servSelecccionado: any;
  idTecSeleccionado: any;
  idServSeleccionado: any;
  aliasGlobal: any;

  // control stock
  controlStock: any;

  //totalS
  cantS = 0;
  //totalP
  cantP = 0;

  totalServicios: any = [];
  totalProductos: any = [];
  totalServiciosC = 0;
  totalProductosC = 0;
  facturadoServ = false;
  facturadoProd = false;

  puntosVenta:any=[];
  banderaPuntosVenta:any;

  opcionSeleccionado:string ='';
  verSeleccion:string ='';

  banderaFacturarConPunto = false;
  banderaFacturarSinPunto= false;

  // ARREGLO PARA QUE NO FACTURE SI HAY PRODUCTOS EN CERO
  arregloPrecioUnitarioProductosFacturar:any=[];

  @ViewChild('modalSelecionarPC') modalSelecionarPC:
    | TemplateRef<any>
    | undefined;
  @ViewChild('modalElegirPuntoVenta') modalElegirPuntoVenta:
    | TemplateRef<any>
    | undefined;

  constructor(
    private allService: AllServiceService,
    private modalService: NgbModal,
    private _router: Router
  ) {
    (this.datosLocalStorage = []), this.refreshCountries();
  }

  ngOnInit(): void {
    // this.enviarTecnico();
    // this.enviarServicio();
    // this.getControlStock();
    // SelectDefecto();
    // console.log("elements 2", this.elements2);
    this.funcionLocalStorage();
    combineLatest([
      this.allService.getAl('tecnico/todos'),
      this.allService.getAl('producto/activo'),
      this.allService.getAl('/producto/ver_stock')
    ]).subscribe( ([tecnicos,servicios,controlStock])=>{
      this.tecnicos = tecnicos;
      this.servicios = servicios;
      this.controlStock = controlStock
    })

  }

  // enviarTecnico() {
  //   this.allService.getAl('tecnico/todos').then((data) => {
  //     this.tecnicos = data;
  //   });
  // }

  // enviarServicio() {
  //   this.allService.getAl('producto/activo').then((data) => {
  //     this.servicios = data;
  //     // console.log(this.servicios);
  //   });
  // }

  // getControlStock() {
  //   this.allService.getAl('/producto/ver_stock').then((data: any) => {
  //     this.controlStock = data;
  //     // console.log('controlar Stock',this.controlStock);
  //   });
  // }

  refreshCountries() {
    const PRS: productoWORK[] = this.arregloItemP;
    this.collectionSize = PRS.length;
    if (this.collectionSize <= this.pageSize) {
      this.banderaPaginacion = false;
    } else {
      this.banderaPaginacion = true;
    }

    this.ps = PRS.map((blablabla: any, i: number) => ({
      id: i + 1,
      ...blablabla,
    })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

    // console.log('PS',this.ps);
  }

  // ================================= FORMULARIOS ======================================

  formBusquedaN = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(3), Validators.pattern('[a-z A-Z]{3,100}')]),
   
  })
  formBusquedaCU = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(1), Validators.pattern('[0-9]{1,6}')]),
   
  })
  formBusquedaCB = new FormGroup({
    nombre : new FormControl('',[ Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4,20}')]),
   
  })

  formPuntoVenta = new FormGroup({
    puntoventa_id: new FormControl(''),

  })
  // ================================== FORM PRODUCTO-SERVICIO ========================================

  formProductoServicio = new FormGroup({
    cantidad: new FormControl(''),
    // precioPVP: new FormControl(""),
    tecnicoS: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
    alias: new FormControl('', Validators.required),
  });

  get fp() {
    return this.formProductoServicio.controls;
  }

  // ================================== FORM AGREGAR PRODUCTOS ========================================

  formAgregarProductos = new FormGroup({
    producto_id: new FormControl(''),
    productname: new FormControl(''),
    tiposprecio: new FormControl(''),
    cant: new FormControl(''),
    itemprecio: new FormControl(''),
    ivaporcent: new FormControl(''),
    iva: new FormControl(''),
    total: new FormControl(''),
    bodega_id: new FormControl(''),
    esservicio: new FormControl(''),
    costopromedio: new FormControl(''),
    tiposervicio_id: new FormControl(''),
    user_id: new FormControl(''),
    tecnico_id: new FormControl(''),
    puntoventa_id: new FormControl(''),
    alias: new FormControl(),
    // total_itemprecio: new FormControl(),
    // total_iva: new FormControl()
  });

  formCantidad = new FormGroup({
    c: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    nombreT: new FormControl('', Validators.required),
    nombreS: new FormControl('', Validators.required),
    nombreA: new FormControl('', Validators.required),
  });
  formCantidadS = new FormGroup({
    c: new FormControl('', Validators.required),
    p: new FormControl('', Validators.required),
  });

  // ============================ ABRIR MODAL =================================
  abrirModal1(ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent, { size: 'xl' });
  }
  abrirModal(ModalContent: any): void {
    this.modal = this.modalService.open(ModalContent, { centered: true });
  }
  cerrarModal() {
    this.modal.close();
  }
  cerrarModal2() {
    this.modalService.dismissAll();
  }
  cerrarCaso(el: any) {
    this.informacionOrden = el;
    this.elements3 = el;
    // console.log("esto debe enviarse por el Input", this.informacionOrden);
  }

  funcionDatosLocalStorage(){
   
   
  }

  desplegarAlias(i: any) {
    let entradaAlias = document.getElementById('verAlias' + i);
    entradaAlias?.removeAttribute('hidden');

    let iEntradaAlias = document.getElementById('iAA' + i);
    iEntradaAlias?.setAttribute('hidden', '');

    let iEntradaAlias1 = document.getElementById('iAC' + i);
    iEntradaAlias1?.removeAttribute('hidden');
  }
  ocultarAlias(i: any) {
    let entradaAlias = document.getElementById('verAlias' + i);
    entradaAlias?.setAttribute('hidden', '');

    let iac = document.getElementById('iAC' + i);
    iac?.setAttribute('hidden', '');

    let iaa = document.getElementById('iAA' + i);
    iaa?.removeAttribute('hidden');
  }

  arregloAlias(i:any){
    let  x = (document.getElementById('verAlias'+i) as HTMLInputElement).value
    return x; 
  }
  aliasProducto(i: any) {
    let val = this.arregloAlias(i);
    // let val = arregloAlias(i);
    // console.log("alias", val);
    return val;
  }

  buscarProductoServicio(form: any) {
    let nombre = form.nombre;
    this.formBusquedaN.reset();
    // console.log("nombre capturado", nombre);

    if (nombre == '') {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se puede buscar, ¡campo vacio!',
        confirmButtonColor: '#818181',
      });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'Buscando Producto',
        text: 'Se está buscando el producto, espere por favor',
      });
      Swal.showLoading();

      this.allService.getProductoMap(nombre).subscribe((data: any) => {
      // this.allService.getProductosServicios(nombre).then((data: any) => {
        // console.log(data);
        
        if (data.length >= 1) {
          Swal.close();

          this.modal = this.modalService.open(this.modalSelecionarPC, {
            size: 'xl',
          });

          this.productoServicio = data;

          this.precioDefecto = this.informacionOrden[0].default_price;
          // console.log('precio defecto',this.precioDefecto);

          let arr: any = [];
          let arr2: any = [];
          let codigo2: any;
          let esServicio: any;
          let id_producto: any;
          let impuesto_porcent: any;
          let ivaporcent: any;
          let pro_nom: any;
          let precios: any = [];
          let stock: any;
          let ivaval: any;
          let valor: any;
          let valor_mas_iva: any;

          for (let i = 0; i < this.productoServicio.length; i++) {
            this.stock = this.productoServicio[i].stock;
            stock = this.stock;
            codigo2 = this.productoServicio[i].codigo2;
            esServicio = this.productoServicio[i].esServicio;
            id_producto = this.productoServicio[i].id_producto;
            impuesto_porcent = this.productoServicio[i].impuesto_porcent;
            ivaporcent = this.productoServicio[i].ivaporcent;
            pro_nom = this.productoServicio[i].pro_nom;
            precios = this.productoServicio[i].precios;

            for (let j = 0; j < this.productoServicio[i].precios.length; j++) {
              if (
                this.productoServicio[i].precios[j].id_tipo ==
                this.precioDefecto
              ) {
                ivaval = this.productoServicio[i].precios[j].ivaval;
                valor = parseFloat(this.productoServicio[i].precios[j].valor) ;
                valor_mas_iva =
                  this.productoServicio[i].precios[j].valor_mas_iva;
              }
            }

            arr = {
              stock,
              codigo2,
              esServicio,
              id_producto,
              impuesto_porcent,
              ivaporcent,
              pro_nom,
              precios,
              ivaval,
              valor,
              valor_mas_iva,
            };
            arr2.push(arr);
          }

          this.arregloItemP = arr2;
          // console.log('precios', this.arregloItemP);

          this.page = 1;
          this.refreshCountries();

          this.formProductoServicio.setValue({
            cantidad: 1,
            // 'precioPVP':'',
            tecnicoS: this.pedidoTecnicos[0].tys[0].tecnico_id,
            servicio: this.pedidoTecnicos[0].tys[0].servicio_id,
            alias: '',
          });

          for (let k = 0; k < this.arregloItemP.length; k++) {
            this.formProductoServicio.get('precioPVP')?.setValue(k);
          }

          this.tecnico_id = this.pedidoTecnicos[0].tys[0].tecnico_id;
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se encontran productos con el criterio de búsqueda ingresado',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    }
  }
  buscarProductoNombreUnico(form: any) {
    let nombre = form.nombre;
    this.formBusquedaCU.reset();
    // console.log("nombre capturado", nombre);

    if (nombre == '') {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se puede buscar, ¡campo vacio!',
        timer: 6000,
        confirmButtonColor: '#818181',
      });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'Buscando Producto',
        text: 'Se está buscando el producto, espere por favor',
      });
      Swal.showLoading();

      // this.allService.getSimple('producto/search_product_code?search=' + nombre).then((data: any) => {
        this.allService.getProductoMap(nombre).subscribe((data: any) => {

          // console.log('datos buiscador 2', data);

          if (data.length >= 1) {
            Swal.close();

            this.modal = this.modalService.open(this.modalSelecionarPC, {
              size: 'xl',
            });

            this.productoServicio = data;
            // console.log('---', this.productoServicio);

            this.precioDefecto = this.informacionOrden[0].default_price;
            // console.log('precio defecto',this.precioDefecto);

            let arr: any = [];
            let arr2: any = [];
            let codigo2: any;
            let esServicio: any;
            let id_producto: any;
            let impuesto_porcent: any;
            let ivaporcent: any;
            let pro_nom: any;
            let precios: any = [];
            let stock: any;
            let ivaval: any;
            let valor: any;
            let valor_mas_iva: any;

            for (let i = 0; i < this.productoServicio.length; i++) {
              this.stock = this.productoServicio[i].stock;
              stock = this.stock;
              codigo2 = this.productoServicio[i].codigo2;
              esServicio = this.productoServicio[i].esServicio;
              id_producto = this.productoServicio[i].id_producto;
              impuesto_porcent = this.productoServicio[i].impuesto_porcent;
              ivaporcent = this.productoServicio[i].ivaporcent;
              pro_nom = this.productoServicio[i].pro_nom;
              precios = this.productoServicio[i].precios;

              for (
                let j = 0;
                j < this.productoServicio[i].precios.length;
                j++
              ) {
                if (
                  this.productoServicio[i].precios[j].id_tipo ==
                  this.precioDefecto
                ) {
                  ivaval = this.productoServicio[i].precios[j].ivaval;
                  valor = this.productoServicio[i].precios[j].valor;
                  valor_mas_iva =
                    this.productoServicio[i].precios[j].valor_mas_iva;
                }
              }

              arr = {
                stock,
                codigo2,
                esServicio,
                id_producto,
                impuesto_porcent,
                ivaporcent,
                pro_nom,
                precios,
                ivaval,
                valor,
                valor_mas_iva,
              };
              arr2.push(arr);
            }

            this.arregloItemP = arr2;
            // console.log('precios', this.arregloItemP);

            this.page = 1;

            this.refreshCountries();

            this.formProductoServicio.setValue({
              cantidad: 1,
              // 'precioPVP':'',
              tecnicoS: this.pedidoTecnicos[0].tys[0].tecnico_id,
              servicio: this.pedidoTecnicos[0].tys[0].servicio_id,
              alias: '',
            });

            for (let k = 0; k < this.arregloItemP.length; k++) {
              this.formProductoServicio.get('precioPVP')?.setValue(k);
            }

            this.tecnico_id = this.pedidoTecnicos[0].tys[0].tecnico_id;
          } else {
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'No se encontran productos con el criterio de búsqueda ingresado',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
    }
  }
  buscarProductoCodBarras(form: any) {
    let nombre = form.nombre;
    this.formBusquedaCB.reset();
    // console.log("nombre capturado", nombre);

    if (nombre == '') {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se puede buscar, ¡campo vacio!',
        timer: 6000,
        confirmButtonColor: '#818181',
      });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'Buscando Producto',
        text: 'Se está buscando el producto, espere por favor',
      });
      Swal.showLoading();

      this.allService
        .getSimple('producto/search_product_codebar?search=' + nombre)
        .then((data: any) => {
          if (data.rta == true) {
            Swal.close();

            this.modal = this.modalService.open(this.modalSelecionarPC, {
              size: 'xl',
            });

            this.productoServicio = data.data;
            // console.log('---', this.productoServicio);

            this.precioDefecto = this.informacionOrden[0].default_price;
            // console.log('precio defecto',this.precioDefecto);

            let arr: any = [];
            let arr2: any = [];
            let codigo2: any;
            let esServicio: any;
            let id_producto: any;
            let impuesto_porcent: any;
            let ivaporcent: any;
            let pro_nom: any;
            let precios: any = [];
            let stock: any;
            let ivaval: any;
            let valor: any;
            let valor_mas_iva: any;

            for (let i = 0; i < this.productoServicio.length; i++) {
              this.stock = this.productoServicio[i].stockactual;
              stock = this.stock;
              codigo2 = this.productoServicio[i].codigo2;
              esServicio = this.productoServicio[i].esServicio;
              id_producto = this.productoServicio[i].id_producto;
              impuesto_porcent = this.productoServicio[i].impuesto_porcent;
              ivaporcent = this.productoServicio[i].ivaporcent;
              pro_nom = this.productoServicio[i].pro_nom;
              precios = this.productoServicio[i].precios;

              for (
                let j = 0;
                j < this.productoServicio[i].precios.length;
                j++
              ) {
                if (
                  this.productoServicio[i].precios[j].id_tipo ==
                  this.precioDefecto
                ) {
                  ivaval = this.productoServicio[i].precios[j].ivaval;
                  valor = this.productoServicio[i].precios[j].valor;
                  valor_mas_iva =
                    this.productoServicio[i].precios[j].valor_mas_iva;
                }
              }

              arr = {
                stock,
                codigo2,
                esServicio,
                id_producto,
                impuesto_porcent,
                ivaporcent,
                pro_nom,
                precios,
                ivaval,
                valor,
                valor_mas_iva,
              };
              arr2.push(arr);
            }

            this.arregloItemP = arr2;
            // console.log('precios', this.arregloItemP);

            this.page = 1;

            this.refreshCountries();

            this.formProductoServicio.setValue({
              cantidad: 1,
              // 'precioPVP':'',
              tecnicoS: this.pedidoTecnicos[0].tys[0].tecnico_id,
              servicio: this.pedidoTecnicos[0].tys[0].servicio_id,
              alias: '',
            });

            for (let k = 0; k < this.arregloItemP.length; k++) {
              this.formProductoServicio.get('precioPVP')?.setValue(k);
            }

            this.tecnico_id = this.pedidoTecnicos[0].tys[0].tecnico_id;
          } else {
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'No se encontran productos con el criterio de búsqueda ingresado',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
    }
  }

  productoRepetido(idP: any) {
    let tam = this.pedidoProductos[0].productos.length;
    let array = this.pedidoProductos[0].productos;
    let bandera = false;
    let id;
    for (let i = 0; i < tam; i++) {
      id = array[i][0].producto_id;

      if (idP == id) {
        // console.log("producto existe ", idP);
        bandera = true;
      }
    }
    return bandera;
  }
  productoRepetidoSumarCantidad(idP: any) {

    let tam = this.pedidoProductos[0].productos.length;
    let array = this.pedidoProductos[0].productos;
    let bandera = false;
    let id;
    let cant;
    let c;
    for (let i = 0; i < tam; i++) {
      id = array[i][0].producto_id;
      cant = array[i][0].cant;

      if (idP == id) {
        c = cant;
      }
    }
    return c;
  }

  productoRepetidoPosicion(idP: any) {

    let tam = this.pedidoProductos[0].productos.length;
    let array = this.pedidoProductos[0].productos;

    let id;
    let i;
    for (i = 0; i < tam; i++) {
      id = array[i][0].producto_id;
      if (idP == id) {
        idP = i;
      }
    }
    return idP;
  }

  getPrecioItem(i:any){
    let x = (document.getElementById('precioItem'+i) as HTMLInputElement).value  
    let x1 = x.replace(',', '.');    
    return x1;
  }

  getStock(i:any){
    let x = (document.getElementById('stock'+i) as HTMLInputElement).value  
    return x;
}

  agregarProducto1(
    el: any,
    i: any,
    pedPro: any,
    pedT: any,
    form: any,
    esServicio: any
  ) {

    
    let stock = Number( this.getStock(i))
    // let stock = Number( getStock(i))
 
    if (this.controlStock == '1') {
     
      this.stock = stock
      // console.log('stock del producto al agregarlo',stock);
      
      if (stock < form.cantidad && esServicio != '1') {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Stock insuficiente, Stock disponible : '+ stock,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        this.aliasProducto(i);

        this.stock = stock - form.cantidad;

        let tamTec = pedT.length;

        let idTS = form.tecnicoS;
        let arregloTyS = new Array();
        this.infProducto = [el];

        // console.log('EL QUE AGREGO',this.infProducto);

        let producto_id = el.id_producto;
        let esservicio = el.esServicio;
        let productname = el.pro_nom;
        let formPTS = this.formProductoServicio.value;
        let cant = formPTS.cantidad;
        let tiposervicio_id = formPTS.servicio;
        let t_id = formPTS.tecnicoS;
        let tecnico_id = t_id;
        let alias = this.aliasProducto(i);
        let tecnico_apellidos = '';
        let tecnico_nombres = '';
        let tipo = '';
        // =========================== CAMBIO ============================

        let element;
        for (let y = 0; y < tamTec; y++) {
          let id = pedT[y].servicio_id;
          element = pedT[y];

          if (idTS == id) {
            arregloTyS.push(element);
          }
        }

        for (let z = 0; z < this.tecnicos.length; z++) {
          if (t_id == this.tecnicos[z].id) {
            tecnico_apellidos = this.tecnicos[z].apellidos;
            tecnico_nombres = this.tecnicos[z].nombres;
          }
        }

        for (let x = 0; x < this.servicios.length; x++) {
          if (tiposervicio_id == this.servicios[x].id) {
            tipo = this.servicios[x].tipo;
          }
        }

        //BODEGA ID
        const dato = localStorage.getItem('Inflogueo');

        if (dato) {
          this.datosLocalStorage = JSON.parse(dato);
        } else console.log('ERROR');

        let infAcceso = Object.values(this.datosLocalStorage);

        this.bodega_id = infAcceso[2][0].bodega_id;

        let bodega_id = this.bodega_id;
        let ivaporcent = this.infProducto[0].impuesto_porcent;
        let costopromedio: any;
        let itemprecio;
        let iva;
        let total=0;
        let pys;
        let tiposprecio;
      

        if (this.productoRepetido(producto_id) == true) {
          if (this.infProducto[0].esServicio == '1') {
            // alert("DEBE SUMARSE");

            tiposprecio = this.precioDefecto;
            itemprecio = parseFloat(this.getPrecioItem(i)) ;
            // itemprecio = parseFloat(getPrecioItem(i)) ;
            // console.log(itemprecio);
            
            if ((ivaporcent) == 12) {
              iva =  (itemprecio*ivaporcent)/100;
              total = itemprecio + iva
              costopromedio = total *cant;        
            } else if (ivaporcent == 0) { 
              iva = 0;
              total = itemprecio + iva;
              costopromedio = total *cant;
              
            } else if (ivaporcent == 8) {
              iva = (itemprecio*ivaporcent)/100
              total = itemprecio + iva;
              costopromedio = total *cant;           
            }
            costopromedio = total * cant;

            pys = [
              {
                alias,
                bodega_id,
                producto_id,
                esservicio,
                productname,
                cant,
                tiposprecio,
                itemprecio,
                iva,
                total,
                ivaporcent,
                costopromedio,
                tiposervicio_id,
                tecnico_apellidos,
                tecnico_nombres,
                tipo,
                tecnico_id,
                stock
              },
            ];
            pedPro[0].productos.push(pys);
            // console.log("CONTROL DE STOCK SERVICIO REPETIDO", pedPro[0].productos);
            
            let tamPRO = pedPro[0].productos.length;
            // this.totalS = total;
            this.total = 0;
            this.subTotal12 = 0;
            this.subTotalcero = 0;
            this.subTotal = 0;
            this.iva12 = 0;
            for (let j = 0; j < tamPRO; j++) {
              this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
              if(pedPro[0].productos[j][0].ivaporcent == 12){
                this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
                this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
                // console.log("entra");
              }
               if(pedPro[0].productos[j][0].ivaporcent == 0){ 
                this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio)  * parseFloat(pedPro[0].productos[j][0].cant)
                // console.log(this.subTotalcero);  
              }
            }
            this.subTotal = this.subTotalcero + this.subTotal12;
            costopromedio = total * cant;

            this.stockOriginal = stock;
            // total = getPrecioItem(i);

            // if (ivaporcent == '12') {
            //   itemprecio = total / 1.12;
            //   iva = total - itemprecio;
            // } else if (ivaporcent == '0') {
            //   itemprecio = total;
            //   iva = 0;
            // } else if (ivaporcent == '0') {
            //   iva = total * 0.08;
            //   itemprecio = total - iva;
            // }
            // this.totalS = total;

            // // }
            // this.totalS = total;
            // costopromedio = total * cant;
            // pys = [
            //   {
            //     alias,
            //     bodega_id,
            //     producto_id,
            //     esservicio,
            //     productname,
            //     cant,
            //     tiposprecio,
            //     itemprecio,
            //     iva,
            //     total,
            //     ivaporcent,
            //     costopromedio,
            //     tiposervicio_id,
            //     tecnico_apellidos,
            //     tecnico_nombres,
            //     tipo,
            //     tecnico_id,
            //   },
            // ];
            // pedPro[0].productos.push(pys);
            // console.log(pedPro);
          } else {
           
            let val = parseFloat(
              this.productoRepetidoSumarCantidad(producto_id)
            );
            let posicion = this.productoRepetidoPosicion(producto_id);
            this.nuevaCantidad = parseFloat(formPTS.cantidad);

            cant = parseFloat(this.nuevaCantidad + val);
              // console.log("cant",cant);
              // console.log('stock producto repetido', this.stock);
              this.stock = stock - cant;
              // console.log('stock actualizado cuando se repite', this.stock);
              
            this.totalS = cant * this.totalS;
            // console.log('total',this.totalS  );
            // if (cant > this.stock + 1 && esservicio == '0') {
            if (this.stock+1 <=0 && esservicio == '0') {
              Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Stock insuficiente, Stock disponible : '+ stock,
                timer: 2000,
                showConfirmButton: false,
              });
              //   // alert("Stock insuficiente")
            } else {
              this.quitarProducto(posicion, pedPro);

              tiposprecio = this.precioDefecto;
              itemprecio = parseFloat(this.getPrecioItem(i)) ;
              // itemprecio = parseFloat(getPrecioItem(i)) ;
              // console.log(itemprecio);
              
              if ((ivaporcent) == 12) {
                iva =  (itemprecio*ivaporcent)/100;
                total = itemprecio + iva
                costopromedio = total *cant;        
              } else if (ivaporcent == 0) { 
                iva = 0;
                total = itemprecio + iva;
                costopromedio = total *cant;
                
              } else if (ivaporcent == 8) {
                iva = (itemprecio*ivaporcent)/100
                total = itemprecio + iva;
                costopromedio = total *cant;           
              }
              costopromedio = total * cant;
  
              pys = [
                {
                  alias,
                  bodega_id,
                  producto_id,
                  esservicio,
                  productname,
                  cant,
                  tiposprecio,
                  itemprecio,
                  iva,
                  total,
                  ivaporcent,
                  costopromedio,
                  tiposervicio_id,
                  tecnico_apellidos,
                  tecnico_nombres,
                  tipo,
                  tecnico_id,
                  stock
                },
              ];
              pedPro[0].productos.push(pys);
              // console.log("CONTROL DE STOCK prod primera vez", pedPro[0].productos);
            
              let tamPRO = pedPro[0].productos.length;
              this.total = 0;
              this.subTotal12 = 0;
              this.subTotalcero = 0;
              this.subTotal = 0;
              this.iva12 = 0;
              for (let j = 0; j < tamPRO; j++) {
                this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
                if(pedPro[0].productos[j][0].ivaporcent == 12){
                  this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
                  this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
                  // console.log("entra");
                }
                 if(pedPro[0].productos[j][0].ivaporcent == 0){ 
                  this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio)  * parseFloat(pedPro[0].productos[j][0].cant)
                  // console.log(this.subTotalcero);  
                }
              }
              this.subTotal = this.subTotalcero + this.subTotal12;
              costopromedio = total * cant;
              this.stockOriginal = stock;
              // total = getPrecioItem(i);
              // if (ivaporcent == '12') {
              //   itemprecio = total / 1.12;
              //   iva = total - itemprecio;
              // } else if (ivaporcent == '0') {
              //   itemprecio = total;
              //   iva = 0;
              // } else if (ivaporcent == '0') {
              //   iva = total * 0.08;
              //   itemprecio = total - iva;
              // }
              // this.totalS = total;

              // this.totalS = total;
              // costopromedio = total * cant;
              // pys = [
              //   {
              //     alias,
              //     bodega_id,
              //     producto_id,
              //     esservicio,
              //     productname,
              //     cant,
              //     tiposprecio,
              //     itemprecio,
              //     iva,
              //     total,
              //     ivaporcent,
              //     costopromedio,
              //     tiposervicio_id,
              //     tecnico_apellidos,
              //     tecnico_nombres,
              //     tipo,
              //     tecnico_id,
              //   },
              // ];
              // pedPro[0].productos.push(pys);
              // console.log(pedPro);
              // console.log("A==============", this.total);
              // }
            }
          }
        } else {
          this.stock = Number( this.getStock(i))
          // this.stock = getStock(i);
          // console.log(this.stock);
          tiposprecio = this.precioDefecto;
          itemprecio = parseFloat(this.getPrecioItem(i)) ;
          // itemprecio = parseFloat(getPrecioItem(i)) ;
          // console.log(itemprecio);
          
          if ((ivaporcent) == 12) {
            iva =  (itemprecio*ivaporcent)/100;
            total = itemprecio + iva
            costopromedio = total *cant;        
          } else if (ivaporcent == 0) { 
            iva = 0;
            total = itemprecio + iva;
            costopromedio = total *cant;
            
          } else if (ivaporcent == 8) {
            iva = (itemprecio*ivaporcent)/100
            total = itemprecio + iva;
            costopromedio = total *cant;           
          }
          costopromedio = total * cant;

          pys = [
            {
              alias,
              bodega_id,
              producto_id,
              esservicio,
              productname,
              cant,
              tiposprecio,
              itemprecio,
              iva,
              total,
              ivaporcent,
              costopromedio,
              tiposervicio_id,
              tecnico_apellidos,
              tecnico_nombres,
              tipo,
              tecnico_id,
              stock
            },
          ];
          pedPro[0].productos.push(pys);
          // console.log("CONTROL DE STOCK  pys agregado primera vez",  pedPro[0].productos);
          this.stock = stock - cant;
          // console.log('stock actualizado', this.stock);
          
          let tamPRO = pedPro[0].productos.length;
          this.total = 0;
          this.subTotal12 = 0;
          this.subTotalcero = 0;
          this.subTotal = 0;
          this.iva12 = 0;
          for (let j = 0; j < tamPRO; j++) {
            this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
            if(pedPro[0].productos[j][0].ivaporcent == 12){
              this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
              this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
              // console.log("entra");
            }
             if(pedPro[0].productos[j][0].ivaporcent == 0){ 
              this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio)  * parseFloat(pedPro[0].productos[j][0].cant)
              // console.log(this.subTotalcero);  
            }
          }
          this.subTotal = this.subTotalcero + this.subTotal12;
          costopromedio = total * cant;
          this.stockOriginal = stock;
          // let arr =[];


        }
        //   tiposprecio = this.precioDefecto;
        //   let t = Number(getPrecioItem(i));
        //   total = t;
        //   // console.log("total que viene", total);
        //   if (ivaporcent == '12') {
        //     itemprecio = total / 1.12;
        //     iva = total - itemprecio;
        //   } else if (ivaporcent == '0') {
        //     itemprecio = total;
        //     iva = 0;
        //   } else if (ivaporcent == '0') {
        //     iva = total * 0.08;
        //     itemprecio = total - iva;
        //   }
        //   this.totalS = total;
        //   costopromedio = total * cant;
        //   pys = [
        //     {
        //       alias,
        //       bodega_id,
        //       producto_id,
        //       esservicio,
        //       productname,
        //       cant,
        //       tiposprecio,
        //       itemprecio,
        //       iva,
        //       total,
        //       ivaporcent,
        //       costopromedio,
        //       tiposervicio_id,
        //       tecnico_apellidos,
        //       tecnico_nombres,
        //       tipo,
        //       tecnico_id,
        //     },
        //   ];
        //   pedPro[0].productos.push(pys);

        //   // console.log(pedPro);
        // }

        // this.formProductoServicio.setValue({
        //   cantidad: 1,
        //   //  'precioPVP':'',
        //   tecnicoS: this.pedidoTecnicos[0].tys[0].tecnico_id,
        //   servicio: this.pedidoTecnicos[0].tys[0].servicio_id,
        //   alias: '',
        // });
        // let tamPRO = pedPro[0].productos.length;
        // this.total = 0;
        // for (let j = 0; j < tamPRO; j++) {
        //   this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
        // }
      }

      // ==================================SIN CONTROL STOCK ================================
    } else if (this.controlStock == '0') {
      this.aliasProducto(i);
      let tamTec = pedT.length;

      let idTS = form.tecnicoS;
      let arregloTyS = new Array();
      this.infProducto = [el];
      // console.log('Esto que es',this.infProducto);

      let producto_id = el.id_producto;
      let esservicio = el.esServicio;
      let productname = el.pro_nom;
      let formPTS = this.formProductoServicio.value;
      let cant = formPTS.cantidad;
      let tiposervicio_id = formPTS.servicio;
      let t_id = formPTS.tecnicoS;
      let tecnico_id = t_id;
      let alias = this.aliasProducto(i);
      let tecnico_apellidos = '';
      let tecnico_nombres = '';
      let tipo = '';
      // =========================== CAMBIO ============================

      let element;
      for (let y = 0; y < tamTec; y++) {
        let id = pedT[y].servicio_id;
        element = pedT[y];

        if (idTS == id) {
          arregloTyS.push(element);
        }
      }

      for (let z = 0; z < this.tecnicos.length; z++) {
        if (t_id == this.tecnicos[z].id) {
          tecnico_apellidos = this.tecnicos[z].apellidos;
          tecnico_nombres = this.tecnicos[z].nombres;
        }
      }

      for (let x = 0; x < this.servicios.length; x++) {
        if (tiposervicio_id == this.servicios[x].id) {
          tipo = this.servicios[x].tipo;
        }
      }

      //BODEGA ID
      const dato = localStorage.getItem('Inflogueo');

      if (dato) {
        this.datosLocalStorage = JSON.parse(dato);
      } else console.log('ERROR');

      let infAcceso = Object.values(this.datosLocalStorage);
      // console.log("**********",infAcceso);

      this.bodega_id = infAcceso[2][0].bodega_id;
      let bodega_id = this.bodega_id;
      // let ivaporcent = this.infProducto[0].impuesto_porcent;
      let ivaporcent = parseInt(this.infProducto[0].impuesto_porcent);
      let costopromedio: any;
      let itemprecio :any;
      let iva:any;
      let total_iva;
      let total_itemprecio:any;
      let total;
      let pys;
      let tiposprecio;

      if (this.productoRepetido(producto_id) == true) {
        if (this.infProducto[0].esServicio == '1') {
          tiposprecio = this.precioDefecto;
          tiposprecio = this.precioDefecto;
          itemprecio = parseFloat(this.getPrecioItem(i)) ;
          // itemprecio = parseFloat(getPrecioItem(i)) ;
          // console.log(itemprecio);
          
          if ((ivaporcent) == 12) {
            iva =  (itemprecio*ivaporcent)/100;
            total = itemprecio + iva
            costopromedio = total *cant;        
          } else if (ivaporcent == 0) { 
            iva = 0;
            total = itemprecio + iva;
            costopromedio = total *cant;
            
          } else if (ivaporcent == 8) {
            iva = (itemprecio*ivaporcent)/100
            total = itemprecio + iva;
            costopromedio = total *cant;           
          }
          costopromedio = total * cant;
          total_iva = iva * cant;
          total_itemprecio = itemprecio * cant;
          pys = [
            {
              alias,
              bodega_id,
              producto_id,
              esservicio,
              productname,
              cant,
              tiposprecio,
              itemprecio,
              iva,
              total_iva,
              total_itemprecio,
              total,
              ivaporcent,
              costopromedio,
              tiposervicio_id,
              tecnico_apellidos,
              tecnico_nombres,
              tipo,
              tecnico_id,
            },
          ];
          pedPro[0].productos.push(pys);
          let tamPRO = pedPro[0].productos.length;
          this.totalS = total;
          this.subTotal12 = 0;
          this.subTotalcero = 0;
          this.subTotal = 0;
          this.iva12 = 0;
          for (let j = 0; j < tamPRO; j++) {
            // this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
            if(pedPro[0].productos[j][0].ivaporcent == 12){
              this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
              this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
              // console.log("entra");
            }
             if(pedPro[0].productos[j][0].ivaporcent == 0){ 
              this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio)  * parseFloat(pedPro[0].productos[j][0].cant)
              // console.log(this.subTotalcero);  
            }
          }
          this.subTotal = this.subTotalcero + this.subTotal12;
          costopromedio = total * cant;
          total_iva = iva * cant;
          total_itemprecio = itemprecio * cant;

          // console.log(" 1 ==================>", pedPro);
        } else {
          let val = parseFloat(this.productoRepetidoSumarCantidad(producto_id));
          let posicion = this.productoRepetidoPosicion(producto_id);
          this.nuevaCantidad = parseFloat(formPTS.cantidad);

          cant = parseFloat(this.nuevaCantidad + val);

          this.totalS = cant * this.totalS;

          this.quitarProducto(posicion, pedPro);

          tiposprecio = this.precioDefecto;
          itemprecio = parseFloat(this.getPrecioItem(i)) ;
          // itemprecio = parseFloat(getPrecioItem(i)) ;
          // console.log(itemprecio);
          
          if ((ivaporcent) == 12) {
            // console.log("entra");
            
            iva =  (itemprecio*ivaporcent)/100;
            // console.log(iva);
            
            total = itemprecio + iva
            costopromedio = total *cant;
            // console.log(total);
            
          } else if (ivaporcent == 0) { 
            // console.log("entra 2");
            
            iva = 0;
            total = itemprecio + iva;
            costopromedio = total *cant;
            
          } else if (ivaporcent == 8) {
            iva = (itemprecio*ivaporcent)/100
            total = itemprecio + iva;
            costopromedio = total *cant;
            
          }

          
        // itemprecio = parseFloat(getPrecioItem(i)) ;
        //   if (ivaporcent == 12) {
          
        //     iva =  (itemprecio*ivaporcent)/100;
        //     total = itemprecio + iva
        //   } else if (ivaporcent == 0) { 
        //     iva = 0;
        //     itemprecio = total;
        //   } else if (ivaporcent == 8) {
        //     iva = (itemprecio*ivaporcent)/100
        //     total = itemprecio - iva;
            
        //   }
        //   this.totalS = total;
        //   costopromedio = total * cant;
        //   total_iva = iva * cant;
        //   total_itemprecio = itemprecio * cant;

          pys = [
            {
              alias,
              bodega_id,
              producto_id,
              esservicio,
              productname,
              cant,
              tiposprecio,
              itemprecio,
              iva,
              total_iva,
              total_itemprecio,
              total,
              ivaporcent,
              costopromedio,
              tiposervicio_id,
              tecnico_apellidos,
              tecnico_nombres,
              tipo,
              tecnico_id,
            },
          ];
          pedPro[0].productos.push(pys);
          let tamPRO = pedPro[0].productos.length;
          this.totalS = total;
          this.subTotal12 = 0;
          this.subTotalcero = 0;
          this.subTotal = 0;
          this.iva12 = 0;
          for (let j = 0; j < tamPRO; j++) {
            // this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
            if(pedPro[0].productos[j][0].ivaporcent == 12){
              this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
              this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
              // console.log("entra");
            }
             if(pedPro[0].productos[j][0].ivaporcent == 0){ 
              this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio)  * parseFloat(pedPro[0].productos[j][0].cant)
              // console.log(this.subTotalcero);  
            }
          }
          this.subTotal = this.subTotalcero + this.subTotal12;
          costopromedio = total * cant;
          total_iva = iva * cant;
          total_itemprecio = itemprecio * cant;

          // console.log("2 ==================>", pedPro);
        }
      } else {
        let tp: any;

        tiposprecio = this.precioDefecto;
        let t = Number(this.getPrecioItem(i));
        total = t;

        itemprecio = parseFloat(this.getPrecioItem(i)) ;
        // itemprecio = parseFloat(getPrecioItem(i)) ;
        // console.log(itemprecio);
        
        if (ivaporcent == 12) {
        
          iva =  (itemprecio*ivaporcent)/100;
          // console.log(iva);
          
          total = itemprecio + iva
          // console.log(total);
          
        } else if (ivaporcent == 0) { 
          iva = 0;
          itemprecio = total;
        } else if (ivaporcent == 8) {
          iva = (itemprecio*ivaporcent)/100
          total = itemprecio - iva;
          
        }
        this.totalS = total;
        costopromedio = total * cant;
        total_iva = iva * cant;
        total_itemprecio = itemprecio * cant;
        pys = [
          {
            alias,
            bodega_id,
            producto_id,
            esservicio,
            productname,
            cant,
            tiposprecio,
            itemprecio,
            iva,
            total_iva,
            total_itemprecio,
            total,
            ivaporcent,
            costopromedio,
            tiposervicio_id,
            tecnico_apellidos,
            tecnico_nombres,
            tipo,
            tecnico_id,
          },
        ];
        pedPro[0].productos.push(pys);

        // console.log("3 ==================>", pedPro);
      }

      this.formProductoServicio.setValue({
        cantidad: 1,
        //  'precioPVP':'',
        tecnicoS: this.pedidoTecnicos[0].tys[0].tecnico_id,
        servicio: this.pedidoTecnicos[0].tys[0].servicio_id,
        alias: '',
      });
      let tamPRO = pedPro[0].productos.length;
      this.total = 0;
      this.subTotal12 = 0;
      this.subTotalcero = 0;
      this.subTotal = 0;
      this.iva12 = 0;
      for (let j = 0; j < tamPRO; j++) {
        this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
        if(pedPro[0].productos[j][0].ivaporcent == 12){
          this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
          this.iva12 += parseFloat(pedPro[0].productos[j][0].iva)  * parseFloat(pedPro[0].productos[j][0].cant);
          // console.log("entra");
        }
         if(pedPro[0].productos[j][0].ivaporcent == 0){ 
          this.subTotalcero += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
          // console.log(this.subTotalcero);  
        }
      }
      this.subTotal = this.subTotalcero + this.subTotal12;
      // console.log(this.subTotal);
      
    }
  }

  quitarProducto(idE: any, pedPro: any) {
    // console.log("posición que me llega =>", idE);
    let arreglo = pedPro[0].productos;
    //  console.log(" -- ARREGLO ---",arreglo);
    let arregloPedido: any = [];
    for (let i = 0; i < pedPro[0].productos.length; i++) {
      // console.log('id son => ', i);

      if (i != idE) {
        arregloPedido.push(arreglo[i]);

        // console.log('id que continúan son = > ', i);
      }
    }
    pedPro[0].productos = arregloPedido;

    // console.log('resultado', pedPro);
    let tamPRO = pedPro[0].productos.length;
    this.total = 0;
    this.subTotal12 = 0;
    this.subTotalcero = 0;
    this.subTotal = 0;
    this.iva12 = 0;
    for (let j = 0; j < tamPRO; j++) {
      this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
      if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 12){
        this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
        this.iva12 += (parseFloat(pedPro[0].productos[j][0].iva)* parseFloat(pedPro[0].productos[j][0].cant))
        // console.log("entra");
      }
       if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 0){ 
        this.subTotalcero += (parseFloat(pedPro[0].productos[j][0].itemprecio)* parseFloat(pedPro[0].productos[j][0].cant))
        // console.log(this.subTotalcero);  
      }
    }
    this.subTotal = this.subTotal12+ this.subTotalcero;
    // for (let j = 0; j < tamPRO; j++) {
    //   this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
    // }


    if (tamPRO == 0) {
      this.cantP = 0;
      this.cantS = 0;
      this.banderaFacturar = false;
      this.banderaFacturarServicio = false;
      this.banderaFacturarProducto = false;
    } else {

    }
  }

  enviarPedido(pedPro: any, posicion: any) {
    // console.log(posicion);  

    
    let arr = pedPro[0].productos;
    let posicionArreglo = arr[posicion];
    this.productoFormCantidad = posicionArreglo;
    this.position = posicion;
    this.idOrden = posicionArreglo[0].producto_id;
    this.enviarProducto = posicionArreglo[0].cant;

    this.aliasGlobal = this.productoFormCantidad[0].alias;
    this.tecSeleccionado =
      this.productoFormCantidad[0].tecnico_nombres +
      ' ' +
      this.productoFormCantidad[0].tecnico_apellidos;
    this.tecNombre = this.productoFormCantidad[0].tecnico_nombres;
    this.idTecSeleccionado = this.productoFormCantidad[0].tecnico_id;
    this.servSelecccionado = this.productoFormCantidad[0].tipo;
    this.idServSeleccionado = this.productoFormCantidad[0].tiposervicio_id;

    this.formCantidad.setValue({
      c: this.productoFormCantidad[0].cant,
      // 'precio': this.decimalP.transform(this.productoFormCantidad[0].total,'.0-2')
      precio: this.productoFormCantidad[0].itemprecio,
      nombreT: this.idTecSeleccionado,
      nombreS: this.idServSeleccionado,
      nombreA: this.productoFormCantidad[0].alias,
    });
    this.stock =posicionArreglo[0].stock;
    // console.log(this.stock);
  }
  modificarCantidad(form: any, pedPro: any) {
    if (this.controlStock == '1') {
      // console.log('stock cuando modifico cantidad',this.stock);
      let c = form.c;
      // console.log('cant #',c);
          // this.stock = this.stockOriginal;
    // console.log(this.stock);
      // let stock = getStock(i);
      // this.stock = stock

     
      
      let precio = parseFloat(form.precio);
      // console.log('$',precio);
      

      let arreglo = pedPro[0].productos[this.position][0];
      let producto_id = this.idOrden;
      let esservicio = arreglo.esservicio;
      let productname = arreglo.productname;
      let cant = c;
      let tiposprecio = arreglo.tiposprecio;
      let bodega_id = arreglo.bodega_id;
      let ivaporcent = arreglo.ivaporcent;
      let tecnico_id = form.nombreT;
      let iva=0;
      let total=0;
      let costopromedio =0;
      let stock = arreglo.stock
      // let total = precio;
      // let itemprecio = total /1.12;
      // let iva = total-itemprecio;
    
    

      let itemprecio = precio ;
      // console.log(itemprecio);
      
      if (ivaporcent == 12) {
      
        iva =  (itemprecio*ivaporcent)/100;
        // console.log(iva);
        
        total = itemprecio + iva
        // console.log(total);
        
      } else if (ivaporcent == 0) { 
        iva = 0;
        total = itemprecio;
      } else if (ivaporcent == 8) {
        iva = (itemprecio*ivaporcent)/100
        total = itemprecio - iva;
        
      }
      this.totalS = total;
      costopromedio = total * cant;
     
      let pys;

      let tecnico_apellidos: any;
      let tecnico_nombres: any;
      let tipo = '';

      // ==== OBTENER TECNICO =======
      for (let y = 0; y < this.tecnicos.length; y++) {
        if (form.nombreT == this.tecnicos[y].id) {
          tecnico_apellidos = this.tecnicos[y].apellidos;
          tecnico_nombres = this.tecnicos[y].nombres;
        }
      }
      // ==== OBTENER SERVICIO =======
      for (let z = 0; z < this.servicios.length; z++) {
        if (form.nombreS == this.servicios[z].id) {
          tipo = this.servicios[z].tipo;
        }
      }
      let tiposervicio_id = form.nombreS;

      let alias = form.nombreA;

      if (cant > (this.stock)  && esservicio == '0') {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Stock insuficiente, Stock disponible : '+ stock,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        this.quitarProducto(this.position, pedPro);
        pys = [
          {
            alias,
            bodega_id,
            producto_id,
            esservicio,
            productname,
            cant,
            tiposprecio,
            itemprecio,
            iva,
            total,
            ivaporcent,
            costopromedio,
            tecnico_apellidos,
            tecnico_nombres,
            tipo,
            tiposervicio_id,
            tecnico_id,
            stock
          },
        ];
        pedPro[0].productos.push(pys);

        // console.log('arreglo modificado', pedPro);
        let tamPRO = pedPro[0].productos.length;
        this.total = 0;
        this.subTotal12 = 0;
        this.subTotalcero = 0;
        this.subTotal = 0;
        this.iva12 = 0;
        for (let j = 0; j < tamPRO; j++) {
          this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
          if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 12){
            this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
            this.iva12 += (parseFloat(pedPro[0].productos[j][0].iva)* parseFloat(pedPro[0].productos[j][0].cant))
            // console.log("entra");
          }
           if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 0){ 
            this.subTotalcero += (parseFloat(pedPro[0].productos[j][0].itemprecio)* parseFloat(pedPro[0].productos[j][0].cant))
            // console.log(this.subTotalcero);  
          }
        }
        this.subTotal = this.subTotal12+ this.subTotalcero;
        // let tamPRO = pedPro[0].productos.length;
        // this.total = 0;
        // for (let j = 0; j < tamPRO; j++) {
        //   this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
        // }
        this.cerrarModal();
        // this.listarTodos();
        this.formCantidad.reset();
      }
    }
    // ==================CONTROL STOCk NO ===========================
    else if (this.controlStock == '0') {
      // console.log("lo que trae el form", form);

      let c = form.c;
      let precio = parseFloat(form.precio);

      let arreglo = pedPro[0].productos[this.position][0];
      let producto_id = this.idOrden;
      let esservicio = arreglo.esservicio;
      let productname = arreglo.productname;
      let cant = c;
      let tiposprecio = arreglo.tiposprecio;
      let bodega_id = arreglo.bodega_id;
      let ivaporcent = arreglo.ivaporcent;
      let tecnico_id = form.nombreT;
      // let total = precio;
      let iva = (precio * ivaporcent) / 100;
      let itemprecio = precio;
      let total = itemprecio + iva;
      let pys;
      let costopromedio = cant * total;
      let tecnico_apellidos: any;
      let tecnico_nombres: any;
      let tipo = '';
      let total_itemprecio = itemprecio * cant;
      let total_iva =  iva *cant;
      // ==== OBTENER TECNICO =======
      for (let y = 0; y < this.tecnicos.length; y++) {
        if (form.nombreT == this.tecnicos[y].id) {
          tecnico_apellidos = this.tecnicos[y].apellidos;
          tecnico_nombres = this.tecnicos[y].nombres;
        }
      }

      // ==== OBTENER SERVICIO =======
      for (let z = 0; z < this.servicios.length; z++) {
        if (form.nombreS == this.servicios[z].id) {
          tipo = this.servicios[z].tipo;
        }
      }
      let tiposervicio_id = form.nombreS;

      let alias = form.nombreA;
      this.quitarProducto(this.position, pedPro);
      pys = [
        {
          alias,
          bodega_id,
          producto_id,
          esservicio,
          productname,
          cant,
          tiposprecio,
          itemprecio,
          total_itemprecio,
          iva,
          total_iva,
          total,
          ivaporcent,
          costopromedio,
          tecnico_apellidos,
          tecnico_nombres,
          tipo,
          tiposervicio_id,
          tecnico_id,
        },
      ];
      pedPro[0].productos.push(pys);
      // console.log(pedPro);
      
      let tamPRO = pedPro[0].productos.length;
      this.total = 0;
      this.subTotal12 = 0;
      this.subTotalcero = 0;
      this.subTotal = 0;
      this.iva12 = 0;
      for (let j = 0; j < tamPRO; j++) {
        this.total += parseFloat(pedPro[0].productos[j][0].costopromedio);
        if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 12){
          this.subTotal12 += parseFloat(pedPro[0].productos[j][0].itemprecio) * parseFloat(pedPro[0].productos[j][0].cant)
          this.iva12 += (parseFloat(pedPro[0].productos[j][0].iva)* parseFloat(pedPro[0].productos[j][0].cant))
          // console.log("entra");
        }
         if(parseFloat(pedPro[0].productos[j][0].ivaporcent) == 0){ 
          this.subTotalcero += (parseFloat(pedPro[0].productos[j][0].itemprecio)* parseFloat(pedPro[0].productos[j][0].cant))
          // console.log(this.subTotalcero);  
        }
      }
      this.subTotal = this.subTotalcero + this.subTotal12;
      this.cerrarModal();
      // this.listarTodos();
      this.formCantidad.reset();
    }
  }

  datosLS() {
    const dato = localStorage.getItem('Inflogueo');
    let datos;
    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
      datos = this.datosLocalStorage;
    } else console.log('ERROR');

    return datos;
  }

  guardarPrefactura(ps: any, idOrden: any, form: any) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'Guardando Prefactura',
      text: 'Se está guardando la prefactura, espere por favor',
    });
    Swal.showLoading();

    const dato1 = localStorage.getItem('Inflogueo');
    let datos;
    if (dato1) {
      this.datosLocalStorage = JSON.parse(dato1);
      datos = this.datosLocalStorage;
    } else console.log('ERROR');

    let infAcceso1 = Object.values(this.datosLocalStorage);
    // console.log('inf login', infAcceso1);
    let ptvid = infAcceso1[2][0].puntoventa_id;
    // console.log('PUNTO DE VENTA QUE ENVIO ', ptvid);
    
    let b_id = infAcceso1[2][0].bodega_id;
    // console.log('OBJ',ptvid);

    // console.log('idOrden ->', idOrden);

    // console.log("pedido recibido", ps);

    let tamArreglo = ps[0].productos.length;

    // console.log(" ===================================> tam ", tamArreglo);

    let productos = ps[0].productos;
    //  console.log("tam del arreglo => ", tamArreglo, '----->',productos);

    let arrayAlias = new Array(tamArreglo);
    let arrayProducto_id = new Array(tamArreglo);
    let arrayProductName = new Array(tamArreglo);
    let arrayTiposPrecio = new Array(tamArreglo);
    let arrayCant = new Array(tamArreglo);
    let arrayItemPrecio = new Array(tamArreglo);
    let arrayIvaPorCent = new Array(tamArreglo);
    let arrayIva = new Array(tamArreglo);
    let arrayTotal = new Array(tamArreglo);
    let arrayEsServicio = new Array(tamArreglo);
    let arrayCostoProducto = new Array(tamArreglo);
    let arrayTecnicos = new Array(tamArreglo);
    let arrayTipoServicioId = new Array(tamArreglo);
    // let arrayTotal_itemprecio = new Array(tamArreglo);
    // let arrayTotal_iva = new Array(tamArreglo);

    for (let i = 0; i < tamArreglo; i++) {
      let p_alias = productos[i][0].alias;
      let p_i = productos[i][0].producto_id;
      let p_n = productos[i][0].productname;
      let t_p = productos[i][0].tiposprecio;
      let c = productos[i][0].cant;

      let i_p = productos[i][0].itemprecio;
      let iv_p = productos[i][0].ivaporcent;
      let iva = productos[i][0].iva;
      let t = productos[i][0].total;
      let e_s = productos[i][0].esservicio;

      // let tIP = productos[i][0].total_itemprecio;
      // let tIVA = productos[i][0].total_iva;
      
      if (e_s == '0' || e_s == 0) {
        this.cantP += 1;
      } else if (e_s == '1' || e_s == 1) {
        this.cantS += 1;
      }

      let c_p = productos[i][0].costopromedio;

      let t_s_id = productos[i][0].tiposervicio_id;

      let tec_id = productos[i][0].tecnico_id;

      arrayAlias[i] = p_alias;
      arrayProducto_id[i] = p_i;
      arrayProductName[i] = p_n;
      arrayTiposPrecio[i] = t_p;
      arrayCant[i] = c;
      arrayItemPrecio[i] = i_p;
      arrayIvaPorCent[i] = iv_p;
      arrayIva[i] = iva;
      arrayTotal[i] = t;
      arrayEsServicio[i] = e_s;
      arrayCostoProducto[i] = c_p;
      arrayTipoServicioId[i] = t_s_id;
      arrayTecnicos[i] = tec_id;
      // arrayTotal_itemprecio[i]= tIP;
      // arrayTotal_iva[i]= tIVA;
    }
    // console.log("totalS =>", this.cantS);
    // console.log("totalP =>", this.cantP);

    form.alias = arrayAlias;
    form.producto_id = arrayProducto_id;
    form.productname = arrayProductName;
    form.tiposprecio = arrayTiposPrecio;
    // form.cant = arrayCant;
    form.cant = arrayCant;
    form.itemprecio = arrayItemPrecio;
    form.ivaporcent = arrayIvaPorCent;
    form.iva = arrayIva;
    form.total = arrayTotal;
    form.bodega_id = b_id;
    form.esservicio = arrayEsServicio;
    form.costopromedio = arrayCostoProducto;
    form.puntoventa_id = ptvid;
    form.tecnico_id = arrayTecnicos;
    form.tiposervicio_id = arrayTipoServicioId;
    // form.total_iva = arrayTotal_iva;
    // form.total_itemprecio = arrayTotal_itemprecio;
    let user_id = infAcceso1[1][0].id;
    form.user_id = user_id;

    // console.log('formulario que se envía', form);

    this.valoresPrefactura = productos;

    this.allService
      .postAL(form, 'orden_abierta/add_prefactura/id/' + idOrden)
      .subscribe(
        (data) => {
          // console.log("datos enviados => ", data);
          Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Operación Exitosa',
            text: 'Prefactura guardada con éxito',
            timer: 1500,
            showConfirmButton: false,
          });

          if (tamArreglo == 0) {
            this.cantP = 0;
            this.cantS = 0;
            this.banderaFacturar = false;
            this.banderaFacturarServicio = false;
            this.banderaFacturarProducto = false;
            // console.log("ENTRA CUANDO ES CERO");

            // }else{
            //   if(this.facturadoS==0 && this.cantS == 0){
            //     this.banderaFacturarServicio = false;
            //     this.banderaFacturarProducto = true;
            //     this.banderaFacturar = true;
            //   }else if(this.facturadoP==0 && this.cantP == 0){
            //     this.banderaFacturarServicio = true;
            //     this.banderaFacturarProducto = false;
            //     this.banderaFacturar = true;
            //   }else if(this.facturadoS==0 && this.cantS >= 1){
            //     this.banderaFacturar = false;
            //     this.banderaFacturarServicio = true;
            //     this.banderaFacturarProducto = false;
            //       } if(this.cantS == 0 && this.cantP == 0){

            //         this.banderaFacturar = false;
            //         this.banderaFacturarServicio = false;
            //         this.banderaFacturarProducto = false;
            //       }else if(this.cantS == 0 && this.cantP >= 1){
            //         this.banderaFacturar = true;
            //         this.banderaFacturarServicio = false;
            //         this.banderaFacturarProducto = true;
            //        } else if(this.cantS >= 1 && this.cantP == 0){
            //         this.banderaFacturar = true;
            //         this.banderaFacturarServicio = true;
            //         this.banderaFacturarProducto = false;
            //        }else{
            //           this.banderaFacturar = true;
            // this.banderaFacturarServicio = true;
            // this.banderaFacturarProducto = true;
            //   }

            // this.banderaFacturar = true;
            // this.banderaFacturarServicio = true;
            // this.banderaFacturarProducto = true;
          } else {
            this.banderaFacturar = true;
            this.banderaFacturarServicio = true;
            this.banderaFacturarProducto = true;
          }
          // this.armarPDF();
          this.tamPyS = tamArreglo;
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, no se pudo guardar prefactura',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
  }

  formIDServicio = new FormGroup({
    pro_id: new FormControl(),
  });
  formIDProductos = new FormGroup({
    pro_id: new FormControl(),
  });

  
  // ==================================== MÉTODO FACTURAR =======================================

  // VALIDAR QUE FACTURE SI TIENE PRODUCTOS CON PRECIO 0
  validarPrecios(pedPro:any){
    let contPSP = 0;
    let contPCP = 0;
    // console.log(pedPro);
    let arr = pedPro;
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i][0].total;
      if(element == 0){
        contPSP += 1;     
      }else {
        contPCP +=1;
      }   
    }
     return contPSP;
  }

  abrirModalPuntoVenta(){
    let datoPuntoVenta = this.allService.funcionDatosLocalStorage();
   this.puntosVenta = datoPuntoVenta;

   console.log(datoPuntoVenta.length);

   this.modalService.open(this.modalElegirPuntoVenta);

  //  if(datoPuntoVenta.length > 1){
  // this.modalService.open(this.modalElegirPuntoVenta);

  
  //  }else{

  //  }
  }

  elegirPuntoVenta(form:any){

    // let datoPuntoVenta = this.allService.funcionDatosLocalStorage();
    this.puntosVenta = form.puntoventa_id;
    // this.modalService.open(this.modalElegirPuntoVenta);
   
  }
  funcionLocalStorage(){
    this.puntosVenta = this.allService.funcionDatosLocalStorage();
    if(this.puntosVenta.length >1){
      // console.log('ENTRA ACA');
      
   this.banderaFacturarConPunto = true;
    }else if(this.puntosVenta.length == 1){


      this.banderaFacturarConPunto = false;
    }
  //  this.puntosVenta = datoPuntoVenta;
  }
  capturar2(rol:string) {

    this.verSeleccion = this.opcionSeleccionado;
    // console.log('Esto se captura =>', this.verSeleccion );
    
}
  hacerFactura() {
   
    // console.log('SLECT',this.verSeleccion);


   


    let condicion = this.validarPrecios(this.pedidoProductos[0].productos);
    // console.log(condicion);
 
    if(condicion>=1){
     Swal.close();
     Swal.fire({
      title: 'Factura incompleta',
      text: 'Falta de asignar precio a servicios/productos,¿Desea facturar la orden de todos modos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#B5B5B5',
      cancelButtonColor: '#F51F36',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, facturar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'info',
          text: 'Realizando Factura, espere por favor',
        });
        Swal.showLoading();
    
    let pedido = this.pedidoProductos[0].productos;
    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      // if ((pedido[i][0].ivaporcent = '12')) {
      //   tt12 += itemcantidad * itempreciobruto;
      // } else if ((pedido[i][0].ivaporcent = '0')) {
      //   tt0 += itemcantidad * itempreciobruto;
      // } else if ((pedido[i][0].ivaporcent = '8')) {
      //   tt8 += itemcantidad * itempreciobruto;
      // }
      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = infAcceso[2][0].id;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    console.log(json);
    
    let estadoF = this.elements2[0].usuario[0].facturado;

  // this.allService.postFacturar(json).subscribe(
  //     (data: any) => {
  //       this.banderaCard = false;

  //       Swal.close();

  //       Swal.fire({
  //         allowOutsideClick: false,
  //         icon: 'success',
  //         title: 'Factura generada ',
  //         text: data.rta.msg,
  //         timer: 1600,
  //         showConfirmButton: false,
  //       });

  //       abrirModalCerrarOrden();

  //       this.banderaFacturar = false;
  //       this.banderaFacturarServicio = false;
  //       this.banderaFacturarProducto = false;
  //       this.banderaPrefactura = false;
  //       this.banderaAcciones = false;
  //       this.banderaBusqueda = false;

  //       this.idFactura = data.rta.venta_id;
  //       if (this.idFactura) {
  //         this.allService
  //           .getAl(
  //             'orden_abierta/add_factura?id='+this.idOrden+'&fv='+this.idFactura+'&m='+0
  //           )
  //           .then((data: any) => {
  //           });
  //       }
  //     },
  //     (err) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Error, no se pudo guardar factura',
  //         timer: 2000, 
  //         showConfirmButton: false,
  //       });
  //     }
  //   );
      }
    });

    }else{

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'info',
        text: 'Realizando Factura, espere por favor',
      });
      Swal.showLoading();
  
    let pedido = this.pedidoProductos[0].productos;
    // console.log(pedido);
    
    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      // console.log("ivaporcent => ", ivaporcent);
      
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = infAcceso[2][0].id;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;
// Swal.close();
    console.log("factura", json);
    

    this.allService.postFacturar(json).subscribe(
      (data: any) => {
        this.banderaCard = false;

        Swal.close();

        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Factura generada ',
          text: data.rta.msg,
          timer: 1600,
          showConfirmButton: false,
        });

        abrirModalCerrarOrden();

        this.banderaFacturar = false;
        this.banderaFacturarServicio = false;
        this.banderaFacturarProducto = false;
        this.banderaPrefactura = false;
        this.banderaAcciones = false;
        this.banderaBusqueda = false;

        // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
        // this.cerrarPlaneadorDetalle();

        this.idFactura = data.rta.venta_id;
        if (this.idFactura) {
          this.allService
            .getAl(
              'orden_abierta/add_factura?id='+this.idOrden+'&fv='+this.idFactura+'&m='+0
            )
            .then((data: any) => {
              // console.log("LO QUE DEVUELVE",data);
            });
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, no se pudo guardar factura',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    );
  }

  }
  hacerFacturaconPunto() {
   
    // console.log('SLECT',this.verSeleccion);

    if(this.verSeleccion ==''){

      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Seleccione punto de venta',
        text: 'Tiene que seleccionar un punto de eventa para generar la factura',
        confirmButtonColor: '#B5B5B5',
      });

    }else {

    
    let condicion = this.validarPrecios(this.pedidoProductos[0].productos);
    console.log(this.pedidoProductos[0].productos);
 
    if(condicion>=1){
     Swal.close();
     Swal.fire({
      title: 'Factura incompleta',
      text: 'Falta de asignar precio a servicios/productos,¿Desea facturar la orden de todos modos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#B5B5B5',
      cancelButtonColor: '#F51F36',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, facturar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          title: 'info',
          text: 'Realizando Factura, espere por favor',
        });
        Swal.showLoading();
    
    let pedido = this.pedidoProductos[0].productos;
    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      // if ((pedido[i][0].ivaporcent = '12')) {
      //   tt12 += itemcantidad * itempreciobruto;
      // } else if ((pedido[i][0].ivaporcent = '0')) {
      //   tt0 += itemcantidad * itempreciobruto;
      // } else if ((pedido[i][0].ivaporcent = '8')) {
      //   tt8 += itemcantidad * itempreciobruto;
      // }
      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = this.verSeleccion;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };
    Swal.close();

    console.log(json);
    
    let estadoF = this.elements2[0].usuario[0].facturado;

  // this.allService.postFacturar(json).subscribe(
  //     (data: any) => {
  //       this.banderaCard = false;

  //       Swal.close();

  //       Swal.fire({
  //         allowOutsideClick: false,
  //         icon: 'success',
  //         title: 'Factura generada ',
  //         text: data.rta.msg,
  //         timer: 1600,
  //         showConfirmButton: false,
  //       });

  //       abrirModalCerrarOrden();

  //       this.banderaFacturar = false;
  //       this.banderaFacturarServicio = false;
  //       this.banderaFacturarProducto = false;
  //       this.banderaPrefactura = false;
  //       this.banderaAcciones = false;
  //       this.banderaBusqueda = false;

  //       this.idFactura = data.rta.venta_id;
  //       if (this.idFactura) {
  //         this.allService
  //           .getAl(
  //             'orden_abierta/add_factura?id=' +
  //               this.idOrden +
  //               '&fv=' +
  //               this.idFactura+
  //               '&m='+0
  //           )
  //           .then((data: any) => {
  //           });
  //       }
  //     },
  //     (err) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Error, no se pudo guardar factura',
  //         timer: 2000, 
  //         showConfirmButton: false,
  //       });
  //     }
  //   );
      }
    });

    }else{

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'info',
        text: 'Realizando Factura, espere por favor',
      });
      Swal.showLoading();
  
    let pedido = this.pedidoProductos[0].productos;
    // console.log(pedido);
    
    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      // console.log("ivaporcent => ", ivaporcent);
      
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = this.verSeleccion;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;
Swal.close();
    console.log("factura", json);
    

    this.allService.postFacturar(json).subscribe(
      (data: any) => {
        this.banderaCard = false;

        Swal.close();

        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Factura generada ',
          text: data.rta.msg,
          timer: 1600,
          showConfirmButton: false,
        });

        abrirModalCerrarOrden();

        this.banderaFacturar = false;
        this.banderaFacturarServicio = false;
        this.banderaFacturarProducto = false;
        this.banderaPrefactura = false;
        this.banderaAcciones = false;
        this.banderaBusqueda = false;

        // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
        // this.cerrarPlaneadorDetalle();

        this.idFactura = data.rta.venta_id;
        if (this.idFactura) {
          this.allService
            .getAl(
              'orden_abierta/add_factura?id=' +
                this.idOrden +
                '&fv=' +
                this.idFactura+
                '&m='+0
            )
            .then((data: any) => {
              // console.log("LO QUE DEVUELVE",data);
            });
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error, no se pudo guardar factura',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    );
  }
}

  }

  // ================================== FACTURAR SERVICIO ======================================
  facturarServicio() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'info',
      text: 'Realizando Factura Servicios, espere por favor',
    });
    Swal.showLoading();

    let pedido1 = this.pedidoProductos[0].productos;

    let item1: any;

    for (let x = 0; x < pedido1.length; x++) {
      if (pedido1[x][0].esservicio == 0) {
        item1 = pedido1[x];
        this.totalProductos.push(item1);
      }
    }
    // console.log(this.totalProductos);
    

    
    this.totalProductosC = this.totalProductos.length;
    let pedido = new Array();
    let item: any;
    for (let z = 0; z < pedido1.length; z++) {
      if (pedido1[z][0].esservicio == 1) {
        item = pedido1[z];
        pedido.push(item);
      }
    }
    // console.log("pedido => ", pedido);
    
    let condicion = this.validarPrecios(pedido);
    // console.log(condicion);
 if(condicion>=1){

  Swal.fire({
    title: 'Factura incompleta',
    text: 'Falta de asignar precio a servicios,¿Desea facturar la orden de todos modos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#B5B5B5',
    cancelButtonColor: '#F51F36',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Si, facturar',
  }).then((result) => {
    if (result.isConfirmed) {

      let tamArreglo = pedido.length;

      this.idOrden = this.informacionOrden[0].idOrden;
  
      //  DETALLE FACTURA
  
      let Producto_codigo = '';
      let itemcantidad = 1;
      let itempreciobruto = 1;
      let itemprecioxcantidadbruto = 1;
      let descuentofactporcent = 0;
      let descuentofactvalor = 0;
      let recargofactporcent = 0;
      let recargofactvalor = 0;
      //  ----------------------
      let itemprecioneto = 1;
      let itemprecioxcantidadneto = 1;
      let ivaporcent = 12;
      let ivavalitemprecioneto = 0;
      let itemprecioiva = 1;
      let ivavalprecioxcantidadneto = 0;
      let itemxcantidadprecioiva = 1;
      let estaAnulada = 0;
      let bodega_id = this.bodega_id;
      let tiposprecio_tipoprecio = '';
      let itembaseiva = 1;
      let totitembaseiva = 1;
      let iceporcent = null;
      let iceval = 0; /// TAMBIEN VA EN FACTURA
      let priceice = null;
      let totalpriceice = null;
      let totivaval = 0;
      let priceiva = 1;
      let totalpriceiva = 1;
      //  this.detalle= 0; // TAMBIEN VA EN FACTURA
      let meses_garantia = 0;
      let unidad = 0;
  
      //totalServicios
      let sts = 0;
  
      //TotalProductos
      let stp = 0;
  
      //Tarifas
      let tt12 = 0;
      let tt0 = 0;
      let tt8 = 0;
  
      //ARREGLO DETALLE
      const arrDetalle = new Array();
      let detalle = 0;
  
      let detalleProducto;
  
      for (let i = 0; i < tamArreglo; i++) {
        Producto_codigo = pedido[i][0].producto_id;
        itemcantidad = pedido[i][0].cant;
        itempreciobruto = pedido[i][0].itemprecio;
        itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
        itemprecioneto = itempreciobruto;
        itemprecioxcantidadneto = itemprecioxcantidadbruto;
        ivaporcent = pedido[i][0].ivaporcent;
        ivavalitemprecioneto = pedido[i][0].iva;
        itemprecioiva = itemcantidad * pedido[i][0].total;
        ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
        itemxcantidadprecioiva = itemprecioiva;
        bodega_id = pedido[i][0].bodega_id;
        tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
        itembaseiva = itempreciobruto;
        totitembaseiva = itemprecioxcantidadbruto;
        totivaval = ivavalprecioxcantidadneto;
        priceiva = pedido[i][0].total;
        totalpriceiva = itemcantidad * priceiva;
  
        if (pedido[i][0].esservicio == '1') {
          sts += itemcantidad * itempreciobruto;
        } else if (pedido[i][0].esservicio == '0') {
          stp += itemcantidad * itempreciobruto;
        }
  
        if ((ivaporcent == 12)) {
          // console.log("aqio",tt12);
          
          tt12 += itemcantidad * itempreciobruto;
        } else if ((ivaporcent == 0)) {
          // console.log("en cero");
          tt0 += itemcantidad * itempreciobruto;
        } else if ((ivaporcent == 8)) {
          tt8 += itemcantidad * itempreciobruto;
        }
  
        // let detalle = 0;
        detalleProducto = {
          Producto_codigo,
          itemcantidad,
          itempreciobruto,
          itemprecioxcantidadbruto,
          descuentofactporcent,
          descuentofactvalor,
          recargofactporcent,
          recargofactvalor,
          itemprecioneto,
          itemprecioxcantidadneto,
          ivaporcent,
          ivavalitemprecioneto,
          itemprecioiva,
          ivavalprecioxcantidadneto,
          itemxcantidadprecioiva,
          estaAnulada,
          bodega_id,
          tiposprecio_tipoprecio,
          itembaseiva,
          totitembaseiva,
          iceporcent,
          iceval,
          priceice,
          totalpriceice,
          totivaval,
          priceiva,
          totalpriceiva,
          detalle,
          meses_garantia,
          unidad,
        };
        arrDetalle.push(detalleProducto);
      }
  
      // =================== FACTURA
  
      let tival = 0;
  
      for (let i = 0; i < arrDetalle.length; i++) {
        tival = tival + arrDetalle[i].totivaval;
      }
  
      let ivaval = tival;
  
      let creditoval = 0; //ya
      let recargovalor = 0; //ya
      let descuentovalor = 0;
  
      let baseiva = tt12;
      let nro_orden = '';
      let servicios = 0;
      let subtbrutoservicios = sts;
      let subtbrutobienes = stp;
      let tarifadocebruto = baseiva;
      let tarifacerobruto = tt0;
      let subtotalBruto = subtbrutobienes + subtbrutoservicios;
      let subtotalNeto = tarifacerobruto + tarifadocebruto;
      // let ivaval = baseiva * (0.12);
      let totalCompra = subtotalNeto + ivaval;
      let observaciones = '';
      let valorrecibidoefectivo = 0;
      let valorcambio = 0;
      let subtnetobienes = subtbrutobienes;
      let subtnetoservicios = subtbrutoservicios;
      let tarifaceroneto = tarifacerobruto;
      let tarifadoceneto = tarifadocebruto;
      let efectivoval = 0;
  
      let factura = {
        creditoval,
        recargovalor,
        subtotalBruto,
        descuentovalor,
        subtotalNeto,
        ivaval,
        totalCompra,
        observaciones,
        valorrecibidoefectivo,
        valorcambio,
        tarifacerobruto,
        tarifaceroneto,
        tarifadocebruto,
        tarifadoceneto,
        subtbrutobienes,
        subtbrutoservicios,
        subtnetobienes,
        subtnetoservicios,
        iceval,
        efectivoval,
        baseiva,
        nro_orden,
        servicios,
      };
  
      const dato = localStorage.getItem('Inflogueo');
  
      if (dato) {
        this.datosLocalStorage = JSON.parse(dato);
      } else console.log('ERROR');
  
      let infAcceso = Object.values(this.datosLocalStorage);
      let user_id = infAcceso[1][0].id;
  
      // this.user_id = user_id;
      let puntoventa_id = infAcceso[2][0].id;
      this.puntoventa_id = puntoventa_id;
      let type = 'prefactura';
      let PersonaComercio_cedulaRuc =
        this.informacionOrden[0].PersonaComercio_cedulaRuc;
  
      let efecval = totalCompra;
      let fecha_vence = '';
  
      let cliente = {
        PersonaComercio_cedulaRuc,
      };
  
      let json = {
        factura,
        detalle: arrDetalle,
        user_id,
        puntoventa_id,
        type,
        cliente,
        efectivo_val: efecval,
        credito_val: creditoval,
        fecha_vence,
      };
  
      let estadoF = this.elements2[0].usuario[0].facturado;
  
      let arrIDServicios = new Array();
      // let arrIDProductos = new Array;
      for (let y = 0; y < arrDetalle.length; y++) {
        let idS = arrDetalle[y].Producto_codigo;
        //  let idT = arrDetalle[y].Producto_codigo;
        arrIDServicios.push(idS);
      }
  // Swal.close();
  //     console.log('json => ', json);
  
      let pro_id = arrIDServicios;
  
      this.totalServicios = pro_id;
  
      this.formIDServicio.get('pro_id')?.setValue(pro_id);
  
      if (pro_id.length == 0) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: '¡Factura Vacía!',
          text: 'No tiene servicios para facturar ',
          timer: 2600,
          showConfirmButton: false,
        });
      
      } else {
        this.allService.postFacturar(json).subscribe(
          (data: any) => {
            // console.log('data', data);
            
            this.banderaCard = false;
            Swal.close();
  
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Factura generada ',
              text: data.rta.msg,
              timer: 1600,
              showConfirmButton: false,
            });
  
            // abrirModalCerrarOrden();
  
            this.banderaFacturar = false;
            this.banderaFacturarServicio = false;
            this.banderaPrefactura = false;
            this.banderaAcciones = false;
            this.banderaBusqueda = false;
  
            this.facturadoServ = true;
            this.idFactura = data.rta.venta_id;
            // console.log("servicios => ",    this.formIDServicio.value);
            
            if (this.idFactura) {
              this.allService
                .postG(
                  'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,this.formIDServicio.value
                )
                .subscribe((data: any) => {
  
                  // console.log('data 2', data);
                  
                  if (
                    this.facturadoServ == true &&  (this.totalProductosC == 0 || this.facturadoP == 1)) {
                   
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    abrirModalCerrarOrden();
                    // console.log("caso 1 ");
                    
                  } else if ( this.facturadoServ == true && this.facturadoProd == true ) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("caso 2 ");
                    abrirModalCerrarOrden();
                  } else if (this.facturadoServ == true && (this.totalProductosC >= 1 || this.facturadoP==0)) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = true;
                    // console.log("caso 3 ");
                    // this.banderaFacturarServicio = false;
                  } else
                  
                  if(this.facturadoServ == true && this.facturadoProd == true){
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    abrirModalCerrarOrden();
                    // console.log("Caso 4");
                  }
                },(err)=>{
                  // console.log("VIENE ACA");
                  this.facturadoServ == true;
                  abrirModalCerrarOrden();
                });
            }
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error, no se pudo guardar factura',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        );
      }
    }
  });

 }else{

    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = infAcceso[2][0].id;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;

    let arrIDServicios = new Array();
    // let arrIDProductos = new Array;
    for (let y = 0; y < arrDetalle.length; y++) {
      let idS = arrDetalle[y].Producto_codigo;
      //  let idT = arrDetalle[y].Producto_codigo;
      arrIDServicios.push(idS);
    }

    // console.log('json => ', json);

    let pro_id = arrIDServicios;

    this.totalServicios = pro_id;

    this.formIDServicio.get('pro_id')?.setValue(pro_id);

    if (pro_id.length == 0) {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: '¡Factura Vacía!',
        text: 'No tiene servicios para facturar ',
        timer: 2600,
        showConfirmButton: false,
      });
    
    } else {
      this.allService.postFacturar(json).subscribe(
        (data: any) => {
          this.banderaCard = false;
          Swal.close();

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Factura generada ',
            text: data.rta.msg,
            timer: 1600,
            showConfirmButton: false,
          });

          // abrirModalCerrarOrden();

          this.banderaFacturar = false;
          this.banderaFacturarServicio = false;
          this.banderaPrefactura = false;
          this.banderaAcciones = false;
          this.banderaBusqueda = false;

          this.facturadoServ = true;
          this.idFactura = data.rta.venta_id;
          // console.log("servicios => ",    this.formIDServicio.value);
          
          if (this.idFactura) {
            this.allService
              .postG(
                'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,this.formIDServicio.value)
              .subscribe((data: any) => {

                // console.log('data 2.1', data);
                
                if (
                  this.facturadoServ == true &&  (this.totalProductosC == 0 || this.facturadoP == 1)) {
                 
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  abrirModalCerrarOrden();
                  // console.log("caso 1 ");
                  
                } else if ( this.facturadoServ == true && this.facturadoProd == true ) {
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  // console.log("caso 2 ");
                  abrirModalCerrarOrden();
                } else if (this.facturadoServ == true && (this.totalProductosC >= 1 || this.facturadoP==0)) {
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = true;
                  // console.log("caso 3 ");
                  // this.banderaFacturarServicio = false;
                } else
                
                if(this.facturadoServ == true && this.facturadoProd == true){
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  abrirModalCerrarOrden();
                  // console.log("Caso 4");
                }
              },(err)=>{
                // console.log("VIENE ACA");
                this.facturadoServ == true;
              });
          }
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, no se pudo guardar factura',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
    }
 }
  }
  facturarServicioPV() {
    if(this.verSeleccion ==''){

      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Seleccione punto de venta',
        text: 'Tiene que seleccionar un punto de eventa para generar la factura',
        confirmButtonColor: '#B5B5B5',
      });

    }else {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'info',
      text: 'Realizando Factura Servicios, espere por favor',
    });
    Swal.showLoading();

    let pedido1 = this.pedidoProductos[0].productos;

    let item1: any;

    for (let x = 0; x < pedido1.length; x++) {
      if (pedido1[x][0].esservicio == 0) {
        item1 = pedido1[x];
        this.totalProductos.push(item1);
      }
    }
    // console.log(this.totalProductos);
    

    
    this.totalProductosC = this.totalProductos.length;
    let pedido = new Array();
    let item: any;
    for (let z = 0; z < pedido1.length; z++) {
      if (pedido1[z][0].esservicio == 1) {
        item = pedido1[z];
        pedido.push(item);
      }
    }
    // console.log("pedido => ", pedido);
    
    let condicion = this.validarPrecios(pedido);
    // console.log(condicion);
 if(condicion>=1){

  Swal.fire({
    title: 'Factura incompleta',
    text: 'Falta de asignar precio a servicios,¿Desea facturar la orden de todos modos?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#B5B5B5',
    cancelButtonColor: '#F51F36',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Si, facturar',
  }).then((result) => {
    if (result.isConfirmed) {

      let tamArreglo = pedido.length;

      this.idOrden = this.informacionOrden[0].idOrden;
  
      //  DETALLE FACTURA
  
      let Producto_codigo = '';
      let itemcantidad = 1;
      let itempreciobruto = 1;
      let itemprecioxcantidadbruto = 1;
      let descuentofactporcent = 0;
      let descuentofactvalor = 0;
      let recargofactporcent = 0;
      let recargofactvalor = 0;
      //  ----------------------
      let itemprecioneto = 1;
      let itemprecioxcantidadneto = 1;
      let ivaporcent = 12;
      let ivavalitemprecioneto = 0;
      let itemprecioiva = 1;
      let ivavalprecioxcantidadneto = 0;
      let itemxcantidadprecioiva = 1;
      let estaAnulada = 0;
      let bodega_id = this.bodega_id;
      let tiposprecio_tipoprecio = '';
      let itembaseiva = 1;
      let totitembaseiva = 1;
      let iceporcent = null;
      let iceval = 0; /// TAMBIEN VA EN FACTURA
      let priceice = null;
      let totalpriceice = null;
      let totivaval = 0;
      let priceiva = 1;
      let totalpriceiva = 1;
      //  this.detalle= 0; // TAMBIEN VA EN FACTURA
      let meses_garantia = 0;
      let unidad = 0;
  
      //totalServicios
      let sts = 0;
  
      //TotalProductos
      let stp = 0;
  
      //Tarifas
      let tt12 = 0;
      let tt0 = 0;
      let tt8 = 0;
  
      //ARREGLO DETALLE
      const arrDetalle = new Array();
      let detalle = 0;
  
      let detalleProducto;
  
      for (let i = 0; i < tamArreglo; i++) {
        Producto_codigo = pedido[i][0].producto_id;
        itemcantidad = pedido[i][0].cant;
        itempreciobruto = pedido[i][0].itemprecio;
        itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
        itemprecioneto = itempreciobruto;
        itemprecioxcantidadneto = itemprecioxcantidadbruto;
        ivaporcent = pedido[i][0].ivaporcent;
        ivavalitemprecioneto = pedido[i][0].iva;
        itemprecioiva = itemcantidad * pedido[i][0].total;
        ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
        itemxcantidadprecioiva = itemprecioiva;
        bodega_id = pedido[i][0].bodega_id;
        tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
        itembaseiva = itempreciobruto;
        totitembaseiva = itemprecioxcantidadbruto;
        totivaval = ivavalprecioxcantidadneto;
        priceiva = pedido[i][0].total;
        totalpriceiva = itemcantidad * priceiva;
  
        if (pedido[i][0].esservicio == '1') {
          sts += itemcantidad * itempreciobruto;
        } else if (pedido[i][0].esservicio == '0') {
          stp += itemcantidad * itempreciobruto;
        }
  
        if ((ivaporcent == 12)) {
          // console.log("aqio",tt12);
          
          tt12 += itemcantidad * itempreciobruto;
        } else if ((ivaporcent == 0)) {
          // console.log("en cero");
          tt0 += itemcantidad * itempreciobruto;
        } else if ((ivaporcent == 8)) {
          tt8 += itemcantidad * itempreciobruto;
        }
  
        // let detalle = 0;
        detalleProducto = {
          Producto_codigo,
          itemcantidad,
          itempreciobruto,
          itemprecioxcantidadbruto,
          descuentofactporcent,
          descuentofactvalor,
          recargofactporcent,
          recargofactvalor,
          itemprecioneto,
          itemprecioxcantidadneto,
          ivaporcent,
          ivavalitemprecioneto,
          itemprecioiva,
          ivavalprecioxcantidadneto,
          itemxcantidadprecioiva,
          estaAnulada,
          bodega_id,
          tiposprecio_tipoprecio,
          itembaseiva,
          totitembaseiva,
          iceporcent,
          iceval,
          priceice,
          totalpriceice,
          totivaval,
          priceiva,
          totalpriceiva,
          detalle,
          meses_garantia,
          unidad,
        };
        arrDetalle.push(detalleProducto);
      }
  
      // =================== FACTURA
  
      let tival = 0;
  
      for (let i = 0; i < arrDetalle.length; i++) {
        tival = tival + arrDetalle[i].totivaval;
      }
  
      let ivaval = tival;
  
      let creditoval = 0; //ya
      let recargovalor = 0; //ya
      let descuentovalor = 0;
  
      let baseiva = tt12;
      let nro_orden = '';
      let servicios = 0;
      let subtbrutoservicios = sts;
      let subtbrutobienes = stp;
      let tarifadocebruto = baseiva;
      let tarifacerobruto = tt0;
      let subtotalBruto = subtbrutobienes + subtbrutoservicios;
      let subtotalNeto = tarifacerobruto + tarifadocebruto;
      // let ivaval = baseiva * (0.12);
      let totalCompra = subtotalNeto + ivaval;
      let observaciones = '';
      let valorrecibidoefectivo = 0;
      let valorcambio = 0;
      let subtnetobienes = subtbrutobienes;
      let subtnetoservicios = subtbrutoservicios;
      let tarifaceroneto = tarifacerobruto;
      let tarifadoceneto = tarifadocebruto;
      let efectivoval = 0;
  
      let factura = {
        creditoval,
        recargovalor,
        subtotalBruto,
        descuentovalor,
        subtotalNeto,
        ivaval,
        totalCompra,
        observaciones,
        valorrecibidoefectivo,
        valorcambio,
        tarifacerobruto,
        tarifaceroneto,
        tarifadocebruto,
        tarifadoceneto,
        subtbrutobienes,
        subtbrutoservicios,
        subtnetobienes,
        subtnetoservicios,
        iceval,
        efectivoval,
        baseiva,
        nro_orden,
        servicios,
      };
  
      const dato = localStorage.getItem('Inflogueo');
  
      if (dato) {
        this.datosLocalStorage = JSON.parse(dato);
      } else console.log('ERROR');
  
      let infAcceso = Object.values(this.datosLocalStorage);
      let user_id = infAcceso[1][0].id;
  
      // this.user_id = user_id;
      let puntoventa_id = this.verSeleccion;
      this.puntoventa_id = puntoventa_id;
      let type = 'prefactura';
      let PersonaComercio_cedulaRuc =
        this.informacionOrden[0].PersonaComercio_cedulaRuc;
  
      let efecval = totalCompra;
      let fecha_vence = '';
  
      let cliente = {
        PersonaComercio_cedulaRuc,
      };
  
      let json = {
        factura,
        detalle: arrDetalle,
        user_id,
        puntoventa_id,
        type,
        cliente,
        efectivo_val: efecval,
        credito_val: creditoval,
        fecha_vence,
      };
  
      let estadoF = this.elements2[0].usuario[0].facturado;
  
      let arrIDServicios = new Array();
      // let arrIDProductos = new Array;
      for (let y = 0; y < arrDetalle.length; y++) {
        let idS = arrDetalle[y].Producto_codigo;
        //  let idT = arrDetalle[y].Producto_codigo;
        arrIDServicios.push(idS);
      }
  // Swal.close();
      // console.log('json => ', json);
  
      let pro_id = arrIDServicios;
  
      this.totalServicios = pro_id;
  
      this.formIDServicio.get('pro_id')?.setValue(pro_id);
  
      if (pro_id.length == 0) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: '¡Factura Vacía!',
          text: 'No tiene servicios para facturar ',
          timer: 2600,
          showConfirmButton: false,
        });
      
      } else {
        this.allService.postFacturar(json).subscribe(
          (data: any) => {
            this.banderaCard = false;
            Swal.close();
  
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Factura generada ',
              text: data.rta.msg,
              timer: 1600,
              showConfirmButton: false,
            });
  
            // abrirModalCerrarOrden();
  
            this.banderaFacturar = false;
            this.banderaFacturarServicio = false;
            this.banderaPrefactura = false;
            this.banderaAcciones = false;
            this.banderaBusqueda = false;
  
            this.facturadoServ = true;
            this.idFactura = data.rta.venta_id;
            // console.log("servicios => ",    this.formIDServicio.value);
            
            if (this.idFactura) {
              this.allService
                .postG(
                  'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,this.formIDServicio.value)
                .subscribe((data: any) => {
  
                  // console.log('data');
                  
                  if (
                    this.facturadoServ == true &&  (this.totalProductosC == 0 || this.facturadoP == 1)) {
                   
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    abrirModalCerrarOrden();
                    // console.log("caso 1 ");
                    
                  } else if ( this.facturadoServ == true && this.facturadoProd == true ) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("caso 2 ");
                    abrirModalCerrarOrden();
                  } else if (this.facturadoServ == true && (this.totalProductosC >= 1 || this.facturadoP==0)) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = true;
                    // console.log("caso 3 ");
                    // this.banderaFacturarServicio = false;
                  } else
                  
                  if(this.facturadoServ == true && this.facturadoProd == true){
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    abrirModalCerrarOrden();
                    // console.log("Caso 4");
                  }
                },(err)=>{
                  // console.log("VIENE ACA");
                  this.facturadoServ == true;
                  abrirModalCerrarOrden();
                });
            }
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error, no se pudo guardar factura',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        );
      }
    }
  });

 }else{

    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = this.verSeleccion;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;

    let arrIDServicios = new Array();
    // let arrIDProductos = new Array;
    for (let y = 0; y < arrDetalle.length; y++) {
      let idS = arrDetalle[y].Producto_codigo;
      //  let idT = arrDetalle[y].Producto_codigo;
      arrIDServicios.push(idS);
    }

    // console.log('json => ', json);

    let pro_id = arrIDServicios;

    this.totalServicios = pro_id;

    this.formIDServicio.get('pro_id')?.setValue(pro_id);

    if (pro_id.length == 0) {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: '¡Factura Vacía!',
        text: 'No tiene servicios para facturar ',
        timer: 2600,
        showConfirmButton: false,
      });
    
    } else {
      this.allService.postFacturar(json).subscribe(
        (data: any) => {
          this.banderaCard = false;
          Swal.close();

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Factura generada ',
            text: data.rta.msg,
            timer: 1600,
            showConfirmButton: false,
          });

          // abrirModalCerrarOrden();

          this.banderaFacturar = false;
          this.banderaFacturarServicio = false;
          this.banderaPrefactura = false;
          this.banderaAcciones = false;
          this.banderaBusqueda = false;

          this.facturadoServ = true;
          this.idFactura = data.rta.venta_id;
          // console.log("servicios => ",    this.formIDServicio.value);
          
          if (this.idFactura) {
            this.allService
              .postG(
                'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,this.formIDServicio.value
              )
              .subscribe((data: any) => {

                // console.log('data', data);
                
                if (
                  this.facturadoServ == true &&  (this.totalProductosC == 0 || this.facturadoP == 1)) {
                 
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  abrirModalCerrarOrden();
                  // console.log("caso 1 ");
                  
                } else if ( this.facturadoServ == true && this.facturadoProd == true ) {
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  // console.log("caso 2 ");
                  abrirModalCerrarOrden();
                } else if (this.facturadoServ == true && (this.totalProductosC >= 1 || this.facturadoP==0)) {
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = true;
                  // console.log("caso 3 ");
                  // this.banderaFacturarServicio = false;
                } else
                
                if(this.facturadoServ == true && this.facturadoProd == true){
                  this.banderaFacturarServicio = false;
                  this.banderaFacturarProducto = false;
                  abrirModalCerrarOrden();
                  // console.log("Caso 4");
                }
              },(err)=>{
                // console.log("VIENE ACA");
                this.facturadoServ == true;
              });
          }
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, no se pudo guardar factura',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
    }
 }
  }
}

  // ================================== FACTURAR PRODUCTO ======================================

  facturarProducto() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'info',
      text: 'Realizando Factura Productos, espere por favor',
    });
    Swal.showLoading();

    let pedido1 = this.pedidoProductos[0].productos;
    let item1: any;

    for (let x = 0; x < pedido1.length; x++) {
      if (pedido1[x][0].esservicio == 1) {
        item1 = pedido1[x];
        this.totalServicios.push(item1);
      }
    }

    this.totalServiciosC = this.totalServicios.length;
    let pedido = new Array();
    let item: any;
    for (let z = 0; z < pedido1.length; z++) {
      if (pedido1[z][0].esservicio == 0) {
        item = pedido1[z];
        pedido.push(item);
      }
    }
    let condicion = this.validarPrecios(pedido);
    if(condicion){
      Swal.fire({
        title: 'Factura incompleta',
        text: 'Falta de asignar precio a productos,¿Desea facturar la orden de todos modos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#B5B5B5',
        cancelButtonColor: '#F51F36',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Si, facturar',
      }).then((result) => {
        if (result.isConfirmed) {
          let tamArreglo = pedido.length;

          this.idOrden = this.informacionOrden[0].idOrden;
      
          //  DETALLE FACTURA
      
          let Producto_codigo = '';
          let itemcantidad = 1;
          let itempreciobruto = 1;
          let itemprecioxcantidadbruto = 1;
          let descuentofactporcent = 0;
          let descuentofactvalor = 0;
          let recargofactporcent = 0;
          let recargofactvalor = 0;
          //  ----------------------
          let itemprecioneto = 1;
          let itemprecioxcantidadneto = 1;
          let ivaporcent = 12;
          let ivavalitemprecioneto = 0;
          let itemprecioiva = 1;
          let ivavalprecioxcantidadneto = 0;
          let itemxcantidadprecioiva = 1;
          let estaAnulada = 0;
          let bodega_id = this.bodega_id;
          let tiposprecio_tipoprecio = '';
          let itembaseiva = 1;
          let totitembaseiva = 1;
          let iceporcent = null;
          let iceval = 0; /// TAMBIEN VA EN FACTURA
          let priceice = null;
          let totalpriceice = null;
          let totivaval = 0;
          let priceiva = 1;
          let totalpriceiva = 1;
          //  this.detalle= 0; // TAMBIEN VA EN FACTURA
          let meses_garantia = 0;
          let unidad = 0;
      
          //totalServicios
          let sts = 0;
      
          //TotalProductos
          let stp = 0;
      
          //Tarifas
          let tt12 = 0;
          let tt0 = 0;
          let tt8 = 0;
      
          //ARREGLO DETALLE
          const arrDetalle = new Array();
          let detalle = 0;
      
          let detalleProducto;
      
          for (let i = 0; i < tamArreglo; i++) {
            Producto_codigo = pedido[i][0].producto_id;
            itemcantidad = pedido[i][0].cant;
            itempreciobruto = pedido[i][0].itemprecio;
            itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
            itemprecioneto = itempreciobruto;
            itemprecioxcantidadneto = itemprecioxcantidadbruto;
            ivaporcent = pedido[i][0].ivaporcent;
            ivavalitemprecioneto = pedido[i][0].iva;
            itemprecioiva = itemcantidad * pedido[i][0].total;
            ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
            itemxcantidadprecioiva = itemprecioiva;
            bodega_id = pedido[i][0].bodega_id;
            tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
            itembaseiva = itempreciobruto;
            totitembaseiva = itemprecioxcantidadbruto;
            totivaval = ivavalprecioxcantidadneto;
            priceiva = pedido[i][0].total;
            totalpriceiva = itemcantidad * priceiva;
      
            if (pedido[i][0].esservicio == '1') {
              sts += itemcantidad * itempreciobruto;
            } else if (pedido[i][0].esservicio == '0') {
              stp += itemcantidad * itempreciobruto;
            }
      
            if ((ivaporcent == 12)) {
              // console.log("aqio",tt12);
              
              tt12 += itemcantidad * itempreciobruto;
            } else if ((ivaporcent == 0)) {
              // console.log("en cero");
              tt0 += itemcantidad * itempreciobruto;
            } else if ((ivaporcent == 8)) {
              tt8 += itemcantidad * itempreciobruto;
            }
      
            // let detalle = 0;
            detalleProducto = {
              Producto_codigo,
              itemcantidad,
              itempreciobruto,
              itemprecioxcantidadbruto,
              descuentofactporcent,
              descuentofactvalor,
              recargofactporcent,
              recargofactvalor,
              itemprecioneto,
              itemprecioxcantidadneto,
              ivaporcent,
              ivavalitemprecioneto,
              itemprecioiva,
              ivavalprecioxcantidadneto,
              itemxcantidadprecioiva,
              estaAnulada,
              bodega_id,
              tiposprecio_tipoprecio,
              itembaseiva,
              totitembaseiva,
              iceporcent,
              iceval,
              priceice,
              totalpriceice,
              totivaval,
              priceiva,
              totalpriceiva,
              detalle,
              meses_garantia,
              unidad,
            };
            arrDetalle.push(detalleProducto);
          }
      
          // =================== FACTURA
      
          let tival = 0;
      
          // console.log('que es esto',arrDetalle);
      
          for (let i = 0; i < arrDetalle.length; i++) {
            tival = tival + arrDetalle[i].totivaval;
          }
      
          let ivaval = tival;
      
          let creditoval = 0; //ya
          let recargovalor = 0; //ya
          let descuentovalor = 0;
      
          let baseiva = tt12;
          let nro_orden = '';
          let servicios = 0;
          let subtbrutoservicios = sts;
          let subtbrutobienes = stp;
          let tarifadocebruto = baseiva;
          let tarifacerobruto = tt0;
          let subtotalBruto = subtbrutobienes + subtbrutoservicios;
          let subtotalNeto = tarifacerobruto + tarifadocebruto;
          // let ivaval = baseiva * (0.12);
          let totalCompra = subtotalNeto + ivaval;
          let observaciones = '';
          let valorrecibidoefectivo = 0;
          let valorcambio = 0;
          let subtnetobienes = subtbrutobienes;
          let subtnetoservicios = subtbrutoservicios;
          let tarifaceroneto = tarifacerobruto;
          let tarifadoceneto = tarifadocebruto;
          let efectivoval = 0;
      
          let factura = {
            creditoval,
            recargovalor,
            subtotalBruto,
            descuentovalor,
            subtotalNeto,
            ivaval,
            totalCompra,
            observaciones,
            valorrecibidoefectivo,
            valorcambio,
            tarifacerobruto,
            tarifaceroneto,
            tarifadocebruto,
            tarifadoceneto,
            subtbrutobienes,
            subtbrutoservicios,
            subtnetobienes,
            subtnetoservicios,
            iceval,
            efectivoval,
            baseiva,
            nro_orden,
            servicios,
          };
      
          const dato = localStorage.getItem('Inflogueo');
      
          if (dato) {
            this.datosLocalStorage = JSON.parse(dato);
          } else console.log('ERROR');
      
          let infAcceso = Object.values(this.datosLocalStorage);
          let user_id = infAcceso[1][0].id;
      
          // this.user_id = user_id;
          let puntoventa_id = infAcceso[2][0].id;
          this.puntoventa_id = puntoventa_id;
          let type = 'prefactura';
          let PersonaComercio_cedulaRuc =
            this.informacionOrden[0].PersonaComercio_cedulaRuc;
      
          let efecval = totalCompra;
          let fecha_vence = '';
      
          let cliente = {
            PersonaComercio_cedulaRuc,
          };
      
          let json = {
            factura,
            detalle: arrDetalle,
            user_id,
            puntoventa_id,
            type,
            cliente,
            efectivo_val: efecval,
            credito_val: creditoval,
            fecha_vence,
          };
      
          let estadoF = this.elements2[0].usuario[0].facturado;
      
          let arrIDProductos = new Array();
          for (let y = 0; y < arrDetalle.length; y++) {
            let idT = arrDetalle[y].Producto_codigo;
            arrIDProductos.push(idT);
          }
      
          // console.log('json => ', json);
      
          let pro_id = arrIDProductos;
          this.formIDProductos.get('pro_id')?.setValue(pro_id);
      
          // console.log("tam pro_id", pro_id.length);
      
          if (pro_id.length == 0) {
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: '¡Factura Vacía!',
              text: 'No tiene productos para facturar ',
              timer: 2600,
              showConfirmButton: false,
            });
          } else {
            this.allService.postFacturar(json).subscribe(
              (data: any) => {
                this.banderaCard = false;
      
                Swal.close();
      
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'success',
                  title: 'Factura generada ',
                  text: data.rta.msg,
                  timer: 1600,
                  showConfirmButton: false,
                });
      
                // abrirModalCerrarOrden();
      
                this.banderaFacturar = false;
                this.banderaFacturarProducto = false;
                this.banderaAcciones = false;
                this.banderaBusqueda = false;
      
                // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
                // this.cerrarPlaneadorDetalle();
      
                this.facturadoProd = true;
      
                this.idFactura = data.rta.venta_id;
                if (this.idFactura) {
      
                  // console.log("enviado ",      this.formIDProductos.value);
                  
                  this.allService
                    .postG(
                      'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,
                      this.formIDProductos.value
                    )
                    .subscribe(
                      (data: any) => {
                        if (
                          this.facturadoProd == true && (this.totalServiciosC == 0 || this.facturadoS == 1)) {
                          abrirModalCerrarOrden();
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log("Caso 1");
                          
                        } else if (this.facturadoServ == true && this.facturadoProd == true ) {
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log("Caso 2");
                          abrirModalCerrarOrden();
                        } else if ( this.facturadoServ == true &&  (this.totalProductosC >= 1 || this.facturadoP == 0))  {
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = true;
                          // console.log("Caso 3");
                        }
      
                      },
                      (err) => {
      
                        this.facturadoProd = true;
                        if(this.facturadoProd = true && this.facturadoServ == true){
                 
                          
                          abrirModalCerrarOrden();
      
                        }else if(this.facturadoProd = true &&  this.facturadoS == 0){
                          // console.log('this.facturadoS => ', this.facturadoS);
                          // console.log('this.facturadoServ => ', this.facturadoServ ); 
                          this.banderaFacturarServicio = true;
                          this.banderaFacturarProducto = false;
                          // console.log('cerrado');
                            
                        }else if(this.facturadoProd = true && this.facturadoS == 1 ){
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log('cerrado2');
                          abrirModalCerrarOrden();
                        }else if(this.facturadoProd = true && this.facturadoServ == false){
                          this.banderaFacturarServicio = true;
                          this.banderaFacturarProducto = false;
                          // console.log("caso 3");
                        }         
                      }
                    );
                }
              },
              (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error, no se pudo guardar factura',
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
            );
          }
        }
      });


    }else {

    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = infAcceso[2][0].id;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;

    let arrIDProductos = new Array();
    for (let y = 0; y < arrDetalle.length; y++) {
      let idT = arrDetalle[y].Producto_codigo;
      arrIDProductos.push(idT);
    }

    // console.log('json => ', json);

    let pro_id = arrIDProductos;
    this.formIDProductos.get('pro_id')?.setValue(pro_id);

    // console.log("tam pro_id", pro_id.length);

    if (pro_id.length == 0) {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: '¡Factura Vacía!',
        text: 'No tiene productos para facturar ',
        timer: 2600,
        showConfirmButton: false,
      });
    } else {
      this.allService.postFacturar(json).subscribe(
        (data: any) => {
          this.banderaCard = false;

          Swal.close();

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Factura generada ',
            text: data.rta.msg,
            timer: 1600,
            showConfirmButton: false,
          });

          // abrirModalCerrarOrden();

          this.banderaFacturar = false;
          this.banderaFacturarProducto = false;
          this.banderaAcciones = false;
          this.banderaBusqueda = false;

          // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
          // this.cerrarPlaneadorDetalle();

          this.facturadoProd = true;

          this.idFactura = data.rta.venta_id;
          if (this.idFactura) {

            // console.log("enviado ",      this.formIDProductos.value);
            
            this.allService
              .postG(
                'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,
                this.formIDProductos.value
              )
              .subscribe(
                (data: any) => {
                  if (
                    this.facturadoProd == true && (this.totalServiciosC == 0 || this.facturadoS == 1)) {
                    abrirModalCerrarOrden();
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("Caso 1");
                    
                  } else if (this.facturadoServ == true && this.facturadoProd == true ) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("Caso 2");
                    abrirModalCerrarOrden();
                  } else if ( this.facturadoServ == true &&  (this.totalProductosC >= 1 || this.facturadoP == 0))  {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = true;
                    // console.log("Caso 3");
                  }

                },
                (err) => {

                  this.facturadoProd = true;
                  if(this.facturadoProd = true && this.facturadoServ == true){
           
                    
                    abrirModalCerrarOrden();

                  }else if(this.facturadoProd = true &&  this.facturadoS == 0){
                    // console.log('this.facturadoS => ', this.facturadoS);
                    // console.log('this.facturadoServ => ', this.facturadoServ ); 
                    this.banderaFacturarServicio = true;
                    this.banderaFacturarProducto = false;
                    // console.log('cerrado');
                      
                  }else if(this.facturadoProd = true && this.facturadoS == 1 ){
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log('cerrado2');
                    abrirModalCerrarOrden();
                  }else if(this.facturadoProd = true && this.facturadoServ == false){
                    this.banderaFacturarServicio = true;
                    this.banderaFacturarProducto = false;
                    // console.log("caso 3");
                  }         
                }
              );
          }
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, no se pudo guardar factura',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
    }
  }
  }
  facturarProductoPV() {
    if(this.verSeleccion ==''){

      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Seleccione punto de venta',
        text: 'Tiene que seleccionar un punto de eventa para generar la factura',
        confirmButtonColor: '#B5B5B5',
      });

    }else {



    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      title: 'info',
      text: 'Realizando Factura Productos, espere por favor',
    });
    Swal.showLoading();

    let pedido1 = this.pedidoProductos[0].productos;
    let item1: any;

    for (let x = 0; x < pedido1.length; x++) {
      if (pedido1[x][0].esservicio == 1) {
        item1 = pedido1[x];
        this.totalServicios.push(item1);
      }
    }

    this.totalServiciosC = this.totalServicios.length;
    let pedido = new Array();
    let item: any;
    for (let z = 0; z < pedido1.length; z++) {
      if (pedido1[z][0].esservicio == 0) {
        item = pedido1[z];
        pedido.push(item);
      }
    }
    let condicion = this.validarPrecios(pedido);
    if(condicion){
      Swal.fire({
        title: 'Factura incompleta',
        text: 'Falta de asignar precio a productos,¿Desea facturar la orden de todos modos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#B5B5B5',
        cancelButtonColor: '#F51F36',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Si, facturar',
      }).then((result) => {
        if (result.isConfirmed) {
          let tamArreglo = pedido.length;

          this.idOrden = this.informacionOrden[0].idOrden;
      
          //  DETALLE FACTURA
      
          let Producto_codigo = '';
          let itemcantidad = 1;
          let itempreciobruto = 1;
          let itemprecioxcantidadbruto = 1;
          let descuentofactporcent = 0;
          let descuentofactvalor = 0;
          let recargofactporcent = 0;
          let recargofactvalor = 0;
          //  ----------------------
          let itemprecioneto = 1;
          let itemprecioxcantidadneto = 1;
          let ivaporcent = 12;
          let ivavalitemprecioneto = 0;
          let itemprecioiva = 1;
          let ivavalprecioxcantidadneto = 0;
          let itemxcantidadprecioiva = 1;
          let estaAnulada = 0;
          let bodega_id = this.bodega_id;
          let tiposprecio_tipoprecio = '';
          let itembaseiva = 1;
          let totitembaseiva = 1;
          let iceporcent = null;
          let iceval = 0; /// TAMBIEN VA EN FACTURA
          let priceice = null;
          let totalpriceice = null;
          let totivaval = 0;
          let priceiva = 1;
          let totalpriceiva = 1;
          //  this.detalle= 0; // TAMBIEN VA EN FACTURA
          let meses_garantia = 0;
          let unidad = 0;
      
          //totalServicios
          let sts = 0;
      
          //TotalProductos
          let stp = 0;
      
          //Tarifas
          let tt12 = 0;
          let tt0 = 0;
          let tt8 = 0;
      
          //ARREGLO DETALLE
          const arrDetalle = new Array();
          let detalle = 0;
      
          let detalleProducto;
      
          for (let i = 0; i < tamArreglo; i++) {
            Producto_codigo = pedido[i][0].producto_id;
            itemcantidad = pedido[i][0].cant;
            itempreciobruto = pedido[i][0].itemprecio;
            itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
            itemprecioneto = itempreciobruto;
            itemprecioxcantidadneto = itemprecioxcantidadbruto;
            ivaporcent = pedido[i][0].ivaporcent;
            ivavalitemprecioneto = pedido[i][0].iva;
            itemprecioiva = itemcantidad * pedido[i][0].total;
            ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
            itemxcantidadprecioiva = itemprecioiva;
            bodega_id = pedido[i][0].bodega_id;
            tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
            itembaseiva = itempreciobruto;
            totitembaseiva = itemprecioxcantidadbruto;
            totivaval = ivavalprecioxcantidadneto;
            priceiva = pedido[i][0].total;
            totalpriceiva = itemcantidad * priceiva;
      
            if (pedido[i][0].esservicio == '1') {
              sts += itemcantidad * itempreciobruto;
            } else if (pedido[i][0].esservicio == '0') {
              stp += itemcantidad * itempreciobruto;
            }
      
            if ((ivaporcent == 12)) {
              // console.log("aqio",tt12);
              
              tt12 += itemcantidad * itempreciobruto;
            } else if ((ivaporcent == 0)) {
              // console.log("en cero");
              tt0 += itemcantidad * itempreciobruto;
            } else if ((ivaporcent == 8)) {
              tt8 += itemcantidad * itempreciobruto;
            }
      
            // let detalle = 0;
            detalleProducto = {
              Producto_codigo,
              itemcantidad,
              itempreciobruto,
              itemprecioxcantidadbruto,
              descuentofactporcent,
              descuentofactvalor,
              recargofactporcent,
              recargofactvalor,
              itemprecioneto,
              itemprecioxcantidadneto,
              ivaporcent,
              ivavalitemprecioneto,
              itemprecioiva,
              ivavalprecioxcantidadneto,
              itemxcantidadprecioiva,
              estaAnulada,
              bodega_id,
              tiposprecio_tipoprecio,
              itembaseiva,
              totitembaseiva,
              iceporcent,
              iceval,
              priceice,
              totalpriceice,
              totivaval,
              priceiva,
              totalpriceiva,
              detalle,
              meses_garantia,
              unidad,
            };
            arrDetalle.push(detalleProducto);
          }
      
          // =================== FACTURA
      
          let tival = 0;
      
          // console.log('que es esto',arrDetalle);
      
          for (let i = 0; i < arrDetalle.length; i++) {
            tival = tival + arrDetalle[i].totivaval;
          }
      
          let ivaval = tival;
      
          let creditoval = 0; //ya
          let recargovalor = 0; //ya
          let descuentovalor = 0;
      
          let baseiva = tt12;
          let nro_orden = '';
          let servicios = 0;
          let subtbrutoservicios = sts;
          let subtbrutobienes = stp;
          let tarifadocebruto = baseiva;
          let tarifacerobruto = tt0;
          let subtotalBruto = subtbrutobienes + subtbrutoservicios;
          let subtotalNeto = tarifacerobruto + tarifadocebruto;
          // let ivaval = baseiva * (0.12);
          let totalCompra = subtotalNeto + ivaval;
          let observaciones = '';
          let valorrecibidoefectivo = 0;
          let valorcambio = 0;
          let subtnetobienes = subtbrutobienes;
          let subtnetoservicios = subtbrutoservicios;
          let tarifaceroneto = tarifacerobruto;
          let tarifadoceneto = tarifadocebruto;
          let efectivoval = 0;
      
          let factura = {
            creditoval,
            recargovalor,
            subtotalBruto,
            descuentovalor,
            subtotalNeto,
            ivaval,
            totalCompra,
            observaciones,
            valorrecibidoefectivo,
            valorcambio,
            tarifacerobruto,
            tarifaceroneto,
            tarifadocebruto,
            tarifadoceneto,
            subtbrutobienes,
            subtbrutoservicios,
            subtnetobienes,
            subtnetoservicios,
            iceval,
            efectivoval,
            baseiva,
            nro_orden,
            servicios,
          };
      
          const dato = localStorage.getItem('Inflogueo');
      
          if (dato) {
            this.datosLocalStorage = JSON.parse(dato);
          } else console.log('ERROR');
      
          let infAcceso = Object.values(this.datosLocalStorage);
          let user_id = infAcceso[1][0].id;
      
          // this.user_id = user_id;
          let puntoventa_id = this.verSeleccion;
          this.puntoventa_id = puntoventa_id;
          let type = 'prefactura';
          let PersonaComercio_cedulaRuc =
            this.informacionOrden[0].PersonaComercio_cedulaRuc;
      
          let efecval = totalCompra;
          let fecha_vence = '';
      
          let cliente = {
            PersonaComercio_cedulaRuc,
          };
      
          let json = {
            factura,
            detalle: arrDetalle,
            user_id,
            puntoventa_id,
            type,
            cliente,
            efectivo_val: efecval,
            credito_val: creditoval,
            fecha_vence,
          };
      
          let estadoF = this.elements2[0].usuario[0].facturado;
      
          let arrIDProductos = new Array();
          for (let y = 0; y < arrDetalle.length; y++) {
            let idT = arrDetalle[y].Producto_codigo;
            arrIDProductos.push(idT);
          }

          // Swal.close();
          // console.log('json => ', json);
      
          let pro_id = arrIDProductos;
          this.formIDProductos.get('pro_id')?.setValue(pro_id);
      
          // console.log("tam pro_id", pro_id.length);
      
          if (pro_id.length == 0) {
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: '¡Factura Vacía!',
              text: 'No tiene productos para facturar ',
              timer: 2600,
              showConfirmButton: false,
            });
          } else {
            this.allService.postFacturar(json).subscribe(
              (data: any) => {
                this.banderaCard = false;
      
                Swal.close();
      
                Swal.fire({
                  allowOutsideClick: false,
                  icon: 'success',
                  title: 'Factura generada ',
                  text: data.rta.msg,
                  timer: 1600,
                  showConfirmButton: false,
                });
      
                // abrirModalCerrarOrden();
      
                this.banderaFacturar = false;
                this.banderaFacturarProducto = false;
                this.banderaAcciones = false;
                this.banderaBusqueda = false;
      
                // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
                // this.cerrarPlaneadorDetalle();
      
                this.facturadoProd = true;
      
                this.idFactura = data.rta.venta_id;
                if (this.idFactura) {
      
                  // console.log("enviado ",      this.formIDProductos.value);
                  
                  this.allService
                    .postG(
                      'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura, this.formIDProductos.value
                    )
                    .subscribe(
                      (data: any) => {
                        if (
                          this.facturadoProd == true && (this.totalServiciosC == 0 || this.facturadoS == 1)) {
                          abrirModalCerrarOrden();
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log("Caso 1");
                          
                        } else if (this.facturadoServ == true && this.facturadoProd == true ) {
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log("Caso 2");
                          abrirModalCerrarOrden();
                        } else if ( this.facturadoServ == true &&  (this.totalProductosC >= 1 || this.facturadoP == 0))  {
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = true;
                          // console.log("Caso 3");
                        }
      
                      },
                      (err) => {
      
                        this.facturadoProd = true;
                        if(this.facturadoProd = true && this.facturadoServ == true){
                 
                          
                          abrirModalCerrarOrden();
      
                        }else if(this.facturadoProd = true &&  this.facturadoS == 0){
                          // console.log('this.facturadoS => ', this.facturadoS);
                          // console.log('this.facturadoServ => ', this.facturadoServ ); 
                          this.banderaFacturarServicio = true;
                          this.banderaFacturarProducto = false;
                          // console.log('cerrado');
                            
                        }else if(this.facturadoProd = true && this.facturadoS == 1 ){
                          this.banderaFacturarServicio = false;
                          this.banderaFacturarProducto = false;
                          // console.log('cerrado2');
                          abrirModalCerrarOrden();
                        }else if(this.facturadoProd = true && this.facturadoServ == false){
                          this.banderaFacturarServicio = true;
                          this.banderaFacturarProducto = false;
                          // console.log("caso 3");
                        }         
                      }
                    );
                }
              },
              (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error, no se pudo guardar factura',
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
            );
          }
        }
      });


    }else {

    let tamArreglo = pedido.length;

    this.idOrden = this.informacionOrden[0].idOrden;

    //  DETALLE FACTURA

    let Producto_codigo = '';
    let itemcantidad = 1;
    let itempreciobruto = 1;
    let itemprecioxcantidadbruto = 1;
    let descuentofactporcent = 0;
    let descuentofactvalor = 0;
    let recargofactporcent = 0;
    let recargofactvalor = 0;
    //  ----------------------
    let itemprecioneto = 1;
    let itemprecioxcantidadneto = 1;
    let ivaporcent = 12;
    let ivavalitemprecioneto = 0;
    let itemprecioiva = 1;
    let ivavalprecioxcantidadneto = 0;
    let itemxcantidadprecioiva = 1;
    let estaAnulada = 0;
    let bodega_id = this.bodega_id;
    let tiposprecio_tipoprecio = '';
    let itembaseiva = 1;
    let totitembaseiva = 1;
    let iceporcent = null;
    let iceval = 0; /// TAMBIEN VA EN FACTURA
    let priceice = null;
    let totalpriceice = null;
    let totivaval = 0;
    let priceiva = 1;
    let totalpriceiva = 1;
    //  this.detalle= 0; // TAMBIEN VA EN FACTURA
    let meses_garantia = 0;
    let unidad = 0;

    //totalServicios
    let sts = 0;

    //TotalProductos
    let stp = 0;

    //Tarifas
    let tt12 = 0;
    let tt0 = 0;
    let tt8 = 0;

    //ARREGLO DETALLE
    const arrDetalle = new Array();
    let detalle = 0;

    let detalleProducto;

    for (let i = 0; i < tamArreglo; i++) {
      Producto_codigo = pedido[i][0].producto_id;
      itemcantidad = pedido[i][0].cant;
      itempreciobruto = pedido[i][0].itemprecio;
      itemprecioxcantidadbruto = itemcantidad * itempreciobruto;
      itemprecioneto = itempreciobruto;
      itemprecioxcantidadneto = itemprecioxcantidadbruto;
      ivaporcent = pedido[i][0].ivaporcent;
      ivavalitemprecioneto = pedido[i][0].iva;
      itemprecioiva = itemcantidad * pedido[i][0].total;
      ivavalprecioxcantidadneto = itemcantidad * ivavalitemprecioneto;
      itemxcantidadprecioiva = itemprecioiva;
      bodega_id = pedido[i][0].bodega_id;
      tiposprecio_tipoprecio = pedido[i][0].tiposprecio;
      itembaseiva = itempreciobruto;
      totitembaseiva = itemprecioxcantidadbruto;
      totivaval = ivavalprecioxcantidadneto;
      priceiva = pedido[i][0].total;
      totalpriceiva = itemcantidad * priceiva;

      if (pedido[i][0].esservicio == '1') {
        sts += itemcantidad * itempreciobruto;
      } else if (pedido[i][0].esservicio == '0') {
        stp += itemcantidad * itempreciobruto;
      }

      if ((ivaporcent == 12)) {
        // console.log("aqio",tt12);
        
        tt12 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 0)) {
        // console.log("en cero");
        tt0 += itemcantidad * itempreciobruto;
      } else if ((ivaporcent == 8)) {
        tt8 += itemcantidad * itempreciobruto;
      }

      // let detalle = 0;
      detalleProducto = {
        Producto_codigo,
        itemcantidad,
        itempreciobruto,
        itemprecioxcantidadbruto,
        descuentofactporcent,
        descuentofactvalor,
        recargofactporcent,
        recargofactvalor,
        itemprecioneto,
        itemprecioxcantidadneto,
        ivaporcent,
        ivavalitemprecioneto,
        itemprecioiva,
        ivavalprecioxcantidadneto,
        itemxcantidadprecioiva,
        estaAnulada,
        bodega_id,
        tiposprecio_tipoprecio,
        itembaseiva,
        totitembaseiva,
        iceporcent,
        iceval,
        priceice,
        totalpriceice,
        totivaval,
        priceiva,
        totalpriceiva,
        detalle,
        meses_garantia,
        unidad,
      };
      arrDetalle.push(detalleProducto);
    }

    // =================== FACTURA

    let tival = 0;

    // console.log('que es esto',arrDetalle);

    for (let i = 0; i < arrDetalle.length; i++) {
      tival = tival + arrDetalle[i].totivaval;
    }

    let ivaval = tival;

    let creditoval = 0; //ya
    let recargovalor = 0; //ya
    let descuentovalor = 0;

    let baseiva = tt12;
    let nro_orden = '';
    let servicios = 0;
    let subtbrutoservicios = sts;
    let subtbrutobienes = stp;
    let tarifadocebruto = baseiva;
    let tarifacerobruto = tt0;
    let subtotalBruto = subtbrutobienes + subtbrutoservicios;
    let subtotalNeto = tarifacerobruto + tarifadocebruto;
    // let ivaval = baseiva * (0.12);
    let totalCompra = subtotalNeto + ivaval;
    let observaciones = '';
    let valorrecibidoefectivo = 0;
    let valorcambio = 0;
    let subtnetobienes = subtbrutobienes;
    let subtnetoservicios = subtbrutoservicios;
    let tarifaceroneto = tarifacerobruto;
    let tarifadoceneto = tarifadocebruto;
    let efectivoval = 0;

    let factura = {
      creditoval,
      recargovalor,
      subtotalBruto,
      descuentovalor,
      subtotalNeto,
      ivaval,
      totalCompra,
      observaciones,
      valorrecibidoefectivo,
      valorcambio,
      tarifacerobruto,
      tarifaceroneto,
      tarifadocebruto,
      tarifadoceneto,
      subtbrutobienes,
      subtbrutoservicios,
      subtnetobienes,
      subtnetoservicios,
      iceval,
      efectivoval,
      baseiva,
      nro_orden,
      servicios,
    };

    const dato = localStorage.getItem('Inflogueo');

    if (dato) {
      this.datosLocalStorage = JSON.parse(dato);
    } else console.log('ERROR');

    let infAcceso = Object.values(this.datosLocalStorage);
    let user_id = infAcceso[1][0].id;

    // this.user_id = user_id;
    let puntoventa_id = this.verSeleccion;
    this.puntoventa_id = puntoventa_id;
    let type = 'prefactura';
    let PersonaComercio_cedulaRuc =
      this.informacionOrden[0].PersonaComercio_cedulaRuc;

    let efecval = totalCompra;
    let fecha_vence = '';

    let cliente = {
      PersonaComercio_cedulaRuc,
    };

    let json = {
      factura,
      detalle: arrDetalle,
      user_id,
      puntoventa_id,
      type,
      cliente,
      efectivo_val: efecval,
      credito_val: creditoval,
      fecha_vence,
    };

    let estadoF = this.elements2[0].usuario[0].facturado;

    let arrIDProductos = new Array();
    for (let y = 0; y < arrDetalle.length; y++) {
      let idT = arrDetalle[y].Producto_codigo;
      arrIDProductos.push(idT);
    }
//  Swal.close();
    // console.log('json => ', json);

    let pro_id = arrIDProductos;
    this.formIDProductos.get('pro_id')?.setValue(pro_id);

    // console.log("tam pro_id", pro_id.length);

    if (pro_id.length == 0) {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: '¡Factura Vacía!',
        text: 'No tiene productos para facturar ',
        timer: 2600,
        showConfirmButton: false,
      });
    } else {
      this.allService.postFacturar(json).subscribe(
        (data: any) => {
          this.banderaCard = false;

          Swal.close();

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: 'Factura generada ',
            text: data.rta.msg,
            timer: 1600,
            showConfirmButton: false,
          });

          // abrirModalCerrarOrden();

          this.banderaFacturar = false;
          this.banderaFacturarProducto = false;
          this.banderaAcciones = false;
          this.banderaBusqueda = false;

          // console.log("THIS BANDERA PADRE HIJO ", this.banderaHijoaPadre);
          // this.cerrarPlaneadorDetalle();

          this.facturadoProd = true;

          this.idFactura = data.rta.venta_id;
          if (this.idFactura) {

            // console.log("enviado ",      this.formIDProductos.value);
            
            this.allService
              .postG(
                'orden_abierta/add_factura_prod_ser/id/'+this.idOrden+'/fv/'+this.idFactura,this.formIDProductos.value
              )
              .subscribe(
                (data: any) => {
                  if (
                    this.facturadoProd == true && (this.totalServiciosC == 0 || this.facturadoS == 1)) {
                    abrirModalCerrarOrden();
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("Caso 1");
                    
                  } else if (this.facturadoServ == true && this.facturadoProd == true ) {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log("Caso 2");
                    abrirModalCerrarOrden();
                  } else if ( this.facturadoServ == true &&  (this.totalProductosC >= 1 || this.facturadoP == 0))  {
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = true;
                    // console.log("Caso 3");
                  }

                },
                (err) => {

                  this.facturadoProd = true;
                  if(this.facturadoProd = true && this.facturadoServ == true){
           
                    
                    abrirModalCerrarOrden();

                  }else if(this.facturadoProd = true &&  this.facturadoS == 0){
                    // console.log('this.facturadoS => ', this.facturadoS);
                    // console.log('this.facturadoServ => ', this.facturadoServ ); 
                    this.banderaFacturarServicio = true;
                    this.banderaFacturarProducto = false;
                    // console.log('cerrado');
                      
                  }else if(this.facturadoProd = true && this.facturadoS == 1 ){
                    this.banderaFacturarServicio = false;
                    this.banderaFacturarProducto = false;
                    // console.log('cerrado2');
                    abrirModalCerrarOrden();
                  }else if(this.facturadoProd = true && this.facturadoServ == false){
                    this.banderaFacturarServicio = true;
                    this.banderaFacturarProducto = false;
                    // console.log("caso 3");
                  }         
                }
              );
          }
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error, no se pudo guardar factura',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      );
    }
  }
}
  }
  // ========================================== METODOS BOTONERA =============================================

  getNombreEmpresa() {
    const dato = localStorage.getItem('api_system');
    let empresa = '';
    if (dato) {
      empresa = dato;
    } else console.log('ERROR');
    let emp = empresa.slice(21, -1);

    this.nombreEmpresa = emp;

    return this.nombreEmpresa;
  }
  // ============================= METODO ENVIAR WHATSAPP ==============================

  // sendWhatsApp(id:any) {

  // if(this.tamPyS != 0){

  //   Swal.fire({
  //     allowOutsideClick:false,
  //     icon:'info',
  //     title:'info',
  //     text:'Envíando WhatsApp, espere por favor'

  //     });
  //     Swal.showLoading();
  //     let tipo = 'prefactura';

  // //  this.allService.getAl('hacer_pdf/enviar_wa?oa_id='+id+'&tipo='+tipo).then((data:any)=>{
  //   this.allService.sendWhatsApp(+id,tipo).then((data:any)=>{

  //   console.log("REspuesta => ", data);
  //   Swal.close();
  //   if(data==null){
  //     Swal.fire({
  //       allowOutsideClick: false,
  //       icon: 'error',
  //       title: '¡No se pudo enviar WhatsApp!',
  //       text: "Usuario no tiene registrado un número de teléfono",

  //     })
  //   }else{
  //     Swal.close();
  //     window.open(data, '_blank');
  //   }
  //   })

  //   // let tipo = 'prefactura';
  //   // this.allService.sendWhatsApp(id,tipo).then((data:any)=>{
  //   //     window.open(data, '_blank');
  //   //  })
  // }else{
  //   Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'No se puede enviar WhatsApp de una prefactura vacía',
  //           timer: 2000
  //     })
  // }
  // }
  sendWhatsApp(id: any) {
    if (this.tamPyS != 0) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'info',
        text: 'Envíando WhatsApp, espere por favor',
      });
      Swal.showLoading();
      let tipo = 'prefactura';

      //  this.allService.getAl('hacer_pdf/enviar_wa?oa_id='+id+'&tipo='+tipo).then((data:any)=>{
      this.allService.sendWhatsApp(+id, tipo).then((data: any) => {
        // console.log("REspuesta => ", data);
        Swal.close();
        if (data == false) {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: '¡No se pudo enviar WhatsApp!',
            text: 'Usuario no tiene registrado un número de teléfono',
            confirmButtonColor: '#818181',
          });
        } else {
          Swal.close();
          window.open(data, '_blank');
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede enviar WhatsApp de una prefactura vacía',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  banderaCerrarOrden(event: any) {
    this.banderaHijoaPadre = event;

    // console.log("EVENT", event);
    this.CDP.emit(this.banderaHijoaPadre);
  }

  // ======================== Enviar CORREO ==========================

  enviarCorreoPrefactura(id: any) {
    // console.log(this.tamPyS);

    if (this.tamPyS != 0) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        title: 'info',
        text: 'Envíando correo, espere por favor',
      });
      Swal.showLoading();

      let tipo = 'prefactura';
      let accion = 'send';
      let empresa = this.getNombreEmpresa();

      // console.log("nom empresa", empresa);

      this.allService
        .getAl(
          'hacer_pdf/' +
            accion +
            '?oa_id=' +
            id +
            '&tipo=' +
            tipo +
            '&emp=' +
            empresa
        )
        .then((data: any) => {
          if (data.rta == undefined) {
            Swal.close();
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: 'Prefactura envíada al correo',
              html: 'Se ha enviado Prefactura al correo:'+'<strong>'+ this.informacionOrden[0].correo +'</strong>', 
         
              timer: 3000,
              showConfirmButton: false,
            });
            // text: 'Se ha enviado cotización al correo:'+'<strong>'+ this.informacionOrden[0].correo +'</strong>',
          } else {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'error',
              title: '¡Correo no se pudo enviar!',
              text: 'Cliente no tiene registrado un correo electrónico',
              confirmButtonColor: '#818181',
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede enviar correo de una prefactura vacía',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  visualizarPDF(id: any) {
    let tipo = 'prefactura';
    let accion = 'ver';
    this.allService.getForOrden(id, tipo, accion).then((data: any) => {
      console.log(data);

      let url = data.slice(1);
      // console.log(url);
      // console.log(id);
      let link = this.allService.getUrlBaseTallerSINCORS();
      const a_target = this._router.serializeUrl(
        this._router.createUrlTree([link + url])
      );
      let r = a_target.slice(1);
      // console.log(r);
      window.open(r, '_blank');
    });
    let accion2 = 'delete';

    setTimeout(() => {
      this.allService.getForOrden(id, tipo, accion2).then((data: any) => {
        // console.log('SE EJECUTO',data);
      });
    }, 10000);
  }
}
