// ======================================================
// TOASTS
// ======================================================

export function mostrarToast(mensagem, tipo = "sucesso") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast toast--${tipo}`;

    const icone = tipo === "sucesso" ? "✔" : tipo === "erro" ? "✖" : "ℹ";

    toast.innerHTML = `<span class="toast-icone">${icone}</span> ${mensagem}`;

    container.appendChild(toast);

    // Força reflow para a transição de entrada funcionar
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add("toast--visivel"));
    });

    setTimeout(() => {
        toast.classList.remove("toast--visivel");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    }, 2500);
}