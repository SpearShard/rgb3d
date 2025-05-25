'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import SplitType from 'split-type';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navRef = useRef(null);
  const navItemsRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Initial animation
  useEffect(() => {
    // Animate navbar in with a longer delay to wait for title animation
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out", 
        delay: 10.5 // Increased delay to wait for title animation
      }
    );

    // Split and animate menu items text with adjusted timing
    navItemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const textSplit = new SplitType(item, {
        types: 'chars'
      });
      
      gsap.fromTo(
        textSplit.chars,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.3, 
          stagger: 0.02,
          delay: 3 + (index * 0.1) // Increased delay to match navbar timing
        }
      );
    });
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    
    if (isOpen) {
      gsap.to(mobileMenuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Hover animation for nav items
  const navItemHover = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-40 py-6 px-8 md:px-12 flex justify-between items-center transition-all duration-300 ${scrolled ? 'backdrop-blur-lg bg-black/40 shadow-lg' : 'backdrop-blur-md bg-black/20'} border-b ${scrolled ? 'border-white/20' : 'border-white/10'}`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          opacity: 0 // Start with opacity 0
        }}
      >
        {/* Logo */}
        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/">
            <h2 
              ref={el => (navItemsRef.current[0] = el)}
              className="text-2xl font-['501'] text-black cursor-pointer hover:text-gray-800 transition-all duration-300 tracking-wider relative group"
            >
              RGB
              <span 
                className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                style={{
                  background: 'linear-gradient(90deg, #000, rgba(0, 0, 0, 0.5))'
                }}
              ></span>
            </h2>
          </Link>
        </motion.div>

        {/* Navigation - Desktop */}
        <div className="hidden font-['MO'] md:flex items-center gap-[2rem] space-x-20">
          {[
            { href: '/work', label: 'Work', index: 1 },
            { href: '/projects', label: 'Projects', index: 4 },
            { href: '/about', label: 'About', index: 2 },
            { href: '/contact', label: 'Contact', index: 3 }
          ].map((item) => (
            <motion.div 
              key={item.href}
              className="overflow-hidden"
              variants={navItemHover}
              initial="initial"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <Link href={item.href}>
                <p 
                  ref={el => (navItemsRef.current[item.index] = el)}
                  className="text-base font-['501'] text-black/80 cursor-pointer hover:text-black transition-all duration-300 relative group px-2 py-1"
                >
                  {item.label}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                    style={{
                      background: 'linear-gradient(90deg, #000, rgba(0, 0, 0, 0.5))'
                    }}
                  ></span>
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden overflow-hidden">
          <motion.div 
            ref={el => (navItemsRef.current[5] = el)}
            className="w-6 cursor-pointer group"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <div 
              className="w-full h-[2px] mb-1.5 transition-all duration-300 group-hover:bg-gray-800"
              style={{
                background: 'linear-gradient(90deg, #000, rgba(0, 0, 0, 0.5))'
              }}
            ></div>
            <div 
              className="w-full h-[2px] mb-1.5 transition-all duration-300 group-hover:bg-gray-800"
              style={{
                background: 'linear-gradient(90deg, #000, rgba(0, 0, 0, 0.5))'
              }}
            ></div>
            <div 
              className="w-full h-[2px] transition-all duration-300 group-hover:bg-gray-800"
              style={{
                background: 'linear-gradient(90deg, #000, rgba(0, 0, 0, 0.5))'
              }}
            ></div>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className="md:hidden fixed top-[78px] left-0 w-full h-0 overflow-hidden z-30 bg-black/90 backdrop-blur-lg opacity-0"
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {[
            { href: '/work', label: 'Work', index: 1 },
            { href: '/projects', label: 'Projects', index: 4 },
            { href: '/about', label: 'About', index: 2 },
            { href: '/contact', label: 'Contact', index: 3 }
          ].map((item, idx) => (
            <motion.div 
              key={item.href}
              className="overflow-hidden w-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link href={item.href} onClick={() => setIsOpen(false)}>
                <p className="text-xl font-zaft text-white/80 cursor-pointer hover:text-white transition-all duration-300 relative inline-block px-4 py-2">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 hover:w-full transition-all duration-300"></span>
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;