
const STORAGE_KEY = "animewonderous-demo-products";

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

// DEMO DATA LAYER
function getProducts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === null
            ? [...starterProducts]
            : JSON.parse(saved);
    } catch (error) {
        console.error("Could not read demo products:", error);
        return [...starterProducts];
    }
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

let products = getProducts();
let editingId = null;

const content = document.getElementById("admin-content");
const pageTitle = document.getElementById("page-title");
const toast = document.getElementById("admin-toast");

const money = amount =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);

function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");

    // Reset the toast without needing a separate timer variable.
    clearTimeout(notify.timeout);
    notify.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function renderDashboard() {
    const totalValue = products.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
    );

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
                <strong>${products.filter(p => p.stock < 5).length}</strong>
                <span>Products with fewer than 5 units</span>
            </article>
            <article class="stat-card">
                <p>Upcoming Events</p>
                <strong>1</strong>
                <span>Sample demo data</span>
            </article>
        </div>

        <div class="admin-grid">
            <section class="admin-panel">
                <div class="admin-section-heading">
                    <div>
                        <h2>Product inventory</h2>
                        <p class="admin-muted">Manage your shop catalogue.</p>
                    </div>
                    <button class="admin-button" data-action="products">
                        Manage products →
                    </button>
                </div>

                <p class="admin-muted">
                    Your product list is currently stored in this browser.
                    Database syncing has not been connected yet.
                </p>
            </section>

            <section class="admin-panel">
                <h2>Quick actions</h2>
                <p class="admin-muted">
                    Add a new product or review your catalogue.
                </p>
                <br>
                <button class="admin-button" data-action="add-product">
                    + Add product
                </button>
                <br><br>
                <button class="admin-button secondary"
                    data-action="products">
                    View inventory
                </button>
            </section>
        </div>

        <section class="admin-panel">
            <div class="admin-section-heading">
                <div>
                    <h2>Recently added</h2>
                    <p class="admin-muted">Your latest catalogue entries.</p>
                </div>
            </div>
            ${renderProductTable(products.slice(-4).reverse())}
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
                                        <strong>${escapeHTML(product.name)}</strong>
                                        <small>${escapeHTML(product.category)}</small>
                                    </div>
                                </div>
                            </td>
                            <td>${money(product.price)}</td>
                            <td>${product.stock}</td>
                            <td>
                                <div class="admin-actions">
                                    <button data-edit="${escapeHTML(product.id)}">
                                        Edit
                                    </button>
                                    <button class="delete-product"
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

function renderProducts() {
    pageTitle.textContent = "Products";

    content.innerHTML = `
        <section class="admin-panel">
            <div class="admin-section-heading">
                <div>
                    <h2>Product management</h2>
                    <p class="admin-muted">
                        Add, edit, search, and remove shop products.
                    </p>
                </div>
                <button class="admin-button" data-action="add-product">
                    + Add product
                </button>
            </div>

            <input class="admin-search" id="product-search"
                type="search" placeholder="Search products or categories...">

            <div id="product-table" style="margin-top: 20px">
                ${renderProductTable(products)}
            </div>
        </section>

        <section class="admin-panel" id="product-form-panel"
            style="margin-top: 20px">
            ${renderProductForm()}
        </section>
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
                    <input id="product-name" name="name" required
                        maxlength="100"
                        value="${escapeHTML(product?.name ?? "")}">
                </div>

                <div class="admin-field">
                    <label for="product-category">Category *</label>
                    <select id="product-category" name="category" required>
                        ${["Accessories", "Figures", "Clothing",
                            "Collectibles", "Other"].map(category => `
                            <option value="${category}"
                                ${product?.category === category ? "selected" : ""}>
                                ${category}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div class="admin-field">
                    <label for="product-price">Price (₦) *</label>
                    <input id="product-price" name="price"
                        type="number" min="0" step="1" required
                        value="${product?.price ?? ""}">
                </div>

                <div class="admin-field">
                    <label for="product-stock">Stock quantity *</label>
                    <input id="product-stock" name="stock"
                        type="number" min="0" step="1" required
                        value="${product?.stock ?? ""}">
                </div>

                <div class="admin-field full-width">
                    <label for="product-image">Image path or URL</label>
                    <input id="product-image" name="image"
                        placeholder="ASSETS/product.jpg or https://..."
                        value="${escapeHTML(product?.image ?? "")}">
                    <p class="admin-muted">
                        Use a project asset path or a publicly accessible
                        image URL for this demo.
                    </p>
                </div>
            </div>

            <div class="admin-actions">
                <button class="admin-button" type="submit">
                    ${product ? "Save changes" : "Add product"}
                </button>
                ${product ? `
                    <button class="admin-button secondary"
                        type="button" data-action="cancel-edit">
                        Cancel
                    </button>
                ` : ""}
            </div>
        </form>
    `;
}

function showView(view) {
    document.querySelectorAll(".admin-nav-link").forEach(button => {
        button.classList.toggle("active", button.dataset.view === view);
    });

    if (view === "dashboard") {
        pageTitle.textContent = "Dashboard";
        renderDashboard();
        return;
    }

    if (view === "products") {
        renderProducts();
        return;
    }

    const labels = {
        orders: "Orders",
        events: "Events",
        tickets: "Tickets",
        customers: "Customers",
        community: "Community",
        collaborations: "Collaborations",
        settings: "Settings"
    };

    pageTitle.textContent = labels[view] || "Dashboard";

    content.innerHTML = `
        <section class="admin-panel">
            <h2>${escapeHTML(labels[view] || "Dashboard")}</h2>
            <p class="admin-muted">
                This section is planned for the next development stage.
                It is not connected to a database yet.
            </p>
        </section>
    `;
}

function editProduct(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    editingId = id;
    renderProducts();

    const panel = document.getElementById("product-form-panel");
    panel.innerHTML = renderProductForm(product);
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function addOrUpdateProduct(form) {
    const formData = new FormData(form);

    const name = String(formData.get("name")).trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    if (!name || !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(stock) || stock < 0) {
        notify("Please check the product details.");
        return;
    }

    const product = {
        id: editingId || `aw-${Date.now()}`,
        name,
        category: String(formData.get("category")),
        price,
        stock,
        image: String(formData.get("image")).trim()
    };

    if (editingId) {
        products = products.map(item =>
            item.id === editingId ? product : item
        );
    } else {
        products.push(product);
    }

    try {
        saveProducts(products);
    } catch (error) {
        console.error(error);
        notify("Could not save. Browser storage may be full.");
        return;
    }

    editingId = null;
    renderProducts();
    notify("Product saved successfully!");
}

// Event delegation: handles buttons even when JavaScript rerenders the page.
document.addEventListener("click", event => {
    const navButton = event.target.closest(".admin-nav-link");

    if (navButton) {
        editingId = null;
        showView(navButton.dataset.view);
        return;
    }

    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
        editProduct(editButton.dataset.edit);
        return;
    }

    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) {
        const product = products.find(
            item => item.id === deleteButton.dataset.delete
        );

        if (!product) return;

        if (confirm(`Delete "${product.name}"?`)) {
            products = products.filter(item => item.id !== product.id);
            saveProducts(products);
            editingId = null;
            renderProducts();
            notify("Product deleted.");
        }
        return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
        const action = actionButton.dataset.action;

        if (action === "products") {
            editingId = null;
            showView("products");
        }

        if (action === "add-product") {
            editingId = null;
            showView("products");
            document.getElementById("product-form-panel")
                ?.scrollIntoView({ behavior: "smooth" });
            document.getElementById("product-name")?.focus();
        }

        if (action === "cancel-edit") {
            editingId = null;
            renderProducts();
        }
    }
});

document.addEventListener("submit", event => {
    if (event.target.id === "product-form") {
        event.preventDefault();
        addOrUpdateProduct(event.target);
    }
});

document.addEventListener("input", event => {
    if (event.target.id !== "product-search") return;

    const query = event.target.value.toLowerCase().trim();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    document.getElementById("product-table").innerHTML =
        renderProductTable(filtered);
});

document.getElementById("sidebar-toggle").addEventListener("click", () => {
    document.getElementById("admin-sidebar").classList.toggle("open");
});

renderDashboard();
