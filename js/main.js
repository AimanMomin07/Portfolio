// CUSTOM CURSOR
const cur = document.getElementById('cur');
const trail = document.getElementById('cur-trail');
let mx = 0;
let my = 0;
let tx = 0;
let ty = 0;

document.addEventListener('mousemove', event => {
  mx = event.clientX;
  my = event.clientY;
  cur.style.cssText += `left:${mx}px;top:${my}px;transform:translate(-50%,-50%)`;
});

(function animateCursor() {
  tx += (mx - tx) * 0.1;
  ty += (my - ty) * 0.1;
  trail.style.cssText = `left:${tx}px;top:${ty}px;transform:translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
})();

// LOADER
const labels = ['Initializing...', 'Loading assets...', 'Building scene...', 'Almost there...', 'Ready.'];
let pct = 0;
const loader = document.getElementById('loader');
const lnum = document.getElementById('ln');
const lbar = document.getElementById('lb');
const llabel = document.getElementById('loader-label');
let loaderHidden = false;

const lInterval = setInterval(() => {
  pct = Math.min(pct + 2, 100);
  lnum.textContent = Math.floor(pct);
  lbar.style.width = `${pct}%`;
  llabel.textContent = labels[Math.min(Math.floor(pct / 25), 4)];

  if (pct >= 100 && !loaderHidden) {
    loaderHidden = true;
    clearInterval(lInterval);
    setTimeout(() => {
      if (loader) {
        loader.style.display = 'none';
      }
      animHeroIn();
    }, 400);
  }
}, 40);

setTimeout(() => {
  if (!loaderHidden) {
    loaderHidden = true;
    if (loader) {
      loader.style.display = 'none';
    }
    animHeroIn();
  }
}, 10000);

function animHeroIn() {
  const nav = document.getElementById('main-nav');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const lines = document.querySelectorAll('.hero-name-line');
  const role = document.querySelector('.hero-role');
  const desc = document.querySelector('.hero-desc');
  const cta = document.querySelector('.hero-cta');
  const scroll = document.querySelector('.hero-scroll');
  const right = document.querySelector('.hero-right');

  if (nav) {
    nav.style.transition = 'opacity .6s ease';
    nav.style.opacity = '1';
  }

  function reveal(element, delay, transform) {
    if (!element) return;
    setTimeout(() => {
      element.style.transition = 'opacity .7s ease, transform .7s ease';
      element.style.opacity = '1';
      if (transform) {
        element.style.transform = transform;
      }
    }, delay);
  }

  reveal(eyebrow, 200);
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.style.transition = 'transform .8s cubic-bezier(.23,1,.32,1), opacity .8s ease';
      line.style.transform = 'translateY(0)';
      line.style.opacity = '1';
    }, 400 + index * 150);
  });
  reveal(role, 800);
  reveal(desc, 1000);
  reveal(cta, 1200);
  reveal(scroll, 1600);
  if (right) {
    reveal(right, 1400);
  }
}

// THREE.JS BACKGROUND
(function () {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 6;

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener('resize', resize);

  const N = 1200;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    if (Math.random() < 0.5) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0.8;
    } else {
      colors[i * 3] = 0.48;
      colors[i * 3 + 1] = 0.23;
      colors[i * 3 + 2] = 0.93;
    }
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  scene.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.55 })));

  function wire(geo, color, x, y, z) {
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 });
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo), material);
    lines.position.set(x, y, z);
    scene.add(lines);
    return lines;
  }

  const objs = [
    wire(new THREE.IcosahedronGeometry(1.2, 0), 0x00ffcc, 3, 1.5, -3),
    wire(new THREE.OctahedronGeometry(0.9, 0), 0x7c3aed, -3.5, 0.5, -2),
    wire(new THREE.TorusGeometry(0.7, 0.2, 8, 20), 0x00ffcc, 0.5, 3, -4),
    wire(new THREE.BoxGeometry(1, 1, 1), 0x7c3aed, -2, -2.5, -3),
    wire(new THREE.IcosahedronGeometry(0.6, 0), 0x00ffcc, 4, -2, -2),
    wire(new THREE.TetrahedronGeometry(0.8, 0), 0x7c3aed, 1, -3, -3),
  ];

  const gridGeo = new THREE.BufferGeometry();
  const gridPoints = [];
  const gs = 20;
  const gc = 30;

  for (let i = 0; i <= gc; i++) {
    const x = (i / gc - 0.5) * gs;
    gridPoints.push(x, -gs / 2, -6, x, gs / 2, -6);
  }

  for (let i = 0; i <= gc; i++) {
    const y = (i / gc - 0.5) * gs;
    gridPoints.push(-gs / 2, y, -6, gs / 2, y, -6);
  }

  gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridPoints), 3));
  scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0x1a1a3a, transparent: true, opacity: 0.4 })));

  let mvx = 0;
  let mvy = 0;
  document.addEventListener('mousemove', event => {
    mvx = (event.clientX / innerWidth - 0.5) * 0.8;
    mvy = -(event.clientY / innerHeight - 0.5) * 0.8;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.006;

    objs.forEach((o, i) => {
      o.rotation.x += 0.003 * (i % 2 ? 1 : -1);
      o.rotation.y += 0.005 * (i % 3 ? 1 : -1);
      o.position.y += Math.sin(t + i * 1.2) * 0.003;
    });

    camera.position.x += (mvx - camera.position.x) * 0.04;
    camera.position.y += (mvy - camera.position.y) * 0.04;
    camera.position.z = 6 + scrollY * 0.002;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const scrollItems = [
    { selector: '.s-label', animation: { x: -60, opacity: 0, duration: 1, ease: 'power3.out' } },
    { selector: '.s-title', animation: { y: 60, opacity: 0, scale: 0.9, duration: 1.1, ease: 'back.out(1.5)' } },
    { selector: '.s-divider', animation: { scaleX: 0, opacity: 0, duration: 1.2, ease: 'power2.inOut' } },
  ];

  scrollItems.forEach(item => {
    gsap.utils.toArray(item.selector).forEach(el => {
      gsap.from(el, {
        ...item.animation,
        scrollTrigger: { trigger: el, start: 'top 90%', invalidateOnRefresh: true },
      });
    });
  });

  const timedAnimations = [
    { selector: '.about-orb', props: { scale: 0.5, opacity: 0, duration: 1.4, ease: 'back.out(1.7)' }, trigger: '.about-grid', start: 'top 75%' },
    { selector: '.about-text p', props: { y: 40, opacity: 0, stagger: 0.2, duration: 0.9, ease: 'power2.out' }, trigger: '.about-text', start: 'top 80%' },
    { selector: '.pill', props: { scale: 0.6, opacity: 0, stagger: 0.06, duration: 0.7, ease: 'back.out(2)' }, trigger: '.tech-pill-group', start: 'top 85%' },
    { selector: '.sk-card', props: { y: 80, opacity: 0, stagger: 0.2, duration: 1.1, ease: 'power3.out' }, trigger: '.skills-grid', start: 'top 75%' },
    { selector: '.proj', props: { y: 100, opacity: 0, scale: 0.9, stagger: 0.15, duration: 1.2, ease: 'power3.out', clearProps: 'transform,opacity' }, trigger: '.projects-grid', start: 'top 75%' },
    { selector: '.cert-item', props: { y: 70, opacity: 0, scale: 0.9, stagger: 0.12, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }, trigger: '.certs-grid', start: 'top 80%' },
    { selector: '.c-link', props: { x: -40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' }, trigger: '.contact-links', start: 'top 85%' },
    { selector: '.contact-form', props: { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity' }, trigger: '.contact-form', start: 'top 85%' },
  ];

  timedAnimations.forEach(item => {
    gsap.from(item.selector, {
      ...item.props,
      scrollTrigger: { trigger: item.trigger, start: item.start, invalidateOnRefresh: true },
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();

  if (typeof emailjs !== 'undefined') {
    emailjs.init('GdJVrVx4qe67-N812');
  }

  const form = document.getElementById('contact-form');
  const popup = document.getElementById('success-popup');
  const button = document.getElementById('send-btn');

  if (form && popup && button) {
    popup.style.display = 'none';
    button.addEventListener('click', event => {
      event.preventDefault();

      emailjs.sendForm('service_a350j06', 'template_66xrosq', form)
        .then(() => {
          popup.style.display = 'flex';
          form.reset();
        })
        .catch(error => {
          console.error('EmailJS error:', error);
          alert('Failed to send message. Please try again.');
        });
    });
  }
});

// PROJECT CARD FOG & HOVER
const projectCards = document.querySelectorAll('.proj');
projectCards.forEach(card => {
  const fog = document.createElement('div');
  fog.className = 'proj-fog';
  card.appendChild(fog);

  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const px = `${x}%`;
    const py = `${y}%`;

    card.style.setProperty('--mx', px);
    card.style.setProperty('--my', py);
    fog.style.background = `radial-gradient(ellipse 200px 140px at ${px} ${py}, rgba(0,255,204,.10) 0%, transparent 70%)`;
  });
});

// ATMOSPHERE FOG ORBS
const projSection = document.getElementById('projects');
if (projSection) {
  projSection.style.position = 'relative';

  const orb1 = document.createElement('div');
  orb1.className = 'fog-orb';
  orb1.style.cssText = 'width:400px;height:400px;background:rgba(0,255,204,.04);top:10%;left:-100px;animation-delay:0s;position:absolute';
  projSection.appendChild(orb1);

  const orb2 = document.createElement('div');
  orb2.className = 'fog-orb';
  orb2.style.cssText = 'width:300px;height:300px;background:rgba(124,58,237,.05);bottom:10%;right:-80px;animation-delay:-3s;position:absolute';
  projSection.appendChild(orb2);
}

const certsSection = document.getElementById('certs');
if (certsSection) {
  certsSection.style.position = 'relative';

  const orb3 = document.createElement('div');
  orb3.className = 'fog-orb';
  orb3.style.cssText = 'width:350px;height:350px;background:rgba(167,139,250,.04);top:20%;right:-60px;animation-delay:-2s;position:absolute';
  certsSection.appendChild(orb3);
}

function switchTab(tab, panelId) {
  document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));

  tab.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('active');
  }
}

function closePopup() {
  const popup = document.getElementById('success-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

function openResume(e) {
  e.preventDefault();
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeResume() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

const resumeModal = document.getElementById('resume-modal');
if (resumeModal) {
  resumeModal.addEventListener('click', function(event) {
    if (event.target === this) {
      closeResume();
    }
  });
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeResume();
  }
});
