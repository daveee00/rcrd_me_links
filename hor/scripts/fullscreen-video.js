document.addEventListener('DOMContentLoaded', () => {
  const videoContainer = document.querySelector('.background-video-container');
  const video = document.querySelector('#intro-video');
  
  if (!videoContainer || !video) return;

  // Ensure video is muted and plays inline
  video.muted = true;
  video.playsInline = true;

  // Handle video loading
  video.addEventListener('loadeddata', () => {
    video.play().catch(error => {
      console.log('Video autoplay failed:', error);
    });
  });
}); 