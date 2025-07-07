export class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSmoothScroll();
    }

    initMobileMenu() {
        const menuButton = document.querySelector('.menu');
        const navContainer = document.querySelector('.nav-container');
        const closeButton = document.querySelector('.close-btn');

        if (!menuButton || !navContainer || !closeButton) return;

        const showNav = () => {
            navContainer.style.display = 'block';
        };

        const hideNav = () => {
            navContainer.style.display = 'none';
        };

        menuButton.addEventListener('click', showNav);
        closeButton.addEventListener('click', hideNav);

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!navContainer.contains(event.target) && !menuButton.contains(event.target)) {
                hideNav();
            }
        });
    }

    initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('[data-scroll-to]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}