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

        if (!$this->validate($rules)) {
            return redirect()->back()
                ->withInput()
                ->with('errors', $this->validator->getErrors());
        }

        $contactModel->insert([
            'name' => $this->request->getPost('mame'),
            'email' => $this->request->getPost('email'),
            'subject' => $this->request->getPost('subject'),
            'message' => $this->request->getPost('message'),
        ]);

        return redirect()->to('/contact')
            ->with('success', 'Message sent successfully!');
    }
}