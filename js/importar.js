// ======================================================
// IMPORTAÇÃO DE BANCO (JSON)
// ======================================================

import { state } from "../src/modules/documentos/state.js";
import { mostrarToast } from "../src/shared/toast.js";
import { abrirConfirmacao } from "../src/shared/confirm.js";
import { importarDocumentos } from "../src/services/backupService.js";

export function importarJSON() {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json,application/json";

    input.addEventListener("change", async (e) => {

        const arquivo = e.target.files[0];

        if (!arquivo) return;

        let dados;

        try {

            dados = JSON.parse(await arquivo.text());

        } catch {

            mostrarToast("Arquivo JSON inválido.", "erro");
            return;

        }

        // Aceita tanto { documentos: [...] } quanto um array puro.

        const lista =
            Array.isArray(dados)
                ? dados
                : dados?.documentos;

        if (!Array.isArray(lista) || !lista.length) {

            mostrarToast(
                "Nenhum documento encontrado no arquivo.",
                "erro"
            );

            return;

        }

        const totalAtual = state.todosDocs.length;
        const totalNovo = lista.length;

        abrirConfirmacao({

            titulo: "Importar banco de dados",

            mensagem:
                `Os ${totalAtual} documento(s) existentes serão substituídos ` +
                `pelos ${totalNovo} do arquivo. Esta ação não pode ser desfeita. Continuar?`,

            confirmar: async () => {

                await importarDocumentos(lista);

                mostrarToast(
                    `${totalNovo} documento(s) importados com sucesso.`
                );

            },

        });

    });

    input.click();

}