import React from 'react';

const AmbientLights = ({ variant = 'default' }) => (
  <div className={`ambient ambient--${variant}`} aria-hidden="true">
    <span className="ambient__light ambient__light--primary" />
    <span className="ambient__light ambient__light--secondary" />
  </div>
);

export default AmbientLights;
