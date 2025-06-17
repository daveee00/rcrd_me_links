// Scroll to top of page on refresh
window.addEventListener('load', function() {
    const pageTop = document.getElementById('page-top');
    if (pageTop) {
        pageTop.scrollIntoView({ behavior: 'instant' });
    }
}); 