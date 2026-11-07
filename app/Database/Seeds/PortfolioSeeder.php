<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run()
    {
        // Insert sample projects
        $this->call('ProjectSeeder');

        // Insert sample skills
        $this->call('SkillSeeder');
    }
}