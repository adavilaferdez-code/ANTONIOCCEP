import React, { useState, useMemo } from 'react';

// ============================================
// DATOS DE PRODUCTOS
// ============================================
const PRODUCTS_DATA = [
  // 1. COCA-COLA (All)
  { id: 1, name: 'COCA-COLA', category: 'Vidrio Rellenable 23,7cl', price: 25.44, envase: '24 botellas', icon: '🥤' },
  { id: 2, name: 'CC LIGHT / CC ZERO', category: 'Vidrio Rellenable 23,7cl', price: 25.44, envase: '24 botellas', icon: '🥤' },
  { id: 16, name: 'COCA-COLA / CC ZERO / CC LIGHT', category: 'VNR 1 LIT.', price: 18.66, envase: '12 botellas', icon: '🥤' },
  { id: 17, name: 'COCA-COLA', category: 'Vidrio Rellenable 35cl', price: 29.28, envase: '12 botellas', icon: '🥤' },
  { id: 18, name: 'COCA-COLA LIGHT / CC ZERO / CCZZ', category: 'Vidrio Rellenable 35cl', price: 29.28, envase: '12 botellas', icon: '🥤' },
  { id: 29, name: 'COCA-COLA', category: 'Lata 33cl', price: 39.36, envase: '24 latas', icon: '🥤' },
  { id: 30, name: 'CCL / CCZ / CCZZ / CCSC / CCLSC', category: 'Lata 33cl', price: 39.36, envase: '24 latas', icon: '🥤' },
  { id: 34, name: 'COCA-COLA VR 350', category: 'Vidrio 350ml', price: 29.28, envase: '12 botellas', icon: '🥤' },
  { id: 39, name: 'CC REGULAR / CCZ / CCZZ / CCL / CCSC', category: 'PET 2,0 Lts', price: 28.68, envase: '6 botellas', icon: '🥤' },

  // 2. FANTA (All)
  { id: 3, name: 'FANTA NARANJA', category: 'Vidrio Rellenable 23,7cl', price: 25.44, envase: '24 botellas', icon: '🍊' },
  { id: 4, name: 'FANTA LIMÓN', category: 'Vidrio Rellenable 23,7cl', price: 25.44, envase: '24 botellas', icon: '🍋' },
  { id: 19, name: 'FANTA NARANJA', category: 'Vidrio Rellenable 35cl', price: 29.28, envase: '12 botellas', icon: '🍊' },
  { id: 20, name: 'FANTA LIMÓN', category: 'Vidrio Rellenable 35cl', price: 29.28, envase: '12 botellas', icon: '🍋' },
  { id: 31, name: 'FANTA', category: 'Lata 33cl', price: 37.68, envase: '24 latas', icon: '🍊' },
  { id: 40, name: 'FANTA NARANJA / LIMÓN (6 ud)', category: 'PET 2,0 Lts', price: 27.06, envase: '6 botellas', icon: '🍊' },

  // 3. AQUARIUS (All)
  { id: 22, name: 'AQUARIUS', category: 'Vidrio Rellenable 30cl', price: 35.04, envase: '24 botellas', icon: '🏃' },
  { id: 33, name: 'AQUARIUS / AQUARIUS LIBRE / VIVE', category: 'Lata 33cl', price: 41.04, envase: '24 latas', icon: '🏃' },
  { id: 37, name: 'AQUARIUS (6 uds.)', category: 'PET 1,5L', price: 23.52, envase: '6 botellas', icon: '🏃' },

  // 4. FUZE TEA (All)
  { id: 23, name: 'FUZE TEA', category: 'Vidrio Rellenable 30cl', price: 33.12, envase: '24 botellas', icon: '🍵' },
  { id: 32, name: 'FUZE TEA', category: 'Vidrio 30cl', price: 33.12, envase: '24 botellas', icon: '🍵' },
  { id: 34, name: 'FUZE TEA', category: 'Lata 33cl', price: 39.60, envase: '24 latas', icon: '🍵' },
  { id: 38, name: 'FUZE TEA (6 uds.)', category: 'PET 1,5L', price: 21.54, envase: '6 botellas', icon: '🍵' },

  // 5. RESTO
  { id: 5, name: 'SPRITE', category: 'Vidrio Rellenable 23,7cl', price: 24.96, envase: '24 botellas', icon: '🍋' },
  { id: 21, name: 'SPRITE', category: 'Vidrio Rellenable 35cl', price: 29.28, envase: '12 botellas', icon: '🍋' },
  { id: 32, name: 'SPRITE', category: 'Lata 33cl', price: 37.68, envase: '24 latas', icon: '🍋' },
  { id: 41, name: 'SPRITE (6 ud) / SPRITE ZERO', category: 'PET 2,0 Lts', price: 27.06, envase: '6 botellas', icon: '🍋' },

  { id: 6, name: 'ROYAL BLISS TON, CREATIV, YUZ, ZER Y BERRY', category: 'Vidrio Rellenable 20cl', price: 31.92, envase: '24 botellas', icon: '🍸' },
  { id: 7, name: 'ROYAL BLISS CÍTRICOS', category: 'Vidrio Rellenable 20cl', price: 28.80, envase: '24 botellas', icon: '🍸' },
  { id: 8, name: 'NORDIC MIST TÓNICA', category: 'Vidrio Rellenable 20cl', price: 30.96, envase: '24 botellas', icon: '🍸' },
  { id: 9, name: 'NORDIC MIST TÓNICA BLUE/ROSE', category: 'Vidrio Rellenable 20cl', price: 30.96, envase: '24 botellas', icon: '🍸' },
  { id: 10, name: 'ROYAL BLISS TÓNICAS', category: 'Vidrio No Rellenable 20cl', price: 36.72, envase: '24 botellas', icon: '🍸' },
  { id: 11, name: 'ROYAL BLISS SODA', category: 'Vidrio No Rellenable 20cl', price: 36.72, envase: '24 botellas', icon: '🍸' },
  { id: 12, name: 'ROYAL BLISS GINGER ALE', category: 'Vidrio No Rellenable 20cl', price: 36.72, envase: '24 botellas', icon: '🍸' },
  { id: 26, name: 'ROYAL BLISS', category: 'Lata 25cl Slim', price: 15.48, envase: '24 latas', icon: '🍸' },
  { id: 27, name: 'TÓNICA NORDIC Y ZERO', category: 'Lata 25cl Sleek', price: 33.60, envase: '24 latas', icon: '🍸' },

  { id: 24, name: 'MONSTER ENERGY / ULTRA', category: 'Lata 25cl', price: 44.40, envase: '24 latas', icon: '⚡' },
  { id: 28, name: 'MONSTER ENERGY / ULTRA', category: 'Lata 355 ML', price: 24.96, envase: '12 latas', icon: '⚡' },
  { id: 33, name: 'MONSTER ENERGY', category: 'Lata 25cl', price: 44.40, envase: '24 latas', icon: '⚡' },
  { id: 36, name: 'MONSTER ENERGY / REHAB / RIPPER / ULTRA', category: 'Lata 50cl', price: 56.16, envase: '12 latas', icon: '⚡' },

  { id: 25, name: 'BURN / BURN ZERO', category: 'Lata 25cl', price: 58.80, envase: '24 latas', icon: '🔥' },
  { id: 35, name: 'BURN / BURN ZERO', category: 'Lata 50cl', price: 36.48, envase: '12 latas', icon: '🔥' },

  { id: 13, name: 'MARE ROSSO', category: 'Vidrio No Rellenable 20cl', price: 36.72, envase: '24 botellas', icon: '🍷' },
  { id: 14, name: 'APPELTISER', category: 'VNR 0,275 Lit.', price: 32.88, envase: '24 botellas', icon: '🍎' },
  { id: 15, name: 'APPELTISER', category: 'VNR 0,75 Lit.', price: 16.14, envase: '12 botellas', icon: '🍎' },
  { id: 42, name: 'MINUTE MAID SELECCIÓN', category: 'Zumos 200 S/R', price: 38.16, envase: '27 briks', icon: '🧃' },
  { id: 43, name: 'MINUTE MAID L&N / N&N', category: 'Zumos 200 S/R', price: 38.16, envase: '27 briks', icon: '🧃' },
  { id: 44, name: 'M. MAID LIMÓN&NADA', category: 'PET 1 LITRO', price: 24.48, envase: '12 botellas', icon: '🧃' },

  { id: 45, name: 'AQUABONA SINGULAR CON GAS', category: 'Aguas VR 365', price: 24.00, envase: '20 botellas', icon: '💧' },
  { id: 46, name: 'AQUABONA', category: 'Aguas Ret. 500cc', price: 20.20, envase: '20 botellas', icon: '💧' },
  { id: 47, name: 'AQUABONA', category: 'Aguas Ret. Litro', price: 19.32, envase: '12 botellas', icon: '💧' },
  { id: 48, name: 'AQUABONA', category: 'Aguas PET 35CL', price: 17.76, envase: '24 botellas', icon: '💧' },
  { id: 49, name: 'AQUABONA', category: 'Aguas PET 50CL', price: 20.64, envase: '24 botellas', icon: '💧' },
  { id: 50, name: 'AQUABONA SINGULAR CON GAS', category: 'Aguas PET 50CL', price: 11.00, envase: '6 botellas', icon: '💧' },
  { id: 51, name: 'AQUABONA', category: 'Aguas PET 1,5L', price: 9.30, envase: '6 botellas', icon: '💧' },
  { id: 52, name: 'VILAS DEL TURBÓN', category: 'Aguas VNR 33CL', price: 27.36, envase: '24 botellas', icon: '💧' },
  { id: 53, name: 'VILAS DEL TURBÓN', category: 'Aguas VNR 75CL', price: 12.30, envase: '6 botellas', icon: '💧' },
];

// ============================================
// ESTILOS CSS
// ============================================
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .app-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 50%, #fce7f3 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .header {
    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    color: white;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    padding: 24px 16px;
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;
  }

  .header-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #bfdbfe;
    font-size: 16px;
  }

  .main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  .search-panel {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 24px;
    margin-bottom: 24px;
  }

  .search-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (min-width: 768px) {
    .search-grid { grid-template-columns: 2fr 1fr; }
  }

  .search-input, .discount-input, .select-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s;
    outline: none;
  }

  .search-input:focus, .select-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .discount-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .filters-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .filters-grid { grid-template-columns: 1fr 1fr; }
  }

  .results-info {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;
  }

  .results-badge {
    padding: 4px 12px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 8px;
    font-weight: bold;
  }

  /* ===== PRODUCT GRID - ENHANCED ===== */
  .products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 640px) {
    .products-grid { 
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  }

  @media (min-width: 1024px) {
    .products-grid { 
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
  }

  @media (min-width: 1280px) {
    .products-grid { 
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
    }
  }

  /* ===== PRODUCT CARD - PREMIUM REDESIGN ===== */
  .product-card {
    background: white;
    border-radius: 16px;
    box-shadow: 
      0 4px 12px rgba(0,0,0,0.08),
      0 2px 4px rgba(0,0,0,0.04);
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .product-card:hover {
    box-shadow: 
      0 12px 30px rgba(0,0,0,0.15),
      0 6px 12px rgba(0,0,0,0.1);
    transform: translateY(-8px) scale(1.02);
    border-color: #3b82f6;
  }

  .product-card:hover::before {
    opacity: 1;
  }

  /* ===== PRODUCT HEADER WITH LOGO BACKGROUND ===== */
  .product-header {
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
    color: white;
    padding: 20px 16px;
    position: relative;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  /* Brand Logo Backgrounds */
  .product-header::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 100px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.15;
    transition: all 0.4s;
  }

  .product-card:hover .product-header::after {
    opacity: 0.25;
    transform: translateY(-50%) scale(1.1);
  }

  /* Specific brand logo backgrounds */
  .logo-cocacola .product-header::after {
    background-image: url('cocacola_logo.jpg');
    width: 120px;
    height: 120px;
  }

  .logo-fanta .product-header::after {
    background-image: url('fanta_logo.jpg');
  }

  .logo-sprite .product-header::after {
    background-image: url('sprite_logo.jpg');
  }

  .logo-aquarius .product-header::after {
    background-image: url('aquarius_logo.png');
  }

  .logo-fuzetea .product-header::after {
    background-image: url('fuzetea_logo.jpg');
  }

  .logo-monster .product-header::after {
    background-image: url('monster_logo.jpg');
  }

  .logo-aquabona .product-header::after {
    background-image: url('aquabona_logo.png');
  }

  .logo-royalbliss .product-header::after {
    background-image: url('royalbliss_logo.png');
  }

  .product-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
  }

  .product-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .product-category {
    font-size: 12px;
    color: #bfdbfe;
  }

  .product-icon {
    font-size: 36px;
    margin-left: 8px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    transition: transform 0.3s;
  }

  .product-card:hover .product-icon {
    transform: scale(1.15) rotate(5deg);
  }

  .product-envase {
    font-size: 12px;
    color: #dbeafe;
    position: relative;
    z-index: 1;
  }

  .product-body {
    padding: 18px 16px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .price-label {
    font-size: 14px;
    color: #6b7280;
  }

  .price-original {
    font-weight: bold;
    font-size: 24px;
    color: #111827;
  }

  .price-striked {
    font-weight: bold;
    font-size: 18px;
    color: #9ca3af;
    text-decoration: line-through;
  }

  .discount-box {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .discount-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .discount-label {
    color: #15803d;
    font-weight: 600;
  }

  .discount-amount {
    color: #15803d;
    font-weight: bold;
  }

  .final-price-box {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 2px solid #3b82f6;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .final-price-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .final-price-label {
    color: #1e3a8a;
    font-weight: bold;
    font-size: 14px;
  }

  .final-price-value {
    color: #2563eb;
    font-weight: bold;
    font-size: 28px;
  }

  .empty-state {
    text-align: center;
    padding: 64px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .empty-icon {
    font-size: 80px;
    margin-bottom: 16px;
  }

  .empty-title {
    color: #6b7280;
    font-size: 20px;
    font-weight: 600;
  }

  .empty-subtitle {
    color: #9ca3af;
    font-size: 14px;
    margin-top: 8px;
  }

  /* ===== QUICK ADD BUTTON ===== */
  .quick-add-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: white;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition: all 0.3s;
    z-index: 10;
  }

  .quick-add-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  }

  /* ===== FLOATING CART ===== */
  .floating-cart {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    min-width: 280px;
    z-index: 1000;
  }

  .cart-header {
    font-size: 18px;
    font-weight: bold;
    color: #1e293b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cart-count {
    background: #3b82f6;
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
  }

  .cart-total {
    font-size: 24px;
    font-weight: bold;
    color: #2563eb;
    margin: 12px 0;
  }

  .cart-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 12px;
  }

  .cart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .clear-cart-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  /* ===== MOBILE OPTIMIZATIONS ===== */
  @media (max-width: 639px) {
    .header-title {
      font-size: 24px;
    }

    .header-subtitle {
      font-size: 14px;
    }

    .search-panel {
      padding: 16px;
    }

    .product-card {
      border-radius: 12px;
    }

    .product-header {
      padding: 16px;
      min-height: 100px;
    }

    .product-title {
      font-size: 14px;
    }

    .product-icon {
      font-size: 28px;
    }

    .product-body {
      padding: 14px;
    }

    .price-original {
      font-size: 20px;
    }

    .final-price-value {
      font-size: 24px;
    }
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function ProductDiscountApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [discount, setDiscount] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);
  const [quickFilter, setQuickFilter] = useState('all');

  const categories = ['todos', ...new Set(PRODUCTS_DATA.map(p => p.category))];

  // Quick filter categories
  const quickFilters = [
    { id: 'all', label: '📦 Todos', icon: '📦' },
    { id: 'cocacola', label: '🥤 Coca-Cola', icon: '🥤' },
    { id: 'fanta', label: '🍊 Fanta', icon: '🍊' },
    { id: 'sprite', label: '🍋 Sprite', icon: '🍋' },
    { id: 'aquarius', label: '🏃 Aquarius', icon: '🏃' },
    { id: 'fuzetea', label: '🍵 Fuze Tea', icon: '🍵' },
    { id: 'monster', label: '⚡ Monster', icon: '⚡' },
    { id: 'agua', label: '💧 Agua', icon: '💧' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS_DATA.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;

      // Quick filter logic
      let matchesQuickFilter = true;
      if (quickFilter !== 'all') {
        const name = product.name.toLowerCase();
        if (quickFilter === 'cocacola') matchesQuickFilter = name.includes('coca') || name.includes('cc');
        else if (quickFilter === 'fanta') matchesQuickFilter = name.includes('fanta');
        else if (quickFilter === 'sprite') matchesQuickFilter = name.includes('sprite');
        else if (quickFilter === 'aquarius') matchesQuickFilter = name.includes('aquarius');
        else if (quickFilter === 'fuzetea') matchesQuickFilter = name.includes('fuze');
        else if (quickFilter === 'monster') matchesQuickFilter = name.includes('monster');
        else if (quickFilter === 'agua') matchesQuickFilter = name.includes('aquabona') || name.includes('vilas');
      }

      return matchesSearch && matchesCategory && matchesQuickFilter;
    });

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, quickFilter]);

  const calculatePrice = (price, discountPercent) => {
    if (!discountPercent || discountPercent === '') return { final: price, saved: 0 };
    const discountAmount = (price * parseFloat(discountPercent)) / 100;
    return { final: price - discountAmount, saved: discountAmount };
  };

  const getLogoClass = (productName) => {
    const name = productName.toUpperCase();
    if (name.includes('COCA') || name.includes('CC')) return 'logo-cocacola';
    if (name.includes('FANTA')) return 'logo-fanta';
    if (name.includes('SPRITE')) return 'logo-sprite';
    if (name.includes('AQUARIUS')) return 'logo-aquarius';
    if (name.includes('FUZE')) return 'logo-fuzetea';
    if (name.includes('MONSTER')) return 'logo-monster';
    if (name.includes('AQUABONA') || name.includes('VILAS')) return 'logo-aquabona';
    if (name.includes('ROYAL') || name.includes('NORDIC')) return 'logo-royalbliss';
    return '';
  };

  // Quick Add to cart
  const quickAddToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Show success toast
    if (window.showSuccess) {
      window.showSuccess('Añadido al carrito', `${product.name} (${product.envase})`, 2000);
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // SOLUCION DEFINITIVA - Email con ASCII puro para Edge
  const enviarPorEmail = () => {
    if (cart.length === 0) {
      if (window.showWarning) {
        window.showWarning('Carrito vacio', 'Anade productos antes de enviar');
      }
      return;
    }

    // Fecha actual
    const hoy = new Date();
    const fecha = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();

    // Asunto - SIN emojis
    const asunto = 'Propuesta de Pedido - ' + fecha;

    // Cuerpo usando %0D%0A (Edge-compatible) y SOLO ASCII
    let cuerpo = 'Hola,%0D%0A%0D%0A';
    cuerpo += 'Adjunto te envio la propuesta de precios y pedido que hemos revisado:%0D%0A%0D%0A';

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      const descuento = Math.round((1 - item.price / item.precioOriginal) * 100);

      // SIN emojis, usar simbolos ASCII simples
      cuerpo += '?? ' + item.quantity + 'x ' + item.name + ' (' + item.envase + ')%0D%0A';
      cuerpo += '?? Dto: ' + descuento + '% (Antes: EUR' + item.precioOriginal.toFixed(2) + ')%0D%0A';
      cuerpo += '? Precio Neto: EUR' + item.price.toFixed(2) + ' / caja%0D%0A';
      cuerpo += 'Subtotal: EUR' + subtotal.toFixed(2) + '%0D%0A';
      cuerpo += '-------------------------------%0D%0A';
    });

    cuerpo += '%0D%0A';
    cuerpo += '?? TOTAL ESTIMADO: EUR' + cartTotal.toFixed(2) + '%0D%0A';
    cuerpo += '%0D%0A';
    cuerpo += 'Quedo a tu disposicion para cualquier consulta.%0D%0A%0D%0A';
    cuerpo += 'Saludos cordiales';

    // Construir mailto - NO usar encodeURIComponent en el cuerpo completo
    const mailto = 'mailto:?subject=' + encodeURIComponent(asunto) + '&body=' + cuerpo;

    // Abrir cliente de correo
    window.location.href = mailto;

    // Limpiar carrito después de enviar
    setTimeout(() => {
      setCart([]);
      if (window.showSuccess) {
        window.showSuccess('Email abierto', 'Carrito limpiado');
      }
    }, 1000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* HEADER */}
        <header className="header">
          <div className="header-content">
            <h1 className="header-title">📦 Catálogo de Productos</h1>
            <p className="header-subtitle">Calcula descuentos al instante</p>
          </div>
        </header>

        {/* CONTROLES */}
        <div className="main-content">
          <div className="search-panel">
            <div className="search-grid">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Buscar productos... (ej: Coca-Cola, Fanta, Sprite)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <input
                type="number"
                className="discount-input"
                placeholder="% Descuento"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="filters-grid">
              <select
                className="select-input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="todos">📦 Todas las categorías</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="select-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">🔤 Ordenar por nombre</option>
                <option value="price-asc">💰 Precio: menor a mayor</option>
                <option value="price-desc">💎 Precio: mayor a menor</option>
              </select>
            </div>

            {/* QUICK FILTER PILLS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {quickFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setQuickFilter(filter.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: quickFilter === filter.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    background: quickFilter === filter.id ? '#eff6ff' : 'white',
                    color: quickFilter === filter.id ? '#1e40af' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: quickFilter === filter.id ? '600' : '400',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{filter.icon}</span>
                  {filter.label.replace(filter.icon + ' ', '')}
                </button>
              ))}
            </div>

            <div className="results-info"
            >
              <span style={{ fontWeight: 600 }}>Mostrando</span>
              <span className="results-badge">{filteredProducts.length}</span>
              <span>de {PRODUCTS_DATA.length} productos</span>
            </div>
          </div>

          {/* PRODUCTOS */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const calc = calculatePrice(product.price, discount);
                const hasDiscount = discount && parseFloat(discount) > 0;
                const logoClass = getLogoClass(product.name);

                return (
                  <div key={product.id} className={`product-card ${logoClass}`} style={{ position: 'relative' }}>
                    {/* QUICK ADD BUTTON */}
                    <button
                      className="quick-add-btn"
                      onClick={() => quickAddToCart({ ...product, price: calc.final, precioOriginal: product.price })}
                      title="Añadir al carrito"
                    >
                      +
                    </button>

                    <div className="product-header">
                      <div className="product-header-flex">
                        <div style={{ flex: 1 }}>
                          <h3 className="product-title">{product.name}</h3>
                          <p className="product-category">{product.category}</p>
                        </div>
                        <span className="product-icon">{product.icon}</span>
                      </div>
                      <p className="product-envase">📦 {product.envase}</p>
                    </div>

                    <div className="product-body">
                      <div className="price-row">
                        <span className="price-label">Precio base:</span>
                        <span className={hasDiscount ? 'price-striked' : 'price-original'}>
                          €{product.price.toFixed(2)}
                        </span>
                      </div>

                      {hasDiscount && (
                        <>
                          <div className="discount-box">
                            <div className="discount-flex">
                              <span className="discount-label">
                                📉 Descuento {discount}%
                              </span>
                              <span className="discount-amount">-€{calc.saved.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="final-price-box">
                            <div className="final-price-flex">
                              <span className="final-price-label">PRECIO FINAL</span>
                              <span className="final-price-value">€{calc.final.toFixed(2)}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p className="empty-title">No se encontraron productos</p>
              <p className="empty-subtitle">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>

        {/* FLOATING CART */}
        {cart.length > 0 && (
          <div className="floating-cart">
            <div className="cart-header">
              Carrito <span className="cart-count">{cart.length}</span>
            </div>
            <div className="cart-total">EUR{cartTotal.toFixed(2)}</div>
            <button className="cart-btn" onClick={enviarPorEmail}>
              Enviar por Email
            </button>
            <button className="cart-btn clear-cart-btn" onClick={clearCart}>
              Limpiar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}