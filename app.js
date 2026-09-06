/**
 * MOONCRUST 3D — Interactive AI Emblem
 * Three.js Procedural Lunar & Cybernetic Core Engine
 */

window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') {
    console.error('Three.js belum berhasil dimuat.');
    return;
  }

  // ===== 1. SCENE, CAMERA & RENDERER SETUP =====
  const canvas = document.getElementById('webgl-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070c, 0.035);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0.8, 5.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // ===== 2. ORBIT CONTROLS =====
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.4;
  controls.minDistance = 2.5;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI / 1.5;

  // ===== 3. LIGHTING SETUP =====
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 5, 4);
  scene.add(keyLight);

  const lunarLight = new THREE.PointLight(0x00f0ff, 3.5, 25);
  lunarLight.position.set(-3, 2, 2);
  scene.add(lunarLight);

  const rimLight = new THREE.PointLight(0xa855f7, 3, 25);
  rimLight.position.set(3, -3, -3);
  scene.add(rimLight);

  const coreLight = new THREE.PointLight(0x00f0ff, 4.5, 6);
  scene.add(coreLight);

  // ===== 4. THEME PRESETS =====
  const THEMES = {
    'lunar-cyan': {
      primary: 0x00f0ff,
      secondary: 0x38bdf8,
      core: 0x00f0ff,
      crust: 0x1e293b,
      metalness: 0.88,
      roughness: 0.22
    },
    'solar-gold': {
      primary: 0xf59e0b,
      secondary: 0xfbbf24,
      core: 0xffd700,
      crust: 0x451a03,
      metalness: 0.92,
      roughness: 0.18
    },
    'cosmic-violet': {
      primary: 0xa855f7,
      secondary: 0xec4899,
      core: 0xd946ef,
      crust: 0x2e1065,
      metalness: 0.85,
      roughness: 0.25
    }
  };
  let activeTheme = THEMES['lunar-cyan'];

  // ===== 5. PROCEDURAL 3D MOONCRUST EMBLEM GENERATION =====
  const emblemGroup = new THREE.Group();
  scene.add(emblemGroup);

  // Function to create smooth 3D Crescent Moon Geometry
  function createCrescentMoonGeometry() {
    const shape = new THREE.Shape();
    const R_outer = 1.9;
    const R_inner = 1.55;
    const offset = 0.75;

    // Outer circle arc (from -PI/2 to PI/2)
    shape.absarc(0, 0, R_outer, -Math.PI * 0.52, Math.PI * 0.52, false);
    // Inner cutting arc back to origin
    shape.absarc(offset, 0, R_inner, Math.PI * 0.52, -Math.PI * 0.52, true);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.15,
      bevelThickness: 0.2
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }

  // Materials
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: activeTheme.primary,
    metalness: activeTheme.metalness,
    roughness: activeTheme.roughness,
    wireframe: true,
    transparent: true,
    opacity: 0.92
  });

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: activeTheme.secondary,
    emissive: activeTheme.core,
    emissiveIntensity: 0.6,
    metalness: 0.95,
    roughness: 0.1
  });

  const coreWireMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.primary,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });

  // 1. Primary Moon Mesh
  let primaryMoonMesh = new THREE.Mesh(createCrescentMoonGeometry(), moonMaterial);
  emblemGroup.add(primaryMoonMesh);

  // 2. Floating AI Core (In the cradle of the crescent)
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0.3, 0, 0);

  const innerCoreGeo = new THREE.IcosahedronGeometry(0.6, 2);
  const innerCoreMesh = new THREE.Mesh(innerCoreGeo, coreMaterial);
  coreGroup.add(innerCoreMesh);

  const outerCoreGeo = new THREE.OctahedronGeometry(0.85, 2);
  const outerCoreMesh = new THREE.Mesh(outerCoreGeo, coreWireMaterial);
  coreGroup.add(outerCoreMesh);

  emblemGroup.add(coreGroup);

  // 3. Orbital Lunar Rings
  const ringGroup = new THREE.Group();
  const ringGeo1 = new THREE.TorusGeometry(2.6, 0.022, 16, 120);
  const ringGeo2 = new THREE.TorusGeometry(2.85, 0.015, 16, 120);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: activeTheme.primary,
    transparent: true,
    opacity: 0.45
  });

  const ring1 = new THREE.Mesh(ringGeo1, ringMaterial);
  const ring2 = new THREE.Mesh(ringGeo2, ringMaterial);
  ring1.rotation.x = Math.PI / 2.2;
  ring2.rotation.y = Math.PI / 3;
  ringGroup.add(ring1);
  ringGroup.add(ring2);
  emblemGroup.add(ringGroup);

  // ===== 6. 2000 STARDUST LUNAR PARTICLES =====
  const particleCount = 2000;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 35;
    particlePositions[i + 1] = (Math.random() - 0.5) * 35;
    particlePositions[i + 2] = (Math.random() - 0.5) * 35;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: activeTheme.primary,
    size: 0.065,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const stardustSystem = new THREE.Points(particleGeo, particleMaterial);
  scene.add(stardustSystem);

  // ===== 7. MODE SWITCHER =====
  function setEmblemMode(mode) {
    primaryMoonMesh.geometry.dispose();

    if (mode === 'crescent') {
      primaryMoonMesh.geometry = createCrescentMoonGeometry();
      coreGroup.visible = true;
      ringGroup.visible = true;
    } else if (mode === 'full-moon') {
      primaryMoonMesh.geometry = new THREE.SphereGeometry(1.65, 48, 48);
      coreGroup.visible = false;
      ringGroup.visible = true;
    } else if (mode === 'eclipse') {
      primaryMoonMesh.geometry = new THREE.TorusKnotGeometry(1.4, 0.4, 128, 32);
      coreGroup.visible = true;
      ringGroup.visible = true;
    }
  }

  // ===== 8. THEME SWITCHER =====
  function setTheme(themeKey) {
    const t = THEMES[themeKey];
    if (!t) return;
    activeTheme = t;

    moonMaterial.color.setHex(t.primary);
    moonMaterial.metalness = t.metalness;
    moonMaterial.roughness = t.roughness;

    coreMaterial.color.setHex(t.secondary);
    coreMaterial.emissive.setHex(t.core);
    coreWireMaterial.color.setHex(t.primary);
    ringMaterial.color.setHex(t.primary);
    particleMaterial.color.setHex(t.primary);

    lunarLight.color.setHex(t.primary);
    rimLight.color.setHex(t.secondary);
    coreLight.color.setHex(t.core);
  }

  // ===== 9. UI CONTROL EVENT BINDINGS =====
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setEmblemMode(btn.dataset.mode);
    });
  });

  document.querySelectorAll('[data-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-theme]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setTheme(btn.dataset.theme);
    });
  });

  // Wireframe Toggle
  const toggleWireframeBtn = document.getElementById('toggleWireframe');
  toggleWireframeBtn?.addEventListener('click', () => {
    moonMaterial.wireframe = !moonMaterial.wireframe;
    toggleWireframeBtn.classList.toggle('active', moonMaterial.wireframe);
  });

  // Auto-Rotate Toggle
  const toggleRotateBtn = document.getElementById('toggleRotate');
  toggleRotateBtn?.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    toggleRotateBtn.classList.toggle('active', controls.autoRotate);
  });

  // Stardust Toggle
  const toggleStardustBtn = document.getElementById('toggleStardust');
  toggleStardustBtn?.addEventListener('click', () => {
    stardustSystem.visible = !stardustSystem.visible;
    toggleStardustBtn.classList.toggle('active', stardustSystem.visible);
  });

  // Panel Minimize / Close & Open Toggle
  const hudFooter = document.getElementById('hudFooter');
  const closePanelBtn = document.getElementById('closePanelBtn');
  const openPanelBtn = document.getElementById('openPanelBtn');

  closePanelBtn?.addEventListener('click', () => {
    hudFooter?.classList.add('minimized');
    openPanelBtn?.classList.add('show');
  });

  openPanelBtn?.addEventListener('click', () => {
    hudFooter?.classList.remove('minimized');
    openPanelBtn?.classList.remove('show');
  });

  // Lunar Gravitational Pulse on Canvas Tap
  let pulse = 1;
  window.addEventListener('pointerdown', (e) => {
    if (e.target === canvas) {
      pulse = 1.25;
      coreMaterial.emissiveIntensity = 1.8;
    }
  });

  // ===== 10. ANIMATION LOOP & FPS COUNTER =====
  let lastTime = performance.now();
  let frameCount = 0;
  const fpsEl = document.getElementById('fpsCounter');

  function animate(currentTime) {
    requestAnimationFrame(animate);

    frameCount++;
    if (currentTime >= lastTime + 1000) {
      if (fpsEl) fpsEl.textContent = `${frameCount} FPS`;
      frameCount = 0;
      lastTime = currentTime;
    }

    const time = currentTime * 0.001;

    // Smooth pulse decay
    pulse += (1 - pulse) * 0.07;
    emblemGroup.scale.set(pulse, pulse, pulse);

    coreMaterial.emissiveIntensity += (0.6 - coreMaterial.emissiveIntensity) * 0.05;

    // AI Core Counter-rotations
    innerCoreMesh.rotation.y += 0.02;
    innerCoreMesh.rotation.x += 0.015;
    outerCoreMesh.rotation.y -= 0.012;
    outerCoreMesh.rotation.z += 0.01;

    // Orbital Rings Rotations
    ring1.rotation.z += 0.008;
    ring2.rotation.x += 0.006;

    // Gentle Lunar Floating Motion
    emblemGroup.position.y = Math.sin(time * 1.6) * 0.12;

    // Stardust Slow Cosmic Drift
    stardustSystem.rotation.y = time * 0.025;
    stardustSystem.rotation.x = Math.sin(time * 0.01) * 0.04;

    coreLight.position.copy(coreGroup.position);

    controls.update();
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);

  // ===== 11. RESPONSIVE RESIZE =====
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});
