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
                    'https://github.com/arvincatalbas/Vet_Information_System---Copy',
                'live_demo' => null,
                'create_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s'),
            ],

            [
                'project_title' => 'Music App',
                'project_description' => 'The Music App is a cross-platform mobile application develop using React Native with Expo and Typescript.',
                'project_image' => 'music.png',
                'technologies' => 'React Native, Expo, TypeScript, CSS',
                'github_link' =>
                    'https://github.com/arvincatalbas/music-app',
                'live_demo' => null,
                'create_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s'),
            ],

            [
                'project_title' => 'Notepad App',
                'project_description' => 'A simple Notepad application build using React Native with Expo and Typescript. It allows users to create, edit, and delete notes.',
                'project_image' => 'project-placeholder.svg',
                'technologies' => 'React Native, Expo, TypeScript, CSS',
                'github_link' =>
                    'https://github.com/arvincatalbas/notes-app',
                'live_demo' => null,
                'create_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s'),
            ],

            [
                'project_title' => 'Stopwatch App',
                'project_description' => 'A calm, dark-themed stopwatch app built with Expo, React Native, and TypeScript. It runs on Android, iOS, and the web.',
                'project_image' => 'project-placeholder.svg',
                'technologies' => 'React Native, Expo, TypeScript, CSS',
                'github_link' =>
                    'https://github.com/arvincatalbas/stopwatch-app',
                'live_demo' => null,
                'create_at' => date('Y-m-d H:i:s'),
                'update_at' => date('Y-m-d H:i:s'),
            ],
        ];

        $this->db->table('projects')->insertBatch($data);
    }
}