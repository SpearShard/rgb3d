// Add projects data
const projectsData = [
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    },
    {
        name: "Lunar Eclipse",
        director: "John Doe",
        location: "Toronto, QN"
    }
];

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
    const projectsContainer = document.querySelector(".projects");
    const locationsContainer = document.querySelector(".locations");
    const gridImages = gsap.utils.toArray(".img");
    const heroImage = document.querySelector(".img.hero-img");

    const images = gridImages.filter((img) => img === heroImage);

    const introCopy = new SplitType(".intro-copy h3", {
        types: "words",
        absolute: false,
    });

    const titleHeading = new SplitType(".title h1", {
        types: "words",
        absolute: false,
    });

    const allImageSources = [
        "https://ik.imagekit.io/0s6dxbeae/Chrome-red-painted-swatch-N.jpg?updatedAt=1748013926047",
        "https://ik.imagekit.io/0s6dxbeae/Option%201.png?updatedAt=1748011754439",
        "https://ik.imagekit.io/0s6dxbeae/Pure_blue.png?updatedAt=1748014238303",
        "https://ik.imagekit.io/0s6dxbeae/luxury-plain-green-gradient-abstract-studio-background-empty-room-with-space-your-text-picture_1258-99418.jpg_semt=ais_hybrid&w=740?updatedAt=1748014033006"
    ];

    const getRandomImageSet = () => {
        // Create an array of 9 images by repeating the available images
        const repeatedImages = [];
        for (let i = 0; i < 9; i++) {
            repeatedImages.push(allImageSources[i % allImageSources.length]);
        }
        return repeatedImages;
    };

    function intializeDynamicContent() {
        projectsData.forEach((project) => {
            const projectItem = document.createElement("div");
            projectItem.className = "project-item";

            const projectName = document.createElement("p");
            projectName.textContent = project.name;

            const directorName = document.createElement("p");
            directorName.textContent = project.director;

            projectItem.appendChild(projectName);
            projectItem.appendChild(directorName);

            projectsContainer.appendChild(projectItem);
        });

        projectsData.forEach((project) => {
            const locationItem = document.createElement("div");
            locationItem.className = "location-item";

            const locationName = document.createElement("p");
            locationName.textContent = project.location;

            locationItem.appendChild(locationName);
            locationsContainer.appendChild(locationItem);
        });
    }

    function startImageRotation() {
        const totalCycles = 20;

        for (let cycle = 0; cycle < totalCycles; cycle++) {
            const randomImages = getRandomImageSet();

            gsap.to(
                {},
                {
                    duration: 0,
                    delay: cycle * 0.15,
                    onComplete: () => {
                        gridImages.forEach((img, index) => {
                            const imgElement = img.querySelector("img");
                            if (imgElement) {
                                if (cycle === totalCycles - 1 && img === heroImage) {
                                    imgElement.src = "https://ik.imagekit.io/0s6dxbeae/luxury-plain-green-gradient-abstract-studio-background-empty-room-with-space-your-text-picture_1258-99418.jpg_semt=ais_hybrid&w=740?updatedAt=1748014033006";
                                    gsap.set(".hero-img img", { scale: 2 });
                                } else {
                                    imgElement.src = randomImages[index % randomImages.length];
                                }
                            }
                        });
                    },
                }
            );
        }
    }
    function setupInitialStates() {
        gsap.set("nav", {
            y: "-125%",
        });

        gsap.set(introCopy.words, {
            y: "110%",
        });

        gsap.set(titleHeading.words, {
            y: "110%",
            opacity: 0
        });
    }

    function init() {
        intializeDynamicContent();
        setupInitialStates();
        createAnimationTimelines();
    }

    init();

    function createAnimationTimelines() {
        const overlayTimeline = gsap.timeline();
        const imagesTimeline = gsap.timeline();
        const textTimeline = gsap.timeline();

        overlayTimeline.to(".logo-line-1", {
            backgroundPosition: "0% 0%",
            color: "#fff",
            duration: 1,
            ease: "none",
            delay: 0.5,
            onComplete: () => {
                gsap.to(".logo-line-2", {
                    backgroundPosition: "100% 0%",
                    color: "#fff",
                    duration: 1,
                    ease: "none",
                });
            },
        });

        overlayTimeline.to([".projects-header", ".project-item"], {
            opacity: 1,
            duration: 0.15,
            stagger: 0.075,
            delay: 1,
        });

        overlayTimeline.to(
            [".locations-header", ".location-item"],
            {
                opacity: 1,
                duration: 0.15,
                stagger: 0.075,
            },
            "<"
        );

        overlayTimeline.to(".project-item", {
            color: "#fff",
            duration: 0.15,
            stagger: 0.075,
        });

        overlayTimeline.to(
            ".location-item",
            {
                color: "#fff",
                duration: 0.15,
                stagger: 0.075,
            },
            "<"
        );

        overlayTimeline.to([".projects-header", ".project-item"], {
            opacity: 0,
            duration: 0.15,
            stagger: 0.075,
        });

        overlayTimeline.to(
            [".locations-header", ".location-item"],
            {
                opacity: 0,
                duration: 0.15,
                stagger: 0.075,
            },
            "<"
        );

        overlayTimeline.to(".overlay", {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
        });

        imagesTimeline.to(".img", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            delay: 2.5,
            stagger: 0.05,
            ease: "hop",
            onStart: () => {
                setTimeout(() => {
                    startImageRotation();
                    gsap.to(".loader", { opacity: 0, duration: 0.3 });
                }, 1000);
            },
        });

        imagesTimeline.to(".img", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            stagger: 0.05,
            ease: "hop",
        });

        imagesTimeline.to(".hero-img", {
            y: -50,
            duration: 1,
            ease: "hop",
        });

        imagesTimeline.to(".hero-img", {
            scale: 4,
            clipPath: "polygon(20% 10%, 80% 10%, 80% 90%, 20% 90%)",
            duration: 1.5,
            ease: "hop",
            onStart: () => {
                gsap.to(".hero-img img", {
                    scale: 1,
                    duration: 1.5,
                    ease: "hop",
                });

                gsap.to(".banner-img", { scale: 1, delay: 0.5, duration: 0.5 });
                gsap.to("nav", { y: "0%", duration: 1, ease: "hop", delay: 0.25 });
            },
        });

        imagesTimeline.to(
            ".banner-img-1",
            {
                left: "40%",
                rotate: -20,
                duration: 1.5,
                delay: 0.5,
                ease: "hop",
            },
            "<"
        );

        imagesTimeline.to(
            ".banner-img-2",
            {
                left: "60%",
                rotate: 20,
                duration: 1.5,
                ease: "hop",
            },
            "<"
        );

        textTimeline.to(titleHeading.words, {
            y: "0%",
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            delay: 9.5,
            ease: "power3.out",
        });

        textTimeline.to(
            introCopy.words,
            {
                y: "0%",
                duration: 1,
                stagger: 0.1,
                delay: 0.25,
                ease: "power3.out",
            },
            "<"
        );
    }
});
