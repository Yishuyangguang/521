/**
 * 众水不灭 · 雅歌之印 (Love Universe)
 * 文件名: js/photo-wall.js
 * 架构重构: 「智能截断 + 记忆呼吸轮换」算法 + 2D Bounding Box 空间防重叠引擎
 */

class PhotoWallManager {
  constructor(config) {
    this.config = config || window.LOVE_CONFIG || {};
    this.itemsData = []; // 当前活跃在屏幕上的 DOM 节点数据 (含物理盒子坐标)
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

    // ================= 2. 智能截断与初始防碰撞渲染 =================
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
   * 🌟 核心算法 1：矩形碰撞检测 (AABB Collision Detection)
   * 判断两个坐标盒是否重叠，附加 padding 确保安全呼吸距离
   */
  checkCollision(box1, box2, padding) {
    return !(
      box1.x + box1.w + padding < box2.x || // 盒1在盒2左侧很远
      box1.x > box2.x + box2.w + padding || // 盒1在盒2右侧很远
      box1.y + box1.h + padding < box2.y || // 盒1在盒2上方很远
      box1.y > box2.y + box2.h + padding    // 盒1在盒2下方很远
    );
  }

  /**
   * 🌟 核心算法 2：安全坐标推演引擎
   * 循环探测安全空间，自动避开 1号头像 与 现有活跃照片
   */
  getSafePosition(isMobile, excludingData = null) {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    // 照片的物理体积近似估算
    const itemW = isMobile ? 85 : 155;
    const itemH = isMobile ? 110 : 180;
    const safePadding = isMobile ? 35 : 70; // 强制留白的呼吸安全距离

    // 定义 1 号头像专属的绝对禁飞区 (根据响应式大概预估边界)
    const avatarBox = {
      x: isMobile ? 10 : 36,
      y: isMobile ? 10 : 32,
      w: isMobile ? 80 : 140,
      h: isMobile ? 100 : 150
    };

    let attempts = 0;
    const maxAttempts = 60; // 兜底降级锁：探测60次找不到空地则强制放行，避免死循环假死
    let candidate = null;

    while (attempts < maxAttempts) {
      const isLeft = Math.random() > 0.5;
      let percentX = 0;
      let absX = 0;

      // X轴：划定左右走廊区间，避开屏幕中间文本区
      if (isMobile) {
        percentX = Math.random() * 6 - 1; // -1% ~ 5%
      } else {
        percentX = Math.random() * 12 + 2; // 2% ~ 14%
      }
      
      if (isLeft) {
        absX = (percentX / 100) * screenW;
      } else {
        absX = screenW - itemW - ((percentX / 100) * screenW);
      }

      // Y轴：纵向散布区间限制 (视口高度的 15% ~ 85%)
      const absY = screenH * (0.15 + Math.random() * 0.7);

      candidate = {
        isLeft: isLeft,
        percentX: percentX,
        x: absX,
        y: absY,
        w: itemW,
        h: itemH
      };

      let isColliding = false;

      // 1. 排查固定头像禁飞区
      if (this.checkCollision(candidate, avatarBox, safePadding)) {
        isColliding = true;
      }

      // 2. 排查当前活跃照片池
      if (!isColliding) {
        for (let i = 0; i < this.itemsData.length; i++) {
          const data = this.itemsData[i];
          if (excludingData && data === excludingData) continue; // 呼吸替换时无视自己正在被替换的坑位
          
          if (this.checkCollision(candidate, data.box, safePadding)) {
            isColliding = true;
            break;
          }
        }
      }

      // 若未碰撞，完美通过检测
      if (!isColliding) {
        break;
      }
      attempts++;
    }

    return candidate;
  }

  /**
   * 生成单张飘浮照片的 DOM 并分配经检测的安全坐标
   */
  createAndAppendPolaroid(container, node, idx) {
    const isMobile = window.innerWidth <= 640;
    const item = document.createElement("div");
    item.className = "wall-polaroid-item";

    // 通过寻路引擎拿到安全三维坐标体系
    const pos = this.getSafePosition(isMobile);
    const baseRot = (Math.random() - 0.5) * (isMobile ? 12 : 22);
    const speed = pos.isLeft ? -(0.02 + Math.random() * 0.02) : -(0.04 + Math.random() * 0.02);

    item.style.top = `${pos.y}px`;
    if (pos.isLeft) {
      item.style.left = `${pos.percentX}%`;
      item.style.right = "auto";
    } else {
      item.style.right = `${pos.percentX}%`;
      item.style.left = "auto";
    }
    
    item.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg)`;
    item.style.opacity = isMobile ? '0.75' : '0.85';

    item.innerHTML = `
      <div class="wall-polaroid-inner">
        <img src="${node.frontImg}" alt="${node.title || "时光碎片"}" loading="lazy" decoding="async" onerror="this.parentElement.parentElement.style.display='none'">
      </div>
    `;

    container.appendChild(item);

    // 将物理边界存入注册表
    this.itemsData.push({
      element: item,
      node: node,
      baseTop: pos.y,
      baseRot: baseRot,
      speed: speed,
      isAnimating: false,
      box: { x: pos.x, y: pos.y, w: pos.w, h: pos.h }
    });
  }

  /**
   * 记忆呼吸轮换算法 (Breathing Carousel)
   * 隐退时更新坐标，依然经过严格的空间防碰撞检测
   */
  startBreathingCarousel() {
    const isMobile = window.innerWidth <= 640;

    this.breathingTimer = setInterval(() => {
      const slotIndex = Math.floor(Math.random() * this.itemsData.length);
      const slot = this.itemsData[slotIndex];

      // 防并发锁
      if (slot.isAnimating) return;
      slot.isAnimating = true;

      // 1. 缓缓隐去
      slot.element.style.opacity = '0';

      // 2. DOM 退场期间更换资源与重算安全坐标
      setTimeout(() => {
        let nextNode = slot.node;
        if (this.photoPool.length > this.itemsData.length) {
          const inactivePool = this.photoPool.filter(p => !this.itemsData.some(a => a.node === p));
          if (inactivePool.length > 0) {
            nextNode = inactivePool[Math.floor(Math.random() * inactivePool.length)];
          }
        }

        // 调用寻路引擎查找全新避让坐标，同时排除当前 slot 原有的碰撞体积干扰
        const pos = this.getSafePosition(isMobile, slot);
        const rot = (Math.random() - 0.5) * (isMobile ? 12 : 22);

        slot.node = nextNode;
        slot.baseTop = pos.y;
        slot.baseRot = rot;
        slot.speed = pos.isLeft ? -(0.02 + Math.random() * 0.02) : -(0.04 + Math.random() * 0.02);
        // 更新内存里的碰撞盒体积
        slot.box = { x: pos.x, y: pos.y, w: pos.w, h: pos.h };

        if (pos.isLeft) {
          slot.element.style.left = `${pos.percentX}%`;
          slot.element.style.right = 'auto';
        } else {
          slot.element.style.right = `${pos.percentX}%`;
          slot.element.style.left = 'auto';
        }
        slot.element.style.top = `${slot.baseTop}px`;

        const img = slot.element.querySelector('img');
        if (img) img.src = nextNode.frontImg;

        const scrollY = window.scrollY || window.pageYOffset || 0;
        const offsetY = Math.round(scrollY * slot.speed);
        slot.element.style.transform = `translate3d(0, ${offsetY}px, 0) rotate(${slot.baseRot}deg)`;

        // 3. 缓缓亮起
        setTimeout(() => {
          slot.element.style.opacity = isMobile ? '0.75' : '0.85';
          setTimeout(() => { slot.isAnimating = false; }, 1200);
        }, 100);

      }, 1200); 

    }, 4500);
  }

  /**
   * 视差物理计算矩阵
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
