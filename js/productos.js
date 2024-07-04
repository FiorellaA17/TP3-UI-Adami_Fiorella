async function listProducts(url = "https://localhost:7112/api/Product", searchTerm = '') {
  const listado = document.getElementById("list-products");
  const loaderContainer = document.querySelector(".loader-container");

  try {
    loaderContainer.style.display = "block";

    const timeoutId = setTimeout(() => {
      listado.innerHTML = `
        <div class="generic-message">
          <img src="img/error3.png" alt="Icono de error" class="message-icon">
          <div class="message-title">¡Ups!</div>
          <div class="message-content">Parece que la carga de los productos está tardando más de lo esperado.</div>
          <div class="message-action">Por favor, recarga la página e inténtalo de nuevo.  Si el problema continúa, intenta nuevamente más tarde.</div>
        </div>
      `;
    }, 5000);

    const response = await fetch(url);

    clearTimeout(timeoutId);

    if (response.ok) {
      const products = await response.json();
      if (products.length === 0) {
        listado.innerHTML = searchTerm
          ? "<p>Lo sentimos, no se encontraron productos que coincidan con tu búsqueda.</p>"
          : "<p>No hay productos disponibles.</p>";
      } else {
        showProducts(products);
      }
      loaderContainer.style.display = "none";
    } else {
      console.error("Error al obtener los productos");
      loaderContainer.style.display = "none";
    }
  } catch (error) {
    console.error("Error de red o de servidor:", error);
    loaderContainer.style.display = "none";
  }
}

function showProducts(products) {
  const listado = document.getElementById("list-products");
  listado.innerHTML = ""; 

  const fragment = document.createDocumentFragment(); 

  products.forEach(product => {
    const div = document.createElement('div');
    div.classList.add('product');

    div.addEventListener('click', () => {
      window.location.href = `detailsProduct.html?id=${product.id}`;
    });

    const discountedPrice = product.price * (1 - product.discount / 100);
    const originalPriceFormatted = formatNumber(product.price);
    const discountedPriceFormatted = formatNumber(discountedPrice);

    div.innerHTML = `
        <div class="product-image">
         <img src="${product.imageUrl}" alt="${product.name}">
         </div>
        <div class="product-info">
        <div class="product-name">
        <h4>${product.name}</h4>
      </div>
          <div class="product-discount">
          ${product.discount > 0 ? `<p class="details-before">$ ${originalPriceFormatted}</p>` : ''}
          ${product.discount > 0 ? `<div class="discount-badge">${product.discount}% off</div>` : ''}
          </div>
          <p class="details-now">$ ${discountedPriceFormatted}</p>
        </div>
    `;
    fragment.appendChild(div);
  });

  listado.appendChild(fragment);
}

async function filterProducts() {
  const searchQuery = document.getElementById("search").value.trim();
  const categories = Array.from(document.querySelectorAll("input[name='filter']:checked"))
                          .map(checkbox => `categories=${checkbox.value}`)
                          .join("&");
  const url = `https://localhost:7112/api/Product?${categories}&limit=0&offset=0${searchQuery ? `&name=${searchQuery}` : ''}`;
  console.log(`Filtering with URL: ${url}`); 
  await listProducts(url, searchQuery);
}

document.addEventListener('DOMContentLoaded', () => {
  listProducts();

  document.querySelectorAll("input[name='filter']").forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
    console.log(`Event listener added for: ${checkbox.value}`); 
  });

  const searchInput = document.getElementById("search");
  searchInput.addEventListener('input', filterProducts);

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartItemCount(cart.length);
});