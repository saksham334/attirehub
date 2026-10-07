import { useState } from "react";

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <p className="mb-0">
        <i className="bi bi-truck me-2" aria-hidden="true"></i>
        Free shipping on orders over $75 &nbsp;|&nbsp; Demo store: no real payments
      </p>
      <button
        className="announcement-bar__close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
      >
        <i className="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default AnnouncementBar;