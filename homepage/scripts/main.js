(function () {
  function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    const loadingText = document.querySelector(".loading-text");
    if (loadingText) {
      loadingText.style.opacity = "0";
    }
    setTimeout(() => {
      if (overlay) {
        overlay.style.opacity = "0";
        document.body.classList.add("loaded");
        setTimeout(() => {
          overlay.style.display = "none";
        }, 800);
      }
    }, 300);
  }
  function initWebflowViewer() {
    // Force scroll to top immediately when the page loads
    window.scrollTo(0, 0);

    let camera, scene, renderer;
    let container, clock;
    let lastScrollY = 0; // Reset lastScrollY to 0
    let isScrollingEnabled = false;
    let modelsOriginalPositions = [];
    const loadedModels = [];
    const rotationSpeed = 1;
    let loadedModelCount = 0;

    // Mobile device parameters
    const isMobile = window.innerWidth <= 1000;
    const mobileParams = {
      cameraFOV: 45,
      cameraZ: 35,
      modelScale: 7,
      modelSpacing: 2,
      modelZ: -6,
      hoverScale: 8,
      selectedScale: 15,
      rotationSpeed: 0.5,
    };
    const desktopParams = {
      cameraFOV: 35,
      cameraZ: 45,
      modelScale: 10,
      modelSpacing: 3,
      modelZ: -8,
      hoverScale: 11,
      selectedScale: 20,
      rotationSpeed: 0.5,
    };
    const params = isMobile ? mobileParams : desktopParams;

    // Reset any existing scroll position
    if (window.history && window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    // Ensure we're at the top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // MODELS TO LOAD
    const modelsToLoad = [
      "https://rcrdme-gnmr.netlify.app/blender-exp/clubdervisionere.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/elsewhere.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/vena.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/forthecause.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/goa.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/haudio.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/hor.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/lesenfants.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/thelotradio.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/radiopirate.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/teller.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/teknobirrette.glb",
    ];
    // PAGE LINKS
    const pageLinks = [
      "/performances/club-der-visionaire",
      "https://wddc-slipknot.webflow.io/performances/elsewhere-seoul",
      "https://wddc-slipknot.webflow.io/performances/endovena-festival",
      "https://wddc-slipknot.webflow.io/performances/for-the-cause",
      "/performances/goa-last-dance",
      "/performances/haudio",
      "https://wddc-slipknot.webflow.io/performances/hor",
      "/performances/les-elephants",
      "/performances/lot-radio",
      "https://wddc-slipknot.webflow.io/performances/radio-pirate",
      "/performances/teller",
      "https://wddc-slipknot.webflow.io/performances/tekno-birrette",
    ];

    // backgrounds for active page
    const vinylBackground = [
      "linear-gradient(270deg, #EEDC9A, #F5EEC0, #D6BB7D)",
      "linear-gradient(270deg, #5614ca, #8f4dff, #3600a3)",
      "linear-gradient(270deg, #ECE7DC, #ffffff, #dcd4c0)",
      "linear-gradient(270deg, #FE6845, #fcb199, #ff2e00)",
      "linear-gradient(270deg, #5270E5, #88a2ff, #1e3acc)",
      "linear-gradient(270deg, #1e1e1e, #3a3a3a, #0a0a0a)",
      "linear-gradient(270deg, #A6F30D, #d6ff63, #84c900)",
      "linear-gradient(270deg, #FF0101, #ff6b6b, #a10000)",
      "linear-gradient(270deg, #332879, #5942b1, #1a154e)",
      "linear-gradient(270deg, #fed52a, #ffe788, #ffc400)",
      "linear-gradient(270deg, #9223A8, #c758e2, #670078)",
      "linear-gradient(270deg, #0C82A1, #3fc8f2, #00475a)",
    ];

    //titoli-performance

    const title_performance = [
      "CLUB DER VISIONERE",
      "ELSEWHERE",
      "VENA",
      "FOR THE CAUSE",
      "GOA",
      "HAUDIO",
      "HOR",
      "LES ENFANTS",
      "THE LOT RADIO",
      "RADIO PIRATE",
      "TELLER",
      "TECKNO BIRRETTE",
    ];

    const data_luogo = [
      "00.00.2020, Berlino",
      "15.03.2025, Bangkok",
      "02.05.2023-05.05.2023, Marocco",
      "29.03.2020, Melbourne",
      "04.04.2008, Roma // 08.11.2021, Roma",
      "15.04.2024, Rimini",
      "04.03.2025, Berlino",
      "25.08.2023, Barcellona",
      "14.02.2025, NYC",
      "15.08.2024, Parigi",
      "14.03.2025, Seoul",
      "03.06.2023, Padova",
    ];

    const in_construction = [
      "https://rcrdme-gnmr.netlify.app/blender-exp/clubdervisionere.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/goa.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/teller.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/thelotradio.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/haudio.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/vena.glb",
      "https://rcrdme-gnmr.netlify.app/blender-exp/lesenfants.glb",
    ];

    const videoBG = [
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/backgrounds/elsewhere.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/backgrounds/ftc.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/backgrounds/hor.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/backgrounds/pirate.mp4",
      "https://rcrdme-gnmr.netlify.app/homepage/videobg-dark-grey.mp4",
      "https://rcrdme-gnmr.netlify.app/backgrounds/tekno.mp4",
    ];

    // Add raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredModel = null;
    let originalModelStates = [];
    let isModelClicked = false;
    function checkAllModelsLoaded() {
      loadedModelCount++;
      if (loadedModelCount === modelsToLoad.length) {
        const loadingText = document.querySelector(".loading-text");
        if (loadingText) {
          loadingText.textContent = "Loading complete!";
        }
        setTimeout(hideLoadingOverlay, 500);
      }

      //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    }
    function loadModels(modelPaths) {
      const loader = new THREE.GLTFLoader();
      modelPaths.forEach((path, index) => {
        loader.load(
          path,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(
              params.modelScale,
              params.modelScale,
              params.modelScale
            );
            const baseY = -index * params.modelSpacing;
            model.position.set(0, baseY, params.modelZ);
            model.userData.baseY = baseY;
            model.userData.offset = index * 0.3;
            model.userData.originalIndex = index;
            model.userData.modelName = `Model ${index + 1} (${path
              .split("/")
              .pop()})`;
            model.rotation.set(
              THREE.MathUtils.degToRad(0),
              THREE.MathUtils.degToRad(180),
              THREE.MathUtils.degToRad(0)
            );
            scene.add(model);
            loadedModels.push(model);
            checkAllModelsLoaded();
          },
          (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            const loadingText = document.querySelector(".loading-text");
            if (loadingText) {
              loadingText.textContent = `Loading... ${Math.round(
                percentComplete
              )}%`;
            }
          },
          (e) => {
            console.error(`Error loading ${path}`, e);
            checkAllModelsLoaded();
          }
        );
      });
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function animate() {
      const time = clock.getElapsedTime();
      const dt = clock.getDelta();
      loadedModels.forEach((model) => {
        if (!isModelClicked) {
          const offset = model.userData.offset || 0;
          model.rotation.y =
            THREE.MathUtils.degToRad(180) +
            THREE.MathUtils.degToRad(15 * Math.sin(time * 1.4 - offset));
        }
      });
      renderer.render(scene, camera);
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function onWindowResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      checkContainerPosition();
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function checkContainerPosition() {
      const rect = container.getBoundingClientRect();
      const stickyWrapper = container.closest(".sticky-wrapper");
      const wrapperRect = stickyWrapper.getBoundingClientRect();
      const isWrapperInView =
        wrapperRect.top <= 0 && wrapperRect.bottom > window.innerHeight;
      const wasEnabled = isScrollingEnabled;
      isScrollingEnabled = isWrapperInView;
      if (!wasEnabled && isScrollingEnabled) {
        console.log("Container in position, scrolling enabled");
        lastScrollY = window.scrollY;
        if (modelsOriginalPositions.length === 0) {
          loadedModels.forEach((model) => {
            modelsOriginalPositions.push({
              model: model,
              y: model.position.y,
            });
          });
        }
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function handleScroll() {
      checkContainerPosition();
      if (isScrollingEnabled) {
        const currentScrollY = window.scrollY;
        const scrollDiff = (currentScrollY - lastScrollY) / 50;
        loadedModels.forEach((model) => {
          model.position.y += scrollDiff;
        });
        lastScrollY = currentScrollY;
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    /*blocco di codice da controllare se funziona*/
    function createActivePage() {
      // Remove any existing page-active first
      const existingPageActive = document.getElementById("page-active");
      if (existingPageActive) {
        existingPageActive.remove();
      }

      const pageActive = document.createElement("div");
      pageActive.id = "page-active";
      pageActive.style.position = "fixed";
      pageActive.style.top = "0";
      pageActive.style.left = "0";
      pageActive.style.width = "100vw";
      pageActive.style.height = window.innerWidth <= 428 ? "96vh" : "100vh";
      pageActive.style.zIndex = "11";
      pageActive.style.background = "none";
      pageActive.style.pointerEvents = "none";
      const closeBtn = document.createElement("button");
      const closeIcon = document.createElement("img");
      closeIcon.src =
        "https://cdn.jsdelivr.net/gh/daveee00/export_blender/close-button.svg";
      closeIcon.style.width = "24px";
      closeIcon.style.height = "24px";
      closeBtn.appendChild(closeIcon);
      closeBtn.id = "close";
      closeBtn.style.position = "fixed";
      closeBtn.style.top = "0";
      closeBtn.style.left = "0";
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.padding = "32px";
      closeBtn.style.opacity = "0.5";
      closeBtn.style.transition = "opacity 300ms ease-out";
      closeBtn.style.pointerEvents = "auto";
      closeBtn.style.zIndex = "12";
      closeBtn.addEventListener("mouseover", () => {
        closeBtn.style.opacity = "1";
      });
      closeBtn.addEventListener("mouseout", () => {
        closeBtn.style.opacity = "0.5";
      });
      closeBtn.addEventListener("click", handleClose);
      pageActive.appendChild(closeBtn);
      document.body.appendChild(pageActive);
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function storeModelStates() {
      originalModelStates = loadedModels.map((model) => ({
        model: model,
        position: model.position.clone(),
        rotation: model.rotation.clone(),
      }));
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function createNavigationButton(originalIndex) {
      const button = document.createElement("a");
      button.id = "go_to_page_button";
      button.href = pageLinks[originalIndex];
      button.style.position = "fixed";
      button.style.width = isMobile ? "70%" : "50%";
      button.style.aspectRatio = "1/1";
      button.style.zIndex = "6";
      button.style.left = "50%";
      button.style.top = "50%";
      button.style.transform = "translate(-50%, -50%)";
      button.style.cursor = "none";
      document.body.appendChild(button);

      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Button clicked");
        console.log("Target URL:", button.href);
        const activeModel = loadedModels.find(
          (model) =>
            model.position.x === 0 &&
            model.position.y === 0 &&
            model.position.z === 0
        );
        if (activeModel) {
          console.log("Active model found");
          gsap.to(camera.position, {
            z: 0.1,
            duration: isMobile ? 1 : 1.5,
            ease: "power2.in",
          });
          gsap.to(activeModel.scale, {
            x: params.selectedScale,
            y: params.selectedScale,
            z: params.selectedScale,
            duration: isMobile ? 1 : 1.5,
            ease: "power2.in",
          });
          gsap.to(activeModel.rotation, {
            y: activeModel.rotation.y + THREE.MathUtils.degToRad(360),
            duration: isMobile ? 1 : 1.5,
            ease: "power2.in",
          });
          // Remove writing animation before navigation
          const writingContainer = document.getElementById("writing-container");
          if (writingContainer) {
            writingContainer.remove();
          }
          // Add a check to ensure the URL exists before navigating
          const targetUrl = button.href;
          console.log("Checking URL:", targetUrl);
          // Try to navigate directly first
          try {
            console.log("Attempting to navigate to:", targetUrl);
            window.location.href = targetUrl;
          } catch (error) {
            console.error("Navigation error:", error);
            alert(
              "Error navigating to page. Please check the console for details."
            );
          }
        } else {
          console.log("No active model found, attempting direct navigation");
          // Remove writing animation before navigation
          const writingContainer = document.getElementById("writing-container");
          if (writingContainer) {
            writingContainer.remove();
          }
          window.location.href = button.href;
        }
      });
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function removeNavigationButton() {
      const button = document.getElementById("go_to_page_button");
      if (button) {
        button.remove();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function handleClose() {
      console.log("handleClose triggered");

      // Fade out video background before removing
      const videoBg = document.getElementById("videoBg");
      if (videoBg) {
        videoBg.style.opacity = "0";
        // Wait for fade out to complete before removing
        setTimeout(() => {
          videoBg.remove();
        }, 800); // Match the transition duration
      }

      const elementsToRemove = [
        document.getElementById("page-active"),
        document.getElementById("model-background"),
        document.getElementById("modelSelected"),
        document.getElementById("close"),
      ];

      elementsToRemove.forEach((element) => {
        if (element) {
          console.log("Removing element:", element.id);
          element.remove();
        }
      });

      isModelClicked = false;
      console.log("isModelClicked set to false");

      // Show elements with class 'to-hide'
      const elementsToHide = document.querySelectorAll(".to-hide");
      elementsToHide.forEach((element) => {
        element.style.display = "";
      });

      // Restore UI elements visibility
      const uiElements = document.querySelectorAll(".ui-elements");
      uiElements.forEach((element) => {
        element.style.opacity = "1";
        element.style.pointerEvents = "auto";
      });

      // Enable scrolling
      document.body.style.overflow = "auto";

      // Show the main canvas again and ensure it's properly set up
      const mainCanvas = document.getElementById("threejs-container");
      if (mainCanvas) {
        console.log("Restoring main canvas visibility");
        mainCanvas.style.display = "block";

        // Ensure renderer is properly set up
        if (renderer && renderer.domElement) {
          // Remove any existing click listeners
          renderer.domElement.removeEventListener("click", onModelClick);
          // Re-add the click listener
          renderer.domElement.addEventListener("click", onModelClick);
          // Ensure the renderer is still rendering
          renderer.setAnimationLoop(animate);
        }
      }

      // Restore original model states
      originalModelStates.forEach((state) => {
        gsap.to(state.model.position, {
          x: state.position.x,
          y: state.position.y,
          z: state.position.z,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(state.model.rotation, {
          x: state.rotation.x,
          y: state.rotation.y,
          z: state.rotation.z,
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(state.model.scale, {
          x: params.modelScale,
          y: params.modelScale,
          z: params.modelScale,
          duration: 1,
          ease: "power2.out",
        });
      });

      // Reset hoveredModel
      hoveredModel = null;
      console.log("handleClose completed");
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function init() {
      // Force scroll to top again during initialization
      window.scrollTo(0, 0);

      if (!document.getElementById("threejs-container")) {
        container = document.createElement("div");
        container.id = "threejs-container";
        container.style.width = "100%";
        container.style.height = "100vh";
        container.style.position = "fixed";
        container.style.top = "0";
        container.style.left = "0";
        container.style.zIndex = "1";
        document.body.appendChild(container);
      } else {
        container = document.getElementById("threejs-container");
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      camera = new THREE.PerspectiveCamera(
        params.cameraFOV,
        width / height,
        0.25,
        200
      );
      camera.position.set(0, 0, params.cameraZ);
      camera.lookAt(0, 0, 0);
      scene = new THREE.Scene();
      clock = new THREE.Clock();

      // Add ambient light for better overall illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
      dirLight.position.set(0, 0, 10);
      scene.add(dirLight);

      loadModels(modelsToLoad);
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.setAnimationLoop(animate);
      container.appendChild(renderer.domElement);

      // Store references in window object for cleanup
      window.mainScene = scene;
      window.mainCamera = camera;
      window.mainRenderer = renderer;
      window.mainClock = clock;

      // Remove any existing event listeners
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", handleScroll);
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener("click", onModelClick);
      }
      window.removeEventListener("mousemove", onMouseMove);

      // Add event listeners
      window.addEventListener("resize", onWindowResize);
      window.addEventListener("scroll", handleScroll);
      renderer.domElement.addEventListener("click", onModelClick);
      window.addEventListener("mousemove", onMouseMove);

      checkContainerPosition();
      console.log("Initialization complete");
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function createModelSelectedCanvas(clickedModel) {
      // Remove any existing modelSelected container first
      const existingContainer = document.getElementById("modelSelected");
      if (existingContainer) {
        existingContainer.remove();
      }

      // Log the model name
      console.log(
        "Model loaded in selected canvas:",
        clickedModel.userData.modelName
      );

      // Create modelSelected container
      const modelSelected = document.createElement("div");
      modelSelected.id = "modelSelected";
      modelSelected.style.position = "fixed";
      modelSelected.style.top = "0";
      modelSelected.style.left = "0";
      modelSelected.style.width = "100%";
      modelSelected.style.height = window.innerWidth <= 428 ? "96vh" : "100vh";
      modelSelected.style.zIndex = "5";
      modelSelected.style.overflow = "hidden";
      modelSelected.style.pointerEvents = "none";
      modelSelected.style.display = "flex";
      modelSelected.style.alignItems = "center";
      modelSelected.style.justifyContent = "center";

      // Add grey gradient background if model is in construction
      const isInConstruction = in_construction.includes(
        modelsToLoad[clickedModel.userData.originalIndex]
      );
      if (isInConstruction) {
        modelSelected.style.background = "";
      }

      // Create canvas for the selected model
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      modelSelected.appendChild(canvas);

      // Create new scene, camera, and renderer for the selected model
      const selectedScene = new THREE.Scene();
      const selectedCamera = new THREE.PerspectiveCamera(
        params.cameraFOV,
        window.innerWidth / window.innerHeight,
        0.25,
        200
      );
      selectedCamera.position.set(0, 0, params.cameraZ);
      selectedCamera.lookAt(0, 0, 0);

      // Add lights to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      selectedScene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
      dirLight.position.set(0, 0, 10);
      selectedScene.add(dirLight);

      // Create new renderer
      const selectedRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
      });
      selectedRenderer.setPixelRatio(window.devicePixelRatio);
      selectedRenderer.setSize(window.innerWidth, window.innerHeight);
      selectedRenderer.outputEncoding = THREE.sRGBEncoding;
      selectedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      selectedRenderer.toneMappingExposure = 0.8;

      // Store references in window object for access in click handler
      window.selectedScene = selectedScene;
      window.selectedModel = null;

      // Load the model again to ensure proper materials and geometries
      const loader = new THREE.GLTFLoader();
      loader.load(
        modelsToLoad[clickedModel.userData.originalIndex],
        (gltf) => {
          const modelClone = gltf.scene;
          modelClone.scale.set(
            params.modelScale,
            params.modelScale,
            params.modelScale
          );
          modelClone.position.set(0, isMobile ? 0.5 : 1, params.modelZ);

          // Set initial rotation to match the main scene
          modelClone.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(180),
            THREE.MathUtils.degToRad(0)
          );

          selectedScene.add(modelClone);
          window.selectedModel = modelClone;

          // Animation function for the selected model
          function animateSelected() {
            if (document.getElementById("modelSelected")) {
              requestAnimationFrame(animateSelected);
              selectedRenderer.render(selectedScene, selectedCamera);
            }
          }
          animateSelected();

          // Animate to final rotation
          gsap.to(modelClone.rotation, {
            x: THREE.MathUtils.degToRad(0),
            y: THREE.MathUtils.degToRad(90),
            z: THREE.MathUtils.degToRad(90),
            duration: isMobile ? 0.8 : 1,
            ease: "power2.out",
            onComplete: () => {
              // Start continuous rotation after the transition
              function rotateModel() {
                if (document.getElementById("modelSelected")) {
                  requestAnimationFrame(rotateModel);
                  modelClone.rotation.y += params.rotationSpeed * 0.02;
                }
              }
              rotateModel();
            },
          });
        },
        undefined,
        (error) => {
          console.error("Error loading model for selected canvas:", error);
        }
      );

      // Handle window resize
      function onSelectedWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        selectedCamera.aspect = width / height;
        selectedCamera.updateProjectionMatrix();
        selectedRenderer.setSize(width, height);
      }
      window.addEventListener("resize", onSelectedWindowResize);

      document.body.appendChild(modelSelected);
    }

    function removeModelSelectedCanvas() {
      const modelSelected = document.getElementById("modelSelected");
      if (modelSelected) {
        modelSelected.remove();
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function onModelClick(event) {
      console.log("onModelClick triggered");

      // If a model is already clicked, don't process new clicks
      if (isModelClicked) {
        console.log("Model already clicked, ignoring new click");
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(loadedModels, true);

      console.log("Intersects found:", intersects.length);

      if (intersects.length > 0) {
        console.log("Model intersection detected");

        // Hide elements with class 'to-hide'
        const elementsToHide = document.querySelectorAll(".to-hide");
        elementsToHide.forEach((element) => {
          element.style.display = "none";
        });

        isModelClicked = true;
        let clickedModel = intersects[0].object;
        while (clickedModel.parent && !loadedModels.includes(clickedModel)) {
          clickedModel = clickedModel.parent;
        }
        console.log("Clicked model:", clickedModel.userData.modelName);

        const clickedIndex = clickedModel.userData.originalIndex;
        const isInConstruction = in_construction.includes(
          modelsToLoad[clickedIndex]
        );

        // Store model states before any transformations
        storeModelStates();

        // Create and add the model background elements
        const modelBackground = document.createElement("div");
        modelBackground.id = "model-background";
        modelBackground.style.width = "100%";
        modelBackground.style.height =
          window.innerWidth <= 428 ? "96vh" : "100vh";
        modelBackground.style.position = "fixed";
        modelBackground.style.top = "0";
        modelBackground.style.left = "0";
        modelBackground.style.zIndex = "10";
        modelBackground.style.display = "flex";
        modelBackground.style.flexDirection = "row";
        modelBackground.style.justifyContent = "end";
        modelBackground.style.alignItems = "end";
        modelBackground.style.pointerEvents = "none";

        // Create performance specifics section
        const performanceSpecifics = document.createElement("div");
        performanceSpecifics.id = "performance-specifics";
        performanceSpecifics.style.width = "100%";
        performanceSpecifics.style.height = "10vh";
        performanceSpecifics.style.display = "flex";
        performanceSpecifics.style.flexDirection = "column";
        performanceSpecifics.style.justifyContent = "space-evenly";
        performanceSpecifics.style.marginLeft =
          window.innerWidth <= 428 ? "16px" : "32px";
        performanceSpecifics.style.marginBottom = "64px";
        performanceSpecifics.style.position = "relative";
        performanceSpecifics.style.pointerEvents = "none";

        // Create and set title
        const performanceTitle = document.createElement("h2");
        performanceTitle.id = "performance-title";
        performanceTitle.style.color = "white";
        performanceTitle.style.margin = "0px";
        performanceTitle.style.marginBottom = "8px";
        performanceTitle.style.padding = "0px";
        performanceTitle.style.fontSize =
          window.innerWidth <= 428 ? "2em" : "3em";
        performanceTitle.style.opacity = "0.6";
        performanceTitle.textContent = title_performance[clickedIndex];

        // Create and set date
        const datePerformance = document.createElement("p");
        datePerformance.id = "date-performance";
        datePerformance.style.color = "white";
        datePerformance.style.margin = "0px";
        datePerformance.style.padding = "0px";
        datePerformance.style.fontSize =
          window.innerWidth <= 428 ? "1em" : "1.5em";
        datePerformance.style.fontFamily = "monospace";
        datePerformance.textContent = data_luogo[clickedIndex];

        // Add window resize listener to update font sizes
        window.addEventListener("resize", () => {
          performanceTitle.style.fontSize =
            window.innerWidth <= 428 ? "2em" : "3em";
          datePerformance.style.fontSize =
            window.innerWidth <= 428 ? "1em" : "1.5em";
        });

        // Add title and date to performance specifics
        performanceSpecifics.appendChild(performanceTitle);
        performanceSpecifics.appendChild(datePerformance);

        // Add performance specifics to background
        modelBackground.appendChild(performanceSpecifics);

        // Only add play button if not in construction
        if (!isInConstruction) {
          const playButton = document.createElement("button");
          playButton.id = "play-button";
          playButton.style.height = window.innerWidth <= 428 ? "8vh" : "8vh";
          playButton.style.aspectRatio =
            window.innerWidth <= 428 ? "4/3" : "16/9";
          playButton.style.cursor = "pointer";
          playButton.style.background = "none";
          playButton.style.border = "4px solid white";
          playButton.style.borderRadius = "200px";
          playButton.style.color = "white";
          playButton.style.textTransform = "uppercase";
          playButton.style.position = "relative";
          playButton.style.marginBottom = "64px";
          playButton.style.marginRight =
            window.innerWidth <= 428 ? "16px" : "32px";
          playButton.style.fontSize = "1.5em";
          playButton.style.transition = "400ms ease-out";
          playButton.style.pointerEvents = "auto";
          playButton.textContent = "play";

          // Add hover effect
          playButton.addEventListener("mouseover", () => {
            playButton.style.background = "rgba(255, 255, 255, .5)";
          });
          playButton.addEventListener("mouseout", () => {
            playButton.style.background = "none";
          });

          // Add click event to navigate to the corresponding page
          playButton.addEventListener("click", () => {
            const targetUrl = pageLinks[clickedIndex];

            if (window.selectedModel) {
              // Stop the continuous rotation
              window.selectedModel.rotation.y = window.selectedModel.rotation.y;

              // Create a timeline for sequenced animations
              const tl = gsap.timeline({
                onComplete: () => {
                  window.open(targetUrl, "_self");
                },
              });

              // First animate the rotation
              tl.to(window.selectedModel.rotation, {
                x: THREE.MathUtils.degToRad(0),
                y: THREE.MathUtils.degToRad(180),
                z: THREE.MathUtils.degToRad(90),
                duration: 3.5,
                ease: "power2.inOut",
              })
                // Then animate the position, starting earlier for smoother transition
                .to(
                  window.selectedModel.position,
                  {
                    y: -200,
                    duration: 3.5,
                    ease: "power1.inOut",
                    onUpdate: () => {
                      // Check if model is about to leave the viewport
                      const modelPosition = window.selectedModel.position.y;
                      const viewportHeight = window.innerHeight;
                      const modelHeight = window.selectedModel.scale.y * 2; // Approximate model height
                      const modelBottom = modelPosition + modelHeight / 2;

                      // If model is about to leave the viewport (just 10% remaining visible)
                      if (modelBottom < -viewportHeight * 0.1) {
                        window.open(targetUrl, "_self");
                      }
                    },
                  },
                  "-=1.2"
                ); // Start 1.2 seconds before the previous animation ends
            } else {
              window.open(targetUrl, "_self");
            }
          });

          modelBackground.appendChild(playButton);
        }

        // Add the background to the document
        document.body.appendChild(modelBackground);

        // Add coming soon image if model is in construction
        if (isInConstruction) {
          const comingSoonImg = document.createElement("img");
          comingSoonImg.src =
            "https://rcrdme-gnmr.netlify.app/homepage/coming-soon.svg";
          comingSoonImg.style.position = "absolute";
          comingSoonImg.style.top = "32px";
          comingSoonImg.style.right =
            window.innerWidth <= 428 ? "16px" : "32px";
          comingSoonImg.style.height = window.innerWidth <= 428 ? "40%" : "50%";
          comingSoonImg.style.opacity = ".5";
          modelBackground.appendChild(comingSoonImg);
        }

        // Create active page with higher z-index
        const pageActive = document.createElement("div");
        pageActive.id = "page-active";
        pageActive.style.position = "fixed";
        pageActive.style.top = "0";
        pageActive.style.left = "0";
        pageActive.style.width = "100vw";
        pageActive.style.height = "100vh";
        pageActive.style.zIndex = "11";
        pageActive.style.background = "none";
        pageActive.style.pointerEvents = "none";
        const closeBtn = document.createElement("button");
        const closeIcon = document.createElement("img");
        closeIcon.src =
          "https://cdn.jsdelivr.net/gh/daveee00/export_blender/close-button.svg";
        closeIcon.style.width = "24px";
        closeIcon.style.height = "24px";
        closeBtn.appendChild(closeIcon);
        closeBtn.id = "close";
        closeBtn.style.position = "fixed";
        closeBtn.style.top = "0";
        closeBtn.style.left = "0";
        closeBtn.style.background = "none";
        closeBtn.style.border = "none";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.padding =
          window.innerWidth <= 428 ? "32px 16px" : "32px";
        closeBtn.style.opacity = "0.5";
        closeBtn.style.transition = "opacity 300ms ease-out";
        closeBtn.style.pointerEvents = "auto";
        closeBtn.style.zIndex = "12";
        closeBtn.addEventListener("mouseover", () => {
          closeBtn.style.opacity = "1";
        });
        closeBtn.addEventListener("mouseout", () => {
          closeBtn.style.opacity = "0.5";
        });
        closeBtn.addEventListener("click", handleClose);
        pageActive.appendChild(closeBtn);
        document.body.appendChild(pageActive);

        // Hide UI elements
        const uiElements = document.querySelectorAll(".ui-elements");
        uiElements.forEach((element) => {
          element.style.opacity = "0";
          element.style.pointerEvents = "none";
        });

        // Disable scrolling
        document.body.style.overflow = "hidden";

        // Hide the main canvas and stop its animation loop
        const mainCanvas = document.getElementById("threejs-container");
        if (mainCanvas) {
          mainCanvas.style.display = "none";
          // Stop the animation loop
          renderer.setAnimationLoop(null);
        }

        // Create the modelSelected canvas
        createModelSelectedCanvas(clickedModel);

        // Create video background
        const videoBg = document.createElement("div");
        videoBg.id = "videoBg";
        videoBg.style.position = "fixed";
        videoBg.style.top = "0";
        videoBg.style.left = "0";
        videoBg.style.width = "100%";
        videoBg.style.height = window.innerWidth <= 428 ? "100vh" : "100vh";
        videoBg.style.zIndex = "4";
        videoBg.style.overflow = "hidden";
        videoBg.style.pointerEvents = "none";
        videoBg.style.opacity = "0"; // Start with opacity 0
        videoBg.style.transition = "opacity 0.8s ease-in-out"; // Add transition

        // Create and add video element
        const video = document.createElement("video");
        video.src = videoBG[clickedIndex];
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.transition = "opacity 0.8s ease-in-out"; // Add transition

        videoBg.appendChild(video);
        document.body.appendChild(videoBg);

        // Start playing the video and fade in
        video.play().then(() => {
            // Fade in the video background
            requestAnimationFrame(() => {
                videoBg.style.opacity = "1";
            });
        }).catch(error => {
            console.error("Error playing video:", error);
        });

        gsap.to(clickedModel.position, {
          x: 0,
          y: 0,
          z: 0,
          duration: isMobile ? 0.8 : 1,
          ease: "power2.out",
        });
        gsap.to(clickedModel.rotation, {
          x: THREE.MathUtils.degToRad(0),
          y: THREE.MathUtils.degToRad(90),
          z: THREE.MathUtils.degToRad(90),
          duration: isMobile ? 0.8 : 1,
          ease: "power2.out",
        });
        loadedModels.forEach((model, index) => {
          if (index !== clickedIndex) {
            const yOffset =
              index < clickedIndex
                ? isMobile
                  ? 50
                  : 100
                : isMobile
                ? -50
                : -100;
            gsap.to(model.position, {
              x: 0,
              y: yOffset,
              z: 0,
              duration: isMobile ? 0.8 : 1,
              ease: "power2.out",
            });
          }
        });
      }
    }

    //–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    function onMouseMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(loadedModels, true);
      if (intersects.length > 0) {
        const newHoveredModel = intersects[0].object.parent;
        if (hoveredModel !== newHoveredModel) {
          if (hoveredModel) {
            gsap.to(hoveredModel.scale, {
              x: params.modelScale,
              y: params.modelScale,
              z: params.modelScale,
              duration: 0.4,
              ease: "power2.out",
            });
          }
          hoveredModel = newHoveredModel;
          gsap.to(hoveredModel.scale, {
            x: params.hoverScale,
            y: params.hoverScale,
            z: params.hoverScale,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      } else if (hoveredModel) {
        gsap.to(hoveredModel.scale, {
          x: params.modelScale,
          y: params.modelScale,
          z: params.modelScale,
          duration: 0.4,
          ease: "power2.out",
        });
        hoveredModel = null;
      }
    }
    /*––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––*/
    // Initialize the viewer
    init();
  }
  // Start the viewer when the page loads
  window.addEventListener("load", initWebflowViewer);
})();
