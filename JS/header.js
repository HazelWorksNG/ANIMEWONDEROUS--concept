
// ==========================================
// ANIMEWONDEROUS HEADER CONTROLS
// ==========================================

const header = document.getElementById("site-header");

if (header) {

    const menuButton = document.getElementById("menu-button");
    const menuPanel = document.getElementById("mobile-menu-panel");
    const searchForm = document.getElementById("header-search");
    const searchToggle = document.getElementById("search-toggle");
    const searchClose = document.getElementById("search-close");
    const searchInput = document.getElementById("header-search-input");

    const accountButton = document.getElementById("header-account");
    const ticketButton = document.getElementById("header-ticket");

    // ======================================
    // ACCOUNT / TICKET VISIBILITY
    // ======================================

    function updateHeaderActions() {

        const authenticated =
            header.dataset.authenticated === "true";

        const ticketsAvailable =
            header.dataset.ticketsAvailable === "true";

        const showTicketButton =
            header.dataset.showTicketButton === "true";

        const shouldShowTicket =
            !authenticated &&
            ticketsAvailable &&
            showTicketButton;

        ticketButton.hidden = !shouldShowTicket;
        accountButton.hidden = shouldShowTicket;
    }

    updateHeaderActions();


    // ======================================
    // MOBILE NAVIGATION
    // ======================================

    function openMenu() {

        header.classList.add("menu-open");
        menuButton.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");

        document.body.classList.add("menu-is-open");
    }

    function closeMenu() {

        header.classList.remove("menu-open");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-is-open");
    }

    menuButton.addEventListener("click", () => {

        const isOpen = header.classList.contains("menu-open");

        if (isOpen) {
            closeMenu();
        } else {
            closeSearch();
            openMenu();
        }

    });


    // Close menu after selecting a navigation link.
    menuPanel.querySelectorAll(".nav a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });


    // ======================================
    // DESKTOP SEARCH
    // ======================================

    function openSearch() {

        if (window.innerWidth <= 900) {
            searchInput.focus();
            return;
        }

        closeMenu();

        header.classList.add("search-open");

        searchToggle.setAttribute("aria-expanded", "true");
        searchToggle.setAttribute("aria-label", "Search open");

        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    function closeSearch() {

        header.classList.remove("search-open");

        searchToggle.setAttribute("aria-expanded", "false");
        searchToggle.setAttribute("aria-label", "Open search");

        searchInput.value = "";
    }

    searchToggle.addEventListener("click", openSearch);

    searchClose.addEventListener("click", closeSearch);


    // ======================================
    // KEYBOARD CONTROLS
    // ======================================

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSearch();
            closeMenu();

        }

    });


    // ======================================
    // RESPONSIVE STATE CLEANUP
    // ======================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

        if (window.innerWidth <= 900) {
            closeSearch();
        }

    });

}
