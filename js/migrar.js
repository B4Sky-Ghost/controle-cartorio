// ======================================================
// MIGRAÇÃO DE DOCUMENTOS ANTIGOS
//
// Documentos antigos foram salvos com o prefixo do tipo
// embutido no campo "id" (ex: "Processo 34/2026").
// Esta função separa o prefixo em "tipoId" e normaliza "id".
// ======================================================

import {
    ref,
    update,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { db } from "./firebase.js";

// ======================================================
// MIGRAÇÃO DE CHAVES — troca chaves aleatórias por números
// sequenciais crescentes e inicializa o contador.
// Roda em um único update() atômico para não perder dados.
// ======================================================

export function migrarChaves(docs) {
    // docs já vêm ordenados pela chave push do Firebase,
    // que é cronológica → mantém a ordem de inserção original
    const updates = {};

    docs.forEach((doc, index) => {
        const novaChave = String(index + 1);
        const { key, ...dados } = doc;

        // Grava no novo caminho numérico
        updates[`documentos/${novaChave}`] = dados;

        // Apaga a chave aleatória antiga (só se for diferente)
        if (key !== novaChave) {
            updates[`documentos/${key}`] = null;
        }
    });

    // Define o próximo ID disponível logo após o último
    updates["_meta/proximoId"] = docs.length + 1;

    return update(ref(db, "/"), updates);
}

// Verifica se um doc precisa de migração — duas situações:
// 1. Não tem tipoId (formato original antigo)
// 2. Tem tipoId mas o id ainda contém o prefixo redundante
function precisaMigrar(doc) {
    if (!doc.tipoId) return true;

    const id = String(doc.id || "");

    if (doc.tipoId === "Processo" && /^Processo\s+/i.test(id)) return true;
    if (doc.tipoId === "Protocolo" && /^Protocolo\s+/i.test(id)) return true;
    if (
        doc.tipoId === "Exame de cálculo" &&
        /^Exame de c[aá]lculo\s+/i.test(id)
    )
        return true;

    return false;
}

export function migrarDocumentos(docs) {
    const pendentes = docs.filter(precisaMigrar);

    if (pendentes.length === 0) return;

    pendentes.forEach((doc) => {
        const idStr = String(doc.id || "");

        let novoTipoId = doc.tipoId || null;
        let novoId = idStr;

        // "Processo 34/2026" (com ou sem tipoId)
        const mProcesso = idStr.match(/^(?:Processo\s+)?(\d+\/\d{4})$/i);
        if (mProcesso) {
            novoTipoId = "Processo";
            novoId = mProcesso[1];
        }

        // "Exame de cálculo 4.190"
        else if (/^Exame de c[aá]lculo\s+/i.test(idStr)) {
            novoTipoId = "Exame de cálculo";
            novoId = idStr.replace(/^Exame de c[aá]lculo\s+/i, "");
        }

        // "Protocolo 6.688" ou somente "6.688"
        else {
            novoTipoId = novoTipoId || "Protocolo";
            novoId = idStr.replace(/^Protocolo\s+/i, "");
        }

        update(ref(db, "documentos/" + doc.key), {
            tipoId: novoTipoId,
            id: novoId,
        });
    });
}