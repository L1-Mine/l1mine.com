document.getElementById("emailForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = this.querySelector('input[type="email"]').value;
  const url = window.location.protocol === "http:" ? "http://localhost:8787" : "https://email-signup.l1mine.com";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  }).then((response) => {
    if (response.ok) {
      alert("Successfully joined the waitlist!");
    } else {
      alert("Something went wrong. Please try again later.");
    }
  });
});

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const renderWebGLCanvas = () => {
  const canvasSize = 300;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasSize, canvasSize);

  document.getElementById("webgl").appendChild(renderer.domElement);

  function onWindowResize() {
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(
      canvasSize * window.devicePixelRatio,
      canvasSize * window.devicePixelRatio,
      false
    );
  }

  window.addEventListener("resize", onWindowResize);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(5, 1, 5);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight2.position.set(-5, 1, -5);
  scene.add(directionalLight);
  scene.add(directionalLight2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  let loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  const baseColorTexture = textureLoader.load(
    "static/bitcoin/textures/Material.001_baseColor.png"
  );
  const metallicRoughnessTexture = textureLoader.load(
    "static/bitcoin/textures/Material.001_metallicRoughness.png"
  );

  const pbrMaterial = new THREE.MeshStandardMaterial({
    map: baseColorTexture,
    metalnessMap: metallicRoughnessTexture,
    roughnessMap: metallicRoughnessTexture,
    metalness: 1,
    roughness: 1,
  });

  let coin;
  loader.load("static/bitcoin/scene.gltf", function (gltf) {
    coin = gltf.scene;
    const size = 100;
    coin.scale.set(size, size, size);
    coin.traverse((node) => {
      if (node.isMesh) {
        node.material = pbrMaterial;
        node.material.needsUpdate = true;
      }
    });
    scene.add(coin);
  });

  camera.position.z = 15;

  function animate() {
    requestAnimationFrame(animate);

    if (coin) {
      coin.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  }

  animate();
};

function loadVideoBackground() {
  const video = document.createElement("video");
  video.id = "backgroundVideo";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.poster = "/static/fallback.jpg";
  video.src = "/static/background.mp4";
  document.body.appendChild(video);
}

window.addEventListener("load", () => {
  if (window.innerWidth > 1025) {
    loadVideoBackground();
    renderWebGLCanvas();
  }
});
