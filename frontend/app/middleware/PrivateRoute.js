"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // Corrected import for App Router
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...PrivateRoute</div>;
  }

  return user ? children : null;
};

export default PrivateRoute;
