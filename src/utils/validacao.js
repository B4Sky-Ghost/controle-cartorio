// ======================================================
// IMPORTS
// ======================================================

import { dom } from "../modules/documentos/dom.js";

// ======================================================
// HELPERS: mostrar / limpar erro num campo
// ======================================================

function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.remove("campo-valido");
    campo.classList.add("campo-invalido");
    elementoErro.textContent = mensagem;
}

function limparErro(campo, elementoErro) {
    campo.classList.remove("campo-invalido");
    campo.classList.add("campo-valido");
    elementoErro.textContent = "";
}

// ======================================================
// VALIDAÇÕES INDIVIDUAIS
// ======================================================

export function validarTipoId() {
    if (!dom.tipoId.value) {
        mostrarErro(dom.tipoId, dom.erroTipoId, "Selecione o tipo de identificador.");
        return false;
    }
    limparErro(dom.tipoId, dom.erroTipoId);
    return true;
}

export function validarNumeroId() {
    const v = dom.numeroId.value.trim();
    if (!v) {
        mostrarErro(dom.numeroId, dom.erroNumeroId, "Informe o número do documento.");
        return false;
    }
    if (!/^\d+$/.test(v)) {
        mostrarErro(dom.numeroId, dom.erroNumeroId, "Use apenas dígitos.");
        return false;
    }
    limparErro(dom.numeroId, dom.erroNumeroId);
    return true;
}

export function validarAnoId() {
    // Só é obrigatório quando o grupo do ano estiver visível (tipo = Processo)
    const visivel = dom.grupoAno.style.display !== "none";
    if (!visivel) {
        dom.erroAnoId.textContent = "";
        return true;
    }
    const v = dom.anoId.value.trim();
    if (!v) {
        mostrarErro(dom.anoId, dom.erroAnoId, "Informe o ano.");
        return false;
    }
    const ano = Number(v);
    if (ano < 2000 || ano > 2100) {
        mostrarErro(dom.anoId, dom.erroAnoId, "Ano inválido (2000–2100).");
        return false;
    }
    limparErro(dom.anoId, dom.erroAnoId);
    return true;
}

export function validarTipo() {
    if (!dom.tipo.value) {
        mostrarErro(dom.tipo, dom.erroTipo, "Selecione o tipo do documento.");
        return false;
    }
    limparErro(dom.tipo, dom.erroTipo);
    return true;
}

export function validarDescricao() {
    if (!dom.descricao.value.trim()) {
        mostrarErro(dom.descricao, dom.erroDescricao, "Informe a descrição.");
        return false;
    }
    limparErro(dom.descricao, dom.erroDescricao);
    return true;
}

export function validarLocal() {
    if (!dom.local.value) {
        mostrarErro(dom.local, dom.erroLocal, "Selecione a localização.");
        return false;
    }
    limparErro(dom.local, dom.erroLocal);
    return true;
}

// ======================================================
// ATUALIZA O ESTADO DO BOTÃO REGISTRAR
// ======================================================

export function atualizarBotao() {
    const tudo =
        dom.tipoId.value &&
        dom.numeroId.value.trim() &&
        /^\d+$/.test(dom.numeroId.value.trim()) &&
        (dom.grupoAno.style.display === "none" || dom.anoId.value.trim()) &&
        dom.tipo.value &&
        dom.descricao.value.trim() &&
        dom.local.value;

    if (tudo) {
        dom.btnRegistrar.disabled = false;
        dom.btnRegistrar.classList.add("btn-registrar--ativo");
    } else {
        dom.btnRegistrar.disabled = true;
        dom.btnRegistrar.classList.remove("btn-registrar--ativo");
    }
}

// ======================================================
// VALIDA TUDO DE UMA VEZ (usado no submit)
// ======================================================

export function validarFormulario() {
    const ok = [
        validarTipoId(),
        validarNumeroId(),
        validarAnoId(),
        validarTipo(),
        validarDescricao(),
        validarLocal(),
    ];
    return ok.every(Boolean);
}