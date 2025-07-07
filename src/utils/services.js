export class ServicesManager {
    constructor() {
        this.init();
    }

    init() {
        this.initServiceCards();
    }

    initServiceCards() {
        const hasMouse = window.matchMedia("(pointer: fine)").matches;

        if (hasMouse) {
            this.initMouseInteractions();
        } else {
            this.initTouchInteractions();
        }
    }

    initMouseInteractions() {
        let currentHoveredCard = null;

        document.querySelectorAll(".service-card").forEach((elem) => {
            let rotate = 0;
            let diffrot = 0;
            let image = elem.querySelector("img");

            // Mouse leave
            elem.addEventListener("mouseleave", () => {
                if (elem.querySelector(".definition").style.display !== "block") {
                    gsap.to(image, {
                        opacity: 0,
                        ease: "power3.out",
                        duration: 0.5,
                    });
                }

                if (currentHoveredCard === elem) {
                    currentHoveredCard = null;
                }
            });

            // Mouse move
            elem.addEventListener("mousemove", (dets) => {
                if (elem.querySelector(".definition").style.display !== "block") {
                    const diff = dets.clientY - elem.getBoundingClientRect().top;
                    diffrot = dets.clientX - rotate;
                    rotate = dets.clientX;

                    gsap.to(image, {
                        opacity: 1,
                        ease: "power3.out",
                        top: diff,
                        left: dets.clientX,
                        rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
                    });
                }
            });

            // Mouse enter
            elem.addEventListener("mouseenter", () => {
                let definition = elem.querySelector(".definition");

                if (currentHoveredCard && currentHoveredCard !== elem) {
                    let prevImage = currentHoveredCard.querySelector("img");
                    if (currentHoveredCard.querySelector(".definition").style.display !== "block") {
                        gsap.to(prevImage, {
                            opacity: 0,
                            ease: "power3.out",
                            duration: 0.5,
                        });
                    }
                }

                if (definition.style.display !== "block") {
                    gsap.to(image, {
                        opacity: 1,
                        ease: "power3.out",
                        duration: 0.5,
                    });
                    image.style.display = "block";
                }

                currentHoveredCard = elem;
            });
        });

        this.initServiceCardClicks();
    }

    initTouchInteractions() {
        this.initServiceCardClicks();
    }

    initServiceCardClicks() {
        let serviceCards = document.querySelectorAll(".service-card");
        let definitions = document.querySelectorAll(".definition");

        serviceCards.forEach((card, index) => {
            card.addEventListener("click", () => {
                let definition = definitions[index];
                let image = card.querySelector("img");

                if (definition.style.display === "block") {
                    gsap.to(definition, {
                        opacity: 0,
                        height: 0,
                        duration: 0.5,
                        ease: "power3.out",
                        onComplete: () => {
                            definition.style.display = "none";
                        }
                    });

                    gsap.to(image, {
                        opacity: 1,
                        ease: "power3.out",
                        duration: 0.5,
                        display: "block",
                    });
                } else {
                    definitions.forEach(def => {
                        gsap.to(def, {
                            opacity: 0,
                            height: 0,
                            duration: 0.5,
                            ease: "power3.out",
                            onComplete: () => {
                                def.style.display = "none";
                            }
                        });
                    });

                    gsap.to(definition, {
                        opacity: 1,
                        height: "auto",
                        duration: 0.5,
                        ease: "power3.out",
                        display: "block",
                    });

                    gsap.to(image, {
                        opacity: 0,
                        ease: "power3.out",
                        duration: 0.5,
                        onComplete: () => {
                            image.style.display = "none";
                        }
                    });
                }
            });
        });
    }
}