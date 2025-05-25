'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import RGBDesign from './landing_page';

const TextReveal = ({ text = 'G.JAYADITYA' }) => {
  const [showRGBDesign, setShowRGBDesign] = useState(false);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Skip animation if RGBDesign is showing
    if (showRGBDesign) return;

    // Initialize SplitType for main text
    const mainText = new SplitType(textRef.current, {
      types: 'chars'
    });

    // Initialize SplitType for subtitle
    const subtitleText = new SplitType(subtitleRef.current, {
      types: 'chars'
    });

    // GSAP timeline for sequenced animations
    const tl = gsap.timeline();

    // Animate main text
    tl.fromTo(
      mainText.chars,
      { y: 115 },
      {
        y: 0,
        stagger: 0.05,
        duration: 0.1,
      }
    )
    // Animate subtitle after main text
    .fromTo(
      subtitleText.chars,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.1,
        delay: 0.3
      },
      "-=0.2"
    )
    // Animate SVG
    .fromTo(
      svgRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      },
      "-=0.2"
    );

    // Cleanup function
    return () => {
      if (mainText && mainText.revert) {
        mainText.revert();
      }
      if (subtitleText && subtitleText.revert) {
        subtitleText.revert();
      }
    };
  }, [showRGBDesign]);

  const handleSvgClick = () => {
    // Animate out before showing RGB Design
    gsap.to(textRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.4,
    });

    gsap.to(subtitleRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.4,
    });

    gsap.to(svgRef.current, {
      scale: 5,
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        setShowRGBDesign(true);
      }
    });
  };

  const handleBackClick = () => {
    setShowRGBDesign(false);
    
    // Reset and animate in the main content
    setTimeout(() => {
      if (textRef.current && subtitleRef.current && svgRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }
        );
        
        gsap.fromTo(
          subtitleRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.2 }
        );
        
        gsap.fromTo(
          svgRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, delay: 0.4 }
        );
      }
    }, 300);
  };

  return (
    <>
      <header className={`flex flex-col justify-center items-center h-screen bg-[beige] overflow-hidden ${showRGBDesign ? 'opacity-0' : 'opacity-100'}`}>
        <h1 
          ref={textRef} 
          id="my-text"
          className="text-6xl font-zaft mb-8"
        >
          {text}
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-2xl mb-12 font-zaft text-center max-w-2xl"
        >
          Lets unravel the color of nature shall we?
        </p>
        
        {/* Clickable SVG */}
        <div 
          ref={svgRef} 
          onClick={handleSvgClick}
          className="cursor-pointer hover:scale-110 transition-transform duration-300"
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="2" />
            <path d="M30 50 L70 50 M50 30 L50 70" stroke="#333" strokeWidth="2" />
          </svg>
        </div>
      </header>
      
      {showRGBDesign && <RGBDesign onBackClick={handleBackClick} />}
    </>
  );
};

export default TextReveal; 