"use client"
import { React, useState, useEffect } from 'react'
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
function login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(Username, Password);
  }
//   if(localStorage.getItem("token")!==null){
//     return (
//       <div className="flex items-center justify-center h-screen bg-black text-white">
//   <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
//     <h1 className="text-2xl font-bold text-center text-red-500 mb-6">
//       You are logged in another tab too
//     </h1>
//     <p className="text-center text-gray-300 mb-4">
//       Either close the other tab or log out to continue using this session.
//     </p>
//     <div className="flex justify-center gap-4">
//       <button
//         className="px-4 py-2 bg-teal-400 text-black font-semibold rounded-lg hover:bg-teal-500"
//         onClick={() => window.close()} // Closes the current tab
//       >
//         Close Tab
//       </button>
//       <button
//         className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
//         onClick={() => {
//           localStorage.removeItem("token");
//           localStorage.removeItem("refreshToken");
//           localStorage.removeItem("data");
//           window.location.href = "/login";
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   </div>
// </div>

//     )
//   }
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
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
          <button
            type="submit"
            className="w-full py-2 mt-4 text-lg font-semibold text-black bg-teal-400 rounded-lg hover:bg-teal-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>

  )
}

export default login
