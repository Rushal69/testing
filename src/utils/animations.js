import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export class AnimationManager {
    constructor() {
        this.locoScroll = null;
        this.init();
    }

    init() {
        this.initPreloader();
        this.initCustomCursor();
        this.initScrollAndTrigger();
        this.initSplitTextAnimation();
        this.initMarquee();
        this.initProjectDimming();
    }

    initPreloader() {
        // Check if the animation has already been played in the current tab
        if (!sessionStorage.getItem('preloaderPlayed')) {
            const tl = gsap.timeline();

            tl.to(".scroller", { overflow: "hidden" })
                .to(".preloader .text-container", {
                    duration: 0,
                    visibility: "visible",
                    ease: "power3.out"
                })
                .from(".preloader .text-container h1", {
                    duration: 1.5,
                    y: 70,
                    skewY: 10,
                    stagger: 0.4,
                    ease: "power3.out"
                })
                .to(".preloader .text-container h1", {
                    duration: 1.2,
                    y: 70,
                    skewY: -20,
                    stagger: 0.2,
                    ease: "power3.out"
                })
                .to(".preloader", {
                    duration: 1.5,
                    height: "0vh",
                    ease: "power3.out"
                })
                .to(".scroller", { overflow: "auto" }, "-=2")
                .from(".hero-content h1", {
                    duration: 1.5,
                    y: "100%",
                    skewY: 10,
                    stagger: 0.2,
                    ease: "power3.out"
                }, "-=1.5")
                .to(".preloader", { display: "none" });

            // Mark the animation as played for this tab
            sessionStorage.setItem('preloaderPlayed', 'true');
        } else {
            // If the animation has already been played in this tab, skip the preloader
            document.querySelector(".preloader").style.display = "none";
            document.querySelector(".scroller").style.overflow = "auto";
        }
    }

    initCustomCursor() {
        const minicircle = document.querySelector("#minicircle");
        
        // Hide cursor on devices without pointers
        if (!window.matchMedia("(pointer: fine)").matches) {
            minicircle.style.display = "none";
            return;
        }

        let timeout = null;
        let xprev = 0;
        let yprev = 0;

        // Initially hide the cursor
        minicircle.style.display = "none";

        // Listen for the first mouse movement to show the cursor
        window.addEventListener("mousemove", (dets) => {
            // Only show the cursor on the first movement
            if (minicircle.style.display === "none") {
                minicircle.style.display = "block";
            }

            clearTimeout(timeout);

            const xscale = gsap.utils.clamp(0.8, 1.2, dets.clientX - xprev);
            const yscale = gsap.utils.clamp(0.8, 1.2, dets.clientY - yprev);

            xprev = dets.clientX;
            yprev = dets.clientY;

            minicircle.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;

            timeout = setTimeout(() => {
                minicircle.style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;
            }, 100);
        });

        // Hide cursor when it leaves the viewport
        window.addEventListener("mouseout", () => {
            minicircle.style.opacity = "0";
        });

        // Show cursor when it re-enters the viewport
        window.addEventListener("mouseover", () => {
            minicircle.style.opacity = "1";
        });
    }

    initScrollAndTrigger() {
        // For now, we'll use regular scroll since Locomotive Scroll v4 has different API
        // This can be updated when Locomotive Scroll is properly configured
        return null;
    }

    initSplitTextAnimation() {
        const splitTypes = document.querySelectorAll('.reveal-type');

        if (splitTypes.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: splitTypes[0],
                    start: 'top 125%',
                    end: 'top 40%',
                    scrub: 1,
                }
            });

            splitTypes.forEach((char, i) => {
                const bg = char.dataset.bgColor;
                const fg = char.dataset.fgColor;
                const text = new SplitType(char, { types: 'chars' });

                tl.fromTo(text.chars, {
                    color: bg,
                    opacity: 0.5
                }, {
                    color: fg,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.02,
                    ease: 'power2.out'
                }, i === 0 ? 0 : '>=1');
            });
        }
    }

    initMarquee() {
        const marqueeWrapper = document.querySelector('.marquee-wrapper');
        const marquee = document.querySelector('.marquee');
        const marqueeContents = document.querySelectorAll('.marquee-content');

        if (marqueeWrapper && marquee && marqueeContents.length > 0) {
            // Clear any existing clones
            const clearClones = () => {
                const clones = marquee.querySelectorAll('.marquee-clone');
                clones.forEach(clone => clone.remove());
            };

            // Calculate how many clones we need to fill the screen and create seamless scroll
            const prepareMarquee = () => {
                clearClones();

                const viewportWidth = window.innerWidth;
                const contentWidth = Array.from(marqueeContents)
                    .reduce((total, content) => total + content.offsetWidth, 0);

                // Calculate how many sets of content we need to fill the screen twice
                const setsNeeded = Math.ceil((viewportWidth * 2) / contentWidth) + 1;

                // Create the necessary clones
                for (let i = 0; i < setsNeeded; i++) {
                    marqueeContents.forEach(content => {
                        const clone = content.cloneNode(true);
                        clone.classList.add('marquee-clone');
                        marquee.appendChild(clone);
                    });
                }

                return { contentWidth };
            };

            let currentAnimation;

            const startContinuousMarquee = () => {
                if (currentAnimation) {
                    currentAnimation.kill();
                }

                const { contentWidth } = prepareMarquee();

                // Create the seamless animation
                currentAnimation = gsap.to(marquee, {
                    x: -contentWidth,
                    duration: 20,
                    ease: 'none',
                    repeat: -1,
                    onRepeat: function() {
                        const currentX = gsap.getProperty(marquee, "x");
                        gsap.set(marquee, { x: currentX + contentWidth });
                    }
                });
            };

            // Initialize
            startContinuousMarquee();

            // Handle resize with debounce
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    startContinuousMarquee();
                }, 250);
            });
        }
    }

    initProjectDimming() {
        const projects = document.querySelectorAll('.project');

        projects.forEach(project => {
            project.addEventListener('mouseover', () => {
                projects.forEach(p => p !== project && p.classList.add('dimmer'));
            });

            project.addEventListener('mouseout', () => {
                projects.forEach(p => p.classList.remove('dimmer'));
            });
        });
    }
}