// 🔥 IMPORTANDO FIREBASE (Realtime Database)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
let documentoEditando = null;

// 🔑 CONFIG DO SEU PROJETO
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "controle-cartorio-67c94.firebaseapp.com",
  databaseURL: "https://controle-cartorio-67c94-default-rtdb.firebaseio.com",
  projectId: "controle-cartorio-67c94",
  storageBucket: "controle-cartorio-67c94.firebasestorage.app",
  messagingSenderId: "73968026458",
  appId: "1:73968026458:web:26c33e451bb0054dcae963"
};

// 🚀 INICIALIZA
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 📌 REFERÊNCIA
const documentosRef = ref(db, "documentos");

// 📦 ARRAY GLOBAL
let todosDocs = [];

// 📄 PAGINAÇÃO
let paginaAtual = 1;
const itensPorPagina = 25;

// 🧠 FUNÇÃO PRA ENTENDER O ID
function parseId(texto) {
  if (texto.includes("/")) {
    const partes = texto.split("/");

    const numero = parseInt(partes[0].replace(/\D/g, "")) || 0;
    const ano = parseInt(partes[1]) || 0;

    return { tipo: "processo", numero, ano };
  }

  const numeros = texto.match(/\d+/g);
  const numero = numeros ? parseInt(numeros.join("")) : 0;

  return { tipo: "protocolo", numero, ano: 0 };
}

// 📝 REGISTRAR
window.registrar = function () {
  const id = document.getElementById("id").value;
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;
  const local = document.getElementById("local").value;

  if (!id || !tipo || !descricao || !local) {
    alert("Preencha tudo!");
    return;
  }

  const agora = new Date().toISOString();

  push(documentosRef, {
    id,
    tipo,
    descricao,
    local,
    horario: agora,
    historico: [
      {
        acao: "Criado",
        local,
        data: agora
      }
    ]
  });

  // limpar
  document.getElementById("id").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("local").value = "";
};

// 📜 REALTIME
const lista = document.getElementById("lista");

onValue(documentosRef, (snapshot) => {
  todosDocs = [];

  snapshot.forEach((child) => {
    todosDocs.push({
      key: child.key,
      ...child.val()
    });
  });

  renderLista(todosDocs);
});

// 🔍 BUSCA
// 🔍 BUSCA + FILTROS
window.filtrarLista = function () {

  const termo =
    document.getElementById("busca")
    .value
    .toLowerCase();

  const categoria =
    document.getElementById("filtroCat")
    .value;

  const localFiltro =
    document.getElementById("filtroLocal")
    .value;

  const filtrados = todosDocs.filter(doc => {

    const matchID =
      doc.id.toLowerCase().includes(termo);

    const matchTipo =
      categoria === "" ||
      doc.tipo === categoria;

    const matchLocal =
      localFiltro === "" ||
      doc.local === localFiltro;

    return (
      matchID &&
      matchTipo &&
      matchLocal
    );

  });

  renderLista(filtrados);
};

// 🧱 RENDER
function renderLista(listaDocs) {

  lista.innerHTML = "";

  // 🔥 ORDENA PRIMEIRO
  listaDocs.sort((a, b) => {

    const A = parseId(a.id);
    const B = parseId(b.id);

    if (A.tipo === "processo" && B.tipo === "processo") {
      if (A.ano !== B.ano) return A.ano - B.ano;
      return A.numero - B.numero;
    }

    if (A.tipo === "protocolo" && B.tipo === "protocolo") {
      return A.numero - B.numero;
    }

    return A.tipo === "processo" ? -1 : 1;
  });

  // 🔥 PAGINA DEPOIS
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const docsPagina = listaDocs.slice(inicio, fim);

  docsPagina.forEach((doc) => {

    const li = document.createElement("li");

    const dataFormatada =
      new Date(doc.horario)
      .toLocaleString("pt-BR");

    const span = document.createElement("span");

    span.textContent =
      `${doc.id} | ${doc.tipo} | ${doc.descricao} | 📍 ${doc.local} | ${dataFormatada}`;

    const btnEditar =
      document.createElement("button");

    btnEditar.textContent = "Editar";

    const btnExcluir =
      document.createElement("button");

    btnExcluir.textContent = "Excluir";

    const btnHistorico =
      document.createElement("button");

    btnHistorico.textContent = "Histórico";

    const historicoDiv =
      document.createElement("div");

    historicoDiv.className = "historico";
    historicoDiv.style.display = "none";

    // HISTÓRICO
    if (doc.historico) {

      doc.historico.forEach((h) => {

        const linha =
          document.createElement("div");

        const data =
          new Date(h.data)
          .toLocaleString("pt-BR");

        linha.textContent =
`${data} → ${h.acao}${
  h.de
    ? ` (${h.de} → ${h.para})`
    : ` (${h.local})`
}`;

        historicoDiv.appendChild(linha);
      });
    }

    btnHistorico.onclick = () => {

      historicoDiv.style.display =
        historicoDiv.style.display === "none"
          ? "block"
          : "none";
    };

    // EDITAR
    btnEditar.onclick = () => {
  abrirModal(doc);
};

    // EXCLUIR
    btnExcluir.onclick = () => {

      remove(
        ref(db, "documentos/" + doc.key)
      );
    };

    const topo =
      document.createElement("div");

    topo.className = "doc-topo";

    const info =
      document.createElement("div");

    info.className = "doc-info";

    info.appendChild(span);

    const botoes =
      document.createElement("div");

    botoes.className = "doc-botoes";

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnExcluir);
    botoes.appendChild(btnHistorico);

    topo.appendChild(info);
    topo.appendChild(botoes);

    li.appendChild(topo);
    li.appendChild(historicoDiv);

    lista.appendChild(li);
  });

  renderPaginacao(listaDocs.length);
}
  // 📄 RENDERIZA PAGINAÇÃO
  function renderPaginacao(totalItens) {

    const paginacao =
      document.getElementById("paginacao");

    paginacao.innerHTML = "";

    const totalPaginas =
      Math.ceil(totalItens / itensPorPagina);

    // ⬅️ BOTÃO ANTERIOR
    const btnAnterior =
      document.createElement("button");

    btnAnterior.textContent = "<";

    btnAnterior.disabled =
      paginaAtual === 1;

    btnAnterior.onclick = () => {
      paginaAtual--;
      filtrarLista();
    };

    paginacao.appendChild(btnAnterior);

    // 🔢 NÚMEROS
    for (let i = 1; i <= totalPaginas; i++) {

      const btnPagina =
        document.createElement("button");

      btnPagina.textContent = i;

      if (i === paginaAtual) {
        btnPagina.classList.add("pagina-ativa");
      }

      btnPagina.onclick = () => {
        paginaAtual = i;
        filtrarLista();
      };

      paginacao.appendChild(btnPagina);
    }

    // ➡️ PRÓXIMO
    const btnProximo =
      document.createElement("button");

    btnProximo.textContent = ">";

    btnProximo.disabled =
      paginaAtual === totalPaginas;

    btnProximo.onclick = () => {
      paginaAtual++;
      filtrarLista();
    };

    paginacao.appendChild(btnProximo);
  }

  /* ==== FUNÇÕES DO MODAL ==== */ 

  window.fecharModal = function () {
  document.getElementById("modalEditar").style.display = "none";
};

window.abrirModal = function (doc) {

  documentoEditando = doc;

  document.getElementById("editId").value =
    doc.id;

  document.getElementById("editTipo").value =
    doc.tipo;

  document.getElementById("editDescricao").value =
    doc.descricao;

  document.getElementById("editLocal").value =
    doc.local;

  document.getElementById("modalEditar").style.display =
    "flex";
};

/* ==== SALVAR EDIÇÃO ====*/

window.salvarEdicao = function () {

  const novoId =
    document.getElementById("editId").value;

  const novoTipo =
    document.getElementById("editTipo").value;

  const novaDescricao =
    document.getElementById("editDescricao").value;

  const novoLocal =
    document.getElementById("editLocal").value;

  const agora =
    new Date().toISOString();

  const historico =
    documentoEditando.historico || [];

  if (novoId !== documentoEditando.id) {
    historico.push({
      acao: "ID alterado",
      de: documentoEditando.id,
      para: novoId,
      data: agora
    });
  }

  if (novoTipo !== documentoEditando.tipo) {
    historico.push({
      acao: "Tipo alterado",
      de: documentoEditando.tipo,
      para: novoTipo,
      data: agora
    });
  }

  if (novaDescricao !== documentoEditando.descricao) {
    historico.push({
      acao: "Descrição alterada",
      de: documentoEditando.descricao,
      para: novaDescricao,
      data: agora
    });
  }

  if (novoLocal !== documentoEditando.local) {
    historico.push({
      acao: "Local alterado",
      de: documentoEditando.local,
      para: novoLocal,
      data: agora
    });
  }

  update(
    ref(db, "documentos/" + documentoEditando.key),
    {
      id: novoId,
      tipo: novoTipo,
      descricao: novaDescricao,
      local: novoLocal,
      horario: agora,
      historico
    }
  );

  fecharModal();
};