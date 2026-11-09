<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        $this->db->table('projects')->emptyTable();

        $data = [
            [
                'project_title' => 'Animal Vaccination Management & Information System',

                'project_description' => 'A web-based system for managing animal vaccination records, QR codes, and inventory.',

                'project_image' => 'vet-logo.png',

                'technologies' => 'PHP, MySQL, Bootstrap, JavaScript, CSS3, HTML5',

                'github_link' => 
                    'https://github.com/arvincatalbas/Vet_Information_Systems---Copy',

                'live_demo' => '#',

                'create_at' => date('Y-m-d H:i:s'),

                'update_at' => date('Y-m-d H:i:s'),
            ],

            [
                'project_title' => 'Music App',

                'project_description' => 'The Music App is a cross-platform mobile application develop using React Native with Expo and Typescript.',

                'project_image' => 'music1.png',

                'technologies' => 'React Native, TypeScript, Expo',

                'github_link' =>
                'https://github.com/arvincatalbas/music_app',

                'live_demo' => '#',

                'create_at' => date('Y-m-d H:i:s'),

                'update_at' => date('Y-m-d H:i:s'),
            ],
        ];

        $this->db->table('projects')->insertBatch($data);
    }
}