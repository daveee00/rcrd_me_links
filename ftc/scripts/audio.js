// Inject audio control styles
const audioControlStyles = `
.audio-control {
  position: fixed;
  top: 8%;
  right: 32px;
  z-index: 2100;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: row;
  pointer-events: auto;
}
.audio-control .audio-text {
  color: #fff;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  margin-left: 0;
  margin-right: 8px;
  white-space: nowrap;
  letter-spacing: 0.02em;
  opacity: 1;
  border-radius: 6px;
  padding: 6px 14px;
  transition: opacity 0.3s, visibility 0.3s;
  position: relative;
  z-index: 1;
  display: none;
}

.audio-control.show-text .audio-text {
  display: inline-block;
  opacity: 1;
  visibility: visible;
  animation: audiotext-slidein 0.7s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes audiotext-slidein {
  0% { transform: translateX(60px); opacity: 0; }
  60% { transform: translateX(-8px); opacity: 1; }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); opacity: 1; }
}
.audio-control button {
  background: none;
  border: none;
  border-radius: 0;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.2s, opacity 0.2s;
  box-shadow: none;
  padding: 0;
}
.audio-control button:hover .audio-icon {
  filter: brightness(1.2) drop-shadow(0 2px 8px rgba(0,0,0,0.15));
  opacity: 0.8;
}
.audio-control .audio-icon {
  width: 20px;
  height: 20px;
  opacity: calc(79%);
  transition: 300ms;
  pointer-events: auto;
  background: none !important;
  padding: 0 !important;
  display: block;
}
.audio-control.icon-rotate-in .audio-icon {
  animation: svg-rotate-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
}
.audio-control.icon-spin .audio-icon {
  animation: svg-spin 0.7s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes svg-rotate-in {
  0% { transform: rotate(-180deg) scale(0.7); opacity: 0; }
  60% { transform: rotate(20deg) scale(1.1); opacity: 1; }
  80% { transform: rotate(-8deg) scale(0.96); }
  100% { transform: rotate(0deg) scale(1); opacity: 1; }
}
@keyframes svg-spin {
  0% { transform: rotate(0deg); }
  80% { transform: rotate(380deg); }
  100% { transform: rotate(360deg); }
}
`;

if (!document.getElementById('audio-control-style')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'audio-control-style';
  styleTag.innerHTML = audioControlStyles;
  document.head.appendChild(styleTag);
}

// Audio control logic
window.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('background-music');
  const audioToggle = document.getElementById('audio-toggle');
  const audioControl = document.querySelector('.audio-control');
  const audioText = document.querySelector('.audio-text');
  const transitionContainer = document.getElementById('transition-container');
  let textTimeout = null;
  let hasScrolled = false;

  // Try to play audio on every page load
  if (audio) {
    audio.play().catch(() => {});
  }

  window.addEventListener('scroll', function () {
    if (!hasScrolled) {
      audio.play();
      hasScrolled = true;
    }
  });

  audioToggle.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  function showAudioTextPopup() {
    audioControl.classList.add('show-text', 'full-opacity', 'icon-rotate-in');
    audioControl.classList.remove('icon-spin');
    if (textTimeout) clearTimeout(textTimeout);
    textTimeout = setTimeout(() => {
      audioControl.classList.remove('show-text', 'full-opacity', 'icon-rotate-in');
      audioControl.classList.add('icon-spin');
      setTimeout(() => {
        audioControl.classList.remove('icon-spin');
      }, 700);
    }, 3000);
  }

  const observer = new window.IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        showAudioTextPopup();
      } else {
        audioControl.classList.remove('show-text', 'full-opacity', 'icon-rotate-in', 'icon-spin');
      }
    },
    { threshold: 0.01 }
  );
  if (transitionContainer) {
    observer.observe(transitionContainer);
  }
});