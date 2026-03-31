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
  const requestForm = document.getElementById("request-form");
  const requestStatus = document.getElementById("request-status");
  const requestsLog = document.getElementById("requests-log");
  const requestsList = document.getElementById("requests-list");
  const reviewForm = document.getElementById("review-form-submit");
  const reviewStatus = document.getElementById("review-status");
  const reviewsLog = document.getElementById("reviews-log");
  const reviewsList = document.getElementById("reviews-list");

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

  const storageKey = "tgdev_requests";
  const reviewsStorageKey = "tgdev_reviews";

  function renderRequests() {
    if (!requestsLog || !requestsList) return;
    const raw = localStorage.getItem(storageKey);
    const requests = raw ? JSON.parse(raw) : [];
    requestsList.innerHTML = "";

    if (!requests.length) {
      requestsLog.hidden = true;
      return;
    }

    requestsLog.hidden = false;
    requests.slice(0, 5).forEach((request) => {
      const item = document.createElement("li");
      item.textContent = `${request.name} (${request.contact}) - ${request.projectType}: ${request.message}`;
      requestsList.appendChild(item);
    });
  }

  if (requestForm) {
    requestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(requestForm);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        contact: String(formData.get("contact") || "").trim(),
        projectType: String(formData.get("projectType") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        createdAt: new Date().toISOString(),
      };

      if (!payload.name || !payload.contact || !payload.projectType || !payload.message) {
        if (requestStatus) requestStatus.textContent = "Пожалуйста, заполните все поля.";
        return;
      }

      const raw = localStorage.getItem(storageKey);
      const requests = raw ? JSON.parse(raw) : [];
      requests.unshift(payload);
      localStorage.setItem(storageKey, JSON.stringify(requests.slice(0, 20)));

      requestForm.reset();
      if (requestStatus) {
        requestStatus.textContent =
          "Заявка сохранена. Вы также можете сразу написать в Telegram или на почту через кнопки ниже.";
      }
      renderRequests();
    });
  }

  renderRequests();

  function renderReviews() {
    if (!reviewsLog || !reviewsList) return;
    const raw = localStorage.getItem(reviewsStorageKey);
    const reviews = raw ? JSON.parse(raw) : [];
    reviewsList.innerHTML = "";

    if (!reviews.length) {
      reviewsLog.hidden = true;
      return;
    }

    reviewsLog.hidden = false;
    reviews.slice(0, 8).forEach((review) => {
      const item = document.createElement("li");
      item.textContent = review.message;
      reviewsList.appendChild(item);
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(reviewForm);
      const message = String(formData.get("reviewMessage") || "").trim();

      if (!message) {
        if (reviewStatus) reviewStatus.textContent = "Введите текст отзыва.";
        return;
      }

      const raw = localStorage.getItem(reviewsStorageKey);
      const reviews = raw ? JSON.parse(raw) : [];
      reviews.unshift({ message, createdAt: new Date().toISOString() });
      localStorage.setItem(reviewsStorageKey, JSON.stringify(reviews.slice(0, 20)));

      reviewForm.reset();
      if (reviewStatus) reviewStatus.textContent = "Спасибо! Отзыв сохранен.";
      renderReviews();
    });
  }

  renderReviews();

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
