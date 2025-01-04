const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer( { alpha: true});
renderer.setClearColor(0x131313,0)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.onload = () => window.scrollTo(0, 0);

window.addEventListener('resize', ()=> {
    renderer.setSize(window.innerWidth, window.innerHeight);
})


/**
 * Loaders
 */

const body = document.querySelector('body')
document.body.style.overflow = 'hidden';
const loadingBar = document.querySelector('.loading-bar')

const loadingManager = new THREE.LoadingManager(
    // OnLoad callback
    () => {
      // Use GSAP to fade out the loading bar
      gsap.to(loadingBar, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          loadingBar.style.display = 'none'; // Ensure it's removed from the layout
          document.body.style.overflow = 'auto';
        }
      });
    },
    // OnProgress callback
    (url, itemsLoaded, itemsTotal) => {
      console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    },
    // OnError callback
    (url) => {
      console.error(`There was an error loading ${url}`);
    }
  );




// Load Textures
const textureLoader = new THREE.TextureLoader();

// Create an array of texture sets
const textureSets = [
    {
        baseColor: textureLoader.load('model/textures/LowSet1_baseColor.png'),
        normalMap: textureLoader.load('model/textures/LowSet1_normal.png'),
        roughnessMap: textureLoader.load('model/textures/LowSet1_metallicRoughness.png'),
        emissiveMap: textureLoader.load('model/textures/LowSet1_emissive.png'),
    },
    {
        baseColor: textureLoader.load('model/textures/LowSet2_baseColor.png'),
        normalMap: textureLoader.load('model/textures/LowSet2_normal.png'),
        roughnessMap: textureLoader.load('model/textures/LowSet2_metallicRoughness.png'),
    },
    {
      baseColor: textureLoader.load('model/textures/LowSet3_baseColor.png'),
      normalMap: textureLoader.load('model/textures/LowSet3_normal.png'),
      roughnessMap: textureLoader.load('model/textures/LowSet3_metallicRoughness.png'),
  },
  {
    baseColor: textureLoader.load('model/textures/Robe_baseColor.png'),
    normalMap: textureLoader.load('model/textures/Robe_normal.png'),
    roughnessMap: textureLoader.load('model/textures/Robe_metallicRoughness.png'),
},
];

// Load Model
const loader = new THREE.GLTFLoader(loadingManager);
let samurai = null;

loader.load('./model/scene.gltf', (gltf) => {
    samurai = gltf.scene;

    let meshIndex = 2; // Index to track which texture set to use

    // Traverse the model and apply textures to each mesh
    samurai.traverse((child) => {
        if (child.isMesh) {
            console.log("Applying material to mesh:", child.name);

            const textures = textureSets[meshIndex % textureSets.length]; // Cycle through texture sets
            child.material = new THREE.MeshStandardMaterial({
                map: textures.baseColor,     // Base color map
                normalMap: textures.normalMap, // Normal map
                roughnessMap: textures.roughnessMap, // Roughness/metallic map
            });

            child.material.needsUpdate = true;
            meshIndex++; // Move to the next texture set
        }
    });
    samurai.position.setY(-2.3)
    samurai.scale.set(1.5, 1.5, 1.5);
    //samurai.position.setZ(0.5)
    // Add the model to the scene
    scene.add(samurai);
});


 

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableZoom = false
controls.enableDamping = true 
controls.minPolarAngle = Math.PI/2
controls.maxPolarAngle = Math.PI/2


// Add Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(2, 5, 2);
scene.add(directionalLight);

// Camera Position

camera.position.y = 1;
camera.position.z = 0.5



// Animation Loop
function animate() {
    if (samurai) {
        samurai.rotation.y += 0.005; // Rotate model
        
        controls.update()
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
