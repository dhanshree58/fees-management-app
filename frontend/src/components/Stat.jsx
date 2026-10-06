import React from 'react';

export default function Stat({
  icon,
  title,
  value
}) {
  return (
    <div className="stat">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>
      </div>

    </div>
  );
}