document.addEventListener("DOMContentLoaded", () => {
    const contentArea = document.getElementById("content-area");
    const navLinks = document.querySelectorAll(".nav-link");

    function loadSection(sectionName) {
        fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                contentArea.innerHTML = html;
                updateActiveLink(sectionName);
                
               
                bindInternalLinks();

                if (sectionName === "home") {
                    initTypewriter();
                }
            })
            .catch(error => {
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

   
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");
        loadSection(target);
    });
});


    loadSection("home");
});

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