import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new THREE.Scene();

// creating a sphere
// takes 3 params: a radius(float), widthSegments(int) and heightSegments(int)
// the higer vals the smoother the sphere
// radius or size — sphere radius. Default is 1.
// widthSegments — number of horizontal segments.
// heightSegments — number of vertical segments.
// geometry is just the shape
const geometry = new THREE.SphereGeometry(3, 64, 64);
// material is how it looks
const material = new THREE.MeshStandardMaterial({
  color: 'blue',
  roughness: 5,
});
// mesh is combo of geometry and material to create sphere
const mesh = new THREE.Mesh(geometry, material);

// Size
const sizes = { width: window.innerWidth, height: window.innerHeight };
// add to scene
scene.add(mesh);

// Light
const light = new THREE.PointLight(0xffffff, 10, 100, 2);
const light2 = new THREE.AmbientLight(0x404040, 2.5); // soft white light
light.position.set(0, 10, 20);
light.intensity = 2.55;
scene.add(light);
scene.add(light2);
// Camera
// 45 is the field of view: how much camera can see
// wider the focal length the more distortion 50 or lower fine
// 800 and 600 are aspect ratio
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
// z index of camera
camera.position.z = 15;
scene.add(camera);

//Render the scene
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDampining = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;
// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('title', { opacity: 0 }, { opacity: 1 });

//Mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    // lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);

    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
