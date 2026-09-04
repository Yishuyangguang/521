/**
 * 众水不灭 · 雅歌之印 (Love Universe)
 * 文件名: js/birthday.js
 * 作用: 星轨生辰 3D 盲盒、时间锁降级保护、陀螺仪视差与 300DPI 极清海报渲染
 */

class BirthdayManager {
  constructor(config) {
    this.config = config || window.LOVE_CONFIG || {};
    this.capsules = this.config.birthdayCapsules || [];
    this.timerId = null;
    this.currentPerspective = localStorage.getItem("love_user_perspective") || "boy";
    this.tiltHandler = this.handleDeviceTilt.bind(this);
  }

  init() {
    this.renderCapsuleList();
    window.addEventListener("stage:opened", (e) => {
      if (e.detail && e.detail.stageId === "birthday") {
        this.renderCapsuleList();
        this.startCountdownLoop();
      }
    });
    window.addEventListener("stage:closed", () => {
      this.stopCountdownLoop();
      this.closeCardModal();
    });
  }

  startCountdownLoop() {
    this.stopCountdownLoop();
    this.timerId = setInterval(() => {
      this.renderCapsuleList();
    }, 1000);
  }

  stopCountdownLoop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  renderCapsuleList() {
    const container = document.getElementById("birthday-capsule-container");
    if (!container) return;

    this.capsules = (window.LOVE_CONFIG && window.LOVE_CONFIG.birthdayCapsules) || [];
    
    // 过滤出送给当前视角的礼物（或者显示所有，但区分状态）
    const myCapsules = this.capsules.filter(c => c.target === this.currentPerspective);

    if (myCapsules.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:#94a3b8; font-size:13.5px; line-height:1.6;">🌌<br>当前时空暂未探测到属于你的生辰胶囊。<br>等待对方在控制台为你封装专属惊喜吧...</div>`;
      return;
    }

    const now = Date.now();
    
    container.innerHTML = `<div class="bd-capsule-grid">` + myCapsules.map((cap, idx) => {
      const targetTime = new Date(cap.date).getTime();
      const isUnlocked = now >= targetTime;
      const isToday = isUnlocked && (now - targetTime < 24 * 60 * 60 * 1000);

      if (isUnlocked) {
        return `
          <div class="bd-capsule-card unlocked" onclick="window.BirthdayInstance.openCardModal('${cap.id}')">
            <div class="bd-capsule-icon">✨</div>
            <div class="bd-capsule-title">专属时空贺卡已解锁</div>
            <div class="bd-capsule-subtitle">${isToday ? '🎉 祝你生日快乐！点击拆开惊喜' : '💌 包含着满满的爱意与祝福'}</div>
            <div class="bd-capsule-btn">立即开启 ➔</div>
          </div>
        `;
      } else {
        const diff = targetTime - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return `
          <div class="bd-capsule-card locked">
            <div class="bd-capsule-icon">🔒</div>
            <div class="bd-capsule-title">时空胶囊尚未解锁</div>
            <div class="bd-capsule-subtitle">神秘的生日礼物正在路上...</div>
            <div class="bd-countdown-box">
              <div class="bd-cd-item"><span>${d}</span><small>天</small></div>:
              <div class="bd-cd-item"><span>${String(h).padStart(2, '0')}</span><small>时</small></div>:
              <div class="bd-cd-item"><span>${String(m).padStart(2, '0')}</span><small>分</small></div>:
              <div class="bd-cd-item"><span>${String(s).padStart(2, '0')}</span><small>秒</small></div>
            </div>
          </div>
        `;
      }
    }).join("") + `</div>`;
  }

  openCardModal(id) {
    const cap = this.capsules.find(c => c.id === id);
    if (!cap) return;

    let modal = document.getElementById("bd-3d-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bd-3d-modal";
      modal.className = "bd-3d-modal";
      document.body.appendChild(modal);
    }

    if (window.Effects) {
      window.Effects.playAudio("gatekeeperPass");
      window.Effects.fireConfetti();
    }

    const tplClass = `bd-tpl-${cap.template || 'A'}`;
    const escapedMsg = this.escapeHtml(cap.message || "").replace(/\n/g, "<br>");
    
    // 渲染高定模版 DOM 结构
    modal.innerHTML = `
      <div class="bd-3d-overlay" onclick="window.BirthdayInstance.closeCardModal()"></div>
      <div class="bd-3d-scene">
        <button class="bd-close-btn" onclick="window.BirthdayInstance.closeCardModal()">✕</button>
        <div class="bd-card-wrapper" id="bd-card-wrapper">
          <div class="bd-card ${tplClass}">
            <div class="bd-card-glare"></div>
            <div class="bd-card-photo-box">
              ${cap.photo ? `<img src="${cap.photo}" class="bd-card-img" alt="回忆" crossorigin="anonymous">` : `<div class="bd-card-img-placeholder">🌌</div>`}
            </div>
            <div class="bd-card-content">
              <div class="bd-card-title">Happy Birthday</div>
              <div class="bd-card-msg">${escapedMsg}</div>
            </div>
            ${cap.template === 'D' ? `<div class="bd-card-stamp">LOVE</div>` : ''}
          </div>
        </div>
        <button class="bd-export-btn" id="bd-export-btn" onclick="window.BirthdayInstance.exportPoster('${cap.id}')">✨ 生成极清贺卡并分享</button>
      </div>
    `;

    setTimeout(() => modal.classList.add("active"), 50);

    // 绑定陀螺仪视差与鼠标跟随
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.tiltHandler, true);
    }
    const scene = modal.querySelector(".bd-3d-scene");
    if (scene) {
      scene.addEventListener("mousemove", (e) => {
        const wrapper = document.getElementById("bd-card-wrapper");
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 20;
        const rotateY = (x / rect.width) * 20;
        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        const glare = wrapper.querySelector(".bd-card-glare");
        if (glare) {
          glare.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
          glare.style.opacity = "0.6";
        }
      });
      scene.addEventListener("mouseleave", () => {
        const wrapper = document.getElementById("bd-card-wrapper");
        if (wrapper) wrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
      });
    }
  }

  handleDeviceTilt(e) {
    const wrapper = document.getElementById("bd-card-wrapper");
    if (!wrapper || !e.gamma || !e.beta) return;
    let x = e.gamma; 
    let y = e.beta;
    if (x > 30) x = 30; if (x < -30) x = -30;
    if (y > 60) y = 60; if (y < 0) y = 0; 
    
    const rotateY = x * 0.5;
    const rotateX = (y - 30) * -0.5;
    
    wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  closeCardModal() {
    const modal = document.getElementById("bd-3d-modal");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => { if(modal.parentNode) modal.remove(); }, 400);
    }
    window.removeEventListener("deviceorientation", this.tiltHandler, true);
  }

  async exportPoster(id) {
    const cap = this.capsules.find(c => c.id === id);
    if (!cap) return;

    const btn = document.getElementById("bd-export-btn");
    if (btn) {
      btn.disabled = true;
      btn.innerText = "⚙️ 正在生成 Retina 超清海报...";
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 采用 Retina 3x 分辨率标准，保障相册极限清晰度
      canvas.width = 1200;
      canvas.height = 1600;

      // 1. 绘制底层背景
      this.drawPosterBackground(ctx, cap.template || 'A');

      // 2. 加载并绘制照片
      if (cap.photo) {
        const img = await this.loadImage(cap.photo);
        this.drawPosterPhoto(ctx, img, cap.template || 'A');
      }

      // 3. 绘制文字与装饰
      this.drawPosterText(ctx, cap, cap.template || 'A');

      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      
      const link = document.createElement("a");
      link.download = `雅歌生辰_时空贺卡_${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      alert("⚠️ 生成海报失败: " + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerText = "✨ 生成极清贺卡并分享";
      }
    }
  }

  drawPosterBackground(ctx, tpl) {
    const w = 1200, h = 1600;
    if (tpl === 'A') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#0f172a"); grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)"; ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, w - 80, h - 80);
      ctx.fillStyle = "rgba(56, 189, 248, 0.1)"; ctx.fillRect(60, 60, w - 120, h - 120);
    } 
    else if (tpl === 'B') {
      const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, h);
      grad.addColorStop(0, "#27272a"); grad.addColorStop(1, "#000000");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 12;
      ctx.strokeRect(50, 50, w - 100, h - 100);
    }
    else if (tpl === 'C') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#fdfbf7"); grad.addColorStop(1, "#fce7f3");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(40, 40, w - 80, h - 80);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8; ctx.strokeRect(40, 40, w - 80, h - 80);
    }
    else if (tpl === 'D') {
      ctx.fillStyle = "#f3f4f6"; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
      ctx.fillRect(80, 80, w - 160, h - 160);
      ctx.shadowColor = "transparent";
    }
  }

  drawPosterPhoto(ctx, img, tpl) {
    if (!img) return;
    const px = 120, py = 120;
    const pw = 960, ph = 800;
    
    ctx.save();
    if (tpl === 'C') {
      // 柔和圆角
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, pw, ph, 40) : ctx.rect(px, py, pw, ph); ctx.clip();
    } else if (tpl === 'A' || tpl === 'B') {
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, pw, ph, 20) : ctx.rect(px, py, pw, ph); ctx.clip();
    }
    
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = pw / ph;
    let sx, sy, sw, sh;
    if (imgRatio > boxRatio) {
      sh = img.naturalHeight; sw = sh * boxRatio; sx = (img.naturalWidth - sw) / 2; sy = 0;
    } else {
      sw = img.naturalWidth; sh = sw / boxRatio; sx = 0; sy = (img.naturalHeight - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
    ctx.restore();
    
    if (tpl === 'D') {
      ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 2; ctx.strokeRect(px, py, pw, ph);
    }
  }

  drawPosterText(ctx, cap, tpl) {
    const textX = 120;
    const titleY = 1050;
    const msgY = 1140;
    
    ctx.textAlign = "left";
    
    if (tpl === 'A') {
      ctx.fillStyle = "#38bdf8"; ctx.font = "bold 60px monospace"; ctx.fillText("SYSTEM.BIRTHDAY // UNLOCKED", textX, titleY);
      ctx.fillStyle = "#e2e8f0"; ctx.font = "36px sans-serif";
    } else if (tpl === 'B') {
      ctx.fillStyle = "#fcd34d"; ctx.font = "bold 65px serif"; ctx.fillText("Happy Birthday", textX, titleY);
      ctx.fillStyle = "#d1d5db"; ctx.font = "36px serif";
    } else if (tpl === 'C') {
      ctx.fillStyle = "#9f1239"; ctx.font = "bold 70px serif"; ctx.fillText("Joyeux Anniversaire", textX, titleY);
      ctx.fillStyle = "#4b5563"; ctx.font = "36px serif";
    } else if (tpl === 'D') {
      ctx.fillStyle = "#111827"; ctx.font = "bold 70px monospace"; ctx.fillText("Happy Birthday.", textX, titleY);
      ctx.fillStyle = "#374151"; ctx.font = "italic 36px monospace";
    }

    const lines = (cap.message || "愿你一生被爱，眼里常有星辰大海。").split('\n');
    let currentY = msgY;
    lines.forEach(line => {
      currentY = this.wrapCanvasText(ctx, line, textX, currentY, 960, 56);
    });

    if (tpl === 'D') {
      ctx.fillStyle = "#e11d48"; ctx.font = "bold 40px sans-serif";
      ctx.save(); ctx.translate(950, 1400); ctx.rotate(-15 * Math.PI / 180);
      ctx.fillText("♥ LOVE", 0, 0); ctx.restore();
    }
  }

  wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(''); let line = '';
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n];
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n]; y += lineHeight;
      } else { line = testLine; }
    }
    ctx.fillText(line, x, y);
    return y + lineHeight;
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("图片加载失败"));
      img.src = url;
    });
  }

  escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

window.BirthdayInstance = new BirthdayManager();
