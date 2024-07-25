import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  FontLoader,
  RGBELoader,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//AXIS HELPER
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/5.png");
const metalTexture = textureLoader.load("/textures/matcaps/2.png");
metalTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const material = new THREE.MeshPhysicalMaterial({ map: matcapTexture });
const metalMaterial = new THREE.MeshPhysicalMaterial({ map: metalTexture });

material.metalness = 0.6;
material.roughness = 0.2;
material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];

metalMaterial.metalness = 0.4;
metalMaterial.roughness = 0.5;
metalMaterial.iridescence = 1;
metalMaterial.iridescenceIOR = 1;
metalMaterial.iridescenceThicknessRange = [100, 800];

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/font/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Star Donuts", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, metalMaterial);
  scene.add(text);
});

/**
 * Environment map
 */
// const rgbeLoader = new RGBELoader();
// rgbeLoader.load("/stars.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
//   console.log(environmentMap);
// });

/**
 * Donuts
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

const donuts = [];

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);

  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;

  donut.rotation.x = Math.random() * 2 * Math.PI;
  donut.rotation.y = Math.random() * 2 * Math.PI;

  const scale = Math.random();
  donut.scale.set(scale, scale, scale);

  scene.add(donut);
  donuts.push(donut);
}

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

/**
 * Lights
 */
const ambiantLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambiantLight);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 0;
pointLight.position.y = 3;
pointLight.position.z = 4;
// pointLight.lookAt(text.position);
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  donuts.forEach((donut) => {
    donut.rotation.x = elapsedTime;
    donut.rotation.z = elapsedTime;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
