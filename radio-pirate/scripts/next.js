document.addEventListener("DOMContentLoaded", function () {
  // Ensure Three.js is loaded
  if (!window.THREE) {
    console.error("Three.js is not loaded");
    return;
  }

  let camera, scene, renderer, model;
  let container = document.getElementById("next");

  if (!container) {
    console.error("Container element not found");
    return;
  }

  // Add click event listener to navigate
  container.addEventListener("click", function() {
    window.location.href = "https://wddc-slipknot.webflow.io/performances/teller";
  });

  let clock = new THREE.Clock();
  // Set up renderer
  const width = container.clientWidth;
  // Check for mobile devices and set appropriate height
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const height = isMobile ? (container.clientHeight || 200) : (container.clientHeight || 400); // Use clientHeight with fallback to 200px for mobile
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
    "https://rcrdme-gnmr.netlify.app/blender-exp/teller.glb",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(10, 10, 10);
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, Math.PI / 2);
      scene.add(model);
    },
    undefined,
    function (e) {
      console.error("Error loading model:", e);
    }
  );

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Responsive
  window.addEventListener("resize", function () {
    const w = container.clientWidth;
    const isMobile = window.matchMedia("(max-width: 428px)").matches;
    const h = isMobile ? (container.clientHeight || 200) : (container.clientHeight || 400); // Use clientHeight with fallback to 200px for mobile
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
