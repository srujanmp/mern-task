import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message || data.err);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup Page</h2>
      <form onSubmit={handleSignup}>
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

        <button type="submit">Signup</button>
      </form>

      <p><a href="/">Go to Login</a></p>
    </div>
  );
}
