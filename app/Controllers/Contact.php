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
        if (!$this->request->is('post')) {
            return redirect()->to('/contact');
        }

        $rules = [
            'name' => 'required|min_length[2]|max_length[100]',
            'email' => 'required|valid_email|max_length[150]',
            'subject' => 'required|max_length[150]',
            'message' => 'required|min_length[10]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->back()
                ->withInput()
                ->with('errors', $this->validator->getErrors());
        }

        $contactModel = new ContactModel();

        $data = [
            'name' => $this->request->getPost('name'),
            'email' => $this->request->getPost('email'),
            'subject' => $this->request->getPost('subject'),
            'message' => $this->request->getPost('message'),
        ];

        try {
            $inserted = $contactModel->insert($data);

            if ($inserted === false) {
                return redirect()->back()
                    ->withInput()
                    ->with('errors', $contactModel->errors())
                    ->with('error', 'Failed to save your message');
            }

            return redirect()->to('/#contact')
                ->with('success', 'Your message has been send successfully!');
        } catch (\Throwable $e) {

            log_message('error', 'Contact form error: {message}', [
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }
}
