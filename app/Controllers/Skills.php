<?php

namespace App\Controllers;

use App\Models\SkillModel;

class Skills extends BaseController
{
    public function index()
    {
        $skillModel = new SkillModel();

        $data = [
            'skills' => $skillModel->getUniqueSkills()
        ];

        return view('sections/skills', $data);
    }
}