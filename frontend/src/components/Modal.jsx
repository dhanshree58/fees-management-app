import React from 'react';
import { X } from 'lucide-react';

export default function Modal({
  title,
  children,
  close
}) {
  return (
    <div className="modal-backdrop">

      <div className="modal">

        <div className="modal-head">

          <h3>
            {title}
          </h3>

          <button
            type="button"
            onClick={close}
          >
            <X size={18} />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}