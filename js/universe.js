// Fundo animado: campo de estrelas com Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.getElementById('universe');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 720px)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
} catch (err) {
  // Sem WebGL: fica só o fundo em CSS
  canvas.remove();
  throw err;
}

const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 0);

// Material de partículas: pontos redondos, suaves e com cintilação
function createPointsMaterial(opacity, twinkle) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: opacity },
      uTwinkle: { value: twinkle },
    },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute float phase;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uTwinkle;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = max(size * uPixelRatio * (300.0 / -mvPosition.z), 1.0);
        vColor = color;
        vAlpha = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * (0.6 + fract(phase) * 1.8) + phase * 6.2831));
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = pow(smoothstep(0.5, 0.0, d), 1.8);
        gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

function createPoints(positions, colors, sizes, material) {
  const count = sizes.length;
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) phases[i] = Math.random() * 10;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
  return new THREE.Points(geometry, material);
}

const materials = [];

// ---------- Campo de estrelas ----------
const STAR_COUNT = isMobile ? 1500 : 9500;
const starPalette = [
  new THREE.Color('#ffffff'),
  new THREE.Color('#cfe8ff'),
  new THREE.Color('#fff1d6'),
  new THREE.Color('#b9fff0'),
];
{
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const c = new THREE.Color();

  for (let i = 0; i < STAR_COUNT; i++) {
    // Distribuição em casca esférica ao redor da câmera
    const r = 250 + Math.random() * 650;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    c.copy(starPalette[Math.floor(Math.random() * starPalette.length)]);
    c.multiplyScalar(0.6 + Math.random() * 0.4);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Poucas estrelas grandes, muitas pequenas
    sizes[i] = Math.random() < 0.03 ? 3.5 + Math.random() * 2 : 1.2 + Math.random() * 1.6;
  }

  const material = createPointsMaterial(1, 0.55);
  materials.push(material);
  scene.add(createPoints(positions, colors, sizes, material));
}

// ---------- Interação: mouse e scroll ----------
const pointer = { x: 0, y: 0 };
const smooth = { x: 0, y: 0, scroll: 0 };

window.addEventListener(
  'pointermove',
  (e) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  },
  { passive: true }
);

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);

// ---------- Loop ----------
const clock = new THREE.Clock();
let running = true;

function render() {
  const t = clock.getElapsedTime();
  materials.forEach((m) => (m.uniforms.uTime.value = t));

  smooth.x += (pointer.x - smooth.x) * 0.04;
  smooth.y += (pointer.y - smooth.y) * 0.04;
  smooth.scroll += (scrollProgress() - smooth.scroll) * 0.06;

  // Viagem lenta pelo espaço conforme rola a página
  camera.rotation.y = -smooth.x * 0.12 + smooth.scroll * 0.6;
  camera.rotation.x = -smooth.y * 0.08 - smooth.scroll * 0.25;
  camera.position.z = -smooth.scroll * 120;

  scene.rotation.z = t * 0.004;

  renderer.render(scene, camera);
}

function loop() {
  if (!running) return;
  render();
  requestAnimationFrame(loop);
}

if (reduceMotion) {
  // Movimento reduzido: apenas um quadro estático (redesenha no resize)
  render();
  window.addEventListener('resize', render);
} else {
  loop();
  // Pausa quando a aba não está visível
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) loop();
  });
}
