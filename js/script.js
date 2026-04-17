// js/cart.js
// ==========================================================================
// CONTROLADOR GLOBAL DEL CARRITO DE COMPRAS (App Mobile Style)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Array Global del Carrito ---
    let appCart = [];

    // --- Función de Formateo de Moneda ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // --- Inicialización ---
    const initCart = () => {
        const storedCart = localStorage.getItem("appCart");
        if (storedCart) {
            appCart = JSON.parse(storedCart);
        }
        // Exponemos el carrito al window por si otras funciones (como FCompra.js) lo necesitan leer
        window.appCart = appCart; 
        updateGlobalCartBadges();
    };

    // --- Guardar y Sincronizar ---
    const saveCart = () => {
        localStorage.setItem("appCart", JSON.stringify(appCart));
        window.appCart = appCart;
        updateGlobalCartBadges();
    };

    // --- AGREGAR AL CARRITO (Expuesto Globalmente) ---
    window.addToCart = (productObj) => {
        // Verifica si el producto EXACTAMENTE IGUAL (mismo id, color, modelo y talla) ya está en el carrito
        const existingItemIndex = appCart.findIndex(item => 
            item.id === productObj.id && 
            item.model === productObj.model && 
            item.color === productObj.color && 
            item.size === productObj.size
        );

        if (existingItemIndex > -1) {
            // Si ya existe, comprobamos el stock antes de sumar
            const newQuantity = appCart[existingItemIndex].quantity + productObj.quantity;
            if (newQuantity > productObj.maxStock) {
                alert(`Solo hay ${productObj.maxStock} unidades disponibles en stock.`);
                appCart[existingItemIndex].quantity = productObj.maxStock;
            } else {
                appCart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            // Si es un producto o variante nueva, lo añade
            appCart.push(productObj);
        }

        saveCart();
    };

    // --- ELIMINAR DEL CARRITO (Expuesto Globalmente) ---
    window.removeFromCart = (index) => {
        if (index > -1 && index < appCart.length) {
            appCart.splice(index, 1);
            saveCart();
        }
    };

    // --- ACTUALIZAR BURBUJAS ROJAS (BADGES) ---
    // Esta función busca en toda la pantalla cualquier badge y lo actualiza
    window.updateGlobalCartBadges = () => {
        const totalItems = appCart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Busca todos los badges que existan en la página actual (arriba, abajo, donde sea)
        const cartBadges = document.querySelectorAll(".cart-badge:not(.eco-cart-badge)"); 

        cartBadges.forEach(badge => {
            badge.textContent = totalItems;
            
            // Animación de pop
            if(totalItems > 0) {
                badge.style.display = "flex";
                badge.style.transform = 'scale(1.2)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            } else {
                badge.textContent = "0";
            }
        });
    };

    // --- NAVEGACIÓN TÁCTIL ---
    // En el diseño móvil actual, hacer clic en cualquier icono de carrito lleva directo a FCompra.html
    const setupCartNavigation = () => {
        const cartIcons = document.querySelectorAll(".cart-icon-top, .cart-btn");
        
        cartIcons.forEach(icon => {
            icon.addEventListener("click", (e) => {
                // Si el icono no es un <a> (enlace directo), forzamos la navegación
                if(icon.tagName.toLowerCase() !== 'a') {
                    e.preventDefault();
                    window.location.href = "FCompra.html";
                }
            });
        });
    };

    // --- EJECUCIÓN INICIAL ---
    initCart();
    setupCartNavigation();
});
