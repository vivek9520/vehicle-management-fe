'use client'; // Ensure this component is client-side

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure you are using 'next/navigation' in Next.js 13+
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false); // Track if we're on the client side
  const router = useRouter();

  useEffect(() => {
    // Set isClient to true after the component mounts (client-side)
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation for email and password
    if (!username || !password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      // Call the login API
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      // Assuming the API returns a token in the response
      const { token } = response.data.data;

      if (token) {
        // Save the token to localStorage or a cookie
        localStorage.setItem("authToken", token);

        // Redirect to the dashboard or another page after successful login
        router.push("/vehicle/search");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error: any) {
      // Handle API errors
      if (error.response) {
        setError(error.response.data.message || "An error occurred.");
      } else {
        setError("Unable to connect to the server. Please try again later.");
      }
    }
  };

  // Only render the login form when we're on the client
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#D4EBF8] to-[#0A3981]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#0A3981] mb-4">Login</h2>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#0A3981]">
              Email Address
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[#0A3981] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#0A3981]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-[#0A3981] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3981]"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#0A3981] text-white py-2 px-4 rounded-lg hover:bg-[#D4EBF8] transition"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-[#0A3981] hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
