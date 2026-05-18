window.addEventListener('scroll', () => {
    const nav = document.querySelector('.mwp-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Pause marquee on hover
const marquee = document.querySelector('.mindset-marquee-track');

marquee.addEventListener('mouseenter', () => {
    marquee.style.animationPlayState = 'paused';
});

marquee.addEventListener('mouseleave', () => {
    marquee.style.animationPlayState = 'running';
});

// Testimonials Slider
const track = document.getElementById('testimonialsTrack');
const cards = document.querySelectorAll('.testimonial-card');

let currentSlide = 0;

function updateSlider() {
    if (!track || cards.length === 0) return;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
    
    const dotsContainer = document.querySelector('.slider-controls');
    
    if (isMobile) {
        // Mobile: 1 box at a time, 6 possible slides
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            const totalDots = 6;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === currentSlide ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => {
                    currentSlide = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    } else if (isTablet) {
        // Tablet: 2 boxes at a time, 3 pages
        const activePageIndex = Math.floor(currentSlide / 2);
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            const totalDots = 3;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === activePageIndex ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => {
                    currentSlide = i * 2;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        const cardWidth = cards[0].offsetWidth + 30; // Card width + gap
        track.style.transform = `translateX(-${activePageIndex * 2 * cardWidth}px)`;
    } else {
        // Desktop: 3 boxes at a time, 2 pages
        const activePageIndex = Math.floor(currentSlide / 3);
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            const totalDots = 2;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === activePageIndex ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', () => {
                    currentSlide = i * 3;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        const containerWidth = document.querySelector('.testimonials-slider-container').offsetWidth + 30;
        track.style.transform = `translateX(-${activePageIndex * containerWidth}px)`;
    }
}

// Initial setup & resize handling
window.addEventListener('resize', () => {
    currentSlide = 0;
    updateSlider();
});

// Auto slide
let autoSlideInterval = setInterval(() => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
    
    if (isMobile) {
        currentSlide = (currentSlide + 1) % 6;
    } else if (isTablet) {
        currentSlide = (currentSlide + 2) % 6;
        if (currentSlide >= 6) currentSlide = 0;
    } else {
        currentSlide = (currentSlide + 3) % 6;
    }
    updateSlider();
}, 3000);

const sliderContainer = document.querySelector('.testimonials-slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
}

// Initialize
updateSlider();

// Mobile Drawer Menu Functionality
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a, .mobile-menu-cta a');

function openMobileMenu() {
    mobileMenuOverlay.classList.add('active');
    mobileMenuPanel.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling behind the overlay
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    mobileMenuPanel.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', openMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when links inside the menu are clicked (to anchor to target section)
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Scroll Reveal Animation with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll(
        '.hero-container, .work-container, .surface-container, .alignment-container, .offer-container, .qualify-container, .clients-container, .about-coach-container, .testimonials-container, .apply-container, .footer-container'
    );
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // Default is viewport
        threshold: 0.08, // Trigger early at 8% visibility for smooth entry flow
        rootMargin: '0px 0px -40px 0px' // Offset slightly to trigger naturally as user scrolls
    });
    
    revealTargets.forEach(el => {
        el.classList.add('scroll-reveal');
        
        // If it's the hero container, reveal it immediately on load so the user sees it without lag
        if (el.classList.contains('hero-container')) {
            setTimeout(() => {
                el.classList.add('revealed');
            }, 50);
        } else {
            revealObserver.observe(el);
        }
    });
});