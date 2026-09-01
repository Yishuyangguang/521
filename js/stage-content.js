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
    subtitle: "在尊重与接纳中了解彼此，坚守圣洁",
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
      { id: "d_17", title: "[原生解毒] 探讨各自的原生家庭对自己在生活习惯、情绪表达和冲突处理上的深远影响，并彼此体恤。", completed: false },
      { id: "d_18", title: "[卸下秀场] 练习不在社交媒体上过度“秀恩爱”来支撑自我形象，而是在私底下踏实地向对方表达最深、不为人知的肯定。", completed: false },
      { id: "d_19", title: "[放下防御] 当对方指出你身上的某个缺点时，克制住本能的自我防御，深吸一口气问：“谢谢你的诚实，我的这个习惯让你感到不舒服了吗？”", completed: false },
      { id: "d_20", title: "[人间烟火] 一起去菜市场买菜、做一顿饭、洗碗，体验最平凡的日常，看彼此在琐事中的分工与合作。", completed: false },
      { id: "d_21", title: "[勇敢说不] 练习在不伤害对方自尊的前提下，勇敢地对对方不合理的索求说“不”，保护彼此在关系中的独立人格。", completed: false },
      { id: "d_22", title: "[朋友圈接轨] 共同探望一次彼此的朋友，并在事后聊聊：“你觉得我的朋友们好相处吗？你从他们身上看到了怎样的我？”", completed: false },
      { id: "d_23", title: "[字面冷静] 承诺不在微信或文字里讨论复杂的敏感问题，当感觉字面意思有冲突时，立刻转换为电话或面对面沟通。", completed: false },
      { id: "d_24", title: "[延迟满足] 在恋爱中不急于用身体的结合来解决关系中的不安全感，坚持“让情感温度与心智了解保持同步”。", completed: false },
      { id: "d_25", title: "[隐私界线] 讨论彼此对“界线”的定义（如：异性社交的边界、手机隐私的边界），建立基于绝对信任的默契。", completed: false },
      { id: "d_26", title: "[平等怜悯] 共同去参与一次社区公益或帮助弱势群体的活动，观察对方在面对不如自己的人时，是否存有真正的温柔。", completed: false },
      { id: "d_27", title: "[幽默带过] 练习在对方不符合你预期（如约会迟到、买错礼物）时，不给对方脸色看，而是温和地开个玩笑带过。", completed: false },
      { id: "d_28", title: "[理财热身] 共同建立一个“浪漫蓄水池”（共同储蓄），一起规划并为一次旅行存钱，练习初步的共同财务决策。", completed: false },
      { id: "d_29", title: "[去消费化] 至少完成一次“不花大钱”却充满惊喜的浪漫约会，体验不依赖物质消费的纯粹浪漫。", completed: false },
      { id: "d_30", title: "[誓言探讨] 坦诚地讨论对“婚姻”本身的看法：你觉得婚姻只是一张随时可以解约的合伙合同，还是一场同甘共苦的生命托付？", completed: false },
      { id: "d_31", title: "[文字浪漫] 尝试写一封手写信给对方，用最质朴的文字表达你对Ta的欣赏，而不是只有甜言蜜语。", completed: false },
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
      { id: "e_1", title: "[誓言宣告] 举行一次庄重的承诺谈话，确认彼此愿意在未来不论贫穷、疾病、顺境、逆境，都共同坚守、不离不弃。", completed: false },
      { id: "e_2", title: "[财务建制] 制定一份详细的家庭预算与共同理财方案，确定未来的日常开销、储蓄与理财由谁来主管，如何透明分配。", completed: false },
      { id: "e_3", title: "[家庭外交] 共同拜访双方父母商讨婚礼细节，练习在双方长辈的不同期望与你们的实际预算之间，充当彼此家庭的“外交官”和“护盾”。", completed: false },
      { id: "e_4", title: "[家务承包] 进行一次关于“家务分配”的深度妥协，将垃圾分类、扫地、做饭具体到个人，并承诺在婚后不因琐事互相推诿。", completed: false },
      { id: "e_5", title: "[排雷清单] 坦诚分享各自最害怕在关系中出现的“雷区”（如冷暴力、欺骗、原生家庭过度干涉），并商定预防机制。", completed: false },
      { id: "e_6", title: "[婚礼降温] 面对婚礼筹备中极繁琐、极易引发冲突的细节，练习不赌气，以“办一场婚礼不值得伤了我们的爱”为共识。", completed: false },
      { id: "e_7", title: "[新旧边界] 讨论婚后如何平衡“我们的新家庭”与“各自的原生家庭”之间的关系，确立“新家庭优先”的边界。", completed: false },
      { id: "e_8", title: "[虚荣断舍离] 放弃“婚礼必须完美无瑕、让所有人羡慕”的虚荣，将焦点转回到“我们正在和这个人缔结一生之约”的真实美感中。", completed: false },
      { id: "e_9", title: "[家庭仪式] 设计一个未来新家的“规则与仪式”（如：每天出门前拥抱、每周五晚上是固定的手机静音之夜）。", completed: false },
      { id: "e_10", title: "[幻觉破除] 在订婚期发现彼此的磨合点时，克制住“结了婚他就会变好”的幻想，学会诚实面对，并练习在当下的磨合中为对方退让。", completed: false },
      { id: "e_11", title: "[组队宣告] 清晰列出婚后可能面临的最大实际压力（如职业瓶颈、异地奋斗），在心理上做好“我们要组队对抗困境”的生死盟友默契。", completed: false },
      { id: "e_12", title: "[育儿探讨] 坦诚地探讨对未来“生育计划”的看法：要不要孩子？什么时候要？由谁来主力带？在教育理念上有哪些底线？", completed: false },
      { id: "e_13", title: "[晚年画面] 拿出一个周末，关掉所有喧嚣，两个人静静地手拉手，聊聊你们对“白头偕老、满头银发时依然相爱”的路线规划。", completed: false }
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
      { id: "m_1", title: "[降火一杯水] 当在生活中发生激烈争吵、火气上头时，练习在说出伤害性的话前闭上嘴，去厨房为对方倒一杯温水。", completed: false },
      { id: "m_2", title: "[删除离字] 坚决不用“离婚”这两个字作为威胁、赌气或争吵的武器，永远不给婚姻的根基留下裂缝。", completed: false },
      { id: "m_3", title: "[不抱怨入睡] 坚持“当天的问题当天解决”，不带着对彼此的冷漠和怨恨入睡，至少在睡前手拉手说一声“晚安，我依然爱你”。", completed: false },
      { id: "m_4", title: "[容忍瑕疵] 练习接受并原谅对方身上那些“永远也改不掉的小毛病”（如挤牙膏的位置、鞋子乱放），明白接纳不完美才是真爱的起点。", completed: false },
      { id: "m_5", title: "[婚姻体检] 每月固定进行一次“婚姻体检谈话”，不带怨气地交流：“这一个月，我有哪些地方让你觉得不被尊重或冷落了？我怎么做能让你觉得更安全？”", completed: false },
      { id: "m_6", title: "[失业托底] 当对方在工作中遭遇严重危机（如降薪、裁员、创业失败）时，温柔地对他说：“你丢了工作，但你永远没有丢掉我。有我在，我们重新开始。”", completed: false },
      { id: "m_7", title: "[烛光防线] 在柴米油盐的琐碎中，依然坚持每两周一次（或每月最少一次）的“两人专属约会日”，不让生活琐事和孩子彻底淹没爱情的温度。", completed: false },
      { id: "m_8", title: "[带头认错] 练习真诚地、大声地向对方承认自己的错误和无理取闹：“今天是我情绪不好，把工作的压力带回家对你发火了，请你原谅我。”", completed: false },
      { id: "m_9", title: "[接受赦免] 当你发火后、羞愧得想自我封闭时，练习大方地接受对方给你的宽恕与下台阶，不陷入“我不配/我无法原谅自己”的自闭陷阱。", completed: false },
      { id: "m_10", title: "[一票否决] 在做重大财务决定（如买房、换车、借钱给亲戚）前，必须达成两个人的绝对共识，任何一方享有温和的“一票否决权”。", completed: false },
      { id: "m_11", title: "[年度出逃] 每年至少一起去一个陌生的地方旅行一次，在未知的环境中重新发现彼此身上的可爱与可靠。", completed: false },
      { id: "m_12", title: "[啦啦队长] 练习在公共场合或朋友圈，真诚、不吝啬地夸奖和赞美配偶，永远做配偶最大的“啦啦队”。", completed: false },
      { id: "m_13", title: "[原生防火墙] 当对方的原生家庭对你们的生活提出不合理要求时，由“身为子女的那一方”主动站出来去温和拒绝和沟通，绝不让配偶直接面对冲突。", completed: false },
      { id: "m_14", title: "[亲密敬重] 保持亲密生活中的坦诚、温柔与敬重，不把亲密当成惩罚对方的筹码，也不把它当成敷衍了事的生理任务。", completed: false },
      { id: "m_15", title: "[支持梦想] 刻意支持对方在婚后继续追求个人的职业梦想、深造学习或有益身心的兴趣爱好，不要求对方为了家庭完全抹杀自我。", completed: false },
      { id: "m_16", title: "[基石排位] 当迎来孩子、面对辅导作业和育儿崩溃时，提醒彼此：“孩子只是我们生命的礼物，我们两人的夫妻关系，才是这个家最稳固的基石。”", completed: false },
      { id: "m_17", title: "[病床讲台] 练习在对方生病、卧床不起或遭遇慢性病折磨时，用极大的温情去照顾他，在病床前活出陪伴的温柔。", completed: false },
      { id: "m_18", title: "[孩子面前的尊严] 承诺不在孩子面前大声指责和贬低配偶，保护配偶在孩子面前的尊严。", completed: false },
      { id: "m_19", title: "[家庭编年史] 共同建立一个属于你们新家庭的“家庭年度大事记”或照片墙，记录每一年共同走过的风雨和喜乐。", completed: false },
      { id: "m_20", title: "[微小致谢] 练习在对方做了一件很小但体贴的事（如半夜给你盖被子、顺手洗了你的袜子）时，真诚、深情地对他说谢谢。", completed: false },
      { id: "m_21", title: "[拒绝贬低幽默] 练习不在外人面前开贬低配偶的“玩笑”或玩低俗的自嘲，保护你们之间那份珍贵的体面。", completed: false },
      { id: "m_22", title: "[无声托底] 当对方的情绪陷入长期的低潮或轻微抑郁时，不用道德和“坚强”去评判他，默默握住他的手，陪他寻找专业帮助。", completed: false },
      { id: "m_23", title: "[职场屏障] 拒绝任何形式的“精神出轨”和暧昧社交，主动在职场和生活中，向他人表明自己已婚、且极度爱配偶的身份。", completed: false },
      { id: "m_24", title: "[爱的小屋] 共同管理家务：不把家务当成某一个人的“绝对义务”，而是当成共同经营温馨小家的快乐协作。", completed: false },
      { id: "m_25", title: "[手写纪念日] 即使在结婚十年、二十年后，依然在每年结婚纪念日给对方准备一份走心、写满爱意的手写卡片。", completed: false },
      { id: "m_26", title: "[拒绝风凉话] 练习在对方做错决定导致经济损失或家庭麻烦时，克制住“我早就跟你说过了”这句最伤人的风凉话，走过去说：“没关系，我们一起承担。”", completed: false },
      { id: "m_27", title: "[财务留白] 在家庭的日常预算之外，设立一个“配偶自由支配金”（零花钱），绝不追问对方这笔钱的使用明细。", completed: false },
      { id: "m_28", title: "[对抗衰老] 练习在对方面对中年危机、容颜衰老、身体走形时，依然用充满爱慕的眼神看着他，告诉他：“在我眼里，你今天比我们初见的那天还要迷人，因为我们共同走过了沧桑。”", completed: false },
      { id: "m_29", title: "[温和喊停] 承诺不用“冷暴力”和故意不说话来折磨对方，当需要冷静时，说清楚：“我现在情绪有点乱，我需要独自安静一小时，但我保证一小时后我回来和你好好谈。”", completed: false },
      { id: "m_30", title: "[风雨同舟] 共同面对家庭的生老病死：在面临长辈去世等深重哀伤时，用无声的陪伴、拥抱和坚实的肩膀，成为配偶最可靠的港湾。", completed: false },
      { id: "m_31", title: "[茶叙交流] 建立共同的思想交流习惯，每隔一段时间一起喝杯茶，聊聊最近对人生的新感悟、新思考。", completed: false },
      { id: "m_32", title: "[得体相对] 即使在最平凡的“柴米油盐”中，也要保持个人卫生的整洁与得体，这同样是对配偶长久爱与尊重的表现。", completed: false },
      { id: "m_33", title: "[慷慨好客] 探讨并规划你们新家庭的“待客之道”，慷慨、热情地招待彼此的朋友、同事和邻居。", completed: false },
      { id: "m_34", title: "[情绪防空洞] 当配偶在人际交往中受了委屈、哭着回家时，坚定地站在他这一边，先做他宣泄情绪的垃圾桶，而不是客观冷血的理性裁判。", completed: false },
      { id: "m_35", title: "[奢侈专注力] 练习在对方说话时，看着他的眼睛，放下手中的手机或电脑，给予配偶最奢侈的“专注力”。", completed: false },
      { id: "m_36", title: "[双边平衡] 共同商定一个关于“逢年过节回谁家”的无痛公平方案（如：一年一家，或两边一起过），彻底避免节日撕扯。", completed: false },
      { id: "m_37", title: "[同船共渡] 即使在意见最不合、面临最严峻磨合的时刻，也依然坚定地确信：“我们既然已经结婚，就不是敌对的两方，我们是同一条船上的水手，任何问题我们都只能共同面对。”", completed: false },
      { id: "m_38", title: "[共绘夕阳] 抽出时间，共同规划你们的晚年：聊聊几十年后退休了，你们要去哪里旅行、如何优雅地老去，并在欢笑中充满盼望。", completed: false },
      { id: "m_39", title: "[枕边感恩] 每天晚上闭上眼睛前，在心里默默为配偶一天的平安和陪伴而感恩，带着被接纳的温柔沉入梦乡。", completed: false },
      { id: "m_40", title: "[尊重黑洞] 尊重对方在家庭生活中偶尔需要的“独处黑洞”（特别是高压之后的安静），在旁边放一杯温水，静静退去。", completed: false },
      { id: "m_41", title: "[拥抱不完美] 练习不用“完美配偶”的标准去绑架和折磨对方，明白没有完美的婚姻，只有两个愿意不断原谅、携手前行的普通人。", completed: false },
      { id: "m_42", title: "[无权势相待] 在日常生活中，不以财富多少和成就去要挟或控制配偶，让平等与真正的尊严流淌在你们的餐桌上。", completed: false },
      { id: "m_43", title: "[穿透岁月] 无论未来的世界如何变迁、社会观念如何解构，你们在心里始终坚守那句承诺：“我们的爱，必能穿透岁月的磨砺，因为我们已经甘心在爱里为对方舍弃了自己。”", completed: false }
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
