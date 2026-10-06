import React from 'react';

export default function NavItem({
  active,
  icon,
  label,
  onClick
}) {
  return (
    <button
      type="button"
      className={
        'nav-item ' +
        (active ? 'active' : '')
      }
      onClick={onClick}
    >
      {icon}

      <span>
        {label}
      </span>
    </button>
  );
}