document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const contactSubmit = document.getElementById("contactSubmit");

    if (!contactForm || !contactSubmit) {
        return;
    }

    const buttonText = contactSubmit.querySelector(".button-text");
    const buttonIcon = contactSubmit.querySelector(".buttonIcon");

    let isSubmitting = false;

    // Validate form before submission
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
            return;
        }

        // Prevent multiple submission
        if (isSubmitting) {
            event.preventDefault();
            return;
        }

        isSubmitting = true;

        // Loading state
        contactSubmit.disabled = true;

        if (buttonText) {
            buttonText.textContent = "Sending...";
        }

        if (buttonIcon) {
            buttonIcon.className = "fa-solid fa-spinner fa-spin button-icon"
        }
    });

    // Input focus effects
    const formInputs = contactForm.querySelectorAll("input, textarea");

    formInputs.forEach((input) => {
        input.addEventListener("focus", () => {
            input.parentElement.classList.add("focused");
        });

        input.addEventListener("blur", () => {
            input.parentElement.classList.remove("focused");
        });
    });
});