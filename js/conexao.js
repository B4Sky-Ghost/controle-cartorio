// ======================================================
// INDICADOR DE CONEXÃO COM O FIREBASE
// ======================================================

import { db } from "./firebase.js";

import {
    ref,
    onValue,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

export function iniciarMonitorConexao() {
    const el = document.getElementById("statusConexao");
    if (!el) return;

    const connRef = ref(db, ".info/connected");

    onValue(connRef, (snap) => {
        const online = snap.val() === true;

        el.className = "status-conexao " + (online ? "status-online" : "status-offline");
        el.title = online ? "Conectado ao Firebase" : "Sem conexão com o Firebase";

        el.querySelector(".status-conexao-ponto").className =
            "status-conexao-ponto " + (online ? "ponto-online" : "ponto-offline");

        el.querySelector(".status-conexao-texto").textContent =
            online ? "Online" : "Offline";
    });
}
