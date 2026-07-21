export function criarHistorico(dados = {}) {

    return {
        acao: "",
        data: "",
        local: "",
        de: "",
        para: "",

        ...dados
    };

}