// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM de la página de Checkout ---
    const checkoutItemList = document.getElementById('checkout-item-list'); // tbody de la tabla de resumen de items
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutShipping = document.getElementById('checkout-shipping');
    const checkoutFinalTotal = document.getElementById('checkout-final-total');
    const placeOrderBtn = document.getElementById('place-order-btn'); // Botón "Realizar Pedido"
    const checkoutForm = document.getElementById('checkout-form');     // El formulario completo
    const paymentNote = document.querySelector('.payment-note'); // Nota para el método de pago Izipay

    // --- Configuración (para mensajes y números específicos de checkout.js) ---
    const WHATSAPP_NUMBER = "51952580740"; // Número de WhatsApp de destino (ej. '51952580740' para Perú)
    const THANK_YOU_MESSAGE_FINAL = "✅ ¡Tu pedido ha sido enviado con éxito! Te contactaremos pronto para confirmar tu compra. ¡Gracias por tu confianza!";
    const CONFIRM_PROMPT_CHECKOUT = "\n\n¿Deseas enviar este pedido con tus datos de contacto por WhatsApp para confirmar tu compra?";
    const DUMMY_IZIPAY_LINK = "https://example.com/izipay-secure-payment-page"; // REEMPLAZAR CON LINK REAL DE IZIPAY

    // --- Funciones de Utilidad y Renderizado Específicas de Checkout ---

    /**
     * Renderiza el resumen de los productos del carrito en la tabla de checkout.
     * Calcula y muestra el subtotal, costo de envío y total final.
     */
    const renderCheckoutSummary = () => {
        // Validación de que window.loadCart exista (desde cart.js)
        if (typeof window.loadCart !== 'function') {
            console.error("renderCheckoutSummary: window.loadCart no está definido. Asegúrate de que js/cart.js esté cargado ANTES de js/checkout.js.");
            if (checkoutItemList) { // Si el elemento existe, mostrar un mensaje de error claro al usuario
                checkoutItemList.innerHTML = '<tr><td colspan="3" class="empty-cart-message" style="color: red;">Error: No se pudo cargar la funcionalidad del carrito. Recargue la página.</td></tr>';
            }
            if (placeOrderBtn) placeOrderBtn.disabled = true; // Deshabilitar botón para evitar acciones
            return;
        }
        
        window.loadCart(); // Carga el carrito global de cart.js (ahora sabemos que existe)

        // Verificación defensiva de que los elementos DOM del resumen existan
        if (!checkoutItemList || !checkoutSubtotal || !checkoutShipping || !checkoutFinalTotal) {
            console.error("renderCheckoutSummary: Uno o más selectores DOM para el resumen de checkout no se encontraron. Verifique los IDs en checkout.html. Elementos faltantes:", { checkoutItemList, checkoutSubtotal, checkoutShipping, checkoutFinalTotal });
            if (placeOrderBtn) placeOrderBtn.disabled = true;
            return;
        }

        checkoutItemList.innerHTML = ''; // Limpiar lista antes de renderizar
        let currentSubtotal = 0;
        const shippingCost = 5.00; // Costo fijo de envío (PEN) - puedes ajustar la lógica aquí

        if (!window.cart || window.cart.length === 0) { // Si el carrito está vacío
            checkoutItemList.innerHTML = '<tr><td colspan="3" class="empty-cart-message">Tu carrito está vacío. <a href="productos.html">Añade productos aquí.</a></td></tr>';
            if (placeOrderBtn) placeOrderBtn.disabled = true; // Deshabilita el botón si no hay productos
            currentSubtotal = 0; // Asegurarse de que el subtotal sea 0
        } else {
            window.cart.forEach(item => {
                const row = document.createElement('tr');
                const itemTotalPrice = item.price * item.quantity;
                currentSubtotal += itemTotalPrice;

                // Construcción de la cadena de opciones para el mensaje (más robusta)
                const options = [];
                // Se asegura de que la propiedad exista y no sea "Unico" o "no seleccionado"
                if (item.model && item.model.toLowerCase() !== "unico" && item.model.toLowerCase() !== "no seleccionado") { options.push(item.model); }
                if (item.color && item.color.toLowerCase() !== "unico" && item.color.toLowerCase() !== "no seleccionado") { options.push(item.color); }
                if (item.size && item.size.toLowerCase() !== "unico" && item.size.toLowerCase() !== "no seleccionado") { options.push(item.size); }
                const optionsString = options.length > 0 ? `<br><small>(${options.join(' - ')})</small>` : '';

                row.innerHTML = `
                    <td><img src="${item.image}" alt="${item.name}" width="40px" height="40px">${item.name}${optionsString}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">${window.formatCurrency(itemTotalPrice)}</td>
                `;
                checkoutItemList.appendChild(row);
            });
            if (placeOrderBtn) placeOrderBtn.disabled = false; // Habilita el botón si hay productos
        }

        const finalTotal = currentSubtotal + shippingCost;

        checkoutSubtotal.textContent = window.formatCurrency(currentSubtotal);
        checkoutShipping.textContent = window.formatCurrency(shippingCost);
        checkoutFinalTotal.textContent = window.formatCurrency(finalTotal);

        // Actualizar estado del botón de pedido basado en si hay ítems en el carrito (redundante pero seguro)
        if (window.cart && window.cart.length === 0) {
            if (placeOrderBtn) placeOrderBtn.disabled = true;
        }
    };

    // --- Lógica para mostrar/ocultar nota de Izipay ---
    const togglePaymentNote = () => {
        // Verificación defensiva de elementos DOM
        if (!checkoutForm || !paymentNote) {
            // console.warn("togglePaymentNote: Formulario o nota de pago no encontrados."); // Debug
            return; 
        }

        const selectedPaymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
        const selectedPaymentMethod = selectedPaymentMethodInput ? selectedPaymentMethodInput.value : '';

        if (selectedPaymentMethod === 'tarjeta-visa-izipay') {
            paymentNote.style.display = 'block'; // Muestra la nota
        } else {
            paymentNote.style.display = 'none'; // Oculta la nota
        }
    };

    // --- Lógica de Envío del Formulario (al hacer clic en "Realizar Pedido") ---
    if (checkoutForm) {
        // Event listener para cambios en los métodos de pago (radio buttons)
        checkoutForm.addEventListener('change', (event) => {
            // Solo ejecuta togglePaymentNote si el cambio fue en un radio button de paymentMethod
            if (event.target && event.target.name === 'paymentMethod' && event.target.type === 'radio') {
                togglePaymentNote();
            }
        });

        // Event listener para el envío del formulario
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita el envío tradicional del formulario

            // Verificación inicial del carrito (más explícita)
            if (!window.cart || window.cart.length === 0) {
                alert("❌ Tu carrito está vacío. Por favor, añade productos antes de realizar el pedido.");
                return;
            }

            // Recopilar todos los datos del formulario (más defensivo)
            const customerData = {
                fullName: document.getElementById('full-name')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || '',
                address: document.getElementById('address')?.value.trim() || '',
                city: document.getElementById('city')?.value.trim() || '',
                region: document.getElementById('region')?.value.trim() || '',
                postalCode: document.getElementById('postal-code')?.value.trim() || '',
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'no-seleccionado',
                comments: document.getElementById('comments')?.value.trim() || ''
            };

            // Validaciones de formulario (mejoradas)
            let validationErrors = [];
            if (!customerData.fullName) validationErrors.push("Nombre Completo");
            if (!customerData.email) validationErrors.push("Correo Electrónico");
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) { // Validación de formato de email
                validationErrors.push("Correo Electrónico (formato inválido)");
            }
            if (!customerData.phone) validationErrors.push("Teléfono / WhatsApp");
            if (!customerData.address) validationErrors.push("Dirección de Envío");
            if (!customerData.city) validationErrors.push("Ciudad");
            if (!customerData.region) validationErrors.push("Región / Departamento");

            if (validationErrors.length > 0) {
                alert(`Por favor, completa los siguientes campos obligatorios o corrígelos:\n- ${validationErrors.join('\n- ')}`);
                return;
            }

            // --- Generar Mensaje de WhatsApp Completo ---
            // Asegúrate de que getWhatsAppOrderMessage exista (desde cart.js)
            if (typeof window.getWhatsAppOrderMessage !== 'function') {
                console.error("getWhatsAppOrderMessage no está definido. Asegúrate de que js/cart.js esté cargado ANTES de js/checkout.js.");
                alert("Error al procesar el pedido. Funcionalidad de carrito no disponible.");
                return;
            }
            const orderSummaryMessage = window.getWhatsAppOrderMessage(customerData);

            // 3. Confirmar la compra antes de enviar el mensaje final a WhatsApp o redirigir a Izipay
            if (confirm(orderSummaryMessage + CONFIRM_PROMPT_CHECKOUT)) {
                // Si es pago con tarjeta, abrimos Izipay y luego (idealmente) confirmamos WhatsApp
                if (customerData.paymentMethod === 'tarjeta-visa-izipay') {
                    alert("Serás redirigido/a a la plataforma segura de Izipay para completar el pago con tarjeta. ¡Por favor, no cierres la ventana!");
                    
                    const realIzipayPaymentLink = DUMMY_IZIPAY_LINK; // REEMPLAZAR CON LINK REAL DE IZIPAY
                    
                    // Abrir Izipay en una nueva pestaña
                    window.open(realIzipayPaymentLink, '_blank'); 
                    
                    // En un escenario real, el vaciado del carrito y el alert final
                    // se harían *después* de que Izipay confirme el pago (a través de un webhook a tu servidor).
                    // Para este frontend simple, lo simulamos con un retraso.
                    setTimeout(() => {
                        if (typeof window.clearCart === 'function') {
                            window.clearCart(); // Vaciar carrito
                            renderCheckoutSummary(); // Actualizar resumen de checkout para mostrar vacío
                        }
                        alert(THANK_YOU_MESSAGE_FINAL);
                    }, 500); // 0.5 segundos de retraso
                    
                } else {
                    // Para otros métodos de pago (Contra Entrega, Transferencia)
                    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(orderSummaryMessage)}`;
                    window.open(whatsappURL, "_blank"); // Abre WhatsApp directamente
                    
                    if (typeof window.clearCart === 'function') {
                        window.clearCart(); // Vaciar carrito
                        renderCheckoutSummary(); // Actualizar resumen de checkout para mostrar vacío
                    }
                    alert(THANK_YOU_MESSAGE_FINAL);
                }
            }
            
            checkoutForm.reset(); // Limpia el formulario (pero el carrito ya se vació si la acción fue confirmada)
        });
    }

    // --- Inicialización ---
    renderCheckoutSummary(); // Carga el resumen del carrito al cargar la página
    togglePaymentNote(); // Asegura que la nota de Izipay esté visible/oculta al cargar
});
