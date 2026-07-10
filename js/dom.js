// ======================================================
// ELEMENTOS DO DOM
// ======================================================

export const dom = {

    // Cadastro
    id: document.getElementById("id"),
    tipo: document.getElementById("tipo"),
    descricao: document.getElementById("descricao"),
    local: document.getElementById("local"),

    tipoId: document.getElementById("tipoId"),
    numeroId: document.getElementById("numeroId"),
    grupoAno: document.getElementById("grupoAno"),
    anoId: document.getElementById("anoId"),


    // Pesquisa
    busca: document.getElementById("busca"),
    filtroCategoria: document.getElementById("filtroCat"),
    filtroLocal: document.getElementById("filtroLocal"),

    // Lista
    lista: document.getElementById("lista"),
    paginacao: document.getElementById("paginacao"),

    // Modal
    modal: document.getElementById("modalEditar"),

    editId: document.getElementById("editId"),
    editTipo: document.getElementById("editTipo"),
    editDescricao: document.getElementById("editDescricao"),
    editLocal: document.getElementById("editLocal"),

    editTipoId: document.getElementById("editTipoId"),
    editNumeroId: document.getElementById("editNumeroId"),
    editGrupoAno: document.getElementById("editGrupoAno"),
    editAnoId: document.getElementById("editAnoId"),

    // Mensagens de erro
    erroTipoId: document.getElementById("erroTipoId"),
    erroNumeroId: document.getElementById("erroNumeroId"),
    erroAnoId: document.getElementById("erroAnoId"),

    erroTipo: document.getElementById("erroTipo"),
    erroDescricao: document.getElementById("erroDescricao"),
    erroLocal: document.getElementById("erroLocal"),

    // Botão registrar
    btnRegistrar: document.getElementById("btnRegistrar"),

    // Modal de confirmação

    modalConfirmacao:
        document.getElementById("modalConfirmacao"),

    confirmTitulo:
        document.getElementById("confirmTitulo"),

    confirmMensagem:
        document.getElementById("confirmMensagem"),

    btnCancelarConfirmacao:
        document.getElementById("btnCancelarConfirmacao"),

    btnConfirmarAcao:
        document.getElementById("btnConfirmarAcao"),
};