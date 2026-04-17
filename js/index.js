// js/index.js
// ==========================================================================
// LÓGICA PRINCIPAL - PÁGINA DE INICIO (Home)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('main-search-input');
    const productList = document.getElementById('product-list');
    const sectionsToHide = document.querySelectorAll('.toggleable-section');
    const sectionTitle = document.getElementById('dynamic-section-title');

    // 1. CARGAR 20 PRODUCTOS ALEATORIOS EN EL CARRUSEL AL INICIAR
    setTimeout(() => {
        if (window.allProducts && window.allProducts.length > 0 && productList) {
            if (productList.innerHTML.trim() === "") {
                let randomProducts = [...window.allProducts].sort(() => 0.5 - Math.random()).slice(0, 20);
                
                randomProducts.forEach(rec => {
                    const originalPrice = rec.originalPrice || 0;
                    let finalPrice = originalPrice;
                    let priceHTML = "";

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

                    const card = document.createElement("div");
                    card.className = "app-product-card";
                    card.style.cssText = "width: 140px; flex: 0 0 auto; margin-bottom: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative; cursor:pointer;";
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

    // 2. EVENTO: BÚSQUEDA EN TIEMPO REAL (Letra por Letra)
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.trim().toLowerCase();
            
            // Si el buscador se vacía, recargamos para mostrar los banners de nuevo
            if (term === '') {
                window.location.reload(); 
                return;
            }

            if (window.allProducts && window.allProducts.length > 0 && productList) {
                
                // Ocultar los banners (carruseles, botones, pie de página)
                sectionsToHide.forEach(el => el.classList.add('search-active-hide'));
                if (sectionTitle) sectionTitle.textContent = 'Resultados de búsqueda';
                
                // Transformar el carrusel horizontal en una grilla vertical
                productList.classList.remove('horizontal-scroll-container', 'products-carousel');
                productList.style.display = 'grid';
                productList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
                productList.style.gap = '15px';
                productList.style.padding = '0 15px';

                // Filtrar base de datos
                const results = window.allProducts.filter(p => 
                    p.name.toLowerCase().includes(term) || 
                    (p.category && p.category.toLowerCase().includes(term))
                );

                // Dibujar Resultados
                if (results.length === 0) {
                    productList.style.display = 'block';
                    productList.innerHTML = `
                        <div style="width: 100%; text-align: center; padding: 40px 20px; color: #888;">
                            <i class="fa-solid fa-box-open fa-2xl" style="margin-bottom: 15px; color: #ddd;"></i><br>
                            No encontramos "${term}"
                        </div>`;
                } else {
                    productList.innerHTML = '';
                    results.forEach(rec => {
                        const originalPrice = rec.originalPrice || 0;
                        let finalPrice = originalPrice;
                        let priceHTML = "";

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

                        const card = document.createElement("div");
                        card.className = "app-product-card";
                        card.style.cssText = "width: 100%; flex: auto; margin-bottom: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative; cursor:pointer;";
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
        });
    }

    // 3. ACTUALIZACIÓN DE LA BURBUJA DEL CARRITO (Badge Inferior)
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

// 4. INTERCEPTOR GLOBAL DE CLICS (Apertura de Detalles)
document.addEventListener("click", (e) => {
    const card = e.target.closest(".app-product-card");
    
    if (card && !card.classList.contains("ecopoint-card")) {
        e.preventDefault(); 
        
        let productId = card.getAttribute("data-id");
        let productToView = null;

        if (!productId) {
            const hiddenElement = card.querySelector("[data-id]");
            if (hiddenElement) productId = hiddenElement.getAttribute("data-id");
        }

        if (productId && window.allProducts) {
            productToView = window.allProducts.find(p => String(p.id) === String(productId));
        }

        if (!productToView && window.allProducts) {
            const nameElement = card.querySelector(".product-name");
            if (nameElement) {
                const productName = nameElement.textContent.trim();
                productToView = window.allProducts.find(p => p.name === productName);
            }
        }

        if (productToView) {
            localStorage.setItem("selectedProductDetail", JSON.stringify(productToView));
            window.location.href = "producto-detalle.html";
        }
    }
});

// 5. BÚSQUEDA PRINCIPAL (Al presionar "Enter" en el teclado móvil)
window.executeMainSearch = function() {
    const searchInput = document.getElementById('main-search-input');
    if(searchInput) {
        const query = searchInput.value.trim();
        searchInput.blur(); 
        
        if (query) {
            localStorage.setItem('globalSearchQuery', query);
            window.location.href = 'Productos.html?q=' + encodeURIComponent(query);
        } else {
            window.location.href = 'Productos.html';
        }
    }
};
