<section id="skills" class="skills-section">
    <div class="skills-container">

        <!-- Section Heading -->
        <div class="skills-header">
            <h2 class="skills-title">Skills</h2>
        </div>

        <!-- Skills Gallery -->
        <div class="skills-grid">
            <?php if(!empty($skills)): ?>
                <?php foreach ($skills as $skill): ?>

                    <?php
                    $iconClasses = [
                        'php' => 'devicon-php-plain',
                        'javascript' => 'devicon-javascript-plain',
                        'typescript' => 'devicon-typescript-plain',
                        'css3' => 'devicon-css3-plain',
                        'html5' => 'devicon-html5-plain',
                        'codeigniter' => 'devicon-codeigniter-plain',
                        'laravel' => 'devicon-laravel-plain',
                        'react' => 'devicon-react-original',
                        'vue' => 'devicon-vuejs-plain',
                        'mysql' => 'devicon-mysql-plain',
                        'git' => 'devicon-git-plain',
                        'github' => 'devicon-github-original',
                    ];

                    $iconClass = $iconClasses[strtolower($skill['skill_icon'])] ?? 'fa-solid fa-code';
                    ?>

                    <div class="skill-card">

                        <div class="skill-icon">
                            <i class="<?= esc($iconClass) ?>"></i>
                        </div>

                        <h3 class="skill-name">
                            <?= esc($skill['skill_name']) ?>
                        </h3>

                    </div>

                <?php endforeach; ?>

            <?php else: ?>

                <p class="skills-empty">
                    No skills available yet.
                </p>

            <?php endif; ?>

        </div>

    </div>
</section>