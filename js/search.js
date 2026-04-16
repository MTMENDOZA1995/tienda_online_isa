// js/search.js
// ==========================================================================
// LÓGICA DE LA BARRA DE BÚSQUEDA GLOBAL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Funcionalidad del ícono de la cámara (Simulación App Nativa) - Global para todas las páginas
    const cameraIcons = document.querySelectorAll(".camera-icon");
    cameraIcons.forEach(icon => {
        icon.style.cursor = "pointer";
        icon.addEventListener("click", () => {
            alert("📸 La búsqueda visual o por código de barras estará disponible en la próxima versión.");
        });
    });

    // =========================================================
    // LÓGICA ESPECÍFICA PARA LA PÁGINA DE PRODUCTOS (CATÁLOGO)
    // =========================================================
    const currentPath = window.location.pathname.toLowerCase();
    
    if (currentPath.includes("productos.html")) {
        
        // El input de búsqueda principal en la página de catálogo
        const catalogSearchInput = document.getElementById("catalog-search-input");
        const categoryChips = document.querySelectorAll(".chip");
        
        if (catalogSearchInput) {
            
            // Función para filtrar los productos en tiempo real
            const filterCatalog = (searchTerm) => {
                const term = searchTerm.toLowerCase();
                const productCards = document.querySelectorAll("#product-list .app-product-card");
                let visibleCount = 0;

                productCards.forEach(card => {
                    // Busca por nombre del producto
                    const title = card.querySelector(".product-name")?.textContent.toLowerCase() || "";
                    // Opcional: Busca por categoría o tags si están en el HTML
                    
                    if (title.includes(term)) {
                        card.style.display = ""; // Mostrar
                        visibleCount++;
                    } else {
                        card.style.display = "none"; // Ocultar
                    }
                });

                // Opcional: Desactivar los chips de categoría si hay una búsqueda activa
                if (term !== "") {
                    categoryChips.forEach(chip => chip.classList.remove('active'));
                }
                
                // Mensaje si no hay resultados
                const listContainer = document.getElementById("product-list");
                let emptyMsg = document.getElementById("empty-search-msg");
                
                if (visibleCount === 0 && term !== "") {
                    if (!emptyMsg) {
                        emptyMsg = document.createElement("div");
                        emptyMsg.id = "empty-search-msg";
                        emptyMsg.style.cssText = "width: 100%; text-align: center; padding: 40px 20px; color: #888; font-size: 14px;";
                        emptyMsg.innerHTML = `<i class="fa-solid fa-box-open fa-2xl" style="margin-bottom: 15px; color: #ddd;"></i><br>No encontramos "${searchTerm}"`;
                        listContainer.appendChild(emptyMsg);
                    }
                    emptyMsg.style.display = "block";
                } else if (emptyMsg) {
                    emptyMsg.style.display = "none";
                }
            };

            // 1. Escuchar cuando el usuario escribe (Búsqueda en tiempo real)
            catalogSearchInput.addEventListener("input", (e) => {
                filterCatalog(e.target.value.trim());
            });

            // 2. Revisar si venimos de otra página (index o detalle) con una búsqueda guardada
            // Esperamos un momento a que Products.js haya inyectado las tarjetas en el DOM
            setTimeout(() => {
                const savedQuery = localStorage.getItem('globalSearchQuery');
                
                if (savedQuery) {
                    // Llenar el input con la palabra buscada
                    catalogSearchInput.value = savedQuery;
                    
                    // Aplicar el filtro visualmente
                    filterCatalog(savedQuery);
                    
                    // Limpiar la memoria para que si el usuario recarga la página, vuelva al catálogo completo
                    localStorage.removeItem('globalSearchQuery');
                }
            }, 300); // 300ms suele ser suficiente para que el DOM esté listo
        }
    }
});
