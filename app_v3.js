// === CALCULATOR FUNCTIONS ===
let calcValue = '0';
let calcOperator = '';
let calcPrevValue = '';

function calcAppend(val) {
    const display = document.getElementById('calcDisplay');
    if (calcValue === '0' && val !== '.') {
        calcValue = val;
    } else {
        calcValue += val;
    }
    display.value = calcValue;
}

function calcClear() {
    calcValue = '0';
    calcOperator = '';
    calcPrevValue = '';
    document.getElementById('calcDisplay').value = '0';
}

function calcBackspace() {
    if (calcValue.length > 1) {
        calcValue = calcValue.slice(0, -1);
    } else {
        calcValue = '0';
    }
    document.getElementById('calcDisplay').value = calcValue;
}

function calcCalculate() {
    try {
        const result = eval(calcValue);
        calcValue = result.toString();
        document.getElementById('calcDisplay').value = calcValue;
    } catch (e) {
        calcValue = 'Error';
        document.getElementById('calcDisplay').value = 'Error';
        setTimeout(() => {
            calcClear();
        }, 1500);
    }
}

// === TAB SWITCHING ===
function switchCalcTab(tab) {
    // Hide all tabs
    document.getElementById('calcBodyBasic').style.display = 'none';
    document.getElementById('calcBodyOffer').style.display = 'none';

    // Remove active state from all buttons
    document.getElementById('tabBasic').style.borderBottom = '2px solid transparent';
    document.getElementById('tabBasic').style.color = '#aaa';
    document.getElementById('tabBasic').style.fontWeight = 'normal';

    document.getElementById('tabOffer').style.borderBottom = '2px solid transparent';
    document.getElementById('tabOffer').style.color = '#aaa';
    document.getElementById('tabOffer').style.fontWeight = 'normal';

    // Show selected tab
    if (tab === 'basic') {
        document.getElementById('calcBodyBasic').style.display = 'flex'; // Changed from block to flex
        document.getElementById('tabBasic').style.borderBottom = '2px solid var(--primary-color)';
        document.getElementById('tabBasic').style.color = 'white';
        document.getElementById('tabBasic').style.fontWeight = 'bold';
    } else if (tab === 'offer') {
        document.getElementById('calcBodyOffer').style.display = 'flex'; // Changed from block to flex
        document.getElementById('tabOffer').style.borderBottom = '2px solid var(--primary-color)';
        document.getElementById('tabOffer').style.color = 'white';
        document.getElementById('tabOffer').style.fontWeight = 'bold';

        // Load products when opening bonification tab
        loadCalcProducts();
    }
}

// === BONIFICATION CALCULATOR ===
let calcCartBuy = [];
let calcCartGift = [];

// Selected products tracking
let selectedCalcProducts = new Set();

// Initial Discounts Configuration
const initialDiscounts = {
    // 2L Products (71%)
    1: 71, 2: 71, // Coca-Cola
    5: 71, 6: 71, // Fanta
    8: 71,        // Sprite

    // Cans 33cl (62%)
    3: 62, 4: 62, // Coca-Cola
    7: 62,        // Fanta
    9: 62,        // Sprite
    11: 62,       // Aquarius
    13: 62,       // Fuze Tea

    // Monster (50%)
    16: 50, 17: 50
};


// Toggle product selection
function toggleCalcProductSelection(productId) {
    console.log('Toggling product:', productId);
    if (selectedCalcProducts.has(productId)) {
        selectedCalcProducts.delete(productId);
    } else {
        selectedCalcProducts.add(productId);
    }
    loadCalcProducts();
}

function loadCalcProducts() {
    console.log('Loading calc products...');
    const container = document.getElementById('calcProdList');
    if (!container) {
        console.error('Container calcProdList not found');
        return;
    }

    // CATÁLOGO COMPLETO - Todos los productos 2L, 1.5L, Latas
    const products = [
        // COCA-COLA
        { id: 1, name: 'Coca-Cola 2L', price: 28.68, logo: 'cocacola_logo.jpg', color: '#e60000', envase: '6 bot' },
        { id: 2, name: 'Coca-Cola Zero 2L', price: 28.68, logo: 'cocacola_zero_logo.png', color: '#000000', envase: '6 bot' },
        { id: 3, name: 'Coca-Cola Lata 33cl', price: 39.36, logo: 'cocacola_logo.jpg', color: '#e60000', envase: '24 latas' },
        { id: 4, name: 'Coca-Cola Zero Lata 33cl', price: 39.36, logo: 'cocacola_zero_logo.png', color: '#000000', envase: '24 latas' },

        // FANTA
        { id: 5, name: 'Fanta Naranja 2L', price: 27.06, logo: 'fanta_logo.jpg', color: '#ff8c00', envase: '6 bot' },
        { id: 6, name: 'Fanta Limón 2L', price: 27.06, logo: 'fanta_logo.jpg', color: '#ffd700', envase: '6 bot' },
        { id: 7, name: 'Fanta Lata 33cl', price: 37.68, logo: 'fanta_logo.jpg', color: '#ff8c00', envase: '24 latas' },

        // SPRITE
        { id: 8, name: 'Sprite 2L', price: 27.06, logo: 'sprite_logo.jpg', color: '#00d800', envase: '6 bot' },
        { id: 9, name: 'Sprite Lata 33cl', price: 37.68, logo: 'sprite_logo.jpg', color: '#00d800', envase: '24 latas' },

        // AQUARIUS
        { id: 10, name: 'Aquarius 1.5L', price: 23.52, logo: 'aquarius_logo.png', color: '#4a90e2', envase: '6 bot' },
        { id: 11, name: 'Aquarius Lata 33cl', price: 41.04, logo: 'aquarius_logo.png', color: '#4a90e2', envase: '24 latas' },

        // FUZE TEA
        { id: 12, name: 'Fuze Tea 1.5L', price: 21.54, logo: 'fuzetea_logo.jpg', color: '#d4a574', envase: '6 bot' },
        { id: 13, name: 'Fuze Tea Lata 33cl', price: 39.60, logo: 'fuzetea_logo.jpg', color: '#d4a574', envase: '24 latas' },

        // AQUABONA
        { id: 14, name: 'Aquabona 1.5L', price: 9.30, logo: 'aquabona_logo.png', color: '#4a90e2', envase: '6 bot' },
        { id: 15, name: 'Aquabona 50cl', price: 20.64, logo: 'aquabona_logo.png', color: '#4a90e2', envase: '24 bot' },

        // MONSTER
        { id: 16, name: 'Monster Energy 50cl', price: 56.16, logo: 'monster_logo.jpg', color: '#86bc25', envase: '12 latas' },
        { id: 17, name: 'Monster Energy 25cl', price: 44.40, logo: 'monster_logo.jpg', color: '#86bc25', envase: '24 latas' },

        // ROYAL BLISS
        { id: 18, name: 'Royal Bliss 25cl', price: 15.48, logo: 'royalbliss_logo.png', color: '#c9a961', envase: '24 latas' },
        { id: 19, name: 'Royal Bliss 20cl VR', price: 31.92, logo: 'royalbliss_logo.png', color: '#c9a961', envase: '24 bot' }
    ];

    container.innerHTML = '';
    products.forEach(prod => {
        const card = document.createElement('div');
        const isSelected = selectedCalcProducts.has(prod.id);

        // Use initialDiscounts for display
        const discount = initialDiscounts[prod.id] || 0;
        const finalPrice = discount > 0 ? prod.price * (1 - discount / 100) : prod.price;

        let badgeHtml = '';
        if (discount > 0) {
            badgeHtml = `<div style="position: absolute; top: 6px; right: 6px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 3px 7px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; box-shadow: 0 2px 8px rgba(239,68,68,0.4); z-index: 10;">-${discount}%</div>`;
        }

        card.style.cssText = `
            background: ${isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)'};
            border-radius: 10px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.08)'};
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            position: relative;
            backdrop-filter: blur(10px);
        `;

        // Direct onclick handler on the card container for better reliability
        card.onclick = () => toggleCalcProductSelection(prod.id);

        card.innerHTML = `
            ${badgeHtml}
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none;">
                <img src="${prod.logo}" style="width: 42px; height: 42px; object-fit: contain; border-radius: 6px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" alt="${prod.name}">
                <div style="font-size: 0.7rem; text-align: center; color: #fff; font-weight: 600; line-height: 1.1; min-height: 28px; display: flex; align-items: center;">
                    ${prod.name}
                </div>
                <div style="font-size: 0.65rem; color: #888; font-weight: 500;">
                    ${prod.envase}
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%;">
                    ${discount > 0 ? `
                        <div style="font-size: 0.7rem; color: #999; font-weight: 500; text-decoration: line-through;">
                            ${prod.price.toFixed(2)}€
                        </div>
                        <div style="font-size: 1rem; color: #00ff88; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,136,0.3);">
                            ${finalPrice.toFixed(2)}€
                        </div>
                    ` : `
                        <div style="font-size: 0.95rem; color: #00ff88; font-weight: 700; margin-top: 4px;">
                            ${prod.price.toFixed(2)}€
                        </div>
                    `}
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 6px; width: 100%; pointer-events: auto;">
                <button onclick="event.stopPropagation(); addToCalcCart(${prod.id}, '${prod.name}', ${prod.price});" 
                    title="Agregar a compra"
                    style="background: linear-gradient(135deg, #4ade80, #22c55e); color: white; border: none; padding: 6px 4px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; width: 100%; font-weight: 600; box-shadow: 0 2px 8px rgba(74,222,128,0.3); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 28px;">
                    <span style="font-size: 0.9rem;">🛒</span> Comprar
                </button>
                <button onclick="event.stopPropagation(); addToGiftCart(${prod.id}, '${prod.name}', ${prod.price});" 
                    title="Agregar a bonificación"
                    style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; border: none; padding: 6px 4px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; width: 100%; font-weight: 600; box-shadow: 0 2px 8px rgba(251,191,36,0.3); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 28px;">
                    <span style="font-size: 0.9rem;">🎁</span> Bonif.
                </button>
            </div>
        `;

        card.onmouseenter = () => {
            if (!selectedCalcProducts.has(prod.id)) {
                card.style.borderColor = prod.color;
            }
            card.style.transform = 'translateY(-4px) scale(1.02)';
            card.style.boxShadow = `0 8px 20px ${prod.color}40, 0 0 0 1px ${prod.color}20`;
        };
        card.onmouseleave = () => {
            if (!selectedCalcProducts.has(prod.id)) {
                card.style.borderColor = 'rgba(255,255,255,0.08)';
            }
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'none';
        };

        container.appendChild(card);
    });
}

function addToCalcCart(id, name, price) {
    const safeId = parseInt(id);
    console.log('Adding to cart:', safeId, name, price);

    // Default discount from config or 0
    const defaultDiscount = initialDiscounts[safeId] || 0;

    const existing = calcCartBuy.find(i => i.id === safeId);
    if (existing) {
        existing.qty++;
    } else {
        calcCartBuy.push({
            id: safeId,
            name,
            price,
            qty: 1,
            discount: defaultDiscount
        });
    }

    // Visual feedback
    showAddFeedback('buy', name);

    renderCalcList('buy');
    calculateBonification();
}

function addToGiftCart(id, name, price) {
    const safeId = parseInt(id);
    console.log('Adding to gift cart:', safeId, name, price);

    const existing = calcCartGift.find(i => i.id === safeId);
    if (existing) {
        existing.qty++;
    } else {
        calcCartGift.push({
            id: safeId,
            name,
            price,
            qty: 1,
            discount: 0
        });
    }

    // Visual feedback
    showAddFeedback('gift', name);

    renderCalcList('gift');
    calculateBonification();
}

function changeCalcDiscount(index, delta) {
    const item = calcCartBuy[index];
    if (!item) return;

    item.discount += delta;
    if (item.discount < 0) item.discount = 0;
    if (item.discount > 100) item.discount = 100;

    renderCalcList();
    calculateBonification();
}

function changeCalcQty(index, delta) {
    const item = calcCartBuy[index];
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        calcCartBuy.splice(index, 1);
    }

    renderCalcList();
    calculateBonification();
}

function removeCalcItem(index) {
    calcCartBuy.splice(index, 1);
    renderCalcList();
    calculateBonification();
}

function renderCalcList(type = 'buy') {
    const cart = type === 'buy' ? calcCartBuy : calcCartGift;
    const containerId = type === 'buy' ? 'calcListBuy' : 'calcListGift';
    const container = document.getElementById(containerId);

    if (!container) return;

    // Show/hide gift section based on content
    if (type === 'gift') {
        const giftSection = container.parentNode;
        if (giftSection) {
            giftSection.style.display = calcCartGift.length > 0 ? 'block' : 'block'; // Always show for adding
        }
    }

    if (cart.length === 0) {
        if (type === 'buy') {
            container.innerHTML = `
                <div style="color:#666; font-size:0.8rem; text-align:center; padding:10px; border:1px dashed #444; border-radius:4px;">
                    Selecciona productos del catálogo
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="color:#666; font-size:0.8rem; text-align:center; padding:5px;">
                    (Opcional) Añade bonificaciones con 🎁
                </div>
            `;
        }
        return;
    }

    container.innerHTML = '';
    cart.forEach((item, index) => {
        const discountedPrice = item.price * (1 - item.discount / 100);
        const lineTotal = discountedPrice * item.qty;

        const itemEl = document.createElement('div');
        itemEl.style.cssText = `
            background: linear-gradient(135deg, ${type === 'buy' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(251, 191, 36, 0.08)'}, ${type === 'buy' ? 'rgba(16, 185, 129, 0.03)' : 'rgba(251, 191, 36, 0.03)'});
            padding: 8px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            border-left: 3px solid ${type === 'buy' ? '#10b981' : '#fbbf24'};
            backdrop-filter: blur(10px);
            transition: all 0.2s;
        `;

        itemEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.8rem; font-weight: 700; color: white; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</div>
                    <div style="font-size: 0.65rem; color: #999;">${item.price.toFixed(2)}€ ${item.discount > 0 ? `→ <span style="color: #00ff88; font-weight: 600;">${discountedPrice.toFixed(2)}€</span>` : ''}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.95rem; font-weight: 700; color: #4ade80;">${lineTotal.toFixed(2)}€</div>
                </div>
            </div>
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 0.65rem; color: #aaa; margin-bottom: 2px; font-weight: 600;">Cantidad</div>
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <button onclick="changeCalcQty('${type}', ${index}, -1)" 
                            style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; width: 24px; height: 24px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(220,38,38,0.3);">
                            −
                        </button>
                        <span style="color: white; font-weight: 700; min-width: 24px; text-align: center; font-size: 0.85rem;">${item.qty}</span>
                        <button onclick="changeCalcQty('${type}', ${index}, 1)" 
                            style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; width: 24px; height: 24px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(34,197,94,0.3);">
                            +
                        </button>
                    </div>
                </div>
                ${type === 'buy' ? `
                <div style="flex: 1; min-width: 120px;">
                    <div style="font-size: 0.65rem; color: #aaa; margin-bottom: 2px; font-weight: 600;">Descuento %</div>
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <button onclick="changeCalcDiscount(${index}, -1)" 
                            style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; width: 24px; height: 24px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(220,38,38,0.3);">
                            −
                        </button>
                        <span style="color: #fbbf24; font-weight: 700; min-width: 32px; text-align: center; font-size: 0.85rem;">${item.discount}%</span>
                        <button onclick="changeCalcDiscount(${index}, 1)" 
                            style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; width: 24px; height: 24px; border-radius: 5px; cursor: pointer; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(34,197,94,0.3);">
                            +
                        </button>
                    </div>
                </div>` : ''}
                <button onclick="removeCalcItem('${type}', ${index})" 
                    style="background: linear-gradient(135deg, #991b1b, #7f1d1d); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.7rem; font-weight: 600; transition: all 0.2s; box-shadow: 0 2px 6px rgba(153,27,27,0.3); white-space: nowrap;">
                    × Eliminar
                </button>
            </div>
        `;

        // Add hover effect
        itemEl.onmouseenter = () => {
            itemEl.style.background = `linear-gradient(135deg, ${type === 'buy' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(251, 191, 36, 0.12)'}, ${type === 'buy' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(251, 191, 36, 0.05)'})`;
            itemEl.style.transform = 'translateX(2px)';
        };
        itemEl.onmouseleave = () => {
            itemEl.style.background = `linear-gradient(135deg, ${type === 'buy' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(251, 191, 36, 0.08)'}, ${type === 'buy' ? 'rgba(16, 185, 129, 0.03)' : 'rgba(251, 191, 36, 0.03)'})`;
            itemEl.style.transform = 'translateX(0)';
        };

        container.appendChild(itemEl);
    });
}

function changeCalcQty(type, index, delta) {
    const cart = type === 'buy' ? calcCartBuy : calcCartGift;
    const item = cart[index];
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    } else {
        // If increasing quantity in BUY cart, check for bonification
        if (type === 'buy' && delta > 0) {
            checkParamsBonification(item.id, item.name, item.price, item.qty);
        }
    }

    renderCalcList(type);
    calculateBonification();
}

function removeCalcItem(type, index) {
    const cart = type === 'buy' ? calcCartBuy : calcCartGift;
    cart.splice(index, 1);
    renderCalcList(type);
    calculateBonification();
}

function calculateBonification() {
    const totalPaid = calcCartBuy.reduce((sum, item) => sum + (item.price * (1 - item.discount / 100) * item.qty), 0);
    const totalQtyPaid = calcCartBuy.reduce((sum, item) => sum + item.qty, 0);
    const totalQtyGift = calcCartGift.reduce((sum, item) => sum + item.qty, 0);
    const totalQty = totalQtyPaid + totalQtyGift;

    // Calculate average price per box
    const avgPrice = totalQty > 0 ? totalPaid / totalQty : 0;

    // Update UI
    document.getElementById('bonResultPrice').textContent = avgPrice.toFixed(2) + ' €';
    document.getElementById('bonPaidQty').textContent = totalQtyPaid;
    document.getElementById('bonFreeQty').textContent = totalQtyGift;
    document.getElementById('bonResultTotal').textContent = totalPaid.toFixed(2) + '€';
    document.getElementById('calcTotalGift').textContent = totalQtyGift; // Added this line based on the instruction's implied change
}

function clearCalcCart(type) {
    if (type === 'buy') {
        calcCartBuy = [];
        renderCalcList('buy');
    } else if (type === 'gift') {
        calcCartGift = [];
        renderCalcList('gift');
    }
    calculateBonification();
}

function clearBonification() {
    calcCartBuy = [];
    calcCartGift = [];
    renderCalcList('buy');
    renderCalcList('gift');
    calculateBonification();
}

function filterCalcProducts() {
    const search = document.getElementById('calcProdSearch').value.toLowerCase();
    const products = document.querySelectorAll('#calcProdList > div');

    products.forEach(prod => {
        const text = prod.textContent.toLowerCase();
        if (text.includes(search)) {
            prod.style.display = 'flex';
        } else {
            prod.style.display = 'none';
        }
    });
}

// === VISUAL FEEDBACK ===
function showAddFeedback(type, productName) {
    const color = type === 'buy' ? '#4ade80' : '#fbbf24';
    const icon = type === 'buy' ? '🛒' : '🎁';

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(135deg, ${color}, ${color}dd);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        box-shadow: 0 8px 32px ${color}60;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
    `;
    feedback.innerHTML = `${icon} Agregado: ${productName}`;
    document.body.appendChild(feedback);

    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => feedback.remove(), 300);
    }, 1500);
}

// === EXPOSE FUNCTIONS TO WINDOW ===
window.toggleCalcProductSelection = toggleCalcProductSelection;
window.addToCalcCart = addToCalcCart;
window.addToGiftCart = addToGiftCart;
window.changeCalcQty = changeCalcQty;
window.changeCalcDiscount = changeCalcDiscount;
window.removeCalcItem = removeCalcItem;
window.clearCalcCart = clearCalcCart;
window.clearBonification = clearBonification;
window.filterCalcProducts = filterCalcProducts;
window.renderCalcList = renderCalcList;
window.loadCalcProducts = loadCalcProducts;


// === DISTANCE CALCULATION HELPER ===
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// === REMINDER MODAL FUNCTIONS ===
let currentPriority = "Media";

function openReminderModal() {
    const modal = document.getElementById('reminderModal');
    if (modal) {
        modal.classList.add('open');

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reminderDate').value = today;
    }
}

function closeReminderModal() {
    const modal = document.getElementById('reminderModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function selectPriority(priority) {
    currentPriority = priority;

    // Remove active class from all chips
    document.querySelectorAll('.p-chip').forEach(chip => {
        chip.classList.remove('active');
    });

    // Add active class to selected chip
    event.target.classList.add('active');
}

async function saveReminder() {
    const reminderText = document.getElementById('reminderText');
    const reminderDate = document.getElementById('reminderDate');
    const btnSaveReminder = document.getElementById('btnSaveReminder');

    const text = reminderText.value.trim();
    const date = reminderDate.value;

    if (!text) {
        alert('⚠️ Por favor escribe un recordatorio');
        return;
    }

    if (!date) {
        alert('⚠️ Por favor selecciona una fecha');
        return;
    }

    btnSaveReminder.innerHTML = '⏳ Guardando...';
    btnSaveReminder.disabled = true;

    // DIRECTLY SAVE LOCALLY (Notion Removed)
    saveLocally(text, date, currentPriority);

    // Reset button state
    btnSaveReminder.innerHTML = 'GUARDAR';
    btnSaveReminder.disabled = false;

    function saveLocally(text, date, priority) {
        const localReminders = JSON.parse(localStorage.getItem('offlineReminders') || '[]');
        localReminders.push({
            id: Date.now(),
            text: text,
            date: date,
            priority: priority,
            status: 'pending',
            synced: false
        });
        localStorage.setItem('offlineReminders', JSON.stringify(localReminders));

        // Use Alert because Toasts are disabled

        reminderText.value = '';
        closeReminderModal();
    }

    function handleSuccess() {
        reminderText.value = '';
        closeReminderModal();

        // Use Alert because Toasts are disabled
        alert(`✅ GUARDADO!\n\nTu recordatorio se ha guardado correctamente.`);

        triggerConfetti();

        // Reset priority to default
        currentPriority = "Media";
        document.querySelectorAll('.p-chip').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.p-chip')[1].classList.add('active');
    }
}

// === QUICK DATE LOGIC ===
function setQuickDate(offset) {
    const date = new Date();

    if (offset === 'nextMonday') {
        // Calculate days until next Monday
        const day = date.getDay();
        const diff = (day === 0 ? 1 : 8) - day; // If Sunday(0), +1. If Mon(1), +7. etc.
        date.setDate(date.getDate() + diff);
    } else {
        date.setDate(date.getDate() + offset);
    }

    // Format YYYY-MM-DD
    const isoDate = date.toISOString().split('T')[0];
    document.getElementById('reminderDate').value = isoDate;
}

// === PREMIUM CONFETTI EFFECT ===
function triggerConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;

    // Create canvas if not exists
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const particles = [];

    // Init particles
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2,
            life: Math.random() * 100 + 50
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.life > 0) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.life--;

                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                active = true;
            }
        });

        if (active) requestAnimationFrame(animate);
        else canvas.remove();
    }

    animate();
}

// === PREMIUM TOAST FUNCTION ===
function showToast(title, message, type = 'info') {
    // Ensure container exists
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Icons mapping
    const icons = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error: '<i class="fa-solid fa-circle-xmark"></i>',
        info: '<i class="fa-solid fa-circle-info"></i>'
    };

    // Create Toast Element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Play Sound (Optional, subtle click)
    // const audio = new Audio('path/to/sound.mp3'); audio.play().catch(()=>{});

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s forwards';
        toast.remove();
    }, 4000);
}

// === RADAR FUNCTIONALITY ===
function activateRadar() {
    const modal = document.getElementById('radarModal');
    const statusEl = document.getElementById('radarStatus');
    const listEl = document.getElementById('radarList');

    if (!modal) {
        alert('Error: Modal del RADAR no encontrado');
        return;
    }

    // Open modal
    modal.classList.add('open');

    // Check if geolocation is available
    if (!navigator.geolocation) {
        statusEl.innerHTML = '❌ Tu navegador no soporta geolocalización';
        listEl.innerHTML = '<div style="color:#ff4444; text-align:center; padding:20px;">Geolocalización no disponible en este dispositivo</div>';
        return;
    }

    statusEl.innerHTML = '🔍 Solicitando permisos de ubicación...';
    listEl.innerHTML = '';

    // Request location with high accuracy
    navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log('📍 Location acquired:', lat, lon);
            statusEl.innerHTML = '📡 Escaneando negocios cercanos...';

            // Get selected radius
            const radiusSelect = document.getElementById('radarRadius');
            const radiusKm = radiusSelect ? parseFloat(radiusSelect.value) : 0.5;

            // Get filter preference
            const filterOpen = document.getElementById('radarFilterOpen');
            const onlyOpen = filterOpen ? filterOpen.checked : true;

            // Scan for businesses
            scanNearbyBusinesses(lat, lon, radiusKm, onlyOpen);
        },
        // Error callback
        (error) => {
            console.error('Geolocation error:', error);

            let errorMsg = '';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = `
                        <div style="color:#ff4444; padding:20px; text-align:center;">
                            <h3 style="margin:0 0 15px 0;">🚫 GPS BLOQUEADO</h3>
                            <p style="margin:0 0 10px 0; font-size:0.9rem; line-height:1.5;">
                                Has denegado el permiso de ubicación.
                            </p>
                            <div style="background:rgba(255,255,255,0.1); padding:15px; border-radius:8px; margin-top:15px; text-align:left;">
                                <p style="margin:0 0 10px 0; font-weight:bold;">📱 Para activar en iPad/iPhone:</p>
                                <ol style="margin:0; padding-left:20px; font-size:0.85rem; line-height:1.6;">
                                    <li>Ve a <strong>Ajustes</strong> → <strong>Safari</strong></li>
                                    <li>Busca <strong>Ubicación</strong></li>
                                    <li>Selecciona <strong>"Preguntar" o "Permitir"</strong></li>
                                    <li>Recarga esta página</li>
                                </ol>
                            </div>
                            <p style="margin-top:15px; font-size:0.8rem; color:#aaa;">
                                💡 También puedes usar la búsqueda manual escribiendo el nombre de la ciudad
                            </p>
                        </div>
                    `;
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = '<div style="color:#ff4444; text-align:center; padding:20px;">📍 Ubicación no disponible. Verifica tu conexión GPS.</div>';
                    break;
                case error.TIMEOUT:
                    errorMsg = '<div style="color:#ff4444; text-align:center; padding:20px;">⏱️ Tiempo agotado. Intenta de nuevo.</div>';
                    break;
                default:
                    errorMsg = '<div style="color:#ff4444; text-align:center; padding:20px;">❌ Error desconocido al obtener ubicación.</div>';
            }

            statusEl.innerHTML = '';
            listEl.innerHTML = errorMsg;
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function closeRadarModal() {
    const modal = document.getElementById('radarModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Scan nearby businesses using Overpass API (OpenStreetMap)
// Shared function to fetch businesses from Overpass API
async function fetchNearbyPlaces(lat, lon, radiusKm, onlyOpen = false) {
    // Convert radius to meters
    const radiusM = radiusKm * 1000;

    // Overpass query for bars, restaurants, cafes
    const query = `
        [out:json][timeout:25];
        (
            node["amenity"~"bar|restaurant|cafe|pub"](around:${radiusM},${lat},${lon});
            way["amenity"~"bar|restaurant|cafe|pub"](around:${radiusM},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la API de Overpass');

    const data = await response.json();
    const elements = data.elements || [];

    // Filter and process results
    let businesses = elements
        .filter(el => el.tags && el.tags.name)
        .map(el => {
            const elLat = el.lat || (el.center ? el.center.lat : null);
            const elLon = el.lon || (el.center ? el.center.lon : null);

            if (!elLat || !elLon) return null;

            const distance = getDistanceFromLatLonInKm(lat, lon, elLat, elLon);

            return {
                name: el.tags.name,
                type: el.tags.amenity,
                address: el.tags['addr:street'] || '',
                phone: el.tags.phone || el.tags['contact:phone'] || '',
                opening_hours: el.tags.opening_hours || '',
                distance: distance,
                lat: elLat,
                lon: elLon
            };
        })
        .filter(b => b !== null);

    // Sort by distance
    businesses.sort((a, b) => a.distance - b.distance);

    // Filter by radius (double check)
    businesses = businesses.filter(b => b.distance <= radiusKm);

    // Check if open now (if filter is active)
    if (onlyOpen) {
        // Simple check - this could be improved with a proper library
        businesses = businesses.filter(b => {
            if (!b.opening_hours) return true; // Include if no hours specified
            return !b.opening_hours.toLowerCase().includes('closed');
        });
    }

    return businesses;
}

// Scan nearby businesses using Overpass API (OpenStreetMap)
async function scanNearbyBusinesses(lat, lon, radiusKm, onlyOpen) {
    const statusEl = document.getElementById('radarStatus');
    const listEl = document.getElementById('radarList');

    try {
        const businesses = await fetchNearbyPlaces(lat, lon, radiusKm, onlyOpen);

        // Display results
        if (businesses.length === 0) {
            statusEl.innerHTML = '🔍 No se encontraron negocios';
            listEl.innerHTML = `
                <div style="color:#aaa; text-align:center; padding:20px;">
                    <p>No hay bares o restaurantes en un radio de ${radiusKm}km</p>
                    <p style="font-size:0.8rem; margin-top:10px;">Prueba aumentando el radio de búsqueda</p>
                </div>
            `;
        } else {
            statusEl.innerHTML = `✅ ${businesses.length} negocio${businesses.length > 1 ? 's' : ''} encontrado${businesses.length > 1 ? 's' : ''}`;

            listEl.innerHTML = '';
            businesses.forEach(biz => {
                const card = document.createElement('div');
                card.style.cssText = 'background:rgba(255,255,255,0.05); border-radius:8px; padding:12px; border-left:3px solid #00ff88;';

                const distText = biz.distance < 1
                    ? `${(biz.distance * 1000).toFixed(0)}m`
                    : `${biz.distance.toFixed(2)}km`;

                const typeIcon = {
                    'bar': '🍺',
                    'restaurant': '🍽️',
                    'cafe': '☕',
                    'pub': '🍻'
                }[biz.type] || '🏪';

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:5px;">
                        <div style="flex:1;">
                            <div style="font-weight:bold; color:white; font-size:0.95rem;">${typeIcon} ${biz.name}</div>
                            ${biz.address ? `<div style="font-size:0.75rem; color:#aaa; margin-top:3px;">${biz.address}</div>` : ''}
                            ${biz.phone ? `<div style="font-size:0.75rem; color:#4ade80; margin-top:3px;">📞 ${biz.phone}</div>` : ''}
                        </div>
                        <div style="background:rgba(0,255,136,0.2); color:#00ff88; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; white-space:nowrap; margin-left:10px;">
                            ${distText}
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:10px;">
                        <a href="https://www.google.com/maps/search/?api=1&query=${biz.lat},${biz.lon}" target="_blank" 
                           style="flex:1; background:#3b82f6; color:white; padding:6px; border-radius:6px; text-align:center; text-decoration:none; font-size:0.8rem;">
                            🗺️ Ver Mapa
                        </a>
                        ${biz.phone ? `
                        <a href="tel:${biz.phone}" 
                           style="flex:1; background:#10b981; color:white; padding:6px; border-radius:6px; text-align:center; text-decoration:none; font-size:0.8rem;">
                            📞 Llamar
                        </a>
                        ` : ''}
                    </div>
                `;

                listEl.appendChild(card);
            });
        }

    } catch (error) {
        console.error('Error scanning businesses:', error);
        statusEl.innerHTML = '❌ Error al escanear';
        listEl.innerHTML = `
            <div style="color:#ff4444; text-align:center; padding:20px;">
                <p>Error al buscar negocios cercanos</p>
                <p style="font-size:0.8rem; margin-top:10px;">${error.message}</p>
            </div>
        `;
    }
}

// === CALCULATOR MODAL FUNCTIONS ===
// === CALCULATOR MODAL FUNCTIONS ===
function openCalculator() {
    console.log('Opening calculator...');
    const modal = document.getElementById('calculatorModal');
    if (modal) {
        modal.classList.add('open');
        console.log('Calculator modal class added: open');

        // Initialize after modal is displayed
        setTimeout(() => {
            // Initialize calculator display
            const display = document.getElementById('calcDisplay');
            if (display) {
                display.value = '0';
            }

            // Load products for bonification calculator
            loadCalcProducts();

            // Ensure basic tab is active by default
            switchCalcTab('basic');
        }, 10);
    } else {
        console.error('Calculator modal NOT found');
        alert('Error: Calculadora no encontrada. Recarga la página.');
    }
}

// Ensure global availability
window.openCalculator = openCalculator;


function closeCalculator() {
    const modal = document.getElementById('calculatorModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// === SEARCH AND NAVIGATION FUNCTIONS ===
// === SEARCH AND NAVIGATION FUNCTIONS ===
function searchNearMe() {
    // Check if running on local file - Geolocation often fails here
    if (window.location.protocol === 'file:') {
        alert('⚠️ IMPORTANTE: La geolocalización no suele funcionar en archivos locales (file://). Para probar esta función, necesitas subir la web a un servidor o usar "Live Server".');
    }

    if (!navigator.geolocation) {
        alert('❌ Tu navegador no soporta geolocalización');
        return;
    }

    const btn = document.querySelector('.btn-cerca');
    const originalText = btn ? btn.innerHTML : 'CERCA (100km)';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                // Use fetchNearbyPlaces with 5km radius (100km is too aggressive for browser)
                // We'll use 5km as a "reasonable" near me, even if button says 100km
                const businesses = await fetchNearbyPlaces(lat, lon, 5, false);
                displaySearchResults(businesses);
            } catch (error) {
                console.error('Search error:', error);
                alert('❌ Error al buscar negocios: ' + error.message);
            } finally {
                if (btn) btn.innerHTML = originalText;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            if (btn) btn.innerHTML = originalText;

            // Detailed error messages
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert('🚫 ACCESO DENEGADO\n\nNo has permitido el acceso a tu ubicación. Por favor:\n1. Ve a los ajustes del navegador.\n2. Permite la ubicación para este sitio.\n3. Inténtalo de nuevo.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('📍 UBICACIÓN NO DISPONIBLE\n\nNo se pudo determinar tu posición. Verifica que el GPS esté activo.');
                    break;
                case error.TIMEOUT:
                    alert('⏱️ TIEMPO AGOTADO\n\nLa búsqueda de GPS tardó demasiado. Inténtalo de nuevo en un lugar abierto.');
                    break;
                default:
                    alert('❌ OCURRIÓ UN ERROR\n\nNo se pudo obtener la ubicación. (Código: ' + error.code + ')');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

function displaySearchResults(venues) {
    const modal = document.getElementById('searchResultsModal');
    const venueList = document.getElementById('venueList');

    if (!modal || !venueList) return;

    // Ensure logic to open modal is here or called before
    modal.classList.add('open');

    if (venues.length === 0) {
        venueList.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No se encontraron locales cercanos (5km)</div>';
    } else {
        venueList.innerHTML = '';
        venues.forEach(venue => {
            // Reuse similar card style but adapted for list
            const distText = venue.distance < 1
                ? `${(venue.distance * 1000).toFixed(0)}m`
                : `${venue.distance.toFixed(2)}km`;

            const typeIcon = {
                'bar': '🍺',
                'restaurant': '🍽️',
                'cafe': '☕',
                'pub': '🍻'
            }[venue.type] || '🏪';

            const card = document.createElement('div');
            card.className = 'venue-card';
            card.style.cssText = `
                background: rgba(255,255,255,0.05);
                margin-bottom: 8px;
                padding: 12px;
                border-radius: 8px;
                border-left: 3px solid #00ff88;
                cursor: pointer;
            `;

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div style="flex:1;">
                        <div class="venue-name" style="font-weight:bold; color:white; font-size:1rem;">${typeIcon} ${venue.name}</div>
                        <div class="venue-address" style="color:#aaa; font-size:0.8rem; margin-top:4px;">${venue.address || 'Sin dirección'}</div>
                    </div>
                    <div style="text-align:right;">
                        <span style="background:rgba(0,255,136,0.1); color:#00ff88; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-weight:bold;">${distText}</span>
                    </div>
                </div>
                <div style="display:flex; gap:10px; margin-top:10px;">
                     <button onclick="event.stopPropagation(); window.open('https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lon}', '_blank')"
                        style="flex:1; background:#3b82f6; border:none; color:white; padding:6px; border-radius:4px; cursor:pointer; font-size:0.85rem;">
                        <i class="fa-solid fa-map"></i> Mapa
                    </button>
                    ${venue.phone ? `
                    <button onclick="event.stopPropagation(); window.location.href='tel:${venue.phone}'"
                        style="flex:1; background:#10b981; border:none; color:white; padding:6px; border-radius:4px; cursor:pointer; font-size:0.85rem;">
                        <i class="fa-solid fa-phone"></i> Llamar
                    </button>` : ''}
                </div>
            `;
            // Optional: Click card to see details if implemented
            // card.onclick = () => openModal(venue);
            venueList.appendChild(card);
        });
    }
}

function closeSearchResultsModal() {
    const modal = document.getElementById('searchResultsModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// === MODAL FUNCTIONS ===
function openChecklist() {
    const modal = document.getElementById('checklistModal');
    if (modal) {
        modal.classList.add('open');
    }
}

function closeChecklist() {
    const modal = document.getElementById('checklistModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function openFocusModal() {
    const modal = document.getElementById('focusModal');
    if (modal) {
        modal.classList.add('open');
    }
}

function closeFocusModal() {
    const modal = document.getElementById('focusModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function openDebtModal() {
    const modal = document.getElementById('debtModal');
    if (modal) {
        modal.classList.add('open');
        loadDebtData();
    }
}

function closeDebtModal() {
    const modal = document.getElementById('debtModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function openDistribuidoresModal() {
    const modal = document.getElementById('distribuidoresModal');
    if (modal) {
        modal.classList.add('open');
    }
}

function closeDistribuidoresModal() {
    const modal = document.getElementById('distribuidoresModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function openModal(venue) {
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    document.getElementById('modalTitle').textContent = venue.name || 'Detalle';
    document.getElementById('inputName').value = venue.name || '';
    document.getElementById('inputAddress').value = venue.address || '';
    document.getElementById('inputPhone').value = venue.phone || '';
    document.getElementById('inputEmail').value = venue.email || '';
    document.getElementById('inputNotes').value = venue.notes || '';

    // Update action buttons
    const btnCall = document.getElementById('btnCall');
    const btnEmail = document.getElementById('btnEmail');

    if (venue.phone) {
        btnCall.href = `tel:${venue.phone}`;
    }
    if (venue.email) {
        btnEmail.href = `mailto:${venue.email}`;
    }

    modal.classList.add('open');
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function saveToDebts() {
    const name = document.getElementById('inputName').value;
    const notes = document.getElementById('inputNotes').value;

    if (!name) {
        alert('⚠️ Por favor ingresa un nombre');
        return;
    }

    // Get existing debts
    const debts = JSON.parse(localStorage.getItem('debts') || '[]');

    // Add new debt
    debts.push({
        id: Date.now(),
        name: name,
        notes: notes,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    });

    // Save to localStorage
    localStorage.setItem('debts', JSON.stringify(debts));

    alert('✅ Guardado correctamente');
    closeModal();
}

// === DEBT MANAGEMENT ===
function loadDebtData() {
    const debtPad = document.getElementById('debtPad');
    if (!debtPad) return;

    const debts = JSON.parse(localStorage.getItem('debts') || '[]');

    if (debts.length === 0) {
        debtPad.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No hay notas guardadas</div>';
        return;
    }

    debtPad.innerHTML = '';
    debts.forEach((debt, index) => {
        const row = document.createElement('div');
        row.className = 'debt-row';
        row.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:bold; color:white;">${debt.name}</div>
                <div style="font-size:0.8rem; color:#aaa;">${debt.date}</div>
                <div style="font-size:0.85rem; color:#ccc; margin-top:5px;">${debt.notes || ''}</div>
            </div>
            <button onclick="deleteDebt(${index})" style="background:#ef4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        debtPad.appendChild(row);
    });
}

function addDebtRow() {
    const name = prompt('Nombre del cliente:');
    if (!name) return;

    const notes = prompt('Notas:');

    const debts = JSON.parse(localStorage.getItem('debts') || '[]');
    debts.push({
        id: Date.now(),
        name: name,
        notes: notes || '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    });

    localStorage.setItem('debts', JSON.stringify(debts));
    loadDebtData();

    // Show save indicator
    const indicator = document.getElementById('saveIndicatorDebt');
    if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }
}

function deleteDebt(index) {
    if (!confirm('¿Eliminar esta nota?')) return;

    const debts = JSON.parse(localStorage.getItem('debts') || '[]');
    debts.splice(index, 1);
    localStorage.setItem('debts', JSON.stringify(debts));
    loadDebtData();
}

// === PLANES/NOTES MODAL ===
function openPlanes() {
    const modal = document.getElementById('planesModal');
    if (modal) {
        modal.classList.add('open');
        loadPlanesData();
    }
}

function closePlanes() {
    const modal = document.getElementById('planesModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function loadPlanesData() {
    const content = document.getElementById('planesContent');
    if (!content) return;

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');

    if (notes.length === 0) {
        content.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No hay notas guardadas</div>';
        return;
    }

    content.innerHTML = '';
    notes.forEach((note, index) => {
        const row = document.createElement('div');
        row.className = 'debt-row';
        row.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:bold; color:white;">${note.title || 'Sin título'}</div>
                <div style="font-size:0.8rem; color:#aaa;">${note.date}</div>
                <div style="font-size:0.85rem; color:#ccc; margin-top:5px;">${note.content || ''}</div>
            </div>
            <button onclick="deleteNote(${index})" style="background:#ef4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        content.appendChild(row);
    });
}

function deleteNote(index) {
    if (!confirm('¿Eliminar esta nota?')) return;

    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadPlanesData();
}

// === ZOOM MODAL ===
function openZoomModal(imageSrc) {
    // Create zoom modal if it doesn't exist
    let zoomModal = document.getElementById('zoomModal');
    if (!zoomModal) {
        zoomModal = document.createElement('div');
        zoomModal.id = 'zoomModal';
        zoomModal.className = 'modal-overlay';
        zoomModal.innerHTML = `
            <div class="modal-content" style="max-width:90vw; max-height:90vh; padding:0;">
                <div class="modal-header">
                    <h2>Imagen</h2>
                    <button class="close-btn" onclick="closeZoomModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <img id="zoomImage" src="" style="width:100%; height:auto; border-radius:0 0 12px 12px;">
            </div>
        `;
        document.body.appendChild(zoomModal);
    }

    document.getElementById('zoomImage').src = imageSrc;
    zoomModal.classList.add('open');
}

function closeZoomModal() {
    const modal = document.getElementById('zoomModal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// === QR MODAL ===
function closeQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.classList.remove('open');
    }
}
