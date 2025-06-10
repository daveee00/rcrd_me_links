document.addEventListener('DOMContentLoaded', () => {
    const aboutButton = document.getElementById('about-button');
    const closeAbout = document.getElementById('close-about');
    const aboutOverlay = document.getElementById('about-overlay');
    const body = document.body;
    const aboutHideElements = document.querySelectorAll('.about-hide');

    // Set initial state
    aboutOverlay.style.opacity = '0';
    aboutOverlay.style.display = 'none';
    aboutOverlay.style.visibility = 'hidden';
    aboutOverlay.style.transform = 'translate(-50%, -50%) scale(0.95)';
    aboutOverlay.style.transition = 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out, transform 0.3s ease-in-out';

    aboutButton.addEventListener('click', () => {
        aboutOverlay.style.visibility = 'visible';
        aboutOverlay.style.display = 'flex';
        body.classList.add('about-visible');
        // Hide all elements with about-hide class
        aboutHideElements.forEach(element => {
            element.style.visibility = 'hidden';
        });
        // Use requestAnimationFrame to ensure the display:flex is applied before the opacity transition
        requestAnimationFrame(() => {
            aboutOverlay.style.opacity = '1';
            aboutOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    closeAbout.addEventListener('click', () => {
        aboutOverlay.style.opacity = '0';
        aboutOverlay.style.transform = 'translate(-50%, -50%) scale(0.95)';
        body.classList.remove('about-visible');
        // Show all elements with about-hide class
        aboutHideElements.forEach(element => {
            element.style.visibility = 'visible';
        });
        // Wait for the fade out animation to complete before hiding
        setTimeout(() => {
            aboutOverlay.style.visibility = 'hidden';
            aboutOverlay.style.display = 'none';
        }, 300); // Match this with the transition duration
    });
}); 