document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove both classes first to reset the animations
                entry.target.classList.remove('animate', 'exit');
                // Force a reflow
                void entry.target.offsetWidth;
                // Add the animate class to trigger the entrance animation
                entry.target.classList.add('animate');
            } else {
                // Remove animate class and add exit class
                entry.target.classList.remove('animate');
                entry.target.classList.add('exit');
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px'
    });

    // Observe the second text section
    const secondText = document.querySelector('.second-text');
    if (secondText) {
        observer.observe(secondText);
    }

    // Observe the grid section
    const gridSection = document.querySelector('.grid-section');
    if (gridSection) {
        observer.observe(gridSection);
    }
}); 