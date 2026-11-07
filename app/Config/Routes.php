<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->get('/projects', 'Projects::index');

$routes->get('/skills', 'Skills::index');

$routes->get('/contact', 'Contact::index');

$routes->post('/contact/send', 'Contact::send');

$routes->get('/database-test', 'DatabaseTest::index');

// Admin Dashbboard (future feature)
$routes->group('admin', ['filter' => 'admin-auth'], static function ($routes) {

    $routes->get('dashboard', 'Admin\Dashboard::index');

    $routes->get('projects', 'Admin\Projects::index');

    $routes->get('skills', 'Admin\Skills::index');
});
