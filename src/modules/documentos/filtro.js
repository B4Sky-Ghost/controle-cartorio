// ======================================================
// FILTROS
// ======================================================

import { dom } from "./dom.js";
import { state } from "./state.js";
import { renderLista } from "./render.js";

export function filtrarLista(resetPagina = true) {
    // Só volta para a página 1 quando o usuário altera um filtro
    if (resetPagina) {
        state.paginaAtual = 1;
    }

    const termo = dom.busca.value.toLowerCase().trim();

    const categoria = dom.filtroCategoria.value;

    const localFiltro = dom.filtroLocal.value;

    const filtrados = state.todosDocs.filter((doc) => {
        const matchID = doc.id.toLowerCase().includes(termo);

        const matchTipo = categoria === "" || doc.tipo === categoria;

        const matchLocal = localFiltro === "" || doc.local === localFiltro;

        return matchID && matchTipo && matchLocal;
    });

    // Guarda para uso no exportar CSV
    state.docsFiltrados = filtrados;

    renderLista(filtrados);
}