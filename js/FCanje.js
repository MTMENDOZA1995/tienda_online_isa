// js/FCanje.js
// ==========================================================================
// FUNNEL DE CANJE DE ECOPOINTS (ESTILO FCOMPRA NATIVO)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    const WHATSAPP_NUMBER = "51952580740"; 
    
    // Reglas de Envío (En Soles)
    const TARIFA_CAJA_REGULAR = 5.00;
    const TARIFA_NACIONAL = 25.00;
    
    const getEcoCartTotalPoints = () => {
        const cart = JSON.parse(localStorage.getItem("appEcoCart")) || [];
        return cart.reduce((total, item) => total + (item.points * item.quantity), 0);
    };

    const safeFormatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    const currentPath = window.location.pathname.toLowerCase();

    // =========================================================
    // PANTALLA 1: BOLSA DE CANJE Y RECOMENDACIONES (FCanje.html)
    // =========================================================
    if (currentPath.includes("fcanje.html")) {
        const cartContainer = document.getElementById("eco-cart-list-container");
        const totalDisplay = document.getElementById("sticky-canje-total");
        const btnProcesar = document.getElementById("btn-procesar-canje");
        const recommendedList = document.getElementById("recommended-list");

        // --- RENDERIZAR LA BOLSA (USANDO CLASES NATIVAS DE FCOMPRA) ---
        const renderCart = () => {
            let ecoCart = JSON.parse(localStorage.getItem("appEcoCart")) || [];
            if(!cartContainer) return;
            cartContainer.innerHTML = "";
            
            if (ecoCart.length === 0) {
                cartContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <i class="fa-solid fa-box-open" style="font-size: 50px; color: #ddd; margin-bottom: 15px;"></i>
                        <h3 style="color: #333; font-size: 15px; margin-bottom: 8px;">Tu bolsa está vacía</h3>
                        <p style="color: #888; font-size: 12px; margin-bottom: 20px;">Aún no has seleccionado ningún premio.</p>
                        <button onclick="window.location.href='Ecopoints.html'" style="background-color: #A951F6; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">Explorar Premios</button>
                    </div>
                `;
                if(totalDisplay) totalDisplay.textContent = "0 pts";
                if(btnProcesar) {
                    btnProcesar.disabled = true;
                    btnProcesar.style.backgroundColor = "#ccc";
                    btnProcesar.style.boxShadow = "none";
                }
                return;
            }

            if(btnProcesar) {
                btnProcesar.disabled = false;
                btnProcesar.style.backgroundColor = "#111";
                btnProcesar.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
            }

            let totalPoints = 0;

            ecoCart.forEach((item, index) => {
                const itemPoints = item.points * item.quantity;
                totalPoints += itemPoints;

                let vars = [];
                if (item.model && item.model !== "Unico") vars.push(item.model);
                if (item.color && item.color !== "Unico") vars.push(item.color);
                if (item.size && item.size !== "Unico") vars.push(item.size);

                // USAMOS CLASES checkout-item-row DE FCOMPRA.CSS
                const row = document.createElement('div');
                row.className = 'checkout-item-row';
                
                row.innerHTML = `
                    <img src="${item.image}" alt="Img">
                    <div class="checkout-item-info">
                        <div class="checkout-item-name">${item.name}</div>
                        <div style="font-size:10px; color:#999; margin-top:2px; font-weight:600;">Cód: ${item.code}</div>
                        ${vars.length > 0 ? `<div style="font-size:10px; color:#888; margin-top:2px;">Var: ${vars.join(' - ')}</div>` : ''}
                        
                        <div style="display:flex; justify-content:space-between; margin-top:8px; align-items:center;">
                            
                            <div style="display: flex; align-items: center; background: #f4f4f4; border-radius: 15px; padding: 2px;">
                                <button class="btn-minus" data-index="${index}" style="width: 24px; height: 24px; border-radius: 50%; border: none; background: white; font-weight: bold; color: #333; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">-</button>
                                <input type="number" value="${item.quantity}" readonly style="width: 30px; text-align: center; border: none; background: transparent; font-size: 12px; font-weight: 600; color: #333;">
                                <button class="btn-plus" data-index="${index}" style="width: 24px; height: 24px; border-radius: 50%; border: none; background: white; font-weight: bold; color: #333; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">+</button>
                            </div>

                            <span style="font-size:14px; font-weight:700; color:#6cc82a;">
                                <i class="fa-solid fa-leaf"></i> ${itemPoints} pts
                            </span>
                        </div>
                    </div>
                    <button class="eco-cart-delete" data-index="${index}" style="background:none; border:none; color:#ff3b30; cursor:pointer; padding:5px; margin-left: 10px;">
                        <i class="fa-solid fa-trash-can fa-lg"></i>
                    </button>
                `;
                cartContainer.appendChild(row);
            });

            if(totalDisplay) totalDisplay.textContent = totalPoints.toLocaleString() + " pts";
            
            attachCartEvents(ecoCart);
        };

        const attachCartEvents = (ecoCart) => {
            document.querySelectorAll(".eco-cart-delete").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const index = e.currentTarget.getAttribute("data-index");
                    ecoCart.splice(index, 1);
                    localStorage.setItem("appEcoCart", JSON.stringify(ecoCart));
                    renderCart();
                });
            });

            document.querySelectorAll(".btn-minus").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const index = e.currentTarget.getAttribute("data-index");
                    if (ecoCart[index].quantity > 1) {
                        ecoCart[index].quantity -= 1;
                        localStorage.setItem("appEcoCart", JSON.stringify(ecoCart));
                        renderCart();
                    }
                });
            });

            document.querySelectorAll(".btn-plus").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const index = e.currentTarget.getAttribute("data-index");
                    const maxStock = ecoCart[index].maxStock || 10; 
                    if (ecoCart[index].quantity < maxStock) {
                        ecoCart[index].quantity += 1;
                        localStorage.setItem("appEcoCart", JSON.stringify(ecoCart));
                        renderCart();
                    } else {
                        alert(`Stock máximo alcanzado (${maxStock} unidades)`);
                    }
                });
            });
        };

        // Renderizado Inicial
        renderCart();

        // Botón Continuar
        if (btnProcesar) {
            btnProcesar.addEventListener("click", () => {
                window.location.href = "Entrega-canje.html"; 
            });
        }

        // --- ALGORITMO DE RECOMENDACIONES (ESTILO ALIEXPRESS) ---
        setTimeout(() => {
            if (window.allProducts && window.allProducts.length > 0 && recommendedList) {
                let ecoCart = JSON.parse(localStorage.getItem("appEcoCart")) || [];
                const cartIds = ecoCart.map(item => item.id);
                
                const allEco = window.allProducts.map(p => ({
                    ...p, points: Math.floor((p.originalPrice || 0) * 10)
                }));
                
                let availableForRec = allEco.filter(p => !cartIds.includes(p.id) && (p.stock === undefined || p.stock > 0));
                availableForRec = availableForRec.sort(() => 0.5 - Math.random());
                
                const finalRecommendations = availableForRec.slice(0, 6);

                if (finalRecommendations.length > 0) {
                    recommendedList.innerHTML = "";
                    finalRecommendations.forEach(rec => {
                        const imgSrc = rec.images?.main || "imagenes/default.jpg";
                        const card = document.createElement("div");
                        
                        card.className = "app-product-card ecopoint-card";
                        card.style.cssText = "width: 140px; flex: 0 0 auto; margin-bottom: 0; position: relative; cursor: pointer; scroll-snap-align: start;";
                        card.setAttribute("data-id", rec.id);
                        
                        card.innerHTML = `
                            <div class="product-image-container eco-title-click" style="height: 100px; padding: 5px;">
                                <img src="${imgSrc}" alt="${rec.name}" style="width:100%; height:100%; object-fit:contain;">
                            </div>
                            <div class="product-info eco-title-click" style="padding: 8px 8px 12px;">
                                <p class="product-name" style="font-size: 11px; min-height: 28px; line-height: 1.2; margin-bottom: 4px; color:#333;">${rec.name}</p>
                                <span class="price-offer" style="font-size: 13px; color: #6cc82a; font-weight: 700; display:block;">
                                    <i class="fa-solid fa-leaf"></i> ${rec.points} pts
                                </span>
                            </div>
                        `;
                        recommendedList.appendChild(card);
                    });
                } else {
                    const recSection = document.getElementById("recommendations-section");
                    if(recSection) recSection.style.display = "none";
                }
            }
        }, 400);

        // --- INTERCEPTOR DE CLICS PARA RECOMENDACIONES ---
        if(recommendedList) {
            recommendedList.addEventListener("click", (e) => {
                const card = e.target.closest(".app-product-card");
                if (card) {
                    const productId = card.getAttribute("data-id");
                    if (window.allProducts && window.allProducts.length > 0) {
                        const productToView = window.allProducts.find(p => String(p.id) === String(productId));
                        if (productToView) {
                            productToView.points = Math.floor((productToView.originalPrice || 0) * 10);
                            localStorage.setItem("selectedEcoDetail", JSON.stringify(productToView));
                            window.location.href = "ecopoint-detalle.html";
                        }
                    }
                }
            });
        }
    }

    // =========================================================
    // PANTALLA 2: TIPO DE ENTREGA (Entrega-canje.html)
    // =========================================================
    else if (currentPath.includes("entrega-canje.html")) {
        const ecoCart = JSON.parse(localStorage.getItem("appEcoCart")) || [];
        if (ecoCart.length === 0) {
            window.location.href = "FCanje.html";
            return;
        }

        const priceCajaElem = document.getElementById("price-cajamarca");
        const stickyTotalElem = document.getElementById("sticky-step2-total"); 
        const btnIrPagar = document.getElementById("btn-ir-a-pagar");
        const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
        
        const addressContainer = document.getElementById("address-container");
        const addressInput = document.getElementById("address");
        const cityInput = document.getElementById("city");

        if (priceCajaElem) {
            priceCajaElem.textContent = safeFormatCurrency(TARIFA_CAJA_REGULAR);
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
                currentShippingCost = TARIFA_CAJA_REGULAR;
            } else if (method === "nacional") {
                if (addressContainer) addressContainer.style.display = "block";
                if (addressInput) addressInput.required = true;
                if (cityInput) cityInput.required = true;
                currentShippingCost = TARIFA_NACIONAL;
            }

            if (stickyTotalElem) {
                stickyTotalElem.textContent = safeFormatCurrency(currentShippingCost);
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

                    if(method === "almacen") { finalShippingCost = 0; methodText = "Retiro en Almacén (Cajamarca)"; }
                    if(method === "cajamarca") { finalShippingCost = TARIFA_CAJA_REGULAR; methodText = "A Domicilio (Cajamarca)"; }
                    if(method === "nacional") { finalShippingCost = TARIFA_NACIONAL; methodText = "Olva Express / Agencia (Nacional)"; }

                    const checkoutData = {
                        name: document.getElementById('full-name').value.trim(),
                        phone: document.getElementById('phone').value.trim(),
                        dni: document.getElementById('email')?.value.trim() || "No especificado",
                        address: addressInput?.value.trim() || "",
                        city: cityInput?.value.trim() || "",
                        notes: document.getElementById('comments')?.value.trim() || "",
                        deliveryType: methodText,
                        shippingCost: finalShippingCost,
                        deliveryCode: method
                    };

                    localStorage.setItem("checkoutEcoData", JSON.stringify(checkoutData));
                    window.location.href = "Pago-canje.html";
                }
            });
        }
    }

    // =========================================================
    // PANTALLA 3: PAGO DEL ENVÍO Y WHATSAPP (Pago-canje.html)
    // =========================================================
    else if (currentPath.includes("pago-canje.html")) {
        const checkoutDataString = localStorage.getItem("checkoutEcoData");
        const ecoCart = JSON.parse(localStorage.getItem("appEcoCart")) || [];
        
        if (!checkoutDataString || ecoCart.length === 0) {
            window.location.href = "FCanje.html";
            return;
        }

        const checkoutData = JSON.parse(checkoutDataString);
        const totalPoints = getEcoCartTotalPoints();
        const shippingCost = checkoutData.shippingCost;

        const finalPointsElem = document.getElementById("final-points-total");
        const finalDeliveryTypeElem = document.getElementById("final-delivery-type");
        const finalShippingElem = document.getElementById("final-shipping");
        const finalTotalElem = document.getElementById("final-total");
        const btnProcesarPago = document.getElementById("btn-procesar-pago");

        const paymentSection = document.getElementById("payment-method-section");
        const freeNotice = document.getElementById("free-shipping-notice");

        if (finalPointsElem) finalPointsElem.textContent = totalPoints + " pts";
        if (finalDeliveryTypeElem) finalDeliveryTypeElem.textContent = checkoutData.deliveryType;
        
        if (finalShippingElem) {
            finalShippingElem.textContent = shippingCost === 0 ? "GRATIS" : safeFormatCurrency(shippingCost);
            finalShippingElem.style.color = shippingCost === 0 ? "#6cc82a" : "#333";
        }

        if (finalTotalElem) {
            finalTotalElem.textContent = shippingCost === 0 ? "S/ 0.00" : safeFormatCurrency(shippingCost);
        }

        if (checkoutData.deliveryCode === "almacen") {
            if (paymentSection) paymentSection.style.display = "none";
            if (freeNotice) freeNotice.style.display = "block";
        }

        if (btnProcesarPago) {
            btnProcesarPago.innerHTML = shippingCost === 0 
                ? `<i class="fa-solid fa-check-double"></i> Finalizar Canje Gratis` 
                : `<i class="fa-brands fa-whatsapp fa-lg"></i> Confirmar y Enviar`;
            
            const contraEntregaRadio = document.querySelector('input[value="Contra Entrega"]');
            const yapeRadio = document.querySelector('input[value="Yape / Plin"]');

            if (contraEntregaRadio && checkoutData.deliveryCode === "nacional") {
                contraEntregaRadio.disabled = true;
                const optionContainer = contraEntregaRadio.closest('.payment-option');
                if (optionContainer) {
                    optionContainer.style.opacity = "0.5";
                    optionContainer.style.cursor = "not-allowed";
                }
                if (contraEntregaRadio.checked && yapeRadio) yapeRadio.checked = true;
            }

            btnProcesarPago.addEventListener("click", () => {
                
                const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
                const paymentMethod = (checkoutData.deliveryCode === "almacen") ? "No requiere (Gratis)" : (paymentRadio ? paymentRadio.value : "Pendiente");
                
                let text = `🍃 *NUEVO CANJE DE ECOPOINTS CONFIRMADO*\n\n`;
                
                text += `👤 *DATOS DEL USUARIO*\n`;
                text += `Nombre: ${checkoutData.name}\n`;
                text += `DNI / CE: ${checkoutData.dni}\n`;
                text += `Teléfono: ${checkoutData.phone}\n`;
                if (checkoutData.address) text += `Dirección: ${checkoutData.address}, ${checkoutData.city}\n`;
                
                text += `\n🚚 *ENVÍO Y PAGO (DEL ENVÍO)*\n`;
                text += `Entrega: ${checkoutData.deliveryType}\n`;
                text += `Pago Envío: *${paymentMethod}*\n`;
                if (checkoutData.notes) text += `Notas: ${checkoutData.notes}\n`;

                text += `\n🎁 *PREMIOS SELECCIONADOS*\n`;
                ecoCart.forEach((item, i) => {
                    text += `\n*${i + 1}. ${item.name}*\n`;
                    text += `   🔸 *Cód:* ${item.code}\n`;
                    
                    let vars = [];
                    if (item.model !== "Unico") vars.push(item.model);
                    if (item.color !== "Unico") vars.push(item.color);
                    if (item.size !== "Unico") vars.push(item.size);
                    
                    if (vars.length > 0) text += `   🔸 *Var:* ${vars.join(' - ')}\n`;
                    text += `   🔸 *Cant:* ${item.quantity} x ${item.points} pts\n`;
                });

                text += `\n📊 *RESUMEN FINAL*\n`;
                text += `Puntos a Descontar: *${totalPoints} pts*\n`;
                text += `Costo de Envío (Soles): *${shippingCost === 0 ? "GRATIS" : safeFormatCurrency(shippingCost)}*\n`;

                const encodedText = encodeURIComponent(text);
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

                window.open(whatsappUrl, '_blank');

                localStorage.removeItem("appEcoCart");
                localStorage.removeItem("checkoutEcoData");
                
                alert("¡Procesando Canje! Envía el mensaje por WhatsApp para finalizar.");
                window.location.replace("Ecopoints.html"); 
            });
        }
    }
});
