let cartItems = [];

// Função para atualizar o valor total apenas dos produtos
function atualizarTotal() {
    const cartItems = document.querySelectorAll('#cart-items-list .cart-item');
    let totalProdutos = 0;

    cartItems.forEach(item => {
        const preco = parseFloat(
            item.querySelector('.item-preco b').textContent.replace('R$', '').trim()
        ) || 0;

        const quantidade = parseInt(
            item.querySelector('.quantity-input').value
        ) || 1;

        totalProdutos += preco * quantidade;
    });

    document.getElementById('total-value').textContent =
        `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
}

// Função para adicionar produto ao carrinho
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

// Botões adicionar ao carrinho
const addToCartButtons = document.querySelectorAll('.btn-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Eventos carrinho
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

// Validação
function validateInputs() {
    const name = document.getElementById("inputName").value.trim();
    const address = document.getElementById("inputAddress").value.trim();
    const paymentMethod = document.getElementById("inputState").value;

    if (!name) {
        alert("Por favor, informe seu nome.");
        return false;
    }

    if (!address) {
        alert("Por favor, informe seu endereço.");
        return false;
    }

    if (paymentMethod === "Forma de Pagamento") {
        alert("Por favor, selecione uma forma de pagamento.");
        return false;
    }

    return true;
}

// Mensagem WhatsApp
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

        const price = parseFloat(
            item.querySelector('.item-preco b').textContent
                .replace('R$', '')
                .trim()
        );

        totalProdutos += price * quantity;

        message += `*${title}* - Qtd: ${quantity} - R$ ${(price * quantity).toFixed(2).replace('.', ',')}\n`;
    });

    const name = document.getElementById('inputName').value.trim();
    const address = document.getElementById('inputAddress').value.trim();
    const paymentMethod = document.getElementById('inputState').value;

    message += `\n*Total: R$ ${totalProdutos.toFixed(2).replace('.', ',')}*\n\n`;
    message += `*Nome*: ${name}\n`;
    message += `*Endereço*: ${address}\n`;
    message += `*Pagamento*: ${paymentMethod}\n`;

    return message;
}

// Enviar pedido
function sendWhatsAppOrder() {
    if (!validateInputs()) return;

    const message = generateWhatsAppMessage();
    if (!message) return;

    const encodedMessage = encodeURIComponent(message);

    const whatsappLink =
        `https://wa.me/5522981354888?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
}