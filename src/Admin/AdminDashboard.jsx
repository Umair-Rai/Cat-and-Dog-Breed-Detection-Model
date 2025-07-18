import React, { useState } from 'react';
import AdminSideBar from './AdminSideBar.jsx';
import {
  CubeIcon,
  ClipboardIcon,
  UsersIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
export default function AdminDashboard() {

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
      <AdminSideBar />

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
