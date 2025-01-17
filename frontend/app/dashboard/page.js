"use client"
import PrivateRoute from "../middleware/PrivateRoute";

const Dashboard = () => {
  return (
    <PrivateRoute>
      <div>
        <h1>Dashboard</h1>
        {/* Protected dashboard content */}
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;
