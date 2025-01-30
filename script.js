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

// Add this to your existing script.js

// Line Cursor Logic
document.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const lineCursor = document.getElementById('line-cursor');
    lineCursor.style.transform = `translateY(${scrollPercentage}%)`;
});