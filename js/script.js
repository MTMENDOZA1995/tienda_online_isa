// js/cart.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    const cartListBody = document.getElementById("cart-list-body");
    const cartTotalElem = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const checkoutBtn = document.getElementById("checkout-btn-dropdown");
    const cartBadges = document.querySelectorAll(".cart-badge"); // Numerito rojo de notificaciones

    // Array global del carrito
    let cart = [];

    // --- Funciones de Utilidad ---
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
            cart = JSON.parse(storedCart);
        }
        renderCart();
    };

    // --- Guardar en LocalStorage ---
    const saveCart = () => {
        localStorage.setItem("appCart", JSON.stringify(cart));
        renderCart();
    };

    // --- Función Principal: Agregar al Carrito ---
    // Esta función es llamada desde products.js y product-detail.js
    window.addToCart = (productObj) => {
        // Verifica si el producto EXACTAMENTE IGUAL (mismo id, color, modelo y talla) ya está en el carrito
        const existingItemIndex = cart.findIndex(item => 
            item.id === productObj.id && 
            item.model === productObj.model && 
            item.color === productObj.color && 
            item.size === productObj.size
        );

        if (existingItemIndex > -1) {
            // Si ya existe, comprobamos el stock antes de sumar
            const newQuantity = cart[existingItemIndex].quantity + productObj.quantity;
            if (newQuantity > productObj.maxStock) {
                alert(`Solo hay ${productObj.maxStock} unidades disponibles en stock.`);
                cart[existingItemIndex].quantity = productObj.maxStock;
            } else {
                cart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            // Si es un producto o variante nueva, lo añade al array
            cart.push(productObj);
        }

        saveCart();
    };

    // --- Eliminar un producto específico ---
    const removeFromCart = (index) => {
        cart.splice(index, 1);
        saveCart();
    };

    // --- Vaciar todo el carrito ---
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (cart.length > 0) {
                if(confirm("¿Estás seguro de vaciar tu carrito?")) {
                    cart = [];
                    saveCart();
                }
            }
        });
    }

    // --- Renderizar el Carrito en el Menú Desplegable ---
    const renderCart = () => {
        if (!cartListBody) return;

        cartListBody.innerHTML = "";
        let totalAmount = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartListBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cart-message" style="text-align:center; padding:20px; color:#888;">
                        Tu carrito está vacío 🛒
                    </td>
                </tr>
            `;
            if (checkoutBtn) checkoutBtn.style.display = "none";
            if (clearCartBtn) clearCartBtn.style.display = "none";
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                totalItems += item.quantity;

                // Construimos la variante en texto si no es "Unico"
                let variantText = [];
                if (item.model !== "Unico") variantText.push(item.model);
                if (item.color !== "Unico") variantText.push(item.color);
                if (item.size !== "Unico") variantText.push(item.size);
                
                const variantDisplay = variantText.length > 0 
                    ? `<div style="font-size:10px; color:#888; margin-top:2px;">${variantText.join(' - ')}</div>` 
                    : "";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius:4px;">
                    </td>
                    <td style="font-size:12px; line-height:1.2;">
                        ${item.name}
                        ${variantDisplay}
                    </td>
                    <td style="font-weight:600; color:#6cc82a;">${formatCurrency(item.price)}</td>
                    <td style="text-align:center; font-weight:bold;">x${item.quantity}</td>
                    <td style="text-align:center;">
                        <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:14px;">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                `;
                cartListBody.appendChild(tr);
            });

            if (checkoutBtn) checkoutBtn.style.display = "block";
            if (clearCartBtn) clearCartBtn.style.display = "block";
        }

        // Actualizar el Texto de Total
        if (cartTotalElem) {
            cartTotalElem.textContent = `Total: ${formatCurrency(totalAmount)}`;
        }

        // Actualizar los numeritos rojos (Badges) en los íconos del carrito
        cartBadges.forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? "block" : "none";
        });

        // Asignar eventos a los botones de basurero recién creados
        const removeButtons = document.querySelectorAll(".remove-item-btn");
        removeButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                removeFromCart(index);
            });
        });
    };

    // --- Manejo del Despliegue del Carrito ---
    // En móviles/apps, normalmente el icono del carrito en el header te lleva a checkout, 
    // pero si tienes un dropdown, este código lo maneja:
    const cartIcons = document.querySelectorAll(".cart-icon-top, .cart-btn");
    const cartDropdown = document.getElementById("cart-dropdown");

    cartIcons.forEach(icon => {
        icon.addEventListener("click", (e) => {
            e.preventDefault();
            if (cartDropdown) {
                // Alterna la visibilidad del desplegable
                if (cartDropdown.style.display === "block") {
                    cartDropdown.style.display = "none";
                } else {
                    cartDropdown.style.display = "block";
                }
            } else {
                // Si no hay desplegable (como en el header nuevo), redirige a la página de compra
                window.location.href = "FCompra.html";
            }
        });
    });

    // Cerrar el dropdown del carrito si se hace clic afuera
    document.addEventListener("click", (e) => {
        if (cartDropdown && cartDropdown.style.display === "block") {
            const isClickInside = cartDropdown.contains(e.target) || e.target.closest('.cart-icon-top') || e.target.closest('.cart-btn');
            if (!isClickInside) {
                cartDropdown.style.display = "none";
            }
        }
    });

    // Ejecutar inicialización
    initCart();
});
