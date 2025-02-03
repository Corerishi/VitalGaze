function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!event.target.closest('.nav-links') && 
        !event.target.closest('.menu-toggle') && 
        navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});


document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const tocLinks = document.querySelectorAll('.toc-link');
    const lineCursor = document.getElementById('line-cursor');
    const headerHeight = document.querySelector('.header').offsetHeight;

    let currentSection = null;

    // Find the current section in view
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerHeight;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section;
        }
    });

    // Highlight the current TOC link
    tocLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${currentSection?.id}`) {
            link.classList.add('active');
            // Move the line cursor to the active TOC link
            const linkRect = link.getBoundingClientRect();
            lineCursor.style.top = `${link.offsetTop + linkRect.height / 2}px`;
        } else {
            link.classList.remove('active');
        }
    });
});