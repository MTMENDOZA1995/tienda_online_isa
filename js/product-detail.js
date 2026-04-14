// js/product-detail.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    const productNameElem = document.getElementById("product-name");
    const productDescriptionElem = document.getElementById("product-description");
    const productPriceElem = document.getElementById("product-price"); 
    const productPriceOldElem = document.getElementById("product-price-old"); 
    const productPriceSElem = document.getElementById("product-priceS"); 
    const productStockElem = document.getElementById("product-stock");
    const productCodeElem = document.getElementById("product-code");
    const productCategoryElem = document.getElementById("product-category");
    const productShippingElem = document.getElementById("product-shipping");
    const productAdditionalInfoElem = document.getElementById("product-additional-info");
    
    // Galería
    const mainImageElem = document.getElementById("main-product-image"); 
    const thumbnailContainer = document.getElementById("thumbnail-container"); 
    const discountBadge = document.getElementById("detail-discount-badge");

    // Variantes (Nuevos contenedores de Píldoras)
    const modelContainer = document.getElementById("product-model-container"); 
    const colorContainer = document.getElementById("product-color-container"); 
    const sizeContainer = document.getElementById("product-size-container"); 
    
    // Controles de Cantidad
    const qtyInput = document.getElementById("product-quantity"); 
    const btnMinus = document.querySelector(".minus-btn");
    const btnPlus = document.querySelector(".plus-btn");

    // Botón de compra
    const addToCartDetailBtn = document.getElementById("add-to-cart-btn");

    // Variable global para controlar el stock actual en la vista
    let currentMaxStock = 0;

    // --- Funciones de Utilidad ---

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) return "S/. 0.00";
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN', 
            minimumFractionDigits: 2,
        }).format(amount);
    };

    /**
     * Renderiza las opciones como botones "Píldora" en lugar de un <select>
     */
    const renderPillOptions = (container, optionsArray) => {
        if (!container) return;
        container.innerHTML = ''; 
        
        const parentGroup = container.closest('.option-group');

        // Si no hay opciones o solo dice "Unico", ocultamos el bloque completo
        if (!optionsArray || optionsArray.length === 0 || (optionsArray.length === 1 && optionsArray[0].toLowerCase() === "unico")) {
            parentGroup.style.display = 'none';
            container.dataset.selectedValue = "Unico"; // Valor por defecto silencioso
            return;
        }

        parentGroup.style.display = 'block';
        container.dataset.selectedValue = ""; // Resetea el valor seleccionado

        optionsArray.forEach(optionValue => {
            const btn = document.createElement("button");
            btn.className = "option-pill";
            btn.textContent = optionValue;
            
            btn.addEventListener("click", () => {
                // Quitar clase active de todos los hermanos
                container.querySelectorAll(".option-pill").forEach(p => p.classList.remove("active"));
                // Añadir clase active al clickeado
                btn.classList.add("active");
                // Guardar el valor en el dataset del contenedor para usarlo al añadir al carrito
                container.dataset.selectedValue = optionValue;
            });
            
            container.appendChild(btn);
        });
    };

    // --- Inicialización de Acordeones (Descripción / Envío) ---
    const initAccordions = () => {
        document.querySelectorAll(".accordion-header").forEach(header => {
            header.addEventListener("click", () => {
                const item = header.closest(".accordion-item");
                const body = item.querySelector(".accordion-body");
                
                // Alternar clase 'open' para rotar la flecha
                item.classList.toggle("open");
                
                // Mostrar u ocultar el contenido
                if (item.classList.contains("open")) {
                    body.style.display = "block";
                } else {
                    body.style.display = "none";
                }
            });
        });
    };

    // --- Lógica Principal ---
    const displayProductDetails = () => {
        const product = JSON.parse(localStorage.getItem("selectedProductDetail"));

        if (!product) {
            if (productNameElem) productNameElem.textContent = "Producto no encontrado";
            if (addToCartDetailBtn) {
                addToCartDetailBtn.disabled = true;
                addToCartDetailBtn.textContent = "No disponible";
                addToCartDetailBtn.style.backgroundColor = "#ccc";
            }
            return;
        }

        // 1. Textos Generales
        if (productNameElem) productNameElem.textContent = product.name;
        if (productDescriptionElem) productDescriptionElem.textContent = product.description;
        if (productCodeElem) productCodeElem.textContent = product.code || "N/A";
        if (productCategoryElem) productCategoryElem.textContent = product.category || "Categoría";
        if (productShippingElem) productShippingElem.textContent = product.shippingPolicy || "Consulte características.";
        if (productAdditionalInfoElem) productAdditionalInfoElem.innerHTML = product.additionalInfo || "<li>No hay información adicional.</li>";
        
        // Stock Global
        currentMaxStock = product.stock || 0;
        if (productStockElem) productStockElem.textContent = currentMaxStock;

        // 2. Precios y Descuentos
        let finalPrice = product.originalPrice;

        if (product.originalPrice && product.discountPercent > 0) {
            finalPrice = product.originalPrice * (1 - product.discountPercent / 100);

            if (productPriceOldElem) productPriceOldElem.textContent = formatCurrency(product.originalPrice);
            if (productPriceElem) productPriceElem.textContent = formatCurrency(finalPrice);
            
            if (discountBadge) {
                discountBadge.textContent = `-${product.discountPercent}%`;
                discountBadge.style.display = 'block';
            }
        } else {
            if (productPriceElem) productPriceElem.textContent = formatCurrency(product.originalPrice);
            if (productPriceOldElem) productPriceOldElem.style.display = 'none';
            if (discountBadge) discountBadge.style.display = 'none';
        }

        // 3. Galería de Imágenes (Carrusel)
        if (mainImageElem) {
            mainImageElem.src = product.images?.main || "imagenes/default.jpg";
        }

        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = ''; 
            const allImages = [
                product.images?.main,
                product.images?.extra1,
                product.images?.extra2,
                product.images?.extra3
            ].filter(Boolean); // Elimina vacíos/nulos

            allImages.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = `Vista ${index + 1}`;
                
                if (index === 0) img.classList.add("active");

                img.addEventListener("click", () => {
                    // Cambia la imagen grande
                    mainImageElem.style.opacity = 0.5; // Efecto sutil
                    setTimeout(() => {
                        mainImageElem.src = imgSrc;
                        mainImageElem.style.opacity = 1;
                    }, 150);
                    
                    // Actualiza el borde verde
                    thumbnailContainer.querySelectorAll("img").forEach(i => i.classList.remove("active"));
                    img.classList.add("active");
                });
                
                thumbnailContainer.appendChild(img);
            });
        }

        // 4. Renderizar Variantes (Píldoras)
        renderPillOptions(modelContainer, product.models);
        renderPillOptions(colorContainer, product.colors);
        renderPillOptions(sizeContainer, product.sizes);

        // 5. Configurar Botón y Controles de Cantidad
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
        
        // Inicializar interactividad de los acordeones
        initAccordions();
    };

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
                // Alerta nativa ligera si intenta superar el stock
                alert(`Solo hay ${currentMaxStock} unidades disponibles.`);
            }
        });
    }

    // --- Ejecutar al cargar la vista ---
    displayProductDetails(); 

    // --- Lógica del Botón "Agregar al Carrito" Fijo ---
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener("click", () => {
            const product = JSON.parse(localStorage.getItem("selectedProductDetail"));
            if (!product || product.stock === 0) return;

            const quantity = parseInt(qtyInput?.value) || 1;
            const selectedModel = modelContainer?.dataset.selectedValue;
            const selectedColor = colorContainer?.dataset.selectedValue;
            const selectedSize = sizeContainer?.dataset.selectedValue;

            // Validaciones (Verifica si el bloque está visible y no se ha seleccionado nada)
            if (modelContainer.closest('.option-group').style.display !== 'none' && !selectedModel) {
                alert("❌ Por favor, selecciona un modelo."); return;
            }
            if (colorContainer.closest('.option-group').style.display !== 'none' && !selectedColor) {
                alert("❌ Por favor, selecciona un color."); return;
            }
            if (sizeContainer.closest('.option-group').style.display !== 'none' && !selectedSize) {
                alert("❌ Por favor, selecciona un tamaño."); return;
            }

            // Calcular el precio final de nuevo para seguridad
            let finalPrice = product.originalPrice;
            if (product.discountPercent > 0) {
                finalPrice = product.originalPrice * (1 - product.discountPercent / 100);
            }

            // Objeto a enviar al carrito
            const itemToAdd = {
                id: product.id,
                name: product.name,
                price: Number(finalPrice.toFixed(2)), 
                image: product.images?.main || "imagenes/default.jpg",
                quantity: quantity,
                model: selectedModel || "Unico",
                color: selectedColor || "Unico",
                size: selectedSize || "Unico",
                maxStock: product.stock
            };

            // Enviar a cart.js
            if (typeof addToCart !== 'undefined') {
                addToCart(itemToAdd);
                
                // Efecto visual de botón exitoso
                const originalText = addToCartDetailBtn.textContent;
                addToCartDetailBtn.textContent = "¡Agregado!";
                addToCartDetailBtn.style.backgroundColor = "#2e7d32"; // Un verde más oscuro
                setTimeout(() => {
                    addToCartDetailBtn.textContent = originalText;
                    addToCartDetailBtn.style.backgroundColor = ""; // Regresa al normal
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
