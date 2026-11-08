document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  const sections = document.querySelectorAll(
    "#home, #projects, #skills, #contact",
  );

  // Mobile menu
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("active");
      menuToggle?.classList.remove("active");

      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Highlight active section while scrolling
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${currentId}`,
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Reset menu when switching to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      navMenu?.classList.remove("active");
      menuToggle?.classList.remove("active");

      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});
