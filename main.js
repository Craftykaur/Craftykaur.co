// --- Interactive Showcase Setup ---

// Define materials, geometries, and metadata for each piece
const piecesConfig = {
  photo_block: {
    title: 'Family Photo Keepsake Block',
    desc: 'Preserve your cherished family memories inside a crystal-clear, high-gloss resin block, framed with gold flakes and delicate dried flowers.',
    texturePath: './assets/family_photo_resin.jpg',
  },
  garland_block: {
    title: 'Wedding Garland Square Block',
    desc: 'A heavy, optical-grade square resin block preserving actual wedding flowers, garlands, and gold leaf shards forever.',
    texturePath: './assets/resin_mk_plaque.jpg',
  },
  rose_plaque: {
    title: 'Rose & Pearl Round Plaque',
    desc: 'Elegant tabletop plaque preserving wedding roses, gold accents, and pearls with custom date lettering.',
    texturePath: './assets/resin_ad_plaque.jpg',
  },
  geode: {
    title: 'Amethyst Geode Canvas',
    desc: 'Textured raw crystal points, sparkling amethyst color gradients, and rich veins of shimmering gold leaf under a glass finish.',
    texturePath: './assets/geode_art.jpg',
  },
  ocean_clock: {
    title: 'Ocean Wave Resin Clock',
    desc: 'Luxury round wall clock blending natural live-edge walnut wood with multi-layered glossy blue ocean resin waves and golden minimalist hands.',
    texturePath: './assets/ocean_clock.jpg',
  },
  monogram_m: {
    title: 'Bridal Monogram Keepsake',
    desc: 'A thick, freestanding monogram letter \'M\' block made of clear resin, preserving dried wedding roses, foliage, and shimmering gold leaf.',
    texturePath: './assets/monogram_m.jpg',
  },
  nebula_disc: {
    title: 'Cosmic Nebula Plaque',
    desc: 'Circular tabletop art piece depicting a glowing galactic nebula made with swirling violet, indigo, and gold pigments and star glitter.',
    texturePath: './assets/nebula_disc.jpg',
  }
};

let currentPieceId = 'photo_block';

function showPiece(id) {
  const config = piecesConfig[id];
  if (!config) return;

  const imgElement = document.getElementById('showcase-img');
  
  // Smooth fade transition
  imgElement.style.opacity = 0;
  
  setTimeout(() => {
    imgElement.src = config.texturePath;
    imgElement.alt = config.title;
    
    // Update DOM descriptors
    document.getElementById('viewer-title').innerText = config.title;
    document.getElementById('viewer-desc').innerText = config.desc;
    
    imgElement.style.opacity = 1;
  }, 200);
}

// Toggle Live Showcase Pieces
document.querySelectorAll('.viewer-toggle').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.viewer-toggle').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const pieceId = e.target.getAttribute('data-piece');
    currentPieceId = pieceId;
    showPiece(pieceId);
  });
});

// Scroll to viewer and select piece when "View in Showcase" is clicked
document.querySelectorAll('.view-showcase-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    const pieceId = card.getAttribute('data-piece');
    if (!pieceId) return;
    
    // Toggle active state in buttons
    document.querySelectorAll('.viewer-toggle').forEach(b => {
      if (b.getAttribute('data-piece') === pieceId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    
    currentPieceId = pieceId;
    showPiece(pieceId);
    
    // Smooth scroll to hero section (where viewer resides)
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });
});


// --- Fluid Resin Art Effect Background (Resin Stream & Gold Veins & Sparkles Simulation) ---

const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');

let streams = [];
let goldVeins = [];
let sparkles = [];

class ResinStream {
  constructor(yOffset, color, speed, amplitude, frequency) {
    this.yOffset = yOffset;
    this.color = color;
    this.speed = speed;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.time = Math.random() * 100;
  }
  
  update() {
    this.time += this.speed;
  }
  
  draw() {
    bgCtx.beginPath();
    bgCtx.strokeStyle = this.color;
    bgCtx.lineWidth = 140 + Math.sin(this.time) * 40; // Thick fluid pour width
    bgCtx.lineCap = 'round';
    bgCtx.lineJoin = 'round';
    
    // Add canvas blur filter for soft liquid resin look
    bgCtx.filter = 'blur(40px)';
    
    const steps = 10;
    const stepSize = bgCanvas.width / steps;
    const points = [];
    
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize;
      const y = this.yOffset + Math.sin(i * this.frequency + this.time) * this.amplitude;
      points.push({ x, y });
    }
    
    bgCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      bgCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    bgCtx.stroke();
    
    // Reset filter for other drawings
    bgCtx.filter = 'none';
  }
}

class GoldVein {
  constructor(stream) {
    this.stream = stream;
    this.offsetY = (Math.random() - 0.5) * 50;
  }
  
  draw() {
    bgCtx.beginPath();
    bgCtx.strokeStyle = 'rgba(212, 175, 55, 0.22)'; // Elegant metallic gold vein
    bgCtx.lineWidth = 1.5 + Math.sin(this.stream.time * 2) * 0.8;
    
    const steps = 15;
    const stepSize = bgCanvas.width / steps;
    
    for (let i = 0; i <= steps; i++) {
      const x = i * stepSize;
      const y = this.stream.yOffset + Math.sin(i * this.stream.frequency + this.stream.time) * this.stream.amplitude + this.offsetY + Math.cos(i + this.stream.time) * 10;
      if (i === 0) {
        bgCtx.moveTo(x, y);
      } else {
        bgCtx.lineTo(x, y);
      }
    }
    bgCtx.stroke();
  }
}

class GoldSparkle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    // Tiny flakes with occasional slightly larger shards
    this.size = Math.random() > 0.85 ? (Math.random() * 2.5 + 1.8) : (Math.random() * 1.2 + 0.6);
    this.speedX = (Math.random() - 0.5) * 0.12;
    this.speedY = -Math.random() * 0.22 - 0.05; // slowly floats upwards
    this.opacity = Math.random() * 0.65 + 0.35; // semi-transparent
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.025; // slow spin
    
    // Generate irregular polygon vertices to represent gold leaf shards
    this.vertices = [];
    const numVertices = 4 + Math.floor(Math.random() * 3); // 4 to 6 vertices
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.6; // irregular radius offset
      this.vertices.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += this.spin;
    // Reset if it floats off screen
    if (this.y < -15 || this.x < -15 || this.x > bgCanvas.width + 15) {
      this.reset();
      this.y = bgCanvas.height + 10; // start from bottom
    }
  }
  draw() {
    bgCtx.save();
    bgCtx.translate(this.x, this.y);
    bgCtx.rotate(this.angle);
    bgCtx.scale(this.size, this.size);
    
    // Twinkling shimmer effect using angle and spin
    const shimmer = 0.4 + Math.sin(this.angle * 2) * 0.6;
    // Premium warm gold color
    bgCtx.fillStyle = `rgba(212, 175, 55, ${this.opacity * (0.3 + shimmer * 0.7)})`;
    
    bgCtx.beginPath();
    bgCtx.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (let i = 1; i < this.vertices.length; i++) {
      bgCtx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    bgCtx.closePath();
    bgCtx.fill();
    bgCtx.restore();
  }
}

function initBgCanvas() {
  resizeBgCanvas();
  
  // Define streams with y-offsets and speeds - Pure light theme (Milky, Pearl, Cream, Soft Gold)
  streams = [
    new ResinStream(bgCanvas.height * 0.22, 'rgba(255, 255, 255, 0.22)', 0.0012, 100, 0.25),   // Milky White pour
    new ResinStream(bgCanvas.height * 0.48, 'rgba(247, 245, 240, 0.28)', 0.0014, 120, 0.2),    // Cream/Alabaster pour
    new ResinStream(bgCanvas.height * 0.75, 'rgba(197, 154, 39, 0.06)', 0.001, 140, 0.15),     // Warm Champagne Gold pour
    new ResinStream(bgCanvas.height * 0.38, 'rgba(255, 253, 247, 0.24)', 0.0016, 90, 0.3)      // Soft Ivory pour
  ];
  
  // Attach metallic gold leaf veins running along the streams
  goldVeins = streams.map(stream => new GoldVein(stream));
  
  // Create more gold sparkles for rich texture (increased from 65 to 110)
  sparkles = Array.from({ length: 110 }, () => new GoldSparkle());
  
  animateBg();
}

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function animateBg() {
  // Clear with a trail smudge using light theme background color #fbfbfa
  bgCtx.fillStyle = 'rgba(251, 251, 250, 0.08)';
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  streams.forEach(stream => {
    stream.update();
    stream.draw();
  });
  
  goldVeins.forEach(vein => {
    vein.draw();
  });
  
  sparkles.forEach(sparkle => {
    sparkle.update();
    sparkle.draw();
  });
  
  requestAnimationFrame(animateBg);
}

window.addEventListener('resize', () => {
  resizeBgCanvas();
});


// Initialize everything on window load
window.addEventListener('load', () => {
  showPiece(currentPieceId);
  initBgCanvas();
});

// --- Contact Form redirection to WhatsApp ---
document.getElementById('commission-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const interestSelect = document.getElementById('interest');
  const interestText = interestSelect.options[interestSelect.selectedIndex].text;
  const details = document.getElementById('message').value;
  
  // Format WhatsApp message with formatting
  const text = `Hi Crafty Kaur,\n\nI would like to make an inquiry:\n\n*Name:* ${name}\n*Email:* ${email}\n*Interested In:* ${interestText}\n*Details:* ${details}`;
  const encodedText = encodeURIComponent(text);
  
  // Open WhatsApp direct link with message
  const whatsappUrl = `https://wa.me/917015353872?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank');
});

// --- Gallery Filtering Logic ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Set active class
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const filterValue = e.target.getAttribute('data-filter');
    
    document.querySelectorAll('.gallery-card').forEach(card => {
      if (filterValue === 'all') {
        card.style.display = 'block';
        card.style.animation = 'slideUpFade 0.5s ease forwards';
      } else {
        const category = card.getAttribute('data-category');
        if (category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'slideUpFade 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
});
