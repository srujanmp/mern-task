import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        alert("Login successful!");

        // store token
        localStorage.setItem("token", data.token);

        navigate("/home");
      } else {
        alert(data.err || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUser(e.target.value)}
        /><br/><br/>
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/><br/>
        
        <button type="submit">Login</button>
      </form>
      <p><a href="/signup">Go to Signup</a></p>
    </div>
  );
}
