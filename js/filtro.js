document.addEventListener('DOMContentLoaded', function() {
    const filterItems = document.querySelectorAll('.filters_menu li');
    const allItems = document.querySelectorAll('.filters-content .grid .col-sm-6');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownBtn = document.querySelector('.dropdown-btn'); // Botão que abre/fecha o dropdown

    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover a classe "active" de todos os itens
            filterItems.forEach(filter => filter.classList.remove('active'));
            // Adicionar a classe "active" ao item clicado
            item.classList.add('active');

            // Obter o filtro selecionado
            const filter = item.getAttribute('data-filter');

            // Mostrar ou esconder os itens com base no filtro selecionado
            allItems.forEach(product => {
                if (filter === '*' || product.classList.contains(filter.replace('.', ''))) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });

            // Fechar o dropdown após a seleção
            dropdownContent.style.display = 'none'; // Fecha o dropdown
        });
    });

    // Adiciona um clique no botão para alternar o dropdown
    dropdownBtn.addEventListener('click', function() {
        // Alterna a exibição do dropdown
        if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
            dropdownContent.style.display = 'block'; // Abre o dropdown
        } else {
            dropdownContent.style.display = 'none'; // Fecha o dropdown
        }
    });
});
