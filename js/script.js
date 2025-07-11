

// 🛒 Carrito de Compras con LocalStorage
const carrito = document.getElementById("carrito");
const elementos1 = document.getElementById("lista-1");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const loadMoreBtn = document.getElementById("load-more"); // Corrección de referencia

// Cargar eventos si los elementos existen
document.addEventListener("DOMContentLoaded", cargarCarrito);
if (elementos1) elementos1.addEventListener("click", comprarElemento);
if (carrito) carrito.addEventListener("click", eliminarElemento);
if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

// 🛍️ Agregar Producto al Carrito
function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const elemento = e.target.closest(".box");
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    try {
        const infoElemento = {
            imagen: elemento.querySelector("img").src,
            titulo: elemento.querySelector("h3").textContent,
            precio: elemento.querySelector(".precio-oferta") ? elemento.querySelector(".precio-oferta").textContent : elemento.querySelector(".precio").textContent,
            id: elemento.querySelector(".agregar-carrito").getAttribute("data-id")
        };

        // Verificar si el producto ya está en el carrito
        if (document.querySelector(`#lista-carrito tbody tr[data-id="${infoElemento.id}"]`)) {
            alert("Este producto ya está en el carrito.");
            return;
        }

        insertarCarrito(infoElemento);
    } catch (error) {
        console.error("Error al leer datos del producto:", error);
    }
}

function insertarCarrito(elemento) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", elemento.id);
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width="100" height="150px" alt="${elemento.titulo}"></td>
        <td>${elemento.titulo}</td>
        <td>${elemento.precio}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">❌</a></td>
    `;
    lista.appendChild(row);
    actualizarMensajeCarrito();
    guardarCarrito();
}

// ❌ Eliminar un Producto del Carrito
function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains("borrar")) {
        e.target.closest("tr").remove();
        actualizarMensajeCarrito();
        guardarCarrito();
    }
}

// 🗑️ Vaciar Carrito
function vaciarCarrito() {
    lista.innerHTML = ""; // Borra todo el contenido
    actualizarMensajeCarrito();
    localStorage.removeItem("carrito"); // Elimina los datos almacenados
}

// 📢 Mostrar Mensaje cuando el Carrito está Vacío
function actualizarMensajeCarrito() {
    if (!lista.hasChildNodes()) {
        lista.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color: gray;">El carrito está vacío 🛒</td>
            </tr>
        `;
    }
}

// 📂 Guardar y Cargar Carrito desde LocalStorage
function guardarCarrito() {
    const productos = [];
    document.querySelectorAll("#lista-carrito tbody tr").forEach(row => {
        productos.push({
            imagen: row.querySelector("img").src,
            titulo: row.cells[1].textContent,
            precio: row.cells[2].textContent,
            id: row.querySelector(".borrar").dataset.id
        });
    });
    localStorage.setItem("carrito", JSON.stringify(productos));
}

function cargarCarrito() {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];
    productos.forEach(insertarCarrito);
    actualizarMensajeCarrito(); // Asegurar que se actualiza el mensaje
}

// 🔎 Filtrar productos por categoría
document.getElementById('categoria')?.addEventListener('change', function () {
    let categoria = this.value;
    let productos = document.querySelectorAll('.box');

    let currentItem = 8; // Restablecer la cantidad de productos mostrados
    if (loadMoreBtn) loadMoreBtn.style.display = "block"; // Volver a mostrar el botón

    productos.forEach((producto, index) => {
        if (categoria === 'todos' || producto.dataset.categoria === categoria) {
            producto.style.display = index < currentItem ? 'inline-block' : 'none';
        } else {
            producto.style.display = 'none';
        }
    });

    // Ocultar "Cargar Más" si ya se muestran todos los productos de la categoría
    const productosVisibles = document.querySelectorAll(".box[style*='inline-block']").length;
    if (productosVisibles >= document.querySelectorAll(".box-container .box").length) {
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
    }
});

// 📸 Cambiar imagen principal al hacer clic en las miniaturas
function changeImage(thumbnail) {
    document.getElementById('main-img').src = thumbnail.src;
    document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active-thumbnail'));
    thumbnail.classList.add('active-thumbnail');
}

// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Mostrar el ID en la consola solo si existe (evita `null` en la consola)
if (productId) {
    console.log("ID del producto:", productId);
}

// Esperar a que el contenido de la página cargue
document.addEventListener("DOMContentLoaded", function () {
    const productTitle = document.getElementById("product-title");

    if (productTitle && productId) {
        productTitle.textContent = "Detalles del Producto ID: " + productId;
    }
});



