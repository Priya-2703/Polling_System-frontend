// ThreeBackground.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  // ===== CONTROL VARIABLES - Adjust these to change the glow =====
  const GLOW_OPACITY = 0.1;        // 0.0 to 1.0
  const GLOW_SIZE = 25;            // Size of the blurred circle
  const GLOW_POSITION_X = 14;     // Match x position with your core
  const GLOW_POSITION_Y = 0;      // Match y position with your core
  const GLOW_POSITION_Z = -10;     // Far behind particles
  const GLOW_COLOR = 0x00f7ff;     // Cyan color hex
  // ==============================================================

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.002);

    // Canvas and renderer
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;
    
    // Create the 2D blurred circle glow
    const createBlurredCircleGlow = () => {
      // Create a canvas with high resolution for better blur quality
      const canvas = document.createElement('canvas');
      canvas.width = 512;  // Higher resolution for better blur
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Convert hex color to RGB for gradient
      const r = (GLOW_COLOR >> 16) & 255;
      const g = (GLOW_COLOR >> 8) & 255;
      const b = GLOW_COLOR & 255;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a radial gradient for smooth falloff
      const gradient = ctx.createRadialGradient(
        256, 256, 0,      // Inner circle at center
        256, 256, 256     // Outer circle to edge
      );
      
      // Gradient with very soft edges - more stops for smoother falloff
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);      // Center: solid
      gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.8)`);  // Near center: mostly solid
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`);  // Middle: fading
      gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.05)`); // Edge: almost gone
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);      // Outside: transparent
      
      // Fill circle with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply a slight blur to soften the edge even more (if supported)
      try {
        ctx.filter = 'blur(20px)';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // Browser may not support canvas blur filter
        console.log("Canvas blur not supported, using gradient only");
      }
      
      // Create a texture from the canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      // Create a sprite material with the texture
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: GLOW_OPACITY,
        blending: THREE.AdditiveBlending,
        depthTest: false, // Important to ensure it shows behind everything
      });
      
      // Create a sprite (always facing camera)
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(GLOW_SIZE, GLOW_SIZE, 1);
      
      return { sprite, material: spriteMaterial };
    };
    
    // Create and add the background glow
    const { sprite: backgroundGlow, material: glowMaterial } = createBlurredCircleGlow();
    backgroundGlow.position.set(GLOW_POSITION_X, GLOW_POSITION_Y, GLOW_POSITION_Z);
    backgroundGlow.renderOrder = -1000; // Ensure it's rendered behind everything
    scene.add(backgroundGlow);
    
    // Particles (The Ether) - will be in front of the glow
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    // Material for particles
    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    particlesMesh.renderOrder = 0; // Render after glow
    scene.add(particlesMesh);

    // Create a separate group for the glow effects
    const glowGroup = new THREE.Group();
    glowGroup.renderOrder = 10; // Render after particles
    scene.add(glowGroup);
    
    // Add a point light at the center to enhance the glow effect
    const coreLight = new THREE.PointLight(GLOW_COLOR, 2, 8);
    coreLight.position.set(GLOW_POSITION_X, GLOW_POSITION_Y, GLOW_POSITION_Z + 5);
    glowGroup.add(coreLight);

    // Position based on screen size
    if (window.innerWidth < 768) {
      glowGroup.position.set(0, 1.5, -1);
      glowGroup.scale.set(0.6, 0.6, 0.6);
      backgroundGlow.position.set(0, 1.5, -10);
    } else {
      glowGroup.position.set(4.5, 0, -1);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Rotate Particles
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      // Interactive movement
      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      // Subtle pulsing for the background glow
      const glowPulse = 1 + Math.sin(elapsedTime * 0.4) * 0.08;
      backgroundGlow.scale.set(
        GLOW_SIZE * glowPulse, 
        GLOW_SIZE * glowPulse, 
        1
      );
      
      // Also animate glow opacity for more life
      glowMaterial.opacity = GLOW_OPACITY * (0.85 + Math.sin(elapsedTime * 0.5) * 0.15);
      
      // Also pulse the light intensity
      coreLight.intensity = 2 + Math.sin(elapsedTime * 1.2) * 0.5;

      // Render
      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    let animationFrameId = window.requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Update positions based on screen size
      if (window.innerWidth < 768) {
        glowGroup.position.set(0, 1.5, -1);
        glowGroup.scale.set(0.6, 0.6, 0.6);
        backgroundGlow.position.set(0, 1.5, -10);
      } else {
        glowGroup.position.set(4.5, -1.5, -1);
        glowGroup.scale.set(1, 1, 1);
        backgroundGlow.position.set(GLOW_POSITION_X, GLOW_POSITION_Y, GLOW_POSITION_Z);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);

      // Dispose resources
      particlesGeometry.dispose();
      material.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60"
    />
  );
};

export default ThreeBackground;