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
            'name' => 'required|min_length[2]|max_length[100]',
            'email' => 'required|valid_email|max_length[150]',
            'subject' => 'required|max_length[150]',
            'message' => 'required|min_length[10]',
        ];

        // JSON response helper
        $jsonResponse = function (int $status, string $message, array $errors = []) {
            return $this->response
                ->setStatusCode($status)
                ->setJSON([
                    'success' => $status === 200,
                    'message' => $message,
                    'errors' => $errors,
                    'csrf' => [
                        'name' => csrf_token(),
                        'hash' => csrf_hash(),
                    ],
                ]);
        };

        // Validate submitted fields
        if (!$this->validate($rules)) {
            return $jsonResponse(
                422,
                'Please check your information.',
                $this->validator->getErrors()
            );
        }

        $name = trim($this->request->getPost('name'));
        $sender = trim($this->request->getPost('email'));
        $subject = trim($this->request->getPost('subject'));
        $message = trim($this->request->getPost('message'));

        // Save the message before attempting delivery so SMTP errors do not
        // discard the visitor's message.
        $saved = $contactModel->insert([
            'name' => $name,
            'email' => $sender,
            'subject' => $subject,
            'message' => $message,
            'create_at' => date('Y-m-d H:i:s'),
        ]);

        if ($saved === false) {
            log_message(
                'error',
                'Contact message could not be saved to the database: ' .
                json_encode($contactModel->errors())
            );

            return $jsonResponse(
                500,
                'We could not save your message. Please try again.'
            );
        }

        // Get SMTP credentials from .env
        $recipient = trim((string) env('PORTFOLIO_EMAIL'));
        $smtpUser = trim((string) env('SMTP_USER'));
        $smtpPass = preg_replace(
            '/\s+/',
            '',
            trim((string) env('SMTP_PASS'))
        );

        // Check configuration
        if (
            $recipient === '' ||
            $smtpUser === '' ||
            $smtpPass === '' ||
            strlen($smtpPass) !== 16 ||
            !filter_var($recipient, FILTER_VALIDATE_EMAIL) ||
            !filter_var($smtpUser, FILTER_VALIDATE_EMAIL)
        ) {
            log_message(
                'error',
                'Portfolio SMTP configuration is invalid. Check the recipient, SMTP user, and 16-character Gmail App Password.'
            );

            return $jsonResponse(
                502,
                'Your message was saved, but the email service is unavailable. Please use another contact method if you need a response.'
            );
        }

        // Gmail SMTP configuration
        $smtpConfig = [
            'protocol' => 'smtp',
            'SMTPHost' => 'smtp.gmail.com',
            'SMTPUser' => $smtpUser,
            'SMTPPass' => $smtpPass,
            'SMTPPort' => 587,
            'SMTPCrypto' => 'tls',
            'SMTPTimeout' => 30,
            'mailType' => 'text',
            'charset' => 'UTF-8',
            'wordWrap' => true,
            'validate' => true,
        ];

        // Send the message to the portfolio owner.

        $email = service('email');
        $email->initialize($smtpConfig);

        $email->setFrom($smtpUser, 'Arvin Catalbas');
        $email->setTo($recipient);
        $email->setReplyTo($sender, $name);

        $email->setSubject(
            'Portfolio Contact: ' . $subject
        );

        $email->setMessage(
            "You have received a new message from your portfolio.\n\n" .
            "Full Name: {$name}\n" .
            "Email Address: {$sender}\n" .
            "Subject: {$subject}\n\n" .
            "Message:\n{$message}\n"
        );

        if (!$email->send()) {

            log_message(
                'error',
                'Portfolio owner email failed. Check Gmail SMTP authentication and app-password settings.'
            );

            return $jsonResponse(
                502,
                'Your message was saved, but the email service is unavailable. Please use another contact method if you need a response.'
            );
        }

        // Send an optional confirmation to the visitor.
        $confirmation = service('email');
        $confirmation->initialize($smtpConfig);

        $confirmation->setFrom(
            $smtpUser,
            'Arvin Catalbas'
        );

        $confirmation->setTo($sender, $name);

        $confirmation->setSubject(
            'Thank you for contacting me!'
        );

        $confirmation->setMessage(
            "Hi {$name},\n\n" .
            "Thank you for contacting me through my portfolio.\n\n" .
            "I have successfully received your message and will get back to you as soon as possible.\n\n" .
            "Your submitted subject: {$subject}\n\n" .
            "Best regards,\n" .
            "Arvin Catalbas"
        );

        if (!$confirmation->send()) {
            log_message('error', 'Visitor confirmation email failed.');
        }

        return $jsonResponse(
            200,
            'Your message has been sent and saved successfully!'
        );
    }
}
