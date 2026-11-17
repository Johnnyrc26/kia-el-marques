/**
 * Kia El Marqués - Main JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dinamic Current Year in Footer
  const yearElements = document.querySelectorAll("[data-current-year]");
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });

  // 2. Mobile Navigation Toggle
  const menuButton = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      navLinks.classList.toggle("is-open");
    });

    // Close mobile menu on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }

  // 3. Notify / Interest Form Handling
  const notifyForm = document.getElementById("notify-form");
  const formFeedback = document.getElementById("form-feedback");

  if (notifyForm && formFeedback) {
    notifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("notify-email");

      if (!emailInput || !emailInput.value.trim()) {
        return;
      }

      // Simulated successful registration
      formFeedback.textContent = `¡Gracias! Hemos registrado el correo ${emailInput.value.trim()}. Te notificaremos para la apertura y preventa exclusiva.`;
      formFeedback.className = "form-feedback success";
      formFeedback.style.display = "block";

      notifyForm.reset();
    });
  }
});
