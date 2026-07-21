// ======================================================
// TELA DE CARREGAMENTO
// ======================================================

export function esconderLoading() {
    const el = document.getElementById("loadingScreen");
    if (!el) return;

    el.classList.add("loading--saindo");

    el.addEventListener("transitionend", () => el.remove(), { once: true });
}