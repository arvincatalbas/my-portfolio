<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'skill_name' => 'PHP',
                'skill_icon' => 'php',
            ],

            [
                'skill_name' => 'JavaScript',
                'skill_icon' => 'javascript',
            ],

            [
                'skill_name' => 'TypeScript',
                'skill_icon' => 'typescript',
            ],

            [
                'skill_name' => 'CSS3',
                'skill_icon' => 'css3',
            ],

            [
                'skill_name' => 'HTML5',
                'skill_icon' => 'html5',
            ],

            [
                'skill_name' => 'CodeIgniter 4',
                'skill_icon' => 'codeigniter',
            ],

            [
                'skill_name' => 'Laravel',
                'skill_icon' => 'laravel',
            ],

            [
                'skill_name' => 'React',
                'skill_icon' => 'react',
            ],

            [
                'skill_name' => 'Vue',
                'skill_icon' => 'vue',
            ],

            [
                'skill_name' => 'MySQL',
                'skill_icon' => 'mysql',
            ],

            [
                'skill_name' => 'Git',
                'skill_icon' => 'git',
            ],

            [
                'skill_name' => 'Github',
                'skill_icon' => 'github',
            ],
        ];

        $now = date('Y-m-d H:i:s');

        foreach ($data as &$skill) {
            $skill['created_at'] = $now;
            $skill['updated_at'] = $now;
        }

        unset($skill);

        $this->db->table('skills')->insertBatch($data);
    }
}
