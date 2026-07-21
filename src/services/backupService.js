// ======================================================
// IMPORTS
// ======================================================

import {
    salvar,
} from "../firebase/database.js";

// ======================================================
// IMPORTAR DOCUMENTOS
// ======================================================

export async function importarDocumentos(lista = []) {

    const mapa = {};

    lista.forEach((doc) => {

        const { key, ...campos } = doc;

        mapa[
            key ??
            String(Object.keys(mapa).length + 1)
        ] = campos;

    });

    await salvar("documentos", mapa);

    const chaves = Object.keys(mapa)
        .map(Number)
        .filter((n) => !isNaN(n));

    const proximo =
        chaves.length
            ? Math.max(...chaves) + 1
            : 1;

    await salvar("_meta/proximoId", proximo);

}

// ======================================================
// BACKUP JSON
// ======================================================

export function gerarBackupJSON(documentos = []) {

    return {

        exportadoEm: new Date().toISOString(),
        totalDocumentos: documentos.length,
        documentos,

    };

}

// ======================================================
// CSV
// ======================================================

export function gerarCSV(documentos = []) {

    const cabecalho = [

        "#",
        "ID",
        "Tipo ID",
        "Tipo",
        "Descrição",
        "Local",
        "Data",

    ];

    const linhas = documentos.map((d) => [

        d.key,
        d.id,
        d.tipoId ?? "",
        d.tipo,
        d.descricao,
        d.local,
        new Date(d.horario).toLocaleString("pt-BR"),

    ]);

    const esc = (valor) =>
        `"${String(valor ?? "").replace(/"/g, '""')}"`;

    return [cabecalho, ...linhas]
        .map((linha) => linha.map(esc).join(";"))
        .join("\r\n");

}