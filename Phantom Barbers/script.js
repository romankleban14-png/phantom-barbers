window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu ul li a');

    if (hamburger) {
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
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    const gearBtn = document.querySelector('.gear-btn');
    const settingsDropdown = document.querySelector('.settings-dropdown');
    
    if (gearBtn) {
        gearBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            settingsDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (settingsDropdown && !settingsDropdown.contains(e.target) && !gearBtn.contains(e.target)) {
            settingsDropdown.classList.remove('active');
        }
    });

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

    const floatBtn = document.querySelector('.float-book-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            floatBtn.classList.add('visible');
        } else {
            floatBtn.classList.remove('visible');
        }
    });

    const lookbookImages = document.querySelectorAll('.lookbook-track img');
    lookbookImages.forEach((img, index) => {
        if (index % 2 === 0) {
            img.classList.add('lb-odd'); 
        } else {
            img.classList.add('lb-even'); 
        }
    });

    const track = document.querySelector('.lookbook-track');
    const dots = document.querySelectorAll('.lookbook-dots .dot');
    
    if (track && dots.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = entry.target.getAttribute('data-index');
                    dots.forEach(d => d.classList.remove('active'));
                    if(dots[idx]) dots[idx].classList.add('active');
                }
            });
        }, { root: track, threshold: 0.6 }); 

        lookbookImages.forEach(img => imgObserver.observe(img));
    }

    initShop();
});

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
    const images = track.querySelectorAll('img');
    images.forEach(img => {
        if(img.getAttribute('data-index') == index) {
            track.scrollTo({ left: img.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
    });
};

window.togglePrice = function(type) {
    const juniorCol = document.getElementById('col-junior');
    const seniorCol = document.getElementById('col-senior');
    const juniorBtn = document.getElementById('btn-junior');
    const seniorBtn = document.getElementById('btn-senior');

    if (type === 'junior') {
        if(juniorCol) juniorCol.classList.remove('hidden-mobile');
        if(seniorCol) seniorCol.classList.add('hidden-mobile');
        if(juniorBtn) juniorBtn.classList.add('active');
        if(seniorBtn) seniorBtn.classList.remove('active');
    } else {
        if(juniorCol) juniorCol.classList.add('hidden-mobile');
        if(seniorCol) seniorCol.classList.remove('hidden-mobile');
        if(juniorBtn) juniorBtn.classList.remove('active');
        if(seniorBtn) seniorBtn.classList.add('active');
    }
};

const isEn = document.documentElement.lang === "en";

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

    /* РОЗРАХУНОК: 6 ТОВАРІВ НА ТЕЛЕФОНІ, 10 НА ПК */
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

window.openLightbox = function(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = "flex";
    lightboxImg.src = imgElement.src;
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = "none";
};