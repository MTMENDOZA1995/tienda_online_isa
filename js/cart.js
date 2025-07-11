// js/cart.js

// Almacén de datos del carrito. Usamos 'cart' en lugar de 'carrito' para consistencia en nombres.
let cart = [];

// --- Selectores del DOM del carrito ---
const cartIcon = document.getElementById("cart-icon"); // Icono del carrito en el header
const cartDropdown = document.getElementById("cart-dropdown"); // Menú desplegable del carrito
const cartListBody = document.getElementById("cart-list").querySelector("tbody"); // Cuerpo de la tabla del carrito
const cartTotalElem = document.getElementById("cart-total"); // Elemento para mostrar el total
const clearCartBtn = document.getElementById("clear-cart-btn"); // Botón vaciar carrito
const checkoutBtn = document.querySelector(".checkout-btn"); // Botón finalizar compra

// --- Funciones de Utilidad para el Carrito ---

/**
 * Carga el carrito desde localStorage.
 */
const loadCart = () => {
    try {
        const storedCart = localStorage.getItem("cart");
        cart = storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
        console.error("Error al cargar el carrito de localStorage:", e);
        cart = []; // Asegurarse de que el carrito sea un array vacío en caso de error
    }
};

/**
 * Guarda el carrito en localStorage.
 */
const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * Formatea un número a la moneda local (S/.) para el carrito.
 * Duplicado aquí para que este script sea autocontenido, pero idealmente se podría importar.
 * @param {number} amount El monto a formatear.
 * @returns {string} El monto formateado como cadena de moneda.
 */
const formatCurrency = (amount) => {
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
window.addToCart = (productToAdd) => { // Función global para que pueda ser llamada desde product-detail.js
    const existingItemIndex = cart.findIndex(item =>
        item.id === productToAdd.id &&
        item.model === productToAdd.model &&
        item.color === productToAdd.color &&
        item.size === productToAdd.size
    );

    if (existingItemIndex > -1) {
        // Asegúrate de no exceder el stock disponible
        const currentQuantity = cart[existingItemIndex].quantity;
        if (currentQuantity + productToAdd.quantity > productToAdd.maxStock) {
            alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto (stock actual: ${currentQuantity}).`);
            return;
        }
        cart[existingItemIndex].quantity += productToAdd.quantity;
    } else {
        if (productToAdd.quantity > productToAdd.maxStock) {
             alert(`⛔ No puedes agregar más de ${productToAdd.maxStock} unidades de este producto.`);
             return;
        }
        cart.push(productToAdd);
    }

    saveCart();
    renderCart(); // Actualiza la vista del carrito
    alert(`✅ ${productToAdd.name} agregado al carrito!`);
};

/**
 // ... (resto del código) ...

/**
 * Elimina un producto específico del carrito.
 * @param {string} id ID del producto (viene como string de data-id).
 * @param {string} model Modelo del producto.
 * @param {string} color Color del producto.
 * @param {string} size Tamaño del producto.
 */
const removeFromCart = (id, model, color, size) => {
    // AÑADE ESTA LÍNEA PARA CONVERTIR EL ID A NÚMERO
    const numericId = parseInt(id, 10); 

    console.log('removeFromCart: Intentando eliminar producto con ID:', id, 'Modelo:', model, 'Color:', color, 'Tamaño:', size);

    cart = cart.filter(item =>
        // Usa numericId para la comparación
        !(item.id === numericId && item.model === model && item.color === color && item.size === size)
    );
    saveCart();
    renderCart();
    console.log('removeFromCart: Carrito después de filtrar:', cart);
};

/**
 * Vacía completamente el carrito.
 */
const clearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        cart = [];
        saveCart();
        renderCart();
        alert("🗑️ Carrito vaciado!");
    }
};

/**
 * Renderiza el contenido del carrito en el DOM.
 */
const renderCart = () => {
    // AÑADE ESTE CONSOLE.LOG PARA VERIFICAR SI ESTOS ELEMENTOS SE ENCUENTRAN
    console.log('renderCart: Verificando selectores - cartListBody:', cartListBody, 'cartTotalElem:', cartTotalElem, 'checkoutBtn:', checkoutBtn);

    if (!cartListBody || !cartTotalElem || !checkoutBtn) {
        console.error('renderCart: Uno o más elementos del DOM no se encontraron. Esto puede causar que el carrito no se renderice.');
        return; // Asegurarse de que los elementos existan
    }

    cartListBody.innerHTML = ""; // Limpiar la tabla
    let total = 0;

    if (cart.length === 0) {
        cartListBody.innerHTML = '<tr><td colspan="5" class="empty-cart-message">🛒 El carrito está vacío.</td></tr>';
        checkoutBtn.style.display = "none";
        clearCartBtn.style.display = "none";
    } else {
        cart.forEach(item => {
            const row = document.createElement("tr");
                        //  ******************************************************************
            //  * AQUÍ ES DONDE DEBES CAMBIAR EL CÓDIGO HTML DE LA FILA  *
            //  ******************************************************************
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" width="50px"></td>
                <td>
                    ${item.name}
                    <br><small>(${item.model !== "Unico" ? item.model : ''}${item.model !== "Unico" && item.color !== "Unico" ? ' - ' : ''}${item.color !== "Unico" ? item.color : ''}${((item.model !== "Unico" || item.model !== "Unico") && item.size !== "Unico") ? ' - ' : ''}${item.size !== "Unico" ? item.size : ''})</small>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${item.quantity}</td>
                <td><a href="#" class="borrar" data-id="${item.id}" data-model="${item.model}" data-color="${item.color}" data-size="${item.size}"><img src="imagenes/eliminar.png" alt="Eliminar" style="width: 25px; height: 25px; vertical-align: middle;"></a></td>
            `;
            //  ******************************************************************
            //  * FIN DEL CÓDIGO HTML A CAMBIAR                                *
            //  ******************************************************************
            
            cartListBody.appendChild(row);
            total += item.price * item.quantity;
        });
        checkoutBtn.style.display = "block";
        clearCartBtn.style.display = "block";
    }
    cartTotalElem.textContent = `Total: ${formatCurrency(total)}`;
};




/**
 * Función para proceder a la compra via WhatsApp.
 * Genera un resumen del carrito y lo envía a un número de WhatsApp predefinido.
 */
const proceedToCheckout = () => {
    // 1. Validar si el carrito está vacío
    if (cart.length === 0) {
        alert("❌ Tu carrito está vacío. Por favor, añade productos antes de continuar.");
        return;
    }

    // --- Configuración (fácil de modificar) ---
    const WHATSAPP_NUMBER = "51952580740"; // Número de WhatsApp de destino (ej. '51952580740' para Perú)
    const STORE_NAME = "IMPORTACIONES SOSTENIBLES & ATRACTIVAS";
    const CURRENCY_SYMBOL = "S/."; // Símbolo de la moneda, usado en el formato de mensaje
    const THANK_YOU_MESSAGE = "✅ ¡Tu pedido ha sido enviado a WhatsApp! Te contactaremos pronto para confirmar tu compra. ¡Gracias!";
    const EMPTY_CART_ALERT = "❌ Tu carrito está vacío. Por favor, añade productos antes de comprar.";
    const CONFIRM_PROMPT_TEXT = "\n\n¿Deseas enviar este pedido por WhatsApp para confirmar tu compra?";


    // 2. Construir el mensaje de resumen del pedido para WhatsApp
    let messageParts = []; // Usamos un array para construir el mensaje de forma más limpia

    messageParts.push(`🛒 *Resumen de tu compra en ${STORE_NAME}:*`); // Título del mensaje

    let total = 0;

    cart.forEach((item, index) => {
        // Genera una lista numerada para cada producto para mayor claridad
        messageParts.push(`\n*${index + 1}. ${item.name}*`);

        // Construye las opciones (modelo, color, tamaño) de forma dinámica
        const options = [];
        if (item.model && item.model.toLowerCase() !== "unico" && item.model !== "No seleccionado") {
            options.push(item.model);
        }
        if (item.color && item.color.toLowerCase() !== "unico" && item.color !== "No seleccionado") {
            options.push(item.color);
        }
        if (item.size && item.size.toLowerCase() !== "unico" && item.size !== "No seleccionado") {
            options.push(item.size);
        }

        if (options.length > 0) {
            messageParts.push(`   Opciones: _${options.join(', ')}_`); // Usa guiones bajos para cursiva en WhatsApp
        }

        // Añade cantidad y precio unitario
        messageParts.push(`   Cantidad: ${item.quantity} | Precio Unitario: *${formatCurrency(item.price)}*`);
        
        total += item.price * item.quantity;
    });

    // Añade el total al final del mensaje
    messageParts.push(`\n💰 *Total a pagar: ${formatCurrency(total)}*`);
    messageParts.push(`\n¡Espero tu confirmación para procesar el pedido!`);


    const fullMessage = messageParts.join('\n'); // Une todas las partes con saltos de línea


    // 3. Confirmar la compra antes de enviar el mensaje
    if (confirm(fullMessage + CONFIRM_PROMPT_TEXT)) {
        const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(fullMessage)}`;
        
        window.open(whatsappURL, "_blank"); // Abre WhatsApp en una nueva pestaña

        // 4. Vaciar carrito y notificar al usuario
        // Decisión sobre cuándo vaciar el carrito:
        // - Si lo vacías aquí, el usuario ya no lo verá en la web.
        // - Si lo vacías DESPUÉS de una confirmación de pago real (en un sistema más complejo),
        //   el usuario lo mantiene en su carrito web hasta que el pago se confirme.
        //   Para una integración simple de WhatsApp, vaciarlo aquí está bien.
        clearCart(); // Llama a la función para vaciar el carrito y actualizar la UI
        alert(THANK_YOU_MESSAGE); // Mensaje final de agradecimiento
    }
};



// --- Event Listeners Globales (DOMContentLoaded para la carga inicial) ---
document.addEventListener("DOMContentLoaded", () => {
    // AÑADE ESTE CONSOLE.LOG PARA VER LOS SELECTORES AL INICIO
    console.log('DOMContentLoaded: Selectores al inicio - cartIcon:', cartIcon, 'cartDropdown:', cartDropdown, 'cartListBody:', cartListBody);

    loadCart(); // Carga el carrito al inicio de la página
    renderCart(); // Renderiza la vista del carrito

    // Delegación de eventos para los botones de eliminar del carrito (más eficiente)
    if (cartListBody) {
        // AÑADE ESTE CONSOLE.LOG PARA CONFIRMAR QUE EL LISTENER SE INTENTA AGREGAR
        console.log('DOMContentLoaded: Intentando agregar click listener a cartListBody.');
        cartListBody.addEventListener("click", (event) => {
            // AÑADE ESTE CONSOLE.LOG PARA VER SI EL CLIC SE DETECTA EN EL TBODY
            console.log('Clic detectado en cartListBody:', event.target);

            const deleteButton = event.target.closest('.borrar');

            if (deleteButton) { // Si se encontró un padre con la clase 'borrar'
                console.log('Clic en botón borrar reconocido.');
                event.preventDefault(); // Previene la navegación del enlace

                // Ahora obtenemos los data-attributes desde deleteButton (que es el <a>)
                const id = deleteButton.dataset.id;
                const model = deleteButton.dataset.model;
                const color = deleteButton.dataset.color;
                const size = deleteButton.dataset.size;

                console.log('Datos del producto a eliminar (desde data-attributes):', { id, model, color, size });
                
                removeFromCart(id, model, color, size);
            } else {
                // Opcional: para depuración si el clic no es en .borrar
                // console.log('Clic no fue en un botón borrar.'); 
            }
        });
    } else {

        // AÑADE ESTE CONSOLE.LOG SI cartListBody NO SE ENCONTRÓ
        console.log('DOMContentLoaded: cartListBody no se encontró, no se pudo agregar el click listener.');
    }

    if (clearCartBtn) {
        console.log('DOMContentLoaded: Agregando click listener a clearCartBtn.');
        clearCartBtn.addEventListener("click", clearCart);
    } else {
        console.log('DOMContentLoaded: clearCartBtn no se encontró.');
    }

    if (checkoutBtn) {
        console.log('DOMContentLoaded: Agregando click listener a checkoutBtn.');
        checkoutBtn.addEventListener("click", proceedToCheckout);
    } else {
        console.log('DOMContentLoaded: checkoutBtn no se encontró.');
    }
});
