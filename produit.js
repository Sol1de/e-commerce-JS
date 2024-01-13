// Fonction d'animation du menu
const menu = document.querySelector("#menuProduit");
let timeoutId;

function animateNavOnScroll() {
    let lastScrollValue = 0;

    document.addEventListener('scroll',() => {
            let top  = document.documentElement.scrollTop;
        if(lastScrollValue < top) {
            menu.classList.add("nav-hidden");
            timeoutId = setTimeout(() => {
                menu.style.display = "none";
            }, 300);
        } else {
            menu.style.display = "flex";
            timeoutId = setTimeout(() => {
                menu.style.transition = "0.3s";
                menu.classList.remove("nav-hidden");
            }, 300);
        }
        lastScrollValue = top;
        
    });
};



//creation des produits dans le DOM (page produits)
let pageProduits = document.querySelector("#produits");

fetch("https://pokeapi.co/api/v2/pokemon/?limit=50")
    .then(response => response.json())
    .then(data => {
        data.results.forEach(element => {
            let produit = document.createElement("div");
            produit.classList.add("produit");
            produit.style.width = "auto";
            produit.style.padding = "20px";

            let produitTitle = document.createElement("h2");
            produitTitle.classList.add("produit-title");
            produitTitle.textContent = element.name;

            let produitImg = document.createElement("img");
            produitImg.classList.add("produit-img"); 

            let pokeStats = document.createElement("div");
            pokeStats.classList.add("produit-stats");

            let pokeBuy = document.createElement("button");
            pokeBuy.classList.add("produit-buy");
            pokeBuy.textContent = "Acheter";

            fetch(`${element.url}`)
            .then(response => response.json())
            .then(data => {
                produitImg.src = data.sprites.front_default; 

                let statsTitle = document.createElement("h3");
                statsTitle.classList.add("produit-stats-title");
                statsTitle.textContent = "Stats";

                let statsList = document.createElement("ul");
                statsList.classList.add("produit-stats-list");
                
                for(let i = 0; i < data.stats.length; i++) {
                    let statsItem = document.createElement("li");
                    statsItem.classList.add("produit-stats-value");
                    statsItem.textContent = `${data.stats[i].stat.name} : ${data.stats[i].base_stat}`;
                    statsList.appendChild(statsItem);
                }
                pokeStats.appendChild(statsTitle);
                pokeStats.appendChild(statsList);
            })
            produit.appendChild(produitTitle);
            produit.appendChild(produitImg);
            produit.appendChild(pokeStats);
            produit.appendChild(pokeBuy);
            pageProduits.appendChild(produit);
        })
        
    })
    .catch(error => {
        console.log("Une erreur s'est produite", error);
});

// Ajouter un produit au panier
function updateCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ name: productName, quantity: 1 });
    }

    // Mettre à jour le panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fonction clic sur le bouton "Acheter"
pageProduits.addEventListener('click', (event) => {
    if (event.target.classList.contains('produit-buy')) {
        const productName = event.target.parentElement.querySelector('.produit-title').textContent;
        updateCart(productName);
    }
});

//css a adapté au html
const html = document.querySelector("html");
html.style.overflow = "auto";

//css pour le container main produits
const containerProduits = document.querySelector("#produits");
containerProduits.style.display = "flex";
containerProduits.style.flexWrap = "wrap";
containerProduits.style.justifyContent = "flex-start";
containerProduits.style.gap = "12px";
containerProduits.style.height = "fit-content";
containerProduits.style.width = "fit-content";

//css pour la nav
const nav = document.querySelector("#menuProduit");
nav.style.position = "fixed";
nav.style.transition = "0.3s";
nav.style.top = "0";
nav.style.height = "80px";

//appel de la fonction d'animation du menu
animateNavOnScroll();