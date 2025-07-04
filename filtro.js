document.addEventListener("DOMContentLoaded", function () {
    const listaProductos = document.querySelector("#lista-1");
    const categoriaSelect = document.getElementById("categoria"); // Selector de categorías

    // 🔹 Datos de productos (puedes agregar más productos aquí)
    let productos = [
        {
            id: 19,
            nombre: "Pulsera Bluelory Acero Inox. Unisex",
            descripcion: "Pulsera Bluelory Acero Inox. Unisex, Negro-Dorado",
            precio: "S/. 5.70",
            precioOriginal: "S/. 19.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000030.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000030-1.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000030-2.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000030-3.jpg", // Nueva imagen 3
            codigo: "ISA-0000030",  // Código del producto
            stock: 5,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Dorado","Negro"],
            tamanos: ["Unico"]
        },
        {
            id: 18,
            nombre: "Pulsera uniendo  Corazónes Parejas",
            descripcion: "Pulsera uniendo  Corazónes Parejas",
            precio: "S/. 2.70",
            precioOriginal: "S/. 9.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000029.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000029.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000029-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000029-2.jpg", // Nueva imagen 3
            codigo: "ISA-0000029",  // Código del producto
            stock: 6,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 17,
            nombre: "Pulsera Multicapa Punk Unisex",
            descripcion: "Pulsera Multicapa Punk Unisex",
            precio: "S/. 1.80",
            precioOriginal: "S/. 6.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/123175043.jpg", // Imagen principal
            imagenExtra1: "productos/123175043.jpg", // Nueva imagen 1
            imagenExtra2: "productos/123175043-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/123175043-1.jpg", // Nueva imagen 3
            codigo: "123175043",  // Código del producto
            stock: 1,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 16,
            nombre: "Pulsera Vintaje de Cuero Hombre",
            descripcion: "Pulsera Vintaje de Cuero Hombre",
            precio: "S/. 4.80",
            precioOriginal: "S/. 24.00",
            precioS:" ",
            descuento: "80% DES.",
            imagen: "productos/ISA-0000028.PNG", // Imagen principal
            imagenExtra1: "productos/ISA-0000028.PNG", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000028.PNG", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000028.PNG", // Nueva imagen 3
            codigo: "ISA-0000028",  // Código del producto
            stock: 3,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 15,
            nombre: "Pulsera Cañamo Unisex - Marron",
            descripcion: "Pulsera Cañamo Unisex - Marron",
            precio: "S/. 3.90",
            precioOriginal: "S/. 13.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/D1166.jpg", // Imagen principal
            imagenExtra1: "productos/D1166.jpg", // Nueva imagen 1
            imagenExtra2: "productos/D1166-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/D1166-1.jpg", // Nueva imagen 3
            codigo: "D1166",  // Código del producto
            stock: 4,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 14,
            nombre: "Pulsera Punk de Caucho Hombre",
            descripcion: "Pulsera Punk de Caucho Hombre",
            precio: "S/. 3.90",
            precioOriginal: "S/. 13.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000027.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000027-1.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000027-2.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000027-3.jpg", // Nueva imagen 3
            codigo: "ISA-0000027",  // Código del producto
            stock: 4,  // Stock disponible
            categoria: "Pulseras", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 13,
            nombre: "Llaveros Avengers",
            descripcion: "Llavero coleccionable Casco de Locky, Guante de Tahnos, Hombre Araña",
            precio: "S/. 6.90",
            precioOriginal: "S/. 23.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000024.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000024.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000025.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000026.jpg", // Nueva imagen 3
            codigo: "ISA-0000024-25-26",  // Código del producto
            stock: 3,  // Stock disponible
            categoria: "Coleccion", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Hombre Araña","Casco de Locky","Guante de Tahnos"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 12,
            nombre: "Llaveros Pokemon",
            descripcion: "Llavero coleccionable Pikachu y Psydock",
            precio: "S/. 19.20",
            precioOriginal: "S/. 64.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000020.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000020.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000020-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000020-2.jpg", // Nueva imagen 3
            codigo: "ISA-0000020-21",  // Código del producto
            stock: 2,  // Stock disponible
            categoria: "Coleccion", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con PVC de alta calidad, resistente al desgaste y fácil de limpiar, con un diseño detallado que representa fielmente a tus Pokémon.",
            modelo: ["Pikachu","Psydock"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 11,
            nombre: "Tazos pokemon - Unidades",
            descripcion: "Tazos pokemon - Unidades",
            precio: "S/. 0.90",
            precioOriginal: "S/. 3.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000018.png", // Imagen principal
            imagenExtra1: "productos/ISA-0000018-1.png", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000018-2.png", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000018-3.png", // Nueva imagen 3
            codigo: "ISA-0000018",  // Código del producto
            stock: 124,  // Stock disponible
            categoria: "Coleccion", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Aleatorio"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 10,
            nombre: "Pila 12V 23A",
            descripcion: "Pila 12V 23A",
            precio: "S/. 1.80",
            precioOriginal: "S/. 6.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000017.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000017.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000017-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000017-2.jpg", // Nueva imagen 3
            codigo: "ISA-0000017",  // Código del producto
            stock: 28,  // Stock disponible
            categoria: "Tecnologia", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 9,
            nombre: "Sensor Luz Led Armario",
            descripcion: "Sensor Luz Led Armario",
            precio: "S/. 3.60",
            precioOriginal: "S/. 12.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000016.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000016-1.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000016-2.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000016-3.jpg", // Nueva imagen 3
            codigo: "ISA-0000016",  // Código del producto
            stock: 20,  // Stock disponible
            categoria: "Tecnologia", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 8,
            nombre: "Par de Dedales Gamer Basicos",
            descripcion: "Par de Dedales Gamer Basicos",
            precio: "S/. 2.40",
            precioOriginal: "S/. 8.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000013.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000013.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000013-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000013-2.jpg", // Nueva imagen 3
            codigo: "ISA-0000013",  // Código del producto
            stock: 13,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 7,
            nombre: "Par de Dedales Gamer FingerTips",
            descripcion: "Par de Dedales Gamer FingerTips",
            precio: "S/. 6.00",
            precioOriginal: "S/. 20.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000012.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000012.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000012-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000012-2.jpg", // Nueva imagen 3
            codigo: "ISA-0000012",  // Código del producto
            stock: 2,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 6,
            nombre: "Par de Dedales Gamer Fibra Electrica ",
            descripcion: "Par de Dedales Gamer Fibra Electrica ",
            precio: "S/. 3.90",
            precioOriginal: "S/. 13.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000011.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000011-1.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000011-2.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000011-3.jpg", // Nueva imagen 3
            codigo: "ISA-0000011",  // Código del producto
            stock: 3,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Azul","Rojo","Morado"],
            tamanos: ["Unico"]
        },
        {
            id: 5,
            nombre: "Case Funda de silicona Poco X3 GT",
            descripcion: "Case Funda de silicona Poco X3 GT",
            precio: "S/. 7.20",
            precioOriginal: "S/. 24.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000010.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000010.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000010-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000010-1.jpg", // Nueva imagen 3
            codigo: "ISA-0000010",  // Código del producto
            stock: 1,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
        },
        {
            id: 4,
            nombre: "Case Funda de silicona Umidigi Bison",
            descripcion: "Case Funda de silicona Umidigi Bison",
            precio: "S/. 7.50",
            precioOriginal: "S/. 25.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000009.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000009.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000009-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000009-1.jpg", // Nueva imagen 3
            codigo: "ISA-0000009",  // Código del producto
            stock: 3,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["MD1", "MD2",],
            colores: ["Unico"],
            tamanos: ["Unico "]
        },
        {
            id: 3,
            nombre: "Auriculares Samsung Alambricos AKG",
            descripcion: "Auriculares Samsung Alambricos AKG",
            precio: "S/. 10.50",
            precioOriginal: "S/. 35.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000008.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000008.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000008-1.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000008-1.jpg", // Nueva imagen 3
            codigo: "ISA-0000008",  // Código del producto
            stock: 1,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Alambricos AKG"],
            colores: ["Blanco"],
            tamanos: ["Unico "]
        },
        {
            id: 2,
            nombre: "vidrio Templado +Prot. Camara - Redmi Note 10S 5G-4G, Note 10 Pro, Poco F3, Poco M3, Note 9 Pro",
            descripcion: "vidrio Templado +Prot. Camara - note 10S 5G-4G",
            precio: "S/. 5.70",
            precioOriginal: "S/. 19.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/ISA-0000002.jpg", // Imagen principal
            imagenExtra1: "productos/ISA-0000002.jpg", // Nueva imagen 1
            imagenExtra2: "productos/ISA-0000002.jpg", // Nueva imagen 2
            imagenExtra3: "productos/ISA-0000002.Jpg", // Nueva imagen 3
            codigo: "ISA-0000002-3-4-5-6-7",  // Código del producto
            stock: 12,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio. ",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["10S-4G", "Note 10S-5G", " Note 10 Pro", "Poco F3", "Poco M3", "Note 9 Pro"],
            colores: ["Unico"],
            tamanos: ["Unico "]
            
        },
        {
            id: 1,
            nombre: "vidrio Templado - Umidigi A9 Pro",
            descripcion: "Vidrio Templado Umidigi A9 Pro",
            precio: "S/. 6.00",
            precioOriginal: "S/. 20.00",
            precioS:" ",
            descuento: "70% DES.",
            imagen: "productos/2433101.jpg", // Imagen principal
            imagenExtra1: "productos/2433101.jpg", // Nueva imagen 1
            imagenExtra2: "productos/2433101.jpg", // Nueva imagen 2
            imagenExtra3: "productos/2433101.jpg", // Nueva imagen 3
            codigo: "2433101",  // Código del producto
            stock: 2,  // Stock disponible
            categoria: "Art. Celulares", // Nueva categoría agregada
            politicaEnvio: "Envío gratuito en compras superiores a S/. 25.00; para montos menores, el costo es de S/. 5. Entrega en 1 día hábil dentro de la provincia de Cajamarca. También puedes recoger tu pedido sin costo en nuestro almacén (Jr. Belaunde Terry C-10 - Mollepampa Alta). Para otras provincias, el envío se realiza por agencia con pago contra entrega (1 a 3 días hábiles). Actualmente, no ofrecemos entregas a domicilio.",
            informacionAdicional: "Fabricado con materiales ecológicos.",
            modelo: ["Unico"],
            colores: ["Unico"],
            tamanos: ["Unico"]
            
        },
    ];

    // 🔹 Función para renderizar productos en el DOM
    function cargarProductos(categoria) {
        listaProductos.innerHTML = ""; // Limpiar la lista antes de volver a cargar

        // Filtrar los productos según la categoría seleccionada
        const productosFiltrados = categoria === "todos" 
            ? productos 
            : productos.filter(producto => producto.categoria === categoria);

        // Mostrar los productos filtrados
        productosFiltrados.forEach(producto => {
            let box = document.createElement("div");
            box.classList.add("box");
            box.setAttribute("data-categoria", producto.categoria);

            // Rellenar contenido HTML para cada producto
            box.innerHTML = `
                ${producto.descuento ? `<div class="descuento">${producto.descuento}</div>` : ""}
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                <div class="product-txt">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">
                        ${producto.precioOriginal ? `<s>${producto.precioOriginal}</s>` : ""}
                        <span class="precio-oferta">${producto.precio}</span>
                        ${producto.precioS ? `<span class="precioS">${producto.precioS}</span>` : ""}
                    </p>
                    <a href="producto-detalle.html" class="btn-3 ver-detalles"
                       data-id="${producto.id}" data-nombre="${producto.nombre}"
                       data-descripcion="${producto.descripcion}"
                       data-precio="${producto.precio}"
                       data-precio-original="${producto.precioOriginal}"
                       data-precioS="${producto.precioS}"
                       data-imagen="${producto.imagen}"
                       data-imagen-extra1="${producto.imagenExtra1}"
                       data-imagen-extra2="${producto.imagenExtra2}"
                       data-imagen-extra3="${producto.imagenExtra3}"
                       data-codigo="${producto.codigo}"
                       data-stock="${producto.stock}"
                       data-categoria="${producto.categoria}"
                       data-politica-envio="${producto.politicaEnvio}"
                       data-informacion-adicional="${producto.informacionAdicional}"
                       data-modelo='${JSON.stringify(producto.modelo)}'
                       data-colores='${JSON.stringify(producto.colores)}'
                    data-tamanos='${JSON.stringify(producto.tamanos)}'>
                       Ver detalles
                    </a>
                </div>
            `;

            listaProductos.appendChild(box);
        });

        agregarEventosDetalles();
    }

    // 🔹 Función para agregar eventos a los botones "Ver detalles"
    function agregarEventosDetalles() {
        document.querySelectorAll(".ver-detalles").forEach(boton => {
            boton.addEventListener("click", function (event) {
                event.preventDefault();

                let producto = {
                    id: this.getAttribute("data-id"),
                    nombre: this.getAttribute("data-nombre"),
                    descripcion: this.getAttribute("data-descripcion"),
                    precio: this.getAttribute("data-precio"),
                    precioOriginal: this.getAttribute("data-precio-original"),
                    precioS: this.getAttribute("data-precioS"),
                    imagen: this.getAttribute("data-imagen"),
                    imagenExtra1: this.getAttribute("data-imagen-extra1"),
                    imagenExtra2: this.getAttribute("data-imagen-extra2"),
                    imagenExtra3: this.getAttribute("data-imagen-extra3"),
                    codigo: this.getAttribute("data-codigo"),
                    stock: this.getAttribute("data-stock"),
                    categoria: this.getAttribute("data-categoria"),
                    politicaEnvio: this.getAttribute("data-politica-envio"),
                    informacionAdicional: this.getAttribute("data-informacion-adicional"),
                    modelo: JSON.parse(this.getAttribute("data-modelo") || "[]"),
                    colores: JSON.parse(this.getAttribute("data-colores") || "[]"),
                    tamanos: JSON.parse(this.getAttribute("data-tamanos") || "[]")
                };

                // Guardamos los detalles del producto en localStorage para mostrarlos en la página de detalle
                localStorage.setItem("producto", JSON.stringify(producto));
                window.location.href = "producto-detalle.html"; // Redirige a la página de detalles
            });
        });
    }

    // 🔹 Cargar productos al cargar la página
    cargarProductos("todos"); // Mostrar todos los productos al cargar la página

    // 🔹 Filtrar productos según la categoría seleccionada
    categoriaSelect.addEventListener("change", (e) => {
        cargarProductos(e.target.value);
    });
});





// 🔹 Botón "Cargar Más"

document.addEventListener("DOMContentLoaded", function () {
    const loadMoreBtn = document.querySelector("#load-more");
    const boxes = document.querySelectorAll(".box-container .box");
    let currentItem = 9; // Número de productos iniciales a mostrar
    const incremento = 3; // Número de productos a cargar por clic

    if (!loadMoreBtn || boxes.length === 0) return; // Evita errores si no hay botón o productos

    loadMoreBtn.addEventListener("click", () => {
        let totalProductos = boxes.length;
        let limite = currentItem + incremento > totalProductos ? totalProductos : currentItem + incremento;

        for (let i = currentItem; i < limite; i++) {
            if (boxes[i].style.display !== "inline-block") {
                boxes[i].style.display = "inline-block";
            }
        }

        currentItem = limite;

        // Ocultar el botón si ya no hay más productos
        if (currentItem >= totalProductos) {
            loadMoreBtn.style.display = "none";
        }
    });
});





// ANIMACION BARRA DE MENU - JavaScript para agregar la clase 'active' al enlace correspondiente
document.addEventListener("DOMContentLoaded", function () {
    // Obtén la URL de la página actual
    const currentPage = window.location.pathname;

    // Selecciona todos los enlaces del menú
    const menuLinks = document.querySelectorAll(".menu .navbar ul li a");

    // Itera sobre los enlaces y añade la clase 'active' al que coincide con la página actual
    menuLinks.forEach(link => {
        // Compara el href del enlace con la ruta actual sin parámetros de búsqueda
        const linkPath = new URL(link.href).pathname;

        // Añade la clase 'active' al enlace correspondiente
        if (linkPath === currentPage || currentPage.includes(linkPath)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});


