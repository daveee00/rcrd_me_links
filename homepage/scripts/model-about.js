(function () {
  // Ensure Three.js is loaded
  if (!window.THREE) return;
  let camera, scene, renderer, model;
  let container = document.getElementById("back-home");
  let clock = new THREE.Clock();

  // Set up renderer first
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Make canvas fill container
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';

  // Function to update sizes
  function updateSizes() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Update camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(width, height);
  }

  // Set up camera and scene
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera = new THREE.PerspectiveCamera(35, width / height, 0.25, 200);
  camera.position.set(-63, 0, 20);
  camera.lookAt(0, 0, 0);
  scene = new THREE.Scene();

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  hemiLight.position.set(10, 0, 10);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-10, 1, 10);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight2.position.set(0, 1, -20);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight3.position.set(0, 1, 20);
  scene.add(dirLight3);

  // Model loader
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://cdn.jsdelivr.net/gh/daveee00/export_blender/record_me_logo_newer.glb",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(7, 7, 7);
      model.position.set(0, 0, 0);
      model.rotation.set(0, Math.PI / 2, 0);
      scene.add(model);
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );

  // Responsive
  window.addEventListener("resize", updateSizes);
  
  // Initial size update
  updateSizes();

  // Animation loop: rotate model
  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y = Math.PI/2 + Math.sin(clock.getElapsedTime() * 0.5) * Math.PI/4;
    }
    renderer.render(scene, camera);
  }
  animate();
})();
