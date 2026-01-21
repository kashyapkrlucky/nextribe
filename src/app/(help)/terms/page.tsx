"use client";
import {
  FileTextIcon,
  ShieldIcon,
  UserIcon,
  AlertCircleIcon,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FileTextIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please read these terms and conditions carefully before using our
          services.
        </p>
      </div>

      {/* Terms Content */}
      <div className="bg-white rounded-xl shadow-xs p-6">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircleIcon className="w-6 h-6 text-indigo-600 mr-2" />
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to NexTribe. These Terms and Conditions govern your use of
              our services and website. By accessing or using our services, you
              agree to be bound by these terms. If you do not agree to these
              terms, please refrain from using our services.
            </p>
          </section>

          {/* Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <ShieldIcon className="w-6 h-6 text-indigo-600 mr-2" />
              Services
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                NexTribe provides a platform for users to create and manage
                their own communities. We reserve the right to modify, suspend,
                or discontinue any part of our services at any time with notice.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service availability and uptime</li>
                <li>User account management</li>
                <li>Community creation and management</li>
                <li>Customer support and assistance</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-6 h-6 text-indigo-600 mr-2" />
              User Responsibilities
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>As a user of our services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use our services for lawful purposes only</li>
                <li>Not attempt to harm or disrupt our systems</li>
                <li>Respect the rights of other users</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Our use of your personal
              information is governed by our Privacy Policy, which is
              incorporated into these Terms by reference. By using our services,
              you consent to the collection and use of information as described
              in our Privacy Policy.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To the fullest extent permitted by law, NexTribe shall not be
              liable for any indirect, incidental, special, or consequential
              damages resulting from your use of our services. Our total
              liability shall not exceed the amount paid by you for our services
              in the preceding twelve months.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              our services constitutes acceptance of any modified terms.
            </p>
          </section>

          {/* Last Updated */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(2025, 0, 1).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
