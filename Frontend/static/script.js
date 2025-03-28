// Ensure this script runs as a module
export { };



document.addEventListener("DOMContentLoaded", () => {
    const words = ["Work Space", "Safe Place"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterText = document.getElementById("typewriter-text");

    function typeWriter() {
        if (!typewriterText) return;

        const currentWord = words[wordIndex];
        const currentText = currentWord.substring(0, charIndex);
        typewriterText.textContent = currentText;

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeWriter, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeWriter, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(typeWriter, 1000);
        }
    }

    // Ensure function is defined before calling it
    typeWriter();
});





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
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";


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
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function () {
    const userProfile = document.getElementById("user-profile");
    const userNameDisplay = document.getElementById("user-name");
    const loginLink = document.querySelector(".nav-links a[href='login.html']");
    const logoutBtn = document.getElementById("logout-btn");

    if (!userProfile || !userNameDisplay || !loginLink) return;

    // Show "Loading..." immediately
    userProfile.style.display = "flex";
    userNameDisplay.textContent = "Loading...";

    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
            try {
                // Fetch username from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    userNameDisplay.textContent = userDoc.data().name || user.email; // Display username
                    console.log("Fetched username:", userDoc.data().name);
                } else {
                    userNameDisplay.textContent = user.email; // Fallback to email
                    console.warn("No user document found in Firestore.");
                }
                userProfile.style.display = "flex";
                loginLink.style.display = "none";
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            console.log("No user logged in.");
            userProfile.style.display = "none";
            loginLink.style.display = "block";
        }
    });

    // Logout function
    if (logoutBtn) {
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
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture-btn");
    const resultDiv = document.getElementById("result"); // Ensure you have this in HTML
    const canvas = document.createElement("canvas"); // Create canvas dynamically
    const ctx = canvas.getContext("2d");

    let stream = null; // Store webcam stream globally
    let intervalId = null; // Store interval for stopping later

    // Start Webcam
    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();

            // Start capturing frames every 2 seconds
            intervalId = setInterval(captureFrame, 10);
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    // Capture Frame and Send to Backend
    async function captureFrame() {
        if (!video.videoWidth || !video.videoHeight) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to Base64 image
        const frameData = canvas.toDataURL("image/jpeg");

        try {
            const response = await fetch("http://127.0.0.1:5000/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ frameData }) // Send frame to backend
            });

            const data = await response.json();
            if (data.status === "success") {
                resultDiv.innerText = `Analysis Result: ${data.result}`;
            } else {
                console.error("Error from server:", data.message);
            }
        } catch (error) {
            console.error("Error sending frame:", error);
        }
    }

    // Stop Webcam
    function stopWebcam() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop tracks
            video.srcObject = null; // Remove video source
            clearInterval(intervalId); // Stop sending frames
            console.log("Webcam stopped.");
        }
    }

    // Start webcam when page loads (only on /project)
    window.onload = () => {
        if (window.location.pathname.endsWith("/project")) {
            startWebcam();
        }
    };

    // Stop webcam when clicking capture button
captureBtn.addEventListener("click", () => {
    stopWebcam(); // Stop webcam

    // Redirect to output.html
    window.location.pathname = "/output";
});
});
