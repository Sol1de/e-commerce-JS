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
    const panierItemsBillPrice = document.querySelector('.panier-items-bill-container-price');
    const panierItemsBillTaxe = document.querySelector('.panier-items-bill-container-taxe');
    const panierItemsBillTotal = document.querySelector('.panier-items-bill-container-total');

    panierItemsPreview.innerHTML = '';
    panierItemsBillPrice.innerHTML = '';
    panierItemsBillTaxe.innerHTML = '';
    panierItemsBillTotal.innerHTML = '';

    if (cart.length === 0) {
        // Le panier est vide, afficher un message
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Votre panier est vide.';
        emptyCartMessage.style.color = '#6D7280';
        panierItemsPreview.appendChild(emptyCartMessage);
        return;
    }

    try {
        const cartWithImageURLs = await updateCartWithImageURLs(cart);
        let totalPrice = 0;

        cartWithImageURLs.forEach(item => {
            const productItem = document.createElement('div');
            productItem.classList.add('panier-item');

            const productItemChoice = document.createElement('div');
            productItemChoice.classList.add('panier-item-container-choice');

            const productItemChoiceAdd = document.createElement('a');
            productItemChoiceAdd.classList.add('panier-item-container-choice-add');
            productItemChoiceAdd.textContent = '+';
            productItemChoiceAdd.addEventListener('click', () => updateCart(item.name, 'add'));

            const productItemChoiceRemove = document.createElement('a');
            productItemChoiceRemove.classList.add('panier-item-container-choice-remove');
            productItemChoiceRemove.textContent = '-';
            productItemChoiceRemove.addEventListener('click', () => updateCart(item.name, 'remove'));

            const productInfoContainer = document.createElement('div');
            productInfoContainer.classList.add('panier-item-container');

            const productItemText = document.createElement('strong');
            productItemText.classList.add('panier-item-container-info-text');
            productItemText.textContent = `${item.name} x ${item.quantity}`;

            const productItemPrice = document.createElement('p');
            productItemPrice.classList.add('panier-item-container-info-price');
            const productPrice = localStorage.getItem(`randomPrice_${item.name}`);
            productItemPrice.textContent = `Prix: ${productPrice}$`;

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
            productItemChoice.appendChild(productItemChoiceAdd);

            productItem.appendChild(productItemImage);
            productItem.appendChild(productInfoContainer);
            panierItemsPreview.appendChild(productItem);

            // Mettre à jour le prix total
            totalPrice += item.quantity * parseFloat(productPrice);
        });

        // Afficher le prix brut
        const priceText = document.createElement('p');
        const priceTextInfo = document.createElement('p');
        priceTextInfo.textContent = `${totalPrice.toFixed(2)}$`;
        priceText.textContent = `Prix :`;
        panierItemsBillPrice.appendChild(priceText);
        panierItemsBillPrice.appendChild(priceTextInfo);
        

        // Calculer les taxes (20% du prix brut)
        const taxeAmount = 0.2 * totalPrice;

        // Afficher les taxes
        const taxeText = document.createElement('p');
        const taxeTextInfo = document.createElement('p');
        taxeTextInfo.textContent = `${taxeAmount.toFixed(2)}$`;
        taxeText.textContent = `Taxe (20%):`;
        panierItemsBillTaxe.appendChild(taxeText);
        panierItemsBillTaxe.appendChild(taxeTextInfo);

        // Calculer le prix total
        const totalPriceWithTaxe = totalPrice + taxeAmount;

        // Afficher le prix total
        const totalPriceText = document.createElement('p');
        const totalPriceTextInfo = document.createElement('p');
        totalPriceTextInfo.textContent = `${totalPriceWithTaxe.toFixed(2)}$`;
        totalPriceText.textContent = `Total :`;
        panierItemsBillTotal.appendChild(totalPriceText);
        panierItemsBillTotal.appendChild(totalPriceTextInfo);
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'affichage du panier", error);
    }
}

// Fonction pour générer un prix aléatoire ou récupérer le prix existant du localStorage
function generateRandomPrice(productName) {
    const storedPrice = localStorage.getItem(`randomPrice_${productName}`);
    if (storedPrice) {
        return storedPrice;
    }

    const randomPrice = (Math.random() * (100 - 10) + 10).toFixed(2);
    localStorage.setItem(`randomPrice_${productName}`, randomPrice);
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
                item.imageUrl = await getProductImage(item.name);
            }
            return item;
        })
    );

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

    // Mettre à jour le panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mettre à jour l'interface utilisateur pour refléter le changement dans le panier
    displayCart();

    // Calculer et mettre à jour le prix total
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

    // Effacer le contenu précédent et ajouter le nouveau prix
    panierItemsBillPrice.innerHTML = '';
    panierItemsBillPrice.appendChild(priceText);
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