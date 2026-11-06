'use strict';
const themeToggle = document.querySelector('#themeToggle');

function atualizarBotaoTema() {
    if (!themeToggle) return;

    const modoEscuro = document.body.classList.contains('dark');

    themeToggle.textContent = modoEscuro ? 'Modo claro' : 'Modo escuro';
    themeToggle.setAttribute(
        'aria-label',
        modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'
    );
}

function alternarTema() {
    document.body.classList.toggle('dark');

    const modoEscuro = document.body.classList.contains('dark');

    try {
        localStorage.setItem('ecobike-tema', modoEscuro ? 'dark' : 'light');
    } catch (erro) {
        console.warn('Não foi possível salvar a preferência de tema.', erro);
    }

    atualizarBotaoTema();
}

try {
    const temaSalvo = localStorage.getItem('ecobike-tema');

    if (temaSalvo === 'dark') {
        document.body.classList.add('dark');
    }
} catch (erro) {
    console.warn('Não foi possível recuperar a preferência de tema.', erro);
}

atualizarBotaoTema();

if (themeToggle) {
    themeToggle.addEventListener('click', alternarTema);
}


const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');

function fecharMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const menuAberto = navLinks.classList.toggle('open');

        menuToggle.classList.toggle('open', menuAberto);
        menuToggle.setAttribute('aria-expanded', String(menuAberto));
        menuToggle.setAttribute(
            'aria-label',
            menuAberto ? 'Fechar menu' : 'Abrir menu'
        );
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', fecharMenu);
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            fecharMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            fecharMenu();
        }
    });
}


const elementosAnimados = document.querySelectorAll('.reveal');

const movimentoReduzido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

if (movimentoReduzido || !('IntersectionObserver' in window)) {
    elementosAnimados.forEach((elemento) => {
        elemento.classList.add('visible');
    });
} else {
    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
    });

    elementosAnimados.forEach((elemento) => {
        observador.observe(elemento);
    });
}
