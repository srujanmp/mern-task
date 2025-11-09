import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token → redirect to login
    if (!token) {
      navigate("/");
      return;
    }

    // Validate token with backend
    fetch("http://localhost:3000/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Invalid/expired token
          navigate("/");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Checking authentication...</h2>;

  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      <h1>Home Page</h1>
      <p>Welcome {user?.username}</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
