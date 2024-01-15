document.addEventListener('DOMContentLoaded', (event) => {

    // Gestion du panier (ajouter ou supprimer un produit)
    function updateCart(productName, action) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (action === 'add') {
            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity++;
            } else {
                cart.push({ name: productName, quantity: 1, price: generateRandomPrice(productName) });
            }
        } else if (action === 'remove') {
            if (existingProductIndex !== -1) {
                if (cart[existingProductIndex].quantity > 1) {
                    cart[existingProductIndex].quantity--;
                } else {
                    cart.splice(existingProductIndex, 1);
                }
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateTotalPrice();
    }

    // Fonction pour mettre à jour le prix total
    function updateTotalPrice() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = 0;

        cart.forEach(item => {
            const productPrice = localStorage.getItem(`randomPrice_${item.name}`);
            totalPrice += item.quantity * parseFloat(productPrice);
        });

        const panierItemsBillPrice = document.querySelector('.panier-items-bill-price');
        const priceText = document.createElement('p');
        priceText.textContent = `Prix: ${totalPrice.toFixed(2)}$`;
        panierItemsBillPrice.innerHTML = '';
        panierItemsBillPrice.appendChild(priceText);
    }

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

    // Création des produits dans le DOM (page produits)
    let pageProduits = document.querySelector("#produits");

    fetch("https://pokeapi.co/api/v2/pokemon/?limit=50")
        .then(response => response.json())
        .then(data => {
            data.results.forEach(element => {
                const randomPrice = generateRandomPrice(element.name);

                let produit = document.createElement("div");
                produit.classList.add("produit");
                produit.setAttribute("data-aos", "zoom-in");
                produit.setAttribute("data-aos-delay", "100");

                let produitTitle = document.createElement("h2");
                produitTitle.classList.add("produit-title");
                produitTitle.textContent = element.name;

                let produitImg = document.createElement("img");
                produitImg.classList.add("produit-img");

                let pokeStats = document.createElement("div");
                pokeStats.classList.add("produit-stats");

                let pokeBuy = document.createElement("button");
                pokeBuy.classList.add("produit-buy");
                pokeBuy.textContent = `Acheter - ${randomPrice}$`;

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
            });
        })
        .catch(error => {
            console.log("Une erreur s'est produite", error);
    });

    //génération d'un prix aléatoire unique pour chaque produit en utilisant le nom du produit
    function generateRandomPrice(productName) {
        const existingRandomPrice = localStorage.getItem(`randomPrice_${productName}`);

        if (existingRandomPrice) {
            return existingRandomPrice;
        }
        const randomPrice = (Math.random() * (100 - 10) + 10).toFixed(2);
        localStorage.setItem(`randomPrice_${productName}`, randomPrice);
        return randomPrice;
    }

    // Fonction pour mettre à jour les boutons d'achat avec des prix aléatoires
    function updateBuyButtonsWithRandomPrice() {
        const buyButtons = document.querySelectorAll('.produit-buy');

        buyButtons.forEach(button => {
            const randomPrice = generateRandomPrice();
            button.textContent = `Acheter - ${randomPrice}$`;
        });
    }

    // Ajouter un produit au panier
    function updateCart(productName) {
        const randomPrice = generateRandomPrice(productName);
        updateCartWithPrice(productName, randomPrice);
    }

    // Fonction pour mettre à jour le panier avec le prix du produit
    function updateCartWithPrice(productName, price) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ name: productName, quantity: 1, price: price });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Ajouter un produit au panier lors du clic sur le bouton "Acheter"
    pageProduits.addEventListener('click', (event) => {
        if (event.target.classList.contains('produit-buy')) {
            const productName = event.target.parentElement.querySelector('.produit-title').textContent;
            updateCart(productName);
        }
    });

    //css pour la nav
    const nav = document.querySelector("#menuProduit");
    nav.style.position = "fixed";
    nav.style.transition = "0.3s";
    nav.style.top = "0";
    nav.style.height = "80px";
    nav.style.zIndex = "2";
    nav.style.width = "100%";

    //appel des fonctions
    updateBuyButtonsWithRandomPrice();
    animateNavOnScroll();
});