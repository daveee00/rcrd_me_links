document.addEventListener('DOMContentLoaded', () => {
  const scrollTextSection = document.getElementById('scroll-text-section');
  if (!scrollTextSection) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const scrollTextElements = scrollTextSection.querySelectorAll('.text');
    
    scrollTextElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrollPosition * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}); 