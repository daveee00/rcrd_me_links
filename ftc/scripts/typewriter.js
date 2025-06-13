document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('second-section-text');
    if (!textElement) return;

    const fullText = textElement.textContent;
    const halfLength = Math.floor(fullText.length / 2);
    const firstHalf = fullText.substring(0, halfLength);
    const secondHalf = fullText.substring(halfLength);

    // Clear the text and immediately show first half
    textElement.textContent = firstHalf;

    let isTyping = false;
    let currentIndex = 0;

    function typeNextChar() {
        if (currentIndex < secondHalf.length) {
            textElement.textContent = firstHalf + secondHalf.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeNextChar, 30);
        }
    }

    // Create an observer to watch for the visible class
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isVisible = textElement.classList.contains('visible');
                if (isVisible && !isTyping) {
                    isTyping = true;
                    typeNextChar();
                } else if (!isVisible) {
                    isTyping = false;
                    currentIndex = 0;
                    textElement.textContent = firstHalf;
                }
            }
        });
    });

    // Start observing the text element for class changes
    observer.observe(textElement, { attributes: true });
}); 