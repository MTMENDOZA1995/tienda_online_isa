// js/products.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectores del DOM ---
    // Usamos los IDs y clases que hemos estandarizado en HTML y CSS
    const productListContainer = document.querySelector("#product-list"); // Contenedor de la cuadrícula de productos
    const categorySelect = document.getElementById("category-select");   // Selector de categorías
    const loadMoreBtn = document.getElementById("load-more-products"); // Botón "Cargar más" (si existe en tu HTML)

    // Configuración para la carga de productos
    const PRODUCTS_PER_LOAD = 10; // Cantidad inicial de productos y a cargar por clic
    let currentProductIndex = 0; // Índice para controlar la paginación de productos visibles

    // --- Datos de productos ---
    // ¡IMPORTANTE! 'price' y 'originalPrice' deben ser números para permitir cálculos.
    // El formato de moneda 'S/.' se aplica solo en la visualización.
    const allProducts = [

        {
            id: 21,
            name: "Aretes Rosa",
            description: "Aretes de diseño elegante, fabricados en acero inoxidable de alta calidad.",    
            originalPrice: 13.00, // ¡Númer
            discountPercent: 70,
            images: { // Agrupación de imágenes en un objeto
                main: "productos/ISA-0000040-1.jpg",
                extra1: "productos/ISA-0000040-2.jpg",
                extra2: "",
                extra3: ""
            },
            code: "ISA-0000040",
            stock: 1,
            category: "joyeria", // Usar siempre la misma capitalización para la categoría
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
            models: ["Unico"],
            colors: ["Plateado"],
            sizes: ["Unico"]
        },
        {
            id: 20,
            name: "Peine Quita Nudos para Perros y Gatos",
            description: "Peine Quita Nudos para Perros y Gatos elimina enredos, nudos y pelo muerto de forma rápida y segura. Ideal para mascotas de pelo medio y largo.",
            originalPrice: 41.00, // ¡Número!
            discountPercent: 70,
            images: { // Agrupación de imágenes en un objeto
                main: "productos/dj44-bu01s0.jpg",
                extra1: "productos/dj44-bu01s1.jpg",
                extra2: "productos/dj44-bu01s.jpg",
                extra3: "productos/dj44-bu02s.jpg"
            },
            code: "dj44-bu01s-dj44-bu02s",
            stock: 3,
            category: "Mascotas", // Usar siempre la misma capitalización para la categoría
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
            models: ["Unico"],
            colors: ["Azul", "Rosado"],
            sizes: ["Unico"]
        },
        {
            id: 19,
            name: "Pulsera Bluelory Acero Inox. Unisex",
            description: "Pulsera Bluelory Acero Inox. Unisex, Negro-Dorado. Elegante y duradera para cualquier ocasión.",
            originalPrice: 19.00, // ¡Número!
            discountPercent: 70,
            images: { // Agrupación de imágenes en un objeto
                main: "productos/ISA-0000030.jpg",
                extra1: "productos/ISA-0000030-1.jpg",
                extra2: "productos/ISA-0000030-2.jpg",
                extra3: "productos/ISA-0000030-3.jpg"
            },
            code: "ISA-0000030",
            stock: 5,
            category: "Pulseras", // Usar siempre la misma capitalización para la categoría
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
                main: "productos/D1166.jpg",
                extra1: "",
                extra2: "productos/D1166-1.jpg",
                extra3: ""
            },
            code: "D1166",
            stock: 4,
            category: "Pulseras",
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con PVC de alta calidad, resistente al desgaste y fácil de limpiar, con un diseño detallado que representa fielmente a tus Pokémon.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            additionalInfo: "Fabricado con materiales ecológicos.",
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
        {
            id: 7,
            name: "Par de Dedales Gamer FingerTips",
            description: "Par de Dedales Gamer FingerTips",
            discountPercent: 70,
            discount: "70% DES.",
            images: {
                main: "productos/ISA-0000012.jpg",
                extra1: "",
                extra2: "productos/ISA-0000012-1.jpg",
                extra3: "productos/ISA-0000012-2.jpg"
            },
            code: "ISA-0000012",
            stock: 2,
            category: "Celulares",
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            additionalInfo: "Fabricado con materiales ecológicos.",
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
            discount: "70% DES.",
            images: {
                main: "productos/ISA-0000008.jpg",
                extra1: "",
                extra2: "productos/ISA-0000008-1.jpg",
                extra3: ""
            },
            code: "ISA-0000008",
            stock: 1,
            category: "Celulares",
            shippingPolicy: "",
            additionalInfo: "",
            models: ["Alambricos AKG"],
            colors: ["Blanco"],
            sizes: ["Unico "]
        },
        {
            id: 2,
            name: "Vidrio Templado +Prot. Camara - Redmi Note 10S 5G-4G, Note 10 Pro, Poco F3, Poco M3, Note 9 Pro",
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
            shippingPolicy: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            additionalInfo: "Fabricado con materiales ecológicos.",
            models: ["10S-4G", "Note 10S-5G", " Note 10 Pro", "Poco F3", "Poco M3", "Note 9 Pro"],
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
            shippingPolicy: "",
            additionalInfo: "",
            models: ["Unico"],
            colors: ["Unico"],
            sizes: ["Unico"]
        },
    ];

    let filteredProducts = [...allProducts]; // Copia de los productos para filtrar/mostrar

    // --- Funciones de Utilidad ---

    /**
     * Formatea un precio a la moneda local (S/.)
     * @param {number} amount
     * @returns {string} Precio formateado.
     */
    const formatPrice = (amount) => {
        // Asegúrate de que el locale 'es-PE' es el correcto para tu moneda.
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN', // PEN para Sol peruano
            minimumFractionDigits: 2,
        }).format(amount);
    };

    /**
     * Crea el HTML para una tarjeta de producto individual.
     * @param {object} product - Objeto producto.
     * @returns {string} HTML de la tarjeta de producto.
     */
    const createProductCardHTML = (product) => {

        const original = Number(product.originalPrice) || 0;
        const discount = Number(product.discountPercent) || 0;

        let finalPrice = original;
        let priceDisplayHTML = '';
        let discountTagHTML = '';

        const hasValidDiscount = discount > 0 && discount < 100;

        if (hasValidDiscount) {

            finalPrice = Number((original * (1 - discount / 100)).toFixed(2));

            // Guardamos precio calculado para carrito
            product.price = finalPrice;

            priceDisplayHTML = `
                <s class="product-price-original">${formatPrice(original)}</s>
                <span class="product-price-offer">${formatPrice(finalPrice)}</span>
            `;

            discountTagHTML = `
                <div class="discount-tag">${discount}% OFF</div>
            `;

        } else {

            product.price = original;

            priceDisplayHTML = `
                <span class="product-price-normal">${formatPrice(original)}</span>
            `;
        }

        return `
            ${discountTagHTML}
            <img src="${product.images?.main || "imagenes/default.jpg"}" 
                alt="${product.name}" 
                loading="lazy" 
                class="product-image">

            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>

                <p class="price">
                    ${priceDisplayHTML}
                </p>

                <a href="product-detail.html" 
                class="btn-3 add-to-cart-btn" 
                data-product-id="${product.id}">
                    Ver detalles
                </a>
            </div>
        `;
    };


    /**
     * Renderiza un conjunto de productos en el DOM.
     * @param {Array<object>} productsToRender - Array de productos a mostrar.
     * @param {boolean} append - Si es true, añade los productos; si es false, reemplaza la lista.
     */
    const renderProducts = (productsToRender, append = false) => {
        if (!productListContainer) {
            console.error("Contenedor de productos no encontrado (#product-list).");
            return;
        }

        if (!append) {
            productListContainer.innerHTML = ""; // Limpia la lista antes de volver a cargar
            currentProductIndex = 0; // Reinicia el índice al filtrar o cargar una nueva lista
        }

        const startIndex = currentProductIndex;
        const endIndex = Math.min(startIndex + PRODUCTS_PER_LOAD, productsToRender.length);

        // Si no hay productos filtrados o ya se cargaron todos
        if (productsToRender.length === 0 && !append) {
            productListContainer.innerHTML = `<p style="text-align:center; padding: 20px;">No se encontraron productos en esta categoría.</p>`;
            updateLoadMoreButtonVisibility(0); // Oculta el botón
            return;
        } else if (startIndex >= productsToRender.length && append) {
            // Ya se cargaron todos los productos y se intentó cargar más
            updateLoadMoreButtonVisibility(productsToRender.length);
            return;
        }

        for (let i = startIndex; i < endIndex; i++) {
            const product = productsToRender[i];
            const productCard = document.createElement("div");
            productCard.classList.add("product-card"); // Usando la clase CSS '.product-card'
            productCard.setAttribute("data-category", product.category.toLowerCase());

            productCard.innerHTML = createProductCardHTML(product);
            productListContainer.appendChild(productCard);
        }

        currentProductIndex = endIndex; // Actualiza el índice para la próxima carga
        updateLoadMoreButtonVisibility(productsToRender.length);
    };

    /**
     * Actualiza la visibilidad del botón "Cargar más".
     * @param {number} totalProductsInCurrentFilter - Número total de productos en el filtro actual.
     */
    const updateLoadMoreButtonVisibility = (totalProductsInCurrentFilter) => {
        if (loadMoreBtn) { // Solo si el botón existe en el HTML
            if (currentProductIndex >= totalProductsInCurrentFilter) {
                loadMoreBtn.style.display = "none";
            } else {
                loadMoreBtn.style.display = "inline-block"; // O "block" o "flex" según tu CSS
            }
        }
    };

    /**
     * Adjunta el evento de clic a los botones "Ver detalles" utilizando delegación de eventos.
     * Esto es más eficiente ya que el listener se añade una sola vez al contenedor padre.
     */
    const attachProductDetailListeners = () => {
        if (!productListContainer) return;

        productListContainer.addEventListener("click", (event) => {
            const target = event.target;
            // Verifica si el clic fue en un botón con la clase 'add-to-cart-btn'
            // y que esté dentro de una tarjeta de producto.
            if (target.classList.contains("add-to-cart-btn")) {
                event.preventDefault(); // Evita la navegación predeterminada del enlace

                const productId = parseInt(target.dataset.productId);
                const selectedProduct = allProducts.find(p => p.id === productId);

                if (selectedProduct) {
                    // Guardamos los detalles del producto en localStorage
                    localStorage.setItem("selectedProductDetail", JSON.stringify(selectedProduct));
                    window.location.href = "producto-detalle.html"; // Redirige a la página de detalles
                } else {
                    console.error("Error: Producto no encontrado para el ID:", productId);
                    alert("Lo sentimos, no se pudo cargar la información de este producto.");
                }
            }
        });
    };


    // --- Event Listeners ---

    // 🔹 Filtrar productos según la categoría seleccionada
    if (categorySelect) { // Verifica si el selector existe en esta página
        categorySelect.addEventListener("change", (e) => {
            const selectedCategory = e.target.value.toLowerCase(); // Asegura minúsculas para la comparación

            if (selectedCategory === "todos" || selectedCategory === "all") {
                filteredProducts = [...allProducts]; // Muestra todos los productos
            } else {
                // Filtra productos por la categoría seleccionada
                filteredProducts = allProducts.filter(product =>
                    product.category.toLowerCase() === selectedCategory
                );
            }
            renderProducts(filteredProducts); // Vuelve a renderizar la lista completa
        });
    }

    // 🔹 Botón "Cargar Más"
    if (loadMoreBtn) { // Verifica si el botón existe en esta página
        loadMoreBtn.addEventListener("click", () => {
            renderProducts(filteredProducts, true); // Añade más productos a la lista existente
        });
    }

    // --- Inicialización ---

    // Cargar productos al cargar la página (todos por defecto)
    // Se podría detectar si es la página principal (index.html) para cargar solo destacados
    // o si es productos.html para cargar todo con paginación/filtro.
    // Aquí asumimos que es una página de productos completa con filtro y carga.
    renderProducts(filteredProducts);

    // Adjuntar listeners después de que los productos iniciales han sido renderizados
    attachProductDetailListeners();

});



