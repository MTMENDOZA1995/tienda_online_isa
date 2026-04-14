// js/FCompra.js
// ==========================================================================
// LÓGICA DE CHECKOUT Y ENVÍO DE PEDIDOS A WHATSAPP (CON POLÍTICA DINÁMICA)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Configuración Principal ---
    const WHATSAPP_NUMBER = "51952580740"; // Tu número de WhatsApp
    
    // Reglas de la Política de Envío
    const UMBRAL_ENVIO_GRATIS = 30.00;
    const TARIFA_CAJAMARCA_REGULAR = 5.00;
    const TARIFA_NACIONAL_BASE = 25.00; // Olva Express
    
    let costoEnvioActual = 0; 
    let tipoEnvioTexto = "Por calcular";
    
    // --- Selectores del DOM ---
    const checkoutItemList = document.getElementById('checkout-item-list');
    const subtotalElem = document.getElementById('checkout-subtotal');
    const shippingElem = document.getElementById('checkout-shipping');
    const finalTotalElems = [document.getElementById('checkout-final-total'), document.getElementById('sticky-final-total')];
    
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const regionSelect = document.getElementById('region'); // El selector de Departamento

    // --- 1. Renderizar la vista del Checkout ---
    window.renderCheckoutPage = () => {
        const cart = window.appCart || [];
        
        if (!checkoutItemList) return;

        checkoutItemList.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            checkoutItemList.innerHTML = `<div style="text-align: center; padding: 20px; color: #888; font-size: 13px;">Tu carrito está vacío. <br><br> <a href="Productos.html" style="color:#6cc82a; font-weight:bold; text-decoration:none;">Ir al catálogo</a></div>`;
            
            subtotalElem.textContent = "S/ 0.00";
            shippingElem.textContent = "S/ 0.00";
            finalTotalElems.forEach(el => el.textContent = "S/ 0.00");
            
            if (placeOrderBtn) {
                placeOrderBtn.disabled = true;
                placeOrderBtn.style.backgroundColor = "#ccc";
            }
            return;
        }

        // Renderizar Ítems
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            let variantText = [];
            if (item.model && item.model !== "Unico") variantText.push(item.model);
            if (item.color && item.color !== "Unico") variantText.push(item.color);
            if (item.size && item.size !== "Unico") variantText.push(item.size);
            const variantHTML = variantText.length > 0 ? `<div class="checkout-item-variant">${variantText.join(' - ')}</div>` : '';

            const row = document.createElement('div');
            row.className = 'checkout-item-row';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    ${variantHTML}
                    <div class="checkout-item-price-qty">
                        <span class="checkout-item-qty">Cant: ${item.quantity}</span>
                        <span class="checkout-item-price">${window.formatCurrency(itemTotal)}</span>
                    </div>
                </div>
                <button onclick="window.removeFromCart(${index})" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:16px; padding:5px;" aria-label="Eliminar">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            checkoutItemList.appendChild(row);
        });

        // --- REGLAS DE NEGOCIO DINÁMICAS (Según Política de Envío) ---
        const regionSeleccionada = regionSelect ? regionSelect.value : "";

        if (regionSeleccionada === "cajamarca") {
            if (subtotal >= UMBRAL_ENVIO_GRATIS) {
                costoEnvioActual = 0;
                tipoEnvioTexto = "Despacho Domicilio (Cajamarca)";
                shippingElem.innerHTML = `<span style="color:#6cc82a; font-weight:700;">¡GRATIS!</span>`;
            } else {
                costoEnvioActual = TARIFA_CAJAMARCA_REGULAR;
                tipoEnvioTexto = "Despacho Regular (Cajamarca)";
                shippingElem.textContent = window.formatCurrency(costoEnvioActual);
            }
        } else if (regionSeleccionada === "lima" || regionSeleccionada === "otros") {
            costoEnvioActual = TARIFA_NACIONAL_BASE;
            tipoEnvioTexto = "Olva Express / Agencia (Nacional)";
            shippingElem.innerHTML = `${window.formatCurrency(costoEnvioActual)} <small style="font-size:10px; color:#888;">(Base)</small>`;
        } else {
            // Si el cliente aún no elige región
            costoEnvioActual = 0;
            tipoEnvioTexto = "Por calcular";
            shippingElem.innerHTML = `<span style="font-size:11px; color:#888;">Elige departamento</span>`;
        }

        // Actualizar Totales
        const finalTotal = subtotal + costoEnvioActual;

        if (subtotalElem) subtotalElem.textContent = window.formatCurrency(subtotal);
        
        finalTotalElems.forEach(el => {
            if (el) el.textContent = window.formatCurrency(finalTotal);
        });

        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.style.backgroundColor = "#6cc82a";
        }
    };

    // --- Escuchar cambios en el selector de región para actualizar precio en vivo ---
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            window.renderCheckoutPage();
        });
    }

    // --- 2. Lógica de Envío a WhatsApp ---
    const sendOrderToWhatsApp = (customerData) => {
        const cart = window.appCart;
        if (!cart || cart.length === 0) return;

        let subtotal = 0;
        let text = `🛒 *NUEVO PEDIDO - IMPORTACIONES SOSTENIBLES*\n\n`;
        
        text += `👤 *DATOS DEL CLIENTE*\n`;
        text += `Nombre: ${customerData.name}\n`;
        text += `Teléfono: ${customerData.phone}\n`;
        text += `Email: ${customerData.email}\n`;
        text += `Dirección: ${customerData.address}\n`;
        text += `Lugar: ${customerData.city}, ${customerData.region.toUpperCase()}\n`;
        
        let paymentStr = "Efectivo Contra Entrega";
        if (customerData.payment === "yape") paymentStr = "Yape / Plin";
        if (customerData.payment === "tarjeta") paymentStr = "Pago con Tarjeta (Link solicitado)";
        text += `💳 Método de Pago: *${paymentStr}*\n`;
        
        if (customerData.comments) {
            text += `📝 Notas: ${customerData.comments}\n`;
        }

        text += `\n📦 *PRODUCTOS*\n`;
        
        cart.forEach((item, index) => {
            subtotal += (item.price * item.quantity);
            text += `${index + 1}. ${item.name}\n`;
            
            let variants = [];
            if (item.model !== "Unico") variants.push(item.model);
            if (item.color !== "Unico") variants.push(item.color);
            if (item.size !== "Unico") variants.push(item.size);
            if (variants.length > 0) text += `   Opciones: ${variants.join(' - ')}\n`;
            
            text += `   Cant: ${item.quantity} x ${window.formatCurrency(item.price)}\n`;
        });

        const finalTotal = subtotal + costoEnvioActual;
        let textoEnvioWP = costoEnvioActual === 0 ? "¡GRATIS!" : window.formatCurrency(costoEnvioActual);
        
        // Agregar nota para envíos nacionales en el ticket de WP
        if (customerData.region !== "cajamarca") {
            textoEnvioWP += " (Tarifa Base Nacional)";
        }

        text += `\n📊 *RESUMEN DE COMPRA*\n`;
        text += `Subtotal: ${window.formatCurrency(subtotal)}\n`;
        text += `Envío: ${textoEnvioWP}\n`;
        text += `Tipo de Envío: ${tipoEnvioTexto}\n`;
        text += `*TOTAL A PAGAR: ${window.formatCurrency(finalTotal)}*\n`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

        window.open(whatsappUrl, '_blank');

        // Vaciar carrito
        window.appCart = [];
        window.saveCart();
        window.renderCheckoutPage();
        
        alert("¡Tu pedido se está enviando por WhatsApp! Gracias por tu compra.");
        window.location.href = "index.html"; 
    };

    // --- 3. Validación y Evento de Confirmación ---
    if (placeOrderBtn && checkoutForm) {
        placeOrderBtn.addEventListener("click", () => {
            if (checkoutForm.reportValidity()) {
                
                if (window.appCart.length === 0) {
                    alert("Tu carrito está vacío.");
                    return;
                }

                const customerData = {
                    name: document.getElementById('full-name').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    address: document.getElementById('address').value.trim(),
                    region: document.getElementById('region').value.trim(),
                    city: document.getElementById('city').value.trim(),
                    comments: document.getElementById('comments').value.trim(),
                    payment: document.querySelector('input[name="paymentMethod"]:checked').value
                };

                if(confirm("¿Confirmas que deseas enviar tu pedido?")) {
                    sendOrderToWhatsApp(customerData);
                }

            }
        });
    }

    // --- Iniciar Renderizado ---
    window.renderCheckoutPage();
});
