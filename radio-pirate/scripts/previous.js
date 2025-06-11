document.addEventListener('DOMContentLoaded', function() {
  // Ensure Three.js is loaded
  if (!window.THREE) {
    console.error('Three.js is not loaded');
    return;
  }
  
  let camera, scene, renderer, model;
  let container = document.getElementById("previous");
  
  if (!container) {
    console.error('Container element not found');
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
    "https://cdn.jsdelivr.net/gh/daveee00/export_blender/vena.glb",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(10, 10, 10);
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, Math.PI / 2);
      scene.add(model);
    },
    undefined,
    function (e) {
      console.error('Error loading model:', e);
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
      model.rotation.y += 0.007;
    }
    renderer.render(scene, camera);
  }
  animate();
});
