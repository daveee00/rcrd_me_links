const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Start typewriter effect
      startTypewriter();
    }
  });
}, {
  threshold: 0.1
});

const typewriterText = `Esibirmi a Radio Pirate è stato uno degli highlight dell'estate '24.\nUn'esperienza indimenticabile sulla Senna.`;
const loopCount = 18; // Number of letters to loop

function startTypewriter() {
  const textContainer = document.querySelector('.typewriter-text');
  const cursor = document.querySelector('.typewriter-cursor');
  if (!textContainer.dataset.typed) {
    textContainer.dataset.typed = 'true';
    let i = 0;
    let deleting = false;
    let loopIndex = 0;
    function type() {
      if (!deleting) {
        textContainer.innerHTML = typewriterText.slice(0, i).replace(/\n/g, '<br>');
        if (i < typewriterText.length) {
          i++;
          setTimeout(type, 35);
        } else {
          // Start deleting after a pause
          setTimeout(() => {
            deleting = true;
            loopIndex = 0;
            type();
          }, 1200);
        }
      } else {
        // Deleting last N letters
        if (loopIndex < loopCount) {
          textContainer.innerHTML = typewriterText.slice(0, typewriterText.length - loopIndex - 1).replace(/\n/g, '<br>');
          loopIndex++;
          setTimeout(type, 60);
        } else {
          // Retype last N letters
          let retypeIndex = typewriterText.length - loopCount;
          function retype() {
            textContainer.innerHTML = typewriterText.slice(0, retypeIndex).replace(/\n/g, '<br>');
            if (retypeIndex < typewriterText.length) {
              retypeIndex++;
              setTimeout(retype, 35);
            } else {
              // Loop again
              setTimeout(() => {
                deleting = false;
                i = typewriterText.length;
                loopIndex = 0;
                type();
              }, 1200);
            }
          }
          setTimeout(retype, 300);
        }
      }
    }
    type();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const caption = document.querySelector('.video-caption');
  observer.observe(caption);
});

// Animate image1 and image2 on scroll
const image1 = document.querySelector('.image-box img[alt="Immagine 1"]');
const image2 = document.querySelector('.image-box img[alt="Immagine 2"]');

if (image1 && image2) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === image1) {
        if (entry.isIntersecting) {
          image1.classList.remove('slide-out-left');
          image1.classList.add('slide-in-left');
        } else {
          image1.classList.remove('slide-in-left');
          image1.classList.add('slide-out-left');
        }
      } else if (entry.target === image2) {
        if (entry.isIntersecting) {
          image2.classList.remove('slide-out-right');
          image2.classList.add('slide-in-right');
        } else {
          image2.classList.remove('slide-in-right');
          image2.classList.add('slide-out-right');
        }
      }
    });
  }, { threshold: 0.1 });
  imgObserver.observe(image1);
  imgObserver.observe(image2);
}

// Fade in/out effect for wide-image
const wideImage = document.querySelector('.fullwidth-photo img');
if (wideImage) {
  const wideImgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        wideImage.classList.add('fade-in');
        wideImage.classList.remove('fade-out');
      } else {
        wideImage.classList.remove('fade-in');
        wideImage.classList.add('fade-out');
      }
    });
  }, { threshold: 0.1 });
  wideImgObserver.observe(wideImage);
}

// Typewriter for text-box
const textBoxText = `Dopo una settimana di vacanza meravigliosa ad Evian e con una pace estrema in corpo, ho preso un treno da Ginevra e ho fatto un viaggio stupendo che mi ha portato direttamente al centro di Parigi. Suonare una domenica di fine agosto a sfioro sulla Senna, davanti a un bellissimo dancefloor, dopo una settimana di stop è stato per me un momento di relax fotonico.`;

function startTypewriterBox() {
  const textContainer = document.querySelector('.typewriter-text-box');
  const cursor = document.querySelector('.typewriter-cursor-box');
  
  if (!textContainer || !cursor) return;
  
  if (!textContainer.dataset.typed) {
    textContainer.dataset.typed = 'true';
    textContainer.style.minHeight = '1.4em';
    let i = 0;
    
    function type() {
      if (i <= textBoxText.length) {
        // Create a temporary div to measure text height
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = window.getComputedStyle(textContainer).cssText;
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.textContent = textBoxText.slice(0, i);
        document.body.appendChild(tempDiv);
        
        // Update text content
        textContainer.textContent = textBoxText.slice(0, i);
        
        // Auto-scroll if needed
        if (tempDiv.offsetHeight > textContainer.clientHeight) {
          textContainer.scrollTop = textContainer.scrollHeight;
        }
        
        // Clean up
        document.body.removeChild(tempDiv);
        
        i++;
        setTimeout(type, 30);
      }
    }
    
    type();
  }
}

// Observe .text-box for viewport entry
const textBox = document.querySelector('.text-box');
if (textBox) {
  const textBoxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypewriterBox();
      }
    });
  }, { threshold: 0.1 });
  textBoxObserver.observe(textBox);
}

// Animate radio-title and date on load and scroll
function animateTitleAndDate() {
  const title = document.querySelector('.radio-title');
  const date = document.querySelector('.date');
  if (title && date) {
    // Fade in on load
    setTimeout(() => {
      title.classList.add('visible');
      date.classList.add('visible');
    }, 100);
    // Fade out on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        title.classList.remove('visible');
        date.classList.remove('visible');
        title.classList.add('fade-out');
        date.classList.add('fade-out');
      } else {
        title.classList.add('visible');
        date.classList.add('visible');
        title.classList.remove('fade-out');
        date.classList.remove('fade-out');
      }
    });
  }
}
animateTitleAndDate();
