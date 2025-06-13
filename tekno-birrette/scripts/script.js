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

const typewriterText = `Teknobirrette è stato un festival speciale, un’esperienza che mi ha permesso di dare vita a tantissime belle amicizie. Esibirmi al Parco della Musica di Padova, davanti a circa quattromila persone, è un ricordo indelebile che porterò sempre con me.`;
const loopCount = 18; // Number of letters to loop

function startTypewriter() {
  const textContainer = document.querySelector('.typewriter-text');
  const cursor = document.querySelector('.typewriter-cursor');
  if (!textContainer.dataset.typed) {
    textContainer.dataset.typed = 'true';
    let i = 0;
    
    function type() {
      textContainer.innerHTML = typewriterText.slice(0, i).replace(/\n/g, '<br>');
      if (i < typewriterText.length) {
        i++;
        setTimeout(type, 35);
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

// Replace typewriter for text-box with fade-in and slide-up animation
const textBoxText = `Teknobirrette non è stato solo un festival: è stato un momento di condivisione pura, di sorrisi, bassi profondi e occhi che brillavano sotto le luci del palco. Ogni set, ogni incontro, ogni abbraccio ha contribuito a creare un’energia irripetibile. Padova quella notte ha ballato con il cuore.`;

function animateTextBox() {
  const textContainer = document.querySelector('.typewriter-text-box');
  const cursor = document.querySelector('.typewriter-cursor-box');
  
  if (!textContainer || !cursor) return;
  
  // Set the text content
  textContainer.textContent = textBoxText;
  cursor.style.display = 'none';
  
  // Remove animation class and force reflow
  textContainer.classList.remove('animate');
  void textContainer.offsetWidth;
  
  // Add animation class
  textContainer.classList.add('animate');
}

// Observe .text-box for viewport entry
const textBox = document.querySelector('.text-box');
if (textBox) {
  const textBoxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay to ensure the animation triggers
        setTimeout(animateTextBox, 100);
      } else {
        // Remove animation class when out of view
        const textContainer = document.querySelector('.typewriter-text-box');
        if (textContainer) {
          textContainer.classList.remove('animate');
        }
      }
    });
  }, { 
    threshold: 0.2,
    rootMargin: '100px'
  });
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

