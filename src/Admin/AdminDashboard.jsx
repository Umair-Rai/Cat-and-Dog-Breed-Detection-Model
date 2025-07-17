import React, { useState } from 'react';
import {
  HomeIcon,
  CubeIcon,
  Squares2X2Icon,
  ClipboardIcon,
  UsersIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', icon: HomeIcon },
  { label: 'Products', icon: CubeIcon },
  { label: 'Categories', icon: Squares2X2Icon },
  { label: 'Seller Verification', icon: CheckCircleIcon },
  { label: 'Orders', icon: ClipboardIcon },
  { label: 'Customers', icon: UsersIcon },
  { label: 'Settings', icon: Cog6ToothIcon },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');

  const infoCards = [
    { label: 'Total Products', value: 1247, Icon: CubeIcon },
    { label: 'Orders', value: 892, Icon: ClipboardIcon },
    { label: 'Verified Sellers', value: 156, Icon: CheckCircleIcon },
    { label: 'Active Customers', value: 3421, Icon: UsersIcon },
  ];

  const actionCards = [
    { label: 'Add Product', Icon: PlusCircleIcon },
    { label: 'Verify Sellers', Icon: CheckCircleIcon },
    { label: 'Monitor Orders', Icon: TruckIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg py-6 px-4 flex-shrink-0">
        {navItems.map(({ label, icon: Icon }) => (
          <div
            key={label}
            onClick={() => setActiveNav(label)}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg mb-2 cursor-pointer transition-all duration-200 ease-in-out ${
              activeNav === label
                ? 'bg-purple-100 text-purple-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome back! Here's what’s happening with your store.
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {infoCards.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-6 flex justify-between items-center shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-purple-300 cursor-default"
            >
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-gray-500">{label}</p>
              </div>
              <Icon className="h-10 w-10 text-gray-300" />
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionCards.map(({ label, Icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow-md transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-purple-300 cursor-pointer"
            >
              <Icon className="h-8 w-8 text-purple-600 transition-transform ease-in-out duration-300 hover:scale-110" />
              <span className="font-medium text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
