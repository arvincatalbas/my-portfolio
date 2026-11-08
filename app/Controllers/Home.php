<?php

namespace App\Controllers;

use App\Models\ProjectModel;

class Home extends BaseController
{
    public function index()
    {
        $projectModel = new ProjectModel();

        $data = [
            'title' => 'Arvin Catalbas - Portfolio',
            'projects' => $projectModel->getUniqueProjects(),
        ];

        return view('pages/portfolio', $data);
    }
}
