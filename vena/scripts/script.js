
      document.addEventListener('DOMContentLoaded', function() {
        const videoContainer = document.querySelector('.background-video-container');
        const dateContainer = document.querySelector('.date-container');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const shade = document.querySelector('.shade');
        const ambientVideo = document.querySelector('.ambient-video-section');
        const textLines = document.querySelectorAll('.text-line[data-scroll]');
        const quoteSection = document.querySelector('.quote-section');
        const main = document.querySelector('.main');
        const galleryItems = document.querySelectorAll('.gallery-item[data-scroll]');
        const audioVideoSection = document.querySelector('.audio-video-section');
        const audioVideo = document.querySelector('#audio-video');
        const comments = document.querySelectorAll('.comment[data-scroll]');
        let lastCommentVisible = false;
        
        // Precarica il video
        audioVideo.load();
        
        window.addEventListener('scroll', () => {
          const dateRect = dateContainer.getBoundingClientRect();
          const scrollThreshold = dateRect.bottom;
          const fadeBackgroundThreshold = scrollThreshold + 200;
          const mainRect = main.getBoundingClientRect();
          const quoteSectionRect = quoteSection.getBoundingClientRect();
          
          // Gestione video iniziale e shade
          if (window.scrollY > scrollThreshold) {
            videoContainer.classList.add('fade-out');
            scrollIndicator.style.opacity = '0';
            
            if (window.scrollY > fadeBackgroundThreshold) {
              shade.classList.add('fade-bg');
            } else {
              shade.classList.remove('fade-bg');
            }
          } else {
            videoContainer.classList.remove('fade-out');
            scrollIndicator.style.opacity = '1';
            shade.classList.remove('fade-bg');
          }

          // Gestione video ambient e testo
          const quoteSectionTop = quoteSectionRect.top;
          const quoteSectionBottom = quoteSectionRect.bottom;
          
          // Fade in/out del video ambient
          if (quoteSectionTop < window.innerHeight && quoteSectionBottom > window.innerHeight * 0.3 && window.scrollY > window.innerHeight * 0.75) {
            ambientVideo.classList.add('visible');
          } else {
            ambientVideo.classList.remove('visible');
          }

          // Animazione delle righe di testo
          textLines.forEach((line) => {
            const rect = line.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.8 && window.scrollY > window.innerHeight * 0.75;
            
            if (inView) {
              line.classList.add('visible');
            } else {
              line.classList.remove('visible');
            }
          });

          // Animazione delle immagini della galleria
          galleryItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.85;
            
            if (inView) {
              item.classList.add('visible');
            }
          });

          // Gestione video con audio e commenti
          const lastGalleryItem = galleryItems[galleryItems.length - 1];
          const lastItemRect = lastGalleryItem.getBoundingClientRect();
          const shouldShowAudioVideo = lastItemRect.bottom < window.innerHeight * 0.1;
          const audioVideoRect = audioVideoSection.getBoundingClientRect();
          const audioVideoVisible = audioVideoRect.top < window.innerHeight && audioVideoRect.bottom > window.innerHeight * 0.3;
          const lastComment = comments[comments.length - 1];
          const lastCommentRect = lastComment.getBoundingClientRect();
          const isAfterLastComment = lastCommentRect.bottom < 0;

          if (shouldShowAudioVideo && audioVideoVisible && !isAfterLastComment) {
            audioVideoSection.classList.add('visible');
            audioVideoSection.classList.remove('fade-out');
            if (audioVideo.paused) {
              audioVideo.play();
              audioVideo.muted = false;
            }

            // Animazione dei commenti basata su scroll
            comments.forEach((comment) => {
              const rect = comment.getBoundingClientRect();
              const inView = rect.top < window.innerHeight * 0.8;
              
              if (inView) {
                comment.classList.add('visible');
                if (comment === comments[comments.length - 1]) {
                  lastCommentVisible = true;
                }
              } else {
                comment.classList.remove('visible');
                if (comment === comments[comments.length - 1]) {
                  lastCommentVisible = false;
                }
              }
            });
          } else {
            if (isAfterLastComment) {
              audioVideoSection.classList.add('fade-out');
              setTimeout(() => {
                audioVideoSection.classList.remove('visible');
                audioVideo.muted = true;
              }, 1000);
            } else {
              audioVideoSection.classList.remove('visible');
              audioVideoSection.classList.remove('fade-out');
              audioVideo.muted = true;
            }
            comments.forEach(comment => comment.classList.remove('visible'));
            lastCommentVisible = false;
          }
        });
      });

      // Modal functionality
      const modal = document.getElementById('videoModal');
      const modalVideo = document.getElementById('modalVideo');
      const closeBtn = document.querySelector('.close-modal');

      function openModal(videoSrc) {
        modal.style.display = 'flex';
        modalVideo.src = videoSrc;
        modalVideo.play();
      }

      closeBtn.onclick = function() {
        modal.style.display = 'none';
        modalVideo.pause();
        modalVideo.src = '';
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
          modalVideo.pause();
          modalVideo.src = '';
        }
      }
