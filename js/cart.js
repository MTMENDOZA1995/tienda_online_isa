// js/cart.js

// CORRECTION: Declare 'cart' as a global variable directly on the window object.
// This is ESSENTIAL for all scripts (product-detail.js, FCompra.js) to access the SAME cart data.
window.cart = []; // CHANGED: Now 'cart' is a global property of the window object.

// --- Selectores del DOM del carrito ---
const cartIcon = document.getElementById("cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");
const cartListBody = document.getElementById("cart-list").querySelector("tbody");
const cartTotalElem = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutBtnDropdown = document.getElementById("checkout-btn-dropdown");

// --- Funciones de Utilidad para el Carrito ---

/**
 * Carga el carrito desde localStorage.
 * Esta función es globalmente accesible.
 */
window.loadCart = () => { // Correctly global
    try {
        const storedCart = localStorage.getItem("cart");
        window.cart = storedCart ? JSON.parse(storedCart) : []; // CORRECTION: Assign to window.cart
        // console.log('loadCart: Cart loaded from localStorage:', window.cart); // Debug: Confirm load
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        window.cart = []; // CORRECTION: Assign to window.cart
    }
};

/**
 * Guarda el carrito en localStorage.
 * Siempre guarda el contenido del window.cart global.
 */
const saveCart = () => { // Only used internally
    localStorage.setItem("cart", JSON.stringify(window.cart)); // CORRECTION: Use window.cart
};

/**
 * Formatea un número a la moneda local (S/.) para el carrito.
 * Esta función es globalmente accesible.
 */
window.formatCurrency = (amount) => { // Correctly global
    if (typeof amount !== 'number' || isNaN(amount)) {
        return "S/. 0.00";
    }
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * Esta función es global para que `product-detail.js` pueda llamarla.
 * @param {object} productToAdd Objeto del producto con sus propiedades y cantidad.
 */
window.addToCart = (productToAdd) => { // Correctly global
    const existingItemIndex = window.cart.findIndex(item => // CORRECTION: Refer to window.cart
        item.id === productToAdd.id &&
        item.model === productToAdd.model &&
        item.color === productToAdd.color &&
        item.size === productToAdd.size
    );

    if (existingItemIndex > -1) {
        const currentQuantity = window.cart[existingItemIndex].quantity; // CORRECTION: Refer to window.cart
        if (currentQuantity + productToAdd.quantity > productToAdd.maxStock) {
            alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto (stock actual: ${currentQuantity}).`);
            return;
        }
        window.cart[existingItemIndex].quantity += productToAdd.quantity; // CORRECTION: Refer to window.cart
    } else {
        if (productToAdd.quantity > productToAdd.maxStock) {
             alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto.`);
             return;
        }
        window.cart.push(productToAdd); // CORRECTION: Refer to window.cart
    }

    saveCart();
    window.renderCart(); // Call to global renderCart
    alert(`✅ ${productToAdd.name} agregado al carrito!`);
};

/**
 * Elimina un producto específico del carrito.
 */
const removeFromCart = (id, model, color, size) => { // Not global, only used internally by event listener
    const numericId = parseInt(id, 10); 
    // console.log('removeFromCart: Intentando eliminar producto con ID:', id, 'Modelo:', model, 'Color:', color, 'Tamaño:', size); // Debug

    window.cart = window.cart.filter(item => // CORRECTION: Refer to window.cart
        !(item.id === numericId && item.model === model && item.color === color && item.size === size)
    );
    saveCart();
    window.renderCart(); // Call to global renderCart
    // console.log('removeFromCart: Carrito después de filtrar:', cart); // Debug
};

/**
 * Vacía completamente el carrito.
 * Esta función es globalmente accesible.
 */
window.clearCart = () => { // Correctly global
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        window.cart = []; // CORRECTION: Refer to window.cart
        saveCart();
        window.renderCart(); // Call to global renderCart
        alert("🗑️ Carrito vaciado!");
    }
};

/**
 * Renderiza el contenido del carrito en el DOM.
 * Esta función es globalmente accesible.
 */
window.renderCart = () => { // Correctly global
    // console.log('renderCart: Verificando selectores - cartListBody:', cartListBody, 'cartTotalElem:', cartTotalElem, 'checkoutBtnDropdown:', checkoutBtnDropdown); // Debug

    if (!cartListBody || !cartTotalElem || !checkoutBtnDropdown || !clearCartBtn) { 
        console.error('renderCart: Error de DOM. Uno o más elementos del carrito no se encontraron:', 
                      { cartListBody, cartTotalElem, clearCartBtn, checkoutBtnDropdown });
        return;
    }

    cartListBody.innerHTML = ""; // Limpiar la tabla
    let total = 0;

    if (window.cart.length === 0) { // CORRECTION: Refer to window.cart
        cartListBody.innerHTML = '<tr><td colspan="5" class="empty-cart-message">🛒 El carrito está vacío.</td></tr>';
        checkoutBtnDropdown.style.display = "none";
        clearCartBtn.style.display = "none";
    } else {
        window.cart.forEach(item => { // CORRECTION: Refer to window.cart
            const row = document.createElement("tr");
            const itemTotalPrice = item.price * item.quantity;
            const options = [];
            if (item.model && item.model.toLowerCase() !== "unico" && item.model !== "no seleccionado") { options.push(item.model); }
            if (item.color && item.color.toLowerCase() !== "unico" && item.color !== "no seleccionado") { options.push(item.color); }
            if (item.size && item.size.toLowerCase() !== "unico" && item.size !== "no seleccionado") { options.push(item.size); }
            const optionsString = options.length > 0 ? `<br><small>(${options.join(' - ')})</small>` : '';

            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" width="50px"></td>
                <td>
                    ${item.name}
                    ${optionsString}
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td><a href="#" class="borrar" data-id="${item.id}" data-model="${item.model}" data-color="${item.color}" data-size="${item.size}"><img src="imagenes/eliminar.png" alt="Eliminar" style="width: 20px; height: 20px; vertical-align: middle;"></a></td>
            `;
            cartListBody.appendChild(row);
            total += itemTotalPrice;
        });
        checkoutBtnDropdown.style.display = "block";
        clearCartBtn.style.display = "block";
    }
    cartTotalElem.textContent = `Total: ${formatCurrency(total)}`;
};

// --- Función que construye el mensaje de resumen del pedido para WhatsApp ---
/**
 * Construye el mensaje de resumen del carrito para WhatsApp.
 * Esta función ya NO envía el mensaje ni pide confirmación, solo devuelve la cadena del mensaje.
 * Es llamada por js/checkout.js.
 * @param {object} customerData (Opcional) Datos del cliente para incluir en el mensaje.
 * @returns {string} El mensaje de resumen del pedido formateado para WhatsApp.
 */
window.getWhatsAppOrderMessage = (customerData = {}) => { // Correctly global
    if (window.cart.length === 0) { // CORRECTION: Refer to window.cart
        return "❌ Tu carrito está vacío. No hay productos para generar un pedido.";
    }

    const STORE_NAME = "IMPORTACIONES SOSTENIBLES & ATRACTIVAS";
    // const CURRENCY_SYMBOL = "S/."; // Already global via window.formatCurrency

    let messageParts = [];
    messageParts.push(`🛒 *Resumen de tu compra en ${STORE_NAME}:*`);

    // Añadir datos del cliente si están disponibles (desde checkout.js)
    if (Object.keys(customerData).length > 0 && customerData.fullName) {
        messageParts.push(`\n*Datos del Cliente:*`);
        messageParts.push(`  Nombre: ${customerData.fullName}`);
        if (customerData.email) messageParts.push(`  Email: ${customerData.email}`);
        if (customerData.phone) messageParts.push(`  Teléfono: ${customerData.phone}`);
        if (customerData.address) messageParts.push(`  Dirección: ${customerData.address}, ${customerData.city}, ${customerData.region}`);
        if (customerData.paymentMethod) {
            let paymentMethodText = '';
            if (customerData.paymentMethod === 'contra-entrega') paymentMethodText = 'Contra Entrega';
            else if (customerData.paymentMethod === 'transferencia') paymentMethodText = 'Transferencia Bancaria';
            else if (customerData.paymentMethod === 'tarjeta-visa-izipay') paymentMethodText = 'Tarjeta (Izipay)';
            messageParts.push(`  Método de Pago: ${paymentMethodText}`);
        }
        if (customerData.comments) messageParts.push(`  Comentarios: _${customerData.comments}_`);
    }

    messageParts.push(`\n*Productos:*\n`);

    let total = 0;

    window.cart.forEach((item, index) => { // CORRECTION: Refer to window.cart
        messageParts.push(`*${index + 1}. ${item.name}*`);
        const options = [];
        if (item.model && item.model.toLowerCase() !== "unico" && item.model !== "no seleccionado") { options.push(item.model); }
        if (item.color && item.color.toLowerCase() !== "unico" && item.color !== "no seleccionado") { options.push(item.color); }
        if (item.size && item.size.toLowerCase() !== "unico" && item.size !== "no seleccionado") { options.push(item.size); }
        if (options.length > 0) { messageParts.push(`  Opciones: _${options.join(' - ')}_`); }
        messageParts.push(`  Cantidad: ${item.quantity} | Precio Unitario: *${window.formatCurrency(item.price)}*`);
        total += item.price * item.quantity;
    });

    messageParts.push(`\n💰 *Total a pagar: ${window.formatCurrency(total)}*`);
    messageParts.push(`\n¡Gracias por tu pedido!`);

    return messageParts.join('\n');
};


// --- Event Listeners Globales (DOMContentLoaded para la carga inicial) ---
document.addEventListener("DOMContentLoaded", () => {
    // console.log('DOMContentLoaded: Selectores al inicio - cartIcon:', cartIcon, 'cartDropdown:', cartDropdown, 'cartListBody:', cartListBody); // Debug

    window.loadCart(); // Call to global loadCart
    window.renderCart(); // Call to global renderCart

    // Delegación de eventos para los botones de eliminar del carrito (más eficiente)
    if (cartListBody) {
        // console.log('DOMContentLoaded: Intentando agregar click listener a cartListBody.'); // Debug
        cartListBody.addEventListener("click", (event) => {
            // console.log('Clic detectado en cartListBody:', event.target); // Debug

            const deleteButton = event.target.closest('.borrar');

            if (deleteButton) {
                // console.log('Clic en botón borrar reconocido.'); // Debug
                event.preventDefault();

                const id = deleteButton.dataset.id;
                const model = deleteButton.dataset.model;
                const color = deleteButton.dataset.color;
                const size = deleteButton.dataset.size;

                // console.log('Datos del producto a eliminar (desde data-attributes):', { id, model, color, size }); // Debug
                
                removeFromCart(id, model, color, size); // Calls local removeFromCart
            } else {
                // console.log('Clic no fue en un botón borrar.'); // Debug
            }
        });
    } else {
        // console.log('DOMContentLoaded: cartListBody no se encontró, no se pudo agregar el click listener.'); // Debug
    }

    if (clearCartBtn) {
        // console.log('DOMContentLoaded: Agregando click listener a clearCartBtn.'); // Debug
        clearCartBtn.addEventListener("click", window.clearCart); // Call to global clearCart
    } else {
        // console.log('DOMContentLoaded: clearCartBtn no se encontró.'); // Debug)
    }

    // MODIFIED: The "Comprar" button in the dropdown now redirects to checkout.html
    // WhatsApp logic will be handled ONLY in checkout.js
    if (checkoutBtnDropdown) {
        // console.log('DOMContentLoaded: Agregando click listener a checkoutBtnDropdown.'); // Debug
        checkoutBtnDropdown.addEventListener("click", () => {
            if (window.cart.length === 0) {
                alert("❌ Tu carrito está vacío. Añade productos antes de finalizar la compra.");
                return;
            }
            window.location.href = "FCompra.html"; // Redirect to FCompra.html
        });
    } else {
        // console.log('DOMContentLoaded: checkoutBtnDropdown no se encontró.'); // Debug
    }
});
