<?php

namespace App\Controllers;

use App\Models\ProjectModel;
use App\Models\SkillModel;

class Home extends BaseController
{
    public function index()
    {
        $projectModel = new ProjectModel();
        $skillModel = new SkillModel();

        $data = [
            'title' => 'OrangeMask - Portfolio',
            'projects' => $projectModel->getUniqueProjects(),
            'skills' => $skillModel->getUniqueSkills(),
        ];

        return view('pages/portfolio', $data);
    }
}
