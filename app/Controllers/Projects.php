<?php

namespace App\Controllers;

use App\Models\ProjectModel;

class Projects extends BaseController
{
    public function index()
    {
        $projectModel = new ProjectModel();

        $data = [
            'projects' => $projectModel->getUniqueProjects()
        ];

        return view('sections/projects', $data);
    }
}
