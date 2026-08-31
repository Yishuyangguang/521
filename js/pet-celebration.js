/**
 * 众水不灭 · 雅歌之印
 * 文件名: js/pet-celebration.js
 * 作用: 灵宠晋升与徽章解锁庆贺动效中枢、纯代码 Web Audio 空灵和弦合成引擎、全屏粒子爆发与独立模态弹窗
 */

class PetCelebrationManager {
  constructor() {
    this.audioContext = null;
    this.modalEl = null;
    this.initAudioContext();
  }

  /**
   * 12 徽章全量核心元数据字典 (单一大数据源)
   */
  static get BADGE_DEFINITIONS() {
    return [
      // 5 阶等级徽章
      { id: "lvl_1", name: "初信雏鸽", icon: "🐣", category: "level", level: 1, desc: "初识恩典 · 光芒值达到 0+" },
      { id: "lvl_2", name: "感恩使者", icon: "💧", category: "level", level: 2, desc: "恩典流淌 · 光芒值达到 100+" },
      { id: "lvl_3", name: "舍己守护", icon: "🍎", category: "level", level: 3, desc: "舍己之美 · 光芒值达到 300+" },
      { id: "lvl_4", name: "和平织梦", icon: "🕊️✨", category: "level", level: 4, desc: "双翼展翅 · 光芒值达到 600+" },
      { id: "lvl_5", name: "永恒圣徒", icon: "👑🕊️", category: "level", level: 5, desc: "神圣加冕 · 光芒值达到 1000+" },

      // 7 项专项成就徽章
      { id: "streak_7", name: "七日感恩", icon: "📅💧", category: "special", desc: "连续 7 天记录感恩之露" },
      { id: "first_peace", name: "破冰勇士", icon: "🧊⚡", category: "special", desc: "首次使用破冰信号箱达成和解" },
      { id: "checklist_100", name: "百件期待", icon: "✅💯", category: "special", desc: "完成 100 件同行约定清单" },
      { id: "sacrifice_10", name: "舍己十诫", icon: "🤝🔟", category: "special", desc: "累计达成 10 次主动包容退让" },
      { id: "photo_50", name: "时光雕刻", icon: "📸🎞️", category: "special", desc: "时光轴珍藏美好回忆时刻" },
      { id: "music_100", name: "治愈之音", icon: "🎵💕", category: "special", desc: "在专属背景音乐中同行守护" },
      { id: "egg_hunter", name: "彩蛋猎人", icon: "🥚🔍", category: "special", desc: "发现全站角落隐藏的爱意彩蛋" }
    ];
  }

  /**
   * 初始化 Web Audio 上下文 (手势凭证激活)
   */
  initAudioContext() {
    const unlock = () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("touchstart", unlock, { once: true });
    document.addEventListener("click", unlock, { once: true });
  }

  /**
   * 纯代码现场合成：灵宠晋升荣耀空灵和弦 (C5 -> E5 -> G5 -> B5 -> C6)
   */
  playLevelUpChord() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      if (ctx.state === "suspended") ctx.resume();

      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.5);
      });
    } catch (_) {}
  }

  /**
   * 纯代码现场合成：徽章解锁星芒清脆风铃 (G5 -> C6 -> E6 -> G6)
   */
  playBadgeUnlockChime() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      if (ctx.state === "suspended") ctx.resume();

      const freqs = [783.99, 1046.50, 1318.51, 1567.98];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 1.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 1.1);
      });
    } catch (_) {}
  }

  /**
   * 触发等级提升庆贺盛典
   */
  triggerLevelUp(newTier) {
    this.playLevelUpChord();

    if (window.Effects) {
      if (typeof window.Effects.fireFireworks === "function") window.Effects.fireFireworks();
      if (typeof window.Effects.fireConfetti === "function") window.Effects.fireConfetti();
    }

    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);

    this.showCelebrationModal({
      tag: "SACRED EVOLUTION · 灵宠荣耀晋阶",
      icon: newTier.icon,
      title: `荣耀晋升 LV.${newTier.level} · ${newTier.title}`,
      subtitle: `✨ 达成【${newTier.stageName}】形态`,
      desc: newTier.desc,
      btnText: "领受神圣恩典 💖"
    });
  }

  /**
   * 触发专属成就徽章解锁盛典
   */
  triggerBadgeUnlock(badge) {
    this.playBadgeUnlockChime();

    if (window.Effects) {
      if (typeof window.Effects.fireConfetti === "function") window.Effects.fireConfetti();
    }

    if (navigator.vibrate) navigator.vibrate([80, 40, 120]);

    this.showCelebrationModal({
      tag: "ACHIEVEMENT UNLOCKED · 成就徽章解锁",
      icon: badge.icon,
      title: `解锁徽章【${badge.name}】`,
      subtitle: "🌟 铭刻一生一世的同行印记",
      desc: badge.desc,
      btnText: "荣耀收入囊中 🎖️"
    });
  }

  /**
   * 构建并展示独立高层级弹窗
   */
  showCelebrationModal({ tag, icon, title, subtitle, desc, btnText }) {
    if (!this.modalEl) {
      this.modalEl = document.createElement("div");
      this.modalEl.className = "grace-celebration-modal";
      this.modalEl.id = "grace-celebration-modal";
      document.body.appendChild(this.modalEl);
    }

    this.modalEl.innerHTML = `
      <div class="grace-celebration-dialog">
        <div class="grace-celebration-glow"></div>
        <span class="grace-celebration-tag">${tag}</span>
        <div class="grace-celebration-avatar">${icon}</div>
        <h3 class="grace-celebration-title">${title}</h3>
        <div class="grace-celebration-subtitle">${subtitle}</div>
        <p class="grace-celebration-desc">${desc}</p>
        <button class="grace-celebration-btn" id="grace-celebration-close-btn">${btnText}</button>
      </div>
    `;

    this.modalEl.classList.add("active");

    const closeBtn = document.getElementById("grace-celebration-close-btn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.closeCelebrationModal();
      };
    }
  }

  closeCelebrationModal() {
    if (this.modalEl) {
      this.modalEl.classList.remove("active");
    }
  }
}

// 挂载全局单例
window.PetCelebrationManager = PetCelebrationManager;
window.PetCelebration = new PetCelebrationManager();
