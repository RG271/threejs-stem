// three.js Example
//
// References:
// 1. https://threejs.org/docs/#manual/en/introduction/Installation
// 2. https://www.youtube.com/watch?v=Q7AOvWpIVHU -- Fireship's Build a Mindblowing 3D Portfolio Website | Three.js Beginner’s Tutorial
// 3. https://threejs.org/docs/?q=BoxGeometry#api/en/core/BufferGeometry
// 4. https://threejs.org/docs/#api/en/textures/Texture
// 5. https://www.tilingtextures.com/tt_blog/20-brick-wall-texture-free-for-commercial-use/ -- texture images
//
// author: Dr. Richard D. Kaminsky
// date:   2/2/2025 - 2/4/2025

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//
// const loader = new GLTFLoader();

let SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
const pointLight = new THREE.PointLight(0xFF0000, 500.0);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(50, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000);
camera.position.setZ(30);
camera.position.setX(-3);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
document.body.appendChild(renderer.domElement);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)
const controls = new OrbitControls(camera, renderer.domElement);

// Statistics Utility (measures frames per second)
const stats = new Stats();
document.body.appendChild(stats.dom);

// Event Handlers
window.addEventListener('resize', onWindowResize);
document.addEventListener('keydown', onKeyDown);

// Add Two Wall (Box) Meshes
const wallTexture = new THREE.TextureLoader().load("public/texture/brick_wall_512x512.jpg");
const WALL_Z = 10.0,    // The z-axis gap between wall #1 and #2 is from -WALL_Z to WALL_Z
      WALL_W = 3.0,     // Walls' width
      WALL_H = 2.0,     // Walls' height
      WALL_D = 0.5,     // Walls' depth
      wallGeometry = new THREE.BoxGeometry(WALL_W, WALL_H, WALL_D),
      wallMaterial = new THREE.MeshBasicMaterial({
        color: 0xC0C0C0,
        map: wallTexture,
        opacity: 0.8,
        transparent: true,  // opacity will be used if true, else ignored
        wireframe: false    // display wireframe if true, else display solid
      });
// const material = new THREE.MeshStandardMaterial({color: "white", wireframe: false});
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.translateZ(WALL_Z + 0.5 * WALL_D);
scene.add(wall1);
const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall2.translateZ(-WALL_Z - 0.5 * WALL_D);
scene.add(wall2);

// Add an Arrow Mesh
const w = 0.05,                   // arrow's width (>0)
      l = 1.0,                    // arrow's length (>0)
      hw = 3 * w,                 // arrow head's width (>w)
      hh = Math.sqrt(3)/2 * hw;   // arrow head's height (>0)
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array( [
	-w/2,   0,       0,   // 0
	w/2,    0,       0,   // 1
	w/2,    l - hh,  0,   // 2
	hw/2,   l - hh,  0,   // 3
	0,      l,       0,   // 4
	-hw/2,  l - hh,  0,   // 5
	-w/2,   l - hh,  0    // 6
] );
const indices = [
	0, 1, 2,
	0, 2, 6,
  3, 4, 5
];
geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const material = new THREE.MeshBasicMaterial({color: 0xEE0000});
const arrowMesh = new THREE.Mesh(geometry, material);
scene.add(arrowMesh);

// // Add Axis Line Segments
// // Bug: Setting LineBasicMaterial's linewidth does not work. All lines are 1-pixel thick. See https://discourse.threejs.org/t/line-width-is-not-working/61168
// const points = [
//   new THREE.Vector3( 0, 0, -5 ),  new THREE.Vector3( 0, 0, 5 ),       // line segment 1
//   new THREE.Vector3( 0, 0, 0 ),   new THREE.Vector3( 0, 2.5, 0 ),     // line segment 2
//   new THREE.Vector3( 0, 0, 0 ),   new THREE.Vector3( 2.5, 0, 0 ) ];   // line segment 3
// const line = new THREE.LineSegments(
//                 new THREE.BufferGeometry().setFromPoints(points),
//                 new THREE.LineBasicMaterial({color: "green"}) );
// scene.add(line);

// Add Z-Axis Line Segment (actually a narrow Cylinder)
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.0125, 0.0125, 2 * WALL_Z, 16),
  new THREE.MeshBasicMaterial({color: "green"})
);
cylinder.rotation.x = Math.PI / 2;
scene.add(cylinder);


// Window-Resize Event Handler
function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
}


// KeyDown Event Handler      !!!STUB
function onKeyDown(event) {
  switch (event.keyCode) {
    case 79: /*O*/
      break;
    case 80: /*P*/
      break;
  }
}


// Animation Function
function animate() {
  arrowMesh.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}
renderer.setAnimationLoop(animate);
