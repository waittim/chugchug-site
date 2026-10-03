import React from 'react';
import AppleLogo from './AppleLogo.jsx';

const AppStoreQRCode = ({ className = '', label = 'Scan with iPhone Camera to install' }) => {
  return (
    <div className={`qr-display ${className}`.trim()} aria-label={label}>
      <div className="qr-card">
        <div className="qr-code-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 31"
            shapeRendering="crispEdges"
            className="qr-svg"
            role="img"
            aria-label={label}
          >
            <path fill="var(--canvas, #09090a)" d="M0 0h31v31H0z" />
            <path
              stroke="var(--paper, #f4f1eb)"
              d="M1 1.5h7m2 0h1m5 0h5m2 0h7M1 2.5h1m5 0h1m2 0h1m2 0h1m4 0h1m2 0h1m1 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h2m4 0h1m1 0h1m3 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h3m6 0h1m1 0h1m2 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h3m1 0h4m2 0h3m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h1m2 0h1m1 0h4m1 0h1m1 0h1m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h1m1 0h1m2 0h1m1 0h1m3 0h2M1 9.5h1m1 0h5m2 0h1m1 0h1m2 0h1m2 0h1m1 0h1m2 0h5M1 10.5h4m3 0h2m1 0h3m2 0h2m2 0h4m1 0h1m3 0h1M1 11.5h1m1 0h2m1 0h2m1 0h1m9 0h1m1 0h1m1 0h2M2 12.5h1m2 0h2m3 0h2m3 0h3m1 0h2m1 0h2m1 0h2m1 0h1M1 13.5h2m1 0h1m2 0h1m2 0h1m1 0h1m5 0h1m5 0h1m1 0h2M1 14.5h1m1 0h4m1 0h1m1 0h2m2 0h4m2 0h6m3 0h1M1 15.5h3m1 0h1m1 0h11m1 0h1m2 0h1m2 0h3M1 16.5h1m1 0h1m2 0h1m2 0h2m2 0h2m1 0h2m1 0h3m3 0h1m2 0h1M4 17.5h1m1 0h3m1 0h1m1 0h2m1 0h6m3 0h1m1 0h2M1 18.5h5m2 0h4m4 0h5m2 0h3m1 0h1m1 0h1M1 19.5h1m2 0h1m1 0h2m5 0h1m3 0h2m2 0h2m2 0h1m1 0h1M1 20.5h1m1 0h4m1 0h5m2 0h1m5 0h2m2 0h1m2 0h1M1 21.5h1m1 0h1m3 0h4m2 0h1m2 0h1m1 0h1m2 0h5m1 0h3M9 22.5h1m2 0h1m1 0h2m2 0h2m1 0h1m3 0h5M1 23.5h7m4 0h1m1 0h2m3 0h3m1 0h1m1 0h3M1 24.5h1m5 0h1m1 0h3m1 0h2m5 0h2m3 0h1M1 25.5h1m1 0h3m1 0h1m1 0h3m1 0h1m1 0h1m2 0h1m2 0h5m1 0h1m1 0h1M1 26.5h1m1 0h3m1 0h1m1 0h2m1 0h2m5 0h1m4 0h1m1 0h2M1 27.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m3 0h2m1 0h6M1 28.5h1m5 0h1m2 0h2m1 0h1m1 0h2m2 0h1m1 0h2m1 0h3m1 0h1M1 29.5h7m1 0h2m2 0h5m1 0h2m1 0h1m2 0h1m1 0h1"
            />
          </svg>
          <div className="qr-center-logo">
            <AppleLogo size={15} />
          </div>
        </div>
      </div>
      <p className="qr-caption">{label}</p>
    </div>
  );
};

export default AppStoreQRCode;
