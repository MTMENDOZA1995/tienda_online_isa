// js/product-detail.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    const productNameElem = document.getElementById("product-name");
    const productDescriptionElem = document.getElementById("product-description");
    const productPriceElem = document.getElementById("product-price"); 
    const productPriceOldElem = document.getElementById("product-price-old"); 
    const productStockElem = document.getElementById("product-stock");
    const productCodeElem = document.getElementById("product-code");
    const productCategoryElem = document.getElementById("product-category");
    const productShippingElem = document.getElementById("product-shipping");
    const productAdditionalInfoElem = document.getElementById("product-additional-info");
    
    // Galería
    const mainImageElem = document.getElementById("main-product-image"); 
    const thumbnailContainer = document.getElementById("thumbnail-container"); 
    const discountBadge = document.getElementById("detail-discount-badge");

    // Variantes
    const modelContainer = document.getElementById("product-model-container"); 
    const colorContainer = document.getElementById("product-color-container"); 
    const sizeContainer = document.getElementById("product-size-container"); 
    
    // Controles de Cantidad
    const qtyInput = document.getElementById("product-quantity"); 
    const btnMinus = document.querySelector(".minus-btn");
    const btnPlus = document.querySelector(".plus-btn");

    // Botón de compra
    const addToCartDetailBtn = document.getElementById("add-to-cart-btn");

    // Carrusel de recomendados (Nuevo)
    const recommendedList = document.getElementById("recommended-list");

    // Variable global para controlar el stock actual
    let currentMaxStock = 0;
    // Variable global para guardar el producto actual (sirve para las recomendaciones)
    let currentProduct = null;

    // --- Funciones de Utilidad ---
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) return "S/ 0.00";
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN', 
            minimumFractionDigits: 2,
        }).format(amount);
    };

    /**
     * Renderiza opciones como botones "Píldora"
     */
    const renderPillOptions = (container, optionsArray) => {
        if (!container) return;
        container.innerHTML = ''; 
        
        const parentGroup = container.closest('.option-group');

        if (!optionsArray || optionsArray.length === 0 || (optionsArray.length === 1 && optionsArray[0].toLowerCase() === "unico")) {
            parentGroup.style.display = 'none';
            container.dataset.selectedValue = "Unico"; 
            return;
        }

        parentGroup.style.display = 'block';
        container.dataset.selectedValue = ""; 

        optionsArray.forEach(optionValue => {
            const btn = document.createElement("button");
            btn.className = "option-pill";
            btn.textContent = optionValue;
            
            btn.addEventListener("click", () => {
                container.querySelectorAll(".option-pill").forEach(p => p.classList.remove("active"));
                btn.classList.add("active");
                container.dataset.selectedValue = optionValue;
            });
            
            container.appendChild(btn);
        });
    };

    const initAccordions = () => {
        document.querySelectorAll(".accordion-header").forEach(header => {
            header.addEventListener("click", () => {
                const item = header.closest(".accordion-item");
                const body = item.querySelector(".accordion-body");
                item.classList.toggle("open");
                
                if (item.classList.contains("open")) {
                    body.style.display = "block";
                } else {
                    body.style.display = "none";
                }
            });
        });
    };

    // --- Lógica Principal: Renderizar el Producto ---
    const displayProductDetails = () => {
        currentProduct = JSON.parse(localStorage.getItem("selectedProductDetail"));

        if (!currentProduct) {
            if (productNameElem) productNameElem.textContent = "Producto no encontrado";
            if (addToCartDetailBtn) {
                addToCartDetailBtn.disabled = true;
                addToCartDetailBtn.textContent = "No disponible";
                addToCartDetailBtn.style.backgroundColor = "#ccc";
            }
            return;
        }

        // Textos
        if (productNameElem) productNameElem.textContent = currentProduct.name;
        if (productDescriptionElem) productDescriptionElem.textContent = currentProduct.description;
        if (productCodeElem) productCodeElem.textContent = currentProduct.code || "N/A";
        if (productCategoryElem) productCategoryElem.textContent = currentProduct.category || "Categoría";
        if (productShippingElem) productShippingElem.textContent = currentProduct.shippingPolicy || "Consulte características.";
        if (productAdditionalInfoElem) productAdditionalInfoElem.innerHTML = currentProduct.additionalInfo || "<li>No hay información adicional.</li>";
        
        currentMaxStock = currentProduct.stock || 0;
        if (productStockElem) productStockElem.textContent = currentMaxStock;

        // Precios
        let finalPrice = currentProduct.originalPrice;

        if (currentProduct.originalPrice && currentProduct.discountPercent > 0) {
            finalPrice = currentProduct.originalPrice * (1 - currentProduct.discountPercent / 100);

            if (productPriceOldElem) productPriceOldElem.textContent = formatCurrency(currentProduct.originalPrice);
            if (productPriceElem) productPriceElem.textContent = formatCurrency(finalPrice);
            
            if (discountBadge) {
                discountBadge.textContent = `-${currentProduct.discountPercent}%`;
                discountBadge.style.display = 'block';
            }
        } else {
            if (productPriceElem) productPriceElem.textContent = formatCurrency(currentProduct.originalPrice);
            if (productPriceOldElem) productPriceOldElem.style.display = 'none';
            if (discountBadge) discountBadge.style.display = 'none';
        }

        // Galería
        if (mainImageElem) {
            mainImageElem.src = currentProduct.images?.main || "imagenes/default.jpg";
        }

        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = ''; 
            const allImages = [
                currentProduct.images?.main,
                currentProduct.images?.extra1,
                currentProduct.images?.extra2,
                currentProduct.images?.extra3
            ].filter(Boolean); 

            allImages.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = `Vista ${index + 1}`;
                
                if (index === 0) img.classList.add("active");

                img.addEventListener("click", () => {
                    mainImageElem.style.opacity = 0.5; 
                    setTimeout(() => {
                        mainImageElem.src = imgSrc;
                        mainImageElem.style.opacity = 1;
                    }, 150);
                    
                    thumbnailContainer.querySelectorAll("img").forEach(i => i.classList.remove("active"));
                    img.classList.add("active");
                });
                
                thumbnailContainer.appendChild(img);
            });
        }

        // Variantes
        renderPillOptions(modelContainer, currentProduct.models);
        renderPillOptions(colorContainer, currentProduct.colors);
        renderPillOptions(sizeContainer, currentProduct.sizes);

        // Botón de Compra
        if (currentMaxStock === 0) {
            if (qtyInput) qtyInput.value = 0;
            if (btnMinus) btnMinus.disabled = true;
            if (btnPlus) btnPlus.disabled = true;
            if (addToCartDetailBtn) {
                addToCartDetailBtn.disabled = true;
                addToCartDetailBtn.textContent = "Agotado";
                addToCartDetailBtn.style.backgroundColor = "#ccc";
            }
        } else {
            if (qtyInput) qtyInput.value = 1;
        }
        
        initAccordions();
    };

    displayProductDetails(); 

    // --- Lógica del Carrusel de Recomendaciones (SIMILARES) ---
    const renderRecommendedList = () => {
        if (!recommendedList || !currentProduct) return;
        
        // Esperamos a que window.allProducts se cargue desde Products.js
        setTimeout(() => {
            const catalogDB = window.allProducts || [];
            if (catalogDB.length === 0) {
                recommendedList.innerHTML = `<div style="font-size:11px; color:#888; padding-left:15px;">Catálogo no disponible.</div>`;
                return;
            }

            // 1. Filtrar: Mismas categoría, que tengan stock, y que no sea el producto actual
            let recommended = catalogDB.filter(p => 
                p.category === currentProduct.category && 
                p.id !== currentProduct.id && 
                p.stock > 0
            );

            // 2. Si no hay 4 de la misma categoría, rellenar con otros
            if (recommended.length < 4) {
                const fallbacks = catalogDB.filter(p => p.id !== currentProduct.id && !recommended.includes(p) && p.stock > 0);
                recommended = recommended.concat(fallbacks);
            }

            // Tomamos los primeros 6
            const finalRecommendations = recommended.slice(0, 6);

            if (finalRecommendations.length === 0) {
                recommendedList.closest('section').style.display = 'none'; // Ocultar si no hay nada
                return;
            }

            recommendedList.innerHTML = "";

            // Renderizar las tarjetas (Igual que en FCompra)
            finalRecommendations.forEach(rec => {
                const originalPrice = rec.originalPrice || 0;
                let finalPrice = originalPrice;
                let priceHTML = "";

                if (rec.discountPercent > 0) {
                    finalPrice = originalPrice * (1 - rec.discountPercent / 100);
                    priceHTML = `
                        <span style="font-size: 10px; color: #999; text-decoration: line-through; display:block;">${formatCurrency(originalPrice)}</span>
                        <span class="price-offer" style="font-size: 13px; color: #d0021b; font-weight: 700;">${formatCurrency(finalPrice)}</span>
                    `;
                } else {
                    priceHTML = `
                        <span class="price-offer" style="font-size: 13px; color: #6cc82a; font-weight: 700; display:block; margin-top:14px;">${formatCurrency(finalPrice)}</span>
                    `;
                }

                const imgSrc = rec.images?.main || "imagenes/default.jpg";
                const badgeHTML = rec.discountPercent > 0 ? `<div class="discount-badge" style="font-size: 9px; padding: 2px 4px;">-${rec.discountPercent}%</div>` : '';

                // ¿Requiere que el usuario seleccione color/talla?
                const requiresChoice = (rec.models && rec.models.length > 1) ||
                                       (rec.colors && rec.colors.length > 1) ||
                                       (rec.sizes && rec.sizes.length > 1);

                const btnText = requiresChoice ? "Ver opciones" : "+ Agregar";
                const btnClass = requiresChoice ? "view-options-btn" : "add-rec-btn";
                const btnBg = requiresChoice ? "#111" : "#6cc82a";

                const card = document.createElement("div");
                card.className = "app-product-card";
                card.style.cssText = "width: 120px; flex: 0 0 auto; margin-bottom: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative;";
                
                card.innerHTML = `
                    <div class="product-image-container eco-image-click" data-id="${rec.id}" style="height: 90px; padding: 5px; cursor:pointer;">
                        ${badgeHTML}
                        <img src="${imgSrc}" alt="${rec.name}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div class="product-info" style="padding: 8px;">
                        <p class="product-name eco-title-click" data-id="${rec.id}" style="font-size: 10px; min-height: 26px; line-height: 1.2; margin-bottom: 4px; cursor:pointer;">${rec.name}</p>
                        ${priceHTML}
                        <button class="add-btn ${btnClass}" data-id="${rec.id}" style="padding: 5px; font-size: 10px; margin-top: 6px; width: 100%; background-color:${btnBg};">${btnText}</button>
                    </div>
                `;
                recommendedList.appendChild(card);
            });

            // Eventos del carrusel: "Ver opciones" / Click en imagen / Click en titulo
            recommendedList.querySelectorAll(".view-options-btn, .eco-image-click, .eco-title-click").forEach(el => {
                el.addEventListener("click", (e) => {
                    const elTarget = e.target.closest("[data-id]");
                    if(!elTarget) return;
                    
                    const productId = parseInt(elTarget.getAttribute("data-id"));
                    const productToView = finalRecommendations.find(p => p.id === productId);
                    
                    if (productToView) {
                        localStorage.setItem("selectedProductDetail", JSON.stringify(productToView));
                        // Recargar la página limpia para mostrar el nuevo producto
                        window.location.reload(); 
                    }
                });
            });

            // Evento del carrusel: "+ Agregar Directo"
            recommendedList.querySelectorAll(".add-rec-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const productId = parseInt(e.target.getAttribute("data-id"));
                    const productToUpsell = finalRecommendations.find(p => p.id === productId);
                    
                    if (productToUpsell) {
                        const finalPrice = productToUpsell.discountPercent > 0 ? productToUpsell.originalPrice * (1 - productToUpsell.discountPercent / 100) : productToUpsell.originalPrice;
                        const defModel = productToUpsell.models && productToUpsell.models.length > 0 ? productToUpsell.models[0] : "Unico";
                        const defColor = productToUpsell.colors && productToUpsell.colors.length > 0 ? productToUpsell.colors[0] : "Unico";
                        const defSize = productToUpsell.sizes && productToUpsell.sizes.length > 0 ? productToUpsell.sizes[0] : "Unico";

                        const itemToAdd = {
                            id: productToUpsell.id,
                            code: productToUpsell.code || "No especificado",
                            name: productToUpsell.name,
                            price: Number(finalPrice.toFixed(2)),
                            image: productToUpsell.images?.main || "imagenes/default.jpg",
                            quantity: 1,
                            model: defModel, color: defColor, size: defSize,
                            maxStock: productToUpsell.stock
                        };
                        
                        if(typeof window.addToCart === 'function') {
                            window.addToCart(itemToAdd);
                            
                            const originalText = e.target.textContent;
                            e.target.textContent = "¡Listo!";
                            e.target.style.backgroundColor = "#2e7d32";
                            setTimeout(() => {
                                e.target.textContent = originalText;
                                e.target.style.backgroundColor = "#6cc82a";
                            }, 1000);
                        }
                    }
                });
            });

        }, 150); // Pequeño retraso para asegurar que Products.js haya cargado el catálogo global
    };

    // Ejecutar el recomendador
    renderRecommendedList();


    // --- Manejo de Controles de Cantidad (+ / -) ---
    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener("click", () => {
            let currentValue = parseInt(qtyInput.value) || 1;
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });

        btnPlus.addEventListener("click", () => {
            let currentValue = parseInt(qtyInput.value) || 1;
            if (currentValue < currentMaxStock) {
                qtyInput.value = currentValue + 1;
            } else {
                alert(`Solo hay ${currentMaxStock} unidades disponibles en stock.`);
            }
        });
    }

    // --- Lógica del Botón Principal "Agregar al Carrito" Fijo ---
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener("click", () => {
            if (!currentProduct || currentProduct.stock === 0) return;

            const quantity = parseInt(qtyInput?.value) || 1;
            const selectedModel = modelContainer?.dataset.selectedValue;
            const selectedColor = colorContainer?.dataset.selectedValue;
            const selectedSize = sizeContainer?.dataset.selectedValue;

            if (modelContainer.closest('.option-group').style.display !== 'none' && !selectedModel) {
                alert("❌ Por favor, selecciona un modelo."); return;
            }
            if (colorContainer.closest('.option-group').style.display !== 'none' && !selectedColor) {
                alert("❌ Por favor, selecciona un color."); return;
            }
            if (sizeContainer.closest('.option-group').style.display !== 'none' && !selectedSize) {
                alert("❌ Por favor, selecciona un tamaño."); return;
            }

            let finalPrice = currentProduct.originalPrice;
            if (currentProduct.discountPercent > 0) {
                finalPrice = currentProduct.originalPrice * (1 - currentProduct.discountPercent / 100);
            }

            const itemToAdd = {
                id: currentProduct.id,
                code: currentProduct.code || "No especificado",
                name: currentProduct.name,
                price: Number(finalPrice.toFixed(2)), 
                image: currentProduct.images?.main || "imagenes/default.jpg",
                quantity: quantity,
                model: selectedModel || "Unico",
                color: selectedColor || "Unico",
                size: selectedSize || "Unico",
                maxStock: currentProduct.stock
            };

            if (typeof window.addToCart !== 'undefined') {
                window.addToCart(itemToAdd);
                
                const originalText = addToCartDetailBtn.textContent;
                addToCartDetailBtn.textContent = "¡Agregado!";
                addToCartDetailBtn.style.backgroundColor = "#2e7d32"; 
                setTimeout(() => {
                    addToCartDetailBtn.textContent = originalText;
                    addToCartDetailBtn.style.backgroundColor = ""; 
                }, 1500);
                
            } else {
                console.error("No se detectó cart.js cargado.");
            }
        });
    }
    
    // --- Lógica Botón de Favorito Flotante ---
    const detailFavBtn = document.querySelector(".detail-fav-btn");
    if(detailFavBtn) {
        detailFavBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.replace('fa-regular', 'fa-solid');
                icon.style.color = '#ff2a00';
            } else {
                icon.classList.replace('fa-solid', 'fa-regular');
                icon.style.color = '';
            }
        });
    }
});
