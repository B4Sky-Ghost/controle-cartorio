// ======================================================
// FIREBASE
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
    getDatabase,
    ref,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// CONFIGURAÇÃO

const firebaseConfig = {
    apiKey: "AIzaSyDaChWPWGzZcmplFL3tdX2UrZgyNxsG7YQ",

    authDomain: "controle-cartorio-67c94.firebaseapp.com",

    databaseURL: "https://controle-cartorio-67c94-default-rtdb.firebaseio.com",

    projectId: "controle-cartorio-67c94",

    storageBucket: "controle-cartorio-67c94.firebasestorage.app",

    messagingSenderId: "73968026458",

    appId: "1:73968026458:web:26c33e451bb0054dcae963",
};

// Inicializa

const app = initializeApp(firebaseConfig);

// Banco

export const db = getDatabase(app);

// Referência principal

export const documentosRef = ref(db, "documentos");

// Contador sequencial — armazena o próximo número disponível
export const metaRef = ref(db, "_meta/proximoId");
