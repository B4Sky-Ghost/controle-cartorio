// ======================================================
// IMPORTS
// ======================================================

import { documentosRef } from "./firebase.js";
import { state } from "./state.js";

import { registrar } from "./cadastro.js";
import { filtrarLista } from "./filtro.js";

import {
  abrirModal,
  fecharModal,
  salvarEdicao
} from "./editar.js";

import {
  onValue
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// ======================================================
// CONFIGURAÇÕES
// ======================================================

// Quantidade de documentos exibidos por página
state.itensPorPagina = 25;

// Página inicial
state.paginaAtual = 1;

// Array carregado do Firebase
state.todosDocs = [];

// ======================================================
// CADASTRO DE DOCUMENTOS
// ======================================================

window.registrar = registrar;

// ======================================================
// FIREBASE - LISTENER EM TEMPO REAL
// ======================================================

onValue(documentosRef, (snapshot) => {
  state.todosDocs = [];

  snapshot.forEach((child) => {
    state.todosDocs.push({
      key: child.key,

      ...child.val(),
    });
  });

  filtrarLista();
});

// ======================================================
// FILTROS
// ======================================================

window.filtrarLista = filtrarLista;

// ======================================================
// MODAL DE EDIÇÃO
// ======================================================

window.abrirModal = abrirModal;

window.fecharModal = fecharModal;

window.salvarEdicao = salvarEdicao;