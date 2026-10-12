import { useState } from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { updateProfileRequest, changePasswordRequest } from "../services/authService";

const ADDRESS_FIELDS = [
  { name: "street", label: "Street address", col: "col-12", auto: "street-address" },
  { name: "city", label: "City", col: "col-md-6", auto: "address-level2" },
  { name: "state", label: "Province / State", col: "col-md-6", auto: "address-level1" },
  { name: "postalCode", label: "Postal code", col: "col-md-6", auto: "postal-code" },
  { name: "country", label: "Country", col: "col-md-6", auto: "country-name" },
];

function Profile() {
  const { user, updateUser } = useAuth();

  // ----- Profile form -----
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState({
    street: user.address?.street || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    postalCode: user.address?.postalCode || "",
    country: user.address?.country || "",
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileMsg({ type: "", text: "" });
    if (!name.trim()) return setProfileMsg({ type: "danger", text: "Name is required." });

    setSavingProfile(true);
    try {
      const updated = await updateProfileRequest(name.trim(), address);
      updateUser(updated); // refresh the navbar greeting and checkout prefill
      setProfileMsg({ type: "success", text: "Profile saved." });
    } catch (err) {
      setProfileMsg({ type: "danger", text: err.response?.data?.message || "Could not reach the server." });
    } finally {
      setSavingProfile(false);
    }
  };

  // ----- Password form -----
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [savingPw, setSavingPw] = useState(false);

  const savePassword = async (event) => {
    event.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pw.next.length < 8) return setPwMsg({ type: "danger", text: "New password must be at least 8 characters." });
    if (pw.next !== pw.confirm) return setPwMsg({ type: "danger", text: "New passwords do not match." });

    setSavingPw(true);
    try {
      await changePasswordRequest(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password updated." });
    } catch (err) {
      setPwMsg({ type: "danger", text: err.response?.data?.message || "Could not reach the server." });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 680 }}>
      <h1 className="h2 mb-4">My account</h1>

      <form onSubmit={saveProfile} noValidate className="card-attire p-4 mb-4">
        <h2 className="h5 mb-3">Personal details</h2>
        {profileMsg.text && <div className={`alert alert-${profileMsg.type} py-2`} role="status">{profileMsg.text}</div>}

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="p-name" className="form-label">Full name</label>
            <input id="p-name" className="form-control" autoComplete="name"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="p-email" className="form-label">Email</label>
            <input id="p-email" className="form-control" value={user.email} disabled aria-describedby="email-help" />
            <div id="email-help" className="form-text">Email can't be changed.</div>
          </div>

          <h3 className="h6 mt-4 mb-0">Saved address (used to prefill checkout)</h3>
          {ADDRESS_FIELDS.map((f) => (
            <div className={f.col} key={f.name}>
              <label htmlFor={`p-${f.name}`} className="form-label">{f.label}</label>
              <input id={`p-${f.name}`} className="form-control" autoComplete={f.auto}
                value={address[f.name]}
                onChange={(e) => setAddress({ ...address, [f.name]: e.target.value })} />
            </div>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3 mt-4">
          <button type="submit" className="btn-attire" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
          <span className="small text-muted">Role: {user.role}</span>
        </div>
      </form>

      <form onSubmit={savePassword} noValidate className="card-attire p-4">
        <h2 className="h5 mb-3">Change password</h2>
        {pwMsg.text && <div className={`alert alert-${pwMsg.type} py-2`} role="status">{pwMsg.text}</div>}

        <div className="mb-3">
          <label htmlFor="pw-current" className="form-label">Current password</label>
          <input id="pw-current" type="password" className="form-control" autoComplete="current-password"
            value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="pw-new" className="form-label">New password</label>
          <input id="pw-new" type="password" className="form-control" autoComplete="new-password"
            value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        </div>
        <div className="mb-4">
          <label htmlFor="pw-confirm" className="form-label">Confirm new password</label>
          <input id="pw-confirm" type="password" className="form-control" autoComplete="new-password"
            value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        </div>
        <button type="submit" className="btn-attire" disabled={savingPw}>
          {savingPw ? "Updating..." : "Update password"}
        </button>
      </form>
    </Container>
  );
}

export default Profile;