/**
 * three-face.js — GLB loader, larger head, no rotation
 * Head follows cursor (subtle tilt), static otherwise.
 */
(function () {
  'use strict';

  function init() {
    if (typeof THREE === 'undefined') { setTimeout(init, 50); return; }

    const canvas = document.getElementById('threeCanvas');
    const label  = document.getElementById('figureLabel');
    if (!canvas) return;

    const W = 480, H = 640;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, W / H, 0.01, 1000);
    camera.position.set(0, 0.04, 2.8);

    // Lights
    scene.add(new THREE.AmbientLight(0xf5f2ee, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(1.2, 2, 2.2); scene.add(key);
    const fill = new THREE.DirectionalLight(0xd0c8be, 0.8);
    fill.position.set(-2, 0.4, 1); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.4);
    rim.position.set(0, -1.2, -2); scene.add(rim);

    let headGroup = null;
    let isLoaded  = false;
    let mouseX = 0, mouseY = 0;
    let curRX = 0, curRY = 0;

    // Load GLTFLoader from CDN
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    s.onload = loadGLB;
    s.onerror = () => { if (label) label.textContent = 'Model Error'; };
    document.head.appendChild(s);

    function loadGLB() {
      const loader = new THREE.GLTFLoader();
      loader.load(
        'assets/3d/face.glb',
        function (gltf) {
          const model = gltf.scene;

          // Center model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Scale to fill the canvas nicely — larger
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          model.scale.setScalar(1.4 / maxDim);

          // Re-centre after scale
          const box2 = new THREE.Box3().setFromObject(model);
          model.position.sub(box2.getCenter(new THREE.Vector3()));

          // Keep original materials, just tweak roughness
          model.traverse(child => {
            if (child.isMesh) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach(m => {
                m.roughness  = Math.min(m.roughness  != null ? m.roughness  : 0.6, 0.72);
                m.metalness  = Math.min(m.metalness  != null ? m.metalness  : 0.0, 0.05);
                m.needsUpdate = true;
              });
            }
          });

          headGroup = new THREE.Group();
          headGroup.add(model);
          scene.add(headGroup);

          isLoaded = true;
          if (label) {
            label.classList.add('hidden');
            setTimeout(() => { if (label.parentNode) label.remove(); }, 600);
          }
        },
        undefined,
        err => { console.warn('GLB load error', err); if (label) label.textContent = '3D Model'; }
      );
    }

    // Cursor tracking — subtle tilt, NO auto spin
    document.addEventListener('mousemove', e => {
      mouseX =  (e.clientX / window.innerWidth  - 0.5) * 0.22;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.15;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (isLoaded && headGroup) {
        curRX += (mouseY - curRX) * 0.045;
        curRY += (mouseX - curRY) * 0.045;
        headGroup.rotation.x = curRX;
        headGroup.rotation.y = curRY;
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
