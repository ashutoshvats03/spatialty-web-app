"use client"
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import PrivateRoute from '../middleware/PrivateRoute';
function page() {
  const { user, loading, users } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }
  return (
    <div>
      <PrivateRoute>
        <h1 className='text-white'>Admin Dashboard</h1>
        <h1 className="text-4xl font-bold mb-4">Welcome, {user.username}!</h1>
        <p className="text-lg">Email: {user.email}</p>
        <p className="text-lg">Role: {user.Urole}</p>
        <p className='text-white'>Users: {users ? users.length : 'Loading...'}</p>
        {users && users.map((user, index) => (
          <div key={index} className='text-white'>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.Urole}</p>
          </div>
        ))}
        <p className='text-white'>You are successfully logged in. Enjoy exploring the application!</p>
      </PrivateRoute>
    </div>
  )
}

export default page
