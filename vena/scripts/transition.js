document.addEventListener('DOMContentLoaded', function() {
  // Ensure Three.js is loaded
  if (!window.THREE) {
    console.error('Three.js is not loaded');
    return;
  }
  
  let camera, scene, renderer, model;
  let container = document.getElementById("transition-container");
  
  if (!container) {
    console.error('Container element not found');
    return;
  }

  // Mobile device parameters
  const isMobile = window.innerWidth <= 1000;
  const mobileParams = {
    cameraFOV: 45,
    cameraZ: 35,
    modelScale: 7,
    modelZ: -6
  };
  const desktopParams = {
    cameraFOV: 35,
    cameraZ: 45,
    modelScale: 10,
    modelZ: -8
  };
  const params = isMobile ? mobileParams : desktopParams;
  
  // Set up renderer
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera = new THREE.PerspectiveCamera(params.cameraFOV, width / height, 0.25, 200);
  camera.position.set(0, 0, params.cameraZ);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
  dirLight.position.set(0, 0, 10);
  scene.add(dirLight);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  container.appendChild(renderer.domElement);

  // Load the model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://rcrdme-gnmr.netlify.app/blender-exp/vena.glb",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(params.modelScale, params.modelScale, params.modelScale);
      // Start above the viewport
      model.position.set(0, 10, params.modelZ);
      // Set initial rotation (0deg, 180deg, 90deg)
      model.rotation.set(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(180),
        THREE.MathUtils.degToRad(90)
      );
      scene.add(model);

      // Animate model dropping into place and rotating
      const animDuration = isMobile ? 1.5 : 2;
      gsap.to(model.position, {
        y: isMobile ? 0.5 : 1,
        duration: animDuration,
        ease: "power2.out"
      });
      gsap.to(model.rotation, {
        y: THREE.MathUtils.degToRad(90),
        duration: animDuration,
        ease: "power2.out",
        onComplete: () => {
          // Wait 1 second, then fade out the container
          setTimeout(() => {
            gsap.to(container, {
              opacity: 0,
              duration: 1,
              ease: "power2.out",
              onComplete: () => {
                if (container.parentNode) {
                  container.parentNode.removeChild(container);
                }
              }
            });
          }, 500);
        }
      });
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  // Handle window resize
  function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", onWindowResize);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}); 
