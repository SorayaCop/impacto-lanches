let cartItems = [];

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function converterPreco(precoTexto) {
    return parseFloat(
        precoTexto
            .replace('R$', '')
            .replace(/\./g, '')
            .replace(',', '.')
            .trim()
    ) || 0;
}

function obterTipoPedido() {
    const selectTipoPedido = document.getElementById('inputOrderType');
    return selectTipoPedido ? selectTipoPedido.value : 'entrega';
}

function obterValorFrete() {
    const tipoPedido = obterTipoPedido();

    if (tipoPedido === 'retirada') {
        return 0;
    }

    const selectBairro = document.getElementById('inputNeighborhood');

    if (!selectBairro || !selectBairro.value) {
        return 0;
    }

    const selectedOption = selectBairro.options[selectBairro.selectedIndex];
    return parseFloat(selectedOption.getAttribute('data-frete')) || 0;
}

function atualizarCamposPorTipoPedido() {
    const tipoPedido = obterTipoPedido();

    const neighborhoodRow = document.getElementById('neighborhood-row');
    const addressRow = document.getElementById('address-row');

    const inputNeighborhood = document.getElementById('inputNeighborhood');
    const inputAddress = document.getElementById('inputAddress');
    const inputZip = document.getElementById('inputZip');

    if (tipoPedido === 'retirada') {
        if (neighborhoodRow) neighborhoodRow.style.display = 'none';
        if (addressRow) addressRow.style.display = 'none';

        if (inputNeighborhood) inputNeighborhood.value = '';
        if (inputAddress) inputAddress.value = '';
        if (inputZip) inputZip.value = '';
    } else {
        if (neighborhoodRow) neighborhoodRow.style.display = '';
        if (addressRow) addressRow.style.display = '';
    }

    atualizarTotal();
}

function atualizarTotal() {
    const cartItems = document.querySelectorAll('#cart-items-list .cart-item');
    let totalProdutos = 0;

    cartItems.forEach(item => {
        const preco = converterPreco(
            item.querySelector('.item-preco b').textContent
        );

        const quantidade = parseInt(
            item.querySelector('.quantity-input').value
        ) || 1;

        totalProdutos += preco * quantidade;
    });

    const valorFrete = obterValorFrete();
    const totalFinal = totalProdutos + valorFrete;

    document.getElementById('total-value').textContent = formatarMoeda(totalProdutos);

    if (document.getElementById('delivery-value')) {
        document.getElementById('delivery-value').textContent = formatarMoeda(valorFrete);
    }

    if (document.getElementById('final-total-value')) {
        document.getElementById('final-total-value').textContent = formatarMoeda(totalFinal);
    }
}

function addToCart(event) {
    const productContainer = event.target.closest('.box');
    if (!productContainer) return;

    const productId = productContainer.getAttribute('data-id');
    const productTitle = productContainer.querySelector('h5')?.innerText;
    const productPrice = productContainer.querySelector('.options h4')?.innerText
        .replace('R$', '')
        .trim();

    if (!productId || !productTitle || !productPrice) return;

    const cartItemsList = document.getElementById('cart-items-list');

    const existingCartItem = Array.from(cartItemsList.children).find(item => {
        return item.getAttribute('data-id') === productId;
    });

    if (existingCartItem) {
        const quantityInput = existingCartItem.querySelector('.quantity-input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        atualizarTotal();
    } else {
        const cartItemHTML = `
            <li class="table-row cart-item" data-id="${productId}">
                <div class="col col-1">
                    <strong>${productTitle}</strong>
                </div>

                <div class="col col-2 item-preco">
                    <b>R$ ${productPrice}</b>
                </div>

                <div class="col col-3 quantity-control">
                    <button class="btn-decrement">-</button>
                    <input type="text" class="quantity-input" value="1" readonly />
                    <button class="btn-increment">+</button>
                </div>

                <div class="col col-4">
                    <button type="button" class="btn btn-danger">
                        Retirar
                    </button>
                </div>
            </li>
        `;

        cartItemsList.insertAdjacentHTML('beforeend', cartItemHTML);
        atualizarTotal();
    }
}

const addToCartButtons = document.querySelectorAll('.btn-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-decrement')) {
        const quantityInput = event.target.nextElementSibling;
        let quantity = parseInt(quantityInput.value);

        if (quantity > 1) {
            quantityInput.value = quantity - 1;
            atualizarTotal();
        }
    }

    if (event.target.classList.contains('btn-increment')) {
        const quantityInput = event.target.previousElementSibling;
        let quantity = parseInt(quantityInput.value);

        quantityInput.value = quantity + 1;
        atualizarTotal();
    }

    if (event.target.classList.contains('btn-danger')) {
        const cartItem = event.target.closest('li');
        cartItem.remove();
        atualizarTotal();
    }
});

const selectBairro = document.getElementById('inputNeighborhood');

if (selectBairro) {
    selectBairro.addEventListener('change', atualizarTotal);
}

const selectTipoPedido = document.getElementById('inputOrderType');

if (selectTipoPedido) {
    selectTipoPedido.addEventListener('change', atualizarCamposPorTipoPedido);
}

function validateInputs() {
    const name = document.getElementById("inputName").value.trim();
    const address = document.getElementById("inputAddress").value.trim();
    const neighborhood = document.getElementById("inputNeighborhood").value;
    const paymentMethod = document.getElementById("inputState").value;
    const tipoPedido = obterTipoPedido();

    if (!name) {
        alert("Por favor, informe seu nome.");
        return false;
    }

    if (tipoPedido === 'entrega') {
        if (!neighborhood) {
            alert("Por favor, selecione seu bairro.");
            return false;
        }

        if (!address) {
            alert("Por favor, informe seu endereço.");
            return false;
        }
    }

    if (paymentMethod === "Forma de Pagamento") {
        alert("Por favor, selecione uma forma de pagamento.");
        return false;
    }

    return true;
}

function generateWhatsAppMessage() {
    let message = '*Olá, gostaria de fazer um Pedido:*\n\n';

    const cartItems = document.querySelectorAll('#cart-items-list .cart-item');

    if (cartItems.length === 0) {
        alert('Seu carrinho está vazio.');
        return null;
    }

    let totalProdutos = 0;

    cartItems.forEach(item => {
        const title = item.querySelector('.col-1 strong').innerText;
        const quantity = parseInt(item.querySelector('.quantity-input').value);

        const price = converterPreco(
            item.querySelector('.item-preco b').textContent
        );

        const subtotal = price * quantity;
        totalProdutos += subtotal;

        message += `*${title}* - Qtd: ${quantity} - ${formatarMoeda(subtotal)}\n`;
    });

    const name = document.getElementById('inputName').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    const observations = document.getElementById('inputAddress2').value.trim();
    const neighborhood = document.getElementById('inputNeighborhood').value;
    const paymentMethod = document.getElementById('inputState').value;
    const tipoPedido = obterTipoPedido();

    const valorFrete = obterValorFrete();
    const totalFinal = totalProdutos + valorFrete;

    message += `\n*Tipo do pedido: ${tipoPedido === 'retirada' ? 'Retirada na loja' : 'Entrega'}*`;
    message += `\n*Subtotal dos itens: ${formatarMoeda(totalProdutos)}*`;

    if (tipoPedido === 'entrega') {
        message += `\n*Frete - ${neighborhood}: ${formatarMoeda(valorFrete)}*`;
    } else {
        message += `\n*Frete: Retirada na loja*`;
    }

    message += `\n*Total do pedido: ${formatarMoeda(totalFinal)}*\n\n`;

    message += `*Nome*: ${name}\n`;

    if (tipoPedido === 'entrega') {
        message += `*Bairro*: ${neighborhood}\n`;
        message += `*Endereço*: ${address}\n`;
    } else {
        message += `*Retirada*: Cliente irá retirar na loja\n`;
    }

    if (observations) {
        message += `*Observações*: ${observations}\n`;
    }

    message += `*Pagamento*: ${paymentMethod}\n`;

    return message;
}

function sendWhatsAppOrder() {
    if (!validateInputs()) return;

    const message = generateWhatsAppMessage();
    if (!message) return;

    const encodedMessage = encodeURIComponent(message);

    const whatsappLink =
        `https://wa.me/5522981354888?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
}

atualizarCamposPorTipoPedido();