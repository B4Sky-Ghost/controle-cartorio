// ======================================================
// EXPORTAÇÃO DE DOCUMENTOS
// ======================================================

import { state } from "../src/modules/documentos/state.js";
import { mostrarToast } from "../src/shared/toast.js";

import {
    gerarBackupJSON,
    gerarCSV,
} from "../src/services/backupService.js";

function downloadArquivo(nome, conteudo, tipo) {

    const blob = new Blob([conteudo], { type: tipo });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = nome;

    a.click();

    URL.revokeObjectURL(url);

}

function dataHoje() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}

// ======================================================
// BACKUP JSON
// ======================================================

export function exportarJSON() {

    const docs = state.todosDocs;

    if (!docs.length) {

        mostrarToast(
            "Nenhum documento para exportar.",
            "info"
        );

        return;

    }

    const payload = gerarBackupJSON(docs);

    downloadArquivo(

        `backup-documentos-${dataHoje()}.json`,

        JSON.stringify(payload, null, 2),

        "application/json"

    );

    mostrarToast(
        `Backup exportado — ${docs.length} documento(s).`
    );

}

// ======================================================
// EXPORTAÇÃO CSV
// ======================================================

export function exportarCSV() {

    const docs =
        state.docsFiltrados ??
        state.todosDocs;

    if (!docs.length) {

        mostrarToast(
            "Nenhum documento visível para exportar.",
            "info"
        );

        return;

    }

    const csv = gerarCSV(docs);

    downloadArquivo(

        `documentos-${dataHoje()}.csv`,

        "\uFEFF" + csv,

        "text/csv;charset=utf-8"

    );

    mostrarToast(
        `CSV exportado — ${docs.length} documento(s).`
    );

}