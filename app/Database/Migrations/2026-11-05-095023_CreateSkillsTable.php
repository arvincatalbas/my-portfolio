<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSkillsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true,
            ],

            'skill_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],

            'skill_category' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],

            'skill_icon' => [
                'type' => 'VARCHAR',
                'contraint' => 100,
                'null' => true,
            ],

            'skill_level' => [
                'type' => 'TINYINT',
                'unsigned' => true,
                'default' => 0,
            ],

            'create_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],

            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);

        $this->forge->createTable('skills');
    }

    public function down()
    {
        $this->forge->dropTable('skills');
    }
}
