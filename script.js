/**
 * 3DIFY.PRINTZ — ENGINE CORE & INTERACTION SUITE
 */

/* CONFIGURATION MATRIX */
const MATERIALS = {
  pla:  { label: 'PLA',  density: 1.24, pricePerGram: 45 },
  petg: { label: 'PETG', density: 1.27, pricePerGram: 55 },
  abs:  { label: 'ABS',  density: 1.04, pricePerGram: 50 },
  tpu:  { label: 'TPU',  density: 1.21, pricePerGram: 65 },
  resin:{ label: 'SLA Resin', density: 1.15, pricePerGram: 85 }
};

const COLORS = [
  { id: 'white',  label: 'Matte White',   hex: 0xF2F1ED },
  { id: 'black',  label: 'Matte Black',   hex: 0x1B1B1B },
  { id: 'grey',   label: 'Stealth Grey', hex: 0x555A66 },
  { id: 'emerald',label: 'Electric Green',hex: 0x00FF88 },
  { id: 'silver', label: 'Silver Silk',  hex: 0xC9CBCE }
];

const SETUP_FEE = 250;
const RUSH_MULTIPLIER = 1.25;
const SHELL_FRACTION = 0.15;
const WHATSAPP_NUMBER = '94764892775';
const ORDER_EMAIL = 'dilitharajapaksha3@gmail.com';

/* APP STATE */
let items = [];
let itemSeq = 0;
let rush = false;
const renderers = {};

/* INITIALIZATION */
document.addEventListener('DOMContentLoaded', () => {
  initParticleHero();
  initHero3DViewport();
  initGSAPAnimations();
  initUploadHandlers();
  initQuoteEngine();
  generateTicketMetadata();
});

/* PARTICLE BACKGROUND CANVAS */
function initParticleHero() {
  const canvas = document.getElementById('hero-particles');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5
  }));

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(renderParticles);
  }
  renderParticles();
}

/* HERO THREE.JS VIEWPORT CANVAS */
function initHero3DViewport() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 120);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // CAD Metallic Geometry Preview
  const geometry = new THREE.IcosahedronGeometry(35, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x1B1B1B,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00FF88, 2);
  dirLight.position.set(50, 50, 50);
  scene.add(dirLight);

  function animateHeroViewport() {
    requestAnimationFrame(animateHeroViewport);
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animateHeroViewport();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* GSAP SCROLL & COUNTER ANIMATIONS */
function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Counter Animations
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%'
      }
    });
  });

  // Reveal Sections
  gsap.utils.toArray('.glass-card, .process-step').forEach(element => {
    gsap.from(element, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%'
      }
    });
  });
}

/* UPLOAD & ANALYSIS HANDLERS */
function initUploadHandlers() {
  const dz = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const addMoreBtn = document.getElementById('addMoreBtn');

  dz.addEventListener('click', () => fileInput.click());
  addMoreBtn.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => {
    e.preventDefault();
    dz.classList.add('drag');
  }));

  ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => {
    e.preventDefault();
    dz.classList.remove('drag');
  }));

  dz.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  fileInput.addEventListener('change', e => {
    handleFiles(e.target.files);
    fileInput.value = '';
  });
}

function handleFiles(fileList) {
  const overlay = document.getElementById('analysis-overlay');
  const overlayText = document.getElementById('analysis-status-text');
  
  const stlFiles = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.stl'));
  if (stlFiles.length === 0) return;

  overlay.classList.remove('hidden');

  let processedCount = 0;
  
  stlFiles.forEach((file, index) => {
    setTimeout(() => {
      overlayText.innerText = `Analyzing geometry (${index + 1}/${stlFiles.length})...`;
      
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const buffer = ev.target.result;
          const parsed = parseSTL(buffer);
          
          items.push({
            id: ++itemSeq,
            file,
            name: file.name,
            buffer: buffer.slice(0),
            volumeCm3: parsed.volumeCm3,
            dims: parsed.dims,
            triCount: parsed.triCount,
            material: 'pla',
            color: 'emerald',
            infill: 20,
            qty: 1
          });

          processedCount++;
          if (processedCount === stlFiles.length) {
            overlayText.innerText = "Calculating volume...";
            setTimeout(() => {
              overlay.classList.add('hidden');
              renderEngineItems();
            }, 400);
          }
        } catch (err) {
          console.error(err);
          alert(`Error reading binary STL array on "${file.name}".`);
          overlay.classList.add('hidden');
        }
      };
      reader.readAsArrayBuffer(file);
    }, index * 200);
  });
}

/* STL GEOMETRY PARSER (BINARY & ASCII) */
function parseSTL(buffer) {
  const view = new DataView(buffer);
  let isBinary = false;
  
  if (buffer.byteLength > 84) {
    const triCount = view.getUint32(80, true);
    if (84 + triCount * 50 === buffer.byteLength) isBinary = true;
  }

  return isBinary ? parseBinarySTL(view) : parseAsciiSTL(new TextDecoder().decode(buffer));
}

function parseBinarySTL(view) {
  const triCount = view.getUint32(80, true);
  let volume = 0;
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };
  let offset = 84;

  for (let i = 0; i < triCount; i++) {
    offset += 12; // Skip normal vector
    const v = [];
    for (let j = 0; j < 3; j++) {
      const x = view.getFloat32(offset, true);
      const y = view.getFloat32(offset + 4, true);
      const z = view.getFloat32(offset + 8, true);
      offset += 12;
      v.push({ x, y, z });
      
      min.x = Math.min(min.x, x); min.y = Math.min(min.y, y); min.z = Math.min(min.z, z);
      max.x = Math.max(max.x, x); max.y = Math.max(max.y, y); max.z = Math.max(max.z, z);
    }
    offset += 2; // Attribute byte count
    volume += signedVolume(v[0], v[1], v[2]);
  }

  return {
    volumeCm3: Math.abs(volume) / 1000,
    dims: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z },
    triCount
  };
}

function parseAsciiSTL(text) {
  const verts = [];
  const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    verts.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), z: parseFloat(m[3]) });
  }

  let volume = 0;
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (let i = 0; i < verts.length; i += 3) {
    const v1 = verts[i], v2 = verts[i+1], v3 = verts[i+2];
    if (!v1 || !v2 || !v3) break;
    [v1, v2, v3].forEach(v => {
      min.x = Math.min(min.x, v.x); min.y = Math.min(min.y, v.y); min.z = Math.min(min.z, v.z);
      max.x = Math.max(max.x, v.x); max.y = Math.max(max.y, v.y); max.z = Math.max(max.z, v.z);
    });
    volume += signedVolume(v1, v2, v3);
  }

  return {
    volumeCm3: Math.abs(volume) / 1000,
    dims: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z },
    triCount: Math.floor(verts.length / 3)
  };
}

function signedVolume(p1, p2, p3) {
  return (-p3.x * p2.y * p1.z + p2.x * p3.y * p1.z + p3.x * p1.y * p2.z - p1.x * p3.y * p2.z - p2.x * p1.y * p3.z + p1.x * p2.y * p3.z) / 6.0;
}

/* RENDER ENGINE ITEMS TO DOM & THREE.JS CANVAS PREVIEW */
function renderEngineItems() {
  const container = document.getElementById('itemsList');
  const emptyState = document.getElementById('emptyItems');
  const itemCountLabel = document.getElementById('itemCount');

  container.innerHTML = '';
  itemCountLabel.innerText = `${items.length} FILE${items.length === 1 ? '' : 'S'} LOADED`;

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
    updateTicketDashboard();
    return;
  }

  emptyState.classList.add('hidden');

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-panel item-card';

    const dimsText = `${item.dims.x.toFixed(1)} × ${item.dims.y.toFixed(1)} × ${item.dims.z.toFixed(1)} mm`;

    card.innerHTML = `
      <div class="item-preview-layout">
        <div class="canvas-container" id="canvas-container-${item.id}"></div>
        
        <div>
          <div class="item-head">
            <div>
              <div class="item-filename">${escapeHtml(item.name)}</div>
              <div class="item-dims">${dimsText} · Vol: ${item.volumeCm3.toFixed(2)} cm³</div>
            </div>
            <button class="item-remove" onclick="removeItem(${item.id})">REMOVE</button>
          </div>

          <div class="mini-row">
            <span class="mini-label">Material</span>
            <div class="pill-group">
              ${Object.keys(MATERIALS).map(mKey => `
                <button class="pill ${item.material === mKey ? 'active' : ''}" onclick="updateItem(${item.id}, 'material', '${mKey}')">
                  ${MATERIALS[mKey].label}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="mini-row">
            <span class="mini-label">Color</span>
            <select class="color-select" onchange="updateItem(${item.id}, 'color', this.value)">
              ${COLORS.map(c => `<option value="${c.id}" ${item.color === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>

          <div class="mini-row">
            <span class="mini-label">Infill</span>
            <div class="item-infill">
              <input type="range" min="10" max="100" step="5" value="${item.infill}" oninput="updateItem(${item.id}, 'infill', parseInt(this.value))">
              <span class="infill-readout">${item.infill}%</span>
            </div>

            <div class="item-qty">
              <button onclick="updateItem(${item.id}, 'qty', Math.max(1, ${item.qty - 1}))">-</button>
              <input type="text" value="${item.qty}" readonly>
              <button onclick="updateItem(${item.id}, 'qty', ${item.qty + 1})">+</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
    initItemThreeCanvas(item);
  });

  updateTicketDashboard();
}

/* INDIVIDUAL ITEM THREE.JS VIEWPORT CANVAS */
function initItemThreeCanvas(item) {
  const container = document.getElementById(`canvas-container-${item.id}`);
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const loader = new THREE.STLLoader();
  const geometry = loader.parse(item.buffer);
  geometry.center();

  const colorObj = COLORS.find(c => c.id === item.color) || COLORS[0];

  const material = new THREE.MeshStandardMaterial({
    color: colorObj.hex,
    roughness: 0.3,
    metalness: 0.5
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Auto-fit camera
  geometry.computeBoundingSphere();
  const radius = geometry.boundingSphere.radius;
  camera.position.z = radius * 2.5;

  const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
  light1.position.set(1, 1, 1);
  scene.add(light1);
  
  const light2 = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(light2);

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  renderers[item.id] = { renderer, scene, camera, mesh, material };
}

/* STATE MUTATORS */
function updateItem(id, key, val) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  item[key] = val;

  if (key === 'color' && renderers[id]) {
    const colorObj = COLORS.find(c => c.id === val);
    if (colorObj) renderers[id].material.color.setHex(colorObj.hex);
  }

  renderEngineItems();
}

function removeItem(id) {
  if (renderers[id]) {
    renderers[id].renderer.dispose();
    delete renderers[id];
  }
  items = items.filter(i => i.id !== id);
  renderEngineItems();
}

/* QUOTE ENGINE INITIALIZATION & CALCULATION */
function initQuoteEngine() {
  const rushSwitch = document.getElementById('rushSwitch');
  const rushToggle = document.getElementById('rushToggle');

  rushToggle.addEventListener('click', () => {
    rush = !rush;
    rushSwitch.classList.toggle('on', rush);
    updateTicketDashboard();
  });
}

function calculateItemCost(item) {
  const mat = MATERIALS[item.material] || MATERIALS.pla;
  const infillFraction = SHELL_FRACTION + (1 - SHELL_FRACTION) * (item.infill / 100);
  const massGrams = item.volumeCm3 * mat.density * infillFraction;
  const unitCost = Math.max(150, massGrams * mat.pricePerGram);
  return unitCost * item.qty;
}

function updateTicketDashboard() {
  const ticketEmpty = document.getElementById('ticketEmpty');
  const ticketBody = document.getElementById('ticketBody');
  const ticketItems = document.getElementById('ticketItems');
  
  if (items.length === 0) {
    ticketEmpty.classList.remove('hidden');
    ticketBody.classList.add('hidden');
    return;
  }

  ticketEmpty.classList.add('hidden');
  ticketBody.classList.remove('hidden');

  let subtotal = 0;
  ticketItems.innerHTML = '';

  items.forEach(item => {
    const cost = calculateItemCost(item);
    subtotal += cost;
    
    const mat = MATERIALS[item.material] || MATERIALS.pla;
    const colorObj = COLORS.find(c => c.id === item.color) || COLORS[0];

    const itemRow = document.createElement('div');
    itemRow.className = 't-item';
    itemRow.innerHTML = `
      <div class="t-item-header">
        <span class="t-item-name">${escapeHtml(item.name)}</span>
        <span class="t-item-cost">LKR ${Math.round(cost).toLocaleString()}</span>
      </div>
      <div class="t-item-specs">
        <span class="t-spec-tag">${mat.label}</span>
        <span class="t-spec-tag">${colorObj.label}</span>
        <span class="t-spec-tag">${item.infill}% Infill</span>
        <span class="t-spec-tag">Qty: ${item.qty}</span>
      </div>
    `;
    ticketItems.appendChild(itemRow);
  });

  const setupFee = items.length > 0 ? SETUP_FEE : 0;
  const rushFee = rush ? (subtotal + setupFee) * (RUSH_MULTIPLIER - 1) : 0;
  const total = subtotal + setupFee + rushFee;

  document.getElementById('cSubtotal').innerText = `LKR ${Math.round(subtotal).toLocaleString()}`;
  document.getElementById('cSetup').innerText = `LKR ${setupFee.toLocaleString()}`;
  
  const rushRow = document.getElementById('cRushRow');
  if (rush) {
    rushRow.classList.remove('hidden');
    document.getElementById('cRush').innerText = `LKR ${Math.round(rushFee).toLocaleString()}`;
  } else {
    rushRow.classList.add('hidden');
  }

  document.getElementById('cTotal').innerText = `LKR ${Math.round(total).toLocaleString()}`;

  updateCTAUrls(total);
}

/* OUTBOUND CTAs (WHATSAPP & EMAIL) */
function updateCTAUrls(total) {
  let summary = `*3DIFY.PRINTZ — SPECIFICATION QUOTE REQUEST*\n`;
  summary += `Ref ID: ${document.getElementById('ticketId').innerText}\n`;
  summary += `Date: ${document.getElementById('ticketDate').innerText}\n\n`;

  items.forEach((item, idx) => {
    const mat = MATERIALS[item.material] || MATERIALS.pla;
    summary += `${idx + 1}. *${item.name}*\n`;
    summary += `   - Material: ${mat.label} | ${item.color}\n`;
    summary += `   - Infill: ${item.infill}% | Qty: ${item.qty}\n`;
    summary += `   - Dim: ${item.dims.x.toFixed(1)}x${item.dims.y.toFixed(1)}x${item.dims.z.toFixed(1)} mm\n\n`;
  });

  if (rush) summary += `*Priority Dispatch:* YES (+25%)\n`;
  summary += `*Estimated Total: LKR ${Math.round(total).toLocaleString()}*\n`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
  const mailUrl = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("Print Quote Request " + document.getElementById('ticketId').innerText)}&body=${encodeURIComponent(summary)}`;

  document.getElementById('ctaWhatsapp').setAttribute('href', waUrl);
  document.getElementById('ctaEmail').setAttribute('href', mailUrl);
}

function generateTicketMetadata() {
  const id = '#3D-' + Math.floor(1000 + Math.random() * 9000);
  const date = new Date().toLocaleDateString('en-GB');
  document.getElementById('ticketId').innerText = id;
  document.getElementById('ticketDate').innerText = date;
}

function copyQuoteSummary() {
  const total = document.getElementById('cTotal').innerText;
  let summary = `3DIFY.PRINTZ SPECIFICATION SHEET\n`;
  summary += `ID: ${document.getElementById('ticketId').innerText}\n`;
  summary += `Total: ${total}\n`;
  
  navigator.clipboard.writeText(summary).then(() => {
    alert("Specification summary copied to clipboard.");
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}