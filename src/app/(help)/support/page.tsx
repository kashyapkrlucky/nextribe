"use client";
import Button from "@/components/ui/Button";
import InputWithIcon from "@/components/ui/InputWithIcon";
import {
  MailIcon,
  MessageCircleIcon,
  UserIcon,
  SendIcon,
  HeadphonesIcon,
  ClockIcon,
} from "lucide-react";
import { useState } from "react";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name, email, message);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SendIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Message Sent!
          </h2>
          <p className="text-gray-600">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-2 md:mb-4">
            <HeadphonesIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            How can we help you?
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or issues
            you may have.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 md:gap-8 bg-white rounded-xl shadow-xs border border-gray-100 p-4">
          <div className="mb-2 text-center">
            <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-2">
              Send us a message
            </h2>
            <p className="text-xs md:text-base text-gray-600">
              Fill out the form below and we&apos;ll get back to you soon.
            </p>
          </div>

          <form className="w-full space-y-2 md:space-y-6 p-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWithIcon
                icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                label="Your Name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="py-3"
              />
              <InputWithIcon
                icon={<MailIcon className="h-5 w-5 text-gray-400" />}
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircleIcon className="h-4 w-4 text-gray-400 inline mr-1" />
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about your question or issue..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                We&apos;ll respond within 24 hours
              </p>
              <Button
                type="submit"
                disabled={!name || !email || !message}
                size="md"
                icon={<SendIcon className="w-4 h-4" />}
                className="px-2"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
