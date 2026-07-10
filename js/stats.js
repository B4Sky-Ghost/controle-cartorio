// ======================================================
// PAINEL DE ESTATÍSTICAS
// ======================================================

import { state } from "./state.js";

export function atualizarStats() {
    const el = document.getElementById("statsBar");
    if (!el) return;

    const docs = state.todosDocs;
    const total = docs.length;

    if (!total) {
        el.innerHTML = `<span class="stat-vazio">Nenhum documento cadastrado ainda.</span>`;
        return;
    }

    // Contagem por tipo
    const contagem = {};
    docs.forEach((d) => {
        contagem[d.tipo] = (contagem[d.tipo] || 0) + 1;
    });

    // Tipo com mais documentos (para destaque)
    const tipoMaisFrequente = Object.entries(contagem)
        .sort((a, b) => b[1] - a[1])[0][0];

    // Documento mais recente
    const maisRecente = [...docs].sort(
        (a, b) => new Date(b.horario) - new Date(a.horario)
    )[0];

    const dataRecente = new Date(maisRecente.horario)
        .toLocaleDateString("pt-BR");

    // Cards de tipo — só tipos que têm documentos
    const tiposHtml = Object.entries(contagem)
        .sort((a, b) => b[1] - a[1])
        .map(([tipo, qtd]) => {
            const destaque = tipo === tipoMaisFrequente ? " stat-card--destaque" : "";
            return `
                <div class="stat-card${destaque}">
                    <span class="stat-valor">${qtd}</span>
                    <span class="stat-rotulo">${tipo}</span>
                </div>`;
        })
        .join("");

    el.innerHTML = `
        <div class="stat-card stat-card--total">
            <span class="stat-valor">${total}</span>
            <span class="stat-rotulo">Total</span>
        </div>

        <div class="stats-divisor"></div>

        ${tiposHtml}

        <div class="stats-divisor"></div>

        <div class="stat-card stat-card--recente">
            <span class="stat-valor">${maisRecente.tipoId ?? ""} ${maisRecente.id}</span>
            <span class="stat-rotulo">Último · ${dataRecente}</span>
        </div>
    `;
}
