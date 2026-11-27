document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const feedback = document.getElementById("contactFeedback");

    if (!form || !submitBtn || !feedback) return;

    const buttonText = submitBtn.querySelector(".button-text");
    const originalText = buttonText?.textContent || "Send Message";

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        feedback.textContent = "";
        feedback.className = "contact-feedback";

        submitBtn.disabled = true;

        if (buttonText) { 
            buttonText.textContent = "Submitting...";
        }

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
                    result.message || "Unable to send your message.";

                feedback.classList.add("error");
            }

        } catch (error) {

            console.error("Contact form error:", error);
            
            feedback.textContent =
                "Connection Error. Please try again.";

            feedback.classList.add("error");

        } finally {

            submitBtn.disabled = false;

            if (buttonText) { 
                buttonText.textContent = originalText;
            }

        }

    });
    
});