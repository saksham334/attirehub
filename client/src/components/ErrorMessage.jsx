function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger text-center" role="alert">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;