function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="text-center py-5" role="status">
      <div className="spinner-border" style={{ color: "var(--ah-primary)" }} aria-hidden="true"></div>
      <p className="mt-3 mb-0">{text}</p>
    </div>
  );
}

export default LoadingSpinner;