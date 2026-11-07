<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateContactsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto-increment' => true,
            ],

            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],

            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],

            'subject' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],

            'message' => [
                'type' => 'TEXT',
            ],

            'create_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);

        $this->forge->createTable('contacts');
    }

    public function down()
    {
        $this->forge->dropTable('contacts');
    }
}
