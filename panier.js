// Fonction d'animation du menu
const menu = document.querySelector("#menuPanier");

function animateNavOnScroll() {
    let lastScrollValue = 0;

    document.addEventListener('scroll',() => {
            let top  = document.documentElement.scrollTop;
        if(lastScrollValue < top) {
            menu.classList.add("nav-hidden");
        } else {
            menu.style.transition = "0.3s";
            menu.classList.remove("nav-hidden");
        }
        lastScrollValue = top;
    });
};

//fonction initialisation FullPageJS
function initFullPage(page) {
    var myFullPage = new fullpage(`${page}`, {
        autoScrolling:true,
        scrollHorizontally: true
});
};

//css du menu
//css pour la nav
const nav = document.querySelector("#menuPanier");
nav.style.position = "fixed";
nav.style.transition = "0.3s;";
nav.style.top = "0";
nav.style.height = "80px";

//appel de la fonction d'animation du menu
animateNavOnScroll();