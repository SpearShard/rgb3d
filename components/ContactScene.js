'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Sphere, Box, MeshDistortMaterial, Text, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function AnimatedSphere({ mouse }) {
  const sphereRef = useRef();
  const [color, setColor] = useState(new THREE.Color('#ff0000'));
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      // Subtle mouse following
      sphereRef.current.position.x = lerp(sphereRef.current.position.x, mouse.x * 0.1, 0.03);
      sphereRef.current.position.y = lerp(sphereRef.current.position.y, mouse.y * 0.1, 0.03);
      
      // Very subtle rotation
      sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
      sphereRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.2) * 0.1;
      
      // RGB color cycling
      const t = clock.getElapsedTime() * 0.5;
      const r = Math.sin(t) * 0.5 + 0.5;
      const g = Math.sin(t + Math.PI * 2/3) * 0.5 + 0.5;
      const b = Math.sin(t + Math.PI * 4/3) * 0.5 + 0.5;
      setColor(new THREE.Color(r, g, b));
    }
  });

  return (
    <group>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere ref={sphereRef} args={[1, 128, 128]} scale={2}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            opacity={0.9}
            transparent
            envMapIntensity={1}
          />
        </Sphere>
        
        {/* RGB accent lights */}
        <pointLight position={[2, 0, 2]} color="#ff0000" intensity={0.5} distance={6} />
        <pointLight position={[-2, 1, -2]} color="#00ff00" intensity={0.5} distance={6} />
        <pointLight position={[0, -2, -1]} color="#0000ff" intensity={0.5} distance={6} />
      </Float>
    </group>
  );
}

function FloatingElements() {
  const groupRef = useRef();
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    // RGB theme colors
    const rgbColors = [
      new THREE.Color('#ff0000'), // Red
      new THREE.Color('#00ff00'), // Green
      new THREE.Color('#0000ff')  // Blue
    ];
    
    const newLines = [...Array(15)].map((_, i) => ({
      id: i,
      start: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      end: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      color: rgbColors[i % rgbColors.length]
    }));
    setLines(newLines);
  }, []);
  
  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      // Very subtle rotation
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
      groupRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.05) * 0.1;
      
      // Minimal mouse influence
      groupRef.current.position.x = mouse.x * 0.05;
      groupRef.current.position.y = mouse.y * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line) => (
        <group key={line.id}>
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...line.start, ...line.end])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={line.color} opacity={0.2} transparent linewidth={1} />
          </mesh>
        </group>
      ))}
      
      {/* Minimal text elements */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <Text
          position={[2, 1, 0]}
          fontSize={0.3}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          font="/fonts/NeueMetanaNext-SemiBold.otf"
        >
          Contact
        </Text>
      </Float>
    </group>
  );
}

export default function ContactScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'transparent'
      }}
      dpr={[1, 2]}
    >
      {/* Ambient light reduced to make RGB effects more visible */}
      <ambientLight intensity={0.1} />
      
      {/* Repositioned main lights for better RGB interaction */}
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />
      <spotLight 
        position={[-10, -10, -10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={0.4}
        color="#ffffff"
      />
      
      <AnimatedSphere mouse={mousePosition} />
      <FloatingElements />
    </Canvas>
  );
}
