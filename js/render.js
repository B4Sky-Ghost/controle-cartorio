// ======================================================
// IMPORTS
// ======================================================

import { dom } from "./dom.js";
import { state } from "./state.js";
import { db } from "./firebase.js";

import {
  ref,
  remove,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import { preencherHistorico, alternarHistorico } from "./historico.js";

import { ordenarDocumentos } from "./utils.js";

import { renderPaginacao } from "./paginacao.js";

import { abrirConfirmacao } from "./confirm.js";
import { mostrarToast } from "./toast.js";

// ======================================================
// RENDERIZAÇÃO DA LISTA
// ======================================================

export function renderLista(listaDocs) {
  dom.lista.innerHTML = "";

  // Ordena antes de paginar
  ordenarDocumentos(listaDocs);

  const inicio = (state.paginaAtual - 1) * state.itensPorPagina;
  const fim = inicio + state.itensPorPagina;

  const documentosPagina = listaDocs.slice(inicio, fim);

  documentosPagina.forEach((doc) => {
    dom.lista.appendChild(criarLinhaDocumento(doc));
  });

  renderPaginacao(listaDocs.length);
}

// ======================================================
// CRIA UMA LINHA DA LISTA
// ======================================================

function criarLinhaDocumento(doc) {
  const li = document.createElement("li");

  const dataFormatada = new Date(doc.horario).toLocaleString("pt-BR");

  const prefixo = doc.tipoId ? `${doc.tipoId} ` : "";

  li.innerHTML = `

    <div class="doc-topo">

      <div class="doc-info">

        <span class="doc-seq">#${doc.key}</span>

        <span>

          ${prefixo}${doc.id} | ${doc.tipo} | ${doc.descricao}
          | 📍 ${doc.local} | ${dataFormatada}

        </span>

      </div>

      <div class="doc-botoes">

        <button class="btn-editar">
          Editar
        </button>

        <button class="btn-excluir">
          Excluir
        </button>

        <button class="btn-historico">
          Histórico
        </button>

      </div>

    </div>

    <div class="historico" style="display:none;"></div>

  `;

  preencherHistorico(li, doc);

  configurarBotoes(li, doc);

  return li;
}

// ======================================================
// CONFIGURA BOTÕES
// ======================================================

function configurarBotoes(li, doc) {

  const btnEditar = li.querySelector(".btn-editar");
  const btnExcluir = li.querySelector(".btn-excluir");
  const btnHistorico = li.querySelector(".btn-historico");

  btnEditar.onclick = () => {
    window.abrirModal(doc);
  };

  btnExcluir.onclick = () => {

    const prefixoExcluir = doc.tipoId ? `${doc.tipoId} ` : "";

    abrirConfirmacao({

      titulo: "Excluir documento",

      mensagem: `Tem certeza que deseja excluir o documento "${prefixoExcluir}${doc.id}"?`,

      confirmar: () => {

        remove(ref(db, "documentos/" + doc.key));
        mostrarToast("Documento excluído.", "info");

      }

    });

  };

  btnHistorico.onclick = () => {
    alternarHistorico(li);
  };

}