<?php

namespace App\Controllers;

class DatabaseTest extends BaseController
{
    public function index()
    {
        $db = \Config\Database::connect();

        if ($db->connect()) {
            return 'Database connected successfully!';
        }

        return 'Database connection failed.';
    }
}