<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEmailQueueTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'recipient' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],
            'sender' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],
            'subject' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],
            'message' => [
                'type' => 'TEXT',
            ],
            'status' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'default' => 0,
            ],
            'attempts' => [
                'type' => 'INT',
                'default' => 0,
            ],
            'create_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'sent_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('email_queue');
    }

    public function down()
    {
        $this->forge->dropTable('email_queue');
    }
}
