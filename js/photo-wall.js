/**
 * 众水不灭 · 雅歌之印 (Love Universe)
 * 文件名: js/photo-wall.js
 * 架构重构: 「智能截断 + 记忆呼吸轮换」算法、1号头像独立固定保护、高性能视差驱动
 */

class PhotoWallManager {
  constructor(config) {
    this.config = config || window.LOVE_CONFIG || {};
    this.itemsData = []; // 当前活跃在屏幕上的 DOM 节点数据
    this.photoPool = []; // 待展示的内存照片池
    this.ticking = false;
    this.lastScrollY = -1;
    this.resizeTimer = null;
    this.breathingTimer = null;
    
    // 智能截断：严格限制同屏最大渲染节点数，杜绝 DOM 内存溢出
    this.maxCapacity = window.innerWidth <= 640 ? 4 : 6;
  }

  init() {
    const container = document.getElementById("parallax-photo-wall");
    if (!container) return;

    // 清理之前的定时器（防御热更新时的内存泄漏）
    if (this.breathingTimer) clearInterval(this.breathingTimer);

    // 收集时光轴中的真实有效照片节点
    const timeline = this.config.timeline || [];
    const photoNodes = timeline.filter(item => Boolean(item.frontImg));

    if (photoNodes.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = "";
    this.itemsData = [];

    // ================= 1. 绝对特权隔离：首张照片固定头像 =================
    const avatarNode = photoNodes[0];
    if (avatarNode && avatarNode.frontImg) {
      const avatarItem = document.createElement("div");
      avatarItem.className = "wall-polaroid-avatar";
      avatarItem.innerHTML = `
        <div class="wall-polaroid-inner">
          <img src="${avatarNode.frontImg}" alt="专属头像" loading="eager" decoding="async" onerror="this.parentElement.parentElement.style.display='none'">
        </div>
        <div class="wall-polaroid-caption">${avatarNode.tag || "恒久契约"}</div>
      `;
      container.appendChild(avatarItem);
    }

    // ================= 2. 智能截断与初始渲染 =================
    this.photoPool = photoNodes.slice(1);
    
    if (this.photoPool.length > 0) {
      // 初始渲染：从池子中抽取不超过最大容量的照片
      const initialRenderCount = Math.min(this.photoPool.length, this.maxCapacity);
      
      for (let i = 0; i < initialRenderCount; i++) {
        const node = this.photoPool[i];
        this.createAndAppendPolaroid(container, node, i);
      }

      this.updateParallax(true);

      // ================= 3. 开启记忆呼吸轮换机制 =================
      if (this.photoPool.length > 1) {
        this.startBreathingCarousel();
      }
    }

    // 仅在窗口尺寸真正发生改变时进行防抖重绘
    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.maxCapacity = window.innerWidth <= 640 ? 4 : 6;
        this.updateParallax(true);
      }, 250);
    }, { passive: true });

    // 高性能 RAF 视差驱动
    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  /**
   * 生成单张飘浮照片的 DOM 并分配安全坐标 (严格避开屏幕中心)
   */
  createAndAppendPolaroid(container, node, idx) {
    const isMobile = window.innerWidth <= 640;
    const item = document.createElement("div");
    item.className = "wall-polaroid-item";

    // 坐标推演分配：划分为左右两道走廊，彻底避开中间正文区
    const isLeft = Math.random() > 0.5;
    
    // X轴安全限制
    if (isMobile) {
      if (isLeft) {
        item.style.left = `${Math.random() * 8 - 2}%`; // -2% ~ 6%
        item.style.right = "auto";
      } else {
        item.style.right = `${Math.random() * 8 - 2}%`; // -2% ~ 6%
        item.style.left = "auto";
      }
    } else {
      if (isLeft) {
        item.style.left = `${Math.random() * 12 + 2}%`; // 2% ~ 14%
        item.style.right = "auto";
      } else {
        item.style.right = `${Math.random() * 12 + 2}%`; // 2% ~ 14%
        item.style.left = "auto";
      }
    }

    // Y轴安全限制：仅在当前视口高度的 10% ~ 80% 内随机生成，绝对不撑开外围
    const topRange = window.innerHeight * (0.1 + Math.random() * 0.7);
    const baseRot = (Math.random() - 0.5) * (isMobile ? 12 : 22);
    // 左侧向下飘速稍慢，右侧稍快，形成交错视差
    const speed = isLeft ? -(0.02 + Math.random() * 0.02) : -(0.04 + Math.random() * 0.02);

    item.style.top = `${topRange}px`;
    item.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg)`;
    item.style.opacity = isMobile ? '0.75' : '0.85'; // 初始透明度

    item.innerHTML = `
      <div class="wall-polaroid-inner">
        <img src="${node.frontImg}" alt="${node.title || "时光碎片"}" loading="lazy" decoding="async" onerror="this.parentElement.parentElement.style.display='none'">
      </div>
    `;

    container.appendChild(item);

    this.itemsData.push({
      element: item,
      node: node, // 记录当前承载的数据
      baseTop: topRange,
      baseRot: baseRot,
      speed: speed,
      isAnimating: false // 呼吸锁
    });
  }

  /**
   * 记忆呼吸轮换算法 (Breathing Carousel)
   * 随机挑选屏幕上一张照片隐去，更换内存池中的新照片后，在新的随机位置亮起。
   */
  startBreathingCarousel() {
    const isMobile = window.innerWidth <= 640;

    this.breathingTimer = setInterval(() => {
      // 在当前渲染节点中随机挑一个“幸运儿”
      const slotIndex = Math.floor(Math.random() * this.itemsData.length);
      const slot = this.itemsData[slotIndex];

      // 防并发锁：如果正在隐现，跳过
      if (slot.isAnimating) return;
      slot.isAnimating = true;

      // 1. 缓缓隐去 (Fade Out)
      slot.element.style.opacity = '0';

      // 等待 CSS 的 1.2 秒渐隐动画结束
      setTimeout(() => {
        // 2. 从内存池里找一张屏幕上没在展示的照片
        let nextNode = slot.node; // 兜底
        if (this.photoPool.length > this.itemsData.length) {
          // 计算差集，找到在池子里但没在屏幕上的照片
          const inactivePool = this.photoPool.filter(p => !this.itemsData.some(a => a.node === p));
          if (inactivePool.length > 0) {
            nextNode = inactivePool[Math.floor(Math.random() * inactivePool.length)];
          }
        }

        // 3. 重新分配空间坐标 (避开中心)
        const isLeft = Math.random() > 0.5;
        const topRange = window.innerHeight * (0.1 + Math.random() * 0.7);
        const rot = (Math.random() - 0.5) * (isMobile ? 12 : 22);

        slot.node = nextNode;
        slot.baseTop = topRange;
        slot.baseRot = rot;
        slot.speed = isLeft ? -(0.02 + Math.random() * 0.02) : -(0.04 + Math.random() * 0.02);

        // 应用新坐标
        if (isMobile) {
          slot.element.style.left = isLeft ? `${Math.random() * 8 - 2}%` : 'auto';
          slot.element.style.right = isLeft ? 'auto' : `${Math.random() * 8 - 2}%`;
        } else {
          slot.element.style.left = isLeft ? `${Math.random() * 12 + 2}%` : 'auto';
          slot.element.style.right = isLeft ? 'auto' : `${Math.random() * 12 + 2}%`;
        }
        slot.element.style.top = `${slot.baseTop}px`;

        // 更换照片源码
        const img = slot.element.querySelector('img');
        if (img) img.src = nextNode.frontImg;

        // 根据当前滑动距离，立即校准 Y 轴视差偏移量，避免闪烁跳跃
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const offsetY = Math.round(scrollY * slot.speed);
        slot.element.style.transform = `translate3d(0, ${offsetY}px, 0) rotate(${slot.baseRot}deg)`;

        // 4. 缓缓亮起 (Fade In)
        setTimeout(() => {
          slot.element.style.opacity = isMobile ? '0.75' : '0.85';
          
          // 动画结束后解锁
          setTimeout(() => { slot.isAnimating = false; }, 1200);
        }, 100); // 留出 100ms 保证 DOM 属性被浏览器确认

      }, 1200); // 对应 CSS 的 1.2s opacity transition

    }, 4500); // 每隔 4.5 秒发起一次呼吸轮换
  }

  /**
   * 执行负向视差浮动位移 (纯 3D 矩阵计算，不触发 Reflow 重排)
   */
  updateParallax(force = false) {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (!force && Math.abs(scrollY - this.lastScrollY) < 0.5) return;
    this.lastScrollY = scrollY;

    for (let i = 0; i < this.itemsData.length; i++) {
      const data = this.itemsData[i];
      if (data.element && !data.isAnimating) {
        const offsetY = Math.round(scrollY * data.speed);
        data.element.style.transform = `translate3d(0, ${offsetY}px, 0) rotate(${data.baseRot}deg)`;
      }
    }
  }
}

// 自动挂载并在 DOM 就绪后启动
window.PhotoWallManager = PhotoWallManager;

document.addEventListener("DOMContentLoaded", () => {
  if (window.LOVE_CONFIG) {
    const photoWall = new PhotoWallManager(window.LOVE_CONFIG);
    photoWall.init();
  }
});
