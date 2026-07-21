// ======================================================
// ESTATÍSTICAS
// ======================================================

export function obterEstatisticas(documentos = []) {

    const total = documentos.length;

    if (!total) {

        return {

            total: 0,
            contagem: {},
            tipoMaisFrequente: null,
            maisRecente: null,
            dataRecente: "",

        };

    }

    const contagem = {};

    let tipoMaisFrequente = null;
    let maiorQuantidade = 0;
    let maisRecente = documentos[0];

    for (const documento of documentos) {

        // Contagem por tipo

        contagem[documento.tipo] =
            (contagem[documento.tipo] || 0) + 1;

        if (contagem[documento.tipo] > maiorQuantidade) {

            maiorQuantidade = contagem[documento.tipo];
            tipoMaisFrequente = documento.tipo;

        }

        // Documento mais recente

        if (
            new Date(documento.horario) >
            new Date(maisRecente.horario)
        ) {

            maisRecente = documento;

        }

    }

    const dataRecente = new Date(maisRecente.horario)
        .toLocaleDateString("pt-BR");

    return {

        total,
        contagem,
        tipoMaisFrequente,
        maisRecente,
        dataRecente,

    };

}