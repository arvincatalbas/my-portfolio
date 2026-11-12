document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const contactSubmit = document.getElementById("contactSubmit");
    const contactAlert = document.getElementById("contactAlert");

    if (!contactForm || !contactSubmit) return;

    const buttonText = contactSubmit.querySelector(".button-text");
    const buttonIcon = contactSubmit.querySelector(".button-icon");

    let isSubmitting = false;

    function showAlert(type, messages) {
        if (!contactAlert) return;

        contactAlert.className = `contact-alert ${type}-alert`;
        contactAlert.innerHTML = "";

        [].concat(messages).forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            contactAlert.appendChild(p);
        });

        contactAlert.hidden = false;
        contactAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function setLoading(loading) {
        isSubmitting = loading;
        contactSubmit.disabled = loading;

        if (buttonText) {
            buttonText.textContent = loading ? "Sending..." : "Send Message";
        }

        if (buttonIcon) {
            buttonIcon.className = loading
                ? "fa-solid fa-spinner fa-spin button-icon"
                : "fa-solid fa-paper-plane button-icon";
        }
    }

    contactForm.addEventListener("submit", async (event) => {
        // Stay on the page: no redirect to home
        event.preventDefault();

        if (isSubmitting) return;

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json",
                },
            });

            let result = null;
            try {
                result = await response.json();
            } catch (e) {
                // Non-JSON response (e.g. CSRF/server error page)
            }

            // Refresh CSRF token for the next submission
            if (result && result.csrf) {
                const tokenInput = contactForm.querySelector(
                    `input[name="${result.csrf.name}"]`
                );
                if (tokenInput) tokenInput.value = result.csrf.hash;
            }

            if (response.ok && result && result.success) {
                showAlert("success", result.message);
                contactForm.reset();
            } else if (result) {
                showAlert(
                    "error",
                    result.errors && result.errors.length
                        ? result.errors
                        : result.message
                );
            } else {
                showAlert(
                    "error",
                    "Could not send your message. Please refresh the page and try again."
                );
            }
        } catch (error) {
            showAlert("error", "Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    });

    // Input focus effects
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("focus", () => input.parentElement.classList.add("focused"));
        input.addEventListener("blur", () => input.parentElement.classList.remove("focused"));
    });
});