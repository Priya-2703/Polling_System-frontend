// src/Components/DigitalGlobeBackground.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DigitalGlobeBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // ============ RESPONSIVE SETTINGS ============
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Adjust sizes based on device
    const settings = {
      globeSize: isMobile ? 2 : isTablet ? 1.6 : 2,
      wireframeSize: isMobile ? 1.21 : isTablet ? 1.61 : 2.01,
      particlesCount: isMobile ? 450 : isTablet ? 250 : 400,
      particlesMinRadius: isMobile ? 2 : isTablet ? 2 : 2.5,
      particlesSpread: isMobile ? 2 : isTablet ? 1.8 : 2,
      pointSize: isMobile ? 0.02 : 0.02,
      particleSize: isMobile ? 0.013 : 0.015,
      cameraZ: isMobile ? 4.5 : isTablet ? 4.5 : 4,
      cameraY: isMobile ? 0.1 : 0.5,
      globeDetail: isMobile ? 3 : 4, // Lower detail on mobile for performance
      wireframeDetail: isMobile ? 0 : 1,
      opacity: isMobile ? 0.5 : 0.6,
    };

    // ============ SCENE SETUP ============
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.002);

    // ============ CAMERA ============
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = settings.cameraZ;
    camera.position.y = settings.cameraY;

    // ============ RENDERER ============
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    ); // Limit pixel ratio on mobile
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ============ GROUP TO HOLD GLOBE ELEMENTS ============
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Position globe lower on mobile so it doesn't obstruct content
    if (isMobile) {
      globeGroup.position.y = -0.2; // Move down
    }

    // ============ 1. DIGITAL GLOBE (Points) ============
    const geometry = new THREE.IcosahedronGeometry(
      settings.globeSize,
      settings.globeDetail
    );

    const pointsMat = new THREE.PointsMaterial({
      size: settings.pointSize,
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: settings.opacity,
      sizeAttenuation: true,
    });

    const pointsMesh = new THREE.Points(geometry, pointsMat);
    globeGroup.add(pointsMesh);

    // ============ 2. CONNECTING LINES (Network Wireframe) ============
    const wireGeo = new THREE.IcosahedronGeometry(
      settings.wireframeSize,
      settings.wireframeDetail
    );
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.03 : 0.05,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // ============ 3. FLOATING DATA PACKETS (Orbiting Particles) ============
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(settings.particlesCount * 3);

    for (let i = 0; i < settings.particlesCount; i++) {
      const r =
        settings.particlesMinRadius + Math.random() * settings.particlesSpread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: settings.particleSize,
      color: 0xa78bfa, // Light Violet
      transparent: true,
      opacity: isMobile ? 0.3 : 0.4,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    globeGroup.add(particlesMesh);

    // ============ INTERACTION VARIABLES ============
    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // ============ EVENT HANDLERS ============
    const handleMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX - windowHalfX;
        mouseY = event.touches[0].clientY - windowHalfY;
      }
    };

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // ============ ANIMATION LOOP ============
    const clock = new THREE.Clock();

    // Reduce animation speed on mobile for smoother performance
    const rotationSpeed = isMobile ? 0.0008 : 0.001;
    const breathingSpeed = isMobile ? 1.5 : 2;
    const breathingAmount = isMobile ? 0.003 : 0.005;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      const targetX = mouseX * (isMobile ? 0.0003 : 0.0005);
      const targetY = mouseY * (isMobile ? 0.0003 : 0.0005);

      // Rotate Globe constantly
      globeGroup.rotation.y += rotationSpeed;

      // Add "breathing" effect to points
      pointsMat.size =
        settings.pointSize +
        Math.sin(elapsedTime * breathingSpeed) * breathingAmount;

      // Mouse Interaction Easing
      globeGroup.rotation.y += 0.05 * (targetX - globeGroup.rotation.y);
      globeGroup.rotation.x += 0.05 * (targetY - globeGroup.rotation.x);

      // Rotate particle ring separately
      particlesMesh.rotation.y = -elapsedTime * (isMobile ? 0.03 : 0.05);
      particlesMesh.rotation.z = elapsedTime * (isMobile ? 0.01 : 0.02);

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ============ CLEANUP ============
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }

      geometry.dispose();
      pointsMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        opacity: 0.6,
      }}
    />
  );
};

export default DigitalGlobeBackground;
