// ===========================
// NAVIGÁCIA - aktívna sekcia
// ===========================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sideLinks = document.querySelectorAll('.side-link');
const desktopNav = document.getElementById('desktopNav');

function updateActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
            });
            sideLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) link.classList.add('active');
            });
        }
    });
}

function updateNavStyle() {
    desktopNav.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', () => {
    updateActiveNav();
    updateNavStyle();
});

updateActiveNav();


// ===========================
// FORMULÁR - odoslanie
// ===========================

const form = document.getElementById('kontaktForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const meno = document.getElementById('meno').value.trim();
    const telefon = document.getElementById('telefon').value.trim();
    const typ = document.getElementById('typ').value;
    const sprava = document.getElementById('sprava').value.trim();

    if (!meno || !telefon || !typ || !sprava) {
        alert('Prosím vyplňte všetky povinné polia.');
        return;
    }

    // -----------------------------------------------
    // TU NESKÔR PRIDÁŠ FORMSPREE:
    // fetch('https://formspree.io/f/TVOJ_KOD', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ meno, telefon, typ, sprava })
    // });
    // -----------------------------------------------

    form.reset();
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
});


// ===========================
// LIGHTBOX
// ===========================

const galleryImgs = document.querySelectorAll('.galeria-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentIndex = 0;

const images = Array.from(galleryImgs).map(img => ({
    src: img.src,
    alt: img.alt
}));

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const item = images[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
}

galleryImgs.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});


// ===========================
// ANIMÁCIE PRI SCROLLOVANÍ
// ===========================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.sluzba-card, .galeria-item, .hodnota, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
