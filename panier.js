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

// Afficher le panier sur la page panier
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const panierItemsBillPrice = document.querySelector('.panier-items-preview');
    panierItemsBillPrice.innerHTML = '';

    cart.forEach(item => {
        const productItem = document.createElement('div');
        productItem.classList.add('panier-item');

        const productItemText = document.createElement('p');
        productItemText.classList.add('panier-item-text');
        productItemText.textContent = `${item.name} x ${item.quantity}`;

        const productItemChoice = document.createElement('div');
        productItemChoice.classList.add('panier-item-choice');

        const productItemChoiceAdd = document.createElement('a');
        productItemChoiceAdd.classList.add('panier-item-choice-add');
        productItemChoiceAdd.textContent = '+';
        productItemChoiceAdd.addEventListener('click', () => updateCart(item.name, 'add'));

        const productItemChoiceRemove = document.createElement('a');
        productItemChoiceRemove.classList.add('panier-item-choice-remove');
        productItemChoiceRemove.textContent = '-';
        productItemChoiceRemove.addEventListener('click', () => updateCart(item.name, 'remove'));

        productItemChoice.appendChild(productItemChoiceAdd);
        productItemChoice.appendChild(productItemChoiceRemove);
        productItem.appendChild(productItemText);
        productItem.appendChild(productItemChoice);
        panierItemsBillPrice.appendChild(productItem);
    });
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