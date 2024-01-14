// Fonction d'animation du menu
const menu = document.querySelector("#menuPanier");
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

// Fonction d'affichage du panier
async function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const panierItemsPreview = document.querySelector('.panier-items-preview');
    panierItemsPreview.innerHTML = '';

    try {
        const cartWithImageURLs = await updateCartWithImageURLs(cart);

        cartWithImageURLs.forEach(item => {
            const productItem = document.createElement('div');
            productItem.classList.add('panier-item');

            const productItemChoice = document.createElement('div');
            productItemChoice.classList.add('panier-item-container-choice');

            const productItemChoiceAdd = document.createElement('a');
            productItemChoiceAdd.classList.add('panier-item-container-choice-add');
            productItemChoiceAdd.textContent = '+';
            productItemChoiceAdd.addEventListener('click', () => updateCart(item.name, 'add'));

            const productItemQuantity = document.createElement('p');
            productItemQuantity.classList.add('panier-item-container-quantity');
            productItemQuantity.textContent = item.quantity;

            const productItemChoiceRemove = document.createElement('a');
            productItemChoiceRemove.classList.add('panier-item-container-choice-remove');
            productItemChoiceRemove.textContent = '-';
            productItemChoiceRemove.addEventListener('click', () => updateCart(item.name, 'remove'));

            const productInfoContainer = document.createElement('div');
            productInfoContainer.classList.add('panier-item-container');

            const productItemText = document.createElement('p');
            productItemText.classList.add('panier-item-container-text');
            productItemText.textContent = `${item.name}`;

            const productItemPrice = document.createElement('p');
            productItemPrice.classList.add('panier-item-container-price');
            productItemPrice.textContent = `Prix: ${generateRandomPrice()}$`;

            const productNamePriceContainer = document.createElement('div');
            productNamePriceContainer.classList.add('panier-item-container-info');

            productNamePriceContainer.appendChild(productItemText);
            productNamePriceContainer.appendChild(productItemPrice);

            productInfoContainer.appendChild(productNamePriceContainer);
            productInfoContainer.appendChild(productItemChoice);


            const productItemImage = document.createElement('img');
            productItemImage.classList.add('panier-item-img');
            productItemImage.src = item.imageUrl;

            productItemChoice.appendChild(productItemChoiceRemove);
            productItemChoice.appendChild(productItemQuantity);
            productItemChoice.appendChild(productItemChoiceAdd);

            productItem.appendChild(productItemImage);
            productItem.appendChild(productInfoContainer);
            panierItemsPreview.appendChild(productItem);
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'affichage du panier", error);
    }
}


// Fonction pour générer un prix aléatoire
function generateRandomPrice() {
    const randomPrice = (Math.random() * (100 - 10) + 10).toFixed(2);
    localStorage.setItem('randomPrice', randomPrice);
    return randomPrice;
}

// Fonction pour récupérer l'URL de l'image du Pokémon en fonction du nom
async function getProductImage(productName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${productName}`);
    const data = await response.json();
    return data.sprites.front_default;
}

// Fonction pour mettre à jour le panier avec les URL des images
async function updateCartWithImageURLs(cart) {
    const updatedCart = await Promise.all(
        cart.map(async item => {
            if (!item.imageUrl) {
                // Si l'URL de l'image n'est pas déjà présente, la récupérer depuis l'API
                item.imageUrl = await getProductImage(item.name);
            }
            return item;
        })
    );

    // Mettre à jour le panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
}

// Gestion du panier (ajouter ou supprimer un produit)
function updateCart(productName, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (action === 'add') {
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ name: productName, quantity: 1 });
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

    // Mettre à jour le panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mettre à jour l'interface utilisateur pour refléter le changement dans le panier
    displayCart();
}

//css pour la nav
const nav = document.querySelector("#menuPanier");
nav.style.position = "fixed";
nav.style.transition = "0.3s;";
nav.style.top = "0";
nav.style.height = "80px";

//appel des fonctions
animateNavOnScroll();
displayCart();