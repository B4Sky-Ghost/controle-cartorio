// ======================================================
// IMPORTAÇÃO DE BANCO (JSON)
// ======================================================

import {
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { db, metaRef } from "./firebase.js";
import { state } from "./state.js";
import { mostrarToast } from "./toast.js";
import { abrirConfirmacao } from "./confirm.js";

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

        // Aceita tanto o formato de backup { documentos: [...] }
        // quanto um array puro
        const lista = Array.isArray(dados) ? dados : dados?.documentos;

        if (!Array.isArray(lista) || !lista.length) {
            mostrarToast("Nenhum documento encontrado no arquivo.", "erro");
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
                // Reconstrói o mapa de documentos preservando as chaves originais
                const mapa = {};
                lista.forEach((doc) => {
                    const { key, ...campos } = doc;
                    mapa[key ?? String(Object.keys(mapa).length + 1)] = campos;
                });

                await set(ref(db, "documentos"), mapa);

                // Atualiza o contador para max(chave) + 1
                const chaves = Object.keys(mapa)
                    .map(Number)
                    .filter((n) => !isNaN(n));
                const proximo = chaves.length ? Math.max(...chaves) + 1 : 1;
                await set(metaRef, proximo);

                mostrarToast(`${totalNovo} documento(s) importados com sucesso.`);
            },
        });
    });

    input.click();
}
