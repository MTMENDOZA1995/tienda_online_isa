// js/Products.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    const productListContainer = document.querySelector("#product-list"); 
    const loadingSpinner = document.getElementById("loading-spinner"); // Spinner de carga (si existe)
    const categoryChips = document.querySelectorAll(".chip"); // Nuevos chips de categorías

    // Configuración para la carga de productos
    const PRODUCTS_PER_LOAD = 10; // Cantidad de productos a cargar por vez
    let currentProductIndex = 0; 
    let isLoading = false; // Variable de control para el scroll infinito

    // --- Datos de productos ---
    const allProducts = [
        {
            id: 23,
            name: "Guantes Peluche Garra de Gato",
            description: "Ideales para días fríos, disfraces o para quienes aman los accesorios únicos y adorables.",
            originalPrice: 24.00, 
            discountPercent: 70,
            images: { 
                main: "productos/ISA-0000061.jpg",
                extra1: "productos/ISA-0000061-1.jpg",
                extra2: "productos/ISA-0000062.jpg",
                extra3: ""
            },
            code: "ISA-0000061-62",
            stock: 1,
            category: "Ropa", 
            shippingPolicy: `• Material: Poliéster, lana de coral.\n• Género: Mujeres\n• Incluye: 2 unidades`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Crema","Plomo"],
            sizes: ["Unico"]
        },
        {
            id: 22,
            name: "Collar Bluelory de la Suerte para Pareja",
            description: "Símbolo especial de unión, protección y buena fortuna para compartir en pareja",
            originalPrice: 27.00, 
            discountPercent: 70,
            images: { 
                main: "productos/ISA-0000041.jpg",
                extra1: "productos/ISA-0000041-1.jpg",
                extra2: "productos/ISA-0000042.jpg",
                extra3: "productos/ISA-0000041-2.jpg"
            },
            code: "ISA-0000041-42",
            stock: 1,
            category: "Joyeria", 
            shippingPolicy: `• Material: Acero Inoxidable.\n• Género: Unisex\n• Incluye: 1 unidad`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Rosa - Mujer","Oscuro - Hombre"],
            sizes: ["Unico"]
        },
        {
            id: 21,
            name: "Aretes Rosa",
            description: "Aretes de diseño elegante, fabricados en acero inoxidable de alta calidad.",
            originalPrice: 13.00, 
            discountPercent: 70,
            images: { 
                main: "productos/ISA-0000040-1.jpg",
                extra1: "productos/ISA-0000040-2.jpg",
                extra2: "",
                extra3: ""
            },
            code: "ISA-0000040",
            stock: 1,
            category: "Joyeria", 
            shippingPolicy: `• Material: Acero Inoxidable.\n• Género: Mujeres`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Plateado"],
            sizes: ["Unico"]
        },
        {
            id: 20,
            name: "Peine Quita Nudos para Perros y Gatos",
            description: "Peine Quita Nudos para Perros y Gatos elimina enredos, nudos y pelo muerto de forma rápida y segura.",
            originalPrice: 41.00, 
            discountPercent: 70,
            images: { 
                main: "productos/dj44-bu01s0.jpg",
                extra1: "productos/dj44-bu01s1.jpg",
                extra2: "productos/dj44-bu01s.jpg",
                extra3: "productos/dj44-bu02s.jpg"
            },
            code: "dj44-bu01s-dj44-bu02s",
            stock: 3,
            category: "Mascotas", 
            shippingPolicy: `• Material: PVC y Acero Inox.\n• Género: Macotas`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Azul", "Rosado"],
            sizes: ["Unico"]
        },
        {
            id: 19,
            name: "Pulsera Bluelory Acero Inox. Unisex",
            description: "Pulsera Bluelory Acero Inox. Unisex, Negro-Dorado.",
            originalPrice: 19.00, 
            discountPercent: 70,
            images: { 
                main: "productos/ISA-0000030.jpg",
                extra1: "productos/ISA-0000030-1.jpg",
                extra2: "productos/ISA-0000030-2.jpg",
                extra3: "productos/ISA-0000030-3.jpg"
            },
            code: "ISA-0000030",
            stock: 5,
            category: "Pulseras", 
            shippingPolicy: `• Material: Acero Inoxidable.\n• Género: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Dorado", "Negro"],
            sizes: ["Unico"]
        },
        {
            id: 18,
            name: "Pulsera uniendo Corazones Parejas",
            description: "Pulsera uniendo Corazones Parejas",
            originalPrice: 9.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000029.jpg",
                extra1: "",
                extra2: "productos/ISA-0000029-1.jpg",
                extra3: "productos/ISA-0000029-2.jpg"
            },
            code: "ISA-0000029",
            stock: 6,
            category: "Pulseras",
            shippingPolicy: `• Material: Aleación de Cu.\n• Género: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 17,
            name: "Pulsera Multicapa Punk Unisex",
            description: "Pulsera Multicapa Punk Unisex",
            originalPrice: 6.00,
            discountPercent: 70,
            images: {
                main: "productos/123175043.jpg",
                extra1: "",
                extra2: "productos/123175043-1.jpg",
                extra3: ""
            },
            code: "123175043",
            stock: 1,
            category: "Pulseras",
            shippingPolicy: `• Material: Cuero Sintético.\n• Género: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 16,
            name: "Pulsera Vintage de Cuero Hombre",
            description: "Pulsera Vintage de Cuero Hombre",
            originalPrice: 24.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000028.png",
                extra1: "",
                extra2: "",
                extra3: "",
            },
            code: "ISA-0000028",
            stock: 3,
            category: "Pulseras",
            shippingPolicy: `• Material: Cuero Sintético.\n• Género: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 15,
            name: "Pulsera Cáñamo Unisex - Marron",
            description: "Pulsera Cáñamo Unisex - Marron",
            originalPrice: 13.00,
            discountPercent: 70,
            images: {
                main: "productos/D1166-2.jpg",
                extra1: "productos/D1166.jpg",
                extra2: "productos/D1166-1.jpg",
                extra3: ""
            },
            code: "D1166",
            stock: 4,
            category: "Pulseras",
            shippingPolicy: `• Material: Cuero Sintetico.\n• Género: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 14,
            name: "Pulsera Punk de Caucho Hombre",
            description: "Pulsera Punk de Caucho Hombre",
            originalPrice: 13.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000027.jpg",
                extra1: "productos/ISA-0000027-1.jpg",
                extra2: "productos/ISA-0000027-2.jpg",
                extra3: "productos/ISA-0000027-3.jpg"
            },
            code: "ISA-0000027",
            stock: 4,
            category: "Pulseras",
            shippingPolicy: `• Material: Caucho.\n• Genero: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 13,
            name: "Llaveros Avengers",
            description: "Llavero coleccionable Casco de Locky, Guante de Tahnos, Hombre Araña",
            originalPrice: 23.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000024.jpg",
                extra1: "",
                extra2: "productos/ISA-0000025.jpg",
                extra3: "productos/ISA-0000026.jpg"
            },
            code: "ISA-0000024-25-26",
            stock: 3,
            category: "Coleccion",
            shippingPolicy: `• Material: Aleación de Cu.\n• Genero: Unisex`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Hombre Araña", "Casco de Locky", "Guante de Tahnos"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 12,
            name: "Llaveros Pokemon",
            description: "Llavero coleccionable Pikachu y Psydock",
            originalPrice: 64.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000020.jpg",
                extra1: "",
                extra2: "productos/ISA-0000020-1.jpg",
                extra3: "productos/ISA-0000020-2.jpg"
            },
            code: "ISA-0000020-21",
            stock: 2,
            category: "Coleccion",
            shippingPolicy: `• Material: PVC.`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Pikachu", "Psydock"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 11,
            name: "Tazos pokemon - Unidades",
            description: "Tazos pokemon - Unidades",
            originalPrice: 3.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000018.png",
                extra1: "productos/ISA-0000018-1.png",
                extra2: "productos/ISA-0000018-2.png",
                extra3: "productos/ISA-0000018-3.png"
            },
            code: "ISA-0000018",
            stock: 124,
            category: "Coleccion",
            shippingPolicy: `• Material: PVC.\n• Generación: 1\n• Originales: No\n• Incluye: 1 unidad`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Aleatorio"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 10,
            name: "Pila 12V 23A",
            description: "Pila 12V 23A",
            originalPrice: 6.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000017.jpg",
                extra1: "",
                extra2: "productos/ISA-0000017-1.jpg",
                extra3: "productos/ISA-0000017-2.jpg"
            },
            code: "ISA-0000017",
            stock: 28,
            category: "Tecnologia",
             shippingPolicy: `• Material: Batería Alcalina\n• Recargable: No\n• Voltaje: 12V\n• Modelo: A23`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 9,
            name: "Sensor Luz Led Armario",
            description: "Sensor Luz Led Armario",
            originalPrice: 12.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000016.jpg",
                extra1: "productos/ISA-0000016-1.jpg",
                extra2: "productos/ISA-0000016-2.jpg",
                extra3: "productos/ISA-0000016-3.jpg"
            },
            code: "ISA-0000016",
            stock: 20,
            category: "Tecnologia",
            shippingPolicy: `• Material: Carcasa ABS.\n• Batería: Pila 12V 23A - No incluye\n• Color de Luz: Blanco Frío`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 8,
            name: "Par de Dedales Gamer Basicos",
            description: "Par de Dedales Gamer Basicos",
            originalPrice: 8.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000013.jpg",
                extra1: "",
                extra2: "productos/ISA-0000013-1.jpg",
                extra3: "productos/ISA-0000013-2.jpg"
            },
            code: "ISA-0000013",
            stock: 13,
            category: "Celulares",
            shippingPolicy: `• Material: Fibra de carbono.\n• Incluye: 2 unidades`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 6,
            name: "Par de Dedales Gamer Fibra Electrica ",
            description: "Par de Dedales Gamer Fibra Electrica ",
            originalPrice: 13.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000011.jpg",
                extra1: "productos/ISA-0000011-1.jpg",
                extra2: "productos/ISA-0000011-2.jpg",
                extra3: "productos/ISA-0000011-3.jpg"
            },
            code: "ISA-0000011",
            stock: 3,
            category: "Celulares",
            shippingPolicy: `• Material: Fibra de carbono.\n• Incluye: 2 unidades`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Azul", "Rojo", "Morado"],
            sizes: ["Unico"]
        },
        {
            id: 5,
            name: "Case Funda de silicona Poco X3 GT",
            description: "Case Funda de silicona Poco X3 GT",
            originalPrice: 24.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000010.jpg",
                extra1: "",
                extra2: "productos/ISA-0000010-1.jpg",
                extra3: ""
            },
            code: "ISA-0000010",
            stock: 1,
            category: "Celulares",
            shippingPolicy: `• Material: Silicona.`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 4,
            name: "Case Funda de silicona Umidigi Bison",
            description: "Case Funda de silicona Umidigi Bison",
            originalPrice: 25.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000009.jpg",
                extra1: "",
                extra2: "productos/ISA-0000009-1.jpg",
                extra3: ""
            },
            code: "ISA-0000009",
            stock: 3,
            category: "Celulares",
            shippingPolicy: `• Material: Silicona`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["MD1", "MD2"],
            colors: ["Unico"],
            sizes: ["Unico "]
        },
        {
            id: 3,
            name: "Auriculares Samsung Alambricos AKG",
            description: "Auriculares Samsung Alambricos AKG",
            originalPrice: 35.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000008.jpg",
                extra1: "",
                extra2: "productos/ISA-0000008-1.jpg",
                extra3: ""
            },
            code: "ISA-0000008",
            stock: 1,
            category: "Celulares",
            shippingPolicy: `• Conector Analógico: Puerto Jack de 3.5 mm.`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Alambricos AKG"],
            colors: ["Blanco"],
            sizes: ["Unico "]
        },
        {
            id: 2,
            name: "Vidrio Templado +Prot. Camara",
            description: "Vidrio Templado + Prot. Camara",
            originalPrice: 19.00,
            discountPercent: 70,
            images: {
                main: "productos/ISA-0000002.jpg",
                extra1: "",
                extra2: "",
                extra3: ""
            },
            code: "ISA-0000002-3-4-5-6-7",
            stock: 12,
            category: "Celulares",
            shippingPolicy: `• Material: Película de Vidrio.`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["10S-4G", "Note 10S-5G", " Note 10 Pro"],
            colors: ["Unico"],
            sizes: ["Unico "]
        },
        {
            id: 1,
            name: "Vidrio Templado - Umidigi A9 Pro",
            description: "Vidrio Templado Umidigi A9 Pro",
            originalPrice: 20.00,
            discountPercent: 70,
            images: {
                main: "productos/2433101.jpg",
                extra1: "",
                extra2: "",
                extra3: ""
            },
            code: "2433101",
            stock: 2,
            category: "Celulares",
            shippingPolicy: `• Material: Película de Vidrio.`,
            additionalInfo: `<li><a href="Politica-Envio.html">Política de Envío y Entrega</a></li>`,
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        }
    ];

    // =========================================================================
    // INICIO DEL MOTOR DE BÚSQUEDA Y FILTRADO INICIAL
    // =========================================================================
    let filteredProducts = [...allProducts]; 

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        
        // Filtra los productos que coincidan en el nombre o la categoría
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(queryLower) || 
            product.category.toLowerCase().includes(queryLower)
        );

        // Desactiva los botones (chips) de categoría porque estamos en modo búsqueda
        if (categoryChips.length > 0) {
            categoryChips.forEach(c => c.classList.remove("active"));
        }
        
        // Rellenar el input visualmente si existe
        const searchInput = document.querySelector(".app-search-bar input");
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    }
    // =========================================================================
    // FIN DEL MOTOR DE BÚSQUEDA
    // =========================================================================

    // --- Funciones de Utilidad ---

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN', 
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Generador de HTML para tarjetas estilo App
    const createProductCardHTML = (product) => {
        const original = Number(product.originalPrice) || 0;
        const discount = Number(product.discountPercent) || 0;

        let finalPrice = original;
        let priceDisplayHTML = '';
        let discountTagHTML = '';

        if (discount > 0 && discount < 100) {
            finalPrice = Number((original * (1 - discount / 100)).toFixed(2));
            product.price = finalPrice; 

            priceDisplayHTML = `
                <span class="price-normal">${formatPrice(original)}</span>
                <span class="price-offer">${formatPrice(finalPrice)}</span>
            `;
            discountTagHTML = `<span class="discount-badge">-${discount}%</span>`;

        } else {
            product.price = original;
            priceDisplayHTML = `
                <span class="price-offer">${formatPrice(original)}</span>
            `;
        }

        return `
            <div class="product-image-container">
                ${discountTagHTML}
                <img src="${product.images?.main || "imagenes/default.jpg"}" alt="${product.name}" loading="lazy">
                <button class="favorite-btn" aria-label="Agregar a favoritos"><i class="fa-regular fa-heart"></i></button>
            </div>
            
            <div class="product-info">
                <h3 class="brand-name">${product.category}</h3>
                <p class="product-name">${product.name}</p>
                
                <div class="prices">
                    ${priceDisplayHTML}
                </div>
                
                <div class="btn-container">
                    <button class="add-btn add-to-cart-btn" data-product-id="${product.id}">Agregar</button>
                </div>
            </div>
        `;
    };

    // Función de renderizado (añade o reemplaza)
    const renderProducts = (productsToRender, append = false) => {
        if (!productListContainer) return;

        if (!append) {
            productListContainer.innerHTML = ""; 
            currentProductIndex = 0; 
        }

        const startIndex = currentProductIndex;
        const endIndex = Math.min(startIndex + PRODUCTS_PER_LOAD, productsToRender.length);

        if (productsToRender.length === 0 && !append) {
            productListContainer.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; width:100%; grid-column: 1 / -1;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 40px; color: #ccc; margin-bottom: 15px;"></i>
                    <p style="font-size: 14px; color: #666; font-weight: 500;">No encontramos resultados.</p>
                    <p style="font-size: 12px; color: #999; margin-top: 5px;">Intenta con otras palabras o navega por las categorías.</p>
                    <button class="add-btn" style="width: auto; padding: 8px 20px; margin-top: 15px; background-color: #111;" onclick="window.location.href='Productos.html'">Ver todo el catálogo</button>
                </div>`;
            return;
        }

        for (let i = startIndex; i < endIndex; i++) {
            const product = productsToRender[i];
            const productCard = document.createElement("div");
            
            productCard.classList.add("app-product-card"); 
            productCard.setAttribute("data-category", product.category.toLowerCase());
            productCard.innerHTML = createProductCardHTML(product);
            
            productListContainer.appendChild(productCard);
        }

        currentProductIndex = endIndex; 
    };

    // Lógica para botones de las tarjetas
    const attachProductDetailListeners = () => {
        if (!productListContainer) return;

        productListContainer.addEventListener("click", (event) => {
            const target = event.target;
            
            // Clic en "Agregar"
            if (target.classList.contains("add-to-cart-btn")) {
                event.preventDefault(); 
                const productId = parseInt(target.dataset.productId);
                const selectedProduct = allProducts.find(p => p.id === productId);

                if (selectedProduct) {
                    localStorage.setItem("selectedProductDetail", JSON.stringify(selectedProduct));
                    window.location.href = "producto-detalle.html"; 
                }
            }
            
            // Clic en "Corazón"
            const favoriteBtn = target.closest('.favorite-btn');
            if (favoriteBtn) {
                event.preventDefault();
                const icon = favoriteBtn.querySelector('i');
                if (icon.classList.contains('fa-regular')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                    icon.style.color = '#ff2a00';
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                    icon.style.color = '';
                }
            }
        });
    };

    // --- EVENT LISTENERS (Filtros por Chips) ---
    if (categoryChips.length > 0) {
        categoryChips.forEach(chip => {
            chip.addEventListener("click", (e) => {
                // Al hacer clic en un chip, limpiamos la barra de búsqueda en la URL si existiera
                if (window.location.search) {
                    window.history.pushState({}, document.title, window.location.pathname);
                    const searchInput = document.querySelector(".app-search-bar input");
                    if(searchInput) searchInput.value = "";
                }

                // Actualiza el aspecto de los chips
                categoryChips.forEach(c => c.classList.remove("active"));
                e.target.classList.add("active");
                
                // Filtra la lista
                const selectedCategory = e.target.textContent.toLowerCase();
                if (selectedCategory === "todas" || selectedCategory === "todos") {
                    filteredProducts = [...allProducts]; 
                } else {
                    filteredProducts = allProducts.filter(product =>
                        product.category.toLowerCase() === selectedCategory
                    );
                }
                
                // Vuelve a pintar la cuadrícula desde cero
                renderProducts(filteredProducts, false); 
            });
        });
    }

    // --- LÓGICA DE SCROLL INFINITO (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            if (currentProductIndex < filteredProducts.length) {
                isLoading = true;
                if (loadingSpinner) loadingSpinner.style.display = "block";
                
                setTimeout(() => {
                    renderProducts(filteredProducts, true); 
                    if (loadingSpinner) loadingSpinner.style.display = "none";
                    isLoading = false;
                }, 500); 
            }
        }
    }, {
        rootMargin: "0px 0px 200px 0px" 
    });

    // --- INICIALIZACIÓN ---
    if (productListContainer) {
        // Detectar si estamos en el "carrusel horizontal" de index.html
        if (productListContainer.classList.contains("products-carousel")) {
            // En el inicio solo mostramos 20 y no activamos scroll infinito
            renderProducts(filteredProducts.slice(0, 20), false);
        } else {
            // En Productos.html (cuadrícula), activamos carga normal y scroll infinito
            renderProducts(filteredProducts, false);
            
            // Le decimos al observador que vigile el final de la página
            const bottomTrigger = document.querySelector(".app-trust-section") || document.querySelector(".app-footer-lite");
            if (bottomTrigger) {
                observer.observe(bottomTrigger);
            }
        }
        
        attachProductDetailListeners();
    }
});
