<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

    <!-- Home Section -->
    <?= $this->include('sections/home') ?>

    <!-- Projects Section -->
    <?= $this->include('sections/projects') ?>

    <!-- Skills Section -->
    <?= $this->include('sections/skills') ?>

    <!-- Contact Section -->
    <?= $this->include('sections/contact') ?>
<?= $this->endSection() ?>