/**
 * 众水不灭 · 雅歌之印
 * 文件名: js/pet.js
 * 作用: 恩典灵宠状态管理、5阶进化晋升体系、自然日连胜增幅算法与深度自愈数据持久化
 * 持久化策略: 本地 LocalStorage 深度自愈 + 云端免密双向同步
 */

class GracePetManager {
  constructor(config) {
    this.config = config || window.LOVE_CONFIG || {};
    this.petData = this.loadLocalPetData();
  }

  /**
   * 5 阶形态与光芒值阈值常数定义
   */
  static getTierInfo(glowEnergy) {
    const energy = Math.max(0, Number(glowEnergy) || 0);
    if (energy >= 1000) {
      return {
        level: 5,
        title: "永恒之爱圣徒",
        icon: "👑🕊️",
        stageName: "神性形态",
        badgeColor: "#f43f5e",
        req: 1000,
        nextReq: null,
        desc: "皇冠加冕 · 众水不能熄灭，大水不能淹没"
      };
    }
    if (energy >= 600) {
      return {
        level: 4,
        title: "和平织梦者",
        icon: "🕊️✨",
        stageName: "圣灵形态",
        badgeColor: "#a855f7",
        req: 600,
        nextReq: 1000,
        desc: "金白双翼 · 在爱与恩典中编织永恒同心"
      };
    }
    if (energy >= 300) {
      return {
        level: 3,
        title: "舍己守护者",
        icon: "🍎🕊️",
        stageName: "青年形态",
        badgeColor: "#ef4444",
        req: 300,
        nextReq: 600,
        desc: "舍己之果 · 懂得在分歧中退让与包容"
      };
    }
    if (energy >= 100) {
      return {
        level: 2,
        title: "感恩使者",
        icon: "🕊️",
        stageName: "幼年形态",
        badgeColor: "#38bdf8",
        req: 100,
        nextReq: 300,
        desc: "恩典之露 · 记录平凡生活中的每一次感动"
      };
    }
    return {
      level: 1,
      title: "初信雏鸽",
      icon: "🐣",
      stageName: "雏鸽形态",
      badgeColor: "#f59e0b",
      req: 0,
      nextReq: 100,
      desc: "初萌爱意 · 开启一生一世的圣洁守望"
    };
  }

  /**
   * 自然日连胜倍率换算
   */
  static getStreakBonus(streakDays) {
    const days = Math.max(0, Number(streakDays) || 0);
    if (days >= 100) return { mult: 5.0, title: "永恒誓约 (5.0x)" };
    if (days >= 30)  return { mult: 3.0, title: "爱的信徒 (3.0x)" };
    if (days >= 14)  return { mult: 2.0, title: "坚定不移 (2.0x)" };
    if (days >= 7)   return { mult: 1.5, title: "持之以恒 (1.5x)" };
    if (days >= 3)   return { mult: 1.2, title: "初露锋芒 (1.2x)" };
    return { mult: 1.0, title: "每日同行 (1.0x)" };
  }

  /**
   * 获取标准化自然日字符串 (YYYY-MM-DD)
   */
  getTodayDateStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /**
   * 1. 深度自愈读取本地持久化数据 (防御老版本 undefined 崩溃)
   */
  loadLocalPetData() {
    let raw = null;
    try {
      const local = localStorage.getItem("love_universe_pet_data");
      if (local) {
        raw = JSON.parse(local);
      }
    } catch (_) {}

    return this.migrateSchema(raw || this.config.petData);
  }

  /**
   * Schema 自动迁移补全引擎
   */
  migrateSchema(input) {
    const src = (input && typeof input === "object") ? input : {};
    const glow = typeof src.glowEnergy === "number" ? src.glowEnergy : 100;
    const tier = GracePetManager.getTierInfo(glow);

    return {
      name: src.name || "和平灵鸽 · 恩典使者",
      icon: tier.icon,
      glowEnergy: glow,
      gratitudeCount: Number(src.gratitudeCount) || 0,
      sacrificeCount: Number(src.sacrificeCount) || 0,
      logs: Array.isArray(src.logs) ? src.logs : [],
      // 新版 5 阶 12 徽章扩容字段
      currentLevel: tier.level,
      unlockedBadges: Array.isArray(src.unlockedBadges) ? src.unlockedBadges : [],
      streakDays: Number(src.streakDays) || 0,
      longestStreak: Number(src.longestStreak) || 0,
      lastInteractionDate: typeof src.lastInteractionDate === "string" ? src.lastInteractionDate : null,
      totalGlowEarned: Number(src.totalGlowEarned) || glow
    };
  }

  /**
   * 2. 本地持久化安全写入
   */
  saveLocalPetData() {
    try {
      localStorage.setItem("love_universe_pet_data", JSON.stringify(this.petData));
    } catch (_) {}
  }

  async init() {
    this.checkNaturalDayStreakReset();
    this.injectDOM();
    this.bindEvents();
    this.updateUI();

    // 初始化时拉取云端数据进行智能合并
    await this.fetchCloudPetData();
  }

  /**
   * 检测跨日连胜断更自愈
   */
  checkNaturalDayStreakReset() {
    const last = this.petData.lastInteractionDate;
    if (!last) return;

    const today = this.getTodayDateStr();
    if (last === today) return;

    try {
      const lastTime = new Date(last.replace(/-/g, "/")).getTime();
      const todayTime = new Date(today.replace(/-/g, "/")).getTime();
      const diffDays = Math.round((todayTime - lastTime) / (1000 * 3600 * 24));

      // 若间隔大于 1 天且今天尚未互动，连胜断更归零
      if (diffDays > 1) {
        this.petData.streakDays = 0;
        this.saveLocalPetData();
      }
    } catch (_) {}
  }

  /**
   * 交互时更新自然日连胜天数
   */
  updateStreakOnInteraction() {
    const today = this.getTodayDateStr();
    const last = this.petData.lastInteractionDate;

    if (!last) {
      this.petData.streakDays = 1;
    } else if (last === today) {
      // 当日再次互动，保持当前连胜不重复自增
    } else {
      try {
        const lastTime = new Date(last.replace(/-/g, "/")).getTime();
        const todayTime = new Date(today.replace(/-/g, "/")).getTime();
        const diffDays = Math.round((todayTime - lastTime) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          this.petData.streakDays = (this.petData.streakDays || 0) + 1;
        } else {
          this.petData.streakDays = 1;
        }
      } catch (_) {
        this.petData.streakDays = 1;
      }
    }

    this.petData.longestStreak = Math.max(this.petData.longestStreak || 0, this.petData.streakDays);
    this.petData.lastInteractionDate = today;
  }

  /**
   * 从云端拉取并智能合并最新数据
   */
  async fetchCloudPetData() {
    try {
      const res = await fetch("/api/love/pet");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.petData) {
        const cloudData = this.migrateSchema(data.petData);

        const localTotal = (this.petData.gratitudeCount || 0) + (this.petData.sacrificeCount || 0);
        const cloudTotal = (cloudData.gratitudeCount || 0) + (cloudData.sacrificeCount || 0);

        if (cloudTotal >= localTotal) {
          this.petData = cloudData;
          this.saveLocalPetData();
          this.updateUI();
        }
      }
    } catch (_) {}
  }

  injectDOM() {
    if (document.getElementById("grace-pet-trigger")) return;

    const tier = GracePetManager.getTierInfo(this.petData.glowEnergy);

    // 1. 悬浮挂件微标
    const widget = document.createElement("div");
    widget.className = "grace-pet-widget";
    widget.id = "grace-pet-trigger";
    widget.title = "点击进入恩典灵宠空间";
    widget.innerHTML = `
      <div class="grace-pet-avatar">
        <span id="grace-pet-icon-display">${tier.icon}</span>
        <div class="grace-pet-halo"></div>
      </div>
      <div class="grace-pet-badge" id="grace-pet-level-badge">LV.${tier.level} ${tier.title}</div>
    `;
    document.body.appendChild(widget);

    // 2. 灵宠核心互动弹窗
    const modal = document.createElement("div");
    modal.className = "grace-pet-modal";
    modal.id = "grace-pet-modal";
    modal.innerHTML = `
      <div class="grace-pet-dialog">
        <button class="grace-pet-dialog-close" id="grace-pet-close-btn" title="关闭">✕</button>
        
        <div class="grace-pet-card-header">
          <div class="grace-pet-big-avatar">
            <span id="grace-pet-big-icon">${tier.icon}</span>
          </div>
          <div class="grace-pet-tier-pill" id="grace-pet-tier-pill" style="background:${tier.badgeColor}22; border-color:${tier.badgeColor}; color:${tier.badgeColor};">
            LV.${tier.level} · ${tier.stageName}
          </div>
          <div class="grace-pet-name" id="grace-pet-display-name">${tier.title}</div>
          <div class="grace-pet-sub" id="grace-pet-display-desc">${tier.desc}</div>
        </div>

        <!-- 5 阶进化晋级能量进度条 -->
        <div class="grace-level-progress-box">
          <div class="grace-level-progress-meta">
            <span id="progress-level-current">LV.${tier.level} ${tier.title}</span>
            <span id="progress-level-target">${tier.nextReq ? `距 LV.${tier.level + 1} 尚需 ${tier.nextReq - this.petData.glowEnergy} 光芒` : '✨ 已达神性极阶'}</span>
          </div>
          <div class="grace-level-progress-bar">
            <div class="grace-level-progress-fill" id="grace-level-progress-fill"></div>
          </div>
        </div>

        <!-- 核心统计网格 -->
        <div class="grace-stats-grid">
          <div class="grace-stat-box">
            <div class="grace-stat-val" id="stat-glow-energy">${this.petData.glowEnergy}</div>
            <div class="grace-stat-lbl">✨ 光芒能量</div>
          </div>
          <div class="grace-stat-box">
            <div class="grace-stat-val" id="stat-streak-days">🔥 ${this.petData.streakDays} 天</div>
            <div class="grace-stat-lbl" id="stat-streak-bonus">同行连胜</div>
          </div>
          <div class="grace-stat-box">
            <div class="grace-stat-val" id="stat-gratitude-count">${this.petData.gratitudeCount}</div>
            <div class="grace-stat-lbl">💧 感恩之露</div>
          </div>
          <div class="grace-stat-box">
            <div class="grace-stat-val" id="stat-sacrifice-count">${this.petData.sacrificeCount}</div>
            <div class="grace-stat-lbl">🍎 舍己之果</div>
          </div>
        </div>

        <!-- 喂养与舍己操作区 -->
        <div class="grace-action-section">
          <div class="grace-action-title">
            <span>💧 献上今日感恩之露</span>
            <span class="grace-streak-tag" id="action-streak-tag">连胜加成 1.0x</span>
          </div>
          <textarea id="gratitude-input" class="grace-textarea" rows="2" placeholder="今天我想对你说谢谢，因为你..."></textarea>
          <button class="grace-feed-btn" id="feed-gratitude-btn">🕊️ 凝聚感恩之露并喂养 (+15 光芒)</button>
          <button class="grace-sacrifice-btn" id="feed-sacrifice-btn">🤝 我愿主动退让一步 · 结出舍己之果 (+30 光芒)</button>
        </div>

        <div style="font-size:12px; font-weight:800; color:#94a3b8; margin-bottom:8px;">📜 近期感恩与包容足迹：</div>
        <div class="grace-log-list" id="grace-log-container"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  bindEvents() {
    const trigger = document.getElementById("grace-pet-trigger");
    const modal = document.getElementById("grace-pet-modal");
    const closeBtn = document.getElementById("grace-pet-close-btn");
    const feedBtn = document.getElementById("feed-gratitude-btn");
    const sacrificeBtn = document.getElementById("feed-sacrifice-btn");

    if (trigger && modal) {
      trigger.onclick = () => { 
        modal.style.display = "flex"; 
        this.fetchCloudPetData();
        this.updateUI(); 
      };
    }
    if (closeBtn && modal) {
      closeBtn.onclick = () => { modal.style.display = "none"; };
      modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
    }

    if (feedBtn) {
      feedBtn.onclick = () => this.feedGratitude();
    }
    if (sacrificeBtn) {
      sacrificeBtn.onclick = () => this.triggerSacrifice();
    }
  }

  /**
   * 献上感恩之露 (注入连胜增幅倍率)
   */
  feedGratitude() {
    const input = document.getElementById("gratitude-input");
    const text = input ? input.value.trim() : "";
    if (!text) return alert("请写下一句发自内心的感恩之言！");

    const oldTier = GracePetManager.getTierInfo(this.petData.glowEnergy);

    this.updateStreakOnInteraction();
    const bonus = GracePetManager.getStreakBonus(this.petData.streakDays);

    const baseGlow = 15;
    const addedGlow = Math.round(baseGlow * bonus.mult);

    this.petData.glowEnergy = (this.petData.glowEnergy || 0) + addedGlow;
    this.petData.totalGlowEarned = (this.petData.totalGlowEarned || 0) + addedGlow;
    this.petData.gratitudeCount = (this.petData.gratitudeCount || 0) + 1;

    if (!Array.isArray(this.petData.logs)) this.petData.logs = [];

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    this.petData.logs.unshift({
      type: "gratitude",
      text: `${text} (+${addedGlow}光芒 · ${bonus.title})`,
      date: dateStr
    });

    if (input) input.value = "";

    const newTier = GracePetManager.getTierInfo(this.petData.glowEnergy);
    this.petData.currentLevel = newTier.level;
    this.petData.icon = newTier.icon;

    this.saveLocalPetData();
    this.updateUI();

    // 晋阶升级判定与庆贺
    if (newTier.level > oldTier.level) {
      this.handleLevelUpCelebration(oldTier.level, newTier);
    } else if (window.Effects) {
      if (typeof window.Effects.fireFireworks === "function") window.Effects.fireFireworks();
      if (typeof window.Effects.playAudio === "function") window.Effects.playAudio("stamp");
    }

    this.syncToCloud(`✓ 已献上感恩之露 (+${addedGlow} 光芒能量)！`);
  }

  /**
   * 触发舍己之果 (高阶光芒与强力连胜注入)
   */
  triggerSacrifice() {
    if (!confirm("确定要在本次争执或意见分歧中，主动选择退让与包容吗？\n爱情不是讲理的地方，而是舍己与接纳的地方。")) return;

    const oldTier = GracePetManager.getTierInfo(this.petData.glowEnergy);

    this.updateStreakOnInteraction();
    const bonus = GracePetManager.getStreakBonus(this.petData.streakDays);

    const baseGlow = 30;
    const addedGlow = Math.round(baseGlow * bonus.mult);

    this.petData.glowEnergy = (this.petData.glowEnergy || 0) + addedGlow;
    this.petData.totalGlowEarned = (this.petData.totalGlowEarned || 0) + addedGlow;
    this.petData.sacrificeCount = (this.petData.sacrificeCount || 0) + 1;

    if (!Array.isArray(this.petData.logs)) this.petData.logs = [];

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    this.petData.logs.unshift({
      type: "sacrifice",
      text: `在分歧中主动选择退让一步，因你比对错更重要 (+${addedGlow}光芒 · ${bonus.title})`,
      date: dateStr
    });

    const newTier = GracePetManager.getTierInfo(this.petData.glowEnergy);
    this.petData.currentLevel = newTier.level;
    this.petData.icon = newTier.icon;

    this.saveLocalPetData();
    this.updateUI();

    if (newTier.level > oldTier.level) {
      this.handleLevelUpCelebration(oldTier.level, newTier);
    } else if (window.Effects) {
      if (typeof window.Effects.fireConfetti === "function") window.Effects.fireConfetti();
      if (typeof window.Effects.playAudio === "function") window.Effects.playAudio("gatekeeperPass");
    }

    this.syncToCloud(`🕊️ 结出宝贵舍己之果 (+${addedGlow} 光芒)，愿爱化解一切隔阂！`);
  }

  /**
   * 晋阶等级提升庆贺动效
   */
  handleLevelUpCelebration(fromLevel, toTier) {
    if (window.Effects) {
      if (typeof window.Effects.fireConfetti === "function") window.Effects.fireConfetti();
      if (typeof window.Effects.fireFireworks === "function") window.Effects.fireFireworks();
      if (typeof window.Effects.showMiniToast === "function") {
        window.Effects.showMiniToast(`✨ 恭喜灵宠荣耀晋阶！升至 LV.${toTier.level}【${toTier.title}】🕊️`);
      }
    }
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
  }

  updateUI() {
    const tier = GracePetManager.getTierInfo(this.petData.glowEnergy);
    const bonus = GracePetManager.getStreakBonus(this.petData.streakDays);

    const widgetIcon = document.getElementById("grace-pet-icon-display");
    const widgetBadge = document.getElementById("grace-pet-level-badge");
    const bigIcon = document.getElementById("grace-pet-big-icon");
    const tierPill = document.getElementById("grace-pet-tier-pill");
    const nameEl = document.getElementById("grace-pet-display-name");
    const descEl = document.getElementById("grace-pet-display-desc");

    const statGlow = document.getElementById("stat-glow-energy");
    const statStreak = document.getElementById("stat-streak-days");
    const statStreakBonus = document.getElementById("stat-streak-bonus");
    const statGrat = document.getElementById("stat-gratitude-count");
    const statSac = document.getElementById("stat-sacrifice-count");
    const streakTag = document.getElementById("action-streak-tag");
    const container = document.getElementById("grace-log-container");

    const progressCurrent = document.getElementById("progress-level-current");
    const progressTarget = document.getElementById("progress-level-target");
    const progressFill = document.getElementById("grace-level-progress-fill");

    if (widgetIcon) widgetIcon.textContent = tier.icon;
    if (widgetBadge) widgetBadge.textContent = `LV.${tier.level} ${tier.title}`;
    if (bigIcon) bigIcon.textContent = tier.icon;

    if (tierPill) {
      tierPill.textContent = `LV.${tier.level} · ${tier.stageName}`;
      tierPill.style.background = `${tier.badgeColor}22`;
      tierPill.style.borderColor = tier.badgeColor;
      tierPill.style.color = tier.badgeColor;
    }

    if (nameEl) nameEl.textContent = tier.title;
    if (descEl) descEl.textContent = tier.desc;

    // 进度条百分比计算
    if (progressCurrent) progressCurrent.textContent = `LV.${tier.level} ${tier.title}`;
    if (progressTarget) {
      progressTarget.textContent = tier.nextReq
        ? `距 LV.${tier.level + 1} 尚需 ${tier.nextReq - this.petData.glowEnergy} 光芒`
        : "✨ 已达神性极阶";
    }
    if (progressFill) {
      let percent = 100;
      if (tier.nextReq) {
        const range = tier.nextReq - tier.req;
        const current = this.petData.glowEnergy - tier.req;
        percent = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
      }
      progressFill.style.width = `${percent}%`;
    }

    if (statGlow) statGlow.textContent = this.petData.glowEnergy;
    if (statStreak) statStreak.textContent = `🔥 ${this.petData.streakDays} 天`;
    if (statStreakBonus) statStreakBonus.textContent = bonus.title;
    if (statGrat) statGrat.textContent = this.petData.gratitudeCount;
    if (statSac) statSac.textContent = this.petData.sacrificeCount;
    if (streakTag) streakTag.textContent = `连胜加成 ${bonus.mult}x`;

    if (container) {
      const logs = this.petData.logs || [];
      if (logs.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#64748b; font-size:11.5px; padding:12px;">暂无足迹，写下一句感恩开始喂养吧</div>`;
      } else {
        container.innerHTML = logs.slice(0, 15).map(item => `
          <div class="grace-log-item">
            <div>${item.type === "sacrifice" ? "🍎 【舍己之果】" : "💧 【感恩之露】"} ${this.escape(item.text)}</div>
            <span>${item.date}</span>
          </div>
        `).join("");
      }
    }
  }

  async syncToCloud(successMsg) {
    try {
      await fetch("/api/love/pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petData: this.petData })
      });
    } catch (_) {}

    if (window.Effects && typeof window.Effects.showMiniToast === "function") {
      window.Effects.showMiniToast(successMsg);
    } else {
      alert(successMsg);
    }
  }

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
