(function () {
  // Ensure Three.js is loaded
  if (!window.THREE) return;
  let camera, scene, renderer, model;
  let container = document.getElementById("brano");
  let clock = new THREE.Clock();
  // Set up renderer
  const width = container.clientWidth;
  const height = container.clientHeight || 400; // fallback height
  camera = new THREE.PerspectiveCamera(35, width / height, 0.25, 200);
  camera.position.set(-63, 0, 20);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();
  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
  hemiLight.position.set(10, 0, 10);
  scene.add(hemiLight);


  // Model loader
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://cdn.jsdelivr.net/gh/daveee00/export_blender/westphalia.glb", // <-- update this path if needed
    function (gltf) {
      model = gltf.scene;
      model.scale.set(6, 6, 6);
      model.position.set(0, 0, 0);
      model.rotation.set(Math.PI / 2, 0, Math.PI / 2); // 90deg in radians
      scene.add(model);
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
      model.rotation.y -= 0.01;
    }
    renderer.render(scene, camera);
  }
  animate();
})();
