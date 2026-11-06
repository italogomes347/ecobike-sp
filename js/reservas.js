
const formReserva = document.querySelector('#formReserva');
const campoNome = document.querySelector('#nome');
const lista = document.querySelector('#lista');
const total = document.querySelector('#total');
const limparReservas = document.querySelector('#limparReservas');
const feedbackReserva = document.querySelector('#feedbackReserva');

let reservas = JSON.parse(localStorage.getItem('ecobike-reservas')) || [];

function salvarReservas() {
    localStorage.setItem('ecobike-reservas', JSON.stringify(reservas));
}

function atualizarContador() {
    if (total) {
        total.textContent = reservas.length;
    }
}

function renderizarReservas() {
    if (!lista) return;

    lista.textContent = '';

    if (reservas.length === 0) {
        const mensagem = document.createElement('li');

        mensagem.classList.add('list-empty');
        mensagem.textContent = 'Nenhuma pré-reserva adicionada.';

        lista.appendChild(mensagem);
    } else {
        reservas.forEach((reserva) => {
            const item = document.createElement('li');
            const nome = document.createElement('span');
            const botaoRemover = document.createElement('button');

            item.classList.add('reservation-item');
            nome.classList.add('reservation-name');

            nome.textContent = reserva.nome;
            botaoRemover.textContent = 'Remover';
            botaoRemover.type = 'button';
            botaoRemover.classList.add('remove-reservation');
            botaoRemover.setAttribute('aria-label', `Remover ${reserva.nome}`);

            botaoRemover.addEventListener('click', () => {
                removerReserva(reserva.id);
            });

            item.append(nome, botaoRemover);
            lista.appendChild(item);
        });
    }

    atualizarContador();
}

function adicionarReserva(nome) {
    const nomeLimpo = nome.trim();

    if (nomeLimpo.length < 2) {
        return false;
    }

    const reserva = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        nome: nomeLimpo
    };

    reservas.push(reserva);

    salvarReservas();
    renderizarReservas();

    return true;
}

function removerReserva(id) {
    reservas = reservas.filter((reserva) => reserva.id !== id);

    salvarReservas();
    renderizarReservas();
}

function limparListaReservas() {
    reservas = [];

    salvarReservas();
    renderizarReservas();

    if (feedbackReserva) {
        feedbackReserva.textContent = 'Lista limpa com sucesso.';
    }
}

if (formReserva) {
    formReserva.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nome = campoNome.value;

        if (adicionarReserva(nome)) {
            campoNome.value = '';
            campoNome.focus();

            if (feedbackReserva) {
                feedbackReserva.textContent = 'Nome adicionado à lista com sucesso.';
            }
        } else if (feedbackReserva) {
            feedbackReserva.textContent = 'Digite um nome com pelo menos 2 caracteres.';
            campoNome.focus();
        }
    });
}

if (limparReservas) {
    limparReservas.addEventListener('click', limparListaReservas);
}

renderizarReservas();
