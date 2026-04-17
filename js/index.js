// js/index.js
// ==========================================================================
// LÓGICA PRINCIPAL - PÁGINA DE INICIO (Home)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');

    // 1. CARGAR 20 PRODUCTOS ALEATORIOS EN EL CARRUSEL
    setTimeout(() => {
        // Verificamos que la BD de productos esté cargada y el contenedor exista
        if (window.allProducts && window.allProducts.length > 0 && productList) {
            if (productList.innerHTML.trim() === "") {
                // Tomamos 20 productos al azar
                let randomProducts = [...window.allProducts].sort(() => 0.5 - Math.random()).slice(0, 20);
                
                randomProducts.forEach(rec => {
                    const originalPrice = rec.originalPrice || 0;
                    let finalPrice = originalPrice;
                    let priceHTML = "";

                    // Cálculo visual de descuentos
                    if (rec.discountPercent > 0) {
                        finalPrice = originalPrice * (1 - rec.discountPercent / 100);
                        priceHTML = `
                            <span style="font-size: 10px; color: #999; text-decoration: line-through; display:block;">S/ ${originalPrice.toFixed(2)}</span>
                            <span class="price-offer" style="font-size: 13px; color: #d0021b; font-weight: 700;">S/ ${finalPrice.toFixed(2)}</span>
                        `;
                    } else {
                        priceHTML = `
                            <span class="price-offer" style="font-size: 13px; color: #6cc82a; font-weight: 700; display:block; margin-top:14px;">S/ ${finalPrice.toFixed(2)}</span>
                        `;
                    }

                    const imgSrc = rec.images?.main || "imagenes/default.jpg";
                    const badgeHTML = rec.discountPercent > 0 ? `<div class="discount-badge" style="font-size: 9px; padding: 2px 4px;">-${rec.discountPercent}%</div>` : '';

                    // Construcción de la tarjeta (Limpia, sin botones <button>)
                    const card = document.createElement("div");
                    card.className = "app-product-card";
                    card.style.cssText = "width: 140px; flex: 0 0 auto; margin-bottom: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative; cursor:pointer;";
                    
                    // Añadimos data-id explícitamente para el interceptor de clics
                    card.setAttribute("data-id", rec.id);

                    card.innerHTML = `
                        <div class="product-image-container" style="height: 100px; padding: 5px;">
                            ${badgeHTML}
                            <img src="${imgSrc}" alt="${rec.name}" style="width:100%; height:100%; object-fit:contain;">
                        </div>
                        <div class="product-info" style="padding: 8px;">
                            <p class="product-name" style="font-size: 11px; min-height: 28px; line-height: 1.2; margin-bottom: 4px; color:#333;">${rec.name}</p>
                            ${priceHTML}
                        </div>
                    `;
                    productList.appendChild(card);
                });
            }
        }
    }, 300);

    // 2. ACTUALIZACIÓN DE LA BURBUJA DEL CARRITO (Badge Inferior)
    if(typeof window.updateCartBadge === 'function') {
        const originalUpdate = window.updateCartBadge;
        window.updateCartBadge = () => {
            originalUpdate(); 
            const cart = window.appCart || JSON.parse(localStorage.getItem("appCart")) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const bottomBadge = document.getElementById('bottom-cart-badge');
            
            if (bottomBadge) {
                bottomBadge.textContent = totalItems;
                if(totalItems > 0) {
                    bottomBadge.style.display = "flex";
                    bottomBadge.style.transform = 'scale(1.2)';
                    setTimeout(() => bottomBadge.style.transform = 'scale(1)', 200);
                } else {
                    bottomBadge.style.display = "none";
                }
            }
        };
        setTimeout(window.updateCartBadge, 300);
    }
});

// 3. INTERCEPTOR GLOBAL DE CLICS (Apertura de Detalles)
// Atrapa los clics en cualquier tarjeta generada dinámicamente y abre el detalle
document.addEventListener("click", (e) => {
    const card = e.target.closest(".app-product-card");
    
    // Excluimos las tarjetas de EcoPoints para que no hayan cruces de pantallas
    if (card && !card.classList.contains("ecopoint-card")) {
        e.preventDefault(); 
        
        let productId = card.getAttribute("data-id");
        let productToView = null;

        // Intento 1: Buscar en elementos ocultos dentro de la tarjeta
        if (!productId) {
            const hiddenElement = card.querySelector("[data-id]");
            if (hiddenElement) productId = hiddenElement.getAttribute("data-id");
        }

        if (productId && window.allProducts) {
            productToView = window.allProducts.find(p => String(p.id) === String(productId));
        }

        // Intento 2: Respaldo buscando por nombre exacto del producto
        if (!productToView && window.allProducts) {
            const nameElement = card.querySelector(".product-name");
            if (nameElement) {
                const productName = nameElement.textContent.trim();
                productToView = window.allProducts.find(p => p.name === productName);
            }
        }

        // Si encontramos el producto, viajamos al detalle
        if (productToView) {
            localStorage.setItem("selectedProductDetail", JSON.stringify(productToView));
            window.location.href = "producto-detalle.html";
        }
    }
});

// 4. BÚSQUEDA PRINCIPAL (Redirige al catálogo general para buscar)
// Esta función está expuesta a nivel global para que el HTML pueda llamarla
window.executeMainSearch = function() {
    const searchInput = document.getElementById('main-search-input');
    if(searchInput) {
        const query = searchInput.value.trim();
        searchInput.blur(); // Oculta el teclado en móviles
        
        if (query) {
            localStorage.setItem('globalSearchQuery', query);
            window.location.href = 'Productos.html?q=' + encodeURIComponent(query);
        } else {
            window.location.href = 'Productos.html';
        }
    }
};
