/**
 * 众水不灭 · 雅歌之印
 * 文件名: js/romantic-rose.js
 * 作用: 门禁背景专属 3D 粒子玫瑰与极客代码渲染引擎 (物理隔离，零污染)
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
    
    // 3D 粒子相关
    this.particles = [];
    this.angleY = 0;
    this.fov = 300;
    
    // 代码滚动相关
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
      "    all_points.append((x, y, size))",
      "def render(self, render_canvas, render_frame):",
      "    for x, y, size in self.parameters.all_points[render_frame]:",
      "        render_canvas.create_rectangle(x, y, x + size, y + size, fill=COLOR)",
      "if __name__ == '__main__':",
      "    root = Tk()",
      "    root.title('Crystal Rose')",
      "    canvas = Canvas(root, bg='black')",
      "    canvas.pack()",
      "    rose = CrystalRose()",
      "    draw(root, canvas, rose)",
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
      
      this.generateRoseParticles();
      
      // 初始化代码滚动行
      for (let i = 0; i < 40; i++) {
        this.codeLines.push({
          text: this.pythonSnippets[Math.floor(Math.random() * this.pythonSnippets.length)],
          opacity: Math.random() * 0.5 + 0.2
        });
      }

      this.isRendering = true;
      this.container.style.opacity = '0.85'; // 优雅淡入
      this.render();

    } catch (e) {
      console.error("[RoseEngine] 引擎初始化失败，已安全降级:", e);
      this.destroy();
    }
  }

  resize() {
    try {
      const dpr = window.devicePixelRatio || 1;
      
      // 处理代码层画布
      const codeRect = this.codeCanvas.parentElement.getBoundingClientRect();
      this.codeCanvas.width = codeRect.width * dpr;
      this.codeCanvas.height = codeRect.height * dpr;
      this.codeCtx.scale(dpr, dpr);

      // 处理粒子层画布
      const particleRect = this.particleCanvas.parentElement.getBoundingClientRect();
      this.particleCanvas.width = particleRect.width * dpr;
      this.particleCanvas.height = particleRect.height * dpr;
      this.particleCtx.scale(dpr, dpr);

      // 动态调整视角深度以适配移动端
      this.fov = particleRect.width < 500 ? 200 : 350;
    } catch (e) {
      // 捕获异常，确保不阻塞主线程
    }
  }

  generateRoseParticles() {
    this.particles = [];
    const particleCount = 4500; // 在性能与视觉中取平衡

    // 核心算法：参数化 3D 玫瑰曲面生成
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * 24; // 卷曲层数
      const v = Math.random();
      
      // 花瓣公式
      const r = 100 * (1 - v) * (1 + 0.3 * Math.sin(u * 2));
      const x = r * Math.cos(u) * Math.sin(v * Math.PI);
      const z = r * Math.sin(u) * Math.sin(v * Math.PI);
      const y = -140 * v + 60; // 从下往上的纵深

      // 添加混沌噪声，使其更有“粒子感”
      const noiseX = (Math.random() - 0.5) * 8;
      const noiseY = (Math.random() - 0.5) * 8;
      const noiseZ = (Math.random() - 0.5) * 8;

      // 花瓣颜色分布：外层偏粉白，内层深红
      const colorRatio = v;
      let color;
      if (colorRatio > 0.7) color = '#fecdd3';
      else if (colorRatio > 0.4) color = '#fb7185';
      else if (colorRatio > 0.2) color = '#e11d48';
      else color = '#9f1239';

      this.particles.push({
        x: x + noiseX,
        y: y + noiseY,
        z: z + noiseZ,
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
    } catch (e) {
      console.warn("[RoseEngine] 渲染帧抛出异常:", e);
    }

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  drawCode() {
    const w = this.codeCanvas.width / (window.devicePixelRatio || 1);
    const h = this.codeCanvas.height / (window.devicePixelRatio || 1);
    
    this.codeCtx.clearRect(0, 0, w, h);
    
    this.codeCtx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    this.codeCtx.textAlign = 'left';
    
    const lineHeight = 20;
    this.codeOffset -= 0.5; // 向上滚动速度
    
    if (this.codeOffset < -lineHeight) {
      this.codeOffset = 0;
      this.codeLines.shift();
      this.codeLines.push({
        text: this.pythonSnippets[Math.floor(Math.random() * this.pythonSnippets.length)],
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    for (let i = 0; i < this.codeLines.length; i++) {
      const line = this.codeLines[i];
      const y = i * lineHeight + this.codeOffset;
      
      if (y > 0 && y < h + lineHeight) {
        this.codeCtx.fillStyle = `rgba(244, 63, 94, ${line.opacity})`; // 浪漫粉色代码
        this.codeCtx.fillText(line.text, 20, y);
      }
    }
  }

  drawRose() {
    const w = this.particleCanvas.width / (window.devicePixelRatio || 1);
    const h = this.particleCanvas.height / (window.devicePixelRatio || 1);
    const centerX = w / 2;
    const centerY = h / 2 + 20; // 略微偏下，留出空间

    this.particleCtx.clearRect(0, 0, w, h);

    this.angleY += 0.006; // 匀速自转
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);

    // 计算透视投影与排序 (Z-buffer)
    const projected = [];
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // 绕 Y 轴旋转
      const rotX = p.x * cosY - p.z * sinY;
      const rotZ = p.x * sinY + p.z * cosY;
      
      // 3D 投影至 2D 屏幕
      const scale = this.fov / (this.fov + rotZ);
      const screenX = centerX + rotX * scale;
      const screenY = centerY + p.y * scale;
      
      // 仅渲染视口内的粒子以节约性能
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

    // 从远到近排序（画家算法），保证 3D 纵深感
    projected.sort((a, b) => b.z - a.z);

    // 批量渲染粒子
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      this.particleCtx.fillStyle = p.color;
      this.particleCtx.fillRect(p.x, p.y, p.size, p.size);
    }
  }

  destroy() {
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeHandler);
    
    if (this.container) this.container.style.opacity = '0';
    if (this.codeCtx && this.codeCanvas) this.codeCtx.clearRect(0, 0, this.codeCanvas.width, this.codeCanvas.height);
    if (this.particleCtx && this.particleCanvas) this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
    
    this.particles = [];
    this.codeLines = [];
    console.log("[RoseEngine] 粒子引擎已物理销毁，释放内存。");
  }
}

// 自动挂载至全局对象，等待生命周期调度
window.RomanticRoseEngine = RomanticRoseEngine;
