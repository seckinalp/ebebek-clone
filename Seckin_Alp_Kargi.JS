setTimeout(() => {
    (() => {

        const buildHTML = () => {
            const html = `
                <div class="clone-area" style="border: 2px solid blue; margin: 20px auto; text-align: center; color: white; font-family: sans-serif; padding: 10px;">
                    <h1>Beğenebileceğinizi düşündüklerimiz</h1>
                </div>
            `;
            
            const heroBanner = document.querySelector('eb-hero-banner-carousel');
            if (heroBanner) {
                heroBanner.insertAdjacentHTML('afterend', html);
            } else {
                console.error("no hero banner");
            }
        };

        const buildCSS = () => {
            const css = `
                .clone-area {
                    background-color: red;
                    height: 100px;
                    width: 80%;
                }
            `;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = css;
            document.head.appendChild(styleElement);
        };

        buildHTML();
        buildCSS();

    })();
}, 2000);