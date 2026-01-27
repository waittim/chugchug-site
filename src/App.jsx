import React, { useMemo, useState } from 'react';
import {
  Dices,
  Spade,
  Heart,
  Crown,
  Fingerprint,
  Type,
  Search,
  Smartphone,
  ArrowDown,
  AlertTriangle,
} from 'lucide-react';

const App = () => {
  const [lang, setLang] = useState('zh'); // 'zh' or 'en'
  const [flippedIds, setFlippedIds] = useState(() => new Set());

  const toggleFlip = (id) => {
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const t = useMemo(
    () => ({
      zh: {
        nav_download: '下载 App',
        hero_title_1: '吨',
        hero_title_2: '吨',
        hero_title_3: '吨',
        hero_subtitle: '今晚玩点什么？',
        hero_feature: '派对神器 · 防误触 · 拒绝冷场',
        grid_title_prefix: '派对游戏',
        grid_title_suffix: 'All-in-One',
        grid_desc: '不管是真心话还是大冒险，\n一个 App 拯救所有局。',
        cta_main: '告别复杂的规则解释，',
        cta_highlight: '防误触',
        cta_suffix: '设计，让派对更尽兴。',
	        btn_download: 'App Store 下载',
	        feat_ios: 'iOS 独占',
	        feat_ads: '无广告',
	        feat_drunk: '防醉酒模式',
	        card_hint_front: '点击查看规则',
	        card_hint_back: '点击返回',
	        rules_title: '规则',
	        footer_rights: '© 2026 CHUGCHUG APP',
	        footer_privacy: '隐私政策',
	        footer_contact: '联系我们',
	      },
      en: {
        nav_download: 'Download',
        hero_title_1: 'Chug',
        hero_title_2: 'Chug',
        hero_title_3: '',
        hero_subtitle: 'What are we playing tonight?',
        hero_feature: 'Party Essentials · Drunk-Proof · No Awkward Silence',
        grid_title_prefix: 'Party Games',
        grid_title_suffix: 'All-in-One',
        grid_desc: 'Truth or Dare or Dice?\nSave the party with one app.',
        cta_main: 'No more explaining rules.',
        cta_highlight: 'Drunk-Proof',
        cta_suffix: 'design for better parties.',
	        btn_download: 'Download on App Store',
	        feat_ios: 'iOS Only',
	        feat_ads: 'No Ads',
	        feat_drunk: 'Drunk Mode',
	        card_hint_front: 'Tap for rules',
	        card_hint_back: 'Tap to go back',
	        rules_title: 'Rules',
	        footer_rights: '© 2026 CHUGCHUG APP',
	        footer_privacy: 'Privacy',
	        footer_contact: 'Contact',
	      },
	    }),
    [],
  );

  const currentText = t[lang];

  const games = useMemo(
    () => [
	      {
	        id: 'dice',
	        name: { zh: '骰子', en: 'Dice' },
	        color: 'bg-[#FFE85F]',
	        icon: <Dices size={32} className="text-black" />,
	        desc: { zh: '大话骰必备', en: "Liar's Dice Essential" },
	        rules: {
	          zh: '掷骰决定点数/顺序（按你们玩法）。\n每轮结束后，输的人喝一口或接受惩罚。',
	          en: 'Roll to decide numbers/order (house rules).\nEnd of round: loser drinks or takes a challenge.',
	        },
	      },
	      {
	        id: 'poker',
	        name: { zh: '扑克', en: 'Poker' },
	        color: 'bg-white',
	        icon: <Spade size={32} className="text-black" />,
	        desc: { zh: '虚拟抽卡', en: 'Virtual Cards' },
	        rules: {
	          zh: '点击抽牌。\n按牌面执行你们的规则（例如：A=指定喝，K=罚酒等）。',
	          en: 'Tap to draw.\nFollow your card rules (e.g., A=pick, K=penalty).',
	        },
	      },
      {
        id: 'six',
        name: { zh: '六一', en: 'Six Ones' },
        color: 'bg-[#6EE7F3]',
        icon: <Dices size={32} className="text-black" />,
        desc: { zh: '经典酒桌游戏', en: 'Classic Drinking Game' },
        rules: {
          zh: '双方各 5 颗骰子。\n同时摇骰：掷到 6 的骰子移除；掷到 1 的骰子转给对方。\n先清空自己所有骰子的一方获胜！',
          en: 'Each side has 5 dice.\nRoll together: 6s are removed; 1s are given to the opponent.\nFirst to have 0 dice wins!',
        },
      },
      {
        id: 'lucky',
        name: { zh: 'Lucky', en: 'Lucky' },
        color: 'bg-[#FB458D]',
        icon: <Dices size={32} className="text-black" />,
        desc: { zh: '拼手气', en: 'Test Your Luck' },
        rules: {
          zh: '5 骰=牌型；大小：1（Ace）>6≥5≥4≥3≥2。\n同时按住摇骰比牌，输家可锁定部分骰子重摇未锁定的骰子。\n若翻盘则胜负互换；否则输家出局。\n循环直到有人救场失败，最后留下者获胜！',
          en: '5 dice form a hand; rank: 1 (Ace) > 6 ≥ 5 ≥ 4 ≥ 3 ≥ 2.\nRoll together; compare hands. Loser may lock dice and re-roll the rest.\nIf the new hand beats the winner, swap roles; otherwise the loser is out.\nRepeat until someone can’t save—last player standing wins.',
        },
      },
	      {
	        id: 'truth',
	        name: { zh: '真心话大冒险', en: 'Truth or Dare' },
	        color: 'bg-[#9664ED]',
	        icon: <Heart size={32} className="text-black" />,
	        desc: { zh: '包含3个等级', en: '3 Levels of Heat' },
	        rules: {
	          zh: '轮到你：选 真心话 / 大冒险。\n拒绝回答或完成：喝一口。\n可选等级：轻松/刺激/爆炸。',
	          en: 'On your turn: choose Truth or Dare.\nRefuse = drink.\nPick a level: mild / spicy / chaos.',
	        },
	      },
	      {
	        id: 'roulette',
	        name: { zh: '指尖轮盘', en: 'Finger Roulette' },
	        color: 'bg-[#50C3F6]',
	        icon: <Fingerprint size={32} className="text-black" />,
	        desc: { zh: '随机点名', en: 'Random Picker' },
	        rules: {
	          zh: '点击开始随机点名。\n被选中的人执行：喝/讲故事/做任务（任选）。',
	          en: 'Tap to randomly pick someone.\nChosen player: drink / story / task (your choice).',
	        },
	      },
	      {
	        id: 'king',
	        name: { zh: '国王游戏', en: "King's Game" },
	        color: 'bg-[#FFE85F]',
	        icon: <Crown size={32} className="text-black" />,
	        desc: { zh: '绝对服从', en: 'Absolute Obedience' },
	        rules: {
	          zh: '抽到国王的人下命令。\n被点到的人必须执行。\n拒绝：喝两口或加罚。',
	          en: 'The King gives a command.\nChosen player must obey.\nRefuse = 2 sips or penalty.',
	        },
	      },
      {
        id: 'charades',
        name: { zh: '猜词游戏', en: 'Heads Up' },
        color: 'bg-[#FB458D]',
        icon: <Type size={32} className="text-black" />,
        desc: { zh: '多种类别', en: 'Various Categories' },
        rules: {
          zh: '选择类别并开始计时。\n表演/描述但不能说出关键词。\n猜中得分；失败喝一口。',
          en: 'Pick a category and start timer.\nAct/describe without saying the word.\nCorrect = point; fail = drink.',
        },
      },
	      {
	        id: 'execution',
	        name: { zh: '公开处刑', en: 'Most Likely To' },
	        color: 'bg-[#FF6B6B]',
	        icon: <AlertTriangle size={32} className="text-black" />,
	        desc: { zh: '社死现场', en: 'Expose Your Friends' },
	        rules: {
	          zh: '读出题目“最可能…”。\n大家同时指向一个人。\n票最多的人喝一口（可选解释）。',
	          en: 'Read a “Most likely to…” prompt.\nEveryone points at once.\nMost votes drinks (optional explain).',
	        },
	      },
	      {
	        id: 'undercover',
	        name: { zh: '谁是卧底', en: 'Undercover' },
	        color: 'bg-[#6EE7F3]',
	        icon: <Search size={32} className="text-black" />,
	        desc: { zh: '逻辑推理', en: 'Social Deduction' },
	        rules: {
	          zh: '每人拿到词：多数相同，卧底不同。\n轮流描述但不能说出词。\n投票淘汰：找出卧底或卧底活到最后。',
	          en: 'Everyone gets a word: most same, undercover different.\nDescribe without saying it.\nVote out players; find undercover or they survive.',
	        },
	      },
    ],
    [],
  );

  const screenshotSrc =
    lang === 'zh'
      ? `${import.meta.env.BASE_URL}menu-zh.jpeg`
      : `${import.meta.env.BASE_URL}menu-en.jpeg`;
  const placeholderSrc = `${import.meta.env.BASE_URL}placeholder.svg`;
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-sans selection:bg-[#FFE85F] selection:text-black overflow-x-hidden flex flex-col">
      <style>
        {`
          .font-bubble {
            font-family: "SF Pro Rounded", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-weight: 800;
          }
        `}
      </style>

      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-2xl font-black tracking-tighter font-bubble flex items-center gap-2">
          {lang === 'en' ? 'ChugChug' : '吨吨吨'}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#download"
            className="hidden md:block bg-white text-black px-5 py-2 rounded-full font-bold border-2 border-transparent hover:scale-105 transition-transform duration-200"
          >
            {currentText.nav_download}
          </a>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
        <div className="text-center mb-16 z-10">
          <div className="relative inline-block">
            <h1 className="font-bubble text-[5rem] md:text-[10rem] leading-[0.9] text-white select-none transition-transform hover:scale-105 duration-300 cursor-default">
              {lang === 'zh' ? (
                <div className="flex gap-0 whitespace-nowrap tracking-tighter">
                  <div style={{ textShadow: '10px 10px 0px #FFE85F' }}>
                    {currentText.hero_title_1}
                  </div>
                  <div style={{ textShadow: '10px 10px 0px #FFE85F' }}>
                    {currentText.hero_title_2}
                  </div>
                  <div style={{ textShadow: '10px 10px 0px #FFE85F' }}>
                    {currentText.hero_title_3}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col tracking-tight -space-y-1 md:-space-y-3">
                  <div style={{ textShadow: '10px 10px 0px #FFE85F' }}>
                    {currentText.hero_title_1}
                  </div>
                  <div style={{ textShadow: '10px 10px 0px #FFE85F' }}>
                    {currentText.hero_title_2}
                  </div>
                </div>
              )}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-neutral-400 font-bold mt-8 tracking-wide font-bubble">
            {currentText.hero_subtitle}
          </p>
        </div>

        <div className="relative w-full max-w-[340px] aspect-[1/2.1] bg-black rounded-[3rem] border-[10px] border-neutral-800 shadow-[0_0_80px_rgba(255,232,95,0.15)] overflow-hidden mb-12 ring-1 ring-neutral-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20 border-b border-x border-neutral-800" />

          <div className="w-full h-full bg-[#1A1A1A] relative group">
            <img
              src={screenshotSrc}
              alt="ChugChug App Interface"
              className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-500 hover:opacity-100"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderSrc;
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
        </div>

        <div className="animate-bounce absolute bottom-8 text-neutral-600">
          <ArrowDown size={32} />
        </div>
      </section>

      <section className="min-h-screen py-24 px-4 md:px-12 bg-[#121212] relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight font-bubble">
                <span className="block">{currentText.grid_title_prefix}</span>
                <span className="block text-[#FB458D]">{currentText.grid_title_suffix}</span>
              </h2>
              <div className="h-2 w-32 bg-[#FFE85F]" />
            </div>
            <p className="text-neutral-400 text-lg font-bold max-w-md text-right md:text-left whitespace-pre-line">
              {currentText.grid_desc}
            </p>
          </div>

	          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
	            {games.map((game) => (
	              <div
	                key={game.id}
	                role="button"
	                tabIndex={0}
	                aria-label={`${game.name[lang]} - ${currentText.rules_title}`}
	                onClick={() => toggleFlip(game.id)}
	                onKeyDown={(e) => {
	                  if (e.key === 'Enter' || e.key === ' ') {
	                    e.preventDefault();
	                    toggleFlip(game.id);
	                  }
	                }}
	                className="group cursor-pointer select-none outline-none [perspective:1000px] focus-visible:ring-2 focus-visible:ring-[#FFE85F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
	              >
	                <div
	                  className={`
	                    relative aspect-square rounded-3xl
	                    transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
	                    hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000]
	                    active:translate-y-0 active:shadow-none
	                    [transform-style:preserve-3d]
	                    ${flippedIds.has(game.id) ? '[transform:rotateY(180deg)]' : ''}
	                  `}
	                >
	                  <div
	                    className={`
	                      absolute inset-0
	                      ${game.color}
	                      rounded-3xl border-4 border-black
	                      flex flex-col justify-between p-4 md:p-6
	                      [backface-visibility:hidden]
	                    `}
	                  >
	                    <div className="flex justify-between items-start">
	                      <div className="bg-black/10 p-2 rounded-xl backdrop-blur-sm transition-transform group-hover:scale-110 duration-300">
	                        {game.icon}
	                      </div>
	                    </div>

	                    <div>
	                      <h3 className="text-xl md:text-2xl font-black text-black leading-tight mb-1 font-bubble">
	                        {game.name[lang]}
	                      </h3>
	                      <p className="text-black font-bold text-xs md:text-sm opacity-60 uppercase tracking-wide font-bubble">
	                        {lang === 'zh' ? game.name.en : game.desc.en}
	                      </p>
	                      <p className="mt-2 text-black/70 text-xs md:text-sm font-bold font-bubble">
	                        {currentText.card_hint_front}
	                      </p>
	                    </div>
	                  </div>

		                  <div
		                    className={`
		                      absolute inset-0
		                      bg-black
		                      rounded-3xl border-4 border-neutral-800
		                      p-4 md:p-6
		                      flex flex-col justify-between overflow-hidden
		                      [backface-visibility:hidden]
		                      [transform:rotateY(180deg)]
		                    `}
		                  >
		                    <div className="flex flex-col min-h-0">
		                      <div className="flex items-start justify-between gap-4">
		                        <div>
		                          <p className="text-neutral-400 text-xs font-bold font-bubble">
		                            {currentText.rules_title}
		                          </p>
	                          <h4 className="text-white text-xl md:text-2xl font-black font-bubble leading-tight">
	                            {game.name[lang]}
	                          </h4>
	                        </div>
	                        <div className="shrink-0 bg-white/10 p-2 rounded-xl">
		                          {React.cloneElement(game.icon, { className: 'text-white' })}
		                        </div>
		                      </div>
		                      <p className="mt-4 flex-1 min-h-0 text-neutral-200 text-sm md:text-base font-bold whitespace-pre-line font-bubble leading-relaxed overflow-auto">
		                        {game.rules?.[lang] ?? ''}
		                      </p>
		                    </div>

	                    <div className="text-neutral-400 text-xs font-bold font-bubble">
	                      {currentText.card_hint_back}
	                    </div>
	                  </div>
	                </div>
	              </div>
	            ))}
	          </div>
        </div>
      </section>

      <section
        id="download"
        className="min-h-screen flex flex-col items-center relative px-4 bg-[#0F0F0F] py-32"
      >
        <div className="z-10 text-center max-w-3xl flex-grow flex flex-col justify-center">
          <div className="mb-8 transform hover:rotate-3 transition-transform duration-300 cursor-default">
            <span className="font-bubble text-[4rem] md:text-[6rem] leading-[0.9] text-white inline-block">
              {lang === 'zh' ? (
                <div className="flex gap-0 whitespace-nowrap tracking-tighter justify-center">
                  <div style={{ textShadow: '6px 6px 0px #FFE85F' }}>
                    {currentText.hero_title_1}
                  </div>
                  <div style={{ textShadow: '6px 6px 0px #FFE85F' }}>
                    {currentText.hero_title_2}
                  </div>
                  <div style={{ textShadow: '6px 6px 0px #FFE85F' }}>
                    {currentText.hero_title_3}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col tracking-tight -space-y-1 md:-space-y-2 items-center">
                  <div style={{ textShadow: '6px 6px 0px #FFE85F' }}>
                    {currentText.hero_title_1}
                  </div>
                  <div style={{ textShadow: '6px 6px 0px #FFE85F' }}>
                    {currentText.hero_title_2}
                  </div>
                </div>
              )}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-10 leading-relaxed font-bubble">
            {currentText.cta_main}
            <br />
            <span className="bg-[#FFE85F] text-black px-2 mx-1">
              {currentText.cta_highlight}
            </span>{' '}
            {currentText.cta_suffix}
          </h2>

          <div className="relative inline-block">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#FB458D] rounded-full blur-[110px] opacity-15 animate-pulse pointer-events-none -z-10" />
            <a
              className="
                group relative z-10 inline-flex items-center justify-center gap-4
                bg-white text-black
                px-12 py-6 rounded-3xl
                text-xl md:text-3xl font-black
                border-4 border-black
                shadow-[8px_8px_0px_#FB458D]
                hover:shadow-[12px_12px_0px_#22D3EE] hover:-translate-y-1 hover:-translate-x-1
                transition-all duration-200
                active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_#000]
              "
              href="#"
              aria-label={currentText.btn_download}
            >
              <Smartphone size={36} strokeWidth={2.5} />
              <span className="font-bubble">{currentText.btn_download}</span>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 text-neutral-500 font-bold text-xs md:text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFE85F]" />
              <span>{currentText.feat_ios}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FB458D]" />
              <span>{currentText.feat_ads}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22D3EE]" />
              <span>{currentText.feat_drunk}</span>
            </div>
          </div>
        </div>

        <footer className="w-full py-8 border-t border-neutral-900 bg-[#0F0F0F] z-20 mt-32">
          <div className="container mx-auto px-6 flex flex-row flex-wrap justify-between items-center text-neutral-600 text-xs md:text-sm gap-x-8 gap-y-4">
            <div className="font-bold font-bubble">{currentText.footer_rights}</div>

            <div className="bg-neutral-800 rounded-full p-1 flex items-center border border-neutral-700">
              <button
                onClick={() => setLang('zh')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  lang === 'zh'
                    ? 'bg-[#FFE85F] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                中
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-[#FFE85F] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 font-bold">
              <a
                href={`${baseUrl}privacy.html`}
                className="hover:text-[#FFE85F] transition-colors"
              >
                {currentText.footer_privacy}
              </a>
              <a href="#" className="hover:text-[#FB458D] transition-colors">
                {currentText.footer_contact}
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default App;
