const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Reveal animation duration in milliseconds (adjustable)
const REVEAL_DURATION = 1100;

// Load saved theme
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
} else {
    root.setAttribute("data-theme", "light");
}

// Update theme icon
function updateThemeIcon() {
    if (!themeToggle) return;
    const currentTheme = root.getAttribute("data-theme");

    themeToggle.innerHTML =
        currentTheme === "dark"
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}

// Initial icon
updateThemeIcon();

// Theme toggle event with Circular Reveal View Transition
if (themeToggle) {
    themeToggle.addEventListener("click", async () => {
        const currentTheme = root.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        const applyTheme = () => {
            root.setAttribute("data-theme", newTheme);
            localStorage.setItem("portfolio-theme", newTheme);
            updateThemeIcon();
        };

        // Fallback for browsers that don't support View Transitions or if reduced motion is requested
        if (
            !document.startViewTransition ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            applyTheme();
            return;
        }

        // Calculate reveal position based on the center of the theme toggle button
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate maximum radius to ensure the circle covers the entire screen
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Also update CSS variables on root for reference
        root.style.setProperty("--reveal-x", `${x}px`);
        root.style.setProperty("--reveal-y", `${y}px`);
        root.style.setProperty("--reveal-radius", `${maxRadius}px`);

        // Execute the View Transition
        const transition = document.startViewTransition(() => {
            applyTheme();
        });

        try {
            // Wait for the pseudo-elements to be created and ready
            await transition.ready;

            // Animate circular reveal directly from the toggle button coordinates
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${maxRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: REVEAL_DURATION,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    pseudoElement: "::view-transition-new(root)"
                }
            );
        } catch (error) {
            // If transition was aborted or rejected, apply theme immediately
            applyTheme();
        }
    });
}
