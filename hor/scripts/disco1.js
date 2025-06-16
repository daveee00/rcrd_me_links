document.addEventListener("DOMContentLoaded", function() {
  // Ensure Three.js is loaded
  if (!window.THREE) {
    console.error("Three.js not loaded");
    return;
  }
  let camera, scene, renderer, model;
  let container = document.getElementById("disco-1");
  if (!container) {
    console.error("Container #disco-1 not found");
    return;
  }
  let clock = new THREE.Clock();
  // Set up renderer
  const width = container.clientWidth;
  const height = container.clientHeight || 400; // fallback height
  camera = new THREE.PerspectiveCamera(25, width / height, 0.25, 200);
  camera.position.set(-63, 0, 20);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  hemiLight.position.set(10, 0, 10);
  scene.add(hemiLight);

  // Model loader
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://cdn.jsdelivr.net/gh/daveee00/export_blender/ghost-endovena.glb", // <-- update this path if needed
    function (gltf) {
      model = gltf.scene;
      model.scale.set(11, 11, 11);
      model.position.set(0, 0, 0);
      model.rotation.set(Math.PI / 2, 0, Math.PI / 2); // 90deg in radians
      scene.add(model);

      // Add click event to the model
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      function onClick(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObject(model, true);

        if (intersects.length > 0) {
          window.open('#', '_blank');
        }
      }

      container.addEventListener('click', onClick);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Responsive
  window.addEventListener("resize", function () {
    const w = container.clientWidth;
    const h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  // Animation loop: rotate model
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      // Create a smooth oscillation using sine wave
      // Using clock.getElapsedTime() for consistent timing
      // Math.PI/4 (45 degrees) as the amplitude of oscillation
      model.rotation.z =
        Math.PI / 2 + (Math.sin(clock.getElapsedTime() * 0.5) * Math.PI) / 6;
    }
    renderer.render(scene, camera);
  }
  animate();
});
