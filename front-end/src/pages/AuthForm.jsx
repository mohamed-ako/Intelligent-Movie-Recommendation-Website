import React, { useState, useEffect } from "react";

import { useRegisterMutation, useLoginMutation } from "./services/apiService";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState("");
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Clear message when switching between login/register forms
  useEffect(() => {
    setMessage("");
    setForm({ email: "", password: "", name: "" }); // Clear form fields too
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const res = await login({ email: form.email, password: form.password });

      if (res.error) {
        setMessage("Login failed");
      } else if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful");
        navigate("/profile");
      }
    } else {
      const res = await register(form);

      if (res.error) {
        setMessage("Registration failed");
      } else {
        setMessage("Registration successful");
        navigate("/profile");
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth">
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>{" "}
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account?" : "Already have an account?"}
      </button>
      <h1 className="login_message">{message}</h1>
    </div>
  );
}
