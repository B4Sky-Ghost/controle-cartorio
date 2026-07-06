// ======================================================
// CADASTRO DE DOCUMENTOS
// ======================================================

import { push } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { documentosRef } from "./firebase.js";

import { dom } from "./dom.js";

// ======================================================
// LIMPA FORMULÁRIO
// ======================================================

export function limparFormulario() {
    dom.id.value = "";
    dom.tipo.value = "";
    dom.descricao.value = "";
    dom.local.value = "";
}

// ======================================================
// REGISTRAR DOCUMENTO
// ======================================================

export function registrar() {
    const id = dom.id.value.trim();

    const tipo = dom.tipo.value;

    const descricao = dom.descricao.value.trim();

    const local = dom.local.value;

    if (!id || !tipo || !descricao || !local) {
        alert("Preencha todos os campos.");

        return;
    }

    const agora = new Date().toISOString();

    push(documentosRef, {
        id,

        tipo,

        descricao,

        local,

        horario: agora,

        historico: [
            {
                acao: "Criado",

                local,

                data: agora,
            },
        ],
    });

    limparFormulario();
}