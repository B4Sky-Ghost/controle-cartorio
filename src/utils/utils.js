// ======================================================
// UTILITÁRIOS
// ======================================================

/**
 * Interpreta um ID de documento.
 *
 * Exemplos:
 * 123/2026                  -> Processo
 * 4.190                     -> Protocolo
 * Exame de cálculo 4.190    -> Exame
 */

export function parseId(id) {
    if (!id) {
        return {
            tipo: "outro",
            numero: 0,
            ano: 0,
        };
    }

    const str = String(id).trim();

    // ==================================================
    // PROCESSOS
    // Ex.: 123/2026
    // ==================================================

    const processo = str.match(/^(\d+)\/(\d{4})$/);

    if (processo) {
        return {
            tipo: "processo",

            numero: Number(processo[1]),

            ano: Number(processo[2]),
        };
    }

    // ==================================================
    // EXAMES DE CÁLCULO
    // Ex.: Exame de cálculo 4.190
    // ==================================================

    const exame = str.match(/^Exame de cálculo\s+([\d.]+)$/i);

    if (exame) {
        return {
            tipo: "exame",

            numero: Number(exame[1].replace(/\./g, "")),

            ano: 0,
        };
    }

    // ==================================================
    // PROTOCOLOS
    // Ex.: Protocolo 4.190
    //      ou apenas 4.190
    // ==================================================

    const protocolo = str.match(/^(?:Protocolo\s+)?([\d.]+)$/i);

    if (protocolo) {
        return {
            tipo: "protocolo",

            numero: Number(protocolo[1].replace(/\./g, "")),

            ano: 0,
        };
    }

    // ==================================================
    // OUTROS
    // ==================================================

    return {
        tipo: "outro",

        numero: 0,

        ano: 0,
    };
}

// ======================================================
// FORMATA NÚMERO DO DOCUMENTO
// ======================================================

export function formatarNumeroDocumento(numero) {

    numero = String(numero).replace(/\D/g, "");

    return numero.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
    );

}

// ======================================================
// ORDENA DOCUMENTOS
// ======================================================

// Extrai tipo e id numérico puro de um doc,
// lidando com dois formatos:
//   Novo:  { tipoId: "Processo", id: "34/2026" }
//   Antigo: { id: "Processo 34/2026" }  (prefixo embutido)
function extrairInfo(doc) {
    if (doc.tipoId) {
        return { tipo: doc.tipoId.toLowerCase(), rawId: String(doc.id) };
    }

    const idStr = String(doc.id || "");

    // Formato antigo: "Processo 34/2026"
    const mProcesso = idStr.match(/^Processo\s+(\d+\/\d{4})$/i);
    if (mProcesso) {
        return { tipo: "processo", rawId: mProcesso[1] };
    }

    // Formato antigo: "Exame de cálculo 4.190"
    if (/^Exame de cálculo\s+/i.test(idStr)) {
        return { tipo: "exame", rawId: idStr };
    }

    // Formato antigo: "Protocolo 6.688" ou só "6.688"
    const parsed = parseId(idStr);
    return { tipo: parsed.tipo, rawId: idStr };
}

export function ordenarDocumentos(lista) {
    lista.sort((a, b) => {
        const infoA = extrairInfo(a);
        const infoB = extrairInfo(b);

        const isProcessoA = infoA.tipo === "processo";
        const isProcessoB = infoB.tipo === "processo";

        // =============================================
        // PROCESSOS SEMPRE PRIMEIRO
        // =============================================

        if (isProcessoA !== isProcessoB) return isProcessoA ? -1 : 1;

        // =============================================
        // DOIS PROCESSOS: ano crescente, depois número crescente
        // rawId é sempre "numero/ano" neste ponto
        // =============================================

        if (isProcessoA && isProcessoB) {
            const [numA, anoA] = infoA.rawId.split("/").map(Number);
            const [numB, anoB] = infoB.rawId.split("/").map(Number);
            if (anoA !== anoB) return anoA - anoB;
            return numA - numB;
        }

        // =============================================
        // PROTOCOLOS + EXAMES: número crescente
        // =============================================

        const numA = parseId(infoA.rawId).numero;
        const numB = parseId(infoB.rawId).numero;
        return numA - numB;
    });
}