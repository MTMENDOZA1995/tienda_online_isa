// js/Ecopoints.js
// ==========================================================================
// LÓGICA DE LA TIENDA DE ECOPOINTS (ESTILO ALIEXPRESS - CATEGORÍAS CORREGIDAS)
// ==========================================================================

window.ecoProducts = [];

document.addEventListener("DOMContentLoaded", () => {
    
    const ecoProductList = document.getElementById("eco-product-list");
    const loadingSpinner = document.getElementById("eco-loading-spinner");
    const categoryChips = document.querySelectorAll("#eco-category-chips .chip");
    
    const searchInput = document.getElementById("eco-search-input");
    const searchResultsSection = document.getElementById("search-results-section");
    const searchProductList = document.getElementById("search-product-list");
    const sectionsToHide = document.querySelectorAll(".toggleable-section");

    const showLoading = () => {
        if (ecoProductList) ecoProductList.style.display = "none";
        if (loadingSpinner) loadingSpinner.style.display = "block";
    };

    const hideLoading = () => {
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (ecoProductList) ecoProductList.style.display = "grid"; 
    };

    // --- Lógica Principal: Renderizar el Catálogo Normal (o Filtrado) ---
    const renderEcoProducts = (productsToRender) => {
        if (!ecoProductList) return;
        ecoProductList.innerHTML = ""; 

        if (productsToRender.length === 0) {
            ecoProductList.style.display = "block"; // Para que el mensaje se centre bien
            ecoProductList.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 40px 20px; color: #888;">
                    <i class="fa-solid fa-leaf fa-2xl" style="color: #ddd; margin-bottom: 15px;"></i>
                    <p style="font-size: 14px;">No hay premios en esta categoría aún.</p>
                </div>
            `;
            return;
        }

        ecoProductList.style.display = "grid"; // Aseguramos que vuelva a ser grid

        productsToRender.forEach(product => {
            const imgSrc = product.images?.main || "imagenes/default.jpg";
            
            const card = document.createElement("div");
            card.className = "app-product-card ecopoint-card";
            card.setAttribute("data-id", product.id); 
            
            card.innerHTML = `
                <div class="product-image-container" style="height: 140px;">
                    <img src="${imgSrc}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <p class="product-name">${product.name}</p>
                    <p class="ecopoint-desc">${product.description ? product.description.substring(0, 45) + '...' : 'Premio especial'}</p>
                    <div class="ecopoint-price" style="margin-bottom: 0;">
                        <i class="fa-solid fa-leaf"></i> ${product.points} pts
                    </div>
                </div>
            `;
            
            ecoProductList.appendChild(card);
        });

        // Asignar eventos de clic a toda la tarjeta
        attachCardEvents(ecoProductList);
    };

    // Clic en cualquier parte de la tarjeta manda a detalles
    const attachCardEvents = (container) => {
        container.querySelectorAll(".app-product-card").forEach(card => {
            card.addEventListener("click", () => {
                const productId = card.getAttribute("data-id");
                const productToView = window.ecoProducts.find(p => String(p.id) === String(productId));
                
                if (productToView) {
                    localStorage.setItem("selectedEcoDetail", JSON.stringify(productToView));
                    window.location.href = "ecopoint-detalle.html"; 
                }
            });
        });
    };

    // --- CARGAR DATOS INICIALES ---
    const loadEcoProducts = () => {
        showLoading();
        
        setTimeout(() => {
            if (window.allProducts && window.allProducts.length > 0) {
                // Generar puntos a partir del precio
                window.ecoProducts = window.allProducts.map(p => ({
                    ...p,
                    points: Math.floor((p.originalPrice || 0) * 10)
                }));
                
                renderEcoProducts(window.ecoProducts);
            } else {
                if (ecoProductList) {
                    ecoProductList.style.display = "block";
                    ecoProductList.innerHTML = `<div style="text-align: center; color: #ff3b30; padding: 20px;">Error: No se pudo conectar con el catálogo.</div>`;
                }
            }
            hideLoading();
        }, 300); 
    };

    loadEcoProducts();

    // ====================================================================
    // LÓGICA DE LOS CHIPS DE CATEGORÍA (CORREGIDA)
    // ====================================================================
    categoryChips.forEach(chip => {
        chip.addEventListener("click", () => {
            // 1. Efecto visual de selección
            categoryChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // 2. Si el buscador estaba activo, limpiar y ocultar resultados de búsqueda
            if (searchInput) {
                searchInput.value = '';
                sectionsToHide.forEach(el => el.classList.remove('search-active-hide'));
                if (searchResultsSection) searchResultsSection.style.display = 'none';
            }

            // 3. Filtrar el catálogo principal
            const selectedCategory = chip.getAttribute("data-category");
            
            if (selectedCategory === "all") {
                renderEcoProducts(window.ecoProducts);
            } else {
                // Filtramos ignorando mayúsculas/minúsculas
                const filtered = window.ecoProducts.filter(p => 
                    p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
                );
                renderEcoProducts(filtered);
            }
        });
    });

    // ====================================================================
    // LÓGICA DEL BUSCADOR EN TIEMPO REAL
    // ====================================================================
    if (searchInput && searchResultsSection && searchProductList) {
        
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.trim().toLowerCase();
            
            // Si borran el texto, volver al catálogo filtrado por el chip activo
            if (term === '') {
                sectionsToHide.forEach(el => el.classList.remove('search-active-hide'));
                searchResultsSection.style.display = 'none';
                
                // Buscar qué chip estaba activo para dejar esa categoría visible
                const activeChip = document.querySelector('.chip.active');
                const cat = activeChip ? activeChip.getAttribute('data-category') : 'all';
                
                if (cat === 'all') {
                    renderEcoProducts(window.ecoProducts);
                } else {
                    const filtered = window.ecoProducts.filter(p => p.category && p.category.toLowerCase() === cat.toLowerCase());
                    renderEcoProducts(filtered);
                }
                return;
            }

            // Ocultar la UI normal y mostrar resultados
            sectionsToHide.forEach(el => el.classList.add('search-active-hide'));
            searchResultsSection.style.display = 'block';

            // Buscar en toda la base de datos
            const results = window.ecoProducts.filter(p => 
                p.name.toLowerCase().includes(term) || 
                (p.category && p.category.toLowerCase().includes(term)) ||
                (p.description && p.description.toLowerCase().includes(term))
            );

            if (results.length === 0) {
                searchProductList.style.display = 'block';
                searchProductList.innerHTML = `
                    <div style="width: 100%; text-align: center; padding: 40px 20px; color: #888;">
                        <i class="fa-solid fa-box-open fa-2xl" style="margin-bottom: 15px; color: #ddd;"></i><br>
                        No encontramos premios para "${term}"
                    </div>`;
            } else {
                searchProductList.style.display = 'grid';
                searchProductList.innerHTML = '';
                
                results.forEach(product => {
                    const imgSrc = product.images?.main || "imagenes/default.jpg";

                    const card = document.createElement("div");
                    card.className = "app-product-card ecopoint-card";
                    card.style.cssText = "width: 100%; margin-bottom: 0;"; 
                    card.setAttribute("data-id", product.id);
                    
                    card.innerHTML = `
                        <div class="product-image-container" style="height: 120px;">
                            <img src="${imgSrc}" alt="${product.name}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <p class="product-name">${product.name}</p>
                            <p class="ecopoint-desc">${product.description ? product.description.substring(0, 40) + '...' : ''}</p>
                            <div class="ecopoint-price" style="margin-bottom:0;">
                                <i class="fa-solid fa-leaf"></i> ${product.points} pts
                            </div>
                        </div>
                    `;
                    searchProductList.appendChild(card);
                });

                attachCardEvents(searchProductList);
            }
        });

        // Prevenir recarga del formulario al dar Enter en teclado móvil
        searchInput.closest('form').addEventListener('submit', (e) => {
            e.preventDefault();
            searchInput.blur();
        });
    }

});
