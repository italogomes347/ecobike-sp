
'use strict';

const formReserva = document.querySelector('#formReserva');
const campoNome = document.querySelector('#nome');
const lista = document.querySelector('#lista');
const total = document.querySelector('#total');
const limparReservas = document.querySelector('#limparReservas');
const feedbackReserva = document.querySelector('#feedbackReserva');

const CHAVE_RESERVAS = 'ecobike-reservas';

function carregarReservas() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_RESERVAS));

        if (!Array.isArray(dados)) {
            return [];
        }

        return dados.filter((reserva) => {
            return (
                reserva &&
                typeof reserva.id === 'string' &&
                typeof reserva.nome === 'string'
            );
        });
    } catch (erro) {
        console.warn('Não foi possível carregar as pré-reservas.', erro);
        return [];
    }
}

let reservas = carregarReservas();

/* ===== ARMAZENAMENTO ===== */

function salvarReservas() {
    try {
        localStorage.setItem(CHAVE_RESERVAS, JSON.stringify(reservas));
        return true;
    } catch (erro) {
        console.error('Não foi possível salvar as pré-reservas.', erro);
        mostrarFeedback('Não foi possível salvar. Verifique o armazenamento do navegador.', true);
        return false;
    }
}

/* ===== FEEDBACK ===== */

function mostrarFeedback(mensagem, erro = false) {
    if (!feedbackReserva) return;

    feedbackReserva.textContent = mensagem;
    feedbackReserva.classList.toggle('feedback-error', erro);
}

/* ===== CONTADOR ===== */

function atualizarContador() {
    if (total) {
        total.textContent = reservas.length;
    }
}

/* ===== RENDERIZAÇÃO DA LISTA ===== */

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

            botaoRemover.setAttribute(
                'aria-label',
                `Remover pré-reserva de ${reserva.nome}`
            );

            botaoRemover.addEventListener('click', () => {
                removerReserva(reserva.id);
            });

            item.append(nome, botaoRemover);
            lista.appendChild(item);
        });
    }

    atualizarContador();

    if (limparReservas) {
        limparReservas.disabled = reservas.length === 0;
    }
}

/* ===== ADICIONAR ===== */

function adicionarReserva(nome) {
    const nomeLimpo = nome.trim().replace(/\s+/g, ' ');

    if (nomeLimpo.length < 2) {
        mostrarFeedback('Digite um nome com pelo menos 2 caracteres.', true);
        return false;
    }

    if (nomeLimpo.length > 60) {
        mostrarFeedback('O nome deve ter no máximo 60 caracteres.', true);
        return false;
    }

    const nomeExiste = reservas.some((reserva) => {
        return reserva.nome.toLocaleLowerCase('pt-BR') ===
            nomeLimpo.toLocaleLowerCase('pt-BR');
    });

    if (nomeExiste) {
        mostrarFeedback('Esse nome já está na lista.', true);
        return false;
    }

    const reserva = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        nome: nomeLimpo
    };

    reservas.push(reserva);

    if (!salvarReservas()) {
        reservas = reservas.filter((item) => item.id !== reserva.id);
        return false;
    }

    renderizarReservas();
    mostrarFeedback('Nome adicionado à lista com sucesso.');

    return true;
}

/* ===== REMOVER ===== */

function removerReserva(id) {
    const quantidadeAnterior = reservas.length;

    reservas = reservas.filter((reserva) => reserva.id !== id);

    if (reservas.length === quantidadeAnterior) return;

    if (!salvarReservas()) {
        reservas = carregarReservas();
        renderizarReservas();
        return;
    }

    renderizarReservas();
    mostrarFeedback('Pré-reserva removida.');
}

/* ===== LIMPAR LISTA ===== */

function limparListaReservas() {
    if (reservas.length === 0) return;

    const listaAnterior = [...reservas];
    reservas = [];

    if (!salvarReservas()) {
        reservas = listaAnterior;
        renderizarReservas();
        return;
    }

    renderizarReservas();
    mostrarFeedback('Lista limpa com sucesso.');
}

/* ===== EVENTOS ===== */

if (formReserva) {
    formReserva.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nome = campoNome.value;

        if (adicionarReserva(nome)) {
            campoNome.value = '';
            campoNome.focus();
        } else {
            campoNome.focus();
        }
    });
}

if (limparReservas) {
    limparReservas.addEventListener('click', limparListaReservas);
}

renderizarReservas();
