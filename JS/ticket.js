
const ticketForm = document.getElementById("ticket-form");
const ticketTotal = document.getElementById("ticket-total");
const quantityInput = document.getElementById("quantity");
const decreaseButton = document.getElementById("decrease-quantity");
const increaseButton = document.getElementById("increase-quantity");

const ticketRadios = document.querySelectorAll('input[name="ticket"]');

function getSelectedPrice() {
    const selectedTicket = document.querySelector(
        'input[name="ticket"]:checked'
    );

    return Number(selectedTicket?.dataset.price || 3500);
}

function getQuantity() {
    const quantity = Number(quantityInput.value);

    if (!Number.isFinite(quantity)) {
        return 1;
    }

    return Math.min(10, Math.max(1, Math.floor(quantity)));
}

function updateTotal() {
    const quantity = getQuantity();

    quantityInput.value = quantity;

    const total = getSelectedPrice() * quantity;

    ticketTotal.textContent = total.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    });
}

ticketRadios.forEach((radio) => {
    radio.addEventListener("change", updateTotal);
});

quantityInput.addEventListener("change", updateTotal);

decreaseButton.addEventListener("click", () => {
    quantityInput.value = getQuantity() - 1;
    updateTotal();
});

increaseButton.addEventListener("click", () => {
    quantityInput.value = getQuantity() + 1;
    updateTotal();
});

ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedTicket = document.querySelector(
        'input[name="ticket"]:checked'
    );

    const quantity = getQuantity();
    const price = getSelectedPrice();
    const total = price * quantity;

    alert(
        `Ticket selection preview\n\n` +
        `Ticket: ${selectedTicket.value}\n` +
        `Quantity: ${quantity}\n` +
        `Total: ₦${total.toLocaleString("en-NG")}\n\n` +
        `Checkout will be connected later.`
    );
});

updateTotal();


// Mobile navigation
const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("main-navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("show");

        menuButton.classList.toggle("active", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });
}
