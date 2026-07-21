// ======================================================
// IDENTIFICADORES
// ======================================================

import { dom } from "../modules/documentos/dom.js";

// ======================================================
// CADASTRO
// ======================================================

export function atualizarCamposID() {

    if (dom.tipoId.value === "Processo") {

        dom.grupoAno.style.display = "flex";

    } else {

        dom.grupoAno.style.display = "none";
        dom.anoId.value = "";

    }

}

// ======================================================
// EDIÇÃO
// ======================================================

export function atualizarCamposEdicaoID() {

    if (dom.editTipoId.value === "Processo") {

        dom.editGrupoAno.style.display = "flex";

    } else {

        dom.editGrupoAno.style.display = "none";
        dom.editAnoId.value = "";

    }

}