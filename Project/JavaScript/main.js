// Toggle mobile menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Add this to your script.js file

// Get all elements with the class 'animate-on-scroll'
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

// Create an options object for the Intersection Observer
const observerOptions = {
    root: null, // Use the viewport as the container
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the element is visible
};

// Create the observer instance
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Check if the element is intersecting (i.e., in the viewport)
        if (entry.isIntersecting) {
            // Add the 'is-visible' class to trigger the animation
            entry.target.classList.add('is-visible');
            
            // Stop observing the element so it only animates once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Loop through each element and tell the observer to watch it
elementsToAnimate.forEach(element => {
    observer.observe(element);
});