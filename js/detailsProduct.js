async function getProduct(id) {
  try {
    manageSpinner(".loader-container", true);

    const response = await fetch(`https://localhost:7112/api/Product/${id}`);

    manageSpinner(".loader-container", false);

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del producto');
    }

    const product = await response.json();
    const categoryId = product.category.id; 

    showProductDetails(product);
    setupAddToCartButton(product);

    await getSimilarProducts(categoryId, product.id);
  } catch (error) {
    console.error(error.message);
  }
}

async function getSimilarProducts(categoryId, currentProductId) {
  try {
    manageSpinner(".loader-container", true);

    const response = await fetch(`https://localhost:7112/api/Product?categories=${categoryId}&limit=4`);

    manageSpinner(".loader-container", false);

    if (!response.ok) {
      throw new Error('Error al obtener productos similares');
    }
    const products = await response.json();
    const similarProducts = products.filter(product => product.id !== currentProductId);
    showSimilarProducts(similarProducts);
  } catch (error) {
    console.error('Error al obtener productos similares:', error);
  }
}

function showSimilarProducts(products) {
  const similarProductsContainer = document.getElementById("similar-products");
  similarProductsContainer.innerHTML = ""; 

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product-similar');

    div.addEventListener('click', () => {
      window.location.href = `detailsProduct.html?id=${product.id}`;
    });

    const discountedPrice = product.price * (1 - product.discount / 100);
    const originalPriceFormatted = formatNumber(product.price);
    const discountedPriceFormatted = formatNumber(discountedPrice);

    div.innerHTML = `
      <div class="product-image-container-similar">
        <img src="${product.imageUrl}" alt="${product.name}">
      </div>
      <div class="product-info-similar">
        <div class="product-name-similar">
          <h4>${product.name}</h4>
        </div>
        <div class="product-discount-similar">
          ${product.discount > 0 ? `<p class="details-before-similar">$ ${originalPriceFormatted}</p>` : ''}
          ${product.discount > 0 ? `<div class="discount-badge-similar">${product.discount}% off</div>` : ''}
        </div>
        <p class="details-now-similar">$ ${discountedPriceFormatted}</p>
      </div>
    `;
    similarProductsContainer.appendChild(div);
  });
}


function addToCart(product) {
  const quantityInput = document.querySelector('.input-number');
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity <= 0) {
    showToast("Por favor, ingrese una cantidad válida mayor que cero.");
    return; 
  }
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    imageUrl: product.imageUrl,
    quantity
  };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);

  if (existingItemIndex !== -1) {
    const maxToAdd = 99 - cart[existingItemIndex].quantity; 
    if (quantity > maxToAdd) {
      const maxQuantityMessage = `El límite máximo por producto es de 99 unidades. Solo puedes agregar ${maxToAdd} unidad más de este producto al carrito.`;
      showModalQuantity(maxQuantityMessage);
      return; 
    }
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showToast("¡El producto se ha agregado al carrito!");
  updateCartItemCount(cart.length);
}

function showModalQuantity(message) {
  const modal = document.getElementById('maxQuantityModal');
  const messageElement = document.getElementById('maxQuantityMessage');
  messageElement.textContent = message;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('maxQuantityModal');
  modal.style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('maxQuantityModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function setupAddToCartButton(product) {
  const addToCartButton = document.querySelector('.details-button');
  addToCartButton.addEventListener('click', () => addToCart(product));
}

function showProductDetails(product) {
  const productDetails = document.getElementById("details-product");
  const hasDiscount = product.discount > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount ? (product.price * (1 - product.discount / 100)) : originalPrice;
  const originalPriceFormatted = formatNumber(originalPrice);
  const discountedPriceFormatted = formatNumber(discountedPrice);
  
  productDetails.innerHTML = `
    <div class="container">
      <div class="left">
        <div class="gallery-image">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
      </div>
      <div class="right">
        <div class="details">
          <h2 class="details-name">${product.name}</h2>
          <p class="details-description">${product.description}</p>
          <div class="details-prices">
            <div class="product-discount-details">
              ${hasDiscount ? `<p class="details-before">$${originalPriceFormatted}</p>` : ''}
              ${hasDiscount ? `<div class="discount-badge">${product.discount}% off</div>` : ''}
            </div>
            <p class="details-now">$${discountedPriceFormatted}</p>
          </div>
          <div class="details-quantity">
            <div class="input">
              <div class="quantity-container">
                <i class="fa-solid fa-minus" onclick="decreaseQuantity()"></i>
                <input class="input-number" type="number" value="1" id="quantity-input" maxlength="2">
                <i class="fa-solid fa-plus" onclick="increaseQuantity()"></i>
              </div>
            </div>
            <button class="details-button"><i class="fa-solid fa-cart-shopping"></i>Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
    <h3 id= "similares-title">Productos Similares</h3>
    <div id="similar-products" class="similar-products"></div> <!-- Contenedor para productos similares -->
  `;

  const inputNumber = productDetails.querySelector('.input-number');
  inputNumber.addEventListener('input', function(event) {
    let newQuantity = parseInt(event.target.value);
   
    if (event.target.value.length > 2) {
      event.target.value = event.target.value.slice(0, 2);
    }
  
    newQuantity = Math.min(Math.max(newQuantity, 1), 99);
    event.target.value = newQuantity;
  });
}

function increaseQuantity() {
  const input = document.getElementById('quantity-input');
  let newValue = parseInt(input.value) + 1;
  if (newValue > 99) {
    newValue = 99;
  }
  input.value = newValue;
}

function decreaseQuantity() {
  const input = document.getElementById('quantity-input');
  let newValue = parseInt(input.value) - 1;
  if (newValue < 1) {
    newValue = 1;
  }
  input.value = newValue;
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    getProduct(productId);
  } else {
    console.error("No se proporcionó un ID de producto");
  }
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartItemCount(cart.length);
    
});