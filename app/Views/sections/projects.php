<section id="projects" class="projects-section">

    <div class="projects-container">

        <!-- Section Heading -->
        <div class="projects-heading">
            <h2>Projects</h2>
        </div>

        <!-- Project Gallery -->
        <div class="projects-gallery">
            <?php if (!empty($projects)): ?>

                <?php foreach ($projects as $project): ?>
                    <?php
                        $projectImage = trim((string) ($project['project_image'] ?? ''));
                        if ($projectImage === '') {
                            $projectImage = 'project-placeholder.svg';
                        }
                    ?>
                    <a 
                        href="<?= esc($project['github_link']  ?? '#') ?>" 
                        class="project-card"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <!-- Project Image -->
                        <div class="project-image-wrapper">
                            <img 
                                src="<?= base_url('assets/images/projects/' . ltrim($projectImage, '/')) ?>" 
                                alt="<?= esc($project['project_title']) ?>"
                                class="project-image"
                                loading="lazy"
                            >

                            <div class="project-overlay">
                                <span class="project-view">
                                    <i class="fa-brands fa-github"></i>
                                    View Projects
                                </span>
                            </div>

                        </div>

                        <!-- Project Title -->
                        <div class="project-info">
                            <h3>
                                <?= esc($project['project_title']) ?>
                            </h3>
                        </div>

                    </a>

                <?php endforeach; ?>

            <?php else: ?>

                <p class="projects-empty">
                    No projects available yet.
                </p>

            <?php endif; ?>

        </div>

    </div>
    
</section>