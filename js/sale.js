document.addEventListener('DOMContentLoaded', () => {
    loadSales();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartItemCount(cart.length);
});

async function loadSales() {
    const mainContent = document.getElementById("main-content");
    const footer = document.querySelector("footer"); 
    const spinnerContainer = document.querySelector(".spinner-container");
    let mainContentHidden = false;

    try {
        spinnerContainer.style.display = "block";
        const timeoutId = setTimeout(() => {
            mainContent.style.display = "none"; 
            footer.style.display = "none"; 
            mainContentHidden = true; 
            
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("generic-message-sale");
            errorMessage.innerHTML = `
                <img src="img/error3.png" alt="Icono de error" class="message-icon">
                <div class="message-title">¡Ups!</div>
                <div class="message-content">Parece que la carga de ventas está tardando más de lo esperado.</div>
                <div class="message-action">Por favor, recarga la página e inténtalo de nuevo. Si el problema continúa, intenta nuevamente más tarde.</div>
            `;
            document.body.appendChild(errorMessage);
        }, 5000);

        const response = await fetch('https://localhost:7112/Sale');

        clearTimeout(timeoutId);

        if (response.ok) {
            const sales = await response.json();
            if (mainContentHidden) {
                mainContent.style.display = "block"; 
                footer.style.display = "block"; 
            }
            displaySales(sales);
        } else {
            console.error("Error al obtener las ventas");
        }
    } catch (error) {
        console.error("Error de red o de servidor:", error);
    } finally {
        spinnerContainer.style.display = "none";
        const errorMessage = document.querySelector(".generic-message");
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

async function filterSales() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const url = buildSalesUrl(startDate, endDate);
    await fetchAndDisplaySales(url);
}

async function fetchAndDisplaySales(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar las ventas');
        }
        const sales = await response.json();
        displaySales(sales);
    } catch (error) {
        console.error(error.message);
    }
}

function buildSalesUrl(startDate, endDate) {
    let url = 'https://localhost:7112/Sale';
    const params = [];
    if (startDate) {
        params.push(`from=${startDate}`);
    }
    if (endDate) {
        params.push(`to=${endDate}`);
    }
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    return url;
}

function searchSaleById() {
    const searchId = document.getElementById('searchId').value.trim(); 
    const salesTableBody = document.getElementById('sales-table-body');
    const rows = salesTableBody.getElementsByTagName('tr');

    if (!searchId) {
        loadSales();
        return;
    }

    let found = false;

    for (let i = 0; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName('td')[0]; 
        if (idCell) {
            const id = idCell.textContent || idCell.innerText;
            
            const regex = new RegExp(`^${searchId}$`, 'i'); 
            if (regex.test(id)) {
                rows[i].style.display = '';
                found = true;
            } else {
                rows[i].style.display = 'none'; 
            }
        }
    }

    if (!found) {
        salesTableBody.innerHTML = '<tr><td colspan="5">No se encontraron ventas con el ID proporcionado.</td></tr>';
    }
}

function displaySales(sales) {
    const salesTableBody = document.getElementById('sales-table-body');
    salesTableBody.innerHTML = '';

    if (sales.length === 0) {
        salesTableBody.innerHTML = '<tr><td colspan="5">No se encontraron ventas.</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const saleRow = createSaleRow(sale);
        salesTableBody.appendChild(saleRow);
    });
}

function createSaleRow(sale) {
    const saleRow = document.createElement('tr');
    
    const totalPayFormatted = formatNumber(sale.totalPay);
    const formattedDateTime = formatDateTimeWithoutSeconds(sale.date);
    
    saleRow.innerHTML = `
        <td>${sale.id}</td>
        <td class="amount-cell"><div class="flex-container">$${totalPayFormatted}</div></td>
        <td>${sale.totalQuantity}</td>
        <td>${formattedDateTime}</td>
        <td><button class="buttonView" onclick="viewSaleDetails(${sale.id})">Ver más</button></td>
    `;
    
    return saleRow;
}

async function viewSaleDetails(saleId) {
    try {
        manageSpinner(".spinner-container", true);

        const response = await fetch(`https://localhost:7112/Sale/${saleId}`);

        manageSpinner(".spinner-container", false);

        if (!response.ok) {
            throw new Error('Error al cargar los detalles de la venta');
        }
        const sale = await response.json();
        displaySaleDetails(sale);
        openPanel();
    } catch (error) {
        console.error(error.message);
    }
}

function displaySaleDetails(sale) {
    const saleDetails = document.getElementById('sale-details');
    const productListContainer = document.getElementById('product-list-container');

    const totalPayFormatted = formatNumber(sale.totalPay);
    const subtotalFormatted = formatNumber(sale.subtotal);
    const totalDiscountFormatted = formatNumber(sale.totalDiscount);
    const totalTaxesFormatted = formatNumber((sale.subtotal - sale.totalDiscount) * 0.21);
    const dateFormatted = new Date(sale.date).toLocaleString();

    saleDetails.innerHTML = `
        <h2 id="sale-details-heading">Detalles de la Venta</h2>
        <p><strong>ID:</strong> ${sale.id}</p>
        <p><strong>Total Pagado:</strong> $${totalPayFormatted}</p>
        <p><strong>Cantidad Total:</strong> ${sale.totalQuantity}</p>
        <p><strong>Subtotal:</strong> $${subtotalFormatted}</p>
        <p><strong>Descuento Total:</strong> $${totalDiscountFormatted}</p>
        <p><strong>Impuestos IVA (21%):</strong> $${totalTaxesFormatted}</p>
        <p><strong>Fecha:</strong> ${dateFormatted}</p>
    `;
    
    const productListHTML = sale.products.map(product => `
        <li>
            <div class="product-details">
                <p><strong>ID Producto:</strong> ${product.productId}</p>
                <p><strong>Cantidad:</strong> ${product.quantity}</p>
                <p><strong>Precio:</strong> $${formatNumber(product.price)}</p>
                <p><strong>Descuento:</strong> ${product.discount}%</p>
            </div>
        </li>
    `).join('');
    
    productListContainer.innerHTML = productListHTML;
}

function openPanel() {
    const panel = document.getElementById('saleDetailsPanel');
    const overlay = document.getElementById('overlay');
    panel.style.display = 'block';
    overlay.style.display = 'block'; 
}

function closePanel() {
    const panel = document.getElementById('saleDetailsPanel');
    const overlay = document.getElementById('overlay');
    panel.style.display = 'none';
    overlay.style.display = 'none'; 
}

document.getElementById('searchId').addEventListener('input', function() {
    searchSaleById(); 
});

document.getElementById('startDate').addEventListener('input', filterSales);
document.getElementById('endDate').addEventListener('input', filterSales);

document.addEventListener('click', function(event) {
    const panel = document.getElementById('saleDetailsPanel');
    const panelWidth = panel.offsetWidth;
    const isClickInsidePanel = panel.contains(event.target);
    
    if (!isClickInsidePanel && panelWidth > 0) {
        closePanel();
    }
});