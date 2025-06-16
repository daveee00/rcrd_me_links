document.addEventListener('DOMContentLoaded', () => {
  const comments = document.querySelectorAll('.comment');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });

  comments.forEach(comment => {
    observer.observe(comment);
  });
}); 