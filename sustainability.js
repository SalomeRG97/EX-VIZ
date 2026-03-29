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
    const animElements = document.querySelectorAll('.hero-content-wrapper, .bees-section, .sdg-header, .sdg-main-img, .sdg-card');
    
    animElements.forEach((el, index) => {
        el.classList.add('fade-in-up');
        
        // Add staggered delay to sdg cards
        if(el.classList.contains('sdg-card')) {
            el.style.transitionDelay = `${(index % 2) * 0.15}s`; // staggered by column
        }
        
        fadeObserver.observe(el);
    });

    // Handle background video performance
    const videos = document.querySelectorAll('video');
    
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
