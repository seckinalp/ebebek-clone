(function () 
{
    'use strict';

    const CAROUSEL_ID = 'simple-product-carousel-seckin';
    const CAROUSEL_TITLE = 'Basit Ürün Karuseli';
    const MAX_VISIBLE_CARDS = 7;

    const products = 
    [
        { name: 'Ürün 1' },
        { name: 'Ürün 2' },
        { name: 'Ürün 3' },
        { name: 'Ürün 4' },
        { name: 'Ürün 5' },
        { name: 'Ürün 6' },
        { name: 'Ürün 7' },
        { name: 'Ürün 8' },
        { name: 'Ürün 9' },
        { name: 'Ürün 10' }
    ];

    let currentSlide = 0;
    let visibleCards = 0;
    let maxSlide = 0;

    function buildProductCard(product) 
    {
        return `
            <div class="sc-product-card" data-name ="${product.name}">
                <div class="sc-product-card__content">
                    <h3 class="sc-product-card__name">${product.name}</h3>
                </div>
            </div>
        `;
    }

    function buildHTML() 
    {
        const productCardsHTML = products.map(buildProductCard).join('');
        return `
            <div id="${CAROUSEL_ID}">
                <div class="banner">
                    <div class="container">
                        <div class="banner__titles">
                            <h2>${CAROUSEL_TITLE}</h2>
                        </div>
                        <div class="banner__wrapper">
                            <button aria-label="back" class="carousel-button swiper-prev">◀</button>
                            <div class="sc-carousel-container">
                                <div class="sc-carousel-track">
                                    ${productCardsHTML}
                                </div>
                            </div>
                            <button aria-label="next" class="carousel-button swiper-next">▶</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function buildCSS() 
    {
        const css = `
            #${CAROUSEL_ID} .banner { width: 100%; }
            #${CAROUSEL_ID} .container { max-width: 1320px; margin: 0 auto; padding: 0 15px; }
            #${CAROUSEL_ID} .banner__titles { margin: 16px 0; text-align: center; }
            #${CAROUSEL_ID} .banner__titles h2 { font-size: 20px; font-weight: 700; color: #333; margin: 0; }
            #${CAROUSEL_ID} .banner__wrapper { display: flex; align-items: center; gap: 16px; }

            .sc-carousel-container { overflow: hidden !important; width: 100%; }
            .sc-carousel-track { display: flex; gap: 16px; transition: transform 0.5s ease-in-out; flex-wrap: nowrap; }

            .sc-product-card { flex-shrink: 0; background: #fff; border: 1px solid rgb(238, 238, 238); border-radius: 8px; box-sizing: border-box; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); overflow: hidden; }
            .sc-product-card__content { padding: 16px; display: flex; align-items: center; justify-content: center; min-height: 120px; }
            .sc-product-card__name { margin: 0; font-size: 16px; font-weight: 600; color: #222; text-align: center; }

            .carousel-button { flex-shrink: 0; width: 48px; height: 48px; background: #fff; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out; }
            .carousel-button:hover:not(:disabled) { background-color: #f3f4f6; }
            .carousel-button:disabled { opacity: 0.5; cursor: not-allowed; }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    function updateCarousel() 
    {
        const track = document.querySelector(`#${CAROUSEL_ID} .sc-carousel-track`);
        const prevButton = document.querySelector(`#${CAROUSEL_ID} .swiper-prev`);
        const nextButton = document.querySelector(`#${CAROUSEL_ID} .swiper-next`);
        if (!track || !prevButton || !nextButton) return;

        const cards = track.querySelectorAll('.sc-product-card');
        if (cards.length === 0) return;

        requestAnimationFrame(() => {
            const containerWidth = track.parentElement.offsetWidth;
            const gap = 16;

            const baseCardWidth = 220;
            const potentialVisibleCards = Math.floor((containerWidth + gap) / (baseCardWidth + gap));
            visibleCards = Math.min(MAX_VISIBLE_CARDS, potentialVisibleCards > 0 ? potentialVisibleCards : 1);

            const newCardWidth = (containerWidth - ((visibleCards - 1) * gap)) / visibleCards;
            cards.forEach(card => {
                card.style.width = `${newCardWidth}px`;
            });

            maxSlide = Math.max(0, products.length - visibleCards);

            if (currentSlide > maxSlide) {
                currentSlide = maxSlide;
            }

            track.style.transform = `translateX(-${currentSlide * (newCardWidth + gap)}px)`;

            prevButton.disabled = currentSlide === 0;
            nextButton.disabled = currentSlide >= maxSlide;
        });
    }

    function attachEvents() 
    {
        const carousel = document.getElementById(CAROUSEL_ID);
        if (!carousel) return;

        carousel.querySelector('.swiper-prev').addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });

        carousel.querySelector('.swiper-next').addEventListener('click', () => {
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateCarousel();
            }
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 200);
        });
    }

    function render() 
    {
        if (document.getElementById(CAROUSEL_ID)) return;
        const html = buildHTML();
        const heroBanner = document.querySelector('eb-hero-banner-carousel');
        if (heroBanner) {
            heroBanner.insertAdjacentHTML('afterend', html);
        } else {
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container.firstElementChild);
        }
    }

    function init() 
    {
        buildCSS();
        render();
        attachEvents();
        setTimeout(updateCarousel, 50);
    }

    init();
})();
