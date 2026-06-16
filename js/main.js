document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    const navLinks = document.querySelectorAll(".nav-link");
    const globalLoader = document.getElementById("global-loader");

    // CONFIGURATION: Minimum time in milliseconds the spinner MUST stay visible
    const MIN_LOAD_TIME = 800; 

    // Loader Show Helper
    function showLoader() {
        globalLoader.classList.remove("hidden");
        void globalLoader.offsetWidth; // Force reflow
        globalLoader.classList.add("visible");
    }

    // Loader Hide Helper
    function hideLoader() {
        globalLoader.classList.remove("visible");
        setTimeout(() => {
            if (!globalLoader.classList.contains("visible")) {
                globalLoader.classList.add("hidden");
            }
        }, 300); // Matches the 0.3s CSS fade-out transition
    }

    // Router function to load files dynamically
    function loadSection(sectionName) {
        showLoader();
        
        // Record the exact time the loading started
        const startTime = Date.now();

        fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                // Calculate how many milliseconds have passed since we clicked
                const elapsedTime = Date.now() - startTime;
                
                // If elapsed time is less than our minimum target, calculate the remaining delay
                const remainingDelay = Math.max(0, MIN_LOAD_TIME - elapsedTime);

                // Enforce the artificial delay before rendering content and removing loader
                setTimeout(() => {
                    contentArea.innerHTML = html;
                    updateActiveLink(sectionName);
                    bindInternalLinks();

                    if (sectionName === "home") {
                        initTypewriter();
                    }
                    hideLoader();
                }, remainingDelay);
            })
            .catch(error => {
                hideLoader();
                contentArea.innerHTML = `<section class="page-section"><h2>Error</h2><p>Could not load section.</p></section>`;
                console.error(error);
            });
    }

    function updateActiveLink(sectionName) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === sectionName) {
                link.classList.add("active");
            }
        });
    }

    function bindInternalLinks() {
        const structuralLinks = contentArea.querySelectorAll(".nav-link");
        structuralLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("href");
                loadSection(target);
            });
        });
    }

    // Main event listener for Navbar Links
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.getAttribute("target") === "_blank") return;
            e.preventDefault();
            const target = link.getAttribute("href");
            loadSection(target);
        });
    });

    // Default Section to Load on Launch
    loadSection("home");
});

/* ==========================================================================
   Typewriter Animation Logic
   ========================================================================== */
function initTypewriter() {
    const textToType = "Ian Byegon";
    const typingSpeed = 150;
    const erasingSpeed = 100;
    const delayBetweenCycles = 2500;
    const typewriterElement = document.getElementById("typewriter");
    
    if (!typewriterElement) return;

    let charIndex = 0;
    let isErasing = false;

    function typeEffect() {
        if (!document.getElementById("typewriter")) return; 
        
        const currentText = textToType.substring(0, charIndex);
        typewriterElement.textContent = currentText;

        if (!isErasing && charIndex < textToType.length) {
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else if (isErasing && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, erasingSpeed);
        } else if (!isErasing && charIndex === textToType.length) {
            setTimeout(() => {
                isErasing = true;
                typeEffect();
            }, delayBetweenCycles);
        } else if (isErasing && charIndex === 0) {
            isErasing = false;
            setTimeout(typeEffect, 500);
        }
    }
    setTimeout(typeEffect, 500);
}