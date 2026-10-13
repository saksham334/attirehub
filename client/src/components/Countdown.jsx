import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

// Counts down to the end of today, then restarts tomorrow
function Countdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer); // stop the timer when leaving the page
  }, []);

  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const left = Math.max(0, Math.floor((end - now) / 1000));
  const parts = [
    ["Hours", Math.floor(left / 3600)],
    ["Min", Math.floor((left % 3600) / 60)],
    ["Sec", left % 60],
  ];

  // aria-live off: screen readers shouldn't announce every second
  return (
    <div className="countdown" role="timer" aria-live="off" aria-label="Time left in today's flash sale">
      {parts.map(([label, value]) => (
        <div key={label} className="countdown__box">
          <span className="countdown__num">{pad(value)}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default Countdown;