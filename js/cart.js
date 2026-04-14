// js/cart.js
// ==========================================================================
// SISTEMA GLOBAL DE CARRITO DE COMPRAS (ESTILO APP NATIVA)
// ==========================================================================

// 1. Inicialización Global Inmediata (Fuera del DOMContentLoaded para que otros scripts lo vean)
window.appCart = JSON.parse(localStorage.getItem("appCart")) || [];

// --- Utilidad Global para Moneda ---
window.formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return "S/ 0.00";
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
    }).format(amount);
};

// --- Guardar en LocalStorage ---
window.saveCart = () => {
    localStorage.setItem("appCart", JSON.stringify(window.appCart));
    window.renderCartUI(); // Siempre que se guarda, se actualiza la interfaz
};

// --- Agregar Producto ---
window.addToCart = (productToAdd) => {
    // Busca si ya existe exactamente la misma variante en el carrito
    const existingItemIndex = window.appCart.findIndex(item => 
        item.id === productToAdd.id && 
        item.model === productToAdd.model && 
        item.color === productToAdd.color && 
        item.size === productToAdd.size
    );

    if (existingItemIndex > -1) {
        // Si existe, suma la cantidad (respetando el stock máximo)
        const newQuantity = window.appCart[existingItemIndex].quantity + productToAdd.quantity;
        if (newQuantity > productToAdd.maxStock) {
            alert(`Solo hay ${productToAdd.maxStock} unidades disponibles en stock.`);
            window.appCart[existingItemIndex].quantity = productToAdd.maxStock;
        } else {
            window.appCart[existingItemIndex].quantity = newQuantity;
        }
    } else {
        // Si no existe, valida el stock inicial y lo agrega
        if (productToAdd.quantity > productToAdd.maxStock) {
            alert(`Solo hay ${productToAdd.maxStock} unidades disponibles en stock.`);
            productToAdd.quantity = productToAdd.maxStock;
        }
        window.appCart.push(productToAdd);
    }

    window.saveCart();
    
    // Pequeño feedback visual nativo (opcional si no usas el botón animado de details)
    console.log(`✅ Agregado: ${productToAdd.name}`);
};

// --- Eliminar Producto ---
window.removeFromCart = (index) => {
    window.appCart.splice(index, 1);
    window.saveCart();
    
    // Si estamos en la página de Checkout, avisamos que debe recalcularse
    if (typeof window.renderCheckoutPage === "function") {
        window.renderCheckoutPage();
    }
};

// --- Vaciar Carrito ---
window.clearCart = () => {
    if (confirm("¿Estás seguro de vaciar tu carrito?")) {
        window.appCart = [];
        window.saveCart();
        
        if (typeof window.renderCheckoutPage === "function") {
            window.renderCheckoutPage();
        }
    }
};

// --- Actualizar Interfaz del Menú Superior ---
window.renderCartUI = () => {
    // 1. Actualizar las burbujas rojas (Badges) en toda la app
    const cartBadges = document.querySelectorAll(".cart-badge");
    const totalItems = window.appCart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartBadges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? "block" : "none";
    });

    // 2. Si existe un dropdown tradicional (para versión PC), lo actualiza
    const cartListBody = document.getElementById("cart-list-body");
    const cartTotalElem = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn-dropdown");
    const clearBtn = document.getElementById("clear-cart-btn");

    if (!cartListBody) return; // Si no hay dropdown en esta página, termina aquí.

    cartListBody.innerHTML = "";
    let totalAmount = 0;

    if (window.appCart.length === 0) {
        cartListBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#888; font-size: 12px;">Tu carrito está vacío 🛒</td></tr>`;
        if (checkoutBtn) checkoutBtn.style.display = "none";
        if (clearBtn) clearBtn.style.display = "none";
    } else {
        window.appCart.forEach((item, index) => {
            totalAmount += (item.price * item.quantity);
            
            // Construir texto de variantes
            let variantText = [];
            if (item.model !== "Unico") variantText.push(item.model);
            if (item.color !== "Unico") variantText.push(item.color);
            if (item.size !== "Unico") variantText.push(item.size);
            const variantDisplay = variantText.length > 0 ? `<div style="font-size:10px; color:#888; margin-top:2px;">${variantText.join(' - ')}</div>` : "";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${item.image}" alt="img" style="width: 35px; height: 35px; object-fit: cover; border-radius:4px;"></td>
                <td style="font-size:11px; line-height:1.2;">${item.name} ${variantDisplay}</td>
                <td style="font-weight:600; color:#6cc82a; font-size:12px;">${window.formatCurrency(item.price)}</td>
                <td style="text-align:center; font-size:12px;">x${item.quantity}</td>
                <td style="text-align:center;">
                    <button onclick="window.removeFromCart(${index})" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:14px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            cartListBody.appendChild(tr);
        });

        if (checkoutBtn) checkoutBtn.style.display = "block";
        if (clearBtn) clearBtn.style.display = "block";
    }

    if (cartTotalElem) cartTotalElem.textContent = `Total: ${window.formatCurrency(totalAmount)}`;
};


// ==========================================================================
// EVENTOS DEL DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Renderizar la UI inicial
    window.renderCartUI();

    // Evento para el botón de Vaciar Carrito del Dropdown
    const clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) {
        clearBtn.addEventListener("click", window.clearCart);
    }

    // Comportamiento del Icono del carrito en el Header
    const cartIcons = document.querySelectorAll(".cart-icon-top");
    const cartDropdown = document.getElementById("cart-dropdown");

    cartIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Si el carrito está vacío, avisar
            if (window.appCart.length === 0) {
                alert("Tu carrito está vacío. Agrega productos para continuar.");
                return;
            }

            // Si hay un Dropdown en la página (ej. PC), mostrarlo. 
            // Si no hay (modo App pura), redirigir a FCompra.html
            if (cartDropdown) {
                cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
            } else {
                window.location.href = "FCompra.html";
            }
        });
    });

    // Cerrar el dropdown si se hace clic afuera (solo PC)
    document.addEventListener("click", (e) => {
        if (cartDropdown && cartDropdown.style.display === "block") {
            const isClickInside = cartDropdown.contains(e.target) || e.target.closest('.cart-icon-top');
            if (!isClickInside) {
                cartDropdown.style.display = "none";
            }
        }
    });

    // Botón de Checkout en el Dropdown (solo PC)
    const checkoutBtn = document.getElementById("checkout-btn-dropdown");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "FCompra.html";
        });
    }
});
