<section id="contact" class="contact-section">
    <div class="contact-container">

        <!-- Heading -->
        <div class="contact-header">
            <h2 class="contact-title">Contact Me</h2>
        </div>

        <!-- Success Message -->
        <?php if (session()->getFlashdata('success')): ?>
            <div class="alert alert-success">
                <?= esc(session()->getFlashdata('success')) ?>
            </div>
        <?php endif; ?>

        <!-- Validation Errors -->
        <?php if (session()->getFlashdata('errors')): ?>
            <div class="alert alert-danger">
                <?= esc(session()->getFlashdata('error')) ?>
            </div>
        <?php endif; ?>

        <!-- Contact Form -->
        <form
            id="contactForm"
            action="<?= site_url('contact/send') ?>"
            class="contact-form"
            method="POST">
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
                        autocomplete="name">
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
                        autocomplete="email">
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
                        maxlength="150">
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
                    ><?= esc(old('message')) ?></textarea>
                </div>

            </div>

            <!-- Submit Button -->
            <div class="contact-submit">
                <button type="submit" id="contactSubmit" class="contact-btn">
                    <span class="button-text">Send Message</span>
                    <i class="fa-solid fa-paper-plane button-icon"></i>
                </button>
            </div>

        </form>
        
    </div>
</section>