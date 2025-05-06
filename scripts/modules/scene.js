// scene.js - Handles Three.js scene setup and management

// Create the scene, camera, and renderer objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Initialize the scene with lighting and camera position
function initScene() {
    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera positioning
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    
    // Add lights
    addLights();
}

// Create and add lights to the scene
function addLights() {
    // Point light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-10, 10, -10);
    scene.add(directionalLight);
    
    // Hemisphere light for natural lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
}

// Export the objects and functions
export { 
    scene, 
    camera, 
    renderer, 
    initScene
};