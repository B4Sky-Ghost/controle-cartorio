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
// ORDENA DOCUMENTOS
// ======================================================

export function ordenarDocumentos(lista) {
    lista.sort((a, b) => {
        const A = parseId(a.id);
        const B = parseId(b.id);

        // =============================================
        // PROCESSOS SEMPRE PRIMEIRO
        // =============================================

        if (A.tipo === "processo" && B.tipo !== "processo") {
            return -1;
        }

        if (A.tipo !== "processo" && B.tipo === "processo") {
            return 1;
        }

        // =============================================
        // DOIS PROCESSOS
        // Ordena por ano e depois por número
        // =============================================

        if (A.tipo === "processo" && B.tipo === "processo") {
            if (A.ano !== B.ano) {
                return A.ano - B.ano;
            }

            return A.numero - B.numero;
        }

        // =============================================
        // TODOS OS DEMAIS
        // (Protocolos + Exames)
        // Ordena apenas pelo número
        // =============================================

        return A.numero - B.numero;
    });
}