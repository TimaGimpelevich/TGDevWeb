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

  const reviewForm = document.getElementById("review-form-submit");
  const reviewStatus = document.getElementById("review-status");
  const reviewsGridRoot = document.getElementById("reviews-grid-root");

  const revealElements = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reviewsStorageKey = "tgdev_reviews";

  function loadReviewsFromStorage() {
    const raw = localStorage.getItem(reviewsStorageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function renderReviews() {
    if (!reviewsGridRoot) return;
    const reviews = loadReviewsFromStorage();
    reviewsGridRoot.innerHTML = "";

    if (!reviews.length) {
      for (let i = 0; i < 2; i += 1) {
        const card = document.createElement("article");
        card.className = "review-card";
        const p = document.createElement("p");
        p.className = "review-text";
        p.textContent = "Здесь будет отзыв клиента.";
        card.appendChild(p);
        reviewsGridRoot.appendChild(card);
      }
      return;
    }

    reviews.slice(0, 12).forEach((review) => {
      const card = document.createElement("article");
      card.className = "review-card";
      const p = document.createElement("p");
      p.className = "review-text";
      p.textContent = review.message || "";
      card.appendChild(p);
      reviewsGridRoot.appendChild(card);
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
