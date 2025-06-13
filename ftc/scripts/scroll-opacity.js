document.addEventListener('DOMContentLoaded', () => {
    const secondSection = document.querySelector('.second-section');
    const secondSectionImage = document.querySelector('#second-section-image');
    const secondSectionText = document.querySelector('#second-section-text');
    
    if (!secondSection || !secondSectionImage) return;

    let ticking = false;

    function updateOpacity() {
        const rect = secondSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Calculate opacity based on scroll position
        const opacity = Math.max(0, Math.min(1, 1 - (Math.abs(sectionTop) / viewportHeight)));
        
        // Update image opacity
        secondSectionImage.style.opacity = opacity;

        // Show text when image starts fading (opacity < 0.8)
        if (opacity < 0.8 && !secondSectionText.classList.contains('visible')) {
            secondSectionText.classList.add('visible');
        } else if (opacity >= 0.8 && secondSectionText.classList.contains('visible')) {
            secondSectionText.classList.remove('visible');
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateOpacity);
            ticking = true;
        }
    });

    // Initial call to set the correct opacity
    updateOpacity();
}); 