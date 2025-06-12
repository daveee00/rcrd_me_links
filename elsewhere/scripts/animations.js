document.addEventListener('DOMContentLoaded', () => {
  const scrollTextSection = document.querySelector('.scroll-text-section');
  const textElements = document.querySelectorAll('.scroll-text-section .text');
  
  // Clear the section and create a wrapper
  scrollTextSection.innerHTML = '';
  const scrollWrapper = document.createElement('div');
  scrollWrapper.className = 'scroll-wrapper';
  scrollTextSection.appendChild(scrollWrapper);

  // Add multiple copies of the text to ensure continuous flow
  for (let i = 0; i < 4; i++) {
    textElements.forEach(text => {
      const clone = text.cloneNode(true);
      scrollWrapper.appendChild(clone);
    });
  }

  // Set up the animation
  let position = 0;
  const speed = 1;

  function animate() {
    position -= speed;
    
    // Get the width of a single text element
    const textWidth = textElements[0].offsetWidth;
    
    // Reset position when we've scrolled the width of one text element
    if (position <= -textWidth) {
      position = 0;
    }
    
    // Apply the transform
    scrollWrapper.style.transform = `translateX(${position}px)`;
    
    // Continue the animation
    requestAnimationFrame(animate);
  }

  // Start the animation
  animate();
});

// Handle replay button click
document.getElementById('replay').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
