import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms.
// Prevents one API call per keystroke or per slider movement.
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;