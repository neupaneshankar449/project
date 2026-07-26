const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-route");

const heroShopBtn = document.getElementById("heroShopBtn");

const featuredProducts = document.getElementById("featuredProducts");

const productContainer = document.getElementById("productContainer");

const loadingSpinner = document.getElementById("loadingSpinner");

const productAlert = document.getElementById("productAlert");

const API_URL = "https://fakestoreapi.com/products";

let allProducts = [];

let filteredProducts = [];

/* ==========================================
   SPA ROUTER
========================================== */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.add("d-none");

    });

    document.getElementById(pageId).classList.remove("d-none");

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === pageId) {

            link.classList.add("active");

        }

    });

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        showPage(this.dataset.page);

    });

});

heroShopBtn.addEventListener("click", () => {

    showPage("shop");

});

/* ==========================================
   FETCH PRODUCTS
========================================== */

async function loadProducts() {

    loadingSpinner.style.display = "block";

    productAlert.innerHTML = "";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Unable to load products.");

        }

        const data = await response.json();

        allProducts = data;

        filteredProducts = [...allProducts];

        renderFeaturedProducts();

        renderProducts(filteredProducts);

    }

    catch (error) {

        productAlert.innerHTML = `

        <div class="alert alert-danger">

            <strong>Error:</strong>

            ${error.message}

        </div>

        `;

    }

    finally {

        loadingSpinner.style.display = "none";

    }

}

/* ==========================================
   FEATURED PRODUCTS
========================================== */

function renderFeaturedProducts() {

    const featured = allProducts.slice(0, 4);

    featuredProducts.innerHTML = featured.map(product => `

        <div class="col-lg-3 col-md-6">

            <div class="featured-card">

                <img src="${product.image}" alt="${product.title}">

                <div class="card-body">

                    <h5>${product.title}</h5>

                    <p class="price">$${product.price}</p>

                    <button
                        class="btn btn-warning w-100"
                        onclick="openModal(${product.id})">

                        View Details

                    </button>

                </div>

            </div>

        </div>

    `).join("");

}
/* ==========================================
   PRODUCT GRID
========================================== */

function renderProducts(products) {

    productContainer.innerHTML = "";

    if (products.length === 0) {

        productContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    No products found.
                </div>
            </div>
        `;
        return;
    }

    productContainer.innerHTML = products.map(product => `

        <div class="product-card">

            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="product-content">

                <p class="product-category">
                    ${product.category}
                </p>

                <h5 class="product-title">
                    ${product.title}
                </h5>

                <div class="product-price">
                    $${product.price}
                </div>

                <div class="product-rating">
                    ⭐ ${product.rating.rate}
                    (${product.rating.count})
                </div>

                <button
                    class="btn btn-dark mt-auto"
                    onclick="openModal(${product.id})">

                    View Details

                </button>

            </div>

        </div>

    `).join("");

}

/* ==========================================
   SEARCH
========================================== */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const keyword = this.value.toLowerCase().trim();

    filteredProducts = allProducts.filter(product =>

        product.title.toLowerCase().includes(keyword)

    );

    renderProducts(filteredProducts);

});

/* ==========================================
   CATEGORY FILTER
========================================== */

const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        const category = this.dataset.category;

        if (category === "all") {

            filteredProducts = [...allProducts];

        } else {

            filteredProducts = allProducts.filter(product =>

                product.category === category

            );

        }

        renderProducts(filteredProducts);

    });

});

/* ==========================================
   SORT PRODUCTS
========================================== */

const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", function () {

    let products = [...filteredProducts];

    switch (this.value) {

        case "priceLow":
            products.sort((a, b) => a.price - b.price);
            break;

        case "priceHigh":
            products.sort((a, b) => b.price - a.price);
            break;

        case "rating":
            products.sort((a, b) => b.rating.rate - a.rating.rate);
            break;

        case "name":
            products.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;

        default:
            products = [...filteredProducts];
    }

    renderProducts(products);

});

/* ==========================================
   PRODUCT MODAL
========================================== */

const modalBody = document.getElementById("modalBody");

function openModal(id) {

    const product = allProducts.find(item => item.id === id);

    modalBody.innerHTML = `

        <img
            src="${product.image}"
            class="img-fluid mb-4"
            alt="${product.title}">

        <h3>${product.title}</h3>

        <p class="modal-category">
            <strong>Category:</strong>
            ${product.category}
        </p>

        <div class="modal-price">
            $${product.price}
        </div>

        <div class="modal-rating">
            ⭐ ${product.rating.rate}
            (${product.rating.count} reviews)
        </div>

        <p class="modal-description mt-4">
            ${product.description}
        </p>

    `;

    const modal = new bootstrap.Modal(

        document.getElementById("productModal")

    );

    modal.show();

}
/* ==========================================
   CONTACT FORM VALIDATION
========================================== */

const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        name === "" ||
        email === "" ||
        subject === "" ||
        message === ""
    ) {

        showAlert(
            "Please fill in all fields.",
            "danger"
        );

        return;

    }

    if (!emailPattern.test(email)) {

        showAlert(
            "Please enter a valid email address.",
            "danger"
        );

        return;

    }

    if (message.length < 15) {

        showAlert(
            "Message should contain at least 15 characters.",
            "danger"
        );

        return;

    }

    showAlert(
        "Message sent successfully!",
        "success"
    );

    contactForm.reset();

});

/* ==========================================
   BOOTSTRAP ALERT
========================================== */

function showAlert(message, type) {

    formAlert.innerHTML = `

    <div class="alert alert-${type} alert-dismissible fade show">

        ${message}

        <button
            class="btn-close"
            data-bs-dismiss="alert">
        </button>

    </div>

    `;

}

/* ==========================================
   NEWSLETTER
========================================== */

const newsletterForm =
    document.querySelector(".newsletter form");

newsletterForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const emailInput =
        newsletterForm.querySelector("input");

    if (emailInput.value.trim() === "") {

        alert("Please enter your email.");

        return;

    }

    alert("Thank you for subscribing!");

    newsletterForm.reset();

});

/* ==========================================
   CATEGORY CARD CLICK
========================================== */

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", function () {

        const title =
            this.querySelector("h4")
                .textContent
                .toLowerCase();

        showPage("shop");

        let category = "";

        if (title.includes("men")) {

            category = "men's clothing";

        }

        else if (title.includes("women")) {

            category = "women's clothing";

        }

        else if (title.includes("jewelry")) {

            category = "jewelery";

        }

        else {

            category = "electronics";

        }

        filteredProducts =
            allProducts.filter(product =>
                product.category === category
            );

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

            if (btn.dataset.category === category) {

                btn.classList.add("active");

            }

        });

        renderProducts(filteredProducts);

    });

});

/* ==========================================
   ESC KEY CLOSE MODAL
========================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        const modalElement =
            document.getElementById("productModal");

        const modal =
            bootstrap.Modal.getInstance(modalElement);

        if (modal) {

            modal.hide();

        }

    }

});

/* ==========================================
   INITIALIZE WEBSITE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    showPage("home");

    loadProducts();

});