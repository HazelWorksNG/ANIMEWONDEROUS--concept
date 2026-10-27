
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const resetForm = document.getElementById("reset-form");

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const heading = document.getElementById("form-heading");
const description = document.getElementById("form-description");

function getReturnURL() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("return");

    // Only allow known local pages. Never redirect to an arbitrary URL.
    const allowedPages = ["ticket.html", "index.html", "shop.html"];

    if (requested && allowedPages.includes(requested)) {
        return requested;
    }

    return "ticket.html";
}

function showForm(formName) {
    loginForm.hidden = formName !== "login";
    registerForm.hidden = formName !== "register";
    resetForm.hidden = formName !== "reset";

    loginTab.classList.toggle("active", formName === "login");
    registerTab.classList.toggle("active", formName === "register");

    loginTab.setAttribute("aria-selected", String(formName === "login"));
    registerTab.setAttribute("aria-selected", String(formName === "register"));

    loginTab.tabIndex = formName === "login" ? 0 : -1;
    registerTab.tabIndex = formName === "register" ? 0 : -1;

    if (formName === "login") {
        heading.textContent = "Welcome back.";
        description.textContent = "Sign in to continue your adventure.";
    } else if (formName === "register") {
        heading.textContent = "Join the community.";
        description.textContent = "Create your Animewonderous account.";
    } else {
        heading.textContent = "Reset your password.";
        description.textContent = "We'll help you get back into your account.";
    }

    document.querySelectorAll(".form-message").forEach((message) => {
        message.textContent = "";
        message.classList.remove("success");
    });
}

loginTab.addEventListener("click", () => showForm("login"));
registerTab.addEventListener("click", () => showForm("register"));

document.querySelectorAll("[data-switch]").forEach((button) => {
    button.addEventListener("click", () => {
        showForm(button.dataset.switch);
    });
});

document.getElementById("forgot-password").addEventListener("click", () => {
    document.getElementById("reset-email").value =
        document.getElementById("login-email").value;

    showForm("reset");
});


// Password visibility
document.querySelectorAll("[data-password]").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.password);
        const showing = input.type === "text";

        input.type = showing ? "password" : "text";
        button.textContent = showing ? "Show" : "Hide";
        button.setAttribute(
            "aria-label",
            showing ? "Show password" : "Hide password"
        );
    });
});


// Temporary frontend-only form responses
function showMessage(elementId, message, isSuccess = false) {
    const element = document.getElementById(elementId);

    element.textContent = message;
    element.classList.toggle("success", isSuccess);
}


// LOGIN
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showMessage(
        "login-message",
        "The login interface is ready, but real authentication has not been connected yet."
    );
});


// REGISTER
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = document.getElementById("register-password").value;
    const confirmation = document.getElementById("confirm-password").value;

    if (password.length < 8) {
        showMessage(
            "register-message",
            "Your password must contain at least 8 characters."
        );
        return;
    }

    if (password !== confirmation) {
        showMessage(
            "register-message",
            "Your passwords do not match. Please check them."
        );
        return;
    }

    showMessage(
        "register-message",
        "Your form looks good! Real account creation will be available when authentication is connected."
    );
});


// PASSWORD RESET
resetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showMessage(
        "reset-message",
        "Password reset will work after an authentication service is connected."
    );
});


// Restore a requested form, if specified
const pageParams = new URLSearchParams(window.location.search);

if (pageParams.get("mode") === "register") {
    showForm("register");
} else {
    showForm("login");
}


// Preserve the ticket selection and quantity when redirecting to login.
const ticketParams = new URLSearchParams(window.location.search);

const ticket = ticketParams.get("ticket");
const quantity = ticketParams.get("quantity");

if (ticket || quantity) {
    const ticketURL = new URL(getReturnURL(), window.location.href);

    if (ticket) {
        ticketURL.searchParams.set("ticket", ticket);
    }

    if (quantity && /^\d+$/.test(quantity)) {
        const parsedQuantity = Number(quantity);

        if (parsedQuantity >= 1 && parsedQuantity <= 10) {
            ticketURL.searchParams.set("quantity", String(parsedQuantity));
        }
    }

    // Keep the intended destination available for future authentication integration.
    window.sessionStorage.setItem(
        "animewonderous_return_url",
        ticketURL.pathname + ticketURL.search
    );
}
