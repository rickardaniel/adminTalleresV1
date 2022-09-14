function inputDecimal(){
    $('.decimales').on('input', function () {
        this.value = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
      });
}

function exportarReporteExcelOA(){
    head = [['Nro. Orden', 'Fecha   ', 'Cliente','Placa',' Marca', 'Km', ' Problema', 'Estado']]
    $("#tableCompany").tableHTMLExport({type:'csv',filename:'Reporte-General-Ordenes',head:head});
}
function exportarReporteExcelOC(){
    $("#tablaOrdenesCerradas").tableHTMLExport({type:'csv',filename:'Reporte-General-Cerradas.csv',ignoreColumns:'.acciones,#primero',ignoreRows: '#ultimo'});
}
function exportarReporteExcelC(){
    $("#tablaCotizaciones").tableHTMLExport({type:'csv',filename:'Reporte-General-Cotizaciones.csv',ignoreColumns:'.acciones,#primero',ignoreRows: '#ultimo'});
}
function exportarReporteExcelTEC(nombre){
    $("#tablaReporteTec").tableHTMLExport({type:'csv',filename:'Reporte-por-Tecnico-'+nombre+'.csv',ignoreColumns:'.acciones,#primero',ignoreRows: '#ultimo'});
}
function exportarReporteExcelOAG(){
    $("#tablaOrdenesAgendadas").tableHTMLExport({type:'csv',filename:'Reporte-General-agendadas'+'.csv',ignoreColumns:'.acciones,#primero',ignoreRows: '#ultimo'});
}

// EXPORTAR PDF

function titleCase(str) {
    str = str.toLowerCase(); 
    var words = str.split(" ");
  
    var capitalized = words.map(function(word) {
      return word.charAt(0).toUpperCase() + word.substring(1, word.length);
    });
    return capitalized.join(" ");
  }

function exportarReportePDF(reporte){
    var doc = new jsPDF()
    if(reporte[0].estado == '1.ACTIVO'){
        doc.setFontSize(22);
        doc.text(105, 20, 'Reporte órdenes abiertas',  'center' );
    }else if(reporte[0].estado == '2.ESPERA'){
        doc.setFontSize(22);
        doc.text(105, 20, 'Reporte órdenes en espera',  'center' );
    }else if(reporte[0].estado == '3.ENTREGADO'){
        doc.setFontSize(22);
        doc.text(105, 20, 'Reporte órdenes entregadas',  'center' );
    }
    head = [['Nro. Orden', 'Fecha   ', 'Cliente','Placa',' Marca', 'Km', ' Problema', 'Estado']]
      var boddyT = new Array;
      var el;
      var arr= new Array;
      var num ;
      var cliente;
      var fecha;
      var problema;
      var estado;
      var placa;
      var marca;
      var kilometraje;
    for (let i = 0; i < reporte.length; i++) { 
    el = reporte[i];
    num = reporte[i].no;
    cliente = titleCase(reporte[i].cliente);
    fecha = reporte[i].fecha;
    problema = reporte[i].problema;
    estado = reporte[i].estado;
    num = reporte[i].no;
    placa = reporte[i].arrayValAuto[0];
    marca = reporte[i].arrayValAuto[1]
    kilometraje = reporte[i].arrayValAuto[2]
boddyT=[num, fecha, cliente, placa,marca,kilometraje, problema, estado]
arr.push(boddyT);
}
     
    doc.autoTable({ tableLineWidth: 0.1, startY:25, head:head, body:arr})
    doc.save('ReporteOrdenes.pdf')
}

function exportarReportePDFOC(reporte){
    var doc = new jsPDF({
        orientation: 'l'
    })
        doc.setFontSize(15);
        doc.text(105, 20, 'Reporte órdenes cerradas',  'center' );
    
    head = [['Nro. Orden', 'Fecha', 'Cliente','Placa',' Marca', 'Km', 'Recomendación', 'Fecha Próximo Mantenimiento', 'Kms Próximo Mantenimiento','¿Quién Retiró?']]
      var boddyT = new Array;
      var el;
      var arr= new Array;
      var num ;
      var cliente;
      var fecha;
      var recomendacion;
      var placa;
      var marca;
      var kilometraje;
      var fpm;
      var kpm;
      var personaRetiro;

    for (let i = 0; i < reporte.length; i++) { 
    el = reporte[i];
    num = reporte[i].no;
    cliente = titleCase(reporte[i].cliente);
    fecha = reporte[i].fecha;
    recomendacion = reporte[i].problema;
    num = reporte[i].no;
    placa = reporte[i].arrayValAuto[0];
    marca = reporte[i].arrayValAuto[1];
    kilometraje = reporte[i].arrayValAuto[2];
    fpm =reporte[i].fechaProximoMan;
    kpm = reporte[i].kmProximoMan;
    personaRetiro = reporte[i].nombreRetira;

boddyT=[num, fecha, cliente, placa,marca,kilometraje, recomendacion, fpm, kpm, personaRetiro ]
arr.push(boddyT);
}
     
    doc.autoTable({ tableLineWidth: 0.1, startY:25, head:head, body:arr, })
    doc.save('ReporteCotizaciones.pdf')
}
function exportarReportePDFC(reporte){
    var doc = new jsPDF({
        orientation: 'p'
    })
        doc.setFontSize(22);
        doc.text(105, 20, 'Reporte Cotizaciones',  'center' );
    
    head = [['Nro. Cotización', 'Fecha', 'Cliente','Placa',' Marca', 'Km', 'Observación']]
      var boddyT = new Array;
      var el;
      var arr= new Array;
      var num ;
      var cliente;
      var fecha;
      var recomendacion;
      var placa;
      var marca;
      var kilometraje;
    //   var fpm;
    //   var kpm;
    //   var personaRetiro;

    for (let i = 0; i < reporte.length; i++) { 
    el = reporte[i];
    num = reporte[i].no;
    cliente = titleCase(reporte[i].cliente);
    fecha = reporte[i].fecha;
    recomendacion = reporte[i].problema;
    num = reporte[i].no;
    placa = reporte[i].arrayValAuto[0];
    marca = reporte[i].arrayValAuto[1];
    kilometraje = reporte[i].arrayValAuto[2];
    // fpm =reporte[i].fechaProximoMan;
    // kpm = reporte[i].kmProximoMan;
    // personaRetiro = reporte[i].nombreRetira;

boddyT=[num, fecha, cliente, placa,marca,kilometraje, recomendacion ]
arr.push(boddyT);
}
     
    doc.autoTable({ tableLineWidth: 0.1, startY:25, head:head, body:arr, })
    doc.save('ReporteCotizaciones.pdf')
}

function exportarReportePDFReporteTEC(reporte,sumaT,pagoT){
    // let nombreT = titleCase(tecnN);
    var doc = new jsPDF({
        orientation: 'l'
    })
        doc.setFontSize(15);
 
        doc.text(105, 20, 'Reporte trabajos realizados Total: $'+sumaT+' - Pago comisión: $'+pagoT, 'center' );
    head = [['Técnico', 'Nro. Orden', 'Fecha','Placa',' Marca', 'Km', 'Problema', 'Servicio','Precio']]
      var boddyT = new Array;
      var el;
      var arr= new Array;
      var num ;
    //   var cliente;
      var fecha;
      var problema;
      var placa;
      var marca;
      var kilometraje;
      var tecnico;
      let servicio;
      let valor;
      let total=0;


    for (let i = 0; i < reporte.length; i++) { 
    el = reporte[i];
    num = reporte[i].no;
    // cliente = titleCase(reporte[i].cliente);
    fecha = reporte[i].fecha;
    problema = reporte[i].problema;
    num = reporte[i].no;
    placa = reporte[i].arrayValAuto[0];
    marca = reporte[i].arrayValAuto[1];
    kilometraje = reporte[i].arrayValAuto[2];
    tecnico = titleCase(reporte[i].tecnico);
    for (let z = 0; z < reporte[i].arrServicio.length; z++) {
        servicio = reporte[i].arrServicio[z].productname;
        valor =reporte[i].arrServicio[z].costopromedio;
        total +=valor;
        boddyT=[tecnico, num, fecha, placa,marca,kilometraje, problema, servicio, valor]
        arr.push(boddyT);
    }


}
     
    doc.autoTable({ tableLineWidth: 0.1, startY:25, head:head, body:arr, })
    // doc.autoTable({ html: '#tablaReporteTec' })

    doc.save('ReportexTecnico'+tecnico+'.pdf')
}
function exportarReportePDFAG(reporte){
    var doc = new jsPDF({
        orientation: 'p'
    })
        doc.setFontSize(15);
        doc.text(105, 20, 'Reporte Órdenes Agendadas',  'center' );
    
    head = [['#Orden', 'Fecha', 'Cliente','Placa',' Marca', 'Km', 'Mantenimiento a Realizar']]
      var boddyT = new Array;
      var el;
      var arr= new Array;
      var num ;
      var cliente;
      var fecha;
      var recomendacion;
      var placa;
      var marca;
      var kilometraje;
    //   var fpm;
    //   var kpm;
    //   var personaRetiro;

    for (let i = 0; i < reporte.length; i++) { 
    el = reporte[i];
    num = el.id;
    cliente = titleCase(reporte[i].cliente);
    fecha = reporte[i].fechaProximoMan;
    recomendacion = reporte[i].problema;
    placa = reporte[i].arrayValAuto[0];
    marca = reporte[i].arrayValAuto[1];
    kilometraje = reporte[i].arrayValAuto[2];
    // fpm =reporte[i].fechaProximoMan;
    // kpm = reporte[i].kmProximoMan;
    // personaRetiro = reporte[i].nombreRetira;

boddyT=[num, fecha, cliente, placa,marca,kilometraje, recomendacion ]
// boddyT=[num, fecha, cliente, placa,marca,kilometraje, recomendacion, fpm, kpm, personaRetiro ]
arr.push(boddyT);
}
     
    doc.autoTable({ tableLineWidth: 0.1, startY:25, head:head, body:arr, })
    doc.save('ReporteOrdenesAgendadas.pdf')
}

function botonNav() {
    const boton = document.getElementById('boton-sidebar')
    const html = document.getElementById('html')
    const botonSidebarLeft = document.getElementById('boton-sidebar_left')
        // const botonSidebarLeft1 = document.getElementById('boton-sidebar_left1')
    const navbar = document.getElementById('content-buttons')
    const botonFixed = document.getElementById('content-button_fixed')
    const sidebar = document.getElementById('sidebar')
    const contenedor = document.getElementById('main')

    const ms = document.getElementById('dashbb')

    boton.addEventListener('click', function() {
        sidebar.classList.toggle('toggle');
        contenedor.classList.toggle('main');
        botonFixed.classList.remove('block');
        botonFixed.classList.add('align');
    })

    botonFixed.addEventListener('click', function() {
        sidebar.classList.toggle('toggle');
        contenedor.classList.toggle('main')
    })

    botonSidebarLeft.addEventListener('click', function() {
            html.classList.toggle('nav-open');


        })
  
    let scroll = document.documentElement.scrollTop
        // console.log(scroll)
    if (scroll >= 25) {
        navbar.classList.add('none');
        botonFixed.classList.add('block');
    } else {
        navbar.classList.remove('none');
        botonFixed.classList.remove('block');
    }

    function mostrarBotonFixed() {
        let scroll = document.documentElement.scrollTop
            // console.log(scroll)
        if (scroll >= 25) {
            navbar.classList.add('none');
            botonFixed.classList.add('block');
        } else {
            navbar.classList.remove('none');
            botonFixed.classList.remove('block');
        }
    }

    window.addEventListener('scroll', mostrarBotonFixed);
}


function slider6() {
    setTimeout(function() {
        // jQuery.noConflict();
        $('.items').slick({
            dots: true,
            infinite: false,
            speed: 300,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            responsive: [{
                    breakpoint: 1367,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 769,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 520,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }            
            ]
        });

        $('form.filter select').on('change', filter);
        $('#slidename').on("keyup", filter);

        $('.add-filter').on('click', function(event) {
            event.preventDefault()
            $('form.filter .filter-group').first().clone(true).insertBefore($('form.filter .add-filter'));
          });


    }, 1000);

    // $('.items').slick('refresh');
}

function filter() {
    // Declare variabl
    const filter = jQuery("#slidename").val();
    const category = $('.filter-group select').val();
  
    $('.items').slick('slickUnfilter');
    $('.items').slick('slickFilter', function() {
      let content = jQuery(this).find("a").text().toLowerCase();
  
      if (category == "*")
        return content.indexOf(filter) > -1;
      else
        return (content.indexOf(filter) > -1) && (jQuery(this).hasClass(category) == true);
  
    });
  }




// ==================== VALORES CONTROL DE CALIDAD ===========================

function valSeleccionado(i){
    var icheck1 = document.querySelector('input[name='+"flexRadioDefault"+i+']:checked').value
    let bandera = false;
    if(icheck1!=''){
        bandera = true;
    }
    return bandera;
}

function valSeleccionadoT(i,tam ){
    for (let j = 0; j < tam; j++) {
        var icheck = document.querySelector('input[name='+"flexRadioDefault"+i+']:checked').value
    }
    
    return icheck;
}

// =================== ABRIR CERRAR MODALES =============================

function cerrarModal(string) {
    $(function() {
        $(string).on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
    });
}
function cerrarModal1(string) {
    $(function() {
        $(string).modal("hide");
    });
}

function abrirModalCodigo(string){
    $(document).on('click', '#openMG', function() {
        $(string).modal('show');
    });
}
function abrirModalCodigo1(string){
    $(string).modal('show');
}

function abrirModalCerrarOrden(){
    $(function() {
        $('#bd-example-modal-xl').modal("show");
    });
}


// ================== YA NO USADOS =====================



// function valoresVehiculo(i, tam){
//     for (let j = 0; j < tam; j++) {
//         var x = document.getElementById("ingresoDatosVehiculo"+i).value;
//     }
//     return x;
// }
// function arregloValoresAuto2(i, tam) {
//     var array = []
//     for (let j = 0; j < tam; j++) {
//         var x = document.getElementById("floatingInputNombre2" + i).value;
//     }
//     return x;
// }
// function arregloValoresAuto(i, tam) {
//     var array = []
//     for (let j = 0; j < tam; j++) {
//         var x = document.getElementById("floatingInputNombre1" + i).value;
//     }
//     return x;
// }


// function slider6Refresh(){
//     // $('.items').not('.slick-initialized').slick()
//     $('.items').slick('refresh')
//     // $('.items')[0].slick.refresh()
//     console.log("entra acá JS");
//     // $('.slider').slick('reinit');
// }


// function focoAlias(i){
//     const $btnEnfocar = document.querySelector("#iAA"+i),
// 	$nombre = document.querySelector("#verAlias"+i);

// // En el click, enfocar
// $btnEnfocar.addEventListener("click", () => {
// 	$nombre.focus();
// });
// }




// function arregloAlias(i) {
//         var x = document.getElementById("verAlias" + i).value;
//     return x;   
// }
// function arregloAlias2(i) {
//         var x = document.getElementById("verAlias2" + i).value;         
//     return x;
// }



// function getStock(i){
//         var x = document.getElementById("stock"+i).value;
//         return x;
// }




// ============================ OBTENER VALORES DE LOS PRODUCTOS =======================================
// function getPrecioItem(i) {
//     var x = document.getElementById("precioItem" + i).value;   
      
//     var x1 = x.replace(',', '.');    
//     // console.log('precio', x1);
//     return x1;
// }

// =================== DESPLAZAMIENTO VERTICAL ====================

// function SelectDefecto(){
//     $("#BCU").focus();
// }


// function arregloValoresCantidad(i, tam) {
//     for (let j = 0; j < tam; j++) {
//         var x = document.getElementById("cantidad" + i).value;
//     }
//     return x;
// }
