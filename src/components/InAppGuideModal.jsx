import React, { useEffect, useState } from 'react';
import { Check, Compass, Copy, MoreHorizontal, X } from 'lucide-react';

const InAppGuideModal = ({ isOpen, onClose, currentText }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {
      setCopied(false);
    }
  };

  return (
    <div
      className="inapp-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inapp-guide-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top right floating guide pointing to Instagram/WebView menu ... */}
      <div className="inapp-arrow-guide" aria-hidden="true">
        <svg
          className="inapp-arrow-icon"
          viewBox="0 0 70 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 58 C 16 30 32 14 56 10"
            stroke="var(--gold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 38 15 L 56 10 L 48 28"
            stroke="var(--gold)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="inapp-card glass-panel">
        <button
          type="button"
          className="inapp-close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="inapp-header">
          <div className="inapp-icon-badge" aria-hidden="true">
            <Compass size={24} />
          </div>
          <h2 id="inapp-guide-title" className="inapp-title">
            {currentText.inapp_title}
          </h2>
          <p className="inapp-subtitle">{currentText.inapp_subtitle}</p>
        </div>

        <div className="inapp-steps">
          <div className="inapp-step">
            <span className="inapp-step-num">1</span>
            <div className="inapp-step-content">
              <span>{currentText.inapp_step1_label}</span>
              <span className="inapp-step-badge">
                <MoreHorizontal size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              </span>
            </div>
          </div>

          <div className="inapp-step">
            <span className="inapp-step-num">2</span>
            <div className="inapp-step-content">
              <span>{currentText.inapp_step2_label}</span>
            </div>
          </div>
        </div>

        <div className="inapp-actions">
          <button
            type="button"
            className={`inapp-copy-btn ${copied ? 'is-copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? currentText.inapp_copied : currentText.inapp_btn_copy}</span>
          </button>

          <button
            type="button"
            className="inapp-confirm-btn"
            onClick={onClose}
          >
            {currentText.inapp_btn_close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppGuideModal;
