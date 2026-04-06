document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations (Intersection Observer)
    const fadeOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    // Elements to animate
    const animElements = document.querySelectorAll('.hero-content-wrapper, .zigzag-content, .zigzag-media, .zigzag-header, .benefits-header, .benefit-card');
    
    animElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        
        // Add staggered delay to benefit cards
        if(el.classList.contains('benefit-card')) {
            el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
        
        fadeObserver.observe(el);
    });

    // Handle any specific video logic if needed (e.g. pausing offscreen videos to save performance)
    const videos = document.querySelectorAll('.zigzag-media video');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Autoplay prevented', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
});
