// =========================================
// ANIMEWONDEROUS PAGE LOADER
// =========================================

(() => {
    const loader = document.getElementById("page-loader");

    if (!loader) return;

    const message = loader.querySelector(".loader-message");

    function show(text = "PLEASE WAIT...") {
        if (message) message.textContent = text;

        loader.classList.remove("is-hidden");
        loader.setAttribute("aria-hidden", "false");
    }

    function hide() {
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-hidden", "true");
    }

    window.AWLoader = { show, hide };

    // Hide when the page finishes loading.
    window.addEventListener("load", hide);

    // Handle browser back/forward cache.
    window.addEventListener("pageshow", () => {
        hide();
    });

})();