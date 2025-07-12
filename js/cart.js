// js/cart.js

// --- CORRECCIÓN CRÍTICA: Declara 'cart' como una variable global directamente en el objeto window. ---
// Esto es ESENCIAL para que todos los scripts (product-detail.js, FCompra.js) accedan a los MISMOS datos del carrito.
window.cart = []; // ¡¡¡ASEGÚRATE DE QUE ESTA ES LA PRIMERA LÍNEA EJECUTABLE DE TU ARCHIVO!!!

// --- Selectores del DOM del carrito (estos selectores son para el DROPDOWN del carrito en el HEADER) ---
const cartIcon = document.getElementById("cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");
const cartListBody = document.getElementById("cart-list").querySelector("tbody");
const cartTotalElem = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
// Este botón es el que está en el DROPDOWN del carrito, que redirige a FCompra.html
const checkoutBtnDropdown = document.getElementById("checkout-btn-dropdown"); 

// --- Funciones de Utilidad para el Carrito ---

/**
 * Carga el carrito desde localStorage.
 * Esta función es globalmente accesible (window.loadCart).
 */
window.loadCart = () => { // CORRECTO: Ahora es global
    try {
        const storedCart = localStorage.getItem("cart");
        window.cart = storedCart ? JSON.parse(storedCart) : []; // Referencia explícita a window.cart
        // console.log('loadCart: Carrito cargado de localStorage:', window.cart); // Debug: Confirmación de carga
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        window.cart = []; // En caso de error, inicializar globalmente para evitar null
    }
};

/**
 * Guarda el carrito en localStorage.
 * Siempre guarda el contenido del window.cart global.
 */
const saveCart = () => { // Solo se usa internamente en este archivo
    localStorage.setItem("cart", JSON.stringify(window.cart)); // Referencia explícita a window.cart
};

/**
 * Formatea un número a la moneda local (S/.) para el carrito.
 * Esta función es globalmente accesible (window.formatCurrency).
 * @param {number} amount El monto a formatear.
 * @returns {string} El monto formateado como cadena de moneda.
 */
window.formatCurrency = (amount) => { // CORRECTO: Ya es global
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
 * Esta función es global (window.addToCart) para que `product-detail.js` pueda llamarla.
 * @param {object} productToAdd Objeto del producto con sus propiedades y cantidad.
 */
window.addToCart = (productToAdd) => { // CORRECTO: Ya es global
    const existingItemIndex = window.cart.findIndex(item => // Referencia explícita a window.cart
        item.id === productToAdd.id &&
        item.model === productToAdd.model &&
        item.color === productToAdd.color &&
        item.size === productToAdd.size
    );

    if (existingItemIndex > -1) {
        const currentQuantity = window.cart[existingItemIndex].quantity; // Referencia explícita a window.cart
        if (currentQuantity + productToAdd.quantity > productToAdd.maxStock) {
            alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto (stock actual: ${currentQuantity}).`);
            return;
        }
        window.cart[existingItemIndex].quantity += productToAdd.quantity; // Referencia explícita a window.cart
    } else {
        if (productToAdd.quantity > productToAdd.maxStock) {
             alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto.`);
             return;
        }
        window.cart.push(productToAdd); // Referencia explícita a window.cart
    }

    saveCart(); // Guarda el carrito global
    window.renderCart(); // Llama a la función renderCart global
    alert(`✅ ${productToAdd.name} agregado al carrito!`);
};

/**
 * Elimina un producto específico del carrito.
 * (Función interna, no necesita ser global).
 */
const removeFromCart = (id, model, color, size) => { 
    const numericId = parseInt(id, 10); 

    window.cart = window.cart.filter(item => // Referencia explícita a window.cart
        !(item.id === numericId && item.model === model && item.color === color && item.size === size)
    );
    saveCart(); // Guarda el carrito global
    window.renderCart(); // Llama a la función renderCart global
    // console.log('removeFromCart: Carrito después de filtrar:', window.cart); // Debug
};

/**
 * Vacía completamente el carrito.
 * Esta función es global (window.clearCart) para que `FCompra.js` pueda llamarla.
 */
window.clearCart = () => { 
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        window.cart = []; // Referencia explícita a window.cart
        saveCart(); // Guarda el carrito global
        window.renderCart(); // Llama a la función renderCart global
        alert("🗑️ Carrito vaciado!");
    }
};

/**
 * Renderiza el contenido del carrito en el DOM (el DROPDOWN en el HEADER).
 * Esta función es global (window.renderCart) para que otros scripts (como `FCompra.js`) puedan llamarla.
 */
window.renderCart = () => { 
    // Los selectores aquí deben apuntar a los elementos del DROPDOWN del carrito en el HEADER.
    if (!cartListBody || !cartTotalElem || !checkoutBtnDropdown || !clearCartBtn) { 
        console.error('renderCart: Error de DOM. Uno o más elementos del carrito (HEADER) no se encontraron.', 
                      { cartListBody, cartTotalElem, clearCartBtn, checkoutBtnDropdown });
        return;
    }

    cartListBody.innerHTML = ""; 
    let total = 0;

    if (window.cart.length === 0) { // Referencia explícita a window.cart
        cartListBody.innerHTML = '<tr><td colspan="5" class="empty-cart-message">🛒 El carrito está vacío.</td></tr>';
        checkoutBtnDropdown.style.display = "none";
        clearCartBtn.style.display = "none";
    } else {
        window.cart.forEach(item => { // Referencia explícita a window.cart
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
                <td>${window.formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td><a href="#" class="borrar" data-id="${item.id}" data-model="${item.model}" data-color="${item.color}" data-size="${item.size}"><img src="imagenes/eliminar.png" alt="Eliminar" style="width: 20px; height: 20px; vertical-align: middle;"></a></td>
            `;
            cartListBody.appendChild(row);
            total += itemTotalPrice;
        });
        checkoutBtnDropdown.style.display = "block";
        clearCartBtn.style.display = "block";
    }
    cartTotalElem.textContent = `Total: ${window.formatCurrency(total)}`;
};

/**
 * Construye el mensaje de resumen del carrito para WhatsApp.
 * Esta función es global (window.getWhatsAppOrderMessage) y es llamada por `FCompra.js`.
 * @param {object} customerData (Opcional) Datos del cliente para incluir en el mensaje.
 * @param {number} shippingCost (NUEVO) El costo de envío a sumar al total.
 * @returns {string} El mensaje de resumen del pedido formateado para WhatsApp.
 */
window.getWhatsAppOrderMessage = (customerData = {}, shippingCost = 0) => { 
    if (window.cart.length === 0) { // Referencia explícita a window.cart
        return "❌ Tu carrito está vacío. No hay productos para generar un pedido.";
    }

    const STORE_NAME = "IMPORTACIONES SOSTENIBLES & ATRACTIVAS";

    let messageParts = [];
    messageParts.push(`🛒 *Resumen de tu compra en ${STORE_NAME}:*`);

    // Añadir datos del cliente si están disponibles (desde FCompra.js)
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

    let productsTotal = 0; 
    window.cart.forEach((item, index) => { // Referencia explícita a window.cart
        messageParts.push(`*${index + 1}. ${item.name}*`);
        const options = [];
        if (item.model && item.model.toLowerCase() !== "unico" && item.model !== "no seleccionado") { options.push(item.model); }
        if (item.color && item.color.toLowerCase() !== "unico" && item.color !== "no seleccionado") { options.push(item.color); }
        if (item.size && item.size.toLowerCase() !== "unico" && item.size !== "no seleccionado") { options.push(item.size); }
        if (options.length > 0) { messageParts.push(`  Opciones: _${options.join(' - ')}_`); }
        messageParts.push(`  Cantidad: ${item.quantity} | Precio Unitario: *${window.formatCurrency(item.price)}*`);
        productsTotal += item.price * item.quantity;
    });

    // Añadir Costo de Envío al mensaje si aplica
    if (shippingCost > 0) {
        messageParts.push(`\nSubtotal Productos: ${window.formatCurrency(productsTotal)}`);
        messageParts.push(`Costo de Envío: ${window.formatCurrency(shippingCost)}`);
    } else {
        messageParts.push(`Costo de Envío: Gratuito`);
    }

    const finalOrderTotal = productsTotal + shippingCost; 
    messageParts.push(`\n💰 *Total a pagar: ${window.formatCurrency(finalOrderTotal)}*`); 
    messageParts.push(`\n¡Gracias por tu pedido!`);

    return messageParts.join('\n');
};


// --- Event Listeners Globales (DOMContentLoaded para la carga inicial) ---
document.addEventListener("DOMContentLoaded", () => {
    // console.log('DOMContentLoaded: Selectores al inicio - cartIcon:', cartIcon, 'cartDropdown:', cartDropdown, 'cartListBody:', cartListBody); // Debug

    window.loadCart(); // Llama a la función global loadCart
    window.renderCart(); // Llama a la función global renderCart

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
                
                removeFromCart(id, model, color, size); // Llama a la función interna removeFromCart
            } else {
                // console.log('Clic no fue en un botón borrar.'); // Debug
            }
        });
    } else {
        // console.log('DOMContentLoaded: cartListBody no se encontró, no se pudo agregar el click listener.'); // Debug
    }

    if (clearCartBtn) {
        // console.log('DOMContentLoaded: Agregando click listener a clearCartBtn.'); // Debug
        clearCartBtn.addEventListener("click", window.clearCart); // Llama a la función global clearCart
    } else {
        // console.log('DOMContentLoaded: clearCartBtn no se encontró.'); // Debug)
    }

    // El botón "Comprar" en el dropdown del carrito AHORA REDIRIGE a FCompra.html
    // La lógica de WhatsApp para el pedido final se maneja en FCompra.js.
    if (checkoutBtnDropdown) {
        // console.log('DOMContentLoaded: Agregando click listener a checkoutBtnDropdown.'); // Debug
        checkoutBtnDropdown.addEventListener("click", () => {
            if (window.cart.length === 0) {
                alert("❌ Tu carrito está vacío. Añade productos antes de finalizar la compra.");
                return;
            }
            window.location.href = "FCompra.html"; // Redirige a la página de finalizar compra
        });
    } else {
        // console.log('DOMContentLoaded: checkoutBtnDropdown no se encontró.'); // Debug
    }
});
