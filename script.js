// Typewriter effect
function typeWriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;

    const words = JSON.parse(element.dataset.text);
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = '';

    function type() {
        if (wordIndex === words.length) wordIndex = 0;
        
        const word = words[wordIndex];

        if (isDeleting) {
            currentWord = word.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentWord = word.substring(0, charIndex + 1);
            charIndex++;
        }

        element.textContent = currentWord;

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === word.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            wordIndex++;
            isDeleting = false;
            typeSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}


// Next section navigation
function setupNextSectionButton() {
    const nextButton = document.getElementById('next-section');
    const sections = document.querySelectorAll('section');

    if (!nextButton || sections.length === 0) return;

    nextButton.addEventListener('click', () => {
        let currentSectionIndex = -1;

        // Find the currently visible section
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                currentSectionIndex = index;
            }
        });

        // Scroll to the next section if it exists
        if (currentSectionIndex !== -1 && currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    });
}



// Function to update active TOC link based on scroll position
function highlightActiveSection() {
    const sections = document.querySelectorAll('.section'); // Ensure sections have this class
    const links = document.querySelectorAll('.toc-link');
    let activeLink = null;

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 150 && rect.bottom >= 150) { 
            // Section is in view, set active link
            activeLink = links[index];
        }
    });

    if (activeLink) {
        links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
        updateLineCursor(); // Move the cursor
    }
}

// Function to update the line cursor position
function updateLineCursor() {
    const lineCursor = document.getElementById('line-cursor');
    const activeLink = document.querySelector('.toc-link.active');
    
    if (lineCursor && activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const sidebarRect = document.querySelector('.docs-sidebar').getBoundingClientRect();

        lineCursor.style.transform = `translateY(${linkRect.top - sidebarRect.top}px)`;
        lineCursor.style.height = `${linkRect.height}px`;
    }
}

// Run function on scroll
window.addEventListener('scroll', highlightActiveSection);
window.addEventListener('resize', updateLineCursor); // Update on window resize


// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    setupNextSectionButton();
    
    // Update line cursor on scroll
    document.addEventListener('scroll', () => {
        updateLineCursor();
        updateActiveSection();
    });
});

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


// Update active section
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const tocLinks = document.querySelectorAll('.toc-link');
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const id = section.getAttribute('id');
        
        if (rect.top <= headerHeight + 100 && rect.bottom >= headerHeight) {
            tocLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmG1ldZE2aieir_s0c1OhsBWL4b6UJXds",
    authDomain: "vitalgaze-7084f.firebaseapp.com",
    projectId: "vitalgaze-7084f",
    storageBucket: "vitalgaze-7084f.firebasestorage.app",
    messagingSenderId: "282183145389",
    appId: "1:282183145389:web:7ef2c29138e0cd21c2b324"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const userProfile = document.getElementById("user-profile");
    const userNameDisplay = document.getElementById("user-name");
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            userProfile.style.display = "block"; // Show user info
            loginLink.style.display = "none"; // Hide login button

            // Display user's name or email
            userNameDisplay.textContent = user.displayName || user.email;

        } else {
            // User is logged out
            userProfile.style.display = "none"; // Hide user info
            loginLink.style.display = "block"; // Show login button
        }
    });

    // Logout function
    logoutBtn.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                alert("Signed out successfully!");
                window.location.href = "index.html"; // Redirect to login page
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    });
});


