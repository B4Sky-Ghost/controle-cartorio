// ======================================================
// IMPORTS
// ======================================================

import { dom } from "./dom.js";

// ======================================================
// AÇÃO CONFIRMADA
// ======================================================

let acaoConfirmada = null;

// ======================================================
// ABRIR MODAL
// ======================================================

export function abrirConfirmacao({
    titulo,
    mensagem,
    confirmar
}) {

    dom.confirmTitulo.textContent = titulo;

    dom.confirmMensagem.textContent = mensagem;

    acaoConfirmada = confirmar;

    dom.modalConfirmacao.style.display = "flex";

}

// ======================================================
// FECHAR MODAL
// ======================================================

export function fecharConfirmacao() {

    dom.modalConfirmacao.style.display = "none";

    acaoConfirmada = null;

}

// ======================================================
// CONFIRMAR
// ======================================================

export function confirmarAcao() {

    if (acaoConfirmada) {
        acaoConfirmada();
    }

    fecharConfirmacao();

}

// ======================================================
// EVENTOS
// ======================================================

dom.btnCancelarConfirmacao.onclick = fecharConfirmacao;

dom.btnConfirmarAcao.onclick = confirmarAcao;