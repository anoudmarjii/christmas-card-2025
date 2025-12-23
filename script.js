const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

const neonColors = ["#ff4fd8", "#3fa9f5", "#3cff88"]; // pink, blue, green

let stars = [];
let dims = null;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  // canvas CSS size
  const w = window.innerWidth;
  const h = window.innerHeight;

  // set drawing buffer size (retina)
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);

  // draw in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // recompute geometry every time
  dims = getTreeDimensions(w, h);

  // rebuild stars to match new size
  createTree();
}

function getTreeDimensions(w, h) {
  const isMobile = w < 600;

  return {
    centerX: w / 2,
    baseY: isMobile ? h * 0.60 : h * 0.75,
    height: isMobile ? h * 0.48 : h * 0.60,
    maxRadius: isMobile ? Math.min(w * 0.34, 140) : 160,
    turns: isMobile ? 7 : 8,
    count: isMobile ? 420 : 550
  };
}

class Star {
  constructor(angle, radius, yOffset, color) {
    this.angle = angle;
    this.radius = radius;
    this.yOffset = yOffset;
    this.color = color;
    this.rotation = Math.random() * Math.PI;
  }

  update() {
    this.angle += 0.02;
    this.rotation += 0.05;
  }

  drawStar(x, y, spikes = 5, outerRadius = 4, innerRadius = 2) {
    let rot = this.rotation;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += Math.PI / spikes;

      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += Math.PI / spikes;
    }
    ctx.closePath();
  }

  draw() {
    const x = dims.centerX + Math.cos(this.angle) * this.radius;
    const y = dims.baseY - this.yOffset;

    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    this.drawStar(x, y);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function createTree() {
  stars = [];
  const { turns, count, maxRadius, height } = dims;

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const angle = progress * Math.PI * 2 * turns;
    const radius = (1 - progress) * maxRadius;
    const yOffset = progress * height;
    const color = neonColors[i % neonColors.length];

    stars.push(new Star(angle, radius, yOffset, color));
  }
}

function animate() {
  // clear in CSS pixels (not canvas.width)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const star of stars) {
    star.update();
    star.draw();
  }

  requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 150));
