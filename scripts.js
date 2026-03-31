document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const openModalButton = document.getElementById("open-contact-modal");
  const closeModalButton = document.getElementById("close-contact-modal");
  const contactModal = document.getElementById("contact-modal");

  function setModalOpenState(isOpen) {
    if (!contactModal) return;
    contactModal.hidden = !isOpen;
    contactModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (openModalButton) {
    openModalButton.addEventListener("click", (event) => {
      event.preventDefault();
      setModalOpenState(true);
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      setModalOpenState(false);
    });
  }

  if (contactModal) {
    contactModal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.closeModal === "true") {
        setModalOpenState(false);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setModalOpenState(false);
    }
  });
});
