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
    setMessage(""); // Clear previous messages

    if (isLogin) {
      const res = await login({ email: form.email, password: form.password });

      if (res.error) {
        // Log the full error for debugging in console
        console.error("Login Error:", res.error);
        // Access the specific error message from the backend if available
        setMessage(
          res.error.data?.error ||
            "Login failed. Please check your credentials."
        );
      } else if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful!");
        navigate("/profile");
      }
    } else {
      // Registration
      const res = await register(form);

      if (res.error) {
        // Log the full error for debugging in console
        console.error("Registration Error:", res.error);
        // Access the specific error message from the backend if available
        setMessage(
          res.error.data?.error || "Registration failed. Please try again."
        );
      } else {
        setMessage("Registration successful! You can now log in."); // More appropriate message for registration
        // Optionally, switch to login form after successful registration
        setIsLogin(true);
        setForm({ email: form.email, password: "", name: "" }); // Keep email, clear password/name
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 rounded-md">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLogin}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-600 hover:underline text-sm rounded-md"
        >
          {isLogin ? "Need an account?" : "Already have an account?"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            } rounded-md`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
