'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { collection } from '../app/projects/collection';
import styles from '../styles/gallery.module.css';
import detailStyles from '../styles/projectDetail.module.css';

export default function Gallery() {
    const galleryRef = useRef(null);
    const galleryContainerRef = useRef(null);
    const titleContainerRef = useRef(null);
    const cardsRef = useRef([]);
    const transformStateRef = useRef([]);
    const isPreviewActiveRef = useRef(false);
    const isTransitioningRef = useRef(false);
    const currentTitleRef = useRef(null);
    const projectDetailRef = useRef(null);
    
    // State for detailed project view
    const [selectedProject, setSelectedProject] = useState(null);
    const [detailViewActive, setDetailViewActive] = useState(false);
    
    // Define the config object with all necessary parameters
    const config = {
        imageCount: collection.length,
        radius: 275, // Increased radius for better spacing between images
        sensitivity: 500,
        effectFalloff: 250,
        cardMoveAmount: 50,
        lerpFactor: 0.4, // Increased for more responsive animations with less resistance
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 1000 : false
    };
    
    // Define parallaxState outside of any hooks
    const parallaxState = {
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        currentX: 0,
        currentY: 0,
        currentZ: 0,
    };
    
    // Create a tooltip element for showing project titles on hover
    const [tooltipRef] = useState(() => {
        if (typeof document !== 'undefined') {
            const tooltip = document.createElement('div');
            tooltip.className = styles.tooltip;
            tooltip.style.position = 'fixed';
            tooltip.style.padding = '8px 12px';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '14px';
            tooltip.style.fontWeight = 'bold';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.zIndex = '1000';
            tooltip.style.transform = 'translateY(10px)';
            tooltip.style.transition = 'opacity 0.3s, transform 0.3s';
            document.body.appendChild(tooltip);
            return tooltip;
        }
        return null;
    });
    
    useEffect(() => {
        const gallery = galleryRef.current;
        const galleryContainer = galleryContainerRef.current;
        const titleContainer = titleContainerRef.current;

        if (!gallery || !galleryContainer || !titleContainer) {
            console.error('Gallery elements not found');
            return;
        }

        // Clear any existing cards and state
        cardsRef.current = [];
        transformStateRef.current = [];
        
        // Create timeline for the reveal animation
        const mainTimeline = gsap.timeline({
            defaults: { ease: "power3.out" }
        });
        
        // Initial setup - hide gallery
        gsap.set(gallery, { autoAlpha: 0 });
        
        // Create cards but don't position them yet
        const cardElements = [];
        
        for (let i = 0; i < config.imageCount; i++) {
            const angle = (i / config.imageCount) * Math.PI * 2;
            // const x = config.radius * Math.cos(angle);
            // const y = config.radius * Math.sin(angle);
            const cardIndex = i % collection.length;

            const card = document.createElement("div");
            card.className = styles.card;
            card.dataset.index = i;
            card.dataset.title = collection[cardIndex].title;
            
            const img = document.createElement("img");
            img.src = collection[cardIndex].img;
            card.appendChild(img);
            
            // Set initial state - all cards at center with no opacity
            gsap.set(card, {
                x: 0,
                y: 0,
                rotation: Math.random() * 360,
                scale: 0,
                autoAlpha: 0,
                transformPerspective: 800,
                transformOrigin: "center center",
            });

            gallery.appendChild(card);
            cardsRef.current.push(card);
            cardElements.push(card);
            transformStateRef.current.push({
                currentRotation: 0,
                targetRotation: 0,
                currentX: 0,
                targetX: 0,
                currentY: 0,
                targetY: 0,
                currentScale: 1,
                targetScale: 1,
                angle,
            });

            card.addEventListener('click', (e) => {
                if (!isPreviewActiveRef.current && !isTransitioningRef.current) {
                    togglePreview(parseInt(card.dataset.index));
                    e.stopPropagation();
                }
            });
            
            // Add hover events for tooltip
            card.addEventListener('mouseenter', (e) => {
                if (tooltipRef) {
                    tooltipRef.textContent = collection[cardIndex].title;
                    tooltipRef.style.opacity = '1';
                    tooltipRef.style.transform = 'translateY(0)';
                    
                    // Position tooltip near cursor
                    const updateTooltipPosition = (e) => {
                        tooltipRef.style.left = `${e.clientX + 15}px`;
                        tooltipRef.style.top = `${e.clientY + 15}px`;
                    };
                    
                    updateTooltipPosition(e);
                    card.addEventListener('mousemove', updateTooltipPosition);
                    card._tooltipMoveHandler = updateTooltipPosition;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (tooltipRef) {
                    tooltipRef.style.opacity = '0';
                    tooltipRef.style.transform = 'translateY(10px)';
                    
                    if (card._tooltipMoveHandler) {
                        card.removeEventListener('mousemove', card._tooltipMoveHandler);
                        card._tooltipMoveHandler = null;
                    }
                }
            });
        }
        
        // Reveal animation sequence
        mainTimeline
            // First fade in the gallery container
            .to(gallery, { autoAlpha: 1, duration: 0.5 })
            
            // Then animate a burst of cards from center
            .to(cardElements, {
                scale: 1.2,
                autoAlpha: 1,
                rotation: (i) => (transformStateRef.current[i].angle * 180) / Math.PI + 90 + Math.random() * 30 - 15,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.7)"
            })
            
            // Then spread cards to their final positions
            .to(cardElements, {
                x: (i) => config.radius * Math.cos(transformStateRef.current[i].angle),
                y: (i) => config.radius * Math.sin(transformStateRef.current[i].angle),
                scale: 1,
                rotation: (i) => (transformStateRef.current[i].angle * 180) / Math.PI + 90,
                duration: 1.2,
                stagger: 0.03,
                ease: "elastic.out(1, 0.8)"
            }, "-=0.4");
            
        // Add a subtle pulse animation to cards after they're positioned
        mainTimeline.add(() => {
            cardElements.forEach((card, i) => {
                gsap.to(card, {
                    y: config.radius * Math.sin(transformStateRef.current[i].angle) + 10,
                    duration: 1.5 + Math.random() * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 0.5
                });
            });
        });

        // After creating all cards and setting up the gallery
        // Make sure we're not setting any initial position that might offset it
        gsap.set(gallery, {
            rotation: 0,
            x: 0,
            y: 0,
            scale: 1,
            transformOrigin: "center center"
        });

        gsap.set(galleryContainer, {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            transformOrigin: "center center"
        });

        // Add event listeners
        document.addEventListener("click", () => {
            if (isPreviewActiveRef.current && !isTransitioningRef.current) resetGallery();
        });

        document.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        
        // Initialize with correct sizing
        handleResize();

        // Start animation
        animate();

        // Cleanup function
        return () => {
            document.removeEventListener("click", () => {});
            document.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            
            // Remove all cards from the gallery
            cardsRef.current.forEach(card => {
                card.removeEventListener('click', () => {});
                if (card.parentNode === gallery) {
                    gallery.removeChild(card);
                }
            });
        };
    }, []);

    function togglePreview(index) {
        isPreviewActiveRef.current = true;
        isTransitioningRef.current = true;

        // Store the selected project for detailed view
        const projectIndex = parseInt(cardsRef.current[index].dataset.index);
        const project = collection[projectIndex % collection.length];
        setSelectedProject(project);

        const angle = transformStateRef.current[index].angle;
        const targetPosition = (Math.PI * 3) / 2;
        let rotationRadians = targetPosition - angle;

        if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
        else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

        transformStateRef.current.forEach((state) => {
            state.currentRotation = state.targetRotation = 0;
            state.currentScale = state.targetScale = 1;
            state.currentX = state.targetX = state.currentY = state.targetY = 0;
        });

        // First animation: swirl effect (same as original)
        gsap.to(galleryRef.current, {
            onStart: () => {
                cardsRef.current.forEach((card, i) => {
                    gsap.to(card, {
                        x: config.radius * Math.cos(transformStateRef.current[i].angle),
                        y: config.radius * Math.sin(transformStateRef.current[i].angle),
                        rotationY: 0,
                        scale: 1,
                        duration: 1.25,
                        ease: "power4.out"
                    });
                });
            },
            scale: 5,
            y: 1300,
            rotation: (rotationRadians * 180) / Math.PI + 360,
            duration: 2,
            ease: "power4.inOut",
            onComplete: () => {
                isTransitioningRef.current = false;
                
                // After the swirl completes, prepare for the physical transition
                setTimeout(() => {
                    // Get the clicked card
                    const clickedCard = cardsRef.current[index];
                    const clickedCardRect = clickedCard.getBoundingClientRect();
                    
                    // Make the project detail container visible but with opacity 0
                    setDetailViewActive(true);
                    
                    // Create a clone of the clicked image for the transition
                    const transitionImage = document.createElement('img');
                    transitionImage.src = collection[projectIndex % collection.length].img;
                    transitionImage.style.position = 'fixed';
                    transitionImage.style.top = `${clickedCardRect.top}px`;
                    transitionImage.style.left = `${clickedCardRect.left}px`;
                    transitionImage.style.width = `${clickedCardRect.width}px`;
                    transitionImage.style.height = `${clickedCardRect.height}px`;
                    transitionImage.style.borderRadius = '4px';
                    transitionImage.style.zIndex = '2000';
                    transitionImage.style.objectFit = 'cover';
                    document.body.appendChild(transitionImage);
                    
                    // Hide the original card
                    gsap.set(clickedCard, { opacity: 0 });
                    
                    // Animate the transition image to the header position
                    gsap.to(transitionImage, {
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '50vh',
                        borderRadius: 0,
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            // Remove the transition image
                            document.body.removeChild(transitionImage);
                            
                            // Show the project detail with the header already visible
                            const headerElement = projectDetailRef.current.querySelector(`.${detailStyles.projectHeader}`);
                            const contentElement = projectDetailRef.current.querySelector(`.${detailStyles.projectContent}`);
                            const backButton = projectDetailRef.current.querySelector(`.${detailStyles.backButton}`);
                            const titleElement = projectDetailRef.current.querySelector(`.${detailStyles.projectTitle}`);
                            
                            // Get all content elements for staggered animation
                            const description = contentElement.querySelector(`.${detailStyles.projectDescription}`);
                            const techContainer = contentElement.querySelector(`.${detailStyles.techContainer}`);
                            const linksContainer = contentElement.querySelector(`.${detailStyles.linksContainer}`);
                            const techTags = contentElement.querySelectorAll(`.${detailStyles.techTag}`);
                            const projectLinks = contentElement.querySelectorAll(`.${detailStyles.projectLink}`);
                            
                            // Set initial states
                            gsap.set(headerElement, { opacity: 1 });
                            gsap.set(projectDetailRef.current, { opacity: 1 });
                            
                            // Create a timeline for coordinated animations
                            const tl = gsap.timeline({
                                defaults: { ease: "power3.out" }
                            });
                            
                            // Title animation with text reveal effect
                            gsap.set(titleElement, { 
                                opacity: 1, 
                                clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" 
                            });
                            
                            tl.to(titleElement, {
                                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                                duration: 0.8,
                                ease: "power4.inOut"
                            }, 0.1);
                            
                            // Back button animation with rotation
                            gsap.set(backButton, { opacity: 0, rotation: -90, scale: 0.5 });
                            
                            tl.to(backButton, {
                                opacity: 1,
                                rotation: 0,
                                scale: 1,
                                duration: 0.5,
                                ease: "back.out(1.7)"
                            }, 0.2);
                            
                            // Content section animations
                            gsap.set([description, techContainer, linksContainer], { 
                                opacity: 0, 
                                y: 30 
                            });
                            
                            // Staggered fade-in for content sections
                            tl.to([description, techContainer, linksContainer], {
                                opacity: 1,
                                y: 0,
                                duration: 0.7,
                                stagger: 0.15,
                                ease: "power3.out"
                            }, 0.3);
                            
                            // Tech tags animation with staggered reveal
                            gsap.set(techTags, { opacity: 0, scale: 0.8, y: 20 });
                            
                            tl.to(techTags, {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.05,
                                ease: "back.out(1.7)"
                            }, 0.6);
                            
                            // Links animation with bounce effect
                            gsap.set(projectLinks, { opacity: 0, scale: 0.7 });
                            
                            tl.to(projectLinks, {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                stagger: 0.1,
                                ease: "elastic.out(1, 0.5)"
                            }, 0.8);
                            
                            // Add a subtle parallax effect to the header image
                            const headerImg = headerElement.querySelector('img');
                            gsap.fromTo(headerImg, 
                                { scale: 1.1 },
                                { scale: 1, duration: 1.5, ease: "power2.out" }
                            );
                        }
                    });
                }, 500);
            },
        });

        gsap.to(parallaxState, {
            currentX: 0,
            currentY: 0,
            currentZ: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
                gsap.set(galleryContainerRef.current, {
                    rotateX: parallaxState.currentX,
                    rotateY: parallaxState.currentY,
                    rotateZ: parallaxState.currentZ,
                    transformOrigin: "center center",
                });
            },
        });

        const titleText = cardsRef.current[index].dataset.title;
        const p = document.createElement("p");
        p.textContent = titleText;
        titleContainerRef.current.appendChild(p);
        currentTitleRef.current = p;
        
        // Simple animation without SplitText
        gsap.fromTo(p, 
            {y: 50, opacity: 0},
            {y: 0, opacity: 1, duration: 0.75, delay: 1.25, ease: "power4.out"}
        );
    }

    function resetGallery() {
        if (isTransitioningRef.current) return;

        isTransitioningRef.current = true;

        // If detailed view is active, animate the image back to its original position
        if (detailViewActive && selectedProject) {
            // Find the original card position
            let originalCardIndex = -1;
            for (let i = 0; i < cardsRef.current.length; i++) {
                const cardTitle = cardsRef.current[i].dataset.title;
                if (cardTitle === selectedProject.title) {
                    originalCardIndex = i;
                    break;
                }
            }
            
            if (originalCardIndex >= 0) {
                const originalCard = cardsRef.current[originalCardIndex];
                const cardRect = originalCard.getBoundingClientRect();
                
                // Hide content and buttons first
                const headerElement = projectDetailRef.current.querySelector(`.${detailStyles.projectHeader}`);
                const contentElement = projectDetailRef.current.querySelector(`.${detailStyles.projectContent}`);
                const backButton = projectDetailRef.current.querySelector(`.${detailStyles.backButton}`);
                const titleElement = projectDetailRef.current.querySelector(`.${detailStyles.projectTitle}`);
                const headerImage = headerElement.querySelector('img');
                
                // Create a clone of the header image for the transition back
                const transitionImage = document.createElement('img');
                transitionImage.src = selectedProject.img;
                transitionImage.style.position = 'fixed';
                transitionImage.style.top = '0';
                transitionImage.style.left = '0';
                transitionImage.style.width = '100%';
                transitionImage.style.height = '50vh';
                transitionImage.style.objectFit = 'cover';
                transitionImage.style.zIndex = '2000';
                document.body.appendChild(transitionImage);
                
                // Hide elements with staggered animations
                gsap.to(contentElement, {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    ease: "power3.in"
                });
                
                // Back button animation
                gsap.to(backButton, {
                    opacity: 0,
                    rotation: 90,
                    scale: 0.5,
                    duration: 0.3,
                    ease: "back.in(1.7)"
                });
                
                // Title animation
                gsap.to(titleElement, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power3.in"
                });
                
                // Header image animation
                gsap.to(headerImage, {
                    scale: 1.05,
                    opacity: 0.8,
                    duration: 0.4
                });
                
                // Delay before transitioning back
                setTimeout(() => {
                    // Hide the detail container
                    gsap.set(projectDetailRef.current, { opacity: 0 });
                    
                    // Animate the transition image back to the card position
                    gsap.to(transitionImage, {
                        top: cardRect.top + 'px',
                        left: cardRect.left + 'px',
                        width: cardRect.width + 'px',
                        height: cardRect.height + 'px',
                        borderRadius: '4px',
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            // Remove the transition image
                            document.body.removeChild(transitionImage);
                            
                            // Show the original card
                            gsap.to(originalCard, { opacity: 1, duration: 0.3 });
                            
                            // Reset state
                            setDetailViewActive(false);
                            setSelectedProject(null);
                            
                            // Continue with the regular reset
                            continueReset();
                        }
                    });
                }, 500);
            } else {
                // Fallback if card not found
                gsap.to(projectDetailRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setDetailViewActive(false);
                        setSelectedProject(null);
                        continueReset();
                    }
                });
            }
        } else {
            continueReset();
        }
    }
    
    function continueReset() {
        if (currentTitleRef.current) {
            // Replace SplitText animation with simple animation
            gsap.to(currentTitleRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.75,
                delay: 0.5,
                ease: "power4.out",
                onComplete: () => {
                    if (currentTitleRef.current && currentTitleRef.current.parentNode) {
                        currentTitleRef.current.remove();
                    }
                    currentTitleRef.current = null;
                }
            });
        }

        const viewportWidth = window.innerWidth;
        let galleryScale = 1;

        if (viewportWidth < 760) {
            galleryScale = 0.6; 
        } else if (viewportWidth < 1200) {
            galleryScale = 0.8;
        }

        gsap.to(galleryRef.current, {
            scale: galleryScale,
            y: 0,
            x: 0,
            rotation: 0,
            duration: 2.5,
            ease: "power4.inOut",
            onComplete: () => {
                isPreviewActiveRef.current = isTransitioningRef.current = false;
                Object.assign(parallaxState, {
                    targetX: 0,
                    targetY: 0,
                    targetZ: 0,
                    currentX: 0,
                    currentY: 0,
                    currentZ: 0,
                });
            },
        });
    }

    function handleResize() {
        if (typeof window === 'undefined') return;
        
        const viewportWidth = window.innerWidth;
        config.isMobile = viewportWidth < 1000;
        let galleryScale = 1;
        
        if (viewportWidth < 768) {
            galleryScale = 0.6;
        } else if (viewportWidth < 1200) {
            galleryScale = 0.8;
        }

        // Center the gallery - don't use x/y positioning here
        gsap.set(galleryRef.current, {
            scale: galleryScale,
            transformOrigin: "center center"
        });
        
        // Reset other properties if needed
        if (!isPreviewActiveRef.current) {
            parallaxState.targetX = 0;
            parallaxState.targetY = 0;
            parallaxState.targetZ = 0;
            parallaxState.currentX = 0;
            parallaxState.currentY = 0;
            parallaxState.currentZ = 0;

            transformStateRef.current.forEach((state) => {
                state.targetRotation = 0;
                state.currentRotation = 0;
                state.targetScale = 1;
                state.currentScale = 1;
                state.targetX = 0;
                state.currentX = 0;
                state.targetY = 0;
                state.currentY = 0;
            });
        }
    }

    function handleMouseMove(e) {
        // Only skip for mobile, allow effects during preview
        if (config.isMobile || isPreviewActiveRef.current) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const percentX = (e.clientX - centerX) / centerX;
        const percentY = (e.clientY - centerY) / centerY;

        // Set parallax targets
        parallaxState.targetY = percentX * 15;
        parallaxState.targetX = -percentY * 15;
        parallaxState.targetZ = (percentX + percentY) * 5;

        // Process each card
        cardsRef.current.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.sensitivity) {
                const flipFactor = Math.max(0, 1 - distance / config.effectFalloff);
                const angle = transformStateRef.current[index].angle;
                const moveAmount = config.cardMoveAmount * flipFactor;

                transformStateRef.current[index].targetRotation = 180 * flipFactor;
                transformStateRef.current[index].targetScale = 1 + 0.3 * flipFactor;
                transformStateRef.current[index].targetX = moveAmount * Math.cos(angle);
                transformStateRef.current[index].targetY = moveAmount * Math.sin(angle);
            } else {
                transformStateRef.current[index].targetRotation = 0;
                transformStateRef.current[index].targetScale = 1;
                transformStateRef.current[index].targetX = 0;
                transformStateRef.current[index].targetY = 0;
            }
        });
    }

    function animate() {
        // Always update parallax state, but only apply it when not in preview
        if (!isPreviewActiveRef.current) {
            parallaxState.currentX += (parallaxState.targetX - parallaxState.currentX) * config.lerpFactor;
            parallaxState.currentY += (parallaxState.targetY - parallaxState.currentY) * config.lerpFactor;
            parallaxState.currentZ += (parallaxState.targetZ - parallaxState.currentZ) * config.lerpFactor;

            gsap.set(galleryContainerRef.current, {
                rotateX: parallaxState.currentX,
                rotateY: parallaxState.currentY,
                rotateZ: parallaxState.currentZ,
                transformOrigin: "center center",
            });
        }

        // Always update card animations
        cardsRef.current.forEach((card, index) => {
            const state = transformStateRef.current[index];
            
            // Only apply flip/scale effects when not in preview
            if (!isPreviewActiveRef.current) {
                state.currentRotation += (state.targetRotation - state.currentRotation) * config.lerpFactor;
                state.currentScale += (state.targetScale - state.currentScale) * config.lerpFactor;
                state.currentX += (state.targetX - state.currentX) * config.lerpFactor;
                state.currentY += (state.targetY - state.currentY) * config.lerpFactor;
            }

            const angle = state.angle;
            const x = config.radius * Math.cos(angle);
            const y = config.radius * Math.sin(angle);

            gsap.set(card, {
                x: x + (isPreviewActiveRef.current ? 0 : state.currentX),
                y: y + (isPreviewActiveRef.current ? 0 : state.currentY),
                rotationY: isPreviewActiveRef.current ? 0 : state.currentRotation,
                scale: isPreviewActiveRef.current ? 1 : state.currentScale,
                rotation: (angle * 180) / Math.PI + 90,
                transformPerspective: 1000,
            });
        });
        
        requestAnimationFrame(animate);
    }

    return (
        <div className={styles.container}>
            <div className={styles.galleryContainer} ref={galleryContainerRef}>
                <div className={styles.gallery} ref={galleryRef}>
                    {/* Cards will be added here dynamically */}
                </div>
                <div className={styles.titleContainer} ref={titleContainerRef}></div>
            </div>
            
            {/* Detailed Project View */}
            <div 
                className={`${detailStyles.projectDetailContainer} ${detailViewActive ? detailStyles.active : ''}`} 
                ref={projectDetailRef}
            >
                {selectedProject && (
                    <>
                        <div className={detailStyles.projectHeader}>
                            <button 
                                className={detailStyles.backButton} 
                                onClick={resetGallery}
                                aria-label="Back to gallery"
                            >
                                &larr;
                            </button>
                            <img src={selectedProject.img} alt={selectedProject.title} />
                            <h1 className={detailStyles.projectTitle}>{selectedProject.title}</h1>
                        </div>
                        
                        <div className={detailStyles.projectContent}>
                            <p className={detailStyles.projectDescription}>
                                {selectedProject.description}
                            </p>
                            
                            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                                <div className={detailStyles.techContainer}>
                                    <h2 className={detailStyles.techTitle}>Technologies</h2>
                                    <div className={detailStyles.techList}>
                                        {selectedProject.technologies.map((tech, index) => (
                                            <span key={index} className={detailStyles.techTag}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className={detailStyles.linksContainer}>
                                {selectedProject.liveLink && (
                                    <a 
                                        href={selectedProject.liveLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={detailStyles.projectLink}
                                    >
                                        View Live
                                    </a>
                                )}
                                
                                {selectedProject.githubLink && (
                                    <a 
                                        href={selectedProject.githubLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={detailStyles.projectLink}
                                    >
                                        GitHub Repository
                                    </a>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
