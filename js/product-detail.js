// js/product-detail.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    const productNameElem = document.getElementById("product-name");
    const productDescriptionElem = document.getElementById("product-description");
    const productPriceElem = document.getElementById("product-price"); // Precio de oferta/principal
    const productPriceOldElem = document.getElementById("product-price-old"); // Precio tachado
    const productPriceSElem = document.getElementById("product-priceS"); // Precio normal (sin descuento)
    const productStockElem = document.getElementById("product-stock");
    const productCodeElem = document.getElementById("product-code");
    const productCategoryElem = document.getElementById("product-category");
    const productShippingElem = document.getElementById("product-shipping");
    const productAdditionalInfoElem = document.getElementById("product-additional-info");
    const mainImageElem = document.getElementById("main-product-image"); // Usando el ID del HTML mejorado
    const thumbnailContainer = document.querySelector(".thumbnail-images"); // Contenedor de miniaturas
    const modelSelect = document.getElementById("product-model"); // Usando el ID del HTML mejorado
    const colorSelect = document.getElementById("product-color"); // Usando el ID del HTML mejorado
    const sizeSelect = document.getElementById("product-size");   // Usando el ID del HTML mejorado
    const addToCartDetailBtn = document.querySelector(".add-to-cart-btn-detail"); // Botón de agregar al carrito
    const productQuantityInput = document.getElementById("product-quantity"); // Input de cantidad

    // --- Funciones de Utilidad ---

    /**
     * Formatea un número a la moneda local (S/.).
     * @param {number} amount El monto a formatear.
     * @returns {string} El monto formateado como cadena de moneda.
     */
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) {
            console.warn("Intento de formatear un valor no numérico:", amount);
            return "S/. 0.00"; // Devuelve un valor por defecto seguro
        }
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN', // PEN para Sol peruano
            minimumFractionDigits: 2,
        }).format(amount);
    };

    /**
     * Renderiza las opciones de un selector (modelo, color, tamaño).
     * @param {HTMLElement} selectElement El elemento <select> del DOM.
     * @param {Array<string>} optionsArray El array de opciones (ej. product.models).
     * @param {string} placeholder Texto si no hay opciones o es 'Unico'.
     */
    const renderSelectOptions = (selectElement, optionsArray, placeholder = "No disponible") => {
        if (!selectElement) return; // Asegurarse de que el elemento existe

        selectElement.innerHTML = ''; // Limpiar opciones existentes

        if (!optionsArray || optionsArray.length === 0 || (optionsArray.length === 1 && optionsArray[0].toLowerCase() === "unico")) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = placeholder;
            option.disabled = true; // Hacer la opción "No disponible" no seleccionable
            option.selected = true; // Seleccionarla por defecto
            selectElement.appendChild(option);
            selectElement.style.display = 'none'; // Ocultar el select si no es relevante
            selectElement.closest('.options-selector').querySelector(`label[for="${selectElement.id}"]`).style.display = 'none'; // Ocultar también la etiqueta
        } else {
            selectElement.style.display = 'block'; // Mostrar el select
            selectElement.closest('.options-selector').querySelector(`label[for="${selectElement.id}"]`).style.display = 'block'; // Mostrar la etiqueta
            optionsArray.forEach(optionValue => {
                const option = document.createElement("option");
                option.value = optionValue;
                option.textContent = optionValue;
                selectElement.appendChild(option);
            });
        }
    };

    /**
     * Muestra la información del producto en la página de detalles.
     */
    const displayProductDetails = () => {
        // Usar "selectedProductDetail" como la clave del localStorage
        const product = JSON.parse(localStorage.getItem("selectedProductDetail"));

        if (!product) {
            console.error("No se encontró el producto en localStorage.");
            // Manejo de error: redirigir o mostrar un mensaje amistoso
            if (productNameElem) productNameElem.textContent = "Producto no encontrado";
            // Opcional: Redirigir al inicio o a la página de productos
            // window.location.href = "productos.html";
            return;
        }

        // --- Asignación de Contenido de Texto ---
        if (productNameElem) productNameElem.textContent = product.name || "Producto sin nombre";
        if (productDescriptionElem) productDescriptionElem.textContent = product.description || "Sin descripción disponible.";
        if (productStockElem) productStockElem.textContent = `Stock: ${product.stock > 0 ? product.stock : 'Agotado'}`;
        if (productCodeElem) productCodeElem.textContent = `Código: ${product.code || "N/A"}`;
        if (productCategoryElem) productCategoryElem.textContent = `Categoría: ${product.category || "N/A"}`;
        if (productShippingElem) productShippingElem.textContent = `Política de Envío: ${product.shippingPolicy || "Consulte políticas de envío."}`;
        if (productAdditionalInfoElem) productAdditionalInfoElem.textContent = `Información Adicional: ${product.additionalInfo || "No hay información adicional."}`;

        // --- Lógica de Precios ---
        if (productPriceOldElem) {
            if (product.originalPrice && product.originalPrice > product.price) {
                productPriceOldElem.textContent = formatCurrency(product.originalPrice);
                productPriceOldElem.style.display = 'inline';
            } else {
                productPriceOldElem.style.display = 'none'; // Ocultar si no hay precio original o no es un descuento
            }
        }

        if (productPriceElem) { // Este es el precio de oferta
            productPriceElem.textContent = formatCurrency(product.price);
            productPriceElem.style.display = 'inline';
        }

        // Asegúrate de ocultar priceS si hay precio de oferta, o mostrarlo si no hay precio original
        if (productPriceSElem) {
            if (!product.originalPrice || product.originalPrice <= product.price) {
                // Si no hay precio original o el precio actual no es menor, entonces el precio actual es el "normal"
                productPriceSElem.textContent = formatCurrency(product.price);
                productPriceSElem.style.display = 'inline';
                if (productPriceElem) productPriceElem.style.display = 'none'; // Oculta el precio de oferta si no hay tal
            } else {
                productPriceSElem.style.display = 'none';
            }
        }

        // --- Gestión de Imágenes ---
        if (mainImageElem) {
            mainImageElem.src = product.images?.main || "imagenes/default.jpg";
            mainImageElem.alt = product.name || "Imagen del producto";
        }

        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = ''; // Limpiar miniaturas existentes
            const allProductImages = [
                product.images?.main,
                product.images?.extra1,
                product.images?.extra2,
                product.images?.extra3
            ].filter(img => img); // Filtra cualquier imagen nula o indefinida

            allProductImages.forEach((imgSrc, index) => {
                const thumbnailImg = document.createElement("img");
                thumbnailImg.src = imgSrc;
                thumbnailImg.alt = `${product.name} - Vista ${index + 1}`;
                thumbnailImg.classList.add("thumbnail");
                thumbnailImg.dataset.full = imgSrc; // Usar data-full para la imagen principal

                // Activar la primera miniatura por defecto
                if (index === 0) {
                    thumbnailImg.classList.add("active-thumbnail");
                }

                thumbnailImg.addEventListener("click", function() {
                    mainImageElem.src = this.dataset.full;
                    // Eliminar clase activa de todas las miniaturas y añadirla a la clicada
                    document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active-thumbnail"));
                    this.classList.add("active-thumbnail");
                });
                thumbnailContainer.appendChild(thumbnailImg);
            });
        }

        // --- Renderizar Selectores de Opciones (Modelo, Color, Tamaño) ---
        renderSelectOptions(modelSelect, product.models, "Selecciona un modelo");
        renderSelectOptions(colorSelect, product.colors, "Selecciona un color");
        renderSelectOptions(sizeSelect, product.sizes, "Selecciona un tamaño");

        // --- Cantidad y Botón de Carrito ---
        if (productQuantityInput) {
            productQuantityInput.value = 1;
            productQuantityInput.min = 1;
            productQuantityInput.max = product.stock > 0 ? product.stock : 1;
            productQuantityInput.disabled = product.stock === 0; // Deshabilitar si no hay stock
        }

        if (addToCartDetailBtn) {
            addToCartDetailBtn.disabled = product.stock === 0;
            addToCartDetailBtn.textContent = product.stock === 0 ? "Agotado" : "Agregar al Carrito";
        }
    };

    // --- Inicialización ---
    displayProductDetails(); // Muestra los detalles al cargar la página

    // --- Lógica del botón "Agregar al Carrito" en la página de detalles ---
    if (addToCartDetailBtn) {
        addToCartDetailBtn.addEventListener("click", () => {
            const product = JSON.parse(localStorage.getItem("selectedProductDetail")); // Recargar el producto por si acaso
            if (!product) {
                alert("❌ No se pudo agregar el producto. Información no disponible.");
                return;
            }

            const quantity = parseInt(productQuantityInput?.value, 10);
            const selectedModel = modelSelect?.value;
            const selectedColor = colorSelect?.value;
            const selectedSize = sizeSelect?.value;

            // Validaciones básicas
            if (isNaN(quantity) || quantity <= 0 || quantity > product.stock) {
                alert(`❌ Cantidad inválida. Por favor, ingresa un número entre 1 y ${product.stock}.`);
                return;
            }
            if (product.models && product.models.length > 0 && product.models[0].toLowerCase() !== "unico" && !selectedModel) {
                alert("❌ Por favor, selecciona un modelo.");
                return;
            }
            if (product.colors && product.colors.length > 0 && product.colors[0].toLowerCase() !== "unico" && !selectedColor) {
                alert("❌ Por favor, selecciona un color.");
                return;
            }
            if (product.sizes && product.sizes.length > 0 && product.sizes[0].toLowerCase() !== "unico" && !selectedSize) {
                alert("❌ Por favor, selecciona un tamaño.");
                return;
            }

            // Crear el objeto para añadir al carrito
            const itemToAdd = {
                id: product.id,
                name: product.name,
                price: product.price, // Usar el precio numérico
                image: product.images?.main || "imagenes/default-image.jpg",
                quantity: quantity,
                model: selectedModel || "Unico", // Usar "Unico" si no aplica
                color: selectedColor || "Unico",
                size: selectedSize || "Unico",
                maxStock: product.stock // Para referencia en el carrito (evitar sobrepasar el stock)
            };

            // Llama a la función global para agregar al carrito (definida en cart.js)
            if (typeof addToCart !== 'undefined') { // Verifica si la función existe
                addToCart(itemToAdd);
            } else {
                console.error("Función addToCart no definida. Asegúrate de cargar cart.js.");
                alert("Producto agregado (pero la función del carrito no está disponible).");
            }
        });
    }
});