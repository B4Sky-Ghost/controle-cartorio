import {
    buscar,
    salvar,
    atualizar,
    remover,
    transacao,
} from "../firebase/database.js";

import { criarDocumento } from "../models/Documento.js";



// ============================
// CONSULTAS
// ============================

export async function listarDocumentos() {

    const dados = await buscar("documentos");

    if (!dados) {
        return [];
    }

    return Object.entries(dados).map(([key, documento]) =>

        criarDocumento({

            key,

            ...documento,

            historico: documento.historico
                ? Object.values(documento.historico)
                : []

        })

    );

}

export async function obterDocumento(key) {

    const dados = await buscar(`documentos/${key}`);

    if (!dados) {
        return null;
    }

    return criarDocumento({

        key,

        ...dados,

        historico: dados.historico
            ? Object.values(dados.historico)
            : []

    });

}



// ============================
// ESCRITA
// ============================

export async function excluirDocumento(key) {

    await remover(`documentos/${key}`);

}



// ============================
// PESQUISA
// ============================

export async function pesquisarDocumentos() {

}



// ============================
// ESTATÍSTICAS
// ============================

export async function obterEstatisticas() {

}



// ============================
// IMPORTAÇÃO / EXPORTAÇÃO
// ============================

export async function importarDocumentos() {

}

export async function exportarDocumentos() {

}
// =============================
// SALVAR
// =============================

export async function criarDocumentoService(dados) {

    const agora = new Date().toISOString();

    const resultado = await transacao("_meta/proximoId", (atual) => {
        return (atual || 1) + 1;
    });

    const key = String(resultado.snapshot.val() - 1);

    const documento = criarDocumento({
        ...dados,
        horario: agora,
        historico: [
            {
                acao: "Criado",
                local: dados.local,
                data: agora,
            },
        ],
    });

    await salvar(`documentos/${key}`, documento);

    return key;
}

/*ATUALIZAR DOCUMENTO*/

function registrarAlteracao(historico, campo, antigo, novo, data) {

    if (antigo === novo) return;

    historico.push({
        acao: `${campo} alterado`,
        de: antigo,
        para: novo,
        data,
    });

}

export async function atualizarDocumento(documentoAnterior, novosDados) {

    const agora = new Date().toISOString();

    const historico = [...(documentoAnterior.historico || [])];

    registrarAlteracao(
        historico,
        "ID",
        documentoAnterior.id,
        novosDados.id,
        agora
    );

    registrarAlteracao(
        historico,
        "Tipo",
        documentoAnterior.tipo,
        novosDados.tipo,
        agora
    );

    registrarAlteracao(
        historico,
        "Descrição",
        documentoAnterior.descricao,
        novosDados.descricao,
        agora
    );

    registrarAlteracao(
        historico,
        "Local",
        documentoAnterior.local,
        novosDados.local,
        agora
    );

    await atualizar(`documentos/${documentoAnterior.key}`, {

        id: novosDados.id,
        tipoId: novosDados.tipoId,
        tipo: novosDados.tipo,
        descricao: novosDados.descricao,
        local: novosDados.local,
        horario: agora,
        historico,

    });

}