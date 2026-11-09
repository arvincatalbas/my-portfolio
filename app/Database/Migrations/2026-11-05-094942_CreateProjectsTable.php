<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProjectsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true,
            ],

            'project_title' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],

            'project_description' => [
                'type' => 'TEXT',
            ],

            'project_image' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],

            'technologies' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],

            'github_link' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],

            'live_demo' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],

            'create_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],

            'update_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);

        $this->forge->createTable('projects');
    }

    public function down()
    {
        $this->forge->dropTable('projects');
    }
}
