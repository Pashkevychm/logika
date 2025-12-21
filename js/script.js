const products = [
    { id: 1, type: "accessory", name: "Клавіатура", image: "img/Frame 612.png", description: "OLED дисплей, A15 Bionic", price: 12000, discount: 0.1, views: 5 },
    { id: 2, type: "phone", name: "Samsung Galaxy S21", image: "img/s21.png", description: "AMOLED дисплей, Exynos 2100", price: 11000, discount: 0.05, views: 3 },
    { id: 3, type: "phone", name: "Xiaomi Mi 11", image: "img/mi11.png", description: "Snapdragon 888, AMOLED", price: 9500, discount: 0.15, views: 7 },
    { id: 4, type: "laptop", name: "MacBook Air", image: "img/Frame 604.png", description: "Apple M1, легкий корпус", price: 23000, discount: 0.1, views: 2 },
    { id: 5, type: "monitor", name: "MSI G27CQ4", image: "img/g27cq4-500x500 1.png", description: "27 дюймів, 165Hz", price: 44999, discount: 0.2, views: 1 },
    { id: 6, type: "accessory", name: "Gaming Mouse", image: "img/GP11_PRD3 1.png", description: "RGB підсвітка", price: 1000, discount: 0, views: 10 }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const logo = document.getElementById('logo');
const logoInfo = document.getElementById('logoInfo');

logo.addEventListener('click', (e) => {
    e.preventDefault(); // щоб не переходило по href
    logoInfo.classList.toggle('show');
});


// =======================
// Збереження кошика
// =======================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// =======================
// Додати товар у кошик з обмеженням 10 одиниць
// =======================
function addToCart(id) {
    let found = cart.find(item => item.id === id);
    if (found) {
        if(found.count < 10) found.count++;
        else { 
            showToast("Максимальна кількість цього товару: 10"); 
            return; 
        }
    } else {
        cart.push({ ...products.find(p => p.id === id), count: 1 });
    }

    const productCard = document.querySelector(`.product:nth-child(${products.findIndex(p => p.id === id) + 1}) img`);
    flyToCart(productCard);
    animateCart();
    showToast("Товар додано до кошика!");

    saveCart();
    renderCart();
}

// =======================
// Анімація картинки у кошик
// =======================
function flyToCart(imgElement) {
    const cartBtn = document.getElementById("openCartBtn");
    const imgClone = imgElement.cloneNode(true);
    const rect = imgElement.getBoundingClientRect();

    imgClone.classList.add("fly-img");
    imgClone.style.left = rect.left + "px";
    imgClone.style.top = rect.top + "px";
    imgClone.style.width = rect.width + "px";
    imgClone.style.height = rect.height + "px";
    document.body.appendChild(imgClone);

    const cartRect = cartBtn.getBoundingClientRect();

    setTimeout(() => {
        imgClone.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.1)`;
        imgClone.style.opacity = 0;
    }, 10);

    setTimeout(() => document.body.removeChild(imgClone), 800);
}

// =======================
// Пульсація кнопки кошика
// =======================
function animateCart() {
    const btn = document.getElementById("openCartBtn");
    if (!btn) return;

    btn.classList.remove("cart-animate");
    void btn.offsetWidth; // перезапуск анімації
    btn.classList.add("cart-animate");
}

// =======================
// Оновлення/видалення кількості товару
// =======================
function updateCount(id, value) {
    let item = cart.find(p => p.id === id);
    item.count = Number(value);
    if (item.count <= 0) removeFromCart(id);
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

// =======================
// Оновлення числа товарів з анімацією
// =======================
function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (!countEl) return;
    const totalCount = cart.reduce((sum, p) => sum + p.count, 0);
    countEl.textContent = totalCount;

    countEl.classList.remove("cart-count-pulse");
    void countEl.offsetWidth;
    countEl.classList.add("cart-count-pulse");
}

// =======================
// Toast-повідомлення
// =======================
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
}

// =======================
// Рендер товарів
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

// =======================
// Фільтри та сортування
// =======================
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
// Рендер кошика
// =======================
function renderCart() {
    const cartBox = document.getElementById("cart-container");
    const totalBox = document.getElementById("total");
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
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">✖</button>
                </div>
            </div>
        `;
    });

    totalBox.textContent = cart.reduce((sum,p) => sum + p.price*p.count, 0);
    updateCartCount();
}

// =======================
// Відкриття/закриття кошика
// =======================
const openBtn = document.getElementById("openCartBtn");
const closeBtn = document.getElementById("closeCartBtn");
const cartSidebar = document.getElementById("cartSidebar");

openBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
closeBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

// =======================
// Кнопка Очистити кошик
// =======================
const clearCartBtn = document.getElementById("clearCartBtn");
clearCartBtn.addEventListener("click", () => {
    if(cart.length === 0) {
        showToast("Кошик вже порожній");
        return;
    }
    if(confirm("Ви впевнені, що хочете очистити кошик?")) {
        cart = [];
        saveCart();
        renderCart();
        showToast("Кошик очищено");
    }
});

// =======================
// Замовлення з 5-секундною затримкою
// =======================
const orderBtn = document.getElementById("orderBtn");
orderBtn.addEventListener("click", () => {
    if(cart.length === 0) {
        alert("Кошик порожній!");
        return;
    }

    orderBtn.disabled = true;
    orderBtn.textContent = "Обробка замовлення...";

    setTimeout(() => {
        alert("Замовлено!");
        orderBtn.disabled = false;
        orderBtn.textContent = "Замовити";

        cart = [];
        saveCart();
        renderCart();
    }, 5000);
});

// =======================
// Автозапуск та події фільтрів
// =======================
renderProducts(products);
renderCart();
document.getElementById("filterType").addEventListener("change", applyFilters);
document.getElementById("sortPrice").addEventListener("change", applyFilters);
document.getElementById("searchBtn").addEventListener("click", applyFilters);

// =======================
// Збереження кошика автоматично кожні 5 секунд
// =======================
setInterval(() => localStorage.setItem("cart", JSON.stringify(cart)), 5000);
