// =========================================
// PAGE LOADER
// =========================================

const pageLoader = document.getElementById("page-loader");

window.addEventListener("load", () => {

    setTimeout(() => {

        pageLoader.classList.add("is-hidden");

        setTimeout(() => {
            pageLoader.remove();
        }, 750);

    }, 500);

});

/* =========================================================
   HEADER & MOBILE NAVIGATION
========================================================= */

const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("main-navigation");
const header = document.querySelector(".header");

if (menuButton && navigation && header) {

    // Toggle mobile navigation
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("show");

        menuButton.classList.toggle("active", isOpen);

        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        document.body.classList.toggle("menu-open", isOpen);
    });

    // Close menu when a navigation link is clicked
    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("show");
            menuButton.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");

            document.body.classList.remove("menu-open");
        });
    });

    // Close menu with Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            navigation.classList.remove("show");
            menuButton.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");

            document.body.classList.remove("menu-open");
        }
    });

    // Hide header on scroll down, reveal on scroll up
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const menuIsOpen = navigation.classList.contains("show");

        if (menuIsOpen) {
            header.classList.remove("hide-header");
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY <= 100) {
            header.classList.remove("hide-header");
        } 
        else if (currentScrollY > lastScrollY) {
            header.classList.add("hide-header");
        } 
        else if (currentScrollY < lastScrollY) {
            header.classList.remove("hide-header");
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

}


/*
==========================================================
      Products autosliding
==========================================================
*/
const productContainer = document.querySelector('.products');

if (productContainer) {
  let autoScrollInterval;

  const startAutoSlide = () => {
    autoScrollInterval = setInterval(() => {
      // Check if we've reached the end, then loop back to the start
      if (productContainer.scrollLeft + productContainer.clientWidth >= productContainer.scrollWidth - 10) {
        productContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll forward by one card width + gap (approx 167px)
        productContainer.scrollBy({ left: 167, behavior: 'smooth' });
      }
    }, 3000); // Changes slide every 3 seconds
  };

  const stopAutoSlide = () => {
    clearInterval(autoScrollInterval);
  };

  // Start auto-sliding on load
  startAutoSlide();

  // Pause when the user hovers over the products (so they can look or click)
  productContainer.addEventListener('mouseenter', stopAutoSlide);
  productContainer.addEventListener('mouseleave', startAutoSlide);
}

console.log("Events page JavaScript loaded!");

console.log("Menu button:", menuButton);
console.log("Navigation:", navigation);

const target=new Date("2026-12-31T12:00:00+01:00").getTime();
function countdown(){let x=Math.max(0,target-Date.now());document.querySelector("#d").textContent=String(Math.floor(x/86400000)).padStart(2,"0");document.querySelector("#h").textContent=String(Math.floor(x/3600000)%24).padStart(2,"0");document.querySelector("#m").textContent=String(Math.floor(x/60000)%60).padStart(2,"0");document.querySelector("#s").textContent=String(Math.floor(x/1000)%60).padStart(2,"0")}
countdown();setInterval(countdown,1000);
function demo(){const t=document.querySelector("#toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}