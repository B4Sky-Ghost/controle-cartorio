// ======================================================
// IMPORTS
// ======================================================

import {
    ref,
    update,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { db } from "./firebase.js";
import { dom } from "./dom.js";

// ======================================================
// VARIÁVEIS
// ======================================================

let documentoEditando = null;

// ======================================================
// ABRIR MODAL
// ======================================================

export function abrirModal(doc) {
    documentoEditando = doc;

    dom.editId.value = doc.id;
    dom.editTipo.value = doc.tipo;
    dom.editDescricao.value = doc.descricao;
    dom.editLocal.value = doc.local;

    dom.modal.style.display = "flex";
}

// ======================================================
// FECHAR MODAL
// ======================================================

export function fecharModal() {
    dom.modal.style.display = "none";
}

// ======================================================
// REGISTRAR ALTERAÇÃO
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
// ATUALIZA FIREBASE
// ======================================================

function atualizarDocumento(dados) {
    return update(ref(db, "documentos/" + documentoEditando.key), dados);
}

// ======================================================
// SALVAR ALTERAÇÕES
// ======================================================

export function salvarEdicao() {
    if (!documentoEditando) return;

    const novoId = dom.editId.value.trim();
    const novoTipo = dom.editTipo.value;
    const novaDescricao = dom.editDescricao.value.trim();
    const novoLocal = dom.editLocal.value;

    const agora = new Date().toISOString();

    const historico = [...(documentoEditando.historico || [])];

    registrarAlteracao(historico, "ID", documentoEditando.id, novoId, agora);

    registrarAlteracao(
        historico,
        "Tipo",
        documentoEditando.tipo,
        novoTipo,
        agora,
    );

    registrarAlteracao(
        historico,
        "Descrição",
        documentoEditando.descricao,
        novaDescricao,
        agora,
    );

    registrarAlteracao(
        historico,
        "Local",
        documentoEditando.local,
        novoLocal,
        agora,
    );

    atualizarDocumento({
        id: novoId,
        tipo: novoTipo,
        descricao: novaDescricao,
        local: novoLocal,
        horario: agora,
        historico,
    });

    fecharModal();
}