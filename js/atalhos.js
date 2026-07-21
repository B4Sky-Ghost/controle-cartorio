// ======================================================
// ATALHOS DE TECLADO
// ======================================================

import { dom } from "../src/modules/documentos/dom.js";
import { registrar, limparFormulario } from "../src/modules/documentos/cadastro.js";
import { fecharModal, salvarEdicao } from "../src/modules/documentos/editar.js";
import { atualizarBotao } from "../src/utils/validacao.js";
import { atualizarCamposID } from "../src/utils/id.js";
import { exportarJSON, exportarCSV } from "./exportar.js";
import { importarJSON } from "./importar.js";

function modalEdicaoAberta() {
    return dom.modal && dom.modal.style.display === "flex";
}

function modalConfirmacaoAberta() {
    return (
        dom.modalConfirmacao &&
        dom.modalConfirmacao.style.display === "flex"
    );
}

function focadoEmTextarea() {
    return document.activeElement?.tagName === "TEXTAREA";
}

export function iniciarAtalhos() {
    document.addEventListener("keydown", (e) => {
        const ctrl = e.ctrlKey || e.metaKey;

        // ── Esc → fechar modal aberto ──────────────────
        if (e.key === "Escape") {
            if (modalConfirmacaoAberta()) {
                dom.btnCancelarConfirmacao?.click();
                e.preventDefault();
                return;
            }
            if (modalEdicaoAberta()) {
                fecharModal();
                e.preventDefault();
                return;
            }
        }

        // ── Ctrl + S → salvar edição ───────────────────
        if (ctrl && e.key === "s") {
            e.preventDefault();
            if (modalEdicaoAberta()) {
                salvarEdicao();
            }
            return;
        }

        // ── Ctrl + F → foco na busca ───────────────────
        if (ctrl && e.key === "f") {
            e.preventDefault();
            dom.busca?.focus();
            dom.busca?.select();
            return;
        }

        // ── Ctrl + N → limpar formulário ───────────────
        if (ctrl && e.altKey && e.key.toLowerCase() === "n") {
            e.preventDefault();
            if (!modalEdicaoAberta()) {
                limparFormulario();
                atualizarCamposID();
                atualizarBotao();
                dom.tipoId?.focus();
            }
            return;
        }

        // ── Ctrl + E → exportar JSON (backup) ─────────
        if (ctrl && e.key === "e") {
            e.preventDefault();
            exportarJSON();
            return;
        }

        // ── Ctrl + I → importar JSON ───────────────────
        if (ctrl && e.key === "i") {
            e.preventDefault();
            importarJSON();
            return;
        }

        // ── Ctrl + P → exportar CSV ────────────────────
        if (ctrl && e.key === "p") {
            e.preventDefault();
            exportarCSV();
            return;
        }

        // ── Enter → registrar ──────────────────────────
        if (e.key === "Enter" && !ctrl) {
            if (modalEdicaoAberta() || modalConfirmacaoAberta()) return;
            if (focadoEmTextarea()) return;
            if (dom.btnRegistrar && !dom.btnRegistrar.disabled) {
                e.preventDefault();
                registrar();
            }
            return;
        }
    });
}
