"use client";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useContext(AuthContext); // Access user and loading state

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <div className=" flex flex-col items-center justify-center h-screen ">
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome, {user.username}!</h1>
          <p className="text-lg">Email: {user.email}</p>
          <p className="text-lg">Role: {user.role}</p>
          <p className="mt-4 ">
            You are successfully logged in. Enjoy exploring the application!
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page!</h1>
          <p className="text-lg">
            Please <Link href="/login" className="text-teal-400 underline">log in</Link> to access more features.
          </p>
          <button onClick={()=>{localStorage.removeItem("data")}}>Delete</button>
        </div>
      )}
    </div>
  );
}
