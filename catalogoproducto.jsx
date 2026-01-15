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

  .products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 640px) {
    .products-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .products-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (min-width: 1280px) {
    .products-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .product-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: all 0.3s;
  }

  .product-card:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    transform: translateY(-4px);
  }

  .product-header {
    background: linear-gradient(90deg, #2563eb 0%, #4f46e5 100%);
    color: white;
    padding: 16px;
  }

  .product-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .product-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .product-category {
    font-size: 12px;
    color: #bfdbfe;
  }

  .product-icon {
    font-size: 32px;
    margin-left: 8px;
  }

  .product-envase {
    font-size: 12px;
    color: #bfdbfe;
  }

  .product-body {
    padding: 16px;
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
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
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
    background: #eff6ff;
    border: 2px solid #3b82f6;
    border-radius: 10px;
    padding: 14px;
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
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function ProductDiscountApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [discount, setDiscount] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['todos', ...new Set(PRODUCTS_DATA.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS_DATA.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const calculatePrice = (price, discountPercent) => {
    if (!discountPercent || discountPercent === '') return { final: price, saved: 0 };
    const discountAmount = (price * parseFloat(discountPercent)) / 100;
    return { final: price - discountAmount, saved: discountAmount };
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

            <div className="results-info">
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

                return (
                  <div key={product.id} className="product-card">
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
      </div>
    </>
  );
}