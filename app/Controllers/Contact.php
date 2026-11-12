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
        if (! $this->request->is('post')) {
            return redirect()->to('/#contact');
        }

        $isAjax = $this->request->isAJAX();

        $rules = [
            'name'    => 'required|min_length[2]|max_length[100]',
            'email'   => 'required|valid_email|max_length[150]',
            'subject' => 'required|max_length[150]',
            'message' => 'required|min_length[10]',
        ];

        if (! $this->validate($rules)) {
            $errors = $this->validator->getErrors();

            if ($isAjax) {
                return $this->json(false, 'Please check the form and try again.', 422, array_values($errors));
            }

            return redirect()->back()->withInput()->with('errors', $errors);
        }

        $data = [
            'name'    => trim((string) $this->request->getPost('name')),
            'email'   => trim((string) $this->request->getPost('email')),
            // Strip line breaks so the subject can't be used for mail header injection
            'subject' => trim(str_replace(["\r", "\n"], ' ', (string) $this->request->getPost('subject'))),
            'message' => trim((string) $this->request->getPost('message')),
        ];

        try {
            $contactModel = new ContactModel();

            if ($contactModel->insert($data) === false) {
                $errors = array_values($contactModel->errors()) ?: ['Failed to save your message.'];

                if ($isAjax) {
                    return $this->json(false, 'Failed to save your message.', 500, $errors);
                }

                return redirect()->back()->withInput()->with('errors', $errors);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Contact form DB error: {message}', ['message' => $e->getMessage()]);

            if ($isAjax) {
                return $this->json(false, 'Something went wrong. Please try again.', 500);
            }

            return redirect()->back()->withInput()->with('errors', ['Something went wrong. Please try again.']);
        }

        // The message is saved; email failure is logged but doesn't lose the message.
        $this->sendEmail($data);

        $message = 'Your message has been sent successfully!';

        if ($isAjax) {
            return $this->json(true, $message, 200);
        }

        return redirect()->to('/#contact')->with('success', $message);
    }

    private function sendEmail(array $data): bool
    {
        try {
            $config = config('Email');
            $to     = env('contact.toEmail') ?: $config->SMTPUser;

            if (! $to || ! $config->SMTPUser) {
                log_message('error', 'Contact email not configured (.env email.SMTPUser / contact.toEmail).');
                return false;
            }

            $email = service('email');
            $email->clear();
            // Gmail only allows sending as the authenticated account
            $email->setFrom($config->SMTPUser, 'Portfolio Contact Form');
            $email->setTo($to);
            $email->setReplyTo($data['email'], $data['name']);
            $email->setSubject('[Portfolio] ' . $data['subject']);

            $html = '<h3>New message from your portfolio</h3>'
                . '<p><strong>Name:</strong> ' . esc($data['name']) . '</p>'
                . '<p><strong>Email:</strong> ' . esc($data['email']) . '</p>'
                . '<p><strong>Subject:</strong> ' . esc($data['subject']) . '</p>'
                . '<p><strong>Message:</strong><br>' . nl2br(esc($data['message'])) . '</p>';

            $email->setMessage($html);
            $email->setAltMessage(
                "Name: {$data['name']}\nEmail: {$data['email']}\nSubject: {$data['subject']}\n\n{$data['message']}"
            );

            if (! $email->send(false)) {
                log_message('error', 'Contact email failed: {debug}', [
                    'debug' => $email->printDebugger(['headers']),
                ]);
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            log_message('error', 'Contact email exception: {message}', ['message' => $e->getMessage()]);
            return false;
        }
    }

    private function json(bool $success, string $message, int $status = 200, array $errors = [])
    {
        return $this->response->setStatusCode($status)->setJSON([
            'success' => $success,
            'message' => $message,
            'errors'  => $errors,
            // New CSRF token so the form can be submitted again without reload
            'csrf'    => ['name' => csrf_token(), 'hash' => csrf_hash()],
        ]);
    }
}
