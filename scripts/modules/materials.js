// materials.js - Handles creation and updating of materials

// Create a material based on user selection
function createMaterial() {
    const materialType = document.getElementById('materialType').value;
    const color = new THREE.Color(document.getElementById('color').value);
    const color2 = new THREE.Color(document.getElementById('color2').value);
    const metalness = parseFloat(document.getElementById('metalness').value);
    const roughness = parseFloat(document.getElementById('roughness').value);
  
    let material;
    
    switch (materialType) {
        case 'phong':
            material = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 100 * (1 - roughness),
                specular: new THREE.Color(metalness, metalness, metalness)
            });
            break;
        case 'physical':
            material = new THREE.MeshPhysicalMaterial({
                color: color,
                metalness,
                roughness,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1
            });
            break;
        case 'toon':
            material = new THREE.MeshToonMaterial({ 
                color: color,
                gradientMap: createGradientTexture()
            });
            break;
        case 'gradient':
            material = createGradientMaterial(color, color2);
            break;
        case 'normal':
            material = new THREE.MeshNormalMaterial({
                flatShading: true
            });
            break;
        case 'wireframe':
            material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: color
            });
            break;
        default:
            material = new THREE.MeshStandardMaterial({
                color: color,
                metalness,
                roughness
            });
    }
    
    return material;
}

// Update material properties based on UI controls
function updateMaterial() {
    const currentShape = document.querySelector('scene').getObjectByProperty('type', 'Mesh');
    if (!currentShape) return;
    
    const materialType = document.getElementById('materialType').value;
    const metalness = parseFloat(document.getElementById('metalness').value);
    const roughness = parseFloat(document.getElementById('roughness').value);
    
    if (materialType === 'physical' || materialType === 'standard') {
        currentShape.material.metalness = metalness;
        currentShape.material.roughness = roughness;
        currentShape.material.needsUpdate = true;
    } else if (materialType === 'phong') {
        currentShape.material.shininess = 100 * (1 - roughness);
        currentShape.material.specular.setScalar(metalness);
        currentShape.material.needsUpdate = true;
    }
}

// Create a gradient texture for toon material
function createGradientTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 256, 0);
    
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.33, '#888888');
    gradient.addColorStop(0.66, '#cccccc');
    gradient.addColorStop(1, '#ffffff');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 1);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Create a shader-based gradient material
function createGradientMaterial(color1, color2) {
    const vertexShader = `
        varying vec3 vPosition;
        void main() {
            vPosition = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPosition;
        void main() {
            float gradient = (vPosition.y + 1.0) * 0.5;
            vec3 color = mix(color1, color2, gradient);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    return new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: color1 },
            color2: { value: color2 }
        },
        vertexShader,
        fragmentShader
    });
}

// Export the functions
export {
    createMaterial,
    updateMaterial,
    createGradientTexture,
    createGradientMaterial
};