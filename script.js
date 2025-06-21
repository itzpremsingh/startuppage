const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
let mouse = { x: null, y: null, radius: 100 };

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (query) {
    window.location.href = "https://chatgpt.com/?q=${encodeURIComponent(query)}";
  } else {
    searchInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      searchInput.style.animation = '';
    }, 500);
  }
});

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function createParticles(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: `hsla(${Math.random() * 360}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`,
      originalColor: `hsla(${Math.random() * 360}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`
    });
  }
  return arr;
}

particles = createParticles(window.innerWidth < 768 ? 100 : 200);

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const opacity = 1 - distance / 120;
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, 'rgba(15, 12, 41, 0.8)');
  gradient.addColorStop(1, 'rgba(36, 34, 62, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    if (mouse.x && mouse.y) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius * 0.6;
        p.dx = -dx / distance * force;
        p.dy = -dy / distance * force;
        p.color = `hsla(${(p.x / width * 360)}, 100%, 70%, 0.8)`;
      } else {
        p.dx += (Math.random() - 0.5) * 0.2;
        p.dy += (Math.random() - 0.5) * 0.2;
        p.color = p.originalColor;
      }
    }

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > width) p.dx *= -0.8;
    if (p.y < 0 || p.y > height) p.dy *= -0.8;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  connectParticles();
  requestAnimationFrame(animate);
}

animate();

document.addEventListener('mousemove', (e) => {
  const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
  const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
  document.querySelector('.content').style.transform =
    `translate(-50%, -50%) rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateZ(20px)`;
});

document.addEventListener('mouseleave', () => {
  document.querySelector('.content').style.transform =
    'translate(-50%, -50%) rotateY(0) rotateX(0) translateZ(20px)';
});
