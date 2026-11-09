<?php

namespace App\Models;

use CodeIgniter\Model;

class ProjectModel extends Model
{
    protected $table = 'projects';

    protected $primaryKey = 'id';

    protected $useAutoIncrement = true;

    protected $returnType = 'array';

    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'project_title',
        'project_description',
        'project_image',
        'technologies',
        'github_link',
        'live_demo',
        'create_at',
        'update_at',
    ];

    protected $useTimestamps = true;

    protected $dateFormat = 'datetime';

    protected $createdField = 'create_at';

    protected $updatedField = 'update_at';

    public function getUniqueProjects()
    {
        return $this->groupBy('project_title')
            ->orderBy('id', 'ASC')
            ->findAll();
    }
}