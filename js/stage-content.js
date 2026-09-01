/**
 * 众水不灭 · 雅歌之印
 * 文件名: js/stage-content.js
 * 作用: 
 *   1. 独立管理恋爱期、订婚期、结婚期三大阶段专属的待办清单与舍己特权券数据
 *   2. 提供星轨中枢舞台生命周期管理器 (StageManager)，实现 iOS 滚动锁定、Hash 路由栈、全局事件委托与生命周期广播
 */

window.STAGE_CONTENT = {
  // ================= 🌿 1. 恋爱期 (Dating Phase) =================
  dating: {
    title: "恋爱期待办清单",
    subtitle: "在尊重与接纳中了解彼此，坚守圣洁、克制与纯粹",
    scratchTitle: "恋爱期 · 舍己与包容特权券",
    checklist: [
      { id: "d_1", title: "[边界守护] 共同制定一个双方都感到安全、舒适的“身体接触与独处界线”，并用克制和尊重共同守护它。", completed: false },
      { id: "d_2", title: "[压力观察] 至少观察一次对方在极度疲惫或面临压力（如严重加班、路怒）下的真实情绪反应，练习温和陪伴而非说教。", completed: false },
      { id: "d_3", title: "[立场互换] 尝试一次“角色互换”的游戏，站在对方的立场上重述上一次发生的小争执，去理解对方的委屈。", completed: false },
      { id: "d_4", title: "[对外体面] 承诺不在外人（包括自己的父母和朋友）面前抱怨对方的缺点，永远在外人面前维护对方的尊严。", completed: false },
      { id: "d_5", title: "[共同起步] 共同去完成一件两个人都完全不会、需要重新学习的事（如陶艺、长途徒步），体验面对挫折时的协作。", completed: false },
      { id: "d_6", title: "[坦诚财务] 坦诚地向对方分享自己的个人财务现状、消费习惯以及对金钱的真实安全感来源。", completed: false },
      { id: "d_7", title: "[温柔倾听] 当对方提出一个你完全不赞同的观点时，强迫自己不立即反驳，而是温和地问：“听起来很有意思，能多跟我说说你背后的故事吗？”", completed: false },
      { id: "d_8", title: "[空间留白] 刻意保留各自的“个人专属时间”，支持对方维系健康的同性友谊和个人爱好，不陷入窒息的捆绑。", completed: false },
      { id: "d_9", title: "[说出脆弱] 练习在觉得被对方冷落、想要通过冷战来惩罚对方时，主动说出自己的脆弱：“你刚才没回我信息，我感觉有点被孤立和焦虑。”", completed: false },
      { id: "d_10", title: "[秩序碰撞] 一起做一次大扫除或整理房间，观察彼此对生活秩序、整洁度以及物品留存的态度。", completed: false },
      { id: "d_11", title: "[暴露不美] 分享一次自己人生中最大的失败或糗事，看对方在面对你“不完美、脆弱”的一面时，能否给予温和的接纳。", completed: false },
      { id: "d_12", title: "[日常感激] 规定在每次约会结束时，真诚地对对方说一件今天让你最心存感激的细节。", completed: false },
      { id: "d_13", title: "[拒绝指控] 经历意见不合时，练习不翻旧账、不使用“你每次都……”或“你永远不……”这类绝对性的指控词。", completed: false },
      { id: "d_14", title: "[思想共读] 共同阅读一本关于沟通或情感成长的书，不带考核心态地分享各自最真实的读后感。", completed: false },
      { id: "d_15", title: "[克制诊断] 在对方遇到挫折（如考试失利、工作被批）时，克制住自己想要“立刻帮他解决、开药方”的冲动，先给予30分钟纯粹的同理和拥抱。", completed: false },
      { id: "d_16", title: "[融入世界] 体验一次对方极度热爱但你毫无兴趣的爱好（如看一场球赛或画展），单纯为了爱他而去理解他的世界。", completed: false },
      { id: "d_17", title: "[原生解毒] 探讨各自的原生家庭对自己在生活习惯、情绪表达和冲突处理上的深远影响，并彼此体恤。", completed: true },
      { id: "d_18", title: "[卸下秀场] 练习不在社交媒体上过度“秀恩爱”来支撑自我形象，而是在私底下踏实地向对方表达最深、不为人知的肯定。", completed: false },
      { id: "d_19", title: "[放下防御] 当对方指出你身上的某个缺点时，克制住本能的自我防御，深吸一口气问：“谢谢你的诚实，我的这个习惯让你感到不舒服了吗？”", completed: false },
      { id: "d_20", title: "[人间烟火] 一起去菜市场买菜、做一顿饭、洗碗，体验最平凡的日常，看彼此在琐事中的分工与合作。", completed: false }
      { id: "d_21", title: "[勇敢说不] 练习在不伤害对方自尊的前提下，勇敢地对对方不合理的索求说“不”，保护彼此在关系中的独立人格。", completed: false }
      { id: "d_22", title: "[朋友圈接轨] 共同探望一次彼此的朋友，并在事后聊聊：“你觉得我的朋友们好相处吗？你从他们身上看到了怎样的我？”", completed: false }
      { id: "d_23", title: "[字面冷静] 承诺不在微信或文字里讨论复杂的敏感问题，当感觉字面意思有冲突时，立刻转换为电话或面对面沟通。", completed: false }
      { id: "d_24", title: "[延迟满足] 在恋爱中不急于用身体的结合来解决关系中的不安全感，坚持“让情感温度与心智了解保持同步”。", completed: false }
      { id: "d_25", title: "[隐私界线] 讨论彼此对“界线”的定义（如：异性社交的边界、手机隐私的边界），建立基于绝对信任的默契。", completed: false }
      { id: "d_26", title: "[平等怜悯] 共同去参与一次社区公益或帮助弱势群体的活动，观察对方在面对不如自己的人时，是否存有真正的温柔。", completed: false }
      { id: "d_27", title: "[幽默带过] 练习在对方不符合你预期（如约会迟到、买错礼物）时，不给对方脸色看，而是温和地开个玩笑带过。", completed: false }
      { id: "d_28", title: "[理财热身] 共同建立一个“浪漫蓄水池”（共同储蓄），一起规划并为一次旅行存钱，练习初步的共同财务决策。", completed: false }
      { id: "d_29", title: "[去消费化] 至少完成一次“不花大钱”却充满惊喜的浪漫约会，体验不依赖物质消费的纯粹浪漫。", completed: false }
      { id: "d_30", title: "[誓言探讨] 坦诚地讨论对“婚姻”本身的看法：你觉得婚姻只是一张随时可以解约的合伙合同，还是一场同甘共苦的生命托付？", completed: false }
      { id: "d_31", title: "[文字浪漫] 尝试写一封手写信给对方，用最质朴的文字表达你对Ta的欣赏，而不是只有甜言蜜语。", completed: false }
      { id: "d_32", title: "[保持完整] 保持自我提升：在恋爱中依然保持对阅读、工作、健康的追求，不指望对方解决你人生的全部空虚。", completed: false }
    ],
    scratchCards: [
      {
        id: "d_card_1",
        title: "绝对倾听接纳卡",
        content: "放下手机，全心全意听你诉说十分钟的烦恼与委屈，不评判、不说教，只给完全的接纳！",
        icon: "👂",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "d_card_2",
        title: "情绪降温暂停卡",
        content: "争执快要爆发时出示此卡，双方无条件暂停争论十分钟，冷静后用最温和的语气对话！",
        icon: "🕊️",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "d_card_3",
        title: "专属风雨代步券",
        content: "无论刮风下雨，只要一个消息，带着雨伞与温水准时出现在门口接你！",
        icon: "🚗",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "d_card_4",
        title: "耐心陪同支援卡",
        content: "陪逛街、买衣服或看展半天，全程提包支援，保持全程微笑与专注！",
        icon: "🛍️",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "d_card_5",
        title: "专属水果投喂券",
        content: "想吃西瓜切块、葡萄剥皮或芒果切丁，负责洗净切好投喂到嘴边！",
        icon: "🍉",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "d_card_6",
        title: "换位思考聆听卡",
        content: "发生误解时，先主动复述并理解对方的感受与委屈，不急于为自己辩解！",
        icon: "💡",
        scratched: false,
        used: false,
        usedTime: ""
      }
    ]
  },

  // ================= 💍 2. 订婚期 (Engaged Phase) =================
  engaged: {
    title: "订婚期待办清单",
    subtitle: "为一生一世的盟约做好准备，在磨合中学会舍己与妥协",
    scratchTitle: "订婚期 · 舍己与包容特权券",
    checklist: [
      { id: "e_1", title: "共同挑选对戒并在内侧刻上只属于我们两人的专属盟约", completed: false },
      { id: "e_2", title: "【辣·冲突】在筹备婚礼面对两家风俗分歧时，主动为彼此未来做出妥协与舍己", completed: false },
      { id: "e_3", title: "【酸·焦虑】面对婚前焦虑与未知恐惧时，紧握双手重温一路走来的初心", completed: false },
      { id: "e_4", title: "【苦·共担】坦诚彼此财务与未来规划，共同制定未来小家的奋斗蓝图", completed: false },
      { id: "e_5", title: "共同写一封‘致五年后我们’的信并封存进时光胶囊", completed: false },
      { id: "e_6", title: "去家居市场像布置未来小家一样，认真挑选未来的第一张餐桌", completed: true },
      { id: "e_7", title: "穿上正装与礼服去吃一次庄重的定盟晚宴", completed: false },
      { id: "e_8", title: "在长辈与亲友面前坚定地维护对方，做对方最坚实的心理后盾", completed: false },
      { id: "e_9", title: "一起为未来小家挑选第一盆充满生机的常青绿植", completed: false },
      { id: "e_10", title: "共同参加一次家庭沟通课程，为一生一世的长久相处做好心理预备", completed: false },
      { id: "e_11", title: "坐慢速火车去一座陌生城市，在慢节奏中磨合彼此的出行习惯", completed: false },
      { id: "e_12", title: "制定属于我们俩的相处原则：生气不可到日落，绝不把分歧带过夜", completed: true }
    ],
    scratchCards: [
      {
        id: "e_card_1",
        title: "无条件退让一步卡",
        content: "在筹备婚礼或面对未来规划分歧时出示，我心甘情愿为你退让一次，你比对错重要！",
        icon: "🤝",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "e_card_2",
        title: "绝对后盾支撑卡",
        content: "面对外界压力或感到孤立无援时出示，我将无条件坚定站在你身边做你最坚固的磐石！",
        icon: "🛡️",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "e_card_3",
        title: "婚前解压放空券",
        content: "感到筹备压力过大时出示，陪你远离烦扰彻底放空休息半天！",
        icon: "☕",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "e_card_4",
        title: "繁琐事务代办卡",
        content: "筹备过程中的繁琐采购与跑腿沟通，全部由我一人包揽搞定！",
        icon: "📋",
        scratched: false,
        used: false,
        usedTime: ""
      }
    ]
  },

  // ================= 🏠 3. 结婚期 (Married Phase) =================
  married: {
    title: "结婚期待办清单",
    subtitle: "合为一体，同甘共苦，在长相厮守与柴米油盐中践行真爱",
    scratchTitle: "结婚期 · 舍己与包容特权券",
    checklist: [
      { id: "m_1", title: "在深夜为晚归的伴侣留一盏暖黄色的灯，并热好饭菜", completed: false },
      { id: "m_2", title: "【痛·疾病】在对方生重病、最憔悴脆弱时整夜守在床前细心喂水照顾", completed: false },
      { id: "m_3", title: "每天清晨醒来，给身边的伴侣一个充满爱意与踏实感的早安问候", completed: false },
      { id: "m_4", title: "【冷·倦怠】在日复一日的平淡柴米油盐中，依然在下班路上带回一束花", completed: false },
      { id: "m_5", title: "【辣·争吵】哪怕白天吵得面红耳赤，睡觉前依然主动从背后拥抱和解", completed: false },
      { id: "m_6", title: "【甜·分担】在你连续加班的早晨，悄悄关掉闹钟代你做好早餐与家务", completed: false },
      { id: "m_7", title: "【苦·患难】遭遇人生裁员、疾病或重大变故时，紧握你的手说我们一起扛", completed: false },
      { id: "m_8", title: "亲手为对方做一顿四菜一汤的温馨烛光晚餐", completed: false },
      { id: "m_9", title: "清晨手挽手一起逛充满烟火气的菜市场，挑选新鲜食材", completed: true },
      { id: "m_10", title: "在厨房里一个人做饭，另一个人从背后温柔环抱", completed: false },
      { id: "m_11", title: "冬天躲在同一床温暖的被窝里通宵看经典老电影", completed: false },
      { id: "m_12", title: "在对方熟睡时，静静看着对方安稳的睡颜并感谢生命中有你", completed: false },
      { id: "m_13", title: "小心翼翼地为对方修剪一次指甲", completed: false },
      { id: "m_14", title: "在深夜寒冷的街头一起喝一碗热气腾腾的馄饨", completed: false },
      { id: "m_15", title: "每年结婚纪念日重游当年走过的一个重要地点", completed: false },
      { id: "m_16", title: "一生一世，不离不弃，一直坚定地牵手走到金婚白头", completed: false }
    ],
    scratchCards: [
      {
        id: "m_card_1",
        title: "烟火家务全包金牌",
        content: "今天所有的买菜、做饭、洗碗、拖地等一切家务全由我一人承包，安心当树懒！",
        icon: "🧹",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "m_card_2",
        title: "十分钟无言深拥卡",
        content: "受了委屈或感到疲惫时出示此卡，无需任何解释，立刻给你一个十分钟的长久拥抱！",
        icon: "🫂",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "m_card_3",
        title: "情绪休假 24 小时卡",
        content: "婚姻里撑不住时出示此卡，拥有 24 小时绝对摆烂权，不用管琐事，家里一切由我顶着！",
        icon: "🛌",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "m_card_4",
        title: "温柔洗头吹发 VIP",
        content: "享受专属洗头与吹风机造型护理一次，包含轻柔头部按摩，包君满意！",
        icon: "💆‍♀️",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "m_card_5",
        title: "深夜外卖买单卡",
        content: "无论多晚，指定想吃的夜宵或甜品，由对方全额买单并送至手上！",
        icon: "🍟",
        scratched: false,
        used: false,
        usedTime: ""
      },
      {
        id: "m_card_6",
        title: "吵架破冰特赦令",
        content: "无论谁对谁错，亮出此令立刻停止冷战，互相给对方台阶下，紧紧拥抱！",
        icon: "🕊️",
        scratched: false,
        used: false,
        usedTime: ""
      }
    ]
  }
};

// ================= 2. 星轨中枢舞台生命周期控制器 (StageManager) =================
class StageManager {
  constructor() {
    this.currentStage = null;
    this.lockedScrollY = 0;
    this.container = null;
    this.overlay = null;
    this.isTransitioning = false;
    this.initialized = false;
  }

  init() {
    this.container = document.getElementById("stage-modal-container");
    this.overlay = document.getElementById("stage-modal-overlay");

    if (this.initialized) return;
    this.initialized = true;

    // 全局事件委托：任意深度的中枢卡片点击均可精准捕获
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-stage]");
      if (openBtn) {
        e.preventDefault();
        const stageId = openBtn.getAttribute("data-open-stage");
        this.openStage(stageId);
        return;
      }

      const closeBtn = e.target.closest(".stage-modal__close-btn, [data-close-stage]");
      if (closeBtn) {
        e.preventDefault();
        this.closeStage();
        return;
      }

      if (this.overlay && (e.target === this.overlay || e.target.id === "stage-modal-container")) {
        this.closeStage();
      }
    });

    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.stage) {
        this.showStageDom(e.state.stage);
      } else if (this.currentStage) {
        this.closeStageDom();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.currentStage) {
        this.closeStage();
      }
    });

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && document.getElementById(`stage-${initialHash}`)) {
      setTimeout(() => {
        this.openStage(initialHash, false);
      }, 300);
    }
  }

  openStage(stageId, pushHistory = true) {
    if (!this.container || !this.overlay) {
      this.container = document.getElementById("stage-modal-container");
      this.overlay = document.getElementById("stage-modal-overlay");
    }

    const stageEl = document.getElementById(`stage-${stageId}`);
    if (!stageEl || this.isTransitioning) return;

    this.isTransitioning = true;

    this.lockScroll();

    if (pushHistory) {
      window.history.pushState({ stage: stageId }, "", `#${stageId}`);
    }

    this.showStageDom(stageId);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("stage:opened", { detail: { stageId } }));
      window.dispatchEvent(new Event("resize"));
      this.isTransitioning = false;
    }, 280);
  }

  closeStage(updateHistory = true) {
    if (!this.currentStage || this.isTransitioning) return;
    this.isTransitioning = true;

    const closingStageId = this.currentStage;

    window.dispatchEvent(new CustomEvent("stage:closing", { detail: { stageId: closingStageId } }));

    if (updateHistory && window.location.hash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }

    this.closeStageDom();

    this.unlockScroll();

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("stage:closed", { detail: { stageId: closingStageId } }));
      this.isTransitioning = false;
    }, 280);
  }

  showStageDom(stageId) {
    document.querySelectorAll(".stage-modal").forEach(el => {
      el.classList.remove("stage-modal--active");
    });

    const targetEl = document.getElementById(`stage-${stageId}`);
    if (targetEl) {
      if (this.container) this.container.classList.add("stage-container--active");
      if (this.overlay) this.overlay.classList.add("stage-overlay--active");
      targetEl.classList.add("stage-modal--active");
      this.currentStage = stageId;

      const bodyWrapper = targetEl.querySelector(".stage-modal__body");
      if (bodyWrapper) bodyWrapper.scrollTop = 0;
    }
  }

  closeStageDom() {
    if (this.container) this.container.classList.remove("stage-container--active");
    if (this.overlay) this.overlay.classList.remove("stage-overlay--active");
    document.querySelectorAll(".stage-modal").forEach(el => {
      el.classList.remove("stage-modal--active");
    });
    this.currentStage = null;
  }

  lockScroll() {
    this.lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("body--locked");
    document.body.style.top = `-${this.lockedScrollY}px`;
  }

  unlockScroll() {
    document.body.classList.remove("body--locked");
    document.body.style.top = "";
    window.scrollTo(0, this.lockedScrollY);
  }
}

window.StageManager = new StageManager();
window.openStage = (id) => window.StageManager.openStage(id);
window.closeStage = () => window.StageManager.closeStage();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => window.StageManager.init());
} else {
  window.StageManager.init();
}
