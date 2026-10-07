const COLOR_HEX = {
  Black: "#252525", White: "#FFFFFF", Blue: "#3B5BA5", "Light Blue": "#9CC3E8",
  "Sky Blue": "#87CEEB", Navy: "#1F2A44", Teal: "#00C2A8", Lavender: "#B8A9FF",
  Lilac: "#C8A2E0", Purple: "#6C63FF", Pink: "#FF8FA3", Coral: "#FF6F61",
  Red: "#E23B4E", Yellow: "#FFD166", Mustard: "#D9A21B", Green: "#3FA66B",
  Olive: "#6B7A4B", Mint: "#7ED6C4", Beige: "#E3D3B8", Sand: "#D8C3A5",
  Khaki: "#B8A77A", Cream: "#FFF3DC", Grey: "#9CA3AF", Brown: "#7B4B2A",
  Tan: "#C49A6C",
};

// Multicolor gets a rainbow gradient; unknown names fall back to light grey
export const getColorStyle = (name) => {
  if (name === "Multicolor") {
    return { background: "linear-gradient(135deg,#ff6584,#ffd166,#00c2a8,#6c63ff)" };
  }
  return { backgroundColor: COLOR_HEX[name] || "#dddddd" };
};