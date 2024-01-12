document.addEventListener("DOMContentLoaded", function() {

//fonction animation du menu 
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
};

//fonction initialisation FullPageJS
function initFullPage(page) {
    var myFullPage = new fullpage(`${page}`, {
        autoScrolling:true,
        scrollHorizontally: true
});
};

//css du menu
const menu = document.querySelector("#menu");


//appel des fonctions
animationNav("#fullpage");
initFullPage("#fullpage");

});