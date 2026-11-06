
'use strict';

const botoesFiltro = document.querySelectorAll('.filter-btn');
const bicicletas = document.querySelectorAll('.bike-card');
const catalogCount = document.querySelector('#catalogCount');
const semResultados = document.querySelector('#semResultados');

function filtrarBicicletas(categoria) {
    let quantidadeVisivel = 0;

    bicicletas.forEach((bicicleta) => {
        const categoriaBike = bicicleta.dataset.category;
        const corresponde = categoria === 'todos' || categoriaBike === categoria;

        bicicleta.hidden = !corresponde;

        if (corresponde) {
            quantidadeVisivel++;
        }
    });

    if (catalogCount) {
        catalogCount.textContent =
            `${quantidadeVisivel} ${quantidadeVisivel === 1
                ? 'bicicleta encontrada'
                : 'bicicletas encontradas'}`;
    }

    if (semResultados) {
        semResultados.hidden = quantidadeVisivel !== 0;
    }
}

botoesFiltro.forEach((botao) => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach((item) => {
            item.classList.remove('active');
            item.setAttribute('aria-pressed', 'false');
        });

        botao.classList.add('active');
        botao.setAttribute('aria-pressed', 'true');

        filtrarBicicletas(botao.dataset.filter);
    });
});

filtrarBicicletas('todos');
