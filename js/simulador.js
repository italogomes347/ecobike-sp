
const precos = {
    urbana: 12,
    eletrica: 20,
    cargo: 25
};

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function calcularValor(horas, tipo) {
    const precoHora = precos[tipo];

    if (!precoHora || !Number.isInteger(horas) || horas < 1 || horas > 24) {
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

function mostrarResultado(resultado) {
    const resultadoTexto = document.querySelector('#resultado');
    const detalhes = document.querySelector('#detalhesResultado');

    if (!resultadoTexto || !detalhes) return;

    if (!resultado) {
        resultadoTexto.textContent = 'Informe uma bicicleta e uma quantidade de horas válida.';
        detalhes.hidden = true;
        return;
    }

    const nomes = {
        urbana: 'Urbana',
        eletrica: 'Elétrica',
        cargo: 'Cargo'
    };

    document.querySelector('#resultadoTipo').textContent = nomes[resultado.tipo];
    document.querySelector('#resultadoHoras').textContent =
        `${resultado.horas} ${resultado.horas === 1 ? 'hora' : 'horas'}`;
    document.querySelector('#resultadoSubtotal').textContent =
        formatarMoeda(resultado.subtotal);
    document.querySelector('#resultadoDesconto').textContent =
        formatarMoeda(resultado.desconto);
    document.querySelector('#resultadoTotal').textContent =
        formatarMoeda(resultado.total);

    resultadoTexto.textContent = 'Simulação calculada com sucesso.';
    detalhes.hidden = false;
}

const formSimulador = document.querySelector('#formSimulador');

if (formSimulador) {
    const campoTipo = document.querySelector('#tipo');
    const campoHoras = document.querySelector('#horas');

    const parametros = new URLSearchParams(window.location.search);
    const tipoSelecionado = parametros.get('tipo');

    if (tipoSelecionado && precos[tipoSelecionado]) {
        campoTipo.value = tipoSelecionado;
    }

    formSimulador.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const tipo = campoTipo.value;
        const horas = Number(campoHoras.value);

        if (!tipo || !campoHoras.value.trim() || !Number.isInteger(horas) || horas < 1 || horas > 24) {
            mostrarResultado(null);
            campoHoras.focus();
            return;
        }

        const resultado = calcularValor(horas, tipo);
        mostrarResultado(resultado);
    });
}
