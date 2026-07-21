// ======================================================
// IMPORTS
// ======================================================

import { atualizarDocumento } from "../../services/documentoService.js";
import { dom } from "./dom.js";
import { atualizarCamposEdicaoID } from "../../utils/id.js";
import { formatarNumeroDocumento } from "../../utils/utils.js";
import { mostrarToast } from "../../shared/toast.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let documentoEditando = null;

// ======================================================
// MONTA O ID A PARTIR DOS CAMPOS DE EDIÇÃO
// ======================================================

function montarEditId() {
    const tipoId = dom.editTipoId.value;
    const numero = dom.editNumeroId.value.trim();
    const ano = dom.editAnoId.value.trim();

    if (!numero) return "";

    if (tipoId === "Processo") {
        if (!ano) return "";
        return `${numero}/${ano}`;
    }

    const numeroFormatado = formatarNumeroDocumento(numero);

    if (tipoId === "Protocolo") {
        return numeroFormatado;
    }

    // Exame de cálculo — salva apenas o número.
    return numeroFormatado;
}

// ======================================================
// DECOMPÕE O ID SALVO NOS CAMPOS DO MODAL
// ======================================================

function preencherCamposId(id, tipoId) {

    const idStr = String(id || "");

    // Novo formato
    if (tipoId) {

        dom.editTipoId.value = tipoId;

        if (tipoId === "Processo") {

            const [numero, ano] = idStr.split("/");

            dom.editNumeroId.value = numero || "";
            dom.editAnoId.value = ano || "";

        } else {

            dom.editNumeroId.value = idStr;
            dom.editAnoId.value = "";

        }

        atualizarCamposEdicaoID();
        return;

    }

    // Formato antigo: Processo 34/2026

    const matchProcesso =
        idStr.match(/^(?:Processo\s+)?(\d+)\/(\d{4})$/i);

    if (matchProcesso) {

        dom.editTipoId.value = "Processo";
        dom.editNumeroId.value = matchProcesso[1];
        dom.editAnoId.value = matchProcesso[2];

        atualizarCamposEdicaoID();
        return;

    }

    // Formato antigo: Exame de cálculo 4.190

    const matchExame =
        idStr.match(/^Exame de c[aá]lculo\s+(.+)$/i);

    if (matchExame) {

        dom.editTipoId.value = "Exame de cálculo";
        dom.editNumeroId.value = matchExame[1];
        dom.editAnoId.value = "";

        atualizarCamposEdicaoID();
        return;

    }

    // Protocolo

    dom.editTipoId.value = "Protocolo";
    dom.editNumeroId.value = idStr.replace(/^Protocolo\s+/i, "");
    dom.editAnoId.value = "";

    atualizarCamposEdicaoID();

}

// ======================================================
// ABRIR MODAL
// ======================================================

export function abrirModal(doc) {

    documentoEditando = doc;

    preencherCamposId(doc.id, doc.tipoId);

    dom.editTipo.value = doc.tipo;
    dom.editDescricao.value = doc.descricao;
    dom.editLocal.value = doc.local;

    dom.modal.style.display = "flex";

}

// ======================================================
// FECHAR MODAL
// ======================================================

export function fecharModal() {

    documentoEditando = null;
    dom.modal.style.display = "none";

}

// ======================================================
// SALVAR ALTERAÇÕES
// ======================================================

export async function salvarEdicao() {

    if (!documentoEditando) return;

    const novoId = montarEditId();
    const novoTipo = dom.editTipo.value;
    const novaDescricao = dom.editDescricao.value.trim();
    const novoLocal = dom.editLocal.value;

    if (!novoId) {

        mostrarToast(
            "Preencha o identificador do documento.",
            "erro"
        );

        return;

    }

    await atualizarDocumento(documentoEditando, {

        id: novoId,
        tipoId: dom.editTipoId.value,
        tipo: novoTipo,
        descricao: novaDescricao,
        local: novoLocal,

    });

    fecharModal();

    mostrarToast("Alterações salvas.");

}