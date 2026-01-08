"use client";
import { useState } from "react";
import { Bell, Shield, HelpCircle } from "lucide-react";
import Account from "@/components/settings/Account";
import Notifications from "@/components/settings/Notifications";
import HelpCenter from "@/components/settings/HelpCenter";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full py-4 px-4 lg:px-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Sidebar Navigation */}

        <nav className="w-full lg:w-80 flex flex-row lg:flex-col justify-around lg:justify-normal gap-1 lg:gap-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 lg:p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`lg:w-full flex items-center gap-1 lg:gap-3 p-2 lg:px-4 lg:py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline text-xs lg:text-sm">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main Content */}
        <div className="w-full flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          {/* Account Tab */}
          {activeTab === "account" && <Account />}

          {/* Notifications & Privacy Tab */}
          {activeTab === "notifications" && <Notifications />}

          {/* Help Tab */}
          {activeTab === "help" && <HelpCenter />}
        </div>
      </div>
    </div>
  );
}
