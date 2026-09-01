/**
 * 众水不灭 · 雅歌之印
 * 文件名: js/romantic-rose.js
 * 作用: 门禁专属 3D 粒子代码引擎 (完全复刻图2: 钻石/泪滴状粒子云与代码滚动)
 */

class RomanticRoseEngine {
  constructor() {
    this.codeCanvas = document.getElementById('rose-code-canvas');
    this.particleCanvas = document.getElementById('rose-particle-canvas');
    this.container = document.getElementById('romantic-rose-container');
    
    this.codeCtx = null;
    this.particleCtx = null;
    
    this.animationFrameId = null;
    this.isRendering = false;
    
    // 3D 粒子
    this.particles = [];
    this.angleY = 0;
    this.fov = 300;
    
    // 代码滚动 (复刻图2中的 Python 代码)
    this.codeLines = [];
    this.codeOffset = 0;
    this.pythonSnippets = [
      "def calc(self, generate_frame):",
      "    x = random.randint(-14, 14)",
      "    y = random.randint(-14, 14)",
      "    size = random.choice((1, 2, 2))",
      "    all_points.append((x, y, size))",
      "for x, y in self.parameters.points:",
      "    x, y = self.calc_position(x, y, ratio)",
      "    size = random.randint(1, 3)",
      "    canvas.pack()",
      "    draw(root, canvas, rose)",
      "def render(self, render_canvas, render_frame):",
      "    for x, y, size in self.parameters.all_points[render_frame]:",
      "        if size == 2:",
      "            render_canvas.create_rectangle(x, y, x + size, y + size)",
      "if __name__ == '__main__':",
      "    root = Tk()",
      "    root.title('Crystal Rose')",
      "    canvas = Canvas(root, bg='black')",
      "    canvas.pack()",
      "    rose = Heart()",
      "    root.mainloop()"
    ];

    this.resizeHandler = this.resize.bind(this);
  }

  init() {
    if (!this.codeCanvas || !this.particleCanvas || !this.container) {
      console.warn("[RoseEngine] 缺少必要的 DOM 容器，引擎初始化中止。");
      return;
    }

    try {
      this.codeCtx = this.codeCanvas.getContext('2d', { alpha: true });
      this.particleCtx = this.particleCanvas.getContext('2d', { alpha: true });
      
      window.addEventListener('resize', this.resizeHandler);
      this.resize();
      
      this.generateTeardropParticles(); // 使用专为图2推演的数学模型
      
      for (let i = 0; i < 45; i++) {
        this.codeLines.push({
          text: this.pythonSnippets[Math.floor(Math.random() * this.pythonSnippets.length)],
          opacity: Math.random() * 0.4 + 0.1
        });
      }

      this.isRendering = true;
      this.container.style.opacity = '1';
      this.render();

    } catch (e) {
      console.error("[RoseEngine] 引擎初始化失败，已安全降级:", e);
      this.destroy();
    }
  }

  resize() {
    try {
      const dpr = window.devicePixelRatio || 1;
      
      const codeRect = this.codeCanvas.parentElement.getBoundingClientRect();
      this.codeCanvas.width = codeRect.width * dpr;
      this.codeCanvas.height = codeRect.height * dpr;
      this.codeCtx.scale(dpr, dpr);

      const particleRect = this.particleCanvas.parentElement.getBoundingClientRect();
      this.particleCanvas.width = particleRect.width * dpr;
      this.particleCanvas.height = particleRect.height * dpr;
      this.particleCtx.scale(dpr, dpr);

      // 移动端动态调整景深
      this.fov = particleRect.width < 500 ? 180 : 350;
    } catch (e) {}
  }

  generateTeardropParticles() {
    this.particles = [];
    const particleCount = 6500; // 高密度粒子云

    for (let i = 0; i < particleCount; i++) {
      // Y轴: 1 为顶部尖端, -1 为底部圆盘
      const y = Math.random() * 2 - 1;
      
      // 核心公式：推演出的泪滴/钻石体积曲面 (R_max 随着 y 变化)
      const maxR = (1 - y) * Math.sqrt(1 + y) * 75;
      
      // 让粒子集中在外壳与核心 (图2的特征)
      const r = maxR * (Math.random() > 0.3 ? Math.pow(Math.random(), 0.3) : Math.pow(Math.random(), 1.5));
      
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);

      // 匹配图2的红紫色调梯度
      let color;
      if (y > 0.6) color = '#fbcfe8';       // 顶部粉白
      else if (y > 0.1) color = '#f43f5e';  // 中上亮红
      else if (y > -0.5) color = '#be123c'; // 中下深红
      else color = '#881337';               // 底部暗红

      // 加入混沌噪点增加极客感
      const noise = () => (Math.random() - 0.5) * 3;

      this.particles.push({
        x: x + noise(),
        y: -y * 110, // Y轴反转放大映射到屏幕
        z: z + noise(),
        size: Math.random() * 1.5 + 0.5,
        color: color
      });
    }
  }

  render() {
    if (!this.isRendering) return;
    try {
      this.drawCode();
      this.drawRose();
    } catch (e) {}
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  drawCode() {
    const w = this.codeCanvas.width / (window.devicePixelRatio || 1);
    const h = this.codeCanvas.height / (window.devicePixelRatio || 1);
    
    this.codeCtx.clearRect(0, 0, w, h);
    this.codeCtx.font = '13px ui-monospace, SFMono-Regular, Menlo, monospace';
    this.codeCtx.textAlign = 'left';
    
    const lineHeight = 22;
    this.codeOffset -= 0.6; 
    
    if (this.codeOffset < -lineHeight) {
      this.codeOffset = 0;
      this.codeLines.shift();
      this.codeLines.push({
        text: this.pythonSnippets[Math.floor(Math.random() * this.pythonSnippets.length)],
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    for (let i = 0; i < this.codeLines.length; i++) {
      const line = this.codeLines[i];
      const y = i * lineHeight + this.codeOffset;
      
      if (y > 0 && y < h + lineHeight) {
        // 图2中代码为暗红色系
        this.codeCtx.fillStyle = `rgba(190, 18, 60, ${line.opacity})`; 
        this.codeCtx.fillText(line.text, 20, y);
      }
    }
  }

  drawRose() {
    const w = this.particleCanvas.width / (window.devicePixelRatio || 1);
    const h = this.particleCanvas.height / (window.devicePixelRatio || 1);
    const centerX = w / 2;
    const centerY = h / 2 + 10; 

    this.particleCtx.clearRect(0, 0, w, h);

    this.angleY += 0.007; // 匀速旋转
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);

    const projected = [];
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      const rotX = p.x * cosY - p.z * sinY;
      const rotZ = p.x * sinY + p.z * cosY;
      
      const scale = this.fov / (this.fov + rotZ);
      const screenX = centerX + rotX * scale;
      const screenY = centerY + p.y * scale;
      
      if (screenX > -50 && screenX < w + 50 && screenY > -50 && screenY < h + 50) {
        projected.push({
          x: screenX,
          y: screenY,
          size: p.size * scale,
          color: p.color,
          z: rotZ
        });
      }
    }

    // 画家算法排序 (Z-buffer)
    projected.sort((a, b) => b.z - a.z);

    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      this.particleCtx.fillStyle = p.color;
      this.particleCtx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  destroy() {
    this.isRendering = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeHandler);
    
    if (this.container) this.container.style.opacity = '0';
    if (this.codeCtx && this.codeCanvas) this.codeCtx.clearRect(0, 0, this.codeCanvas.width, this.codeCanvas.height);
    if (this.particleCtx && this.particleCanvas) this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
    
    this.particles = [];
    this.codeLines = [];
  }
}

window.RomanticRoseEngine = RomanticRoseEngine;
