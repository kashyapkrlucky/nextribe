import { useState } from "react";
import Button from "../ui/Button";
import { MailIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import TextareaLabelIcon from "../ui/TextareaLabelIcon";
import InputLabelIcon from "../ui/InputLabelIcon";

export default function HelpCenter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name, email, message);
  };
  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Help Center
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputLabelIcon
          icon={<UserIcon className="h-4 w-4" />}
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <InputLabelIcon
          icon={<MailIcon className="h-4 w-4" />}
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <TextareaLabelIcon
          icon={<MessageCircleIcon className="h-4 w-4" />}
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here"
        />
        <Button type="submit" disabled={!name || !email || !message}>
          Submit
        </Button>
      </form>
    </div>
  );
}
