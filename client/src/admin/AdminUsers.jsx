import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { fetchAdminUsers, updateUserRoleRequest } from "../services/adminService";
import { formatDate } from "../utils/formatDate";

function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchAdminUsers()
      .then((data) => { if (!ignore) setUsers(data); })
      .catch(() => { if (!ignore) setError("Could not load users."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const changeRole = async (target, role) => {
    if (!window.confirm(`Change ${target.name} to ${role}?`)) return;
    setNotice("");
    try {
      const updated = await updateUserRoleRequest(target._id, role);
      setUsers((list) => list.map((u) => (u._id === updated._id ? updated : u)));
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not update the role.");
    }
  };

  return (
    <div>
      <h1 className="h3 mb-4">Users</h1>
      {notice && <div className="alert alert-danger py-2" role="alert">{notice}</div>}
      {loading && <LoadingSpinner text="Loading users..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="card-attire p-3 table-responsive">
          <table className="table align-middle admin-table mb-0">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}{u._id === me._id && <span className="small text-muted"> (you)</span>}</td>
                  <td>{u.email}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <label className="visually-hidden" htmlFor={`role-${u._id}`}>Role for {u.name}</label>
                    <select id={`role-${u._id}`} className="form-select form-select-sm" value={u.role}
                      disabled={u._id === me._id} onChange={(e) => changeRole(u, e.target.value)}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;