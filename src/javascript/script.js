

document.addEventListener('DOMContentLoaded', function () {
    // Função para criar um novo card
    function createNewCard() {
        const newCard = document.createElement('div');
        newCard.className = 'kanban-card';
        newCard.draggable = true;
        
        newCard.innerHTML = `
        <div class="badge medium">
            <span><b>Média prioridade</b></span>
        </div>
        <p class="card-title">
            <b>Novo Card</b>
        </p>
        <h5>Descrição do novo card</h5>
        <div class="card-infos">
            <div class="card-icons"></div>
        </div>
        <div>
            <input type="checkbox">
            <span><b>concluido</b></span>
        </div>
    `;    
        
        return newCard;
    }

    // Adiciona evento de clique para todos os botões de adicionar card
    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', function() {
            const column = this.closest('.kanban-column');
            const cardsContainer = column.querySelector('.kanban-cards');
            const newCard = createNewCard();
            
            cardsContainer.appendChild(newCard);
            updateCardCounts();
            
            // Adiciona funcionalidade de arrastar para o novo card
            setupDragAndDrop(newCard);
        });
    });

    // Função para atualizar as contagens de cards
    function updateCardCounts() {
        document.querySelectorAll('.kanban-column').forEach(column => {
            const countElement = column.querySelector('.card-count');
            const cardsCount = column.querySelectorAll('.kanban-card').length;
            countElement.textContent = `(${cardsCount})`;
        });
    }
   
    function setupDragAndDrop(card) {        
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', card.id);
            setTimeout(() => {
                card.style.display = 'none';
            }, 0);
        });

        card.addEventListener('dragend', function() {
            card.style.display = 'block';
        });
    }

    // Inicializa a contagem de cards
    updateCardCounts();
});

// Seleciona todos os elementos com a classe '.kanban-card' e adiciona eventos a cada um deles
document.querySelectorAll('.kanban-card').forEach(card => {
    // Evento disparado quando começa a arrastar um card
    card.addEventListener('dragstart', e => {
        // Adiciona a classe 'dragging' ao card que está sendo arrastado
        e.currentTarget.classList.add('dragging');
    });

    // Evento disparado quando termina de arrastar o card
    card.addEventListener('dragend', e => {
        // Remove a classe 'dragging' quando o card é solto
        e.currentTarget.classList.remove('dragging');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mostra todas as colunas e cards inicialmente
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.style.display = 'flex';
        col.querySelectorAll('.kanban-card').forEach(card => {
            card.style.display = 'flex';
        });
    });
    
    filterTasks();
    updateCardCounts();
});
document.addEventListener('DOMContentLoaded', function() {
    // Mostra todas as colunas inicialmente
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.add('show-column');
    });
    filterTasks();
});

document.getElementById('reset-filters').addEventListener('click', function() {
    document.getElementById('status-filter').value = 'all';
    document.getElementById('search-filter').value = '';
    // Mostra todas as colunas novamente
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.add('show-column');
    });
    filterTasks();
});

// Seleciona todos os elementos com a classe '.kanban-cards' (as colunas) e adiciona eventos a cada um deles
document.querySelectorAll('.kanban-cards').forEach(column => {
    // Evento disparado quando um card arrastado passa sobre uma coluna (drag over)
    column.addEventListener('dragover', e => {
        // Previne o comportamento padrão para permitir o "drop" (soltar) do card
        e.preventDefault();
        // Adiciona a classe 'cards-hover'
        e.currentTarget.classList.add('cards-hover');
    });

    // Evento disparado quando o card sai da área da coluna (quando o card é arrastado para fora)
    column.addEventListener('dragleave', e => {
        // Remove a classe 'cards-hover' quando o card deixa de estar sobre a coluna
        e.currentTarget.classList.remove('cards-hover');
    });

    // Evento disparado quando o card é solto (drop) dentro da coluna
    column.addEventListener('drop', e => {
        // Remove a classe 'cards-hover', já que o card foi solto
        e.currentTarget.classList.remove('cards-hover');

        // Seleciona o card que está sendo arrastado (que tem a classe 'dragging')
        const dragCard = document.querySelector('.kanban-card.dragging');
        
        // Anexa (move) o card arrastado para a coluna onde foi solto
        e.currentTarget.appendChild(dragCard);
    });
});

function filterTasks() {
    const statusFilter = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('search-filter').value.toLowerCase().trim();
    
    // Primeiro mostra/esconde colunas baseado no filtro de status
    document.querySelectorAll('.kanban-column').forEach(column => {
        const columnId = column.getAttribute('data-id');
        
        if (statusFilter === 'all' || statusFilter === columnId) {
            column.style.display = 'flex';
        } else {
            column.style.display = 'none';
        }
    });
    
    // Depois aplica o filtro de busca nas colunas visíveis
    document.querySelectorAll('.kanban-column').forEach(column => {
        if (column.style.display === 'none') return;
        
        let hasVisibleCards = false;
        
        column.querySelectorAll('.kanban-card').forEach(card => {
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            const cardVisible = searchTerm === '' || cardTitle.includes(searchTerm);
            
            card.style.display = cardVisible ? 'flex' : 'none';
            if (cardVisible) hasVisibleCards = true;
        });
        
        // Esconde a coluna se não houver cards visíveis e há termo de busca
        if (!hasVisibleCards && searchTerm !== '') {
            column.style.display = 'none';
        }
    });
    
    updateCardCounts();
}

// Event listeners para os filtros
document.getElementById('status-filter').addEventListener('change', filterTasks);
document.getElementById('search-filter').addEventListener('input', filterTasks);
document.getElementById('reset-filters').addEventListener('click', function() {
    document.getElementById('status-filter').value = 'all';
    document.getElementById('search-filter').value = '';
    filterTasks();
});

// Inicializa os filtros
document.addEventListener('DOMContentLoaded', function() {
    filterTasks();
});

function updateCardCounts() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        if (column.style.display === 'none') return;
        
        const countElement = column.querySelector('.card-count');
        const visibleCards = Array.from(column.querySelectorAll('.kanban-card'))
            .filter(card => card.style.display !== 'none');
        
        countElement.textContent = `(${visibleCards.length})`;
    });
}



