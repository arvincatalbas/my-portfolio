<!DOCTYPE html>
<html lang="en">

<head>
      <meta charset="UTF-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <meta name="description" content="Personal Portfolio Website">

      <title>
            <?= esc($title ?? 'My Portfolio') ?>
      </title>

      <!-- Theme initialization (runs immediately to prevent flash of incorrect theme) -->
      <script>
            (() => {
                  const savedTheme = localStorage.getItem("portfolio-theme");
                  document.documentElement.setAttribute(
                        "data-theme",
                        savedTheme || "light"
                  );
            })();
      </script>

      <!-- Devicon Technology Icons -->
      <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">

      <!-- Skills CSS -->
      <link rel="stylesheet" href="<?= base_url('assets/css/skills.css') ?>">

      <!-- Google Fonts -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet">

      <!-- Bootstrap 5 -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet">

      <!-- Font Awesome Icons -->
      <link rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

      <!-- Main CSS -->
      <link rel="stylesheet"
            href="<?= base_url('assets/css/style.css') ?>">

      <!-- Theme CSS -->
      <link rel="stylesheet"
            href="<?= base_url('assets/css/theme.css') ?>">

      <!-- Navbar CSS -->
      <link rel="stylesheet"
            href="<?= base_url('assets/css/navbar.css') ?>">

      <!-- Section CSS -->
      <link rel="stylesheet"
            href="<?= base_url('assets/css/home.css') ?>">

      <link rel="stylesheet"
            href="<?= base_url('assets/css/projects.css') ?>">

      <link rel="stylesheet"
            href="<?= base_url('assets/css/skills.css') ?>">

      <link rel="stylesheet"
            href="<?= base_url('assets/css/contact.css') ?>">

      <!-- Footer CSS -->
      <link rel="stylesheet"
            href="<?= base_url('assets/css/footer.css') ?>">

      <!-- Favicon / Web Icon -->
      <link rel="shortcut icon" type="image/png" href="<?= base_url('favicon.ico') ?>">
</head>

<body>

      <!-- Navbar -->
      <?= $this->include('components/navbar') ?>

      <!-- Main Content -->
      <main>
            <?= $this->renderSection('content') ?>
      </main>

      <!-- Footer -->
      <?= $this->include('components/footer') ?>

      <!-- Bootstrap JS -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

      <!-- Main JS -->
      <script src="<?= base_url('assets/js/main.js') ?>" defer></script>

      <!-- Theme JS -->
      <script src="<?= base_url('assets/js/theme.js') ?>" defer></script>

      <!-- Navbar JS -->
      <script src="<?= base_url('assets/js/navbar.js') ?>" defer></script>

      <!-- Contact JS -->
      <script src="<?= base_url('assets/js/contact.js') ?>" defer></script>
</body>

</html>