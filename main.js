// 🔥 IMPORTANDO FIREBASE (Realtime Database)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

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
window.filtrarLista = function () {
  const termo = document.getElementById("busca").value.toLowerCase();

  const filtrados = todosDocs.filter(doc =>
    doc.id.toLowerCase().includes(termo)
  );

  renderLista(filtrados);
};

// 🧱 RENDER
function renderLista(listaDocs) {
  lista.innerHTML = "";

  // 🔥 ORDENAÇÃO INTELIGENTE
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

  listaDocs.forEach((doc) => {
    const li = document.createElement("li");

    const dataFormatada = new Date(doc.horario).toLocaleString("pt-BR");

    const span = document.createElement("span");
    span.textContent = `${doc.id} | ${doc.tipo} | ${doc.descricao} | 📍 ${doc.local} | ${dataFormatada}`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";

    const btnHistorico = document.createElement("button");
    btnHistorico.textContent = "Histórico";

    const historicoDiv = document.createElement("div");
    historicoDiv.style.display = "none";
    historicoDiv.style.marginTop = "5px";
    historicoDiv.style.fontSize = "14px";

    // 📜 HISTÓRICO
    if (doc.historico) {
      doc.historico.forEach((h) => {
        const linha = document.createElement("div");
        const data = new Date(h.data).toLocaleString("pt-BR");
        linha.textContent = `${data} → ${h.acao} (${h.local})`;
        historicoDiv.appendChild(linha);
      });
    }

    btnHistorico.onclick = () => {
      historicoDiv.style.display =
        historicoDiv.style.display === "none" ? "block" : "none";
    };

    // ✏️ EDITAR
    btnEditar.onclick = () => {
      const novoLocal = prompt("Novo local:", doc.local);
      if (!novoLocal) return;

      const agora = new Date().toISOString();
      const novoHistorico = doc.historico || [];

      let acao = "Movido";
      if (novoLocal.toLowerCase() === "arquivo") acao = "Arquivado";

      novoHistorico.push({
        acao,
        local: novoLocal,
        data: agora
      });

      update(ref(db, "documentos/" + doc.key), {
        local: novoLocal,
        historico: novoHistorico
      });
    };

    // 🗑️ EXCLUIR
    btnExcluir.onclick = () => {
      remove(ref(db, "documentos/" + doc.key));
    };

    li.appendChild(span);
    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    li.appendChild(btnHistorico);
    li.appendChild(historicoDiv);

    lista.appendChild(li);
  });
}