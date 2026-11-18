import React from 'react';

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
  const beats = words.filter(Boolean);

  if (compact) {
    const [first, ...rest] = beats;
    return (
      <h1 className="hero-title hero-title--toast">
        <span className="hero-title__word">
          <Clink side="away" text={first} />
          <Clink side="meet" text={rest.join('')} />
        </span>
      </h1>
    );
  }

  return (
    <h1 className="hero-title hero-title--toast hero-title--stack">
      <Clink side="away" text={beats[0]} />
      {beats[1] ? <Clink side="meet" text={beats[1]} gold wash="paper" /> : null}
    </h1>
  );
}
