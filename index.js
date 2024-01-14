document.addEventListener("DOMContentLoaded", function() {

    // Fonction animation du menu 
    function animationNav(page) {
        var nav = new fullpage(`${page}`, {
            autoScrolling: true,
            scrollHorizontally: true,
            onLeave: function (origin, destination, direction) {
                var menu = document.querySelector("#menu");
                if (direction === 'up') {
                    gsap.to(menu, { translateY: 0, ease: "Power1.easeInOut" });
                } else {
                    gsap.to(menu, { translateY: -100, ease: "Power1.easeInOut" });
                }
            }
        });
        
        const accueilLink = document.querySelector("#menu-container-list-accueil");
        const nouveauteLink = document.querySelector("#menu-container-list-nouveaute");
        const aProposLink = document.querySelector("#menu-container-list-aPropos");

        accueilLink.addEventListener("click", function() {
            scrollToSection("#header");
        });

        nouveauteLink.addEventListener("click", function() {
            scrollToSection("#nouveaute");
        });

        aProposLink.addEventListener("click", function() {
            scrollToSection("#about");
        });


    }

    // CSS du menu
    const menu = document.querySelector("#menu");

    // Fonction de défilement vers les sections
    function scrollToSection(selector) {
        const targetSection = document.querySelector(selector);
        if (targetSection) {
            const offset = targetSection.offsetTop;
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }





    // Appel des fonctions
    animationNav("#fullpage");

});