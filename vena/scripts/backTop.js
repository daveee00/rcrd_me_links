document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('footer-back-to-top');
    const footer = document.querySelector('footer');
    if (backToTopBtn && footer) {
      // Show button only when footer is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        });
      }, { threshold: 0.1 });
      observer.observe(footer);
  
      // Scroll to top on click
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });

