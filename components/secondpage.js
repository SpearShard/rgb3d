'use client';
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Second = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const [activeColor, setActiveColor] = useState('red');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const sections = ['Design', 'Create', 'Innovate'];

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            setMousePosition({
                x: (clientX / innerWidth) * 100,
                y: (clientY / innerHeight) * 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Auto-cycle through sections
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovering) {
                setCurrentSection(prev => (prev + 1) % sections.length);
            }
        }, 3000);
        
        return () => clearInterval(interval);
    }, [isHovering, sections.length]);

    // Change active color based on section
    useEffect(() => {
        const colors = ['red', 'green', 'blue'];
        setActiveColor(colors[currentSection]);
    }, [currentSection]);

    useGSAP(() => {
        // Create animations for section changes
        gsap.to(".color-overlay", {
            backgroundColor: `rgba(${activeColor === 'red' ? '255,0,0' : activeColor === 'green' ? '0,255,0' : '0,0,255'}, 0.15)`,
            duration: 1,
            ease: "power2.inOut"
        });
        
        // Animate the active section
        gsap.fromTo(
            `.section-${currentSection}`,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
        
        // Fade out other sections
        sections.forEach((_, index) => {
            if (index !== currentSection) {
                gsap.to(`.section-${index}`, { opacity: 0, y: -20, duration: 0.5 });
            }
        });
        
    }, { scope: sectionRef, dependencies: [activeColor, currentSection] });

    return (
        <div ref={sectionRef} className="w-full h-screen relative overflow-hidden">
            {/* Background with grid */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 opacity-20">
                    <div className="h-full w-full grid grid-cols-12 grid-rows-12">
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className="border border-white/5"></div>
                        ))}
                    </div>
                </div>
                
                {/* Color overlay */}
                <div 
                    className="color-overlay absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                        backgroundColor: `rgba(${activeColor === 'red' ? '255,0,0' : activeColor === 'green' ? '0,255,0' : '0,0,255'}, 0.15)`
                    }}
                ></div>
                
                {/* Radial gradient */}
                <div 
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 20%)`,
                        opacity: isHovering ? 0.8 : 0.3
                    }}
                ></div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 h-full flex">
                {/* Left panel - Navigation */}
                <div className="w-1/4 h-full border-r border-white/10 flex flex-col justify-center px-12">
                    <div className="space-y-16">
                        {sections.map((section, index) => (
                            <div 
                                key={index}
                                className={`cursor-pointer transition-all duration-300 ${currentSection === index ? 'opacity-100' : 'opacity-40'}`}
                                onClick={() => setCurrentSection(index)}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <div className="flex items-center">
                                    <div 
                                        className={`w-4 h-4 rounded-full mr-6 transition-all duration-300 ${currentSection === index ? 'scale-150' : 'scale-100'}`}
                                        style={{ 
                                            backgroundColor: index === 0 ? 'red' : index === 1 ? 'green' : 'blue',
                                            boxShadow: currentSection === index ? `0 0 15px ${index === 0 ? 'red' : index === 1 ? 'green' : 'blue'}` : 'none'
                                        }}
                                    ></div>
                                    <span className="text-white text-2xl font-light tracking-wider">{section}</span>
                                </div>
                                <div 
                                    className={`h-[1px] bg-gradient-to-r mt-4 transition-all duration-500 ${currentSection === index ? 'w-full' : 'w-0'}`}
                                    style={{ 
                                        backgroundImage: `linear-gradient(to right, ${index === 0 ? 'red' : index === 1 ? 'green' : 'blue'}, transparent)` 
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Right panel - Content */}
                <div className="w-3/4 h-full flex items-center justify-center px-20">
                    <div className="relative w-full h-[70vh]">
                        {/* Design Section */}
                        <div className={`section-0 absolute inset-0 flex flex-col justify-center ${currentSection === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                            <h2 className="text-7xl font-zaft mb-12 text-white">
                                <span className="text-red-500">R</span>GB Design
                            </h2>
                            <p className="text-2xl text-white/80 max-w-2xl mb-16 leading-relaxed">
                                Explore the power of color in design. The red spectrum represents passion, energy, and excitement in visual communication.
                            </p>
                            <div className="flex space-x-8 mt-8">
                                <div className="w-48 h-48 bg-red-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Passion</span>
                                </div>
                                <div className="w-48 h-48 bg-red-700/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-red-700/30 hover:bg-red-700/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Energy</span>
                                </div>
                                <div className="w-48 h-48 bg-red-900/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-red-900/30 hover:bg-red-900/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Power</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Create Section */}
                        <div className={`section-1 absolute inset-0 flex flex-col justify-center ${currentSection === 1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                            <h2 className="text-7xl font-zaft mb-12 text-white">
                                R<span className="text-green-500">G</span>B Create
                            </h2>
                            <p className="text-2xl text-white/80 max-w-2xl mb-16 leading-relaxed">
                                Harness the creative potential of green. Representing growth, harmony, and balance in the creative process.
                            </p>
                            <div className="grid grid-cols-3 gap-8 mt-8">
                                <div className="aspect-square bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-500/30 hover:bg-green-500/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Growth</span>
                                </div>
                                <div className="aspect-square bg-green-700/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-700/30 hover:bg-green-700/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Balance</span>
                                </div>
                                <div className="aspect-square bg-green-900/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-900/30 hover:bg-green-900/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Nature</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Innovate Section */}
                        <div className={`section-2 absolute inset-0 flex flex-col justify-center ${currentSection === 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                            <h2 className="text-7xl font-zaft mb-12 text-white">
                                RG<span className="text-blue-500">B</span> Innovate
                            </h2>
                            <p className="text-2xl text-white/80 max-w-2xl mb-16 leading-relaxed">
                                Dive into the blue of innovation. Representing trust, depth, and stability while pushing the boundaries of what's possible.
                            </p>
                            <div className="flex flex-col space-y-8 mt-8">
                                <div className="h-32 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Trust & Stability</span>
                                </div>
                                <div className="h-32 bg-blue-700/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-700/30 hover:bg-blue-700/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Depth & Wisdom</span>
                                </div>
                                <div className="h-32 bg-blue-900/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-900/30 hover:bg-blue-900/30 transition-all duration-300 cursor-pointer p-6">
                                    <span className="text-white text-xl">Tranquility & Focus</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom navigation dots */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-5 z-20">
                {sections.map((_, index) => (
                    <div 
                        key={index}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentSection === index ? 'scale-150' : 'scale-100'}`}
                        style={{ 
                            backgroundColor: index === 0 ? 'red' : index === 1 ? 'green' : 'blue',
                            boxShadow: currentSection === index ? `0 0 10px ${index === 0 ? 'red' : index === 1 ? 'green' : 'blue'}` : 'none'
                        }}
                        onClick={() => setCurrentSection(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Second;