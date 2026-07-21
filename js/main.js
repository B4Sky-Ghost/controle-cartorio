// ======================================================
// IMPORTS
// ======================================================

import { documentosRef } from "./firebase.js";
import { state } from "../src/modules/documentos/state.js";
import { migrarDocumentos, migrarChaves } from "./migrar.js";
import { iniciarMonitorConexao } from "./conexao.js";
import { esconderLoading } from "../src/shared/loading.js";
import { iniciarAtalhos } from "./atalhos.js";
import { atualizarStats } from "../src/modules/documentos/stats.js";

import { registrar } from "../src/modules/documentos/cadastro.js";
import { filtrarLista } from "../src/modules/documentos/filtro.js";

import {
  abrirModal,
  fecharModal,
  salvarEdicao
} from "../src/modules/documentos/editar.js";

import {
  onValue
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { dom } from "../src/modules/documentos/dom.js";

import {
  atualizarCamposID,
  atualizarCamposEdicaoID
} from "../src/utils/id.js";

import {
  validarTipoId,
  validarNumeroId,
  validarAnoId,
  validarTipo,
  validarDescricao,
  validarLocal,
  atualizarBotao,
} from "../src/utils/validacao.js";

dom.editTipoId.addEventListener(
  "change",
  atualizarCamposEdicaoID
);
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

// Atualiza visibilidade do campo Ano e revalida ao trocar tipo de ID
dom.tipoId.addEventListener("change", () => {
  atualizarCamposID();
  validarTipoId();
  validarAnoId();
  atualizarBotao();
});

// Validação em tempo real de cada campo
dom.numeroId.addEventListener("input", () => { validarNumeroId(); atualizarBotao(); });
dom.anoId.addEventListener("input", () => { validarAnoId(); atualizarBotao(); });
dom.tipo.addEventListener("change", () => { validarTipo(); atualizarBotao(); });
dom.descricao.addEventListener("input", () => { validarDescricao(); atualizarBotao(); });
dom.local.addEventListener("change", () => { validarLocal(); atualizarBotao(); });

atualizarCamposID();
atualizarBotao();
iniciarMonitorConexao();
iniciarAtalhos();
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

  // Etapa 1: normaliza tipoId e id de docs antigos
  const temIdAntigo = state.todosDocs.some((d) => !d.tipoId);
  if (temIdAntigo) {
    migrarDocumentos(state.todosDocs);
    return; // onValue dispara novamente após as atualizações
  }

  // Etapa 2: troca chaves aleatórias por números sequenciais
  const temChaveAleatoria = state.todosDocs.some(
    (d) => !/^\d+$/.test(d.key)
  );
  if (temChaveAleatoria) {
    migrarChaves(state.todosDocs);
    return; // onValue dispara novamente após as atualizações
  }

  esconderLoading();
  atualizarStats();
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
