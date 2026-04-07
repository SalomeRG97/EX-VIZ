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

// Language Switcher Logic
document.addEventListener('DOMContentLoaded', () => {
    const langPref = localStorage.getItem('preferredLang');
    const currentPath = window.location.pathname;
    const isSpanishPage = currentPath.includes('/es/');

    // Helper to get matching page in other language
    const getTargetLanguagePath = (targetLang) => {
        if (targetLang === 'es') {
            if (isSpanishPage) return null;
            // From EN to ES
            if (currentPath === '/' || currentPath.endsWith('index.html')) {
                return '/es/';
            }
            return '/es' + currentPath;
        } else {
            if (!isSpanishPage) return null;
            // From ES to EN
            let newPath = currentPath.replace('/es/', '/');
            if (newPath === '' || newPath.endsWith('index.html')) {
                return '/';
            }
            return newPath;
        }
    };

    // 1. Auto-detection (only if no preference is saved)
    if (!langPref) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('es') && !isSpanishPage) {
            const targetPath = getTargetLanguagePath('es');
            localStorage.setItem('preferredLang', 'es');
            if (targetPath) window.location.href = targetPath;
        }
    }

    // 2. UI Updates (Active state)
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if ((lang === 'es' && isSpanishPage) || (lang === 'en' && !isSpanishPage)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            localStorage.setItem('preferredLang', selectedLang);

            const newPath = getTargetLanguagePath(selectedLang);
            if (newPath && newPath !== currentPath) {
                window.location.href = newPath;
            }
        });
    });

    // Mobile globe icon toggle logic
    const mobileGlobe = document.getElementById('mobileLangToggle');
    if (mobileGlobe) {
        mobileGlobe.addEventListener('click', () => {
            const targetLang = isSpanishPage ? 'en' : 'es';
            const newPath = getTargetLanguagePath(targetLang);
            localStorage.setItem('preferredLang', targetLang);
            if (newPath) window.location.href = newPath;
        });
    }
});
