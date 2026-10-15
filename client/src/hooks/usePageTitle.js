import { useEffect } from "react";

// Sets the browser tab title, e.g. "Oversized Hoodie | AttireHub"
function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | AttireHub` : "AttireHub | Colorful Modern Fashion";
  }, [title]);
}

export default usePageTitle;