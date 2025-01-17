"use client";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Role, setRole] = useState("");

  const { register } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    register(Username, Password, Email, Role);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            placeholder="Role"
            value={Role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-semibold text-black bg-teal-400 rounded-lg hover:bg-teal-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
