// ======================================================
// CADASTRO DE DOCUMENTOS
// ======================================================

import {
    ref,
    set,
    runTransaction,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { db, metaRef } from "./firebase.js";

import { dom } from "./dom.js";

import { atualizarCamposID } from "./id.js";
import { formatarNumeroDocumento } from "./utils.js";
import { validarFormulario, atualizarBotao } from "./validacao.js";
import { mostrarToast } from "./toast.js";

// ======================================================
// MONTA O ID DO DOCUMENTO
// ======================================================

function montarId() {

    const tipoId = dom.tipoId.value;

    const numero = dom.numeroId.value.trim();

    const ano = dom.anoId.value.trim();

    if (!numero) return "";

    // Processo
    if (tipoId === "Processo") {

        if (!ano) return "";

        return `${numero}/${ano}`;

    }

    // Formata 4190 -> 4.190
    const numeroFormatado =
        formatarNumeroDocumento(numero);

    // Protocolo
    if (tipoId === "Protocolo") {
        return numeroFormatado;
    }

    // Exame de cálculo — salva só o número; tipoId identifica o tipo
    return numeroFormatado;

}

// ======================================================
// LIMPA FORMULÁRIO
// ======================================================

export function limparFormulario() {

    dom.numeroId.value = "";
    dom.anoId.value = "";
    dom.tipoId.value = "Processo";

    dom.tipo.value = "";

    dom.descricao.value = "";

    dom.local.value = "";

    atualizarCamposID();
}

// ======================================================
// REGISTRAR DOCUMENTO
// ======================================================

export async function registrar() {
    if (!validarFormulario()) return;

    const id = montarId();
    const tipo = dom.tipo.value;
    const descricao = dom.descricao.value.trim();
    const local = dom.local.value;

    if (!id || !tipo || !descricao || !local) return;

    const agora = new Date().toISOString();

    // Lê o valor atual e incrementa numa única transação atômica.
    // O doc é salvo na chave ANTES do incremento.
    const resultado = await runTransaction(metaRef, (atual) => {
        return (atual || 1) + 1;
    });

    // snapshot.val() é o valor NOVO (após +1), então a chave usada é val - 1
    const novaChave = String(resultado.snapshot.val() - 1);

    await set(ref(db, "documentos/" + novaChave), {
        id,
        tipoId: dom.tipoId.value,
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
    atualizarBotao();
    mostrarToast("Documento registrado.");
}
