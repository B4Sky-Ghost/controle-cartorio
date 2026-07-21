// ======================================================
// PAINEL DE ESTATÍSTICAS
// ======================================================

import { state } from "./state.js";
import { obterEstatisticas } from "../../services/estatisticaService.js";

export function atualizarStats() {

    const el = document.getElementById("statsBar");

    if (!el) return;

    const {
        total,
        contagem,
        tipoMaisFrequente,
        maisRecente,
        dataRecente,
    } = obterEstatisticas(state.todosDocs);

    if (!total) {

        el.innerHTML = `
            <span class="stat-vazio">
                Nenhum documento cadastrado ainda.
            </span>
        `;

        return;

    }

    // Cards de tipo
    const tiposHtml = Object.entries(contagem)
        .sort((a, b) => b[1] - a[1])
        .map(([tipo, qtd]) => {

            const destaque =
                tipo === tipoMaisFrequente
                    ? " stat-card--destaque"
                    : "";

            return `
                <div class="stat-card${destaque}">
                    <span class="stat-valor">${qtd}</span>
                    <span class="stat-rotulo">${tipo}</span>
                </div>
            `;

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
            <span class="stat-valor">
                ${maisRecente.tipoId ?? ""} ${maisRecente.id}
            </span>

            <span class="stat-rotulo">
                Último · ${dataRecente}
            </span>
        </div>
    `;

}