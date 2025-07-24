"use client"
import { useContext, useState } from 'react';
import AuthContext from "../context/AuthContext";
function login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const { login,loading } = useContext(AuthContext);
  if (!loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    login(Username, Password);
  }
  return (
    <div className="flex items-center justify-center bg-black h-screen ">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-semibold text-black bg-red-600 rounded-lg hover:bg-red-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>

  )
}

export default login
