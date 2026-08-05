import React from 'react';

const SiteHeader = ({
  brand,
  brandHref = '#top',
  navLabel = 'Primary Navigation',
  children,
  className = '',
}) => (
  <nav className={`site-nav ${className}`.trim()} aria-label={navLabel}>
    <a href={brandHref} className="brand-mark">
      {brand}
    </a>
    {children}
  </nav>
);

export default SiteHeader;
