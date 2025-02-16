'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter for redirection
import SearchPage from '../vehicle/search/page';
import CreateVehicle from '../vehicle/create/page';
import CreateMobile from '../mobile/create/page';
import SearchMobile from '../mobile/search/page';
import CreateEmployee from '../employee/create/page';
import EmployeeSearch from '../employee/search/page';
import ServiceHistoryPage from '../vehicle/service-history/page';
import { Car, Smartphone, Users, MoreVertical } from 'lucide-react';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('Vehicle');
  const [activeTab, setActiveTab] = useState('Search Vehicle');
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const LOGOUT_TIMEOUT = 600000; // 10 minutes

  const router = useRouter();  

  let logoutTimer;

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(handleLogout, LOGOUT_TIMEOUT);
  };

  const handleLogout = () => {
    alert('Session expired. You are being logged out.');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login'); // Redirect to login page
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!localStorage.getItem('authToken') && !sessionStorage.getItem('authToken')) {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      setLoading(false); // If authenticated, stop loading
    }

    // Start the logout timer
    resetLogoutTimer();

    // Listen for user activity
    window.addEventListener('mousemove', resetLogoutTimer);
    window.addEventListener('keypress', resetLogoutTimer);
    window.addEventListener('scroll', resetLogoutTimer);

    return () => {
      // Cleanup event listeners and timer
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keypress', resetLogoutTimer);
      window.removeEventListener('scroll', resetLogoutTimer);
    };
  }, []);

  const menuTabs = {
    Vehicle: ['Search Vehicle', 'Add Vehicle', 'Service History'],
    Phone: ['Search Phone', 'Add Phone'],
    Employee: ['Search Employee', 'Add Employee'],
  };

  if (loading) {
    // Display a loading spinner or message while checking authentication
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="spinner-border animate-spin border-4 border-blue-600 rounded-full h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white shadow-lg">
        <div className="p-6 flex items-center border-b border-blue-400">
          <img
            src="/logo/logo 1.png"
            alt="QuickManage"
            className="w-10 h-10 mr-3 rounded-full"
          />
          <span className="text-2xl font-bold">QuickManage</span>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {Object.keys(menuTabs).map((menu) => (
              <li
                key={menu}
                className={`px-4 py-3 flex items-center rounded-lg cursor-pointer transition-all duration-300 ${
                  activeMenu === menu
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-blue-500 hover:shadow-sm'
                }`}
                onClick={() => {
                  setActiveMenu(menu);
                  setActiveTab(menuTabs[menu][0]);
                }}
              >
                <span className="mr-3">
                  {menu === 'Vehicle' && <Car className="w-5 h-5" />}
                  {menu === 'Phone' && <Smartphone className="w-5 h-5" />}
                  {menu === 'Employee' && <Users className="w-5 h-5" />}
                </span>
                <span className="text-lg font-medium">{menu}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-r from-white to-gray-100 p-6 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800">{activeMenu}</h1>

          {/* Logout Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="p-2 rounded-full hover:bg-gray-200 transition-all"
            >
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </button>

            {showLogoutMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex space-x-4 border-b border-gray-200">
            {menuTabs[activeMenu].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Content */}
          <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
            {activeTab === 'Search Vehicle' && <SearchPage />}
            {activeTab === 'Add Vehicle' && <CreateVehicle />}
            {activeTab === 'Service History' && <ServiceHistoryPage />}
            {activeTab === 'Search Phone' && <SearchMobile />}
            {activeTab === 'Add Phone' && <CreateMobile />}
            {activeTab === 'Search Employee' && <EmployeeSearch />}
            {activeTab === 'Add Employee' && <CreateEmployee />}
          </div>
        </div>
      </main>
    </div>
  );
}
