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

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealElements = document.querySelectorAll(
    ".about-grid > *, .moments-heading, .gallery-viewport, .contact-grid > *, .footer-content"
  );

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
    revealObserver.observe(element);
  });

  document.body.classList.add("motion-ready");
}

const contactForm = document.forms.namedItem("contact-form");
const contactStatus = contactForm.querySelector(".form-status");
const submitButton = contactForm.querySelector('button[type="submit"]');
const contactEndpoint = "https://script.google.com/macros/s/AKfycbz7RJb0PyFBk7BMxae9PLATdfPldVWJrQ5iuVGCQgL0w4q3n-NZcTIh9LMA2Rzty-STng/exec";

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  contactStatus.textContent = "";
  contactStatus.classList.remove("is-error");
  submitButton.disabled = true;
  submitButton.innerHTML = "Sending…";

  try {
    const response = await fetch(contactEndpoint, {
      method: "POST",
      body: new FormData(contactForm),
    });

    if (!response.ok) {
      throw new Error(`The message could not be sent (HTTP ${response.status}).`);
    }

    contactForm.reset();
    contactStatus.textContent = "Thanks — your message has been sent.";
  } catch (error) {
    contactStatus.textContent = error.message || "The message could not be sent. Please try again or email me directly.";
    contactStatus.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
  }
});
