/* =====================================================
   ANIMEWONDEROUS — SHOPPING CART
===================================================== */

(() => {
    "use strict";

    const CART_KEY = "awCart";
    const PRODUCTS_KEY = "animewonderous-demo-products";

    const starterProducts = [
        {
            id: "aw-001",
            name: "Naruto Headband Ring",
            price: 8000,
            image: "ASSETS/naruto-ring.jpg",
            stock: 24
        },
        {
            id: "aw-002",
            name: "Akatsuki Bracelet",
            price: 5500,
            image: "ASSETS/akatsuki-bracelet.jpg",
            stock: 18
        },
        {
            id: "aw-003",
            name: "Nezuko Figure",
            price: 25000,
            image: "ASSETS/nezuko-figure.jpg",
            stock: 8
        },
        {
            id: "aw-004",
            name: "Akatsuki Cloak",
            price: 30000,
            image: "ASSETS/akatsuki-cloak.jpg",
            stock: 12
        }
    ];

    function getProducts() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(PRODUCTS_KEY)
            );

            return Array.isArray(saved) ? saved : starterProducts;
        } catch {
            return starterProducts;
        }
    }

    function getCart() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();

        window.dispatchEvent(new Event("aw-cart-updated"));
    }

    function getCartItems() {
        const products = getProducts();

        return getCart()
            .map(item => {
                const product = products.find(
                    product => product.id === item.id
                );

                if (!product) return null;

                return {
                    ...product,
                    quantity: Number(item.quantity) || 0
                };
            })
            .filter(item => item && item.quantity > 0);
    }

    function getCartCount() {
        return getCart().reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );
    }

    function updateCartBadge() {
        const count = getCartCount();

        document.querySelectorAll(".cart-count").forEach(badge => {
            badge.textContent = count;
            badge.hidden = count === 0;
        });
    }

    function addToCart(productId) {
        const products = getProducts();

        const product = products.find(
            item => item.id === productId
        );

        if (!product) {
            console.warn("Product not found in catalogue:", productId);
            return false;
        }

        const cart = getCart();

        const existing = cart.find(
            item => item.id === productId
        );

        const currentQuantity = existing
            ? Number(existing.quantity) || 0
            : 0;

        if (currentQuantity >= Number(product.stock)) {
            alert("Sorry, this product has reached its available stock.");
            return false;
        }

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: productId,
                quantity: 1
            });
        }

        saveCart(cart);
        return true;
    }

    function removeFromCart(productId) {
        const cart = getCart().filter(
            item => item.id !== productId
        );

        saveCart(cart);
    }

    function updateQuantity(productId, quantity) {
        const cart = getCart();

        const item = cart.find(
            item => item.id === productId
        );

        if (!item) return;

        const products = getProducts();
        const product = products.find(
            product => product.id === productId
        );

        if (!product) {
            removeFromCart(productId);
            return;
        }

        quantity = Math.floor(Number(quantity));

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (quantity > Number(product.stock)) {
            quantity = Number(product.stock);
        }

        item.quantity = quantity;
        saveCart(cart);
    }

    function clearCart() {
        saveCart([]);
    }

    function getSubtotal() {
        return getCartItems().reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }

    window.AWCart = {
        getCart,
        getCartItems,
        getCartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        updateCartBadge
    };

    /* ADD TO CART BUTTONS */

    document.addEventListener("click", event => {
        const button = event.target.closest(".product-cart");

        if (!button) return;

        const card = button.closest(".shop-product");

        if (!card) return;

        const productId = card.dataset.productId;

        if (!productId) {
            console.warn("This product has no product ID:", card);
            return;
        }

        const added = addToCart(productId);

        if (!added) return;

        const originalHTML = button.innerHTML;

        button.classList.add("added");
        button.innerHTML = "✓";

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove("added");
        }, 900);
    });

    /* INITIALIZE AND SYNC */

    updateCartBadge();

    window.addEventListener("storage", event => {
        if (event.key === CART_KEY) {
            updateCartBadge();
        }
    });

    window.addEventListener("aw-cart-updated", updateCartBadge);

})();