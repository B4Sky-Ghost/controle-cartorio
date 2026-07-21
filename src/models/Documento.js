import { criarHistorico } from "./Historico.js";

export function criarDocumento(dados = {}) {

    return {

        key: null,

        id: "",
        descricao: "",

        tipo: "",
        tipoId: "",

        local: "",

        horario: "",

        historico: [],

        ...dados,

        historico: (dados.historico ?? []).map(criarHistorico)

    };

}