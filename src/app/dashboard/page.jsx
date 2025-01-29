'use client';

import React, { useState } from 'react';
import SearchPage from '../vehicle/search/page';
import CreateVehicle from '../vehicle/create/page';
import CreateMobile from '../mobile/create/page';
import { Car, Smartphone, Users } from 'lucide-react';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('Vehicle');
  const [activeTab, setActiveTab] = useState('Search Vehicle');

  const menuTabs = {
    Vehicle: ['Search Vehicle', 'Add Vehicle'],
    Phone: ['Search Phone', 'Add Phone'],
    Employee: ['Search Employee', 'Add Employee'],
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens, redirecting, etc.)
    console.log('Logged out');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white shadow-lg">
        <div className="p-6 flex items-center border-b border-blue-400">
          <img
            src="/logo/logo 1.png"
            alt="Fitness Pro"
            className="w-10 h-10 mr-3 rounded-full"
          />
          <span className="text-2xl font-bold">QuickManage</span>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {Object.keys(menuTabs).map((menu) => (
              <li
                key={menu}
                className={`px-4 py-3 flex items-center rounded-lg cursor-pointer transition-all duration-300 ${activeMenu === menu
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
          <div className="flex items-center space-x-6">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex space-x-4 border-b border-gray-200">
            {menuTabs[activeMenu].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === tab
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
            {activeTab === 'Search Phone' && <p>Phone Search Form/Content</p>}
            {activeTab === 'Add Phone' && <CreateMobile/>}
            {activeTab === 'Search Employee' && <p>Employee Search Form/Content</p>}
            {activeTab === 'Add Employee' && <p>Employee Add Form/Content</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
