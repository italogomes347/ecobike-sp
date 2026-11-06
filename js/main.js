
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

    localStorage.setItem('ecobike-tema', modoEscuro ? 'dark' : 'light');

    atualizarBotaoTema();
}

const temaSalvo = localStorage.getItem('ecobike-tema');

if (temaSalvo === 'dark') {
    document.body.classList.add('dark');
}

atualizarBotaoTema();

if (themeToggle) {
    themeToggle.addEventListener('click', alternarTema);
}
