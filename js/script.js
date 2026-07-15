function runAfterDOMContentLoaded(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

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
runAfterDOMContentLoaded(() => {
    const animElements = document.querySelectorAll('.hero-content, .hero-image, .stat-card, .service-card, .who-header, .services-header, .cta');
    
    animElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
});

// Gallery Modal & Carousel Logic
runAfterDOMContentLoaded(() => {
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
runAfterDOMContentLoaded(() => {
    const langPref = localStorage.getItem('preferredLang');
    const currentPath = window.location.pathname;
    const isSpanishPage = window.location.pathname.split('/').includes('es');

    // Dynamic Resources Dropdown Injection
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle && (toggle.textContent.trim().toLowerCase() === 'resources' || toggle.textContent.trim().toLowerCase() === 'recursos')) {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.add('dropdown-menu-wide');
                if (isSpanishPage) {
                    menu.innerHTML = `
                        <div class="dropdown-columns">
                            <div class="dropdown-col-left">
                                <a href="/EX-VIZ/es/resources.html" class="submenu-parent">Artículos y Eventos</a>
                                <div class="submenu-children">
                                    <a href="/EX-VIZ/es/articles/" class="submenu-child">Artículos</a>
                                    <a href="/EX-VIZ/es/events/" class="submenu-child">Eventos</a>
                                </div>
                                <a href="/EX-VIZ/es/downloads.html" class="submenu-parent" style="margin-top: 10px; display: block;">Descargas</a>
                            </div>
                            <div class="dropdown-col-divider"></div>
                            <div class="dropdown-col-right">
                                <span class="preview-label">Último Recurso</span>
                                <a href="/EX-VIZ/es/articles/futuro-real-estate-gemelos-digitales.html" class="preview-card-mini">
                                    <img src="/EX-VIZ/media/articles/article1/1.png" alt="Último" class="preview-img-mini">
                                    <div class="preview-content-mini">
                                        <span class="preview-title-mini">El futuro del Real Estate: Cómo los gemelos digitales aceleran las ventas y rompen fronteras geográficas</span>
                                        <span class="preview-date-mini">9 de julio, 2026</span>
                                    </div>
                                </a>
                            </div>
                        </div>`;
                } else {
                    menu.innerHTML = `
                        <div class="dropdown-columns">
                            <div class="dropdown-col-left">
                                <a href="/EX-VIZ/resources.html" class="submenu-parent">Articles and Events</a>
                                <div class="submenu-children">
                                    <a href="/EX-VIZ/articles/" class="submenu-child">Articles</a>
                                    <a href="/EX-VIZ/events/" class="submenu-child">Events</a>
                                </div>
                                <a href="/EX-VIZ/downloads.html" class="submenu-parent" style="margin-top: 10px; display: block;">Downloads</a>
                            </div>
                            <div class="dropdown-col-divider"></div>
                            <div class="dropdown-col-right">
                                <span class="preview-label">Latest Resource</span>
                                <a href="/EX-VIZ/articles/future-real-estate-digital-twins.html" class="preview-card-mini">
                                    <img src="/EX-VIZ/media/articles/article1/1.png" alt="Latest" class="preview-img-mini">
                                    <div class="preview-content-mini">
                                        <span class="preview-title-mini">The Future of Real Estate: How Digital Twins Accelerate Sales and Break Geographical Borders</span>
                                        <span class="preview-date-mini">July 9, 2026</span>
                                    </div>
                                </a>
                            </div>
                        </div>`;
                }
            }
        }
    });

    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        const groups = mobileMenu.querySelectorAll('.mobile-dropdown-group');
        groups.forEach(group => {
            const header = group.querySelector('.mobile-dropdown-header');
            if (header && (header.textContent.trim().toLowerCase() === 'resources' || header.textContent.trim().toLowerCase() === 'recursos')) {
                if (isSpanishPage) {
                    group.innerHTML = `
                        <div class="mobile-dropdown-header">Recursos</div>
                        <a href="/EX-VIZ/es/resources.html" style="font-weight: 600;">Artículos y Eventos</a>
                        <a href="/EX-VIZ/es/articles/" style="padding-left: 20px; font-size: 0.9em;">Artículos</a>
                        <a href="/EX-VIZ/es/events/" style="padding-left: 20px; font-size: 0.9em; margin-bottom: 10px; display: block;">Eventos</a>
                        <a href="/EX-VIZ/es/downloads.html" style="font-weight: 600;">Descargas</a>
                    `;
                } else {
                    group.innerHTML = `
                        <div class="mobile-dropdown-header">Resources</div>
                        <a href="/EX-VIZ/resources.html" style="font-weight: 600;">Articles and Events</a>
                        <a href="/EX-VIZ/articles/" style="padding-left: 20px; font-size: 0.9em;">Articles</a>
                        <a href="/EX-VIZ/events/" style="padding-left: 20px; font-size: 0.9em; margin-bottom: 10px; display: block;">Events</a>
                        <a href="/EX-VIZ/downloads.html" style="font-weight: 600;">Downloads</a>
                    `;
                }
            }
        });
    }

    // Helper to get matching page in other language
    const getTargetLanguagePath = (targetLang) => {
        const base = '/EX-VIZ';
        // Strip the base prefix to get the local path
        let localPath = currentPath;
        if (localPath.startsWith(base)) {
            localPath = localPath.slice(base.length) || '/';
        }
        const localIsSpanish = localPath.startsWith('/es/') || localPath === '/es';

        if (targetLang === 'es') {
            if (localIsSpanish) return null;
            if (localPath === '/' || localPath.endsWith('index.html')) {
                return base + '/es/';
            }
            return base + '/es' + localPath;
        } else {
            if (!localIsSpanish) return null;
            let newPath = localPath.replace('/es/', '/');
            if (newPath === '' || newPath.endsWith('index.html')) {
                return base + '/';
            }
            return base + newPath;
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

// Usecase Carousels Auto-play
runAfterDOMContentLoaded(() => {
    const usecaseCarousels = document.querySelectorAll('.meraki-carousel');
    
    usecaseCarousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-images img');
        if (images.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 5000);
        }
    });
});

// Dynamic Copyright Year Update
runAfterDOMContentLoaded(() => {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.copyright').forEach(el => {
        // Preserves '&copy; EX-VIZ ' and appends the dynamic year
        el.innerHTML = `&copy; EX-VIZ ${currentYear}`;
    });
});


