/* =========================================================
   1. STORAGE CONFIGURATION
========================================================= */

const STORAGE_KEYS = {
    products: "animewonderous-demo-products",
    orders: "animewonderous-demo-orders",
    events: "animewonderous-demo-events"
};


/* =========================================================
   2. STARTER DATA
========================================================= */

const starterProducts = [
    {
        id: "aw-001",
        name: "Naruto Headband Ring",
        category: "Accessories",
        price: 8000,
        stock: 24,
        image: "ASSETS/naruto-ring.jpg"
    },
    {
        id: "aw-002",
        name: "Akatsuki Bracelet",
        category: "Accessories",
        price: 5500,
        stock: 18,
        image: "ASSETS/akatsuki-bracelet.jpg"
    },
    {
        id: "aw-003",
        name: "Nezuko Figure",
        category: "Figures",
        price: 25000,
        stock: 8,
        image: "ASSETS/nezuko-figure.jpg"
    },
    {
        id: "aw-004",
        name: "Akatsuki Cloak",
        category: "Clothing",
        price: 30000,
        stock: 12,
        image: "ASSETS/akatsuki-cloak.jpg"
    }
];

const starterOrders = [
    {
        id: "AW-1001",
        customer: "Chika Okafor",
        email: "chika@example.com",
        phone: "+234 801 234 5678",
        date: "2026-10-29",
        items: [
            {
                name: "Naruto Headband Ring",
                quantity: 2,
                price: 8000
            }
        ],
        total: 16000,
        payment: "Paid",
        status: "Pending"
    },
    {
        id: "AW-1002",
        customer: "David Eze",
        email: "david@example.com",
        phone: "+234 802 345 6789",
        date: "2026-10-29",
        items: [
            {
                name: "Akatsuki Cloak",
                quantity: 1,
                price: 30000
            },
            {
                name: "Akatsuki Bracelet",
                quantity: 1,
                price: 5500
            }
        ],
        total: 35500,
        payment: "Paid",
        status: "Processing"
    },
    {
        id: "AW-1003",
        customer: "Amara Nwosu",
        email: "amara@example.com",
        phone: "+234 803 456 7890",
        date: "2026-10-30",
        items: [
            {
                name: "Nezuko Figure",
                quantity: 1,
                price: 25000
            }
        ],
        total: 25000,
        payment: "Pending",
        status: "Pending"
    },
    {
        id: "AW-1004",
        customer: "Daniel James",
        email: "daniel@example.com",
        phone: "+234 804 567 8901",
        date: "2026-10-30",
        items: [
            {
                name: "Naruto Headband Ring",
                quantity: 1,
                price: 8000
            }
        ],
        total: 8000,
        payment: "Paid",
        status: "Completed"
    },
    {
        id: "AW-1005",
        customer: "Favour Obi",
        email: "favour@example.com",
        phone: "+234 805 678 9012",
        date: "2026-10-31",
        items: [
            {
                name: "Akatsuki Bracelet",
                quantity: 2,
                price: 5500
            }
        ],
        total: 11000,
        payment: "Paid",
        status: "Shipped"
    }
];

const starterEvents = [
    {
        id: "event-001",
        title: "Enugu Shibuya Fest",
        description:
            "An unforgettable celebration of anime, gaming, cosplay and Japanese pop culture.",
        date: "2026-12-20",
        venue: "Enugu, Nigeria",
        image: "ASSETS/shibuya-fest.jpg",
        ticketPrice: 5000,
        capacity: 500,
        status: "Published"
    },
    {
        id: "event-002",
        title: "The Ultimate Anime & Gaming Showdown",
        description:
            "Esports tournaments, cosplay competitions and an exciting artist alley.",
        date: "2027-01-15",
        venue: "Enugu, Nigeria",
        image: "ASSETS/anime-showdown.jpg",
        ticketPrice: 3500,
        capacity: 300,
        status: "Draft"
    }
];

/* =========================================================
   3. STORAGE HELPERS
========================================================= */

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);

        return saved === null
            ? [...fallback]
            : JSON.parse(saved);

    } catch (error) {
        console.error(`Could not load ${key}:`, error);
        return [...fallback];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;

    } catch (error) {
        console.error(`Could not save ${key}:`, error);
        notify("Could not save changes. Check browser storage.");
        return false;
    }
}


/* =========================================================
   4. APPLICATION STATE
========================================================= */

let products = loadData(
    STORAGE_KEYS.products,
    starterProducts
);

let orders = loadData(
    STORAGE_KEYS.orders,
    starterOrders
);

let events = loadData(
    STORAGE_KEYS.events,
    starterEvents
);

let editingProductId = null;
let editingEventId = null;
let selectedOrderId = null;


/* =========================================================
   5. DOM REFERENCES
========================================================= */

const content = document.getElementById("admin-content");
const pageTitle = document.getElementById("page-title");
const toast = document.getElementById("admin-toast");

const sidebar = document.getElementById("admin-sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");


/* =========================================================
   6. GENERAL HELPERS
========================================================= */

const money = amount =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


function notify(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timeout);

    notify.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function formatDate(date) {
    if (!date) return "Not specified";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return escapeHTML(date);
    }

    return parsed.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


/* =========================================================
   7. DASHBOARD
========================================================= */

function renderDashboard() {
    pageTitle.textContent = "Dashboard";

    const totalValue = products.reduce(
        (sum, product) =>
            sum + Number(product.price) * Number(product.stock),
        0
    );

    const lowStock = products.filter(
        product => Number(product.stock) < 5
    ).length;

    const upcomingEvents = events.filter(event =>
        event.status === "Published" &&
        event.date >= new Date().toISOString().slice(0, 10)
    ).length;

    const paidRevenue = orders
        .filter(order => order.payment === "Paid")
        .reduce((sum, order) => sum + Number(order.total), 0);

    content.innerHTML = `
        <div class="admin-stats">

            <article class="stat-card">
                <p>Total Products</p>
                <strong>${products.length}</strong>
                <span>Products in your catalogue</span>
            </article>

            <article class="stat-card">
                <p>Inventory Value</p>
                <strong>${money(totalValue)}</strong>
                <span>Estimated value of current stock</span>
            </article>

            <article class="stat-card">
                <p>Low Stock</p>
                <strong>${lowStock}</strong>
                <span>Products with fewer than 5 units</span>
            </article>

            <article class="stat-card">
                <p>Upcoming Events</p>
                <strong>${upcomingEvents}</strong>
                <span>Published upcoming events</span>
            </article>

        </div>

        <div class="admin-grid">

            <section class="admin-panel">
                <div class="admin-section-heading">
                    <div>
                        <h2>Product inventory</h2>
                        <p class="admin-muted">
                            Manage your shop catalogue.
                        </p>
                    </div>

                    <button class="admin-button"
                        data-action="products">
                        Manage products →
                    </button>
                </div>

                <p class="admin-muted">
                    ${products.length} products currently in your catalogue.
                </p>
            </section>

            <section class="admin-panel">
                <h2>Quick actions</h2>

                <p class="admin-muted">
                    Manage your shop and events.
                </p>

                <br>

                <button class="admin-button"
                    data-action="add-product">
                    + Add product
                </button>

                <br><br>

                <button class="admin-button secondary"
                    data-action="add-event">
                    + Create event
                </button>
            </section>

        </div>

        <div class="admin-stats">

            <article class="stat-card">
                <p>Total Orders</p>
                <strong>${orders.length}</strong>
                <span>All recorded orders</span>
            </article>

            <article class="stat-card">
                <p>Paid Revenue</p>
                <strong>${money(paidRevenue)}</strong>
                <span>From paid demo orders</span>
            </article>

            <article class="stat-card">
                <p>Total Events</p>
                <strong>${events.length}</strong>
                <span>All recorded events</span>
            </article>

            <article class="stat-card">
                <p>Published Events</p>
                <strong>${events.filter(e => e.status === "Published").length}</strong>
                <span>Currently published in the demo</span>
            </article>

        </div>

        <section class="admin-panel">
            <div class="admin-section-heading">
                <div>
                    <h2>Recently added products</h2>
                    <p class="admin-muted">
                        Your latest catalogue entries.
                    </p>
                </div>
            </div>

            ${renderProductTable(products.slice(-4).reverse())}
        </section>
    `;
}


/* =========================================================
   8. PRODUCTS
========================================================= */

function renderProducts() {
    pageTitle.textContent = "Products";
    editingProductId = null;

    content.innerHTML = `
        <section class="admin-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>Product management</h2>
                    <p class="admin-muted">
                        Add, edit, search and remove shop products.
                    </p>
                </div>

                <button class="admin-button"
                    data-action="add-product">
                    + Add product
                </button>
            </div>

            <input
                class="admin-search"
                id="product-search"
                type="search"
                placeholder="Search products or categories..."
            >

            <div id="product-table" style="margin-top:20px">
                ${renderProductTable(products)}
            </div>

        </section>

        <section class="admin-panel"
            id="product-form-panel"
            style="margin-top:20px">

            ${renderProductForm()}

        </section>
    `;
}


function renderProductTable(list) {
    if (!list.length) {
        return `<p class="admin-empty">No products found.</p>`;
    }

    return `
        <div class="admin-table-wrap">

            <table class="admin-table">

                <thead>
                    <tr>
                        <th>PRODUCT</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>

                    ${list.map(product => `
                        <tr>

                            <td>
                                <div class="admin-product">

                                    <img
                                        src="${escapeHTML(product.image)}"
                                        alt=""
                                        onerror="this.style.visibility='hidden'"
                                    >

                                    <div>
                                        <strong>
                                            ${escapeHTML(product.name)}
                                        </strong>

                                        <small>
                                            ${escapeHTML(product.category)}
                                        </small>
                                    </div>

                                </div>
                            </td>

                            <td>${money(product.price)}</td>

                            <td>${Number(product.stock)}</td>

                            <td>
                                <div class="admin-actions">

                                    <button
                                        data-edit="${escapeHTML(product.id)}">
                                        Edit
                                    </button>

                                    <button
                                        class="delete-product"
                                        data-delete="${escapeHTML(product.id)}">
                                        Delete
                                    </button>

                                </div>
                            </td>

                        </tr>
                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


function renderProductForm(product = null) {
    return `
        <div class="admin-section-heading">
            <div>
                <h2>${product ? "Edit product" : "Add a product"}</h2>
                <p class="admin-muted">
                    Fill in the product details below.
                </p>
            </div>
        </div>

        <form id="product-form">

            <div class="admin-form-grid">

                <div class="admin-field">
                    <label for="product-name">Product name *</label>

                    <input
                        id="product-name"
                        name="name"
                        required
                        maxlength="100"
                        value="${escapeHTML(product?.name ?? "")}"
                    >
                </div>

                <div class="admin-field">
                    <label for="product-category">Category *</label>

                    <select id="product-category"
                        name="category" required>

                        ${[
                            "Accessories",
                            "Figures",
                            "Clothing",
                            "Collectibles",
                            "Other"
                        ].map(category => `
                            <option value="${category}"
                                ${product?.category === category ? "selected" : ""}>
                                ${category}
                            </option>
                        `).join("")}

                    </select>
                </div>

                <div class="admin-field">
                    <label for="product-price">Price (₦) *</label>

                    <input
                        id="product-price"
                        name="price"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value="${product?.price ?? ""}"
                    >
                </div>

                <div class="admin-field">
                    <label for="product-stock">Stock quantity *</label>

                    <input
                        id="product-stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value="${product?.stock ?? ""}"
                    >
                </div>

                <div class="admin-field full-width">
                    <label for="product-image">Image path or URL</label>

                    <input
                        id="product-image"
                        name="image"
                        placeholder="ASSETS/product.jpg"
                        value="${escapeHTML(product?.image ?? "")}"
                    >
                </div>

            </div>

            <div class="admin-actions">

                <button class="admin-button" type="submit">
                    ${product ? "Save changes" : "Add product"}
                </button>

                ${product ? `
                    <button class="admin-button secondary"
                        type="button"
                        data-action="cancel-product">
                        Cancel
                    </button>
                ` : ""}

            </div>

        </form>
    `;
}


function editProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    editingProductId = id;

    const panel = document.getElementById("product-form-panel");

    if (!panel) return;

    panel.innerHTML = renderProductForm(product);

    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("product-name")?.focus();
}


function addOrUpdateProduct(form) {
    const formData = new FormData(form);

    const name = String(formData.get("name")).trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    if (
        !name ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        notify("Please check the product details.");
        return;
    }

    const product = {
        id: editingProductId || `aw-${Date.now()}`,
        name,
        category: String(formData.get("category")),
        price,
        stock,
        image: String(formData.get("image")).trim()
    };

    const updatedProducts = editingProductId
        ? products.map(item =>
            item.id === editingProductId ? product : item
        )
        : [...products, product];

    if (!saveData(STORAGE_KEYS.products, updatedProducts)) return;

    products = updatedProducts;
    editingProductId = null;

    renderProducts();
    notify("Product saved successfully!");
}


function filterProducts() {
    const query = (
        document.getElementById("product-search")?.value || ""
    ).toLowerCase().trim();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    const table = document.getElementById("product-table");

    if (table) {
        table.innerHTML = renderProductTable(filtered);
    }
}


/* =========================================================
   9. ORDERS
========================================================= */

function renderOrders() {
    pageTitle.textContent = "Orders";

    selectedOrderId = null;

    const totalRevenue = orders
        .filter(order => order.payment === "Paid")
        .reduce((sum, order) => sum + Number(order.total), 0);

    const pending = orders.filter(
        order => order.status === "Pending"
    ).length;

    const completed = orders.filter(
        order => order.status === "Completed"
    ).length;

    content.innerHTML = `
        <div class="admin-stats">

            <article class="stat-card">
                <p>Total Orders</p>
                <strong>${orders.length}</strong>
                <span>All recorded orders</span>
            </article>

            <article class="stat-card">
                <p>Paid Revenue</p>
                <strong>${money(totalRevenue)}</strong>
                <span>From paid orders only</span>
            </article>

            <article class="stat-card">
                <p>Pending</p>
                <strong>${pending}</strong>
                <span>Awaiting processing</span>
            </article>

            <article class="stat-card">
                <p>Completed</p>
                <strong>${completed}</strong>
                <span>Successfully fulfilled</span>
            </article>

        </div>

        <section class="admin-panel orders-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>All orders</h2>
                    <p class="admin-muted">
                        Track and manage customer purchases.
                    </p>
                </div>

                <span class="orders-count">
                    ${orders.length} orders
                </span>
            </div>

            <div class="orders-toolbar">

                <input
                    type="search"
                    class="admin-search"
                    id="order-search"
                    placeholder="Search order ID or customer..."
                >

                <select id="order-filter">
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

            </div>

            <div id="orders-table">
                ${renderOrderTable(orders)}
            </div>

        </section>

        <div id="order-details"></div>

        <p class="admin-muted orders-demo-note">
            Demo mode: order records are stored in this browser.
            No live payment or delivery service is connected.
        </p>
    `;
}


function renderOrderTable(list) {
    if (!list.length) {
        return `<div class="admin-empty">No orders match your search.</div>`;
    }

    return `
        <div class="admin-table-wrap">

            <table class="admin-table orders-table">

                <thead>
                    <tr>
                        <th>ORDER</th>
                        <th>CUSTOMER</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>

                <tbody>

                    ${list.map(order => `
                        <tr>

                            <td>
                                <strong>${escapeHTML(order.id)}</strong>
                            </td>

                            <td>
                                <div class="order-customer">
                                    <strong>
                                        ${escapeHTML(order.customer)}
                                    </strong>

                                    <small>
                                        ${escapeHTML(order.email)}
                                    </small>
                                </div>
                            </td>

                            <td>${formatDate(order.date)}</td>

                            <td><strong>${money(order.total)}</strong></td>

                            <td>
                                <span class="order-badge ${escapeHTML(order.payment.toLowerCase())}">
                                    ${escapeHTML(order.payment)}
                                </span>
                            </td>

                            <td>
                                <span class="order-badge ${escapeHTML(order.status.toLowerCase())}">
                                    ${escapeHTML(order.status)}
                                </span>
                            </td>

                            <td>
                                <button class="order-view-btn"
                                    data-order-view="${escapeHTML(order.id)}">
                                    View
                                </button>
                            </td>

                        </tr>
                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


function renderOrderDetails(order) {
    const details = document.getElementById("order-details");

    if (!details || !order) return;

    details.innerHTML = `
        <section class="admin-panel order-details-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>Order ${escapeHTML(order.id)}</h2>
                    <p class="admin-muted">
                        Customer and purchase information.
                    </p>
                </div>

                <button class="admin-button secondary"
                    data-action="close-order">
                    Close
                </button>
            </div>

            <div class="order-details-grid">

                <div>
                    <p class="admin-muted">Customer</p>
                    <strong>${escapeHTML(order.customer)}</strong>
                </div>

                <div>
                    <p class="admin-muted">Email</p>
                    <strong>${escapeHTML(order.email)}</strong>
                </div>

                <div>
                    <p class="admin-muted">Phone</p>
                    <strong>${escapeHTML(order.phone)}</strong>
                </div>

                <div>
                    <p class="admin-muted">Order date</p>
                    <strong>${formatDate(order.date)}</strong>
                </div>

                <div>
                    <p class="admin-muted">Payment</p>
                    <strong>${escapeHTML(order.payment)}</strong>
                </div>

                <div>
                    <p class="admin-muted">Total</p>
                    <strong>${money(order.total)}</strong>
                </div>

            </div>

            <h3>Order items</h3>

            <div class="order-items">

                ${(Array.isArray(order.items) ? order.items : []).map(item => `
                    <div class="order-item">
                        <span>
                            ${escapeHTML(item.name)}
                            × ${Number(item.quantity)}
                        </span>

                        <strong>
                            ${money(Number(item.price) * Number(item.quantity))}
                        </strong>
                    </div>
                `).join("")}

            </div>

            <div class="order-update">

                <label for="order-status-update">
                    Update order status
                </label>

                <select id="order-status-update">
                    ${[
                        "Pending",
                        "Processing",
                        "Shipped",
                        "Completed",
                        "Cancelled"
                    ].map(status => `
                        <option value="${status}"
                            ${order.status === status ? "selected" : ""}>
                            ${status}
                        </option>
                    `).join("")}
                </select>

                <button class="admin-button"
                    data-action="update-order"
                    data-order-id="${escapeHTML(order.id)}">
                    Save status
                </button>

            </div>

        </section>
    `;

    selectedOrderId = order.id;

    details.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function filterOrders() {
    const query = (
        document.getElementById("order-search")?.value || ""
    ).toLowerCase().trim();

    const status = (
        document.getElementById("order-filter")?.value || "All"
    );

    const filtered = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(query) ||
            order.customer.toLowerCase().includes(query) ||
            order.email.toLowerCase().includes(query);

        const matchesStatus =
            status === "All" || order.status === status;

        return matchesSearch && matchesStatus;
    });

    const table = document.getElementById("orders-table");

    if (table) {
        table.innerHTML = renderOrderTable(filtered);
    }
}


/* =========================================================
   10. EVENTS
========================================================= */

function renderEvents() {
    pageTitle.textContent = "Events";
    editingEventId = null;

    const published = events.filter(
        event => event.status === "Published"
    ).length;

    const drafts = events.filter(
        event => event.status === "Draft"
    ).length;

    const completed = events.filter(
        event => event.status === "Completed"
    ).length;

    content.innerHTML = `
        <div class="admin-stats">

            <article class="stat-card">
                <p>Total Events</p>
                <strong>${events.length}</strong>
                <span>All recorded events</span>
            </article>

            <article class="stat-card">
                <p>Published</p>
                <strong>${published}</strong>
                <span>Published event listings</span>
            </article>

            <article class="stat-card">
                <p>Drafts</p>
                <strong>${drafts}</strong>
                <span>Events not yet published</span>
            </article>

            <article class="stat-card">
                <p>Completed</p>
                <strong>${completed}</strong>
                <span>Past events</span>
            </article>

        </div>

        <section class="admin-panel events-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>Event management</h2>
                    <p class="admin-muted">
                        Create and manage Animewonderous events.
                    </p>
                </div>

                <button class="admin-button"
                    data-action="add-event">
                    + Create event
                </button>
            </div>

            <div class="events-toolbar">

                <input
                    type="search"
                    class="admin-search"
                    id="event-search"
                    placeholder="Search events..."
                >

                <select id="event-filter">
                    <option value="All">All statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

            </div>

            <div id="events-list">
                ${renderEventList(events)}
            </div>

        </section>

        <p class="admin-muted events-demo-note">
            Demo mode: event information is saved in this browser.
        </p>
    `;
}


function renderEventList(list) {
    if (!list.length) {
        return `<div class="admin-empty">No events found.</div>`;
    }

    return `
        <div class="admin-table-wrap">

            <table class="admin-table events-table">

                <thead>
                    <tr>
                        <th>EVENT</th>
                        <th>DATE</th>
                        <th>VENUE</th>
                        <th>PRICE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>

                    ${list.map(event => `
                        <tr>

                            <td>
                                <div class="event-admin-info">

                                    <img
                                        src="${escapeHTML(event.image || "")}"
                                        alt=""
                                        onerror="this.style.visibility='hidden'"
                                    >

                                    <div>
                                        <strong>
                                            ${escapeHTML(event.title)}
                                        </strong>

                                        <small>
                                            ${escapeHTML(event.id)}
                                        </small>
                                    </div>

                                </div>
                            </td>

                            <td>${formatDate(event.date)}</td>

                            <td>${escapeHTML(event.venue)}</td>

                            <td>${money(event.ticketPrice)}</td>

                            <td>
                                <span class="event-status ${escapeHTML(event.status.toLowerCase())}">
                                    ${escapeHTML(event.status)}
                                </span>
                            </td>

                            <td>
                                <div class="admin-actions">

                                    <button
                                        data-event-edit="${escapeHTML(event.id)}">
                                        Edit
                                    </button>

                                    <button
                                        data-event-toggle="${escapeHTML(event.id)}">
                                        ${event.status === "Published"
                                            ? "Unpublish"
                                            : "Publish"}
                                    </button>

                                    <button
                                        class="delete-product"
                                        data-event-delete="${escapeHTML(event.id)}">
                                        Delete
                                    </button>

                                </div>
                            </td>

                        </tr>
                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}

function renderEventForm(event = null) {
    return `
        <section class="admin-panel event-form-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>${event ? "Edit event" : "Create an event"}</h2>
                    <p class="admin-muted">
                        Enter the details for your event.
                    </p>
                </div>
            </div>

            <form id="event-form">

                <div class="admin-form-grid">

                    <div class="admin-field">
                        <label for="event-title">Event title *</label>

                        <input
                            id="event-title"
                            name="title"
                            required
                            maxlength="120"
                            value="${escapeHTML(event?.title ?? "")}"
                        >
                    </div>

                    <div class="admin-field">
                        <label for="event-date">Event date *</label>

                        <input
                            type="date"
                            id="event-date"
                            name="date"
                            required
                            value="${escapeHTML(event?.date ?? "")}"
                        >
                    </div>

                    <div class="admin-field">
                        <label for="event-venue">Venue *</label>

                        <input
                            id="event-venue"
                            name="venue"
                            required
                            maxlength="150"
                            value="${escapeHTML(event?.venue ?? "")}"
                        >
                    </div>

                    <div class="admin-field">
                        <label for="event-price">Starting ticket price (₦)</label>

                        <input
                            type="number"
                            id="event-price"
                            name="ticketPrice"
                            min="0"
                            step="1"
                            required
                            value="${event?.ticketPrice ?? 0}"
                        >
                    </div>

                    <div class="admin-field">
                        <label for="event-capacity">Ticket capacity</label>

                        <input
                            type="number"
                            id="event-capacity"
                            name="capacity"
                            min="1"
                            step="1"
                            required
                            value="${event?.capacity ?? 100}"
                        >
                    </div>

                    <div class="admin-field">
                        <label for="event-status">Event status</label>

                        <select id="event-status" name="status">
                            ${[
                                "Draft",
                                "Published",
                                "Completed",
                                "Cancelled"
                            ].map(status => `
                                <option value="${status}"
                                    ${event?.status === status ? "selected" : ""}>
                                    ${status}
                                </option>
                            `).join("")}
                        </select>
                    </div>

                    <div class="admin-field full-width">
                        <label for="event-image">Event image path or URL</label>

                        <input
                            id="event-image"
                            name="image"
                            placeholder="ASSETS/event-banner.jpg"
                            value="${escapeHTML(event?.image ?? "")}"
                        >
                    </div>

                    <div class="admin-field full-width">
                        <label for="event-description">Description *</label>

                        <textarea
                            id="event-description"
                            name="description"
                            rows="5"
                            maxlength="2000"
                            required
                        >${escapeHTML(event?.description ?? "")}</textarea>
                    </div>

                </div>

                <div class="admin-actions">

                    <button class="admin-button" type="submit">
                        ${event ? "Save changes" : "Create event"}
                    </button>

                    <button class="admin-button secondary"
                        type="button"
                        data-action="cancel-event">
                        Cancel
                    </button>

                </div>

            </form>

        </section>
    `;
}

function editEvent(id) {
    const selectedEvent = events.find(item => item.id === id);

    if (!selectedEvent) return;

    editingEventId = id;
    content.innerHTML = renderEventForm(selectedEvent);

    document.getElementById("event-title")?.focus();
}

function addOrUpdateEvent(form) {
    const formData = new FormData(form);

    const title = String(formData.get("title")).trim();
    const date = String(formData.get("date"));
    const venue = String(formData.get("venue")).trim();

    const ticketPrice = Number(formData.get("ticketPrice"));
    const capacity = Number(formData.get("capacity"));

    if (
        !title ||
        !date ||
        !venue ||
        !Number.isFinite(ticketPrice) ||
        ticketPrice < 0 ||
        !Number.isInteger(capacity) ||
        capacity < 1
    ) {
        notify("Please check the event details.");
        return;
    }

    const event = {
        id: editingEventId || `event-${Date.now()}`,
        title,
        description: String(formData.get("description")).trim(),
        date,
        venue,
        image: String(formData.get("image")).trim(),
        ticketPrice,
        capacity,
        status: String(formData.get("status"))
    };

    const updatedEvents = editingEventId
        ? events.map(item =>
            item.id === editingEventId ? event : item
        )
        : [...events, event];

    if (!saveData(STORAGE_KEYS.events, updatedEvents)) return;

    events = updatedEvents;
    editingEventId = null;

    renderEvents();
    notify("Event saved successfully!");
}


function filterEvents() {
    const query = (
        document.getElementById("event-search")?.value || ""
    ).toLowerCase().trim();

    const status = (
        document.getElementById("event-filter")?.value || "All"
    );

    const filtered = events.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(query) ||
            event.venue.toLowerCase().includes(query);

        const matchesStatus =
            status === "All" || event.status === status;

        return matchesSearch && matchesStatus;
    });

    const list = document.getElementById("events-list");

    if (list) {
        list.innerHTML = renderEventList(filtered);
    }
}


/* =========================================================
   TICKETS MANAGEMENT
========================================================= */

const TICKET_STORAGE_KEY = "animewonderous-demo-tickets";

const starterTickets = [
    {
        id: "TKT-001",
        eventId: "event-001",
        customer: "Chika Okafor",
        email: "chika@example.com",
        reference: "PSK_DEMO_001",
        type: "VIP",
        amount: 15000,
        payment: "Paid",
        status: "Active",
        date: "2026-10-29"
    },
    {
        id: "TKT-002",
        eventId: "event-001",
        customer: "David Eze",
        email: "david@example.com",
        reference: "PSK_DEMO_002",
        type: "General",
        amount: 5000,
        payment: "Paid",
        status: "Used",
        date: "2026-10-30"
    },
    {
        id: "TKT-003",
        eventId: "event-001",
        customer: "Amara Nwosu",
        email: "amara@example.com",
        reference: "PSK_DEMO_003",
        type: "Early Bird",
        amount: 3500,
        payment: "Pending",
        status: "Active",
        date: "2026-10-31"
    }
];

let tickets = loadData(
    TICKET_STORAGE_KEY,
    starterTickets
);

function renderTickets() {
    pageTitle.textContent = "Tickets";

    const paidTickets = tickets.filter(
        ticket => ticket.payment === "Paid"
    );

    const activeTickets = tickets.filter(
        ticket => ticket.status === "Active"
    );

    const usedTickets = tickets.filter(
        ticket => ticket.status === "Used"
    );

    const revenue = paidTickets.reduce(
        (sum, ticket) => sum + Number(ticket.amount),
        0
    );

    content.innerHTML = `
        <div class="admin-stats">

            <article class="stat-card">
                <p>Total Tickets</p>
                <strong>${tickets.length}</strong>
                <span>All recorded tickets</span>
            </article>

            <article class="stat-card">
                <p>Paid Tickets</p>
                <strong>${paidTickets.length}</strong>
                <span>Successfully paid tickets</span>
            </article>

            <article class="stat-card">
                <p>Active Tickets</p>
                <strong>${activeTickets.length}</strong>
                <span>Available for check-in</span>
            </article>

            <article class="stat-card">
                <p>Ticket Revenue</p>
                <strong>${money(revenue)}</strong>
                <span>From paid demo tickets</span>
            </article>

        </div>

        <section class="admin-panel tickets-panel">

            <div class="admin-section-heading">
                <div>
                    <h2>Ticket management</h2>
                    <p class="admin-muted">
                        View ticket purchases and manage event check-ins.
                    </p>
                </div>

                <span class="orders-count">
                    ${usedTickets.length} used
                </span>
            </div>

            <div class="tickets-toolbar">

                <input
                    type="search"
                    class="admin-search"
                    id="ticket-search"
                    placeholder="Search customer, email or reference..."
                >

                <select id="ticket-filter">
                    <option value="All">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Used">Used</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

            </div>

            <div id="tickets-table">
                ${renderTicketTable(tickets)}
            </div>

        </section>

        <p class="admin-muted tickets-demo-note">
            Demo mode: these are sample ticket records.
            Payment verification and real ticket issuance are not connected.
        </p>
    `;
}

function renderTicketTable(list) {
    if (!list.length) {
        return `<div class="admin-empty">No tickets found.</div>`;
    }

    return `
        <div class="admin-table-wrap">

            <table class="admin-table tickets-table">

                <thead>
                    <tr>
                        <th>TICKET</th>
                        <th>CUSTOMER</th>
                        <th>EVENT</th>
                        <th>TYPE</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>

                <tbody>

                    ${list.map(ticket => {
                        const relatedEvent = events.find(
                            event => event.id === ticket.eventId
                        );

                        return `
                            <tr>

                                <td>
                                    <strong>
                                        ${escapeHTML(ticket.id)}
                                    </strong>
                                    <small class="ticket-reference">
                                        ${escapeHTML(ticket.reference)}
                                    </small>
                                </td>

                                <td>
                                    <div class="order-customer">
                                        <strong>
                                            ${escapeHTML(ticket.customer)}
                                        </strong>
                                        <small>
                                            ${escapeHTML(ticket.email)}
                                        </small>
                                    </div>
                                </td>

                                <td>
                                    ${escapeHTML(
                                        relatedEvent?.title || "Unknown event"
                                    )}
                                </td>

                                <td>${escapeHTML(ticket.type)}</td>

                                <td>${money(ticket.amount)}</td>

                                <td>
                                    <span class="order-badge ${ticket.payment.toLowerCase()}">
                                        ${escapeHTML(ticket.payment)}
                                    </span>
                                </td>

                                <td>
                                    <span class="ticket-status ${ticket.status.toLowerCase()}">
                                        ${escapeHTML(ticket.status)}
                                    </span>
                                </td>

                                <td>
                                    <div class="admin-actions">

                                        ${ticket.status === "Active" && ticket.payment === "Paid" ? `
                                            <button
                                                data-ticket-use="${escapeHTML(ticket.id)}">
                                                Mark used
                                            </button>
                                        ` : ""}

                                        ${ticket.status === "Used" ? `
                                            <button
                                                data-ticket-reactivate="${escapeHTML(ticket.id)}">
                                                Reactivate
                                            </button>
                                        ` : ""}

                                        ${ticket.status !== "Cancelled" ? `
                                            <button
                                                class="delete-product"
                                                data-ticket-cancel="${escapeHTML(ticket.id)}">
                                                Cancel
                                            </button>
                                        ` : ""}

                                    </div>
                                </td>

                            </tr>
                        `;
                    }).join("")}

                </tbody>

            </table>

        </div>
    `;
}

function updateTicketStatus(id, status) {
    const updatedTickets = tickets.map(ticket =>
        ticket.id === id
            ? { ...ticket, status }
            : ticket
    );

    if (!saveData(TICKET_STORAGE_KEY, updatedTickets)) return;

    tickets = updatedTickets;

    renderTickets();
    notify("Ticket status updated.");
}

function filterTickets() {
    const query = (
        document.getElementById("ticket-search")?.value || ""
    ).toLowerCase().trim();

    const status = (
        document.getElementById("ticket-filter")?.value || "All"
    );

    const filtered = tickets.filter(ticket => {
        const matchesSearch =
            ticket.id.toLowerCase().includes(query) ||
            ticket.customer.toLowerCase().includes(query) ||
            ticket.email.toLowerCase().includes(query) ||
            ticket.reference.toLowerCase().includes(query);

        const matchesStatus =
            status === "All" || ticket.status === status;

        return matchesSearch && matchesStatus;
    });

    const table = document.getElementById("tickets-table");

    if (table) {
        table.innerHTML = renderTicketTable(filtered);
    }
}

/* =========================================================
   11. NAVIGATION
========================================================= */

function showView(view) {
    document.querySelectorAll(".admin-nav-link").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.view === view
        );
    });

    editingProductId = null;
    editingEventId = null;

    const views = {
        dashboard: renderDashboard,
        products: renderProducts,
        orders: renderOrders,
        events: renderEvents,
        tickets: renderTickets
    };

    if (views[view]) {
        views[view]();
        return;
    }

    const labels = {
        tickets: "Tickets",
        customers: "Customers",
        community: "Community",
        collaborations: "Collaborations",
        settings: "Settings"
    };

    const title = labels[view] || "Dashboard";

    pageTitle.textContent = title;

    content.innerHTML = `
        <section class="admin-panel">
            <h2>${escapeHTML(title)}</h2>

            <p class="admin-muted">
                This section is planned for the next development stage.
                It is not connected to a database yet.
            </p>
        </section>
    `;
}


/* =========================================================
   12. CLICK EVENTS
========================================================= */

document.addEventListener("click", event => {

    /* SIDEBAR NAVIGATION */

    const navButton = event.target.closest(".admin-nav-link");

    if (navButton) {
        showView(navButton.dataset.view);

        if (sidebar?.classList.contains("open")) {
            sidebar.classList.remove("open");
            sidebarToggle?.setAttribute("aria-expanded", "false");
        }

        return;
    }


    /* PRODUCT EDIT */

    const editButton = event.target.closest("[data-edit]");

    if (editButton) {
        editProduct(editButton.dataset.edit);
        return;
    }


    /* PRODUCT DELETE */

    const deleteButton = event.target.closest("[data-delete]");

    if (deleteButton) {
        const product = products.find(
            item => item.id === deleteButton.dataset.delete
        );

        if (!product) return;

        if (confirm(`Delete "${product.name}"?`)) {
            const updatedProducts = products.filter(
                item => item.id !== product.id
            );

            if (!saveData(STORAGE_KEYS.products, updatedProducts)) return;

            products = updatedProducts;
            renderProducts();

            notify("Product deleted.");
        }

        return;
    }


    /* EVENT EDIT */

    const eventEditButton = event.target.closest("[data-event-edit]");

    if (eventEditButton) {
        editEvent(eventEditButton.dataset.eventEdit);
        return;
    }


    /* EVENT DELETE */

    const eventDeleteButton = event.target.closest("[data-event-delete]");

    if (eventDeleteButton) {
        const eventId = eventDeleteButton.dataset.eventDelete;

        const selectedEvent = events.find(
            item => item.id === eventId
        );

        if (!selectedEvent) return;

        if (confirm(`Delete "${selectedEvent.title}"?`)) {
            const updatedEvents = events.filter(
                item => item.id !== eventId
            );

            if (!saveData(STORAGE_KEYS.events, updatedEvents)) return;

            events = updatedEvents;
            renderEvents();

            notify("Event deleted.");
        }

        return;
    }


    /* EVENT PUBLISH / UNPUBLISH */

    const eventToggleButton = event.target.closest("[data-event-toggle]");

    if (eventToggleButton) {
        const eventId = eventToggleButton.dataset.eventToggle;

        const updatedEvents = events.map(item => {
            if (item.id !== eventId) return item;

            return {
                ...item,
                status: item.status === "Published"
                    ? "Draft"
                    : "Published"
            };
        });

        if (!saveData(STORAGE_KEYS.events, updatedEvents)) return;

        events = updatedEvents;
        renderEvents();

        notify("Event status updated.");
        return;
    }


    /* ORDER DETAILS */

    const orderButton = event.target.closest("[data-order-view]");

    if (orderButton) {
        const order = orders.find(
            item => item.id === orderButton.dataset.orderView
        );

        renderOrderDetails(order);
        return;
    }

    // TICKET ACTIONS
    const useTicket = event.target.closest("[data-ticket-use]");
    if (useTicket) {
        updateTicketStatus(useTicket.dataset.ticketUse, "Used");
        return;
    }

    const reactivateTicket = event.target.closest("[data-ticket-reactivate]");
    if (reactivateTicket) {
        updateTicketStatus(reactivateTicket.dataset.ticketReactivate, "Active");
        return;
    }

    const cancelTicket = event.target.closest("[data-ticket-cancel]");
    if (cancelTicket) {
        if (confirm("Cancel this ticket?")) {
            updateTicketStatus(cancelTicket.dataset.ticketCancel, "Cancelled");
        }
        return;
    }

    /* GENERAL ACTIONS */

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const action = actionButton.dataset.action;


    if (action === "products") {
        showView("products");
    }


    if (action === "add-product") {
        showView("products");

        document.getElementById("product-name")?.focus();
    }


    if (action === "cancel-product") {
        editingProductId = null;
        renderProducts();
    }


    if (action === "add-event") {
        editingEventId = null;
        content.innerHTML = renderEventForm();

        document.getElementById("event-title")?.focus();
    }


    if (action === "cancel-event") {
        editingEventId = null;
        renderEvents();
    }


    if (action === "close-order") {
        const details = document.getElementById("order-details");

        if (details) details.innerHTML = "";

        selectedOrderId = null;
    }


    if (action === "update-order") {
        const orderId = actionButton.dataset.orderId;

        const statusSelect = document.getElementById(
            "order-status-update"
        );

        if (!statusSelect) return;

        const newStatus = statusSelect.value;

        const updatedOrders = orders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        );

        if (!saveData(STORAGE_KEYS.orders, updatedOrders)) return;

        orders = updatedOrders;

        notify("Order status updated!");

        renderOrders();

        const updatedOrder = orders.find(
            order => order.id === orderId
        );

        if (updatedOrder) {
            renderOrderDetails(updatedOrder);
        }
    }

});


/* =========================================================
   13. FORM SUBMISSIONS
========================================================= */

document.addEventListener("submit", event => {

    if (event.target.id === "product-form") {
        event.preventDefault();
        addOrUpdateProduct(event.target);
        return;
    }

    if (event.target.id === "event-form") {
        event.preventDefault();
        addOrUpdateEvent(event.target);
    }

});


/* =========================================================
   14. SEARCH AND FILTER LISTENERS
========================================================= */

document.addEventListener("input", event => {

    if (event.target.id === "product-search") {
        filterProducts();
    }

    if (event.target.id === "order-search") {
        filterOrders();
    }

    if (event.target.id === "event-search") {
        filterEvents();
    }

});


document.addEventListener("change", event => {

    if (event.target.id === "order-filter") {
        filterOrders();
    }

    if (event.target.id === "event-filter") {
        filterEvents();
    }

});

document.addEventListener("input", event => {
    if (event.target.id === "ticket-search") {
        filterTickets();
    }
});

document.addEventListener("change", event => {
    if (event.target.id === "ticket-filter") {
        filterTickets();
    }
});

/* =========================================================
   15. SIDEBAR
========================================================= */

if (sidebar && sidebarToggle) {

    sidebarToggle.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = sidebar.classList.toggle("open");

        sidebarToggle.setAttribute("aria-expanded", isOpen);
    });


    document.addEventListener("click", event => {
        const clickedInsideSidebar = sidebar.contains(event.target);
        const clickedToggle = sidebarToggle.contains(event.target);

        if (
            sidebar.classList.contains("open") &&
            !clickedInsideSidebar &&
            !clickedToggle
        ) {
            sidebar.classList.remove("open");
            sidebarToggle.setAttribute("aria-expanded", "false");
        }
    });


    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            sidebar.classList.contains("open")
        ) {
            sidebar.classList.remove("open");
            sidebarToggle.setAttribute("aria-expanded", "false");
        }
    });

}


/* =========================================================
   16. INITIALISE ADMIN DASHBOARD
========================================================= */

renderDashboard();
