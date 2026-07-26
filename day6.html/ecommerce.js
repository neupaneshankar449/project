function getProducts() {
    const productGrid = document.getElementById("product-grid");
    fetch("https://fakestoreapi.com/products")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            data.forEach(function(product) {
                productGrid.innerHTML += `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p class="brand">${product.category}</p>
                        <p class="rating">
                            ⭐ ${product.rating.rate} (${product.rating.count})
                        </p>
                        <p class="price">
                            $${product.price}
                        </p>
                        <a href="cart.html" class="btn add-cart">
                            Add to Cart
                        </a>
                    </div>
                `;
            });
        })
        .catch(function(error) {
            console.log("Error:", error);
        });
}
getProducts();