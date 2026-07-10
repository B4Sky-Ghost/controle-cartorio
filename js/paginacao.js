// ======================================================
// IMPORTS
// ======================================================

import { dom } from "./dom.js";
import { state } from "./state.js";

// ======================================================
// PAGINAÇÃO
// ======================================================

export function renderPaginacao(totalItens) {
    dom.paginacao.innerHTML = "";

    const totalPaginas = Math.ceil(totalItens / state.itensPorPagina);

    if (totalPaginas <= 1) return;

    // =============================
    // ANTERIOR
    // =============================

    const btnAnterior = document.createElement("button");

    btnAnterior.textContent = "<";

    btnAnterior.disabled = state.paginaAtual === 1;

    btnAnterior.onclick = () => {
        state.paginaAtual--;

        window.filtrarLista(false);
    };

    dom.paginacao.appendChild(btnAnterior);

    // =============================
    // NÚMEROS
    // =============================

    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement("button");

        btnPagina.textContent = i;

        if (i === state.paginaAtual) {
            btnPagina.classList.add("pagina-ativa");
        }

        btnPagina.onclick = () => {
            state.paginaAtual = i;

            window.filtrarLista(false);
        };

        dom.paginacao.appendChild(btnPagina);
    }

    // =============================
    // PRÓXIMO
    // =============================

    const btnProximo = document.createElement("button");

    btnProximo.textContent = ">";

    btnProximo.disabled = state.paginaAtual === totalPaginas;

    btnProximo.onclick = () => {
        state.paginaAtual++;

        window.filtrarLista(false);
    };

    dom.paginacao.appendChild(btnProximo);
}
