const ITEMS = [
  { icon: "bi-truck", title: "Free shipping", text: "On orders over $75" },
  { icon: "bi-arrow-repeat", title: "Easy returns", text: "30-day return window" },
  { icon: "bi-shield-check", title: "Secure checkout", text: "Demo mode, no real charges" },
  { icon: "bi-headset", title: "Friendly support", text: "We're here to help" },
];

function ValueBar() {
  return (
    <section className="container py-4" aria-label="Store promises">
      <div className="value-bar">
        {ITEMS.map((i) => (
          <div key={i.title} className="value-bar__item">
            <i className={`bi ${i.icon}`} aria-hidden="true"></i>
            <div>
              <p className="mb-0 fw-semibold">{i.title}</p>
              <p className="mb-0 small text-muted">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ValueBar;