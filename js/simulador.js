
'use strict';

/* ===== PREÇOS ===== */

const precos = {
    urbana: 12,
    eletrica: 20,
    cargo: 25
};

const nomesBicicletas = {
    urbana: 'Urbana',
    eletrica: 'Elétrica',
    cargo: 'Cargo'
};

/* ===== FORMATAÇÃO ===== */

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/* ===== CÁLCULO ===== */

function calcularValor(horas, tipo) {
    const precoHora = precos[tipo];

    if (
        !precoHora ||
        !Number.isInteger(horas) ||
        horas < 1 ||
        horas > 24
    ) {
        return null;
    }

    const subtotal = horas * precoHora;
    const desconto = horas > 5 ? subtotal * 0.10 : 0;
    const total = subtotal - desconto;

    return {
        tipo,
        horas,
        precoHora,
        subtotal,
        desconto,
        total
    };
}

/* ===== EXIBIÇÃO ===== */

function mostrarResultado(resultado) {
    const resultadoTexto = document.querySelector('#resultado');
    const detalhes = document.querySelector('#detalhesResultado');

    if (!resultadoTexto || !detalhes) return;

    if (!resultado) {
        resultadoTexto.textContent =
            'Informe uma bicicleta e uma quantidade de horas válida.';

        detalhes.hidden = true;
        return;
    }

    document.querySelector('#resultadoTipo').textContent =
        nomesBicicletas[resultado.tipo];

    document.querySelector('#resultadoHoras').textContent =
        `${resultado.horas} ${resultado.horas === 1 ? 'hora' : 'horas'}`;

    document.querySelector('#resultadoPrecoHora').textContent =
        `${formatarMoeda(resultado.precoHora)}/h`;

    document.querySelector('#resultadoSubtotal').textContent =
        formatarMoeda(resultado.subtotal);

    document.querySelector('#resultadoDesconto').textContent =
        resultado.desconto > 0
            ? `− ${formatarMoeda(resultado.desconto)}`
            : formatarMoeda(0);

    document.querySelector('#resultadoTotal').textContent =
        formatarMoeda(resultado.total);

    resultadoTexto.textContent = 'Sua simulação foi calculada com sucesso.';
    detalhes.hidden = false;
}

/* ===== FORMULÁRIO ===== */

const formSimulador = document.querySelector('#formSimulador');

if (formSimulador) {
    const campoTipo = document.querySelector('#tipo');
    const campoHoras = document.querySelector('#horas');

    const parametros = new URLSearchParams(window.location.search);
    const tipoSelecionado = parametros.get('tipo');

    if (tipoSelecionado && Object.hasOwn(precos, tipoSelecionado)) {
        campoTipo.value = tipoSelecionado;
    }

    function obterSimulacao() {
        const tipo = campoTipo.value;
        const valorHoras = campoHoras.value.trim();

        if (!tipo || valorHoras === '') {
            mostrarResultado(null);
            return;
        }

        const horas = Number(valorHoras);
        const resultado = calcularValor(horas, tipo);

        mostrarResultado(resultado);
    }

    formSimulador.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const tipo = campoTipo.value;
        const valorHoras = campoHoras.value.trim();
        const horas = Number(valorHoras);

        if (
            !tipo ||
            valorHoras === '' ||
            !Number.isInteger(horas) ||
            horas < 1 ||
            horas > 24
        ) {
            mostrarResultado(null);

            if (!tipo) {
                campoTipo.focus();
            } else {
                campoHoras.focus();
            }

            return;
        }

        mostrarResultado(calcularValor(horas, tipo));
    });

    campoTipo.addEventListener('change', obterSimulacao);
    campoHoras.addEventListener('input', obterSimulacao);
}
