'use client';

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import LineParticles from "./LineParticles";

const WorkPage = () => {
  const containerRef = useRef(null);
  const projectsRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);
  
  const projects = [
    {
      title: "Red Project",
      description: "A vibrant exploration of the red spectrum in digital design.",
      color: "red",
      tags: ["UI/UX", "Animation", "Web Design"]
    },
    {
      title: "Green Project",
      description: "Sustainable design principles applied to modern web experiences.",
      color: "green",
      tags: ["Branding", "Illustration", "Motion"]
    },
    {
      title: "Blue Project",
      description: "Innovative interfaces with depth and dimension.",
      color: "blue",
      tags: ["Development", "3D", "Interactive"]
    }
  ];

  useGSAP(() => {
    // Animate container on mount
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Animate projects
    gsap.fromTo(
      ".project-card",
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "back.out(1.7)" 
      }
    );
  }, { scope: containerRef });

  // Handle project hover
  const handleProjectHover = (index) => {
    setActiveProject(index);
    
    gsap.to(".project-card", {
      opacity: 0.5,
      scale: 0.95,
      duration: 0.3
    });
    
    gsap.to(`.project-card-${index}`, {
      opacity: 1,
      scale: 1,
      duration: 0.3
    });
  };

  // Reset projects on mouse leave
  const handleMouseLeave = () => {
    gsap.to(".project-card", {
      opacity: 1,
      scale: 1,
      duration: 0.3
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full bg-black relative overflow-hidden"
    >
      {/* Background particles */}
      <LineParticles />
      
      {/* Content container */}
      <div className="container mx-auto px-8 py-32 relative z-10">
        <h1 className="text-6xl font-zaft text-white mb-16">
          Our <span className="text-red-500">W</span>
          <span className="text-green-500">o</span>
          <span className="text-blue-500">r</span>k
        </h1>
        
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          onMouseLeave={handleMouseLeave}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-card project-card-${index} bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8 cursor-pointer transition-all duration-300`}
              onMouseEnter={() => handleProjectHover(index)}
              style={{
                boxShadow: activeProject === index ? 
                  `0 0 30px rgba(${project.color === 'red' ? '255,0,0' : project.color === 'green' ? '0,255,0' : '0,0,255'}, 0.3)` : 
                  'none'
              }}
            >
              <div 
                className="w-full h-48 mb-6 rounded-md overflow-hidden"
                style={{
                  background: `linear-gradient(45deg, 
                    rgba(${project.color === 'red' ? '255,0,0' : project.color === 'green' ? '0,255,0' : '0,0,255'}, 0.2),
                    rgba(0,0,0,0.8))`
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span 
                    className="text-6xl font-bold opacity-20"
                    style={{
                      color: project.color
                    }}
                  >
                    {project.color.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h3 
                className="text-2xl font-zaft mb-4"
                style={{
                  color: project.color === 'red' ? '#ff4444' : 
                         project.color === 'green' ? '#44ff44' : '#4444ff'
                }}
              >
                {project.title}
              </h3>
              
              <p className="text-white/70 mb-6">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `rgba(${project.color === 'red' ? '255,0,0' : project.color === 'green' ? '0,255,0' : '0,0,255'}, 0.2)`,
                      border: `1px solid rgba(${project.color === 'red' ? '255,0,0' : project.color === 'green' ? '0,255,0' : '0,0,255'}, 0.3)`,
                      color: 'white'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkPage;