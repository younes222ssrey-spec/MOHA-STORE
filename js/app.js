const products = [
  {
    id: 1,
    name: '',
    category: 'women',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  },
  {
    id: 2,
    name: '',
    category: 'men',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  },
  {
    id: 3,
    name: '',
    category: 'shoes',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  },
  {
    id: 4,
    name: '',
    category: 'kids',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  },
  {
    id: 5,
    name: '',
    category: 'accessories',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  },
  {
    id: 6,
    name: '',
    category: 'women',
    price: '',
    rating: '',
    image: '',
    description: '',
    sizes: [],
    colors: [],
    isEmpty: true
  }
];

const cartKey = 'elegance-cart';
let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const counts = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  counts.forEach((element) => {
    element.textContent = totalItems;
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  const featured = products.slice(0, 3);
  container.innerHTML = featured.map((product) => `
    <article class="product-card ${product.isEmpty ? 'empty-product' : ''}">
      <div class="image-placeholder">سيظهر المنتج هنا عند إضافة الصورة</div>
      ${product.isEmpty ? '' : `
        <div class="product-body">
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span>${product.price} د.ج</span>
            <span class="rating">★ ${product.rating}</span>
          </div>
          <div class="hero-actions">
            <a href="product.html?id=${product.id}" class="btn btn-secondary">التفاصيل</a>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف للسلة</button>
          </div>
        </div>
      `}
    </article>
  `).join('');
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  const searchValue = document.getElementById('search-input')?.value.toLowerCase() || '';
  const categoryValue = document.getElementById('category-filter')?.value || 'all';
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue);
    const matchesCategory = categoryValue === 'all' || product.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  container.innerHTML = filtered.map((product) => `
    <article class="product-card ${product.isEmpty ? 'empty-product' : ''}">
      <div class="image-placeholder">سيظهر المنتج هنا عند إضافة الصورة</div>
      ${product.isEmpty ? '' : `
        <div class="product-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-meta">
            <span>${product.price} د.ج</span>
            <span class="rating">★ ${product.rating}</span>
          </div>
          <div class="hero-actions">
            <a href="product.html?id=${product.id}" class="btn btn-secondary">التفاصيل</a>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف للسلة</button>
          </div>
        </div>
      `}
    </article>
  `).join('');
}

function renderProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get('id'));
  if (!product) {
    container.innerHTML = '<p>لم يتم العثور على المنتج.</p>';
    return;
  }
  if (product.isEmpty) {
    container.innerHTML = `
      <div>
        <div class="image-placeholder large">سيظهر المنتج هنا عند إضافة الصورة</div>
      </div>
      <div>
        <p class="eyebrow">تفاصيل المنتج</p>
        <h1>منتج جديد</h1>
        <p>سيتم إضافة التفاصيل قريبًا.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div>
      <p class="eyebrow">تفاصيل المنتج</p>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <h2>${product.price} د.ج</h2>
      <p><strong>التقييم:</strong> ★ ${product.rating}</p>
      <p><strong>المقاسات:</strong></p>
      <div class="size-options">
        ${product.sizes.map((size) => `<button>${size}</button>`).join('')}
      </div>
      <p><strong>الألوان:</strong></p>
      <div class="color-options">
        ${product.colors.map((color) => `<button>${color}</button>`).join('')}
      </div>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="addToCart(${product.id})">اشتر الآن</button>
      </div>
    </div>
  `;
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  showToast(`تمت إضافة ${product.name} إلى السلة`);
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<p>السلة فارغة الآن.</p>';
    updateTotals();
    return;
  }
  container.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div style="flex:1;">
        <h3>${item.name}</h3>
        <p>${item.price} د.ج</p>
        <div class="qty-controls">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">حذف</button>
      </div>
    </article>
  `).join('');
  updateTotals();
}

function changeQuantity(productId, delta) {
  cart = cart
    .map((item) => item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
    .filter((item) => item.quantity > 0);
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} د.ج`;
  if (totalEl) totalEl.textContent = `${subtotal.toFixed(2)} د.ج`;
  const checkoutTotal = document.getElementById('checkout-total');
  if (checkoutTotal) checkoutTotal.textContent = `${subtotal.toFixed(2)} د.ج`;
  const checkoutItems = document.getElementById('checkout-items');
  if (checkoutItems) {
    checkoutItems.innerHTML = cart.map((item) => `<div class="summary-row"><span>${item.name} × ${item.quantity}</span><strong>${item.price * item.quantity} د.ج</strong></div>`).join('');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('elegance-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  const button = document.getElementById('theme-toggle');
  if (button) button.textContent = document.body.classList.contains('dark') ? '☀' : '◐';
}

function initTheme() {
  const savedTheme = localStorage.getItem('elegance-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  const button = document.getElementById('theme-toggle');
  if (button) button.textContent = document.body.classList.contains('dark') ? '☀' : '◐';
}

function initAuth() {
  const form = document.getElementById('auth-form');
  const message = document.getElementById('auth-message');
  if (!form || !message) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    if (!email.includes('@') || password.length < 6) {
      message.textContent = 'يرجى إدخال بريد إلكتروني صالح وكلمة مرور لا تقل عن 6 أحرف.';
      return;
    }
    message.textContent = 'تم تسجيل الدخول بنجاح!';
  });
}

function initCheckout() {
  const form = document.getElementById('checkout-form');
  const message = document.getElementById('checkout-message');
  if (!form || !message) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = 'تم تأكيد الطلب بنجاح!';
    cart = [];
    saveCart();
    renderCart();
  });
}

function initPage() {
  initTheme();
  updateCartCount();
  renderFeaturedProducts();
  renderProducts();
  renderProductDetail();
  renderCart();
  updateTotals();
  initAuth();
  initCheckout();
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('search-input')?.addEventListener('input', renderProducts);
  document.getElementById('category-filter')?.addEventListener('change', renderProducts);
}

window.addEventListener('DOMContentLoaded', initPage);
window.addEventListener('storage', () => {
  cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  updateCartCount();
  renderCart();
});
