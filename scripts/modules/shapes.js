// shapes.js - Handles creation and management of 3D geometries
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Constants
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

// Utility function to create parametric geometry
function createParametricGeometry(func, slices, stacks) {
  return new THREE.ParametricGeometry(func, slices, stacks);
}

// Helper function for Sierpinski Pyramid
function createSierpinskiPyramid(detail) {
    const vertices = [
      new THREE.Vector3(0, 1, 0),   // Top
      new THREE.Vector3(-1, -1, 1), // Front left
      new THREE.Vector3(1, -1, 1),  // Front right
      new THREE.Vector3(0, -1, -1)  // Back
    ];
  
    function subdivide(v1, v2, v3, depth) {
      if (depth === 0) {
        return [v1, v2, v3];
      }
  
      const v12 = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const v23 = new THREE.Vector3().addVectors(v2, v3).multiplyScalar(0.5);
      const v31 = new THREE.Vector3().addVectors(v3, v1).multiplyScalar(0.5);
  
      return [
        ...subdivide(v1, v12, v31, depth - 1),
        ...subdivide(v12, v2, v23, depth - 1),
        ...subdivide(v31, v23, v3, depth - 1)
      ];
    }
  
    const faces = [
      [vertices[0], vertices[1], vertices[2]],
      [vertices[0], vertices[2], vertices[3]],
      [vertices[0], vertices[3], vertices[1]],
      [vertices[1], vertices[3], vertices[2]]
    ];
  
    let finalVertices = [];
    for (const face of faces) {
      finalVertices.push(...subdivide(face[0], face[1], face[2], detail));
    }
  
    const positions = new Float32Array(finalVertices.length * 3);
    for (let i = 0; i < finalVertices.length; i++) {
      positions[i * 3] = finalVertices[i].x;
      positions[i * 3 + 1] = finalVertices[i].y;
      positions[i * 3 + 2] = finalVertices[i].z;
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
    // Add indices for rendering faces
    const indices = [];
    for (let i = 0; i < positions.length / 3; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  
    return geometry;
}

// Category: Basic Shapes
function createBasicShape(shapeName, segments) {
  switch (shapeName) {
    case 'cube':
      return new THREE.BoxGeometry(2, 2, 2);
    case 'sphere':
      return new THREE.SphereGeometry(1, segments, segments);
    case 'torus':
      return new THREE.TorusGeometry(1, 0.4, segments, segments);
    case 'cylinder':
      return new THREE.CylinderGeometry(1, 1, 2, segments);
    case 'cone':
      return new THREE.ConeGeometry(1, 2, segments);
    default:
      return null;
  }
}

// Category: Platonic Solids
function createPlatonicSolid(shapeName) {
  switch (shapeName) {
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(1);
    case 'octahedron':
      return new THREE.OctahedronGeometry(1);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(1);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1);
    default:
      return null;
  }
}

// Category: Mathematical Shapes
function createMathematicalShape(shapeName, segments) {
  switch (shapeName) {
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16));
    case 'steinmetzSolid':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        target.x = Math.cos(u) * Math.sqrt(1 - v * v);
        target.y = Math.sin(u) * Math.sqrt(1 - v * v);
        target.z = v;
      }, segments, segments);
    case 'mobius':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        const radius = 1 + v * 0.5 * Math.cos(u * 0.5);
        target.x = radius * Math.cos(u);
        target.y = radius * Math.sin(u);
        target.z = v * 0.5 * Math.sin(u * 0.5);
      }, segments, segments);
    case 'kleinBottle':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;
        const r = 4 * (1 - Math.cos(u) / 2);
        target.x = Math.cos(u) * (6 + r * Math.cos(v));
        target.y = Math.sin(u) * (6 + r * Math.cos(v));
        target.z = r * Math.sin(v);
      }, segments, segments);
    case 'trefoilKnot':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16), 2, 3);
    case 'figureBight':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16), 4, 5);
    default:
      return null;
  }
}

// Category: Geometric Variations
function createGeometricVariation(shapeName, segments) {
  switch (shapeName) {
    case 'triangularPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 3);
    case 'pentagonalPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 5);
    case 'hexagonalPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 6);
    case 'star':
      return new THREE.IcosahedronGeometry(1, 1);
    case 'gyroid':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;
        target.x = Math.sin(u) * Math.cos(v);
        target.y = Math.sin(v) * Math.cos(u);
        target.z = Math.sin(u + v);
      }, segments, segments);
    default:
      return null;
  }
}

// Category: Artistic Shapes
function createArtisticShape(shapeName, segments) {
  switch (shapeName) {
    case 'horn':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        const scale = Math.pow(1 - v, 0.8) * 0.6 + 0.4;
        target.x = scale * Math.cos(u + 6 * v);
        target.y = scale * Math.sin(u + 6 * v);
        target.z = v;
      }, segments, segments);
    case 'shell':
      return createParametricGeometry((u, v, target) => {
        u *= 4 * PI;
        v = v * PI;
        
        const a = 0.2;
        const b = 0.6;
        const c = 0.2;
        const n = 4;
        
        const r = a + b * Math.pow(v / PI, n);
        
        target.x = r * Math.cos(u) * Math.sin(v);
        target.y = r * Math.sin(u) * Math.sin(v);
        target.z = r * Math.cos(v) - c * u;
      }, segments, segments);
    case 'helix':
      return createParametricGeometry((u, v, target) => {
        u *= PI * 4;
        v = v * 2 - 1;
        
        const radius = 0.3;
        const coil = 1.0;
        
        target.x = Math.cos(u) + radius * Math.cos(u) * Math.cos(u * coil);
        target.y = Math.sin(u) + radius * Math.sin(u) * Math.cos(u * coil);
        target.z = v * 2 + radius * Math.sin(u * coil);
      }, segments, segments);
    case 'wave':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v = v * 2 - 1;
        
        const freq = 3;
        const amp = 0.2;
        
        target.x = u;
        target.y = v;
        target.z = amp * Math.sin(freq * PI * u) * Math.sin(freq * PI * v);
      }, segments, segments);
    case 'twist':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v = v * 2 - 1;
        const w = 0.35;
        
        target.x = u * Math.cos(PI * v * w);
        target.y = u * Math.sin(PI * v * w);
        target.z = v;
      }, segments, segments);
    default:
      return null;
  }
}

// Category: Advanced Mathematical Shapes
function createAdvancedMathShape(shapeName, segments) {
  switch (shapeName) {
    case 'catenoid':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v *= TWO_PI;
        
        const c = Math.cosh(u);
        target.x = c * Math.cos(v);
        target.y = c * Math.sin(v);
        target.z = u;
      }, segments, segments);
    case 'helicoid':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v *= TWO_PI;
        
        target.x = u * Math.cos(v);
        target.y = u * Math.sin(v);
        target.z = v / PI;
      }, segments, segments);
    case 'boySurface':
      return createParametricGeometry((u, v, target) => {
        u *= PI;
        v *= TWO_PI;
        
        const a = Math.sin(u);
        const b = Math.cos(u) * Math.sin(v);
        const c = Math.cos(u) * Math.cos(v);
        const d = 0.5 * (Math.pow(c, 3) - 3 * c * Math.pow(b, 2));
        
        target.x = a * d;
        target.y = a * (Math.pow(b, 3) - 3 * b * Math.pow(c, 2));
        target.z = -0.5 * a * (Math.pow(b, 2) * c + Math.pow(c, 3));
      }, segments, segments);
    case 'romanSurface':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= PI;
        
        target.x = Math.sin(2 * u) * Math.sin(v) * Math.sin(v);
        target.y = Math.sin(u) * Math.cos(v) * Math.sin(v);
        target.z = Math.cos(u) * Math.sin(v);
      }, segments, segments);
    case 'crossCap':
      return createParametricGeometry((u, v, target) => {
        u *= PI;
        v *= TWO_PI;
        
        target.x = Math.sin(u) * Math.sin(v);
        target.y = Math.sin(u) * Math.cos(v);
        target.z = Math.cos(u) * Math.sin(2 * v) / 2;
      }, segments, segments);
    default:
      return null;
  }
}

// Category: Fractals and Complex Shapes
function createFractalShape(shapeName, segments, detail = 2) {
  switch (shapeName) {
    case 'sierpinski':
      return createSierpinskiPyramid(detail);
    case 'fibonacci':
      return createParametricGeometry((u, v, target) => {
        const phi = (1 + Math.sqrt(5)) / 2;
        const angle = u * TWO_PI * phi;
        const radius = Math.sqrt(u);
        
        target.x = radius * Math.cos(angle);
        target.y = radius * Math.sin(angle);
        target.z = v * 2 - 1;
      }, segments, segments);
    case 'superellipsoid':
      return createParametricGeometry((u, v, target) => {
        u = u * PI - PI/2;
        v *= TWO_PI;
        
        const n1 = 0.7; // Shape parameter
        const n2 = 0.4; // Shape parameter
        
        const cu = Math.cos(u);
        const su = Math.sin(u);
        const cv = Math.cos(v);
        const sv = Math.sin(v);
        
        const sgncu = cu >= 0 ? 1 : -1;
        const sgnsu = su >= 0 ? 1 : -1;
        const sgncv = cv >= 0 ? 1 : -1;
        const sgnsv = sv >= 0 ? 1 : -1;
        
        target.x = sgncu * Math.pow(Math.abs(cu), n1) * sgncv * Math.pow(Math.abs(cv), n2);
        target.y = sgncu * Math.pow(Math.abs(cu), n1) * sgnsv * Math.pow(Math.abs(sv), n2);
        target.z = sgnsu * Math.pow(Math.abs(su), n1);
      }, segments, segments);
    case 'hyperboloid':
      return createParametricGeometry((u, v, target) => {
        u = (u - 0.5) * 2;
        v *= TWO_PI;
        
        const a = 0.5; // Parameter for hyperboloid type
        
        target.x = Math.sqrt(1 + u * u) * Math.cos(v);
        target.y = Math.sqrt(1 + u * u) * Math.sin(v);
        target.z = a * u;
      }, segments, segments);
    default:
      return null;
  }
}

// Main function to create geometry based on shape name
export function createGeometry(shapeName, segments = 32) {
  // Limit segments to reasonable values
  segments = Math.min(Math.max(segments, 3), 128);
  
  // Calculate detail level for recursive shapes
  const detail = Math.min(3, Math.floor(segments / 16));
  
  // Try each category
  let geometry = createBasicShape(shapeName, segments);
  if (geometry) return geometry;
  
  geometry = createPlatonicSolid(shapeName);
  if (geometry) return geometry;
  
  geometry = createMathematicalShape(shapeName, segments);
  if (geometry) return geometry;
  
  geometry = createGeometricVariation(shapeName, segments);
  if (geometry) return geometry;
  
  geometry = createArtisticShape(shapeName, segments);
  if (geometry) return geometry;
  
  geometry = createAdvancedMathShape(shapeName, segments);
  if (geometry) return geometry;
  
  geometry = createFractalShape(shapeName, segments, detail);
  if (geometry) return geometry;
  
  // Default to cube if shape not found
  console.warn(`Shape "${shapeName}" not recognized. Defaulting to cube.`);
  return new THREE.BoxGeometry(2, 2, 2);
}