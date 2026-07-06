// ======================================================
// HISTÓRICO
// ======================================================

export function preencherHistorico(li, doc) {

    const historicoDiv = li.querySelector(".historico");

    if (!doc.historico || doc.historico.length === 0) {

        historicoDiv.innerHTML = "<p>Sem alterações registradas.</p>";

        return;

    }

    const itens = doc.historico.map((entrada) => {

        const data = new Date(entrada.data)
            .toLocaleString("pt-BR");

        if (entrada.de !== undefined) {

            return `
                <li>
                    <strong>${entrada.acao}</strong>:
                    "${entrada.de}" → "${entrada.para}"
                    <span>(${data})</span>
                </li>
            `;

        }

        return `
            <li>
                <strong>${entrada.acao}</strong>
                (${entrada.local})
                <span>(${data})</span>
            </li>
        `;

    }).join("");

    historicoDiv.innerHTML = `<ul>${itens}</ul>`;

}

// ======================================================

export function alternarHistorico(li) {

    const historico =
        li.querySelector(".historico");

    historico.style.display =
        historico.style.display === "none"
            ? "block"
            : "none";

}