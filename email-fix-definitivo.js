// SOLUCION DEFINITIVA PARA EMAIL - Compatible con Edge
// Añadir este script al final de catalogo.html antes de </body>

function enviarPorEmail() {
    // Obtener productos del carrito (ejemplo hardcoded, ajustar según tu carrito real)
    const productos = [
        { nombre: 'COCA-COLA', envase: '24 botellas', precio: 25.44, cantidad: 2 },
        { nombre: 'FANTA', envase: '24 botellas', precio: 25.44, cantidad: 1 }
    ];

    if (productos.length === 0) {
        alert('El carrito esta vacio');
        return;
    }

    // Asunto del email
    const asunto = 'Propuesta de Pedido - Coca-Cola';

    // Cuerpo del email usando %0D%0A para saltos de linea (compatible Edge)
    let cuerpo = 'Hola,%0D%0A%0D%0A';
    cuerpo += 'Adjunto te envio la propuesta de precios:%0D%0A%0D%0A';

    let total = 0;
    productos.forEach(function (prod) {
        const subtotal = prod.precio * prod.cantidad;
        total = total + subtotal;

        cuerpo += '- ' + prod.nombre + '%0D%0A';
        cuerpo += '  ' + prod.envase + ' x' + prod.cantidad + '%0D%0A';
        cuerpo += '  Precio: ' + subtotal.toFixed(2) + ' EUR%0D%0A%0D%0A';
    });

    cuerpo += 'TOTAL: ' + total.toFixed(2) + ' EUR%0D%0A%0D%0A';
    cuerpo += 'Quedo a tu disposicion.%0D%0A%0D%0A';
    cuerpo += 'Saludos cordiales';

    // Abrir cliente de correo
    const mailto = 'mailto:?subject=' + encodeURIComponent(asunto) + '&body=' + cuerpo;
    window.location.href = mailto;
}

// Usar: <button onclick="enviarPorEmail()">Enviar por Email</button>
