// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Animations (Intersection Observer)
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

// Apply fade-in animation slightly delayed on multiple elements
document.addEventListener("DOMContentLoaded", () => {
    const animElements = document.querySelectorAll('.hero-content, .hero-image, .stat-card, .service-card, .who-header, .services-header, .cta');
    
    animElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
});

// Gallery Modal & Carousel Logic
document.addEventListener("DOMContentLoaded", () => {
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryModal = document.getElementById('closeGalleryModal');
    const modalOverlay = document.getElementById('modalOverlay');

    if (openGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        const closeModal = () => {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeGalleryModal) closeGalleryModal.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        // Carousel Logic
        const track = document.getElementById('carouselTrack');
        const nextButton = document.getElementById('carouselNext');
        const prevButton = document.getElementById('carouselPrev');

        if (track && nextButton && prevButton) {
            const slides = Array.from(track.children);
            let currentSlideIndex = 0;

            const updateSlidePosition = () => {
                track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            };

            nextButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateSlidePosition();
            });

            prevButton.addEventListener('click', () => {
                currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                updateSlidePosition();
            });
        }
    }
});
