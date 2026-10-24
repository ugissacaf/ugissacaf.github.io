const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  }
});

document.getElementById("current-year").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
let spotlightFrame = 0;
let spotlightPosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.35 };

function scheduleSpotlightUpdate(x, y) {
  spotlightPosition = { x, y };
  if (spotlightFrame) {
    return;
  }

  spotlightFrame = window.requestAnimationFrame(() => {
    document.documentElement.style.setProperty("--spotlight-x", `${spotlightPosition.x}px`);
    document.documentElement.style.setProperty("--spotlight-y", `${spotlightPosition.y}px`);
    spotlightFrame = 0;
  });
}

if (finePointer.matches) {
  window.addEventListener("pointermove", (event) => {
    scheduleSpotlightUpdate(event.clientX, event.clientY);
  }, { passive: true });
} else if (!prefersReducedMotion) {
  let lastSpotlightUpdate = 0;

  function driftSpotlight(timestamp) {
    if (timestamp - lastSpotlightUpdate >= 80) {
      const elapsed = timestamp / 1000;
      scheduleSpotlightUpdate(
        window.innerWidth * (0.5 + 0.2 * Math.sin(elapsed * 0.12)),
        window.innerHeight * (0.42 + 0.16 * Math.sin(elapsed * 0.09 + 1.2))
      );
      lastSpotlightUpdate = timestamp;
    }
    window.requestAnimationFrame(driftSpotlight);
  }

  window.requestAnimationFrame(driftSpotlight);
}

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealElements = document.querySelectorAll(
    ".about-grid > *, .profile-section-heading, .profile-entry, .education-primary, .moments-heading, .gallery-viewport, .contact-grid > *, .footer-content"
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealElements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
    revealObserver.observe(element);
  });
}

const certificateModal = document.getElementById("certificate-modal");
const certificateModalTitle = document.getElementById("certificate-modal-title");
const certificateModalSource = document.getElementById("certificate-modal-source");
const certificateModalDetails = document.getElementById("certificate-modal-details");

function openCertificate(card) {
  certificateModalTitle.textContent = card.dataset.certificateTitle;
  certificateModalSource.textContent = card.dataset.certificateSource;
  certificateModalDetails.textContent = card.dataset.certificateDetails;
  certificateModal.showModal();
}

document.querySelectorAll(".certificate-card").forEach((card) => {
  card.addEventListener("click", () => openCertificate(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificate(card);
    }
  });
});

document.querySelectorAll(".modal-close, .modal-done").forEach((button) => {
  button.addEventListener("click", () => certificateModal.close());
});

certificateModal.addEventListener("click", (event) => {
  if (event.target === certificateModal) {
    certificateModal.close();
  }
});

const contactForm = document.forms.namedItem("contact-form");
const contactStatus = contactForm.querySelector(".form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');
let contactSubmitted = false;

contactForm.addEventListener("submit", () => {
  contactSubmitted = true;
  contactStatus.textContent = "Your message is being sent…";
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
});

document.querySelector('[name="contact-submit-frame"]').addEventListener("load", () => {
  if (!contactSubmitted) {
    return;
  }

  contactSubmitted = false;
  contactForm.reset();
  contactStatus.textContent = "Your message was sent. I’ll get back to you soon.";
  submitButton.disabled = false;
  submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
});
