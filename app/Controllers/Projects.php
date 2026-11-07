<?php

namespace App\Controllers;

use App\Models\ProjectModel;

class Projects extends BaseController
{
    public function index()
    {
        $projectModel = new ProjectModel();

        $data = [
            'projects' => $projectModel
                ->orderBy('create_at', 'DESC')
                ->findAll()
        ];

        return view('sections/projects', $data);
    }
}
