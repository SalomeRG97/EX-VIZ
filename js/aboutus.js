document.addEventListener("DOMContentLoaded", () => {
    // === Typewriter / Swap Loop Logic ===
    const currentPath = window.location.pathname;
    const isSpanish = currentPath.includes('/es/');

    const phrasesEn = [
        "Innovative solutions transforming the real estate experience.",
        "Smart digital tools enhancing property investment and security.",
        "Strong commitment to growth, trust, and long-term value.",
        "Digital excellence for a sustainable future."
    ];

    const phrasesEs = [
        "Soluciones innovadoras que transforman la experiencia inmobiliaria.",
        "Herramientas digitales inteligentes que mejoran la inversión y la seguridad de la propiedad.",
        "Compromiso sólido con el crecimiento, la confianza y el valor a largo plazo.",
        "Excelencia digital para un futuro sostenible."
    ];

    const phrases = isSpanish ? phrasesEs : phrasesEn;

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

    // Auto-assign sequential stagger delays to value cards by DOM order
    document.querySelectorAll('.values-grid .value-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 100}ms`;
    });

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });

    // === References Carousel – Drag to scroll ===
    const wrapper = document.querySelector('.references-track-wrapper');
    const track = document.querySelector('.references-track');

    if (wrapper && track) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        const pauseAnim = () => { track.style.animationPlayState = 'paused'; };
        const resumeAnim = () => { track.style.animationPlayState = 'running'; };

        // ── Mouse events ──────────────────────────────────────────
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            pauseAnim();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.2;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.cursor = 'grab';
            resumeAnim();
        });

        // ── Touch events ──────────────────────────────────────────
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            pauseAnim();
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.2;
            wrapper.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        wrapper.addEventListener('touchend', resumeAnim);

        // Prevent browser default image drag
        track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });

        wrapper.style.cursor = 'grab';
    }
});

