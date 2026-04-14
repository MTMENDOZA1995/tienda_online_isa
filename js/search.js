// js/search.js
// ==========================================================================
// LÓGICA DE LA BARRA DE BÚSQUEDA GLOBAL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".app-search-bar input");
    const searchIcon = document.querySelector(".app-search-bar .fa-magnifying-glass");
    const cameraIcon = document.querySelector(".camera-icon");

    // Función principal que ejecuta la búsqueda
    const executeSearch = () => {
        const query = searchInput.value.trim();
        
        if (query !== "") {
            // Redirige al catálogo enviando la palabra clave por la URL
            window.location.href = `Productos.html?q=${encodeURIComponent(query)}`;
        } else {
            // Efecto visual si el usuario intenta buscar en blanco
            searchInput.focus();
        }
    };

    if (searchInput) {
        // 1. Escuchar la tecla "Enter" en el teclado (Móvil o PC)
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // Evita comportamientos raros del navegador
                executeSearch();
            }
        });

        // 2. Si ya estamos en la página de productos y hay una búsqueda, rellenar el input
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
            searchInput.value = searchQuery;
        }
    }

    // 3. Ejecutar búsqueda al tocar el ícono de la lupa
    if (searchIcon) {
        searchIcon.style.cursor = "pointer";
        searchIcon.addEventListener("click", executeSearch);
    }

    // 4. Funcionalidad del ícono de la cámara (Simulación App Nativa)
    if (cameraIcon) {
        cameraIcon.style.cursor = "pointer";
        cameraIcon.addEventListener("click", () => {
            alert("📸 La búsqueda visual o por código de barras estará disponible en la próxima actualización.");
        });
    }
});
