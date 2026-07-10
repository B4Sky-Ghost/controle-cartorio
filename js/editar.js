// ======================================================
// IMPORTS
// ======================================================

import {
    ref,
    update,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { db } from "./firebase.js";
import { dom } from "./dom.js";
import { atualizarCamposEdicaoID } from "./id.js";
import { formatarNumeroDocumento } from "./utils.js";
import { mostrarToast } from "./toast.js";

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

    const numeroFormatado =
        formatarNumeroDocumento(numero);

    if (tipoId === "Protocolo") {
        return numeroFormatado;
    }

    // Exame de cálculo — salva só o número; tipoId identifica o tipo
    return numeroFormatado;
}

// ======================================================
// DECOMPÕE O ID SALVO NOS CAMPOS DO MODAL
// ======================================================

function preencherCamposId(id, tipoId) {
    const idStr = String(id || "");

    // Novo formato: tipoId separado, id é o número puro
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

    // Formato antigo: prefixo embutido no id
    // "Processo 34/2026" ou "34/2026"
    const matchProcesso = idStr.match(/^(?:Processo\s+)?(\d+)\/(\d{4})$/i);
    if (matchProcesso) {
        dom.editTipoId.value = "Processo";
        dom.editNumeroId.value = matchProcesso[1];
        dom.editAnoId.value = matchProcesso[2];
        atualizarCamposEdicaoID();
        return;
    }

    // "Exame de cálculo 4.190"
    const matchExame = idStr.match(/^Exame de c[aá]lculo\s+(.+)$/i);
    if (matchExame) {
        dom.editTipoId.value = "Exame de cálculo";
        dom.editNumeroId.value = matchExame[1];
        dom.editAnoId.value = "";
        atualizarCamposEdicaoID();
        return;
    }

    // "Protocolo 6.688" ou "6.688"
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
// REGISTRAR ALTERAÇÃO NO HISTÓRICO
// ======================================================

function registrarAlteracao(historico, campo, antigo, novo, data) {
    if (antigo === novo) return;

    historico.push({
        acao: `${campo} alterado`,
        de: antigo,
        para: novo,
        data,
    });
}

// ======================================================
// SALVAR ALTERAÇÕES
// ======================================================

export function salvarEdicao() {
    if (!documentoEditando) return;

    const novoId = montarEditId();
    const novoTipo = dom.editTipo.value;
    const novaDescricao = dom.editDescricao.value.trim();
    const novoLocal = dom.editLocal.value;

    if (!novoId) {
        mostrarToast("Preencha o identificador do documento.", "erro");
        return;
    }

    const agora = new Date().toISOString();
    const historico = [...(documentoEditando.historico || [])];

    registrarAlteracao(historico, "ID", documentoEditando.id, novoId, agora);
    registrarAlteracao(historico, "Tipo", documentoEditando.tipo, novoTipo, agora);
    registrarAlteracao(historico, "Descrição", documentoEditando.descricao, novaDescricao, agora);
    registrarAlteracao(historico, "Local", documentoEditando.local, novoLocal, agora);

    update(ref(db, "documentos/" + documentoEditando.key), {
        id: novoId,
        tipoId: dom.editTipoId.value,
        tipo: novoTipo,
        descricao: novaDescricao,
        local: novoLocal,
        horario: agora,
        historico,
    });

    fecharModal();
    mostrarToast("Alterações salvas.");
}
