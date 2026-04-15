// js/FCompra.js
// ==========================================================================
// FUNNEL DE CHECKOUT MULTI-PASO Y RECOMENDACIONES DINÁMICAS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    const WHATSAPP_NUMBER = "51952580740"; 
    
    // Reglas de Envío
    const TARIFA_CAJA_REGULAR = 5.00;
    const TARIFA_NACIONAL = 25.00;
    const UMBRAL_ENVIO_GRATIS_CAJA = 30.00;
    
    const getCartSubtotal = () => {
        const cart = window.appCart || [];
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const safeFormatCurrency = (amount) => {
        if (typeof window.formatCurrency === 'function') return window.formatCurrency(amount);
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const currentPath = window.location.pathname.toLowerCase();

    // =========================================================
    // PANTALLA 1: BOLSA DE COMPRAS (FCompra.html)
    // =========================================================
    if (currentPath.includes("fcompra.html")) {
        const listContainer = document.getElementById("step1-item-list");
        const subtotalElem = document.getElementById("step1-subtotal");
        const stickyTotal = document.getElementById("sticky-step1-total");
        const btnContinuar = document.getElementById("btn-continuar-compra");
        const recommendedList = document.getElementById("recommended-list");

        const getRecommendations = () => {
            const catalogDB = window.allProducts || []; 
            if (catalogDB.length === 0) return []; 

            const cart = window.appCart || [];
            const cartIds = cart.map(item => item.id);
            
            let activeCategories = [];
            cartIds.forEach(id => {
                const found = catalogDB.find(p => p.id === id);
                if (found && !activeCategories.includes(found.category)) {
                    activeCategories.push(found.category);
                }
            });

            let recommended = catalogDB.filter(p => 
                activeCategories.includes(p.category) && !cartIds.includes(p.id)
            );

            if (recommended.length < 4) {
                const fallbacks = catalogDB.filter(p => !cartIds.includes(p.id) && !recommended.includes(p));
                recommended = recommended.concat(fallbacks).slice(0, 6);
            }

            return recommended.slice(0, 6);
        };

        const renderRecommendationsUI = () => {
            if (!recommendedList) return;
            recommendedList.innerHTML = ""; 
            
            const recomendedProducts = getRecommendations();

            if (!window.allProducts) {
                recommendedList.innerHTML = `<div style="font-size:11px; color:#888; padding-left:15px;">Conectando catálogo...</div>`;
                return;
            }

            if (recomendedProducts.length === 0) {
                recommendedList.innerHTML = `<div style="font-size:11px; color:#888; padding-left:15px;">¡Tienes casi toda la tienda!</div>`;
                return;
            }

            recomendedProducts.forEach(rec => {
                const originalPrice = rec.originalPrice || 0;
                let finalPrice = originalPrice;
                let priceHTML = "";

                if (rec.discountPercent > 0) {
                    finalPrice = originalPrice * (1 - rec.discountPercent / 100);
                    priceHTML = `
                        <span style="font-size: 10px; color: #999; text-decoration: line-through; display:block;">${safeFormatCurrency(originalPrice)}</span>
                        <span class="price-offer" style="font-size: 13px; color: #d0021b; font-weight: 700;">${safeFormatCurrency(finalPrice)}</span>
                    `;
                } else {
                    priceHTML = `
                        <span class="price-offer" style="font-size: 13px; color: #6cc82a; font-weight: 700; display:block; margin-top:14px;">${safeFormatCurrency(finalPrice)}</span>
                    `;
                }

                const imgSrc = rec.images?.main || "imagenes/default.jpg";
                const badgeHTML = rec.discountPercent > 0 ? `<div class="discount-badge" style="font-size: 9px; padding: 2px 4px;">-${rec.discountPercent}%</div>` : '';

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
                    <div class="product-image-container" style="height: 90px; padding: 5px;">
                        ${badgeHTML}
                        <img src="${imgSrc}" alt="${rec.name}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div class="product-info" style="padding: 8px;">
                        <p class="product-name" style="font-size: 10px; min-height: 26px; line-height: 1.2; margin-bottom: 4px;">${rec.name}</p>
                        ${priceHTML}
                        <button class="add-btn ${btnClass}" data-id="${rec.id}" style="padding: 5px; font-size: 10px; margin-top: 6px; width: 100%; background-color:${btnBg};">${btnText}</button>
                    </div>
                `;
                recommendedList.appendChild(card);
            });

            // 1. Agregar Directo
            const addButtons = recommendedList.querySelectorAll(".add-rec-btn");
            addButtons.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const productId = parseInt(e.target.getAttribute("data-id"));
                    const productToUpsell = recomendedProducts.find(p => p.id === productId);
                    
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
                            model: defModel, color: defColor, size: defSize
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
                            
                            window.renderCheckoutPage();
                            renderRecommendationsUI();
                        }
                    }
                });
            });

            // 2. Ver Opciones
            const optionButtons = recommendedList.querySelectorAll(".view-options-btn");
            optionButtons.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const productId = parseInt(e.target.getAttribute("data-id"));
                    const productToView = recomendedProducts.find(p => p.id === productId);
                    
                    if (productToView) {
                        localStorage.setItem("selectedProductDetail", JSON.stringify(productToView));
                        window.location.href = "producto-detalle.html";
                    }
                });
            });
        };

        window.renderCheckoutPage = () => { 
            const cart = window.appCart || [];
            if (!listContainer) return;

            if (cart.length === 0) {
                listContainer.innerHTML = `<div style="text-align:center; padding:30px; color:#888;">Tu bolsa está vacía.</div>`;
                subtotalElem.textContent = safeFormatCurrency(0);
                stickyTotal.textContent = safeFormatCurrency(0);
                btnContinuar.disabled = true;
                btnContinuar.style.backgroundColor = "#ccc";
                renderRecommendationsUI();
                return;
            }

            listContainer.innerHTML = "";
            cart.forEach((item, index) => {
                let vars = [];
                if (item.model && item.model !== "Unico" && item.model !== "no seleccionado") vars.push(item.model);
                if (item.color && item.color !== "Unico" && item.color !== "no seleccionado") vars.push(item.color);
                if (item.size && item.size !== "Unico" && item.size !== "no seleccionado") vars.push(item.size);
                
                const codigoProducto = item.code ? item.code : "No especificado";
                const codeHTML = `<div style="font-size:10px; color:#999; margin-top:2px; font-weight:600;">Cód: ${codigoProducto}</div>`;
                
                const row = document.createElement('div');
                row.className = 'checkout-item-row';
                row.innerHTML = `
                    <img src="${item.image}" alt="Img">
                    <div class="checkout-item-info">
                        <div class="checkout-item-name">${item.name}</div>
                        ${codeHTML}
                        ${vars.length > 0 ? `<div style="font-size:10px; color:#888; margin-top:2px;">Var: ${vars.join(' - ')}</div>` : ''}
                        <div style="display:flex; justify-content:space-between; margin-top:5px;">
                            <span style="font-size:11px; color:#666;">Cant: ${item.quantity}</span>
                            <span style="font-size:13px; font-weight:600; color:#6cc82a;">${safeFormatCurrency(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <button onclick="window.removeFromCart(${index}); setTimeout(() => { window.renderCheckoutPage(); window.renderRecommendationsUI(); }, 50);" style="background:none; border:none; color:#ff3b30; cursor:pointer; padding:5px;"><i class="fa-solid fa-trash-can"></i></button>
                `;
                listContainer.appendChild(row);
            });

            const sub = getCartSubtotal();
            subtotalElem.textContent = safeFormatCurrency(sub);
            stickyTotal.textContent = safeFormatCurrency(sub);
            
            btnContinuar.disabled = false;
            btnContinuar.style.backgroundColor = "#6cc82a";
        };

        if (btnContinuar) {
            btnContinuar.addEventListener("click", () => {
                window.location.href = "Entrega.html";
            });
        }

        window.renderRecommendationsUI = renderRecommendationsUI;

        setTimeout(() => {
            window.renderCheckoutPage();
            renderRecommendationsUI();
        }, 100); 
    }

    // =========================================================
    // PANTALLA 2: TIPO DE ENTREGA Y DATOS (Entrega.html)
    // =========================================================
    else if (currentPath.includes("entrega.html")) {
        if (!window.appCart || window.appCart.length === 0) {
            window.location.href = "FCompra.html";
            return;
        }

        const subtotal = getCartSubtotal();
        const priceCajaElem = document.getElementById("price-cajamarca");
        const stickyTotalElem = document.getElementById("sticky-step2-total"); 
        const btnIrPagar = document.getElementById("btn-ir-a-pagar");
        const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
        
        const addressContainer = document.getElementById("address-container");
        const addressInput = document.getElementById("address");
        const cityInput = document.getElementById("city");

        const costoCajamarca = subtotal >= UMBRAL_ENVIO_GRATIS_CAJA ? 0 : TARIFA_CAJA_REGULAR;
        
        if (priceCajaElem) {
            priceCajaElem.textContent = costoCajamarca === 0 ? "GRATIS" : safeFormatCurrency(costoCajamarca);
            priceCajaElem.style.color = costoCajamarca === 0 ? "#6cc82a" : "#333";
        }

        const updateDeliveryUI = () => {
            const methodRadio = document.querySelector('input[name="deliveryMethod"]:checked');
            if (!methodRadio) return;
            
            const method = methodRadio.value;
            let currentShippingCost = 0;
            
            if (method === "almacen") {
                if (addressContainer) addressContainer.style.display = "none";
                if (addressInput) addressInput.required = false;
                if (cityInput) cityInput.required = false;
                currentShippingCost = 0;
            } else if (method === "cajamarca") {
                if (addressContainer) addressContainer.style.display = "block";
                if (addressInput) addressInput.required = true;
                if (cityInput) cityInput.required = true;
                currentShippingCost = costoCajamarca;
            } else if (method === "nacional") {
                if (addressContainer) addressContainer.style.display = "block";
                if (addressInput) addressInput.required = true;
                if (cityInput) cityInput.required = true;
                currentShippingCost = TARIFA_NACIONAL;
            }

            if (stickyTotalElem) {
                const totalToPay = subtotal + currentShippingCost;
                stickyTotalElem.textContent = safeFormatCurrency(totalToPay);
            }
        };

        deliveryRadios.forEach(radio => radio.addEventListener("change", updateDeliveryUI));
        updateDeliveryUI(); 

        if (btnIrPagar) {
            btnIrPagar.addEventListener("click", () => {
                const form = document.getElementById("delivery-form");
                if (form && form.reportValidity()) {
                    
                    const method = document.querySelector('input[name="deliveryMethod"]:checked').value;
                    let finalShippingCost = 0;
                    let methodText = "";

                    // NUEVO: Guardamos un código (nacional, cajamarca, almacen) para validar en Paso 3
                    let deliveryCode = method;

                    if(method === "almacen") { finalShippingCost = 0; methodText = "Retiro en Almacén (Cajamarca)"; }
                    if(method === "cajamarca") { finalShippingCost = costoCajamarca; methodText = "A Domicilio (Cajamarca)"; }
                    if(method === "nacional") { finalShippingCost = TARIFA_NACIONAL; methodText = "Olva Express (Nacional)"; }

                    const checkoutData = {
                        name: document.getElementById('full-name').value.trim(),
                        phone: document.getElementById('phone').value.trim(),
                        email: document.getElementById('email')?.value.trim() || "",
                        address: addressInput?.value.trim() || "",
                        city: cityInput?.value.trim() || "",
                        notes: document.getElementById('comments')?.value.trim() || "",
                        deliveryType: methodText,
                        shippingCost: finalShippingCost,
                        deliveryCode: deliveryCode // <--- Lo pasamos por memoria
                    };

                    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
                    window.location.href = "Pago.html";
                }
            });
        }
    }

    // =========================================================
    // PANTALLA 3: PAGO Y WHATSAPP (Pago.html)
    // =========================================================
    else if (currentPath.includes("pago.html")) {
        const checkoutDataString = localStorage.getItem("checkoutData");
        
        if (!checkoutDataString || !window.appCart || window.appCart.length === 0) {
            window.location.href = "FCompra.html";
            return;
        }

        const checkoutData = JSON.parse(checkoutDataString);
        const subtotal = getCartSubtotal();
        const shipping = checkoutData.shippingCost;
        const total = subtotal + shipping;

        const finalSubtotalElem = document.getElementById("final-subtotal");
        const finalDeliveryTypeElem = document.getElementById("final-delivery-type");
        const finalShippingElem = document.getElementById("final-shipping");
        const finalTotalElem = document.getElementById("final-total");
        const btnProcesarPago = document.getElementById("btn-procesar-pago");

        if (finalSubtotalElem) finalSubtotalElem.textContent = safeFormatCurrency(subtotal);
        if (finalDeliveryTypeElem) finalDeliveryTypeElem.textContent = checkoutData.deliveryType;
        
        if (finalShippingElem) {
            finalShippingElem.textContent = shipping === 0 ? "GRATIS" : safeFormatCurrency(shipping);
            finalShippingElem.style.color = shipping === 0 ? "#6cc82a" : "#333";
        }

        if (finalTotalElem) finalTotalElem.textContent = safeFormatCurrency(total);
        if (btnProcesarPago) btnProcesarPago.textContent = `Pagar ${safeFormatCurrency(total)}`;

        // --- LÓGICA DE VALIDACIÓN "CONTRA ENTREGA" ---
        const contraEntregaRadio = document.querySelector('input[value="Contra Entrega"]');
        const yapeRadio = document.querySelector('input[value="Yape / Plin"]');

        if (contraEntregaRadio && checkoutData.deliveryCode === "nacional") {
            // Deshabilitar opción y volverla gris
            contraEntregaRadio.disabled = true;
            const optionContainer = contraEntregaRadio.closest('.payment-option');
            if (optionContainer) {
                optionContainer.style.opacity = "0.5";
                optionContainer.style.cursor = "not-allowed";
                optionContainer.title = "No disponible para envíos nacionales";
            }
            // Si por alguna razón estaba pre-seleccionada, forzar cambio a Yape
            if (contraEntregaRadio.checked && yapeRadio) {
                yapeRadio.checked = true;
            }
        }

        if (btnProcesarPago) {
            btnProcesarPago.addEventListener("click", () => {
                
                const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
                const paymentMethod = paymentRadio ? paymentRadio.value : "No especificado";
                
                let text = `🛒 *NUEVO PEDIDO CONFIRMADO*\n\n`;
                
                text += `👤 *DATOS DEL CLIENTE*\n`;
                text += `Nombre: ${checkoutData.name}\n`;
                text += `Teléfono: ${checkoutData.phone}\n`;
                if (checkoutData.address) text += `Dirección: ${checkoutData.address}, ${checkoutData.city}\n`;
                
                text += `\n🚚 *ENVÍO Y PAGO*\n`;
                text += `Entrega: ${checkoutData.deliveryType}\n`;
                text += `Pago: *${paymentMethod}*\n`;
                if (checkoutData.notes) text += `Notas: ${checkoutData.notes}\n`;

                text += `\n📦 *LISTA DE PRODUCTOS*\n`;
                window.appCart.forEach((item, i) => {
                    text += `\n*${i + 1}. ${item.name}*\n`;
                    text += `   🔸 *Cód:* ${item.code ? item.code : "No especificado"}\n`;
                    
                    let vars = [];
                    if (item.model && item.model !== "Unico" && item.model !== "no seleccionado") vars.push(item.model);
                    if (item.color && item.color !== "Unico" && item.color !== "no seleccionado") vars.push(item.color);
                    if (item.size && item.size !== "Unico" && item.size !== "no seleccionado") vars.push(item.size);
                    
                    if (vars.length > 0) text += `   🔸 *Var:* ${vars.join(' - ')}\n`;
                    text += `   🔸 *Cant:* ${item.quantity} x ${safeFormatCurrency(item.price)}\n`;
                });

                text += `\n📊 *RESUMEN FINAL*\n`;
                text += `Subtotal: ${safeFormatCurrency(subtotal)}\n`;
                text += `Envío: ${shipping === 0 ? "GRATIS" : safeFormatCurrency(shipping)}\n`;
                text += `*TOTAL A PAGAR: ${safeFormatCurrency(total)}*\n`;

                const encodedText = encodeURIComponent(text);
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

                window.open(whatsappUrl, '_blank');

                window.appCart = [];
                localStorage.removeItem("checkoutData");
                if(typeof window.saveCart === 'function') window.saveCart();
                
                alert("¡Procesando pedido! Finaliza tu compra vía WhatsApp.");
                window.location.replace("index.html"); 
            });
        }
    }
});
