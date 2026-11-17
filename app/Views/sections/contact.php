<section id="contact" class="contact-section">
    <div class="contact-container">

        <!-- Heading -->
        <div class="contact-header">
            <h2 class="contact-title">Contact Me</h2>
        </div>

        <?php
        $success = session()->getFlashdata('success');
        $errors = (array) session()->getFlashdata('errors');
        ?>
        <div id="contactAlert"
            class="contact-alert <?= $success ? 'success-alert' : 'error-alert' ?>"
            role="alert"
            <?= ($success || $errors) ? '' : 'hidden' ?>>
            <?php if ($success): ?>
                <p><?= esc($success) ?></p>
            <?php endif; ?>
            <?php foreach ($errors as $error): ?>
                <p><?= esc($error) ?></p>
            <?php endforeach; ?>
        </div>

        <!-- Contact Form -->
        <div id="contactFeedback"
            class="contact-feedback"
            role="status"
            aria-live="polite"></div>

        <form
            action="<?= base_url('contact/send') ?>"
            method="POST"
            class="contact-form"
            id="contactForm">

            <?= csrf_field() ?>

            <div class="contact-form-grid">

                <!-- Name -->
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your Full name"
                        value="<?= esc(old('name')) ?>"
                        required
                        minlength="2"
                        maxlength="100"
                        required>
                </div>

                <!-- Email -->
                <div class="form-group">
                    <label for="email">Email Address</label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value="<?= esc(old('email')) ?>"
                        required
                        maxlength="150"
                        required>
                </div>

                <!-- Subject -->
                <div class="form-group full-width">
                    <label for="subject">Subject</label>

                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Enter subject"
                        value="<?= esc(old('subject')) ?>"
                        required
                        maxlength="150"
                        required>
                </div>

                <!-- Message -->
                <div class="form-group full-width">
                    <label for="message">Message</label>

                    <textarea
                        id="message"
                        name="message"
                        placeholder="Write your message here..."
                        required
                        minlength="10"
                        required></textarea>
                </div>

            </div>

            <!-- Submit Button -->
            <div class="contact-submit-wrapper">
                <button type="submit" id="submitBtn" class="contact-submit">
                    <span class="button-text">Send Message</span>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>

        </form>

    </div>
</section>