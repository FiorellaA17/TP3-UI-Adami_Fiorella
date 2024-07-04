document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();
    updateCartSummary();
    updateCartItemCount(cart.length);
});

let cart = [];

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCartItems(cartItemsContainer) {
    while (cartItemsContainer.firstChild) {
        cartItemsContainer.removeChild(cartItemsContainer.firstChild);
    }
}

function createCartItemElement(item) {
    const hasDiscount = item.discount > 0;
    const subtotal = item.price * item.quantity;

    const cartItemHtml = `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-prices">
                <p class="cart-item-original-price">$${formatNumber(item.price)}</p>
                </div>
                <div class="cart-item-discount-detail">
                ${hasDiscount ? `<p class="cart-item-discount">${item.discount}% off</p>` : ''}
                </div>
                <div class="details-quantity">
                    <div class="quantity-container">
                        <div class="quantity-container-inner">
                            <i class="fa-solid fa-minus" onclick="changeQuantity('${item.id}', -1)"></i>
                            <input class="input-number" type="number" value="${item.quantity}" id="quantity-input-${item.id}" data-id="${item.id}" >
                            <i class="fa-solid fa-plus" onclick="changeQuantity('${item.id}', 1)"></i>
                        </div>
                    </div>
                </div>
                <div class="details-final-subtotal">
                    <p class="cart-item-subtotal subtotal" data-id="${item.id}">$${formatNumber(subtotal)}</p>
                </div>
                <div class="details-final-trash">
                    <i class="fa-solid fa-trash" onclick="showDeleteModal('${item.name}', '${item.id}')"></i>
                </div>
            </div>
        </div>
    `;
    
    const cartItemElement = document.createElement('div');
    cartItemElement.innerHTML = cartItemHtml;
    
    const inputNumber = cartItemElement.querySelector('.input-number');
    let timeoutId;

    inputNumber.addEventListener('input', function(event) {
        clearTimeout(timeoutId);
        let newQuantity = parseInt(event.target.value);
        
        if (event.target.value.trim() === "") return;
        
        newQuantity = Math.min(Math.max(newQuantity, 1), 99);
        event.target.value = newQuantity;
    
        timeoutId = setTimeout(() => {
            updateCartItemQuantity(item.id, newQuantity);
        }, 700); 
    });

    return cartItemElement;
}

function renderCartItems(cartItemsContainer) {
    clearCartItems(cartItemsContainer);
    const cartSummaryContainer = document.getElementById('cart-summary');
    const titleCartContainer = document.querySelector('.title-cart'); 
    const titleLeftContainer = document.querySelector('.title-left'); 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-container">
                <div class="empty-cart-content">
                    <i id="cart-js" class="fa-solid fa-cart-shopping"></i>
                    <p class="empty-cart-message">El carrito se encuentra vacío</p>
                    <button class="new-sale-button">Nueva venta</button>
                </div>
            </div>
        `;
        cartSummaryContainer.classList.add('hidden');
        titleCartContainer.classList.add('hidden'); 
        titleLeftContainer.classList.add('hidden'); 

        const newSaleButton = document.querySelector('.new-sale-button');
        newSaleButton.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    } else {
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        cartSummaryContainer.classList.remove('hidden');
        titleCartContainer.classList.remove('hidden'); 
        titleLeftContainer.classList.remove('hidden'); 
        updateCartSummary(); 
    }
}

function loadCartItems() {
    loadCart();
    const cartItemsContainer = document.getElementById('cart-items');
    renderCartItems(cartItemsContainer);
}

function changeQuantity(productId, delta) {
    const input = document.getElementById(`quantity-input-${productId}`);
    let newValue = parseInt(input.value) + delta;
    
    newValue = Math.min(Math.max(newValue, 1), 99);
    input.value = newValue; 
    updateCartItemQuantity(productId, newValue);
}

function updateCartItemQuantity(productId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart();
        loadCartItems();
        updateCartSummary();
    }
}

function updateCartSummary() {
    const cartSummaryContainer = document.getElementById('cart-summary');

    let subtotal = 0;
    let totalDiscount = 0;

    cart.forEach(item => {
        const discountedPrice = item.price * (1 - item.discount / 100);
        subtotal += item.price * item.quantity;
        totalDiscount += (item.price - discountedPrice) * item.quantity;
    });

    const taxes = 1.21;
    const totalPay = (subtotal - totalDiscount) * taxes;

    const cartSummaryHtml = `
      <div class="cart-summary-container">
        <h3>Resumen de venta</h3>
        <div class="cart-summary-details">
          <div class="summary-item">
            <span>Subtotal:</span>
            <span>$${formatNumber(subtotal)}</span>
          </div>
          <div class="summary-item">
            <span>Descuento total:</span>
            <span>- $${formatNumber(totalDiscount)}</span>
          </div>
          <div class="summary-item">
            <span>Impuestos (IVA 21%):</span>
            <span>$${formatNumber((subtotal - totalDiscount) * 0.21)}</span>
          </div>
        </div>
        <hr>
        <div class="summary-item">
          <span class="pay">Total a pagar:</span>
          <span>$${formatNumber(totalPay)}</span>
        </div>
        <div class="button-container">
          <button class="clear-cart-button" onclick="showClearCartModal()">Vaciar carrito</button>
          <button class="checkout-button" onclick="finalizePurchase(${totalPay})">Finalizar venta</button>
        </div>
      </div>
    `;

    cartSummaryContainer.innerHTML = cartSummaryHtml;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    loadCartItems();
    updateCartSummary();
    showToast("¡Se eliminó correctamente el producto del carrito!");
    updateCartItemCount(cart.length);
}

function clearCart() {
    cart = [];
    saveCart();
    loadCartItems();
    updateCartSummary();
    updateCartItemCount(cart.length);
}

async function finalizePurchase(totalPayed) {
    try {
        const saleData = {
            products: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
            totalPayed: totalPayed.toFixed(2)
        };

        const response = await fetch('https://localhost:7112/Sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saleData)
        });

        if (response.status !== 201) throw new Error('Error en la solicitud');

        const data = await response.json();
        if (data && data.id) {
            showModalRegister();  
            clearCart();
        } else {
            throw new Error('Respuesta inesperada del servidor');
        }
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        alert('Hubo un error al registrar la venta. Por favor, inténtelo de nuevo.');
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
