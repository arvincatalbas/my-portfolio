<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        $data = [
            'title' => 'My Portfolio | Web Developer',
        ];

        return view('pages/portfolio', [
            'title' => 'Arvin Catalbas | Portfolio'
        ]);
    }
}
