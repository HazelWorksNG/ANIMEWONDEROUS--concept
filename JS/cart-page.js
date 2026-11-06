/* =====================================================
   ANIMEWONDEROUS — CART PAGE
===================================================== */

(() => {
    "use strict";

    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const cartSummary = document.getElementById("cart-summary");

    const itemCount = document.getElementById("cart-item-count");
    const summaryQuantity = document.getElementById("summary-quantity");
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");

    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout-button");

    if (!cartItemsContainer || !window.AWCart) return;

    const formatPrice = price => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(price);
    };

    const escapeHTML = value => {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    };

    function renderCart() {
        const items = AWCart.getCartItems();
        const totalQuantity = AWCart.getCartCount();
        const subtotal = AWCart.getSubtotal();

        const hasItems = items.length > 0;

        emptyCart.hidden = hasItems;
        cartSummary.hidden = !hasItems;
        cartItemsContainer.hidden = !hasItems;
        clearCartButton.hidden = !hasItems;

        itemCount.textContent = `(${totalQuantity})`;
        summaryQuantity.textContent = totalQuantity;

        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(subtotal);

        if (!hasItems) {
            cartItemsContainer.innerHTML = "";
            return;
        }

        cartItemsContainer.innerHTML = items.map(item => {
            const image = escapeHTML(item.image || "");
            const name = escapeHTML(item.name);
            const category = escapeHTML(item.category || "Merchandise");
            const id = escapeHTML(item.id);

            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;

            return `
                <article class="cart-item" data-product-id="${id}">

                    <div class="cart-item-image">
                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="this.style.opacity='0'"
                        >
                    </div>

                    <div class="cart-item-info">

                        <p class="cart-item-category">
                            ${category}
                        </p>

                        <h3>${name}</h3>

                        <p class="cart-item-price">
                            ${formatPrice(price)}
                        </p>

                        <div class="cart-item-actions">

                            <div class="quantity-control">

                                <button
                                    type="button"
                                    data-action="decrease"
                                    aria-label="Decrease quantity">
                                    −
                                </button>

                                <span>${quantity}</span>

                                <button
                                    type="button"
                                    data-action="increase"
                                    aria-label="Increase quantity">
                                    +
                                </button>

                            </div>

                            <button
                                type="button"
                                class="remove-item"
                                data-action="remove">
                                Remove
                            </button>

                        </div>

                    </div>

                    <strong class="cart-item-total">
                        ${formatPrice(price * quantity)}
                    </strong>

                </article>
            `;
        }).join("");
    }


    /* QUANTITY AND REMOVE ACTIONS */

    cartItemsContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");

        if (!button) return;

        const cartItem = button.closest(".cart-item");

        if (!cartItem) return;

        const productId = cartItem.dataset.productId;
        const action = button.dataset.action;

        const item = AWCart.getCartItems().find(
            product => product.id === productId
        );

        if (!item) return;

        if (action === "increase") {
            AWCart.updateQuantity(
                productId,
                item.quantity + 1
            );
        }

        if (action === "decrease") {
            AWCart.updateQuantity(
                productId,
                item.quantity - 1
            );
        }

        if (action === "remove") {
            AWCart.removeFromCart(productId);
        }

        renderCart();
    });


    /* CLEAR CART */

    clearCartButton.addEventListener("click", () => {
        if (!confirm("Are you sure you want to clear your cart?")) {
            return;
        }

        AWCart.clearCart();
        renderCart();
    });


    /* CHECKOUT */

    checkoutButton.addEventListener("click", () => {
        alert("Checkout is not available yet. We'll be adding this soon!");
    });


    /* SYNC CART */

    window.addEventListener("aw-cart-updated", renderCart);

    window.addEventListener("storage", event => {
        if (
            event.key === "awCart" ||
            event.key === "animewonderous-demo-products"
        ) {
            renderCart();
        }
    });


    /* INITIALIZE */

    renderCart();

})();