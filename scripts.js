document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js");

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

  const closeModalButton = document.getElementById("close-contact-modal");
  const contactModal = document.getElementById("contact-modal");

  function setModalOpenState(isOpen) {
    if (!contactModal) return;
    contactModal.hidden = !isOpen;
    contactModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  document
    .querySelectorAll('[data-open-contact-modal="true"]')
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        setModalOpenState(true);
      });
    });

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

  const revealElements = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
});
