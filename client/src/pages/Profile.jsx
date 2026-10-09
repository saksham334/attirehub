import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <Container className="py-5" style={{ maxWidth: 560 }}>
      <h1 className="h2 mb-4">My account</h1>
      <div className="card-attire p-4">
        <p className="mb-2"><strong>Name:</strong> {user.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-0"><strong>Role:</strong> {user.role}</p>
      </div>
      <p className="text-muted small mt-3">Editing your profile and address comes in a later step.</p>
    </Container>
  );
}

export default Profile;