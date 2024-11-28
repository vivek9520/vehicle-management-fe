'use client'; // Ensure this component is client-side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'; // Import usePathname hook

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by verifying the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    setIsLoggedIn(!!token); // If token exists, set logged in to true

    // Redirect to login page if not logged in and not on the login page
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]); // Add pathname and router to the dependency array

  const navigateToHome = () => {
    router.push('/pages/vehicle/search'); // Navigate to the dashboard page
  };

  const handleLogout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to login page after logout
    router.push('/login');
  };

  // Only render the header with buttons if the user is logged in
  if (!isLoggedIn) {
    return null; // Do not render anything if the user is not logged in
  }

  return (
    <header className="bg-[#8174A0] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <div className="space-x-4">
          <button
            onClick={navigateToHome}
            className="px-4 py-2 bg-[#A888B5] rounded hover:bg-[#8174A0] transition duration-200"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FFD2A0] text-[#8174A0] rounded hover:bg-[#EFB6C8] transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
