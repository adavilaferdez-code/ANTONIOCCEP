// INSTRUCCIONES: Reemplazar la función shareViaWhatsApp en catalogoproducto.jsx
// Busca la línea 617 y reemplaza toda la función con esta:

const shareViaEmail = () => {
    if (cart.length === 0) {
        if (window.showWarning) {
            window.showWarning('Carrito vacío', 'Añade productos antes de enviar');
        }
        return;
    }

    const subject = 'Propuesta de Pedido - Coca-Cola';

    let body = 'Hola,\n\n';
    body += 'Adjunto te envio la propuesta de precios y pedido que hemos revisado:\n\n';

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        body += `- ${item.name}\n`;
        body += `  ${item.envase} x${item.quantity}\n`;
        body += `  Precio: ${subtotal.toFixed(2)} EUR\n\n`;
    });

    body += `TOTAL: ${cartTotal.toFixed(2)} EUR\n\n`;
    body += 'Quedo a tu disposicion para cualquier consulta.\n\n';
    body += 'Saludos cordiales';

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
};

// NOTA: También necesitas cambiar el nombre de la función en el botón
// Busca donde dice onClick={shareViaWhatsApp} y cámbialo a onClick={shareViaEmail}
