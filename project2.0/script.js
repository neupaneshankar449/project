/* ==========================================================
   LUXE Premium Fashion Store
   script.js
   Part 1 - Configuration, State, API & Utilities
========================================================== */

"use strict";

/* ==========================================================
   CONFIGURATION
========================================================== */

const CONFIG = {
    API_URL: "https://fakestoreapi.com/products",
    FEATURED_COUNT: 4,
    PRODUCTS_PER_PAGE: 8,
    STORAGE_KEYS: {
        CART: "luxe_cart",
        WISHLIST: "luxe_wishlist"
    }
};

/* ==========================================================
   APPLICATION STATE
========================================================== */

const App = {

    products: [],

    filteredProducts: [],

    featuredProducts: [],

    categories: [],

    cart: [],

    wishlist: [],

    currentPage: 1,

    currentCategory: "all",

    currentSearch: "",

    currentSort: "default"

};

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const DOM = {

    featuredContainer:
        document.getElementById("featured-products-container"),

    productsContainer:
        document.getElementById("shop-products-container"),

    categoryContainer:
        document.getElementById("category-filters"),

    searchInput:
        document.getElementById("shop-search"),

    sortSelect:
        document.getElementById("shop-sort"),

    loader:
        document.getElementById("shop-loader"),

    alertContainer:
        document.getElementById("shop-alert-container"),

    modal:
        document.getElementById("productModal"),

    modalBody:
        document.getElementById("productModalBody"),

    cartItems:
        document.getElementById("cart-items"),

    cartTotal:
        document.getElementById("cart-total"),

    cartCount:
        document.getElementById("cart-count")

};

/* ==========================================================
   LOCAL STORAGE
========================================================== */

function loadStorage() {

    App.cart = JSON.parse(

        localStorage.getItem(CONFIG.STORAGE_KEYS.CART)

    ) || [];

    App.wishlist = JSON.parse(

        localStorage.getItem(CONFIG.STORAGE_KEYS.WISHLIST)

    ) || [];

}

function saveCart() {

    localStorage.setItem(

        CONFIG.STORAGE_KEYS.CART,

        JSON.stringify(App.cart)

    );

}

function saveWishlist() {

    localStorage.setItem(

        CONFIG.STORAGE_KEYS.WISHLIST,

        JSON.stringify(App.wishlist)

    );

}

/* ==========================================================
   UTILITIES
========================================================== */

function formatPrice(price) {

    return `$${Number(price).toFixed(2)}`;

}

function capitalize(text) {

    return text
        .charAt(0)
        .toUpperCase() +

        text.slice(1);

}

function showLoader(show = true) {

    if (!DOM.loader) return;

    DOM.loader.classList.toggle("d-none", !show);

}

function clearAlerts() {

    if (DOM.alertContainer)

        DOM.alertContainer.innerHTML = "";

}

function showAlert(message, type = "danger") {

    if (!DOM.alertContainer) return;

    DOM.alertContainer.innerHTML = `

<div class="alert alert-${type}">

${message}

</div>

`;

}

function showToast(message) {

    const toast = document.createElement("div");

    toast.className =
        "position-fixed bottom-0 end-0 m-4 alert alert-dark shadow";

    toast.style.zIndex = "9999";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

function createStars(rate) {

    let html = "";

    const rounded = Math.round(rate);

    for (let i = 1; i <= 5; i++) {

        if (i <= rounded)

            html +=

                `<i class="fa-solid fa-star text-warning"></i>`;

        else

            html +=

                `<i class="fa-regular fa-star text-warning"></i>`;

    }

    return html;

}

/* ==========================================================
   API
========================================================== */

async function fetchProducts() {

    showLoader(true);

    clearAlerts();

    try {

        const response = await fetch(CONFIG.API_URL);

        if (!response.ok)

            throw new Error("Unable to fetch products.");

        const data = await response.json();

        App.products = data;

        App.filteredProducts = [...data];

        App.featuredProducts = data.slice(

            0,

            CONFIG.FEATURED_COUNT

        );

        App.categories = [

            "all",

            ...new Set(

                data.map(product => product.category)

            )

        ];

    }

    catch (error) {

        console.error(error);

        showAlert(

            "Unable to load products. Please try again later."

        );

    }

    finally {

        showLoader(false);

    }

}

/* ==========================================================
   INITIAL DATA
========================================================== */

async function initializeStore() {

    loadStorage();

    await fetchProducts();

}
/* ==========================================================
   PART 2 - RENDERING ENGINE
========================================================== */

/* ==========================================================
   PRODUCT CARD
========================================================== */

function createProductCard(product) {

    const inWishlist = App.wishlist.includes(product.id);

    return `
        <div class="col-lg-3 col-md-4 col-sm-6">

            <div class="card h-100 product-card shadow-sm">

                <div class="position-relative">

                    <img
                        src="${product.image}"
                        class="card-img-top product-image"
                        alt="${product.title}"
                        loading="lazy">

                    <button
                        class="btn btn-light wishlist-btn position-absolute top-0 end-0 m-2"
                        onclick="toggleWishlist(${product.id})">

                        <i class="${inWishlist
                            ? "fa-solid"
                            : "fa-regular"} fa-heart text-danger"></i>

                    </button>

                </div>

                <div class="card-body d-flex flex-column">

                    <small class="text-muted text-uppercase">

                        ${product.category}

                    </small>

                    <h5 class="card-title mt-2">

                        ${product.title}

                    </h5>

                    <div class="mb-2">

                        ${createStars(product.rating.rate)}

                        <small class="ms-2">

                            (${product.rating.count})

                        </small>

                    </div>

                    <h4 class="text-dark fw-bold">

                        ${formatPrice(product.price)}

                    </h4>

                    <div class="mt-auto d-grid gap-2">

                        <button
                            class="btn btn-dark"
                            onclick="openProduct(${product.id})">

                            <i class="fa-solid fa-eye"></i>

                            View Details

                        </button>

                        <button
                            class="btn btn-outline-dark"
                            onclick="addToCart(${product.id})">

                            <i class="fa-solid fa-cart-shopping"></i>

                            Add To Cart

                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;
}

/* ==========================================================
   FEATURED PRODUCTS
========================================================== */

function renderFeaturedProducts() {

    if (!DOM.featuredContainer) return;

    DOM.featuredContainer.innerHTML =
        App.featuredProducts
            .map(createProductCard)
            .join("");

}

/* ==========================================================
   SHOP PRODUCTS
========================================================== */

function renderProducts() {

    if (!DOM.productsContainer) return;

    if (App.filteredProducts.length === 0) {

        DOM.productsContainer.innerHTML = `
            <div class="col-12">

                <div class="alert alert-warning text-center">

                    <h4>No products found.</h4>

                    <p>Try another search or category.</p>

                </div>

            </div>
        `;

        return;

    }

    const start =
        (App.currentPage - 1) *
        CONFIG.PRODUCTS_PER_PAGE;

    const end =
        start +
        CONFIG.PRODUCTS_PER_PAGE;

    const products =
        App.filteredProducts.slice(start, end);

    DOM.productsContainer.innerHTML =
        products
            .map(createProductCard)
            .join("");

}

/* ==========================================================
   CATEGORY BUTTON
========================================================== */

function createCategoryButton(category) {

    const active =
        category === App.currentCategory
            ? "btn-dark"
            : "btn-outline-dark";

    return `
        <button
            class="btn ${active} category-btn"
            onclick="filterCategory('${category}')">

            ${capitalize(category)}

        </button>
    `;

}

/* ==========================================================
   CATEGORIES
========================================================== */

function renderCategories() {

    if (!DOM.categoryContainer) return;

    DOM.categoryContainer.innerHTML =
        App.categories
            .map(createCategoryButton)
            .join("");

}

/* ==========================================================
   CART BADGE
========================================================== */

function updateCartBadge() {

    if (!DOM.cartCount) return;

    const totalItems =
        App.cart.reduce((sum, item) => {

            return sum + item.quantity;

        }, 0);

    DOM.cartCount.textContent = totalItems;

}

/* ==========================================================
   REFRESH UI
========================================================== */

function refreshUI() {

    renderFeaturedProducts();

    renderProducts();

    renderCategories();

    renderCart();

    updateCartBadge();

}

/* ==========================================================
   LOADING PLACEHOLDER
========================================================== */

function renderSkeletons() {

    if (!DOM.productsContainer) return;

    let html = "";

    for (let i = 0; i < 8; i++) {

        html += `
        <div class="col-lg-3 col-md-4 col-sm-6">

            <div class="card">

                <div class="placeholder-glow">

                    <div
                        class="placeholder"
                        style="height:220px;">
                    </div>

                </div>

                <div class="card-body">

                    <p class="placeholder-glow">

                        <span
                            class="placeholder col-8">
                        </span>

                    </p>

                    <p class="placeholder-glow">

                        <span
                            class="placeholder col-5">
                        </span>

                    </p>

                </div>

            </div>

        </div>
        `;
    }

    DOM.productsContainer.innerHTML = html;

}
/* ==========================================================
   PART 3 - SEARCH, FILTERS & EVENTS
========================================================== */

/* ==========================================================
   APPLY FILTERS
========================================================== */

function applyFilters() {

    let products = [...App.products];

    // Category
    if (App.currentCategory !== "all") {

        products = products.filter(product =>
            product.category === App.currentCategory
        );

    }

    // Search
    if (App.currentSearch.trim() !== "") {

        const search = App.currentSearch.toLowerCase();

        products = products.filter(product =>

            product.title.toLowerCase().includes(search) ||

            product.description.toLowerCase().includes(search)

        );

    }

    // Sorting
    switch (App.currentSort) {

        case "price-low":

            products.sort((a, b) => a.price - b.price);

            break;

        case "price-high":

            products.sort((a, b) => b.price - a.price);

            break;

        case "rating":

            products.sort((a, b) =>

                b.rating.rate - a.rating.rate

            );

            break;

        case "name":

            products.sort((a, b) =>

                a.title.localeCompare(b.title)

            );

            break;

        default:
            break;

    }

    App.filteredProducts = products;

    App.currentPage = 1;

    renderProducts();

}

/* ==========================================================
   CATEGORY
========================================================== */

function filterCategory(category) {

    App.currentCategory = category;

    renderCategories();

    applyFilters();

}

/* ==========================================================
   SEARCH
========================================================== */

function searchProducts(value) {

    App.currentSearch = value;

    applyFilters();

}

/* ==========================================================
   SORT
========================================================== */

function sortProducts(value) {

    App.currentSort = value;

    applyFilters();

}

/* ==========================================================
   RESET
========================================================== */

function resetFilters() {

    App.currentCategory = "all";

    App.currentSearch = "";

    App.currentSort = "default";

    App.currentPage = 1;

    if (DOM.searchInput)

        DOM.searchInput.value = "";

    if (DOM.sortSelect)

        DOM.sortSelect.value = "default";

    renderCategories();

    applyFilters();

    showToast("Filters reset");

}

/* ==========================================================
   PAGINATION
========================================================== */

function nextPage() {

    const maxPage = Math.ceil(

        App.filteredProducts.length /

        CONFIG.PRODUCTS_PER_PAGE

    );

    if (App.currentPage < maxPage) {

        App.currentPage++;

        renderProducts();

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

}

function previousPage() {

    if (App.currentPage > 1) {

        App.currentPage--;

        renderProducts();

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

}

/* ==========================================================
   DEBOUNCE
========================================================== */

function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/* ==========================================================
   EVENTS
========================================================== */

function registerEvents() {

    if (DOM.searchInput) {

        DOM.searchInput.addEventListener(

            "input",

            debounce(event => {

                searchProducts(event.target.value);

            })

        );

    }

    if (DOM.sortSelect) {

        DOM.sortSelect.addEventListener(

            "change",

            event => {

                sortProducts(event.target.value);

            }

        );

    }

}

/* ==========================================================
   OPTIONAL KEYBOARD SHORTCUTS
========================================================== */

document.addEventListener("keydown", event => {

    // Ctrl + /
    if (event.ctrlKey && event.key === "/") {

        event.preventDefault();

        DOM.searchInput?.focus();

    }

});
/* ==========================================================
   PART 4 - CART, WISHLIST & PRODUCT MODAL
========================================================== */

/* ==========================================================
   PRODUCT MODAL
========================================================== */

function openProduct(productId) {

    const product = App.products.find(p => p.id === productId);

    if (!product || !DOM.modalBody) return;

    const inWishlist = App.wishlist.includes(product.id);

    DOM.modalBody.innerHTML = `

        <div class="row g-4">

            <div class="col-lg-6 text-center">

                <img
                    src="${product.image}"
                    class="img-fluid p-4"
                    style="max-height:420px;object-fit:contain;"
                    alt="${product.title}">

            </div>

            <div class="col-lg-6">

                <span class="badge bg-dark mb-3">

                    ${capitalize(product.category)}

                </span>

                <h2>${product.title}</h2>

                <div class="my-3">

                    ${createStars(product.rating.rate)}

                    <span class="ms-2">

                        ${product.rating.rate}
                        (${product.rating.count} reviews)

                    </span>

                </div>

                <h3 class="fw-bold">

                    ${formatPrice(product.price)}

                </h3>

                <p class="mt-4">

                    ${product.description}

                </p>

                <div class="d-grid gap-2 mt-4">

                    <button
                        class="btn btn-dark"
                        onclick="addToCart(${product.id})">

                        <i class="fa-solid fa-cart-shopping"></i>

                        Add To Cart

                    </button>

                    <button
                        class="btn btn-outline-dark"
                        onclick="toggleWishlist(${product.id})">

                        <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart text-danger"></i>

                        ${inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}

                    </button>

                </div>

            </div>

        </div>

    `;

    bootstrap.Modal
        .getOrCreateInstance(DOM.modal)
        .show();

}

/* ==========================================================
   WISHLIST
========================================================== */

function toggleWishlist(productId) {

    const index = App.wishlist.indexOf(productId);

    if (index === -1) {

        App.wishlist.push(productId);

        showToast("Added to wishlist ❤️");

    } else {

        App.wishlist.splice(index, 1);

        showToast("Removed from wishlist");

    }

    saveWishlist();

    renderProducts();
    renderFeaturedProducts();

}

/* ==========================================================
   ADD TO CART
========================================================== */

function addToCart(productId) {

    const existing = App.cart.find(item => item.id === productId);

    if (existing) {

        existing.quantity++;

    } else {

        const product = App.products.find(p => p.id === productId);

        if (!product) return;

        App.cart.push({

            ...product,

            quantity: 1

        });

    }

    saveCart();

    renderCart();

    updateCartBadge();

    showToast("Added to cart");

}

/* ==========================================================
   REMOVE CART ITEM
========================================================== */

function removeFromCart(productId) {

    App.cart = App.cart.filter(

        item => item.id !== productId

    );

    saveCart();

    renderCart();

    updateCartBadge();

    showToast("Removed from cart");

}

/* ==========================================================
   QUANTITY
========================================================== */

function increaseQuantity(productId) {

    const item = App.cart.find(

        p => p.id === productId

    );

    if (!item) return;

    item.quantity++;

    saveCart();

    renderCart();

    updateCartBadge();

}

function decreaseQuantity(productId) {

    const item = App.cart.find(

        p => p.id === productId

    );

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }

    saveCart();

    renderCart();

    updateCartBadge();

}

/* ==========================================================
   CART TOTAL
========================================================== */

function calculateCartTotal() {

    return App.cart.reduce(

        (total, item) =>

            total + item.price * item.quantity,

        0

    );

}

/* ==========================================================
   RENDER CART
========================================================== */

function renderCart() {

    if (!DOM.cartItems) return;

    if (App.cart.length === 0) {

        DOM.cartItems.innerHTML = `

            <div class="text-center py-5">

                <i class="fa-solid fa-cart-shopping fa-3x text-muted mb-3"></i>

                <h5>Your cart is empty</h5>

            </div>

        `;

        if (DOM.cartTotal)

            DOM.cartTotal.textContent = formatPrice(0);

        return;

    }

    DOM.cartItems.innerHTML = App.cart.map(item => `

        <div class="d-flex mb-4">

            <img
                src="${item.image}"
                width="70"
                height="70"
                class="rounded border p-2"
                style="object-fit:contain;">

            <div class="ms-3 flex-grow-1">

                <h6>${item.title}</h6>

                <small>

                    ${formatPrice(item.price)}

                </small>

                <div class="mt-2">

                    <button
                        class="btn btn-sm btn-outline-dark"

                        onclick="decreaseQuantity(${item.id})">

                        -

                    </button>

                    <span class="mx-2">

                        ${item.quantity}

                    </span>

                    <button
                        class="btn btn-sm btn-outline-dark"

                        onclick="increaseQuantity(${item.id})">

                        +

                    </button>

                </div>

            </div>

            <button
                class="btn btn-sm btn-danger"

                onclick="removeFromCart(${item.id})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `).join("");

    if (DOM.cartTotal)

        DOM.cartTotal.textContent =

            formatPrice(calculateCartTotal());

}

/* ==========================================================
   CLEAR CART
========================================================== */

function clearCart() {

    if (!confirm("Clear shopping cart?"))

        return;

    App.cart = [];

    saveCart();

    renderCart();

    updateCartBadge();

    showToast("Cart cleared");

}
/* ==========================================================
   PART 5 - INITIALIZATION & APP CONTROLLER
========================================================== */

/* ==========================================================
   ROUTER
========================================================== */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll("[data-route]").forEach(link => {
        link.classList.remove("active");

        if (link.dataset.route === pageId) {
            link.classList.add("active");
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function initializeRouter() {

    function loadRoute() {

        let page = location.hash.replace("#", "");

        if (!page)
            page = "home";

        if (!document.getElementById(page))
            page = "home";

        showPage(page);

    }

    window.addEventListener("hashchange", loadRoute);

    loadRoute();

}

/* ==========================================================
   NAVBAR
========================================================== */

function initializeNavbar() {

    const links = document.querySelectorAll(".navbar .nav-link");

    links.forEach(link => {

        link.addEventListener("click", () => {

            const collapse = document.querySelector(".navbar-collapse");

            if (
                collapse &&
                collapse.classList.contains("show")
            ) {

                bootstrap.Collapse
                    .getOrCreateInstance(collapse)
                    .hide();

            }

        });

    });

}

/* ==========================================================
   CONTACT FORM
========================================================== */

function initializeContactForm() {

    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", event => {

        event.preventDefault();

        const formData = new FormData(form);

        const name = formData.get("name").trim();
        const email = formData.get("email").trim();
        const message = formData.get("message").trim();

        if (!name || !email || !message) {

            showToast("Please fill in all fields.");

            return;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            showToast("Invalid email address.");

            return;

        }

        showToast("Message sent successfully!");

        form.reset();

    });

}

/* ==========================================================
   SCROLL TO TOP
========================================================== */

function initializeScrollButton() {

    const button = document.getElementById("scrollTop");

    if (!button) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================================
   NEWSLETTER
========================================================== */

function initializeNewsletter() {

    const newsletter = document.querySelector(
        ".newsletter-section input"
    );

    const button = document.querySelector(
        ".newsletter-section button"
    );

    if (!newsletter || !button) return;

    button.addEventListener("click", () => {

        const value = newsletter.value.trim();

        if (!value) {

            showToast("Enter your email.");

            return;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {

            showToast("Invalid email.");

            return;

        }

        newsletter.value = "";

        showToast("Subscribed successfully!");

    });

}

/* ==========================================================
   INITIALIZE APP
========================================================== */

async function initializeApp() {

    renderSkeletons();

    await initializeStore();

    refreshUI();

    registerEvents();

    initializeRouter();

    initializeNavbar();

    initializeContactForm();

    initializeNewsletter();

    initializeScrollButton();

    console.log(
        "%cLUXE Premium Fashion Store",
        "color:#D4AF37;font-size:18px;font-weight:bold;"
    );

}

/* ==========================================================
   START APPLICATION
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);

/* ==========================================================
   GLOBAL FUNCTIONS
========================================================== */

window.openProduct = openProduct;

window.addToCart = addToCart;

window.removeFromCart = removeFromCart;

window.increaseQuantity = increaseQuantity;

window.decreaseQuantity = decreaseQuantity;

window.toggleWishlist = toggleWishlist;

window.clearCart = clearCart;

window.filterCategory = filterCategory;

window.resetFilters = resetFilters;

window.nextPage = nextPage;

window.previousPage = previousPage;