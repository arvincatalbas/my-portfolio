<?php

namespace App\Controllers;

use App\Models\SkillModel;

class Skills extends BaseController
{
    public function index()
    {
        $skillModel = new SkillModel();

        $data = [
            'skills' => $skillModel
                ->orderBy('skill_category', 'ASC')
                ->findAll()
        ];

        return view('sections/skills', $data);
    }
}