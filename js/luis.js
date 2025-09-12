/**
 * Nombre: initModal
 * Parámetros: 
 *   - openBtnId (string): ID del botón que abre el modal
 *   - modalId (string): ID del contenedor principal del modal
 *   - overlayId (string): ID del fondo (overlay) del modal
 *   - closeBtnId (string): ID del botón que cierra el modal
 * Devuelve: 
 *   - Un objeto con dos funciones: openModal() y closeModal()
 * Descripción:
 *   Inicializa la lógica de apertura, cierre y control de foco 
 *   para un modal accesible, permitiendo reutilizarlo en distintos elementos.
 */
const initModal = (openBtnClass, modalId, overlayId, closeBtnId) => {
  const openBtns = document.getElementsByClassName(openBtnClass);
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  const dialog = modal.querySelector('[role="dialog"]');
  const closeBtn = document.getElementById(closeBtnId);

  let lastFocused = null;
  let focusableElements = [];

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.remove("hidden");

    requestAnimationFrame(() => {
      dialog.classList.remove("opacity-0", "scale-95", "pointer-events-none");
      dialog.classList.add("opacity-100", "scale-100", "pointer-events-auto");
    });
    document.addEventListener("keydown", onKeyDown);
  }

  function closeModal() {
    dialog.classList.add("opacity-0", "scale-95");
    dialog.classList.remove("opacity-100", "scale-100");
    document.removeEventListener("keydown", onKeyDown);
    setTimeout(() => {
      modal.classList.add("hidden");
      if (lastFocused) lastFocused.focus();
      releaseFocusTrap();
    }, 200);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") maintainFocus(e);
  }

  function maintainFocus(e) {
    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function releaseFocusTrap() {
    focusableElements = [];
  }

  // Eventos
  overlay.addEventListener("click", closeModal);
    if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    });
    }

  Array.from(openBtns).forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  return { openModal, closeModal };
};

export {initModal} 