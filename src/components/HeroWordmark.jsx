import React, { useState } from 'react';

function Glint() {
  return (
    <span className="hero-clink__glint" aria-hidden="true">
      <span className="hero-clink__glint-flare" />
      <span className="hero-clink__glint-core" />
    </span>
  );
}

function Clink({ side, text, gold = false, wash = 'gold' }) {
  return (
    <span className={`hero-clink hero-clink--${side}${gold ? ' hero-title__ghost' : ''}`}>
      <span className="hero-clink__ink">{text}</span>
      <span className={`hero-clink__wash hero-clink__wash--${wash}`} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

export default function HeroWordmark({ words, compact = false }) {
  const [clinkCount, setClinkCount] = useState(0);
  const beats = words.filter(Boolean);

  const handleReplayClink = () => {
    setClinkCount((prev) => prev + 1);
  };

  const wordmarkContent = compact ? (
    <span className="hero-title__word">
      <Clink side="away" text={beats[0]} />
      <Glint />
      <Clink side="meet" text={beats.slice(1).join('')} />
    </span>
  ) : (
    <span className="hero-title__stack-wrapper">
      <Clink side="away" text={beats[0]} />
      <Glint />
      {beats[1] ? <Clink side="meet" text={beats[1]} gold wash="paper" /> : null}
    </span>
  );

  return (
    <h1
      key={clinkCount}
      className={`hero-title hero-title--toast ${compact ? '' : 'hero-title--stack'} hero-title--interactive`}
      onClick={handleReplayClink}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleReplayClink();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="ChugChug - 点击碰杯"
      title="点击碰杯"
    >
      {wordmarkContent}
    </h1>
  );
}
