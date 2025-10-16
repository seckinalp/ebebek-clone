(function () {
    'use strict';

    const API_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    const STORAGE_KEYS = 
    {
        PRODUCTS: 'ebebek_products',
        FAVORITES: 'ebebek_favorites'
    };
    const CAROUSEL_ID = 'simple-product-carousel-seckin';
    const CAROUSEL_TITLE = 'Beğenebileceğinizi düşündüklerimiz';
    const MAX_VISIBLE_CARDS = 5;

    let products = [];
    let favorites = [];
    let currentSlide = 0;
    let visibleCards = 0;
    let maxSlide = 0;

    function checkPage() 
    {
        const path = window.location.href;
        
        if("https://www.e-bebek.com/" === path) 
        {
            return true;
        } 

        else 
        {
            console.log(path , ": is not https://www.e-bebek.com/");
            console.error("wrong page");
            return false;
        }
    }

    async function fetchProducts() 
    {
        const cachedData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

        if (cachedData) 
            {
            try {
                products = JSON.parse(cachedData);
                return true;
            } 
            catch (error) 
            {
                console.error("Failed to fetch products:", error);
                return false;
            }
        }

        else 
        {
            try 
            {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('API request failed');
                products = await response.json();
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
                return true;
            } 
            catch (error) 
            {
                console.error("Failed to fetch products:", error);
                return false;
            }
        }
    }

    function loadFavorites() 
    {
        try {
            favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        } catch {
            favorites = [];
        }
    }

    function saveFavorites() 
    {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }

    function buildProductCard(product) 
    {
        const isFav = favorites.includes(product.product_id);
        const discount = (product.original_price && product.original_price > product.price) ?
            Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
    
        return `
            <div class="sc-product-card" data-product-id="${product.product_id}" data-url="${product.url}">
                <div class="sc-product-card__image-wrapper">
                     <button class="sc-product-card__favorite ${isFav ? 'favorited' : ''}" aria-label="Add to favorites">
                        <i class="toys-icon toys-icon-heart"></i>
                    </button>
                    <img src="${product.img}" alt="${product.name}" class="sc-product-card__image">
                </div>
                <div class="sc-product-card__content">
                    <h2 class="sc-product-card__name"><b>${product.brand} - </b><span>${product.name}</span></h2>
                    <div class="sc-product-card__stars">
                        <i class="star">★</i><i class="star">★</i><i class="star">★</i><i class="star">★</i><i class="star">★</i>
                        <span class="review-count">(24)</span>
                    </div>
                    <div class="sc-product-card__price-container">
                <div class="sc-product-card__prices">
                    ${discount > 0 ? `
                        <div class="sc-product-card__old-price-group">
                            <span class="sc-product-card__original-price">${product.original_price.toFixed(2)} TL</span>
                            <span class="sc-product-card__discount-badge">%${discount}</span>
                        </div>
                    ` : ''}
                    <span class="sc-product-card__price ${discount > 0 ? 'discounted' : ''}">${product.price.toFixed(2)} TL</span>
                </div>
                        <button class="sc-product-card__add-btn" aria-label="Add to cart">
                            <i class="toys-icon toys-icon-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function buildHTML() 
    {
        const productCardsHTML = products.map(buildProductCard).join('');
        return `
            
        <div class="sc-banner">
                    <div id="${CAROUSEL_ID}" class="container">
                        <div class="banner__titles">
                            <h2>${CAROUSEL_TITLE}</h2>
                        </div>
                        <div class="banner__wrapper">
                            <button aria-label="back" class="sc-carousel-button swiper-prev">←</button>
                            <div class="sc-carousel-container">
                                <div class="sc-carousel-track">
                                    ${productCardsHTML}
                                </div>
                            </div>
                            <button aria-label="next" class="sc-carousel-button swiper-next">→</button>
                        </div>
                    </div>
</div>
           
        `;
    }

    function buildCSS() 
    {
        const css = `
            #${CAROUSEL_ID} .sc-banner { width: 100% !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .container { max-width: 1320px !important; margin: 0 auto !important; padding: 0 15px !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .banner__titles { margin: 16px 0 !important; text-align: center !important; }
            #${CAROUSEL_ID} .banner__titles h2 { font-size: 20px !important; font-weight: 700 !important; color: #333 !important; margin: 0 !important; }
            #${CAROUSEL_ID} .banner__wrapper { display: flex !important; align-items: center !important; gap: 16px !important; box-sizing: border-box !important; }

            #${CAROUSEL_ID} .sc-carousel-container { overflow: hidden !important; width: 100% !important; position: relative !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .sc-carousel-track { display: flex !important; gap: 16px !important; transition: transform 0.5s ease-in-out !important; flex-wrap: nowrap !important; box-sizing: border-box !important; }

            #${CAROUSEL_ID} .sc-product-card { flex-shrink: 0 !important; background: #fff !important; border: 1px solid rgb(238, 238, 238) !important; border-radius: 8px !important; cursor: pointer !important; position: relative !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .sc-product-card:hover { border-color: #a3b2bd !important; }
            #${CAROUSEL_ID} .sc-product-card__image-wrapper { position: relative !important; width: 100% !important; padding-top: 100% !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .sc-product-card__image { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: contain !important; padding: 12px 8px 12px 16px !important; box-sizing: border-box !important; }
            #${CAROUSEL_ID} .sc-product-card__favorite { position: absolute !important; top: 12px !important; right: 12px !important; background: #fff !important; border: none !important; width: 32px !important; height: 32px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 2 !important; cursor: pointer !important; }
            #${CAROUSEL_ID} .sc-product-card__favorite .toys-icon-heart::before { content: "♡" !important; font-style: normal !important; color: #999 !important; font-size: 18px !important; }
            #${CAROUSEL_ID} .sc-product-card__favorite.favorited .toys-icon-heart::before { content: "❤︎" !important; color: #ff6b00 !important; }
            #${CAROUSEL_ID} .sc-product-card__favorite:hover .toys-icon-heart::before { color: #ff6b00 !important; }
            
            #${CAROUSEL_ID} .sc-product-card__content { padding: 8px 12px 12px 12px !important; display: flex !important; flex-direction: column !important; gap: 4px !important; box-sizing: border-box !important; min-height: 160px !important; }
            #${CAROUSEL_ID} .sc-product-card__name { font-size: 11.5px !important; font-weight: 400 !important; color: #333 !important; margin: 0 !important; height: 40px !important; overflow: hidden !important; line-height: 1.3 !important; flex-shrink: 0 !important; }
            #${CAROUSEL_ID} .sc-product-card__name b { font-weight: 700 !important; }

            #${CAROUSEL_ID} .sc-product-card__stars { display: flex !important; gap: 2px !important; font-size: 15px !important; color: #ffa500 !important; margin-bottom: 0 !important; align-items: center !important; flex-shrink: 0 !important; }
            #${CAROUSEL_ID} .sc-product-card__stars .star { font-style: normal !important; }
            #${CAROUSEL_ID} .sc-product-card__stars .review-count { font-size: 11px !important; color: #999 !important; margin-left: 4px !important; font-style: normal !important; line-height: 1 !important; }

            #${CAROUSEL_ID} .sc-product-card__price-container { display: flex !important; justify-content: space-between !important; align-items: flex-end !important; margin-top: auto !important; padding-top: 8px !important; box-sizing: border-box !important; }

            #${CAROUSEL_ID} .sc-product-card__prices { display: flex !important; flex-direction: column !important; gap: 4px !important; min-height: fit-content !important; }
            #${CAROUSEL_ID} .sc-product-card__old-price-group { display: flex !important; align-items: center !important; gap: 6px !important; }
            #${CAROUSEL_ID} .sc-product-card__discount-badge { background: #00a365 !important; color: #fff !important; padding: 2px 6px !important; border-radius: 10px !important; font-size: 11px !important; font-weight: 600 !important; }
            #${CAROUSEL_ID} .sc-product-card__original-price { color: #999 !important; font-size: 14px !important; }
            #${CAROUSEL_ID} .sc-product-card__price { font-size: 18px !important; font-weight: 700 !important; color: #000 !important; }
            #${CAROUSEL_ID} .sc-product-card__price.discounted { color: #00a365 !important; }
            
           #${CAROUSEL_ID} .sc-product-card__add-btn { background: #fff !important; border: 0.5px solid #e5e5e5 !important; width: 36px !important; height: 36px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; flex-shrink: 0 !important; box-shadow: 0 2px 4px rgba(82, 80, 80, 0.1) !important; }
            #${CAROUSEL_ID} .sc-product-card__add-btn .toys-icon-plus::before { content: "+" !important; font-style: normal !important; color: #0092db !important; font-size: 20px !important; font-weight: 600 !important; }
            #${CAROUSEL_ID} .sc-product-card__add-btn:hover { background: #0092db !important; border-color: #0092db !important; }
            #${CAROUSEL_ID} .sc-product-card__add-btn:hover .toys-icon-plus::before { color: #fff !important; }

            #${CAROUSEL_ID} .sc-carousel-button { flex-shrink: 0 !important; width: 48px !important; height: 48px !important; background: #fff !important; border: none !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; z-index: 10 !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1) !important; font-size: 20px !important; color: #333 !important; }
            #${CAROUSEL_ID} .sc-carousel-button:disabled { opacity: 1 !important; cursor: pointer !important; }
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
            const container = track.parentElement;
            if (!container) return;
            
            // Use getBoundingClientRect for more accurate measurement
            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width || container.offsetWidth || container.clientWidth;
            
            if (containerWidth <= 0) return;
            
            const gap = 16;
            const baseCardWidth = 200;
            const potentialVisibleCards = Math.floor((containerWidth + gap) / (baseCardWidth + gap));
            visibleCards = Math.min(MAX_VISIBLE_CARDS, potentialVisibleCards >= 2 ? potentialVisibleCards : 2);

            const newCardWidth = (containerWidth - ((visibleCards - 1) * gap)) / visibleCards;
            cards.forEach(card => {
                card.style.width = `${newCardWidth}px`;
                card.style.minWidth = `${newCardWidth}px`;
                card.style.maxWidth = `${newCardWidth}px`;
            });

            maxSlide = Math.max(0, products.length - visibleCards);

            if (currentSlide > maxSlide) {
                currentSlide = maxSlide;
            }

            track.style.transform = `translateX(-${currentSlide * (newCardWidth + gap)}px)`;
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

        carousel.addEventListener('click', (e) => {
            const favButton = e.target.closest('.sc-product-card__favorite');
            if (favButton) 
            {
                const productId = favButton.closest('.sc-product-card').dataset.productId;
                favButton.classList.toggle('favorited');
                const index = favorites.indexOf(productId);
                if (index > -1) favorites.splice(index, 1);
                else favorites.push(productId);
                saveFavorites();
                return;
            }
            const card = e.target.closest('.sc-product-card');
            if (card && card.dataset.url) 
            {
                window.open(card.dataset.url, '_blank');
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
        const heroBanner = document.querySelector('eb-product-carousel');
        if (heroBanner) {
            heroBanner.insertAdjacentHTML('beforebegin', html);
        } else {
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container.firstElementChild);
        }
    }

    async function init() 
    {
        if (checkPage()) 
        {
            loadFavorites();
            if (await fetchProducts()) 
    {
        buildCSS();
        render();
        attachEvents();
                setTimeout(updateCarousel, 10); 
            }
        }
    }

    init();
})();
