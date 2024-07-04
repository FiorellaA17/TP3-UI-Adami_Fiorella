function showToast(text){
    Toastify({
      text,
      position: "center",
      style: {
        background: "white",
        color:"#225F7B",
      }
    }).showToast();
    }

function formatNumber(number) {
  return number.toLocaleString('es-ar', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTimeWithoutSeconds(dateTimeString) {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
}

function updateCartItemCount(count) {
  const cartNotification = document.getElementById('cart--notification');
  if (count > 9) {
    cartNotification.textContent = '9+';
  } else {
    cartNotification.textContent = count;
  }
}

function showModal(message, confirmCallback) {
  const modal = document.getElementById('infoModal');
  const messageElement = document.getElementById('infoMessage');
  const confirmButton = document.getElementById('confirmInfo');
  const cancelButton = document.getElementById('cancelInfo');

  messageElement.textContent = message;
  modal.style.display = 'block';

  confirmButton.onclick = () => {
      modal.style.display = 'none';
      if (confirmCallback) confirmCallback();
  };

  cancelButton.onclick = () => {
      modal.style.display = 'none';
  };
}

function showDeleteModal(productName, productId) {
  showModal(`¿Estás seguro de eliminar "${productName}" del carrito?`, () => {
      removeFromCart(productId);
  });
}

function showClearCartModal() {
  showModal('¿Estás seguro de vaciar el carrito?', clearCart);
}

function showModalRegister() {
  const modal = document.getElementById('successModal');
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('successModal');
  modal.style.display = 'none';
}

function manageSpinner(containerSelector, show = true) {
  const container = document.querySelector(containerSelector);
  container.style.display = show ? "block" : "none";
}

// function agregarImagenProducto(producto) {
//   const imagen = new Image();
//   imagen.src = producto.imageUrl;
//   imagen.onerror = function() {
//       // Imagen no cargada correctamente, usar una imagen alternativa
//       this.src = 'imagen/logoMarquet.jpg';
//       this.classList.add('producto-imagen'); // Clase opcional para estilos
//   };
//   return imagen;
// }