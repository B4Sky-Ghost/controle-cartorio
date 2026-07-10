// ======================================================
// EXPORTAÇÃO DE DOCUMENTOS
// ======================================================

import { state } from "./state.js";
import { mostrarToast } from "./toast.js";

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
    return new Date().toISOString().slice(0, 10);
}

// ── Ctrl+E: backup completo em JSON ─────────────────────────────────────────
export function exportarJSON() {
    const docs = state.todosDocs;

    if (!docs.length) {
        mostrarToast("Nenhum documento para exportar.", "info");
        return;
    }

    const payload = {
        exportadoEm: new Date().toISOString(),
        totalDocumentos: docs.length,
        documentos: docs,
    };

    downloadArquivo(
        `backup-documentos-${dataHoje()}.json`,
        JSON.stringify(payload, null, 2),
        "application/json"
    );

    mostrarToast(`Backup exportado — ${docs.length} documento(s).`);
}

// ── Ctrl+P: lista filtrada em CSV (Excel-friendly) ──────────────────────────
export function exportarCSV() {
    const docs = state.docsFiltrados ?? state.todosDocs;

    if (!docs.length) {
        mostrarToast("Nenhum documento visível para exportar.", "info");
        return;
    }

    const cabecalho = ["#", "ID", "Tipo ID", "Tipo", "Descrição", "Local", "Data"];

    const linhas = docs.map((d) => [
        d.key,
        d.id,
        d.tipoId ?? "",
        d.tipo,
        d.descricao,
        d.local,
        new Date(d.horario).toLocaleString("pt-BR"),
    ]);

    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cabecalho, ...linhas].map((r) => r.map(esc).join(";")).join("\r\n");

    // BOM UTF-8 para o Excel reconhecer acentos
    downloadArquivo(
        `documentos-${dataHoje()}.csv`,
        "\uFEFF" + csv,
        "text/csv;charset=utf-8"
    );

    mostrarToast(`CSV exportado — ${docs.length} documento(s).`);
}
