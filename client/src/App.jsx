function App() {
  return (
    <main className="container py-5 text-center">
      <h1 className="display-4" style={{ color: "var(--ah-primary)" }}>
        <i className="bi bi-bag-heart-fill me-2"></i>
        AttireHub
      </h1>
      <p className="lead">Colorful, modern fashion. Coming soon.</p>

      <div className="card-attire p-4 mx-auto mt-4" style={{ maxWidth: 420 }}>
        <h2 className="h5 mb-3">Setup check</h2>
        <button className="btn-attire">Shop Now</button>
      </div>
    </main>
  );
}

export default App;