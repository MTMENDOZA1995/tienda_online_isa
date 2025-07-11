// js/menu.js

document.addEventListener("DOMContentLoaded", () => {
    /**
     * Activa el enlace del menú correspondiente a la página actual.
     * Esta función compara la URL actual con los href de los enlaces del menú
     * para aplicar la clase 'active' y el atributo 'aria-current="page"'.
     */
    const activateMenuLink = () => {
        // Obtén la ruta de la URL actual (ej. /productos.html, /index.html)
        const currentPagePath = window.location.pathname;

        // Selecciona todos los enlaces del menú principal
        const menuLinks = document.querySelectorAll(".navbar ul li a");

        menuLinks.forEach(link => {
            // Obtén la ruta del enlace (ej. /productos.html)
            const linkPath = new URL(link.href).pathname;

            // Elimina la clase 'active' y el atributo 'aria-current' por si acaso
            link.classList.remove("active");
            link.removeAttribute("aria-current");

            // Compara la ruta de la página actual con la ruta del enlace
            // Usa startsWith para manejar sub-rutas (ej. /productos/item1 activa /productos)
            // Asegura que no active el enlace de la raíz ("/") en todas las subpáginas a menos que sea el inicio.
            if (linkPath === currentPagePath || (currentPagePath.startsWith(linkPath) && linkPath !== '/')) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page"); // Mejora de accesibilidad para la página actual
            }

            // Caso especial para la página de inicio si la ruta es solo "/"
            // y el enlace es a "index.html" (o "/")
            if (currentPagePath === '/' && (linkPath === '/index.html' || linkPath === '/')) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    };

    // Llama a la función para activar el enlace del menú al cargar la página
    activateMenuLink();
});