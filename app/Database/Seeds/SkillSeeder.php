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
                'skill_category' => 'Programming Language',
                'skill_icon' => 'php',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'JavaScript',
                'skill_category' => 'Programming Language',
                'skill_icon' => 'javascript',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'TypeScript',
                'skill_category' => 'Programming Language',
                'skill_icon' => 'typescript',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'CSS3',
                'skill_category' => 'Frontend',
                'skill_icon' => 'css3',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'HTML5',
                'skill_category' => 'Frontend',
                'skill_icon' => 'html5',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'CodeIgniter 4',
                'skill_category' => 'Framework',
                'skill_icon' => 'codeigniter',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'Laravel',
                'skill_category' => 'Framework',
                'skill_icon' => 'laravel',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'React',
                'skill_category' => 'Framework',
                'skill_icon' => 'react',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'Vue',
                'skill_category' => 'Framework',
                'skill_icon' => 'vue',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'MySQL',
                'skill_category' => 'Database',
                'skill_icon' => 'mysql',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'Git',
                'skill_category' => 'Development Tools',
                'skill_icon' => 'git',
                'skill_level' => 85,
            ],

            [
                'skill_name' => 'Github',
                'skill_category' => 'Development Tools',
                'skill_icon' => 'github',
                'skill_level' => 85,
            ],
        ];

        $now = date('Y-m-d H:i:s');

        foreach ($data as &$skill) {
            $skill['create_at'] = $now;
            $skill['update_at'] = $now;
        }

        unset($skill);

        $this->db->table('skills')->insertBatch($data);
    }
}