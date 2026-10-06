// =================================
// PRODUCT DATA
// =================================
const API_BASE_URL = "https://organicspices.onrender.com";
let products = [];


// =================================
// CART & WISHLIST
// =================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];


// =================================
// LOAD PRODUCTS FROM DJANGO API
// =================================

async function loadProducts() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/products/`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        console.error(error);

        const productList =
            document.getElementById("product-list");

        productList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger fs-5">
                    Unable to load products from server.
                </p>
            </div>
        `;
    }
}


// =================================
// DISPLAY PRODUCTS
// =================================

function displayProducts(productArray = products) {

    const productList =
        document.getElementById("product-list");

    productList.innerHTML = "";

    if (productArray.length === 0) {

        productList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted fs-5">
                    No products found.
                </p>
            </div>
        `;

        return;
    }

    productArray.forEach((product) => {

        const isWishlisted =
            wishlist.some(
                item => item.product_id === product.id
            );

        productList.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-3">

                <div class="product-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="card-body">

                        <h5>
                            ${product.name}
                        </h5>

                        <p class="product-price">
                            ₹${product.price}
                        </p>

                        <button
                            class="btn btn-success w-100 mb-2"
                            onclick="addToCart('${product.name}', ${product.price})"
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            class="btn btn-outline-danger w-100"
                            onclick="toggleWishlist(this, '${product.name}', ${product.price})"
                        >
                            ${
                                isWishlisted
                                    ? "❤️ Wishlist"
                                    : "🤍 Wishlist"
                            }
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


// =================================
// SEARCH + CATEGORY FILTER
// =================================

function filterProducts() {

    const searchText =
        document
            .getElementById("search-input")
            .value
            .toLowerCase()
            .trim();

    const selectedCategory =
        document.getElementById("category-filter").value;

    const filteredProducts =
        products.filter((product) => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    displayProducts(filteredProducts);
}


// =================================
// SEARCH
// =================================

document
    .getElementById("search-input")
    .addEventListener(
        "input",
        filterProducts
    );


// =================================
// CATEGORY
// =================================

document
    .getElementById("category-filter")
    .addEventListener(
        "change",
        filterProducts
    );


// =================================
// ADD TO CART
// =================================

async function addToCart(
    productName,
    productPrice
) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert(
            "Please login to add products to cart."
        );

        window.location.href = "login.html";

        return;
    }

    const product =
        products.find(
            item => item.name === productName
        );

    if (!product) {

        alert("Product not found.");

        return;
    }

    try {

        const response = await fetch(
    `${API_BASE_URL}/api/cart/add/`,
    {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: loggedInUser,

                    product_id: product.id,

                    quantity: 1

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to add product to cart."
            );

            return;
        }

        alert(
            "Product added to cart!"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }

}


// =================================
// LOAD CART FROM DJANGO API
// =================================

async function loadCart() {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        return;
    }

    try {

        const response = await fetch(
    `${API_BASE_URL}/api/cart/${loggedInUser}/`
);

        if (!response.ok) {

            throw new Error(
                "Failed to load cart"
            );
        }

        cart = await response.json();

        updateCartCount();

        displayCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load cart from server."
        );
    }
}


// =================================
// UPDATE CART COUNT
// =================================

function updateCartCount() {

    let totalItems = 0;

    cart.forEach((item) => {

        totalItems += item.quantity;

    });

    document.getElementById(
        "cart-count"
    ).textContent = totalItems;
}


// =================================
// DISPLAY CART
// =================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        cartTotal.innerHTML = `
            <h4>Total: ₹0</h4>
        `;

        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="card mb-3">

                <div class="card-body
                    d-flex
                    justify-content-between
                    align-items-center">

                    <div>

                        <h5>
                            ${item.name}
                        </h5>

                        <p class="mb-2">
                            ₹${item.price} × ${item.quantity}
                        </p>

                        <div class="d-flex
                            align-items-center
                            gap-2">

                            <button
                                class="btn btn-outline-secondary btn-sm"
                                onclick="decreaseQuantity(${index})"
                            >
                                −
                            </button>

                            <span class="fw-bold">
                                ${item.quantity}
                            </span>

                            <button
                                class="btn btn-outline-success btn-sm"
                                onclick="increaseQuantity(${index})"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="btn btn-danger"
                        onclick="removeCartItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    cartTotal.innerHTML = `
        <h4>Total: ₹${total}</h4>
    `;
}


// =================================
// INCREASE QUANTITY
// =================================

async function increaseQuantity(index) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    const item = cart[index];

    const newQuantity =
        item.quantity + 1;

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/update/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: loggedInUser,

                    cart_item_id: item.id,

                    quantity: newQuantity

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update cart."
            );

            return;
        }

        cart[index].quantity =
            data.quantity;

        updateCartCount();

        displayCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =================================
// DECREASE QUANTITY
// =================================

async function decreaseQuantity(index) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    const item = cart[index];

    const newQuantity =
        item.quantity - 1;

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/update/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: loggedInUser,

                    cart_item_id: item.id,

                    quantity: newQuantity

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update cart."
            );

            return;
        }

        if (newQuantity < 1) {

            cart.splice(index, 1);

        } else {

            cart[index].quantity =
                data.quantity;
        }

        updateCartCount();

        displayCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =================================
// REMOVE CART ITEM
// =================================

async function removeCartItem(index) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    const item = cart[index];

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/cart/update/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: loggedInUser,

                    cart_item_id: item.id,

                    quantity: 0

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to remove product."
            );

            return;
        }

        cart.splice(index, 1);

        updateCartCount();

        displayCart();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =================================
// CHECKOUT
// =================================

async function checkout() {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please login to place an order.");

        return;
    }

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    try {

        const response = await fetch(
    `${API_BASE_URL}/api/orders/create/`,
    {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: loggedInUser
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to place order."
            );

            return;
        }

        alert(
            `Order placed successfully!\n\nOrder ID: ${data.order_id}\nTotal: ₹${data.total_amount}`
        );

        await loadCart();

    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );

        alert(
            "Unable to place order. Please try again."
        );
    }
}
// loadorders 
async function loadOrders() {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        return;
    }

    try {

        const response = await fetch(
    `${API_BASE_URL}/api/orders/${loggedInUser}/`
);
        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );
        }

        const orders =
            await response.json();

        displayOrders(orders);

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );
    }
}
// dispaly orders
function displayOrders(orders) {

    const ordersList =
        document.getElementById("orders-list");

    if (orders.length === 0) {

        ordersList.innerHTML = `
            <p>
                No orders found.
            </p>
        `;

        return;
    }

    ordersList.innerHTML = "";

    orders.forEach(order => {

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `
                <p>
                    ${item.product_name}
                    × ${item.quantity}
                    - ₹${item.price}
                </p>
            `;
        });

        ordersList.innerHTML += `
            <div class="card mb-4 p-4 shadow-sm">

                <h5>
                    📦 Order #${order.order_id}
                </h5>

                <div class="mt-3">
                    ${itemsHTML}
                </div>

                <p class="mt-3">
                    <strong>
                        Total: ₹${order.total_amount}
                    </strong>
                </p>
<p>
    Date:
    ${new Date(order.created_at).toLocaleString()}
</p>
                <p>
                    Status:
                    <strong>
                        ${order.status}
                    </strong>
                </p>

            </div>
        `;
    });
}

// =================================
// LOAD WISHLIST FROM DJANGO API
// =================================

async function loadWishlist() {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/wishlist/${loggedInUser}/`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load wishlist"
            );
        }

        wishlist =
            await response.json();

        document.getElementById(
            "wishlist-count"
        ).textContent =
            wishlist.length;

        displayWishlist();

        filterProducts();

    } catch (error) {

        console.error(
            "Error loading wishlist:",
            error
        );
    }
}


// =================================
// TOGGLE WISHLIST
// =================================

async function toggleWishlist(
    button,
    productName,
    productPrice
) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert(
            "Please login to use wishlist."
        );

        window.location.href = "login.html";

        return;
    }

    const product =
        products.find(
            item => item.name === productName
        );

    if (!product) {

        alert("Product not found.");

        return;
    }

    const existingProduct =
        wishlist.find(
            item => item.product_id === product.id
        );

    try {

        let response;

        if (!existingProduct) {

            response = await fetch(
                `${API_BASE_URL}/api/wishlist/add/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        username: loggedInUser,

                        product_id: product.id

                    })
                }
            );

        } else {

            response = await fetch(
                `${API_BASE_URL}/api/wishlist/remove/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        username: loggedInUser,

                        product_id: product.id

                    })
                }
            );
        }

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update wishlist."
            );

            return;
        }

        await loadWishlist();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =================================
// DISPLAY WISHLIST
// =================================

function displayWishlist() {

    const wishlistItems =
        document.getElementById(
            "wishlist-items"
        );

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `
            <p>Your wishlist is empty.</p>
        `;

        return;
    }

    wishlistItems.innerHTML = "";

    wishlist.forEach((item, index) => {

        wishlistItems.innerHTML += `
            <div class="card mb-3">

                <div class="card-body
                    d-flex
                    justify-content-between
                    align-items-center">

                    <div>

                        <h5>
                            ${item.name}
                        </h5>

                        <p class="mb-0">
                            ₹${item.price}
                        </p>

                    </div>

                    <button
                        class="btn btn-danger"
                        onclick="removeWishlistItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;
    });
}


// =================================
// REMOVE WISHLIST ITEM
// =================================

async function removeWishlistItem(index) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        alert("Please login first.");

        return;
    }

    const item =
        wishlist[index];

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/wishlist/remove/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: loggedInUser,

                    product_id: item.product_id

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to remove wishlist item."
            );

            return;
        }

        wishlist.splice(index, 1);

        document.getElementById(
            "wishlist-count"
        ).textContent =
            wishlist.length;

        displayWishlist();

        filterProducts();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


// =================================
// CONTACT FORM
// =================================

document
    .getElementById("contact-form")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();

            if (
                name === "" ||
                email === "" ||
                message === ""
            ) {

                alert(
                    "Please fill all the fields!"
                );

                return;
            }

            alert(
                "Message sent successfully!"
            );

            this.reset();
        }
    );


// =================================
// LOAD SAVED DATA
// =================================

updateCartCount();

displayCart();

document.getElementById(
    "wishlist-count"
).textContent =
    wishlist.length;

displayWishlist();


// =================================
// LOAD DATA FROM DJANGO
// =================================

loadProducts();

loadCart();

loadWishlist();
loadOrders();