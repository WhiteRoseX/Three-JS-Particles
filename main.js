import {
  AxesHelper,
  BoxBufferGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
  VertexColors,
  Group,
  Clock,
  LineBasicMaterial,
  Line,
  SphereBufferGeometry
} from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const textureLoader = new TextureLoader();
const circleTexture = textureLoader.load('/texture.png')
const alphaMap = textureLoader.load('/alphamap.png')

const scene = new Scene();
const count = 100;
const distance = 4;
const size = 0.09;


const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.z = 2;
camera.position.y = 0.5;
camera.position.x = 0.5;
scene.add(camera);

const points = new Float32Array(count * 3);
const colors = new Float32Array(count * 3)
for (let i = 0; i < points.length; i++) {
  points[i] = MathUtils.randFloatSpread(distance * 2);
  colors[i] = Math.random()
}

const Geometry = new BufferGeometry();
Geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
Geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
const pointMaterial = new PointsMaterial({
  size: 0.08,
  vertexColors: VertexColors,
  alphaTest: 0.5,
  alphaMap: alphaMap,
  transparent: true,
});
const pointsObjects = new Points(Geometry, pointMaterial);
scene.add(pointsObjects);
const group = new Group()
group.add(pointsObjects)

const lineMaterial = new LineBasicMaterial({
  color: 0x000000,
  opacity: 0.05,
  depthTest: false,
})


const lineObject = new Line(Geometry, lineMaterial)
group.add(lineObject); 

scene.add(group)

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 0)

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new Clock();

let mouseX = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
})

function tick() {
  const time = clock.getElapsedTime();
  // group.rotation.y = time * 0.1
  group.rotateY(0.001 * Math.PI)
  renderer.render(scene, camera);
  controls.update;
  requestAnimationFrame(tick);
  // const ratio = (mouseX / window.innerWidth - 0.5) * 2
  // group.rotation.y = ratio * Math.PI * 0.1
}

tick();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
