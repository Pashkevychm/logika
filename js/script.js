const products = [
    { id: 1, type: "phone", name: "iPhone 13", image: "img/Frame 612.png", description: "Смартфон iPhone 13 з OLED-дисплеєм.", price: 12000 },
    { id: 2, type: "laptop", name: "MacBook Air", image: "img/Frame 604.png", description: "Легкий ноутбук MacBook Air з процесором M1.", price: 23000 },
    { id: 3, type: "accessory", name: "Gammaxx L240 ARGB", image: "img/gammaxx-l240-argb-1-500x500 1.png", description: "Рідинне охолодження DeepCool Gammaxx L240 ARGB.", price: 40000 },
    { id: 4, type: "monitor", name: "G27CQ4 Monitor", image: "img/g27cq4-500x500 1.png", description: "27-дюймовий вигнутий геймерський монітор 165Hz.", price: 44999 },
    { id: 5, type: "accessory", name: "GP11 PRD3 Mouse", image: "img/GP11_PRD3 1.png", description: "Геймерська миша GP11 PRD3 з RGB.", price: 1000 },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =======================
// ФУНКЦІЇ КОШИКА
// =======================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id) {
    let found = cart.find(item => item.id === id);
    if (found) {
        found.count++;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, count: 1 });
    }
    saveCart();
    alert("Товар додано в кошик!");
}

function updateCount(id, value) {
    let item = cart.find(p => p.id === id);
    item.count = Number(value);
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) {
        const totalCount = cart.reduce((sum, p) => sum + p.count, 0);
        countEl.textContent = totalCount;
    }
}

// =======================
// РЕНДЕР ТОВАРІВ
// =======================
function renderProducts(items) {
    const container = document.querySelector(".products-div");
    if (!container) return;
    container.innerHTML = "";
    items.forEach(item => {
        container.innerHTML += `
            <div class="product">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p><strong>${item.price} грн</strong></p>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn" onclick="addToCart(${item.id})">До кошику</button>
                    <button class="btn btn-info" onclick="alert('${item.description}')">Деталі</button>
                </div>
            </div>
        `;
    });
}

// Фільтри та сортування
function applyFilters() {
    let filtered = [...products];
    const type = document.getElementById("filterType").value;
    const sort = document.getElementById("sortPrice").value;
    const search = document.getElementById("searchInput").value.toLowerCase();

    if (type !== "all") filtered = filtered.filter(p => p.type === type);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
    if (sort === "asc") filtered.sort((a,b) => a.price - b.price);
    if (sort === "desc") filtered.sort((a,b) => b.price - a.price);

    renderProducts(filtered);
}

// =======================
// РЕНДЕР КОШИКА
// =======================
function renderCart() {
    const cartBox = document.querySelector("#cart-container");
    const totalBox = document.querySelector("#total");
    if (!cartBox) return;

    if (cart.length === 0) {
        cartBox.innerHTML = "<p>Кошик порожній.</p>";
        totalBox.textContent = 0;
        return;
    }

    cartBox.innerHTML = "";
    cart.forEach(item => {
        cartBox.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div style="flex-grow:1;">
                    <h5>${item.name}</h5>
                    <p><strong>${item.price} грн</strong></p>
                </div>
                <div>
                    <button class="btn btn-secondary btn-sm" onclick="updateCount(${item.id}, ${item.count - 1})">-</button>
                    <input type="number" min="1" value="${item.count}" class="quantity" onchange="updateCount(${item.id}, this.value)">
                    <button class="btn btn-secondary btn-sm" onclick="updateCount(${item.id}, ${item.count + 1})">+</button>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">✖</button>
                </div>
            </div>
        `;
    });

    totalBox.textContent = cart.reduce((sum,p) => sum + p.price*p.count, 0);
    updateCartCount();
}

// =======================
// Автозапуск
// =======================
renderProducts(products);
renderCart();

// Фільтри та пошук
document.getElementById("filterType").addEventListener("change", applyFilters);
document.getElementById("sortPrice").addEventListener("change", applyFilters);
document.getElementById("searchBtn").addEventListener("click", applyFilters);
