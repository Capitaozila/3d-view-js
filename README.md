# 3D Shape Morpher

A simple 3D geometry visualization tool that lets you explore and manipulate various 3D shapes in real-time.

* URL: [3dshapemorpher.ianmaloba.com](https://3dshapemorpher.ianmaloba.com)

## Features

* **Shape Selection**: basic forms, platonic solids, mathematical surfaces, fractals, and more.
* **Customization**: Adjust scale, segments, materials, and colors.
* **Animations**: Control rotation speed and direction.
* **Material Effects**: Choose from standard, physical, toon, gradient, and wireframe materials.

## Shapes

| Category                 | Shape                  |
|--------------------------|------------------------|
| **Basic Shapes**         | Cube, Sphere, Torus (Donut), Cylinder, Cone |
| **Platonic Solids**      | Tetrahedron, Octahedron, Dodecahedron, Icosahedron |
| **Mathematical Shapes**  | Torus Knot, Steinmetz Solid, Möbius Strip, Klein Bottle, Trefoil Knot, Figure-8 Knot |
| **Geometric Variations** | Triangular Prism, Pentagonal Prism, Hexagonal Prism, Star Polyhedron, Gyroid Surface |
| **Artistic Shapes**      | Spiral Horn, Nautilus Shell, Double Helix, Wave Surface, Twisted Cube |
| **Advanced Mathematical**| Catenoid, Helicoid, Boy's Surface, Roman Surface, Cross-Cap |
| **Fractals and Complex** | Sierpinski Pyramid, Fibonacci Spiral, Superellipsoid, Hyperboloid |

## Getting Started

### Prerequisites

To run this project, you'll need:

* A modern web browser (Chrome, Firefox, Edge, etc.)
* An internet connection for loading the Three.js library

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ianmaloba/ShapeMorpher.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ShapeMorpher
   ```
3. Open the `index.html` file in your web browser.

## Usage

1. **Shape Selection**: Choose a shape from the dropdown menu.
2. **Control Properties**:
    * Adjust scale using the **Scale** slider.
    * Modify segment detail using the **Segments** slider.
3. **Animation**:
    * Change rotation speed with the **Rotation Speed** slider.
    * Select rotation direction from the **Direction** dropdown.
4. **Material Customization**:
    * Select material type from the **Material Type** dropdown.
    * Adjust **Metalness** and **Roughness** sliders for reflective and matte effects.
    * Use the color pickers to set **Primary** and **Secondary** colors.
4. **Interface Controls**:
    * Change background color with the color picker.
    * Toggle between light and dark mode with the moon/sun icon.
    * Collapse or expand the control panel with the chevron icon.
    * Reset camera position or all settings using the control buttons.

### Example Code:

#### Generate a Sierpinski Pyramid
```javascript
const detail = 3; // Detail level: 3
const sierpinskiGeometry = createSierpinskiPyramid(detail);
const material = new THREE.MeshStandardMaterial({ 
  color: '#ff00ff', 
  wireframe: true 
});
const sierpinski = new THREE.Mesh(sierpinskiGeometry, material);
scene.add(sierpinski);

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

  // Generate geometry and return
  // ...
}
```


## Project Structure
```plaintext
📦 ShapeMorpher
├── index.html               # Main HTML file
├── styles/
│   ├── main.css            # Additional styles and extensions
│   └── style.css           # Base styles with light/dark theme support
└── scripts/
    ├── app.js              # Main application logic
    └── modules/
        ├── scene.js        # Three.js scene setup
        ├── shapes.js       # 3D geometry creation functions
        ├── materials.js    # Material creation and management
        ├── ui.js           # UI utility functions
        └── descriptions.js # Educational shape descriptions
```
## Built With

* Three.js
* HTML5/CSS3
* JavaScript
* Font Awesome

## License

This project is licensed under the [MIT License](https://github.com/ianmaloba/ShapeMorpher/blob/main/LICENSE).

---

> _"Geometry is the archetype of the beauty of the world."_
> — Johannes Kepler
