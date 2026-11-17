document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const feedback = document.getElementById("contactFeedback");

    if (!form || !submitBtn || !feedback) {
        console.error("Contact form elements were not found.");
        return;
    }

    const buttonText = submitBtn.querySelector(".button-text");
    if (!buttonText) {
        console.error("Contact form button text was not found.");
        return;
    }

    const originalText = buttonText.textContent;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Browser validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        feedback.textContent = "";
        feedback.className = "contact-feedback";

        submitBtn.disabled = true;
        buttonText.textContent = "Sending...";

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json"
                },
                credentials: "same-origin"
            });

            const result = await response.json();

            //Refresh CSRF token
            if (result.csrf) {
                const csrfInput = form.querySelector(
                    `input[name="${result.csrf.name}"]`
                );

                if (csrfInput) {
                    csrfInput.value = result.csrf.hash;
                }
            }

            if (response.ok && result.success) {
                feedback.textContent = result.message;
                feedback.classList.add("success");

                form.reset();
            } else {
                feedback.textContent =
                    result.message || "Something went wrong.";

                feedback.classList.add("error");
            }

        } catch (error) {
            feedback.textContent =
                "Unable to send your message. Please check your connection.";

            feedback.classList.add("error");

            console.error("contact form error:", error);

        } finally {
            submitBtn.disabled = false;
            buttonText.textContent = originalText;
        }
    });
});