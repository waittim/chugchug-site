import React from 'react';
import {
  AlertTriangle,
  Crown,
  Dices,
  Fingerprint,
  Frown,
  Heart,
  MessagesSquare,
  Radio,
  Search,
  Spade,
  Type,
} from 'lucide-react';

export const GAMES = [
  {
    id: 'dice',
    name: { zh: '骰子', 'zh-Hant': '骰子', en: 'Dice' },
    tagline: {
      zh: '吹牛与大话骰，派对永恒硬通货',
      'zh-Hant': '吹牛與大話骰，派對永恆硬通貨',
      en: 'The timeless bar classic for bluffing & high stakes',
    },
    icon: <Dices size={32} />,
    duration: '∞',
    rules: {
      zh: '用于“吹牛骰”，“大话骰”。\n或者掷骰决定点数/顺序（按你们玩法）。\n每轮结束后，输的人喝一口或接受惩罚。',
      'zh-Hant': '用於「吹牛骰」、「大話骰」。\n或者擲骰決定點數/順序（按你們玩法）。\n每輪結束後，輸的人喝一口或接受懲罰。',
      en: 'Roll to decide numbers/order (house rules).\nEnd of round: loser drinks or takes a challenge.',
    },
  },
  {
    id: 'undercover',
    name: { zh: '谁是卧底', 'zh-Hant': '誰是臥底', en: 'Undercover' },
    tagline: {
      zh: '暗流涌动的文字伪装，找出隐秘卧底',
      'zh-Hant': '暗流湧動的文字偽裝，找出隱秘臥底',
      en: 'Deception and deduction to hunt down the outsider',
    },
    icon: <Search size={32} />,
    duration: '15m',
    rules: {
      zh: '每人拿到词：多数相同，卧底不同。\n轮流描述但不能说出词。\n每一轮投票淘汰，直到找出卧底或卧底活到最后。',
      'zh-Hant': '每人拿到詞：多數相同，臥底不同。\n輪流描述但不能說出詞。\n每一輪投票淘汰，直到找出臥底或臥底活到最後。',
      en: 'Everyone gets a word: most same, undercover different.\nTake turns describing without saying the word.\nVote each round to eliminate until finding the undercover or they survive to the end.',
    },
  },
  {
    id: 'poker',
    name: { zh: '扑克', 'zh-Hant': '撲克', en: 'Playing Cards' },
    tagline: {
      zh: '经典标准扑克，随抽随玩自定义规则',
      'zh-Hant': '經典標準撲克，隨抽隨玩自定義規則',
      en: 'Universal standard deck ready for any drinking rules',
    },
    icon: <Spade size={32} />,
    duration: '∞',
    rules: {
      zh: '点击抽牌。\n按牌面执行你们的规则（例如：A=指定喝，K=罚酒等）。',
      'zh-Hant': '點擊抽牌。\n按牌面執行你們的規則（例如：A=指定喝，K=罰酒等）。',
      en: 'Tap to draw.\nFollow your card rules (e.g., A=pick, K=penalty).',
    },
  },
  {
    id: 'buzzcards',
    name: { zh: 'Chug牌', 'zh-Hant': 'Chug牌', en: 'Chug Cards' },
    tagline: {
      zh: '即抽即惩罚，打破冷场的快速指令牌',
      'zh-Hant': '即抽即懲罰，打破冷場的快速指令牌',
      en: 'Rapid-fire cards with instant social penalties',
    },
    icon: <Spade size={32} />,
    duration: '60m',
    rules: {
      zh: '抽取一张卡牌。\n根据抽中的卡牌执行惩罚。',
      'zh-Hant': '抽取一張卡牌。\n根據抽中的卡牌執行懲罰。',
      en: 'Draw a card.\nFollow the penalty on the drawn card.',
    },
  },
  {
    id: 'six',
    name: { zh: '六一', 'zh-Hant': '六一', en: 'Six Ones' },
    tagline: {
      zh: '掷六消除掷一转让，紧张刺激的比拼',
      'zh-Hant': '擲六消除擲一轉讓，緊張刺激的比拼',
      en: 'Fast roll-off: clear your dice or pass them on',
    },
    icon: <Dices size={32} />,
    duration: '5m',
    rules: {
      zh: '双方各 5 颗骰子。\n同时摇骰：掷到 6 的骰子移除；掷到 1 的骰子转给对方。\n先清空自己所有骰子的一方获胜！',
      'zh-Hant': '雙方各 5 顆骰子。\n同時搖骰：擲到 6 的骰子移除；擲到 1 的骰子轉給對方。\n先清空自己所有骰子的一方獲勝！',
      en: 'Each side has 5 dice.\nRoll together: 6s are removed; 1s are given to the opponent.\nFirst to have 0 dice wins!',
    },
  },
  {
    id: 'lucky',
    name: { zh: 'Lucky', 'zh-Hant': 'Lucky', en: 'Lucky' },
    tagline: {
      zh: '按住摇骰比牌型，绝地翻盘的命运较量',
      'zh-Hant': '按住搖骰比牌型，絕地翻盤的命運較量',
      en: 'Press, roll, match poker dice, and turn the tables',
    },
    icon: <Dices size={32} />,
    duration: '2m',
    rules: {
      zh: '5 骰=牌型；大小：1（Ace）>6≥5≥4≥3≥2。\n同时按住摇骰比牌，输家可锁定部分骰子重摇未锁定的骰子。\n若翻盘则胜负互换；否则输家出局。\n循环直到有人救场失败，最后留下者获胜！',
      'zh-Hant': '5 骰=牌型；大小：1（Ace）>6≥5≥4≥3≥2。\n同時按住搖骰比牌，輸家可鎖定部分骰子重搖未鎖定的骰子。\n若翻盤則勝負互換；否則輸家出局。\n循環直到有人救場失敗，最後留下者獲勝！',
      en: '5 dice form a hand; rank: 1 (Ace) > 6 ≥ 5 ≥ 4 ≥ 3 ≥ 2.\nRoll together; compare hands. Loser may lock dice and re-roll the rest.\nIf the new hand beats the winner, swap roles; otherwise the loser is out.\nRepeat until someone can’t save - last player standing wins.',
    },
  },
  {
    id: 'truth',
    name: { zh: '真心话大冒险', 'zh-Hant': '真心話大冒險', en: 'Truth or Dare' },
    tagline: {
      zh: '深度剖白或大胆出击，迅速拉近距离',
      'zh-Hant': '深度剖白或大膽出擊，迅速拉近距離',
      en: 'Spicy confessions and daring feats to break the ice',
    },
    icon: <Heart size={32} />,
    duration: '∞',
    rules: {
      zh: '轮到你：选 真心话 / 大冒险。\n拒绝回答或完成：喝一口。\n可选不同等级。',
      'zh-Hant': '輪到你：選 真心話 / 大冒險。\n拒絕回答或完成：喝一口。\n可選不同等級。',
      en: 'On your turn: choose Truth or Dare.\nRefuse to answer or complete = drink.\nOptional different levels.',
    },
  },
  {
    id: 'roulette',
    name: { zh: '指尖轮盘', 'zh-Hant': '指尖輪盤', en: 'Finger Picker' },
    tagline: {
      zh: '多指轻触屏幕，命悬一线的随机点名',
      'zh-Hant': '多指輕觸螢幕，命懸一線的隨機點名',
      en: 'Multi-touch finger picker to select the next player',
    },
    icon: <Fingerprint size={32} />,
    duration: '1m',
    rules: {
      zh: '点击开始随机点名。\n被选中的人执行：喝/讲故事/做任务（任选）。',
      'zh-Hant': '點擊開始隨機點名。\n被選中的人執行：喝/講故事/做任務（任選）。',
      en: 'Tap to randomly pick someone.\nChosen player: drink / story / task (your choice).',
    },
  },
  {
    id: 'king',
    name: { zh: '国王游戏', 'zh-Hant': '國王遊戲', en: "King's Game" },
    tagline: {
      zh: '抽中王冠号令全场，绝对服从的国王密令',
      'zh-Hant': '抽中王冠號令全場，絕對服從的國王密令',
      en: 'The King commands, everyone else must obey',
    },
    icon: <Crown size={32} />,
    duration: '2m',
    rules: {
      zh: '抽到国王的人下命令。\n被点到的人必须执行。\n拒绝：喝两口或加罚。',
      'zh-Hant': '抽到國王的人下命令。\n被點到的人必須執行。\n拒絕：喝兩口或加罰。',
      en: 'The King gives a command.\nChosen player must obey.\nRefuse = 2 sips or penalty.',
    },
  },
  {
    id: 'charades',
    name: { zh: '猜词游戏', 'zh-Hant': '猜詞遊戲', en: 'Heads Up' },
    tagline: {
      zh: '争分夺秒，肢体表演与爆笑猜词大作战',
      'zh-Hant': '爭分奪秒，肢體表演與爆笑猜詞大作戰',
      en: 'Timed acting and hilarious high-energy guessing',
    },
    icon: <Type size={32} />,
    duration: '5m',
    rules: {
      zh: '选择类别并开始计时。\n表演/描述但不能说出关键词。\n猜中得分；失败喝一口。',
      'zh-Hant': '選擇類別並開始計時。\n表演/描述但不能說出關鍵詞。\n猜中得分；失敗喝一口。',
      en: 'Pick a category and start timer.\nAct/describe without saying the word.\nCorrect = point; fail = drink.',
    },
  },
  {
    id: 'execution',
    name: { zh: '公开处刑', 'zh-Hant': '公開處刑', en: 'Most Likely To' },
    tagline: {
      zh: '全员倒数指认，公开处刑谁最符合人设',
      'zh-Hant': '全員倒數指認，公開處刑誰最符合人設',
      en: 'Count down and point: most votes takes the penalty',
    },
    icon: <AlertTriangle size={32} />,
    duration: '∞',
    rules: {
      zh: '读出题目“最可能…”。\n大家同时指向一个人。\n票最多的和指自己的人喝一口。',
      'zh-Hant': '讀出題目「最可能…」。\n大家同時指向一個人。\n票最多的和指自己的人喝一口。',
      en: 'Read a “Most likely to…” prompt.\nEveryone points at once.\nMost votes and self-pointers drink.',
    },
  },
  {
    id: 'wavelength',
    name: { zh: '心电感应', 'zh-Hant': '心電感應', en: 'Wavelength' },
    tagline: {
      zh: '寻找同一波长，考验彼此默契的心灵指针',
      'zh-Hant': '尋找同一波長，考驗彼此默契的心靈指針',
      en: 'Tune into the exact same mental frequency',
    },
    icon: <Radio size={32} />,
    duration: '3m',
    rules: {
      zh: '出题人记住目标位置。\n根据出题人给出的例子，猜测方拖动指针。\n确认后揭晓答案，判断误差。根据结果进行奖惩。',
      'zh-Hant': '出題人記住目標位置。\n根據出題人給出的例子，猜測方拖動指針。\n確認後揭曉答案，判斷誤差。根據結果進行獎懲。',
      en: "Psychic remembers target position.\nBased on Psychic's examples, guessers drag pointer.\nConfirm to reveal answer and judge error.\nReward or penalty based on results.",
    },
  },
  {
    id: 'aron36',
    name: { zh: '36问', 'zh-Hant': '36問', en: '36 Questions' },
    tagline: {
      zh: '心理学经典36问，剥开防备的灵魂对话',
      'zh-Hant': '心理學經典36問，剝開防備的靈魂對話',
      en: 'Aron’s 36 questions to connect on a deeper level',
    },
    icon: <MessagesSquare size={32} />,
    duration: '45m',
    rules: {
      zh: '轮流回答亚瑟·阿伦著名的 36 个问题。\n帮助你们深入了解彼此。\n没有对错，真诚回答就好。',
      'zh-Hant': '輪流回答亞瑟·阿倫著名的 36 個問題。\n幫助你們深入了解彼此。\n沒有對錯，真誠回答就好。',
      en: "Take turns answering Arthur Aron's famous 36 questions.\nDesigned to help you connect on a deeper level.\nNo right or wrong answers - just be honest.",
    },
  },
  {
    id: 'angryoldman',
    name: { zh: '愤怒的老头', 'zh-Hant': '憤怒的老頭', en: 'Angry Old Man' },
    tagline: {
      zh: '谁也不想惊醒他，心跳加速的避雷淘汰',
      'zh-Hant': '誰也不想驚醒他，心跳加速的避雷淘汰',
      en: 'Tense turn-taking: poke the board without getting caught',
    },
    icon: <Frown size={32} />,
    duration: '1m',
    rules: {
      zh: '屏幕上会出现一群老头。\n轮流选择，避免戳中会发怒的老头。\n戳中发怒老头的接受惩罚。',
      'zh-Hant': '螢幕上會出現一群老頭。\n輪流選擇，避免戳中會發怒的老頭。\n戳中發怒老頭的接受懲罰。',
      en: 'A bunch of old men appear on screen.\nTake turns picking one - avoid the angry old man!\nWhoever pokes the angry old man takes a penalty.',
    },
  },
];
