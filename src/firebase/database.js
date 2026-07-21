// ======================================================
// IMPORTS
// ======================================================

import { db } from "../../js/firebase.js";

import {
    ref,
    get,
    set,
    update,
    remove,
    push,
    runTransaction,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// ======================================================
// CONSULTAS
// ======================================================

export async function buscar(caminho) {
    const snapshot = await get(ref(db, caminho));
    return snapshot.val();
}

// ======================================================
// CADASTRO
// ======================================================

export async function salvar(caminho, dados) {
    await set(ref(db, caminho), dados);
}

export async function atualizar(caminho, dados) {
    await update(ref(db, caminho), dados);
}

export async function remover(caminho) {
    await remove(ref(db, caminho));
}

// ======================================================
// PUSH
// ======================================================

export function gerarReferencia(caminho) {
    return push(ref(db, caminho));
}

// ======================================================
// TRANSAÇÕES
// ======================================================

export async function transacao(caminho, callback) {

    return await runTransaction(ref(db, caminho), callback);

}