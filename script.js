/* =========================================================
   НАЛАШТУВАННЯ ВІДГУКУ В GOOGLE MAPS
   Заповніть ОДИН з варіантів, і кнопка «Залишити відгук» відкриватиме одразу форму відгуку.
   Якщо обидва порожні, кнопка веде на картку закладу (як зараз).
   ========================================================= */
const REVIEW_LINK = '';      // варіант 1: посилання з Google Business Profile, напр. 'https://g.page/r/XXXX/review'
const REVIEW_PLACE_ID = '';  // варіант 2: Place ID, напр. 'ChIJxxxxxxxxxxxx'
 
const isEn = document.documentElement.lang === "en";
 
/* =========================================================
   ІНТРО / PRELOADER
   ========================================================= */
(function () {
    const MIN_SHOW = 1800; // мс: скільки мінімум триває інтро
    let hidden = false;
 
    try { sessionStorage.setItem('pb_intro', '1'); } catch (e) {}
 
    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        const p = document.getElementById('preloader');
        if (!p) return;
        p.classList.add('is-hiding');
        setTimeout(() => { p.style.display = 'none'; }, 1200);
    }
    function scheduleHide() {
        const skip = document.documentElement.classList.contains('skip-intro');
        const wait = skip ? 0 : Math.max(0, MIN_SHOW - performance.now());
        setTimeout(hidePreloader, wait);
    }
    if (document.readyState === 'complete') scheduleHide();
    else window.addEventListener('load', scheduleHide);
    setTimeout(hidePreloader, 4500); // страховка
})();
 
/* =========================================================
   ОСНОВНА ЛОГІКА САЙТУ
   ========================================================= */
document.addEventListener("DOMContentLoaded", function() {
 
    // --- Меню-гамбургер ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu ul li a');
 
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
 
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = hamburger && hamburger.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });
 
    // --- Налаштування (шестерня) ---
    const gearBtn = document.querySelector('.gear-btn');
    const settingsDropdown = document.querySelector('.settings-dropdown');
 
    if (gearBtn && settingsDropdown) {
        gearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('active');
        });
    }
 
    document.addEventListener('click', (e) => {
        if (settingsDropdown && gearBtn && !settingsDropdown.contains(e.target) && !gearBtn.contains(e.target)) {
            settingsDropdown.classList.remove('active');
        }
    });
 
    // --- Поява елементів при прокрутці ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .slide-left, .slide-right');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
 
    revealElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('active');
        } else {
            scrollObserver.observe(element);
        }
    });
 
    // --- Плаваюча кнопка запису ---
    const floatBtn = document.querySelector('.float-book-btn');
    window.addEventListener('scroll', () => {
        if (!floatBtn) return;
        floatBtn.classList.toggle('visible', window.scrollY > 400);
    });
 
    // --- Look-Book ---
    const lookbookImages = document.querySelectorAll('.lookbook-track img');
    lookbookImages.forEach((img, index) => {
        img.classList.add(index % 2 === 0 ? 'lb-odd' : 'lb-even');
    });
 
    const track = document.querySelector('.lookbook-track');
    const dots = document.querySelectorAll('.lookbook-dots .dot');
 
    if (track && dots.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = entry.target.getAttribute('data-index');
                    dots.forEach(d => d.classList.remove('active'));
                    if (dots[idx]) dots[idx].classList.add('active');
                }
            });
        }, { root: track, threshold: 0.6 });
 
        lookbookImages.forEach(img => imgObserver.observe(img));
    }
 
    initShop();
 
    // --- Кнопка «Залишити відгук»: пряме посилання на форму ---
    const reviewBtn = document.querySelector('.review-btn');
    if (reviewBtn) {
        if (REVIEW_LINK) {
            reviewBtn.href = REVIEW_LINK;
        } else if (REVIEW_PLACE_ID) {
            reviewBtn.href = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(REVIEW_PLACE_ID);
        }
    }
 
    // --- Клік по пошті: на комп'ютері відкриває чернетку в Gmail, на телефоні стандартну пошту ---
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function (e) {
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
            e.preventDefault();
            const to = link.getAttribute('href').replace('mailto:', '');
            const subject = encodeURIComponent(isEn ? 'Question for Phantom Barbers' : 'Питання до Phantom Barbers');
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + subject, '_blank', 'noopener');
        });
    });
 
    
 
    document.querySelectorAll('.price-list-col').forEach(col => {
        col.querySelectorAll('.price-row').forEach(row => {
            const nameEl = row.querySelector('.col-service');
            if (!nameEl) return;
            const key = nameEl.textContent.replace(/^\s*\d+\.\s*/, '').trim();
            const text = DESC[key];
            if (!text) return;
 
            const desc = document.createElement('div');
            desc.className = 'price-desc';
            desc.innerHTML = '<div><p></p></div>';
            desc.querySelector('p').textContent = text;
            row.after(desc);
 
            const chevron = document.createElement('i');
            chevron.className = 'fas fa-chevron-down price-chevron';
            nameEl.appendChild(chevron);
 
            row.classList.add('has-desc');
            row.setAttribute('role', 'button');
            row.setAttribute('tabindex', '0');
            row.setAttribute('aria-expanded', 'false');
 
            const toggle = () => {
                const willOpen = !row.classList.contains('open');
                col.querySelectorAll('.price-row.open').forEach(r => {
                    r.classList.remove('open');
                    r.setAttribute('aria-expanded', 'false');
                    r.nextElementSibling.classList.remove('open');
                });
                if (willOpen) {
                    row.classList.add('open');
                    row.setAttribute('aria-expanded', 'true');
                    desc.classList.add('open');
                }
            };
            row.addEventListener('click', toggle);
            row.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
            });
        });
    });
 
    // --- Закриття лайтбокса клавішею Esc ---
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') window.closeLightbox();
    });
});
 
/* =========================================================
   LOOK-BOOK
   ========================================================= */
window.moveLookbook = function(direction) {
    const track = document.querySelector('.lookbook-track');
    if (!track) return;
    const images = track.querySelectorAll('img');
    if (images.length === 0) return;
 
    const itemWidth = images[0].offsetWidth + parseInt(window.getComputedStyle(track).gap || 30);
 
    if (direction === 1) {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.style.scrollBehavior = 'auto';
            track.appendChild(track.firstElementChild);
            track.scrollLeft -= itemWidth;
 
            void track.offsetWidth;
 
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: itemWidth });
        } else {
            track.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    } else {
        if (track.scrollLeft <= 10) {
            track.style.scrollBehavior = 'auto';
            track.prepend(track.lastElementChild);
            track.scrollLeft += itemWidth;
 
            void track.offsetWidth;
 
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: -itemWidth });
        } else {
            track.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    }
};
 
window.jumpToLookbook = function(index) {
    const track = document.querySelector('.lookbook-track');
    if (!track) return;
    const images = track.querySelectorAll('img');
    images.forEach(img => {
        if (img.getAttribute('data-index') == index) {
            track.scrollTo({ left: img.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
    });
};
 
/* =========================================================
   ПЕРЕМИКАЧ ПРАЙСУ (мобільна версія)
   ========================================================= */
window.togglePrice = function(type) {
    const juniorCol = document.getElementById('col-junior');
    const seniorCol = document.getElementById('col-senior');
    const juniorBtn = document.getElementById('btn-junior');
    const seniorBtn = document.getElementById('btn-senior');
 
    if (type === 'junior') {
        if (juniorCol) juniorCol.classList.remove('hidden-mobile');
        if (seniorCol) seniorCol.classList.add('hidden-mobile');
        if (juniorBtn) juniorBtn.classList.add('active');
        if (seniorBtn) seniorBtn.classList.remove('active');
    } else {
        if (juniorCol) juniorCol.classList.add('hidden-mobile');
        if (seniorCol) seniorCol.classList.remove('hidden-mobile');
        if (juniorBtn) juniorBtn.classList.remove('active');
        if (seniorBtn) seniorBtn.classList.add('active');
    }
};
 
/* =========================================================
   КОСМЕТИКА
   ========================================================= */
const shopData = [
    { id: 1, name: "Матова паста Nishman М3", nameEn: "Matte Paste Nishman M3", price: 350, vol: "100ml", img: "images/c1.jpg" },
    { id: 2, name: "Матова глина Nishman М2", nameEn: "Matte Clay Nishman M2", price: 250, vol: "30ml", img: "images/c2.jpg" },
    { id: 3, name: "Матова глина Nishman М10", nameEn: "Matte Clay Nishman M10", price: 450, vol: "150ml", img: "images/c3.jpg" },
    { id: 4, name: "Шампунь Nishman Pro-Hair 02 Keratin Complex", nameEn: "Shampoo Nishman Pro-Hair 02 Keratin Complex", price: 400, vol: "400ml", img: "images/c4.jpg" },
    { id: 5, name: "Пудра для стилізації волосся Nishman", nameEn: "Styling Powder Nishman", price: 300, vol: "20g", img: "images/c5.jpg" },
    { id: 6, name: "Професійний шампунь Nishman INCA INCI", nameEn: "Pro Shampoo Nishman INCA INCI", price: 800, vol: "1250ml", img: "images/c6.jpg" },
    { id: 7, name: "Одеколон після гоління Nishman 10 AMBER", nameEn: "Aftershave Cologne Nishman 10 AMBER", price: 350, vol: "400ml", img: "images/c7.jpg" },
    { id: 8, name: "Помада для стилізації BROSH Pomade Matte", nameEn: "BROSH Pomade Matte", price: 750, vol: "120g", img: "images/c8.jpg" },
    { id: 9, name: "Помада для стилізації BROSH Pomade Mini Original", nameEn: "BROSH Pomade Mini Original", price: 400, vol: "40g", img: "images/c9.jpg" },
    { id: 10, name: "Помада BROSH Wacko Maria Collaboration", nameEn: "BROSH Wacko Maria Collab", price: 850, vol: "120g", img: "images/c10.jpg" },
    { id: 11, name: "Одеколон Barbertime Ocean №2", nameEn: "Barbertime Aftershave Ocean №2", price: 320, vol: "400ml", img: "images/c11.jpg" },
    { id: 12, name: "Одеколон Barbertime Thunderbolt №3", nameEn: "Barbertime Aftershave Thunderbolt №3", price: 320, vol: "400ml", img: "images/c12.jpg" },
    { id: 13, name: "Сольовий спрей Barbertime Sea Salt Spray", nameEn: "Barbertime Sea Salt Spray", price: 450, vol: "150ml", img: "images/c13.jpg" },
    { id: 14, name: "Пудра для укладання BROSH POWDER MAGIC", nameEn: "BROSH POWDER MAGIC", price: 650, vol: "20g", img: "images/c14.jpg" }
];
 
let currentPage = 1;
 
function initShop() {
    const grid = document.getElementById('cosmetics-grid');
    if (!grid) return;
    renderShop();
}
 
function renderShop() {
    const grid = document.getElementById('cosmetics-grid');
    const pagination = document.getElementById('cosmetics-pagination');
    if (!grid || !pagination) return;
 
    /* 6 товарів на телефоні, 10 на ПК */
    const itemsPerPage = window.innerWidth <= 992 ? 6 : 10;
 
    const totalPages = Math.ceil(shopData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = shopData.slice(startIdx, startIdx + itemsPerPage);
 
    grid.innerHTML = currentItems.map(p => {
        return `
            <a href="https://w.wlaunch.net/i/999b5880-0034-11f1-920a-491fb198e776/b/999d2d5e-0034-11f1-920a-491fb198e776/r" target="_blank" class="prod-card-compact">
                <div class="prod-img-wrapper">
                    <img src="${p.img}" alt="${isEn ? p.nameEn : p.name}" loading="lazy">
                </div>
                <h3>${isEn ? p.nameEn : p.name}</h3>
                <div class="prod-meta-row">
                    <span class="prod-vol-label">${p.vol}</span>
                    <span class="prod-price-compact">${p.price} ${isEn ? 'UAH' : '₴'}</span>
                </div>
            </a>
        `;
    }).join('');
 
    let pagHTML = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            pagHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
    }
    pagination.innerHTML = pagHTML;
}
 
window.changePage = function(page) {
    currentPage = page;
    renderShop();
    document.getElementById('cosmetics').scrollIntoView({ behavior: 'smooth' });
};
 
/* =========================================================
   ТЕМА
   ========================================================= */
window.toggleTheme = function(themeType) {
    const body = document.body;
    const lightBtns = document.querySelectorAll('.btn-light-theme');
    const darkBtns = document.querySelectorAll('.btn-dark-theme');
 
    if (themeType === 'dark') {
        body.classList.add('forced-dark-theme');
        darkBtns.forEach(btn => btn.classList.add('active'));
        lightBtns.forEach(btn => btn.classList.remove('active'));
    } else {
        body.classList.remove('forced-dark-theme');
        lightBtns.forEach(btn => btn.classList.add('active'));
        darkBtns.forEach(btn => btn.classList.remove('active'));
    }
};
 
/* =========================================================
   ЛАЙТБОКС
   ========================================================= */
window.openLightbox = function(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = "flex";
    lightboxImg.src = imgElement.src;
};
 
window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = "none";
};