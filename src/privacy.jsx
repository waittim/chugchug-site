import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const PrivacyPage = () => {
  const [lang, setLang] = useState(() => {
    if (typeof navigator === 'undefined') return 'zh';
    return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  const t = useMemo(
    () => ({
      zh: {
        brand: '吨吨吨',
        back: '返回主页',
        title: '隐私政策',
        subtitle:
          'ChugChug（“我们”）非常重视你的隐私。ChugChug 是一款用于线下聚会的本地喝酒游戏 App，设计目标是：无需账号、无需联网、无需收集个人信息即可使用。',
        website_label: 'Website',
        website: 'https://chugchug.app',
        s1: '1. 我们收集的信息',
        s1b:
          '我们不会收集、存储或上传任何可识别个人身份的信息（PII），包括但不限于：',
        s1l1: '姓名、邮箱、电话号码',
        s1l2: '位置信息',
        s1l3: '通讯录',
        s1l4: '照片、音频或视频',
        s1l5: '社交账号或登录信息',
        s1c: '所有游戏内容、随机结果与操作均在用户设备本地完成。',
        s2: '2. 设备权限说明',
        s2b: 'ChugChug 仅使用实现基础功能所需的系统能力，例如：',
        s2l1: '触控 / 屏幕交互：用于游戏操作',
        s2l2: '振动 / 音效（如启用）：用于增强游戏体验',
        s2c: '我们不会请求或访问以下权限：',
        s2d1: '相机',
        s2d2: '麦克风',
        s2d3: '相册',
        s2d4: '通讯录',
        s2d5: '定位信息',
        s3: '3. 第三方服务',
        s3b:
          '目前，ChugChug 不集成任何第三方广告、分析、统计或追踪服务。如果未来引入相关服务，我们将更新本隐私政策并明确说明。',
        s4: '4. 未成年人声明',
        s4b:
          'ChugChug 仅适用于达到当地法定饮酒年龄的用户。我们不会有意收集任何未成年人的信息。',
        s5: '5. 数据安全',
        s5b:
          '由于我们不收集、存储或传输用户的个人数据，因此不存在用户数据被泄露、出售或滥用的风险。',
        s6: '6. 隐私政策的变更',
        s6b:
          '我们可能会不定期更新本隐私政策。更新后的版本将发布在应用内或官方网站上。继续使用本应用即表示你接受更新后的隐私政策。',
        s7: '7. 联系我们',
        s7b: '如果你对本隐私政策有任何疑问，请通过以下方式联系我们：',
      },
      en: {
        brand: 'ChugChug',
        back: 'Back to Home',
        title: 'Privacy Policy',
        subtitle:
          'ChugChug ("we", "our", or "us") respects your privacy. ChugChug is designed as a local party drinking game app that does not require an account, internet connection, or personal data to function.',
        website_label: 'Website',
        website: 'https://chugchug.app',
        s1: '1. Information We Collect',
        s1b:
          'We do not collect, store, or transmit any personally identifiable information (PII), including but not limited to:',
        s1l1: 'Name, email address, or phone number',
        s1l2: 'Location data',
        s1l3: 'Contacts',
        s1l4: 'Photos, audio, or video',
        s1l5: 'Social media or account information',
        s1c: 'All gameplay, randomization, and interactions occur locally on your device.',
        s2: '2. Device Permissions',
        s2b: 'ChugChug only uses basic system features necessary for gameplay, such as:',
        s2l1: 'Touch input / screen interaction',
        s2l2: 'Haptic feedback or sound effects (if enabled)',
        s2c: 'We do not request or access the following permissions:',
        s2d1: 'Camera',
        s2d2: 'Microphone',
        s2d3: 'Photo library',
        s2d4: 'Contacts',
        s2d5: 'Location services',
        s3: '3. Third-Party Services',
        s3b:
          'ChugChug does not use any third-party advertising, analytics, or tracking services. If this changes in the future, this Privacy Policy will be updated accordingly.',
        s4: '4. Children',
        s4b:
          'ChugChug is intended for users who meet the legal drinking age in their jurisdiction. We do not knowingly collect any information from children.',
        s5: '5. Data Security',
        s5b:
          'Because we do not collect or store personal data, there is no risk of personal data misuse, leakage, or sale.',
        s6: '6. Changes to This Policy',
        s6b:
          'We may update this Privacy Policy from time to time. The updated version will be published within the app or on our website. Continued use of the app indicates acceptance of the updated policy.',
        s7: '7. Contact Us',
        s7b: 'If you have any questions about this Privacy Policy, please contact us:',
      },
    }),
    [],
  );

  const current = t[lang];
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
        <a
          href={`${baseUrl}`}
          className="text-2xl font-black tracking-tighter font-bubble flex items-center gap-2"
          aria-label={current.back}
        >
          {current.brand}
        </a>

	        <div className="flex items-center gap-3">
	          <a
	            href={`${baseUrl}`}
	            className="hidden md:block bg-white text-black px-5 py-2 rounded-full font-bold border-2 border-transparent hover:scale-105 transition-transform duration-200"
	          >
	            {current.back}
	          </a>
	        </div>
	      </nav>

      <main className="flex-1 pt-24 pb-16 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-bubble">
              {current.title}
            </h1>
            <div className="h-2 w-40 bg-[#FFE85F] mt-4" />
            <p className="text-neutral-400 text-lg md:text-xl font-bold mt-6 font-bubble">
              {current.subtitle}
            </p>
          </header>

          <section className="space-y-10">
            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s1}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s1b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s1l1}</li>
                <li>{current.s1l2}</li>
                <li>{current.s1l3}</li>
                <li>{current.s1l4}</li>
                <li>{current.s1l5}</li>
              </ul>
              <p className="text-neutral-300 font-bold mt-4 whitespace-pre-line">{current.s1c}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s2}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s2b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s2l1}</li>
                <li>{current.s2l2}</li>
              </ul>
              <p className="text-neutral-300 font-bold mt-6 whitespace-pre-line">{current.s2c}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>{current.s2d1}</li>
                <li>{current.s2d2}</li>
                <li>{current.s2d3}</li>
                <li>{current.s2d4}</li>
                <li>{current.s2d5}</li>
              </ul>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s3}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s3b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s4}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s4b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s5}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s5b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s6}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s6b}</p>
            </div>

            <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 md:p-8">
              <h2 className="text-white text-2xl md:text-3xl font-black font-bubble">{current.s7}</h2>
              <p className="text-neutral-300 font-bold mt-3 whitespace-pre-line">{current.s7b}</p>
              <ul className="mt-4 space-y-2 text-neutral-300 font-bold list-disc pl-5">
                <li>
                  {current.website_label}:{' '}
                  <a
                    className="text-[#FFE85F] hover:underline"
                    href={current.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {current.website}
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

	      <footer className="w-screen relative left-1/2 -translate-x-1/2 py-8 border-t border-neutral-900 bg-[#0F0F0F]">
		        <div className="w-full px-4 md:px-6 flex flex-row flex-wrap justify-between items-center text-neutral-600 text-xs md:text-sm gap-x-8 gap-y-4">
		          <div className="font-bold font-bubble">© 2026 CHUGCHUG APP</div>
		          <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-3 font-bold">
		            <a href={`${baseUrl}`} className="hover:text-[#FFE85F] transition-colors">
		              {current.back}
	            </a>
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
	          </div>
	        </div>
	      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacyPage />
  </React.StrictMode>,
);
