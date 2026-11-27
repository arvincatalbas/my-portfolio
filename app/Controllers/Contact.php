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
        $rules = [
            'name' => 'required|min_length[2]|max_length[100]',
            'email' => 'required|valid_email|max_length[150]',
            'subject' => 'required|max_length[150]',
            'message' => 'required|min_length[10]',
        ];

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

        $recipient = trim((string) env('PORTFOLIO_EMAIL'));

        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            return $jsonResponse(
                500,
                'The contact email is not configured correctly.'
            );
        }

        $db = \Config\Database::connect();

        // Save contact and email queue records together.
        $db->transBegin();

        $contactModel = new ContactModel();

        $saved = $contactModel->insert([
            'name' => $name,
            'email' => $sender,
            'subject' => $subject,
            'message' => $message,
            'create_at' => date('Y-m-d H:i:s'),
        ]);

        if ($saved === false) {
            $db->transRollback();

            log_message(
                'error',
                'Contact save failed: ' .
                json_encode($contactModel->errors())
            );

            return $jsonResponse(
                500,
                'Unable to save your message. Please try again.'
            );
        }

        $queue = [
            [
                'recipient' => $recipient,
                'sender' => $sender,
                'name' => $name,
                'subject' => 'Portfolio Contact: ' . $subject,
                'message' =>
                    "New portfolio contact message\n\n" .
                    "Name: {$name}\n" .
                    "Email: {$sender}\n" .
                    "Subject: {$subject}\n\n" .
                    "Message:\n{$message}",
                'status' => 'pending',
                'attempts' => 0,
                'create_at' => date('Y-m-d H:i:s'),
            ],
            [
                'recipient' => $sender,
                'sender' => $recipient,
                'name' => $name,
                'subject' => 'Thank you for contacting me!',
                'message' =>
                    "Hi {$name},\n\n" .
                    "Thank you for contacting me through my portfolio.\n\n" .
                    "I have successfully receive your message and will " .
                    "get back to you as soon as possible.\n\n" .
                    "Best regards, \nArvin Catalbas",
                'status' => 'pending',
                'attempts' => 0,
                'create_at' => date('Y-m-d H:i:s'),
            ],
        ];

        $queued = $db->table('email_queue')->insertBatch($queue);

        if ($queued === false || $db->transStatus() === false) {
            $db->transRollback();

            log_message('error', 'Unable to queue contact emails.');

            return $jsonResponse(
                500,
                'Unable to process your message. Please try again.'
            );
        }

        $db->transCommit();

        // Do not wait for Gmail SMTP here.
        return $jsonResponse(
            200,
            'Your message has been received successfully! Thank you for contacting me.'
        );
    }
}
