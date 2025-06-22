const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ========== Search Form ==========
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `https://chatgpt.com/?q=${encodeURIComponent(query)}`;
  } else {
    searchInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      searchInput.style.animation = '';
    }, 500);
  }
});

// ========== 3D Mouse Effect ==========
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

// ========== Canvas Animation (Desktop Only) ==========
if (!isMobile) {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  let mouse = { x: null, y: null, radius: 100 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.width = window.innerWidth * ratio;
    height = canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function createParticles(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: `hsla(${Math.random() * 360}, 100%, 70%, 0.8)`,
        originalColor: `hsla(${Math.random() * 360}, 100%, 70%, 0.8)`
      });
    }
    return arr;
  }

  particles = createParticles(window.innerWidth < 768 ? 100 : 200);

  function animate() {
    ctx.fillStyle = 'rgba(15, 12, 41, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (mouse.x && mouse.y) {
        const dx = mouse.x * window.devicePixelRatio - p.x;
        const dy = mouse.y * window.devicePixelRatio - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius * window.devicePixelRatio) {
          const force = (mouse.radius * window.devicePixelRatio - distance) / (mouse.radius * window.devicePixelRatio) * 0.6;
          p.dx = -dx / distance * force;
          p.dy = -dy / distance * force;
          p.color = `hsla(${(p.x / width * 360)}, 100%, 70%, 0.8)`;
        } else {
          p.dx += (Math.random() - 0.5) * 0.1;
          p.dy += (Math.random() - 0.5) * 0.1;
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
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
}
