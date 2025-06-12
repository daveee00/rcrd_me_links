document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const linkTree = document.querySelector("#about-button");
  const sottoWriting = document.querySelector("#sotto-writing");
  const firstSection = document.querySelector("#first-section");
  
  if (!scrollIndicator) return;
  
  // Initially hide the link-tree
  if (linkTree) {
    linkTree.style.opacity = "0";
    linkTree.style.transition = "opacity 0.5s ease-in-out";
  }

  // Add transition for sotto-writing
  if (sottoWriting) {
    sottoWriting.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
  }

  // Fade out the indicator when user starts scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIndicator.classList.add("fade-out");
      // Fade in the link-tree when indicator fades out
      if (linkTree) {
        linkTree.style.opacity = ".6";
      }
    } else {
      scrollIndicator.classList.remove("fade-out");
      // Hide the link-tree when indicator is visible
      if (linkTree) {
        linkTree.style.opacity = "0";
      }
    }

    // Animate sotto-writing based on first-section position
    if (sottoWriting && firstSection) {
      const firstSectionRect = firstSection.getBoundingClientRect();
      const firstSectionBottom = firstSectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled past the first section
      const scrollPastFirstSection = Math.max(0, windowHeight - firstSectionBottom);
      const maxDistance = windowHeight; // Use window height as max distance
      
      if (scrollPastFirstSection > 0) {
        // Calculate opacity and scale based on scroll position
        const progress = Math.min(scrollPastFirstSection / maxDistance, 1);
        const opacity = 1 - progress;
        const scale = 1 - (progress * 0.5); // Scale down to 0.5
        
        sottoWriting.style.opacity = opacity;
        sottoWriting.style.transform = `scale(${scale})`;
      } else {
        // Reset when back at top
        sottoWriting.style.opacity = "1";
        sottoWriting.style.transform = "scale(1)";
      }
    }
  });
});
