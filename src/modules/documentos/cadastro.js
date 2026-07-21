// ======================================================
// CADASTRO DE DOCUMENTOS
// ======================================================

import { criarDocumentoService } from "../../services/documentoService.js";

import { dom } from "./dom.js";

import { atualizarCamposID } from "../../utils/id.js";
import { formatarNumeroDocumento } from "../../utils/utils.js";
import { validarFormulario, atualizarBotao } from "../../utils/validacao.js";
import { mostrarToast } from "../../shared/toast.js";

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

    await criarDocumentoService({

        id,

        tipoId: dom.tipoId.value,

        tipo,

        descricao,

        local,

    });

    limparFormulario();
    atualizarBotao();
    mostrarToast("Documento registrado.");
}