import React from 'react';
import { Wine } from 'lucide-react';

const WineRating = ({ rating = 1, max = 5, size = 10 }) => (
  <span className="wine-level" aria-hidden="true">
    {Array.from({ length: max }, (_, index) => (
      <Wine
        key={index}
        size={size}
        aria-hidden="true"
        className={index < rating ? 'is-full' : ''}
      />
    ))}
  </span>
);

export default WineRating;
