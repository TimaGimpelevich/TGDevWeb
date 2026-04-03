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
  const reviewsLog = document.getElementById("reviews-log");
  const reviewsList = document.getElementById("reviews-list");

  const revealElements = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reviewsStorageKey = "tgdev_reviews";

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
