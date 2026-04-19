// Função para exibir mensagem de sucesso
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');

    // Exibir a mensagem
    successMessage.style.display = 'block';

    // Ocultar a mensagem após 3 segundos
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Função para adicionar produto e exibir mensagem
function addToCartWithMessage(event) {

    // Exibe a mensagem de sucesso
    showSuccessMessage();
}

// Seleciona todos os botões e adiciona a função no evento click
document.querySelectorAll('.btn-cart').forEach(button => {
    button.addEventListener('click', addToCartWithMessage);
});
