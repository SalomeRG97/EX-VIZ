document.addEventListener("DOMContentLoaded", () => {
    // === Typewriter / Swap Loop Logic ===
    const phrases = [
        "Innovative technologies transforming the solar sector.",
        "Accessible digital solutions maximizing resources and safety.",
        "Solid commitment to innovation and continuous improvement.",
        "Digital excellence for a sustainable future."
    ];
    
    let currentPhraseIndex = 0;
    const textElement = document.querySelector('.typed-text');
    
    function fadeText() {
        if (!textElement) return;
        textElement.style.opacity = 0;
        
        setTimeout(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            textElement.textContent = phrases[currentPhraseIndex];
            textElement.style.opacity = 1;
        }, 1000); // Wait for fade out
    }
    
    if (textElement) {
        textElement.textContent = phrases[currentPhraseIndex];
        textElement.style.opacity = 1;
        setInterval(fadeText, 5000); // Change text every 5 seconds
    }
    
    // === Scroll Animations Logic ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });
});
