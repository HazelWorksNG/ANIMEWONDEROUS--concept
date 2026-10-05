
const target=new Date("2026-12-31T12:00:00+01:00").getTime();
function countdown(){let x=Math.max(0,target-Date.now());document.querySelector("#d").textContent=String(Math.floor(x/86400000)).padStart(2,"0");document.querySelector("#h").textContent=String(Math.floor(x/3600000)%24).padStart(2,"0");document.querySelector("#m").textContent=String(Math.floor(x/60000)%60).padStart(2,"0");document.querySelector("#s").textContent=String(Math.floor(x/1000)%60).padStart(2,"0")}
countdown();setInterval(countdown,1000);
function demo(){const t=document.querySelector("#toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}

const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("main-navigation");

menuButton.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("show");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});