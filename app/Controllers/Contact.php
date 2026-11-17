<?php

namespace App\Controllers;

use App\Models\ContactModel;

class Contact extends BaseController
{
    public function index()
    {
        return view('sections/contact');
    }

    public function send()
    {
        $contactModel = new ContactModel();

        $rules = [
            'name'    => 'required|min_length[2]|max_length[100]',
            'email'   => 'required|valid_email|max_length[150]',
            'subject' => 'required|max_length[150]',
            'message' => 'required|min_length[10]',
        ];

        $jsonResponse = function ($status, $message, $errors = []) {
            return $this->response
                ->setStatusCode($status)
                ->setJSON([
                    'success' => $status === 200,
                    'message' => $message,
                    'errors'  => $errors,
                    'csrf'    => [
                        'name' => csrf_token(),
                        'hash' => csrf_hash(),
                    ]
                ]);
        };

        // Validate form
        if (!$this->validate($rules)) {
            return $jsonResponse(
                422,
                'Please check the form fields.',
                $this->validator->getErrors()
            );
        }

        $name    = trim($this->request->getPost('name'));
        $sender  = trim($this->request->getPost('email'));
        $subject = trim($this->request->getPost('subject'));
        $message = trim($this->request->getPost('message'));

        // Read configuration from .env
        $recipient       = trim((string) env('PORTFOLIO_EMAIL'));
        $smtpUser        = trim((string) env('SMTP_USER'));
        $smtpPass        = preg_replace('/\s+/', '', trim((string) env('SMTP_PASS')));
        $hasPlaceholder  = preg_match('/^(YOUR_|PLACEHOLDER|CHANGE_ME)/i', $recipient)
            || preg_match('/^(YOUR_|PLACEHOLDER|CHANGE_ME)/i', $smtpUser)
            || preg_match('/^(YOUR_|PLACEHOLDER|CHANGE_ME)/i', $smtpPass);

        // Check configuration
        if ($recipient === '' || $smtpUser === '' || $smtpPass === '' || $hasPlaceholder) {
            log_message(
                'error',
                'Contact email configuration is missing or still has sample values. Check PORTFOLIO_EMAIL, SMTP_USER, SMTP_PASS in .env.'
            );

            return $jsonResponse(
                500,
                'Contact email is not configured. Set PORTFOLIO_EMAIL, SMTP_USER, and a Gmail App Password in .env.'
            );
        }

        // Shared SMTP config
        $smtpConfig = [
            'protocol'    => 'smtp',
            'SMTPHost'    => 'smtp.gmail.com',
            'SMTPUser'    => $smtpUser,
            'SMTPPass'    => $smtpPass,
            'SMTPPort'    => 587,
            'SMTPCrypto'  => 'tls',
            'SMTPTimeout' => 20,
            'mailType'    => 'text',
            'charset'     => 'UTF-8',
            'wordwrap'    => true,
        ];

        // ── 1. Notify portfolio owner ────────────────────────────────────────
        $email = service('email');
        $email->initialize($smtpConfig);

        $email->setFrom($smtpUser, $name . ' (via Portfolio)');
        $email->setTo($recipient);
        $email->setReplyTo($sender, $name);
        $email->setSubject('Portfolio Contact: ' . $subject);
        $email->setMessage(
            "You have received a new message from your portfolio.\n\n" .
            "Name: {$name}\n" .
            "Email: {$sender}\n" .
            "Subject: {$subject}\n\n" .
            "Message:\n{$message}"
        );

        if (!$email->send()) {
            log_message(
                'error',
                'Portfolio contact email failed to send.' .
                    $email->printDebugger(['headers'])
            );

            return $jsonResponse(
                500,
                'Unable to send your message. Please try again later.'
            );
        }

        // ── 2. Save to database ──────────────────────────────────────────────
        $save = $contactModel->insert([
            'name'    => $name,
            'email'   => $sender,
            'subject' => $subject,
            'message' => $message,
        ]);

        if (!$save) {
            log_message(
                'error',
                'Email sent successfully, but contact message could not be saved to database.'
            );
        }

        // ── 3. Send confirmation email to the sender ─────────────────────────
        $email->clear();
        $email->initialize($smtpConfig);

        $email->setFrom($smtpUser, 'Arvin Catalbas');
        $email->setTo($sender, $name);
        $email->setSubject('Thanks for reaching out, ' . $name . '!');
        $email->setMessage(
            "Hi {$name},\n\n" .
            "Thank you for getting in touch! I have received your message and will get back to you as soon as possible.\n\n" .
            "Here is a copy of what you sent:\n" .
            "--------------------------------------\n" .
            "Subject: {$subject}\n\n" .
            "{$message}\n" .
            "--------------------------------------\n\n" .
            "Best regards,\n" .
            "Arvin Catalbas"
        );

        if (!$email->send()) {
            log_message('error', 'Confirmation email to sender failed: ' . $email->printDebugger(['headers']));
        }

        return $jsonResponse(
            200,
            'Your message has been sent successfully!'
        );
    }
}
